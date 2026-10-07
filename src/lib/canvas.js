// Contas do comando "canvas" sobre os dados do npm run canvas
// (data/canvasData.js). Sem React, para dar para testar sozinho.
//
// Os prazos e as contagens regressivas usam a hora de agora (o visitante vê
// sempre quanto falta de verdade); as entregas são as da última vez que o
// script rodou (canvasInfo.geradoEm).

const MINUTO_MS = 60_000;
const HORA_MS = 60 * MINUTO_MS;
const DIA_MS = 24 * HORA_MS;
const FUSO_MS = 3 * HORA_MS; // Brasília, sem horário de verão

// Quando uma tarefa merece destaque
export const LIMITES = {
  urgenteHoras: 24, // vence em até 24 horas
  pertoDias: 3, // vence em até 3 dias
  semanaDias: 7, // "vence nos próximos 7 dias" do resumo
  vencidasVisiveis: 6, // tarefas vencidas antes do "mostrar todas"
  agendaDias: 21, // dias da agenda antes do "até o fim do semestre"
};

// "2026-10-09" de um instante, no horário de Brasília
export const diaDe = (ms) => new Date(ms - FUSO_MS).toISOString().slice(0, 10);

// Meio-dia UTC do dia "AAAA-MM-DD": fica no mesmo dia em qualquer fuso
export const meioDia = (dia) => Date.parse(`${dia}T12:00:00Z`);

export const somaDias = (dia, n) => diaDe(meioDia(dia) + FUSO_MS + n * DIA_MS);

// Dias entre hoje e a data, no calendário de Brasília (0 = hoje, 1 = amanhã)
export const diasAte = (dia, agora) => Math.round((meioDia(dia) - meioDia(diaDe(agora))) / DIA_MS);

/* ---------------------------------------------------------------------
   Tarefas
   --------------------------------------------------------------------- */

// O prazo que vale agora: com prazos diferentes por turma, o próximo que
// ainda não passou (ou o último, se todos passaram)
export function prazoAtual(tarefa, agora) {
  if (tarefa.prazos?.length) {
    const datas = tarefa.prazos.map((iso) => Date.parse(iso));
    return datas.find((ms) => ms >= agora) ?? datas.at(-1);
  }
  return tarefa.prazo ? Date.parse(tarefa.prazo) : null;
}

// "aberta" (prazo pela frente), "vencida" ou "sem_prazo"
export function situacaoDe(tarefa, agora) {
  const prazo = prazoAtual(tarefa, agora);
  if (prazo === null) return "sem_prazo";
  return prazo >= agora ? "aberta" : "vencida";
}

// Próximo instante, a partir de agora, em que alguma tarefa vence (ou troca
// de prazo, nas que têm mais de um): o painel do "canvas" se atualiza nele, e
// a próxima entrega troca no segundo do prazo, sem esperar o relógio de 30 s
export function proximoPrazo(tarefas, agora) {
  let proximo = null;
  for (const tarefa of tarefas) {
    const prazos = tarefa.prazos?.length ? tarefa.prazos : tarefa.prazo ? [tarefa.prazo] : [];
    for (const iso of prazos) {
      const ms = Date.parse(iso);
      if (ms >= agora && (proximo === null || ms < proximo)) proximo = ms;
    }
  }
  return proximo;
}

// Quanto falta: "urgente" (até 24 h), "perto" (até 3 dias), "semana" (até 7)
// ou "longe". Vencida ou sem prazo: null.
export function urgenciaDe(tarefa, agora) {
  const prazo = prazoAtual(tarefa, agora);
  if (prazo === null || prazo < agora) return null;
  const falta = prazo - agora;
  if (falta <= LIMITES.urgenteHoras * HORA_MS) return "urgente";
  if (falta <= LIMITES.pertoDias * DIA_MS) return "perto";
  if (falta <= LIMITES.semanaDias * DIA_MS) return "semana";
  return "longe";
}

// { dias, horas, minutos } de um intervalo (sempre positivo)
export function partesDoTempo(ms) {
  const total = Math.max(0, Math.floor(Math.abs(ms) / MINUTO_MS));
  return {
    dias: Math.floor(total / (24 * 60)),
    horas: Math.floor((total % (24 * 60)) / 60),
    minutos: total % 60,
  };
}

// Tarefas com prazo pela frente (a que vence primeiro no topo), vencidas
// (a mais recente no topo) e sem prazo (na ordem do nome)
export function separarTarefas(tarefas, agora) {
  const comPrazo = tarefas.map((t) => ({ t, prazo: prazoAtual(t, agora) }));
  const abertas = comPrazo
    .filter(({ prazo }) => prazo !== null && prazo >= agora)
    .sort((a, b) => a.prazo - b.prazo)
    .map(({ t }) => t);
  const vencidas = comPrazo
    .filter(({ prazo }) => prazo !== null && prazo < agora)
    .sort((a, b) => b.prazo - a.prazo)
    .map(({ t }) => t);
  const semPrazo = tarefas
    .filter((t) => prazoAtual(t, agora) === null)
    .sort((a, b) => a.nome.localeCompare(b.nome));
  return { abertas, vencidas, semPrazo };
}

export const proximaTarefa = (tarefas, agora) => separarTarefas(tarefas, agora).abertas[0] ?? null;

/* ---------------------------------------------------------------------
   Entregas
   --------------------------------------------------------------------- */

export const entreguesDe = (e) => (e ? e.noPrazo + e.atrasadas : 0);

// Alunos que devem entregar (os dispensados não contam)
export const esperadosDe = (e) => (e ? Math.max(0, e.alunos - e.dispensados) : 0);

// Fatia que entregou, de 0 a 1 (null sem alunos ou sem entrega pelo Canvas)
export function taxaDe(e) {
  const esperados = esperadosDe(e);
  return esperados ? entreguesDe(e) / esperados : null;
}

const soma = (valores) => valores.reduce((total, n) => total + (n ?? 0), 0);

// Taxa de entrega das tarefas que já venceram, somando os alunos de todas
function taxaDasVencidas(tarefas, agora) {
  const vencidas = tarefas.filter((t) => t.entregas && situacaoDe(t, agora) === "vencida");
  const esperados = soma(vencidas.map((t) => esperadosDe(t.entregas)));
  return esperados ? soma(vencidas.map((t) => entreguesDe(t.entregas))) / esperados : null;
}

/* ---------------------------------------------------------------------
   Resumo
   --------------------------------------------------------------------- */

export function totaisDe(cursos, tarefas, agora) {
  const { abertas, vencidas } = separarTarefas(tarefas, agora);
  const limiteSemana = agora + LIMITES.semanaDias * DIA_MS;
  return {
    cursos: cursos.length,
    alunos: soma(cursos.map((c) => c.alunos)),
    tarefas: tarefas.length,
    abertas: abertas.length,
    vencidas: vencidas.length,
    semana: abertas.filter((t) => prazoAtual(t, agora) <= limiteSemana).length,
    aCorrigir: soma(tarefas.map((t) => t.entregas?.aCorrigir)),
    taxa: taxaDasVencidas(tarefas, agora),
  };
}

// Uma linha da tabela de cursos do resumo
export function resumoDoCurso(curso, tarefas, agora) {
  const doCurso = tarefas.filter((t) => t.curso === curso.id);
  const { abertas, vencidas } = separarTarefas(doCurso, agora);
  return {
    curso,
    tarefas: doCurso.length,
    vencidas: vencidas.length,
    proxima: abertas[0] ?? null,
    aCorrigir: soma(doCurso.map((t) => t.entregas?.aCorrigir)),
    taxa: taxaDasVencidas(doCurso, agora),
  };
}

/* ---------------------------------------------------------------------
   Agenda
   --------------------------------------------------------------------- */

// Dias de hoje até `ate` ("AAAA-MM-DD"), cada um com as tarefas que vencem
// nele, os eventos do Canvas e o dia especial do calendário da PUC
// (feriado, recesso). Dias vazios ficam de fora.
//   [{ dia, itens: [{ tipo: "tarefa" | "evento", hora, ... }], especial }]
export function agendaDe({ tarefas, eventos, agora, ate, especialEm }) {
  const hoje = diaDe(agora);
  const dias = new Map();
  const doDia = (dia) => {
    if (!dias.has(dia)) dias.set(dia, { dia, itens: [], especial: especialEm?.(dia) ?? null });
    return dias.get(dia);
  };

  tarefas.forEach((tarefa) => {
    const datas = tarefa.prazos ?? (tarefa.prazo ? [tarefa.prazo] : []);
    datas.forEach((iso) => {
      const dia = iso.slice(0, 10);
      if (dia < hoje || dia > ate) return;
      doDia(dia).itens.push({ tipo: "tarefa", hora: iso.slice(11, 16), ms: Date.parse(iso), tarefa });
    });
  });

  eventos.forEach((evento) => {
    const inicio = evento.inicio.slice(0, 10);
    const fim = (evento.fim ?? evento.inicio).slice(0, 10);
    // Evento de vários dias aparece em cada um (o de dia inteiro termina à
    // meia-noite do dia seguinte)
    const ultimo = evento.diaInteiro && fim > inicio ? somaDias(fim, -1) : fim;
    for (let dia = inicio; dia <= ultimo; dia = somaDias(dia, 1)) {
      if (dia < hoje || dia > ate) continue;
      const hora = evento.diaInteiro || dia !== inicio ? null : evento.inicio.slice(11, 16);
      doDia(dia).itens.push({ tipo: "evento", hora, ms: Date.parse(evento.inicio), evento });
    }
  });

  // Feriados e recessos do calendário da PUC, mesmo sem tarefa no dia
  if (especialEm) {
    for (let dia = hoje; dia <= ate; dia = somaDias(dia, 1)) {
      if (especialEm(dia)) doDia(dia);
    }
  }

  // Dia inteiro primeiro, depois pela hora
  const ordem = (item) => (item.hora === null ? "" : item.hora);
  return [...dias.values()]
    .map((d) => ({ ...d, itens: d.itens.sort((a, b) => ordem(a).localeCompare(ordem(b)) || a.ms - b.ms) }))
    .sort((a, b) => a.dia.localeCompare(b.dia));
}

/* ---------------------------------------------------------------------
   Cursos: rótulo e ordem
   --------------------------------------------------------------------- */

// Ordem padrão da tabela de cursos: campus (na ordem de `campi`),
// disciplina (pela sigla), a próxima entrega (a mais próxima primeiro;
// sem entrega pela frente vai para o fim), turno e turma
const ORDEM_TURNOS = ["manha", "tarde", "noite"];
const posicao = (lista, valor) => {
  const i = lista.indexOf(valor);
  return i < 0 ? lista.length : i;
};

export function compararCursos({ campi, siglaDe, agora }) {
  const sigla = (c) => (c.disciplina ? siglaDe(c.disciplina) : "￿");
  const prazo = (linha) => (linha.proxima ? prazoAtual(linha.proxima, agora) : Infinity);
  return (a, b) =>
    posicao(campi, a.curso.campus) - posicao(campi, b.curso.campus) ||
    sigla(a.curso).localeCompare(sigla(b.curso)) ||
    prazo(a) - prazo(b) ||
    posicao(ORDEM_TURNOS, a.curso.turno) - posicao(ORDEM_TURNOS, b.curso.turno) ||
    (a.curso.turma ?? "").localeCompare(b.curso.turma ?? "") ||
    a.curso.nome.localeCompare(b.curso.nome);
}
