// Gera os dados do comando "canvas": tarefas, prazos, entregas e o
// calendário das minhas disciplinas no Canvas.
//
// Uso:
//   npm run canvas                        cursos do semestre atual
//   npm run canvas -- --semestre 2026-1   outro semestre do calendário da PUC
//   npm run canvas -- --cursos            só lista os cursos que o token
//                                         enxerga (id, nome e o que o script
//                                         descobriu), sem gravar nada
//
// O script:
//   1. Lista os cursos publicados em que sou professor e fica com os do
//      semestre (ver classificar) que têm alguma tarefa publicada. Os de
//      IGNORAR (data/canvasCursos.js) ficam de fora; os de INCLUIR entram
//      sempre.
//   2. Descobre a disciplina, o campus e a turma de cada curso pelo código do
//      SGA (o "codigo" das aulas em data/horarioData.js), para usar as siglas
//      e as cores do "cal". Sem o código, o campus e o turno vêm do nome
//      ("... - Campus Lourdes - PLU - Noite - 2026/2") e a disciplina, de
//      outro curso com o mesmo nome de disciplina. CURSOS, em
//      data/canvasCursos.js, corrige ou completa.
//   3. Lê as tarefas publicadas de cada curso: prazo (e os prazos por turma,
//      quando mudam), abertura, fechamento, pontos e tipo de entrega.
//   4. Lê as entregas dos alunos ativos e soma por tarefa: no prazo,
//      atrasadas, faltando, dispensados, corrigidas e a corrigir.
//   5. Lê os eventos do calendário dos cursos no semestre (provas, aulas...).
//
// Token: CANVAS_TOKEN no ambiente ou no .env.local. No Canvas: Conta →
// Configurações → Integrações aprovadas → "+ Novo token de acesso". Nunca com
// VITE_ na frente: tudo que começa com VITE_ vai para o build e fica visível
// no navegador. O token só é usado aqui, na minha máquina, e só vai para o
// endereço do Canvas (as páginas seguintes também precisam ser dele).
//
// Privacidade: o portfólio é público. Nomes, e-mails, notas e a entrega de
// cada aluno só existem na memória deste script. O arquivo gerado guarda as
// tarefas (nome, prazo, link) e, de cada uma, quantos alunos entregaram: só
// contagens, nunca quem. Dos eventos, só título, horário, local e link (sem a
// descrição); horários marcados por alunos (agendamentos) ficam de fora.
//
// Sem dependências: fetch e o que vem com o Node.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = resolve(ROOT, "src/data/canvasData.js");
const ENV_LOCAL = resolve(ROOT, ".env.local");

const importar = (caminho) => import(pathToFileURL(resolve(ROOT, caminho)).href);
const { CANVAS_URL, CURSOS, INCLUIR, IGNORAR } = await importar("src/data/canvasCursos.js");
const { AULAS, CAMPI, DISCIPLINAS } = await importar("src/data/horarioData.js");
const { CALENDARIOS_PUC } = await importar("src/data/calendarioPuc.js");

const FUSO = "-03:00"; // Brasília, sem horário de verão
const FUSO_MS = 3 * 3_600_000;
const DIA_MS = 86_400_000;
const CONCORRENCIA = 3;
const POR_PAGINA = 100;
const PAGINAS_MAX = 100; // até 10.000 itens por consulta
const CONTEXTOS_POR_CONSULTA = 10; // limite do /calendar_events
const SEMESTRE_MAX_DIAS = 400; // período maior que isso não diz de que semestre é o curso

/* ---------------------------------------------------------------------
   Configuração: endereço, token e semestre
   --------------------------------------------------------------------- */

function lerDoEnvLocal(nome) {
  if (!existsSync(ENV_LOCAL)) return null;
  const linha = readFileSync(ENV_LOCAL, "utf8")
    .split(/\r?\n/)
    .find((l) => new RegExp(`^\\s*${nome}\\s*=`).test(l));
  const valor = linha
    ?.slice(linha.indexOf("=") + 1)
    .trim()
    .replace(/^["']|["']$/g, "");
  return valor || null;
}

function lerToken() {
  const doAmbiente = process.env.CANVAS_TOKEN?.trim();
  if (doAmbiente) return { token: doAmbiente, origem: "variável de ambiente CANVAS_TOKEN" };
  const doArquivo = lerDoEnvLocal("CANVAS_TOKEN");
  if (doArquivo) return { token: doArquivo, origem: ".env.local" };
  return { token: null, origem: null };
}

function lerEndereco() {
  const bruto = (process.env.CANVAS_URL ?? lerDoEnvLocal("CANVAS_URL") ?? CANVAS_URL).trim();
  const comProtocolo = /^https?:\/\//i.test(bruto) ? bruto : `https://${bruto}`;
  return new URL(comProtocolo).origin;
}

const BASE = lerEndereco();
const { token: TOKEN, origem: ORIGEM_TOKEN } = lerToken();

// Todos os semestres do calendário da PUC, do mais antigo para o mais novo
const SEMESTRES = Object.entries(CALENDARIOS_PUC)
  .flatMap(([ano, calendario]) =>
    (calendario.semestres ?? []).map((s, i) => ({ ano: Number(ano), numero: i + 1, ...s }))
  )
  .sort((a, b) => a.inicio.localeCompare(b.inicio));

const chaveDo = (s) => `${s.ano}-${s.numero}`;
const hojeEmBrasilia = () => new Date(Date.now() - FUSO_MS).toISOString().slice(0, 10);

// O semestre em andamento; nas férias, o próximo; sem próximo, o último
function escolherSemestre(pedido) {
  if (pedido) {
    const [ano, numero] = pedido.split(/[-./]/).map(Number);
    const achado = SEMESTRES.find((s) => s.ano === ano && s.numero === numero);
    if (!achado) {
      throw new Error(
        `O calendário da PUC não tem o semestre ${pedido}. Cadastre-o em src/data/calendarioPuc.js.`
      );
    }
    return achado;
  }
  const hoje = hojeEmBrasilia();
  const semestre =
    SEMESTRES.find((s) => s.inicio <= hoje && hoje <= s.fim) ??
    SEMESTRES.find((s) => s.inicio > hoje) ??
    SEMESTRES.at(-1);
  if (!semestre) throw new Error("Nenhum semestre em src/data/calendarioPuc.js.");
  return semestre;
}

/* ---------------------------------------------------------------------
   Canvas API
   --------------------------------------------------------------------- */

class ErroDoCanvas extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

// Ids como texto: os do Canvas podem passar do maior inteiro seguro do JS
const HEADERS = {
  Accept: "application/json+canvas-string-ids",
  "User-Agent": "joaopauloaramuni-portfolio-canvas",
  ...(TOKEN && { Authorization: `Bearer ${TOKEN}` }),
};

const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));

function resumoDoErro(corpo) {
  try {
    const json = JSON.parse(corpo);
    const mensagem = json.errors?.[0]?.message ?? json.errors?.[0] ?? json.message ?? json.error;
    if (typeof mensagem === "string") return mensagem;
  } catch {
    // não é JSON
  }
  return corpo.replace(/\s+/g, " ").trim().slice(0, 140) || "sem detalhes";
}

function montarUrl(caminho, params = {}) {
  const url = new URL(caminho, BASE);
  for (const [chave, valor] of Object.entries(params)) {
    if (valor === undefined || valor === null) continue;
    if (Array.isArray(valor)) valor.forEach((v) => url.searchParams.append(chave, v));
    else url.searchParams.set(chave, valor);
  }
  return url.href;
}

async function pedir(url) {
  for (let tentativa = 0; ; tentativa++) {
    let res;
    try {
      res = await fetch(url, { headers: HEADERS });
    } catch (error) {
      if (tentativa < 2) {
        await esperar(1000 * (tentativa + 1));
        continue;
      }
      throw new Error(`sem resposta de ${BASE} (${error.cause?.code ?? error.message})`);
    }
    if (res.ok) return res;

    const corpo = await res.text();
    // O Canvas avisa o limite com 403 "Rate Limit Exceeded" (ou 429)
    const limite = res.status === 429 || (res.status === 403 && /rate limit/i.test(corpo));
    if (limite && tentativa < 5) {
      await esperar(2000 * 2 ** tentativa);
      continue;
    }
    if (res.status >= 500 && tentativa < 2) {
      await esperar(1500);
      continue;
    }
    throw new ErroDoCanvas(res.status, `${res.status}: ${resumoDoErro(corpo)}`);
  }
}

// A próxima página vem no cabeçalho Link. O token só segue se ela for do
// mesmo Canvas.
function proximaPagina(link) {
  const proxima = link?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
  if (!proxima) return null;
  return new URL(proxima, BASE).origin === BASE ? proxima : null;
}

async function um(caminho, params) {
  return (await pedir(montarUrl(caminho, params))).json();
}

async function todos(caminho, params = {}) {
  const itens = [];
  let url = montarUrl(caminho, { per_page: POR_PAGINA, ...params });
  for (let i = 0; url && i < PAGINAS_MAX; i++) {
    const res = await pedir(url);
    const dados = await res.json();
    if (!Array.isArray(dados)) throw new Error(`resposta inesperada do Canvas em ${caminho}`);
    itens.push(...dados);
    url = proximaPagina(res.headers.get("link"));
  }
  return itens;
}

async function emParalelo(itens, limite, fn) {
  const resultados = new Array(itens.length);
  let proximo = 0;
  const trabalhador = async () => {
    while (proximo < itens.length) {
      const i = proximo++;
      resultados[i] = await fn(itens[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limite, itens.length) }, trabalhador));
  return resultados;
}

/* ---------------------------------------------------------------------
   Datas
   --------------------------------------------------------------------- */

// "2026-10-10T02:59:59Z" → "2026-10-09T23:59-03:00", o mesmo formato do turmasData.js
const isoBrasilia = (ms) => `${new Date(ms - FUSO_MS).toISOString().slice(0, 16)}${FUSO}`;
const emBrasilia = (iso) => (iso ? isoBrasilia(Date.parse(iso)) : null);

const limitesDo = (semestre) => ({
  inicioMs: Date.parse(`${semestre.inicio}T00:00:00${FUSO}`),
  fimMs: Date.parse(`${semestre.fim}T23:59:59${FUSO}`),
});

const diaSeguinte = (dia) => new Date(Date.parse(`${dia}T12:00:00Z`) + DIA_MS).toISOString().slice(0, 10);

/* ---------------------------------------------------------------------
   Cursos: de que semestre são e de que disciplina
   --------------------------------------------------------------------- */

const idsDe = (lista) => new Set((lista ?? []).map(String));
const IDS_INCLUIR = idsDe(INCLUIR);
const IDS_IGNORAR = idsDe(IGNORAR);

// "2026/2", "2026-2", "2026.02", "2/2026", "2º semestre de 2026"
const PADROES_DE_SEMESTRE = [
  { re: /(?<!\d)(20\d\d)\s*[-/._]\s*0?([12])(?!\d)/g, ano: 1, numero: 2 },
  { re: /(?<![\d/.-])0?([12])\s*º?\s*[/-]\s*(20\d\d)(?!\d)/g, ano: 2, numero: 1 },
  { re: /(?<!\d)([12])\s*[º°o]?\s*sem\w*\.?\s*(?:de\s+)?(20\d\d)(?!\d)/gi, ano: 2, numero: 1 },
];

function semestresCitados(textos) {
  const achados = new Set();
  const texto = textos.filter(Boolean).join(" | ");
  for (const { re, ano, numero } of PADROES_DE_SEMESTRE) {
    for (const m of texto.matchAll(re)) achados.add(`${m[ano]}-${Number(m[numero])}`);
  }
  return achados;
}

const textosDoCurso = (curso) => [
  curso.name,
  curso.course_code,
  curso.sis_course_id,
  ...(curso.sections ?? []).map((s) => s.name),
];

// { entra: true|false|null, motivo }. null = depende de ter tarefa ou evento
// no semestre (decidido depois de ler as tarefas e o calendário).
function classificar(curso, semestre) {
  const chave = chaveDo(semestre);
  if (IDS_IGNORAR.has(curso.id)) return { entra: false, motivo: "em IGNORAR" };
  if (IDS_INCLUIR.has(curso.id)) return { entra: true, motivo: "em INCLUIR" };

  const citados = semestresCitados([curso.term?.name, ...textosDoCurso(curso)]);
  if (citados.size) {
    return citados.has(chave)
      ? { entra: true, motivo: `o nome cita ${chave}` }
      : { entra: false, motivo: `é de ${[...citados].join(", ")}` };
  }

  const inicio = Date.parse(curso.start_at ?? curso.term?.start_at ?? "");
  const fim = Date.parse(curso.end_at ?? curso.term?.end_at ?? "");
  if (inicio && fim && (fim - inicio) / DIA_MS <= SEMESTRE_MAX_DIAS) {
    const { inicioMs, fimMs } = limitesDo(semestre);
    return inicio <= fimMs && fim >= inicioMs
      ? { entra: true, motivo: "o período do curso cai no semestre" }
      : { entra: false, motivo: "o período do curso é de outro semestre" };
  }
  return { entra: null, motivo: null };
}

// Código do SGA das aulas ("8148.1.01" = disciplina 8148, turma 1.01). Cada
// código uma vez: a mesma turma tem aula em mais de um dia.
const TURMAS_DO_SGA = [...new Map(AULAS.filter((a) => a.codigo).map((a) => [a.codigo, a])).values()];
const separado = (partes) => partes.join("\\D?");
const codigoCompleto = (codigo) => new RegExp(`(?<!\\d)${separado(codigo.split("."))}(?!\\d)`);
const numeroDaDisciplina = (codigo) => new RegExp(`(?<!\\d)${codigo.split(".")[0]}`);

// Campus e turno pelo nome do curso no Canvas:
// "... - Campus Coração Eucarístico - PMG - Noite - 2026/2"
const semLetraAntes = "(?<!\\p{L})";
const semLetraDepois = "(?!\\p{L})";
const palavra = (texto) => new RegExp(`${semLetraAntes}(?:${texto})${semLetraDepois}`, "iu");
const CAMPUS_NO_NOME = [
  ["coreu", palavra("cora[cç][aã]o eucar[ií]stico|pmg|coreu")],
  ["lourdes", palavra("lourdes|plu")],
];
const TURNO_NO_NOME = [
  ["manha", palavra("manh[ãa]")],
  ["tarde", palavra("tarde")],
  ["noite", palavra("noite")],
];
const achadoNoNome = (pares, nome) => pares.find(([, re]) => re.test(nome ?? ""))?.[0];

// Os campos que todas as aulas achadas têm em comum: duas turmas da mesma
// disciplina no mesmo curso do Canvas dão disciplina e campus, sem turma
function emComum(aulas) {
  const campos = {};
  for (const campo of ["disciplina", "campus", "turma"]) {
    const valores = new Set(aulas.map((a) => a[campo]));
    const [valor] = valores;
    if (valores.size === 1 && valor) campos[campo] = valor;
  }
  return campos;
}

function descobrirDisciplina(curso) {
  const manual = CURSOS[curso.id];
  const texto = textosDoCurso(curso).filter(Boolean).join(" | ");
  let achado = {};
  let como = null;

  const exatas = TURMAS_DO_SGA.filter((a) => codigoCompleto(a.codigo).test(texto));
  const daDisciplina = exatas.length
    ? []
    : TURMAS_DO_SGA.filter((a) => numeroDaDisciplina(a.codigo).test(texto));
  if (exatas.length) {
    achado = emComum(exatas);
    como = `código ${exatas.map((a) => a.codigo).join(", ")}`;
  } else if (daDisciplina.length) {
    achado = emComum(daDisciplina);
    como = `disciplina ${[...new Set(daDisciplina.map((a) => a.codigo.split(".")[0]))].join(", ")} do SGA`;
  }

  // Sem o campus no código do SGA, vale o do nome; o turno vem sempre do nome
  const campus = achado.campus ?? achadoNoNome(CAMPUS_NO_NOME, curso.name);
  const turno = achadoNoNome(TURNO_NO_NOME, curso.name);
  // Código do SGA que aparece no rótulo: o da turma ou, sem ele, o número da disciplina
  const sga = exatas.length
    ? exatas.map((a) => a.codigo).join(", ")
    : [...new Set(daDisciplina.map((a) => a.codigo.split(".")[0]))].join(", ") || undefined;

  // "nome" em CURSOS troca só o rótulo do terminal: o nome do Canvas continua
  const { nome: rotulo, ...doManual } = manual ?? {};
  const final = {
    ...achado,
    ...(campus && { campus }),
    ...(turno && { turno }),
    ...(sga && { sga }),
    ...doManual,
    ...(rotulo && { rotulo }),
  };
  const avisos = [];
  if (final.disciplina && !DISCIPLINAS[final.disciplina]) {
    avisos.push(`disciplina "${final.disciplina}" não existe em DISCIPLINAS (horarioData.js)`);
  }
  if (final.campus && !CAMPI[final.campus]) {
    avisos.push(`campus "${final.campus}" não existe em CAMPI (horarioData.js)`);
  }
  return { campos: final, como: manual ? "CURSOS" : como, avisos };
}

// "Trabalho Interdisciplinar: Aplicações Distribuídas - Engenharia de
// Software - Campus Lourdes..." → "trabalhointerdisciplinaraplicacoesdistribuidas"
const nomeDaDisciplina = (curso) =>
  (curso.name ?? "")
    .split(" - ")[0]
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

// Curso sem o código do SGA: herda a disciplina de outro curso com o mesmo
// nome de disciplina (se todos os que têm esse nome concordam)
function disciplinaPeloNome(classificados) {
  const porNome = new Map();
  for (const { curso, campos } of classificados) {
    if (!campos.disciplina) continue;
    const nome = nomeDaDisciplina(curso);
    porNome.set(nome, porNome.has(nome) && porNome.get(nome) !== campos.disciplina ? null : campos.disciplina);
  }
  for (const c of classificados) {
    if (c.campos.disciplina) continue;
    const disciplina = porNome.get(nomeDaDisciplina(c.curso));
    if (!disciplina) continue;
    c.campos = { ...c.campos, disciplina };
    c.como = c.como ?? `nome igual ao de outro curso de ${DISCIPLINAS[disciplina]?.sigla ?? disciplina}`;
  }

  // Sem código do SGA no curso: o número da disciplina das aulas dela naquele
  // campus (data/horarioData.js), se for um só
  for (const c of classificados) {
    const { disciplina, campus, sga } = c.campos;
    if (sga || !disciplina || !campus) continue;
    const numeros = new Set(
      TURMAS_DO_SGA.filter((a) => a.disciplina === disciplina && a.campus === campus).map((a) => a.codigo.split(".")[0])
    );
    if (numeros.size === 1) c.campos = { ...c.campos, sga: [...numeros][0] };
  }
}

// Ordem dos cursos: campus (na ordem de CAMPI), disciplina (pela sigla),
// turno e turma. Os sem disciplina vão para o fim, pelo nome.
const ORDEM_CAMPI = Object.keys(CAMPI);
const ORDEM_TURNOS = ["manha", "tarde", "noite"];
const posicao = (lista, valor) => {
  const i = lista.indexOf(valor);
  return i < 0 ? lista.length : i;
};
const siglaDe = (campos) => (campos.disciplina ? DISCIPLINAS[campos.disciplina]?.sigla ?? campos.disciplina : "\uffff");
const compararCursos = (a, b) =>
  posicao(ORDEM_CAMPI, a.campos.campus) - posicao(ORDEM_CAMPI, b.campos.campus) ||
  siglaDe(a.campos).localeCompare(siglaDe(b.campos)) ||
  posicao(ORDEM_TURNOS, a.campos.turno) - posicao(ORDEM_TURNOS, b.campos.turno) ||
  (a.campos.turma ?? "\uffff").localeCompare(b.campos.turma ?? "\uffff") ||
  (a.curso.name ?? "").localeCompare(b.curso.name ?? "");

/* ---------------------------------------------------------------------
   Tarefas e entregas
   --------------------------------------------------------------------- */

const ENTREGA_ONLINE = new Set([
  "online_upload",
  "online_text_entry",
  "online_url",
  "media_recording",
  "student_annotation",
]);

function tipoDaTarefa(tarefa) {
  const tipos = tarefa.submission_types ?? [];
  if (tipos.includes("online_quiz")) return "quiz";
  if (tipos.includes("discussion_topic")) return "discussao";
  if (tipos.includes("external_tool")) return "externa";
  if (tipos.some((t) => ENTREGA_ONLINE.has(t))) return "online";
  if (tipos.includes("on_paper")) return "papel";
  return "sem_entrega";
}

// Só estes tipos recebem entrega pelo Canvas
const COM_ENTREGA = new Set(["online", "quiz", "discussao", "externa"]);

// Prazos distintos da tarefa (o geral e os de cada turma), do mais cedo ao mais tarde
function prazosDa(tarefa) {
  const datas = [tarefa.due_at, ...(tarefa.all_dates ?? []).map((d) => d.due_at)]
    .filter(Boolean)
    .map((iso) => Date.parse(iso));
  return [...new Set(datas)].sort((a, b) => a - b);
}

function datasDa(tarefa) {
  return [
    tarefa.due_at,
    tarefa.unlock_at,
    tarefa.lock_at,
    ...(tarefa.all_dates ?? []).flatMap((d) => [d.due_at, d.unlock_at, d.lock_at]),
  ]
    .filter(Boolean)
    .map((iso) => Date.parse(iso));
}

function novaContagem() {
  return { alunos: 0, noPrazo: 0, atrasadas: 0, faltando: 0, dispensados: 0, corrigidas: 0, aCorrigir: 0 };
}

// Soma as entregas por tarefa, só dos alunos ativos. Quem é cada aluno não
// sai daqui.
function somarEntregas(entregas, alunosAtivos) {
  const porTarefa = new Map();
  for (const e of entregas) {
    if (!alunosAtivos.has(String(e.user_id))) continue;
    const id = String(e.assignment_id);
    const c = porTarefa.get(id) ?? novaContagem();
    porTarefa.set(id, c);
    c.alunos++;
    if (e.excused) {
      c.dispensados++;
    } else if (e.submitted_at) {
      if (e.late) c.atrasadas++;
      else c.noPrazo++;
      if (e.workflow_state === "graded") c.corrigidas++;
      else if (e.workflow_state === "submitted" || e.workflow_state === "pending_review") c.aCorrigir++;
    } else {
      c.faltando++;
    }
  }
  return porTarefa;
}

function tarefaParaOSite(tarefa, curso, contagens, totalDeAlunos) {
  const tipo = tipoDaTarefa(tarefa);
  const prazos = prazosDa(tarefa);
  let entregas = null;
  if (COM_ENTREGA.has(tipo) && contagens) {
    const c = contagens.get(tarefa.id) ?? novaContagem();
    // Sem registro de entrega para alguém da turma (tarefa nova): conta como faltando
    if (!tarefa.only_visible_to_overrides && c.alunos < totalDeAlunos) {
      c.faltando += totalDeAlunos - c.alunos;
      c.alunos = totalDeAlunos;
    }
    entregas = c;
  }
  return {
    id: tarefa.id,
    curso: curso.id,
    nome: tarefa.name?.trim() || "(sem nome)",
    url: tarefa.html_url ?? `${BASE}/courses/${curso.id}/assignments/${tarefa.id}`,
    prazo: prazos.length ? isoBrasilia(prazos[0]) : null,
    ...(prazos.length > 1 && { prazos: prazos.map(isoBrasilia) }),
    ...(tarefa.unlock_at && { abre: emBrasilia(tarefa.unlock_at) }),
    ...(tarefa.lock_at && { fecha: emBrasilia(tarefa.lock_at) }),
    pontos: tarefa.points_possible ?? null,
    tipo,
    ...(tarefa.group_category_id && { grupo: true }),
    entregas,
  };
}

/* ---------------------------------------------------------------------
   Calendário
   --------------------------------------------------------------------- */

const cursoDoContexto = (codigo) => codigo?.match(/^course_(\d+)$/)?.[1] ?? null;

async function lerEventos(cursos, semestre) {
  const brutos = [];
  for (let i = 0; i < cursos.length; i += CONTEXTOS_POR_CONSULTA) {
    const lote = cursos.slice(i, i + CONTEXTOS_POR_CONSULTA);
    brutos.push(
      ...(await todos("/api/v1/calendar_events", {
        type: "event",
        "context_codes[]": lote.map((c) => `course_${c.id}`),
        start_date: semestre.inicio,
        end_date: diaSeguinte(semestre.fim),
        "excludes[]": ["description", "assignment"],
      }))
    );
  }

  // Evento com horário diferente por turma: o Canvas manda o "pai" escondido
  // e um filho por turma. Ficam os filhos, com o curso do pai.
  const eventos = new Map();
  for (const evento of brutos) {
    const curso = cursoDoContexto(evento.effective_context_code ?? evento.context_code);
    const lista = evento.hidden && evento.child_events?.length ? evento.child_events : [evento];
    for (const e of lista) {
      if (e.workflow_state === "deleted" || e.appointment_group_id) continue;
      eventos.set(String(e.id), { ...e, curso: cursoDoContexto(e.effective_context_code) ?? curso });
    }
  }
  return [...eventos.values()].filter((e) => e.curso && e.start_at);
}

function eventoParaOSite(e) {
  const inicio = emBrasilia(e.start_at);
  const fim = emBrasilia(e.end_at);
  return {
    id: String(e.id),
    curso: e.curso,
    titulo: e.title?.trim() || "(sem título)",
    inicio,
    ...(fim && fim !== inicio && { fim }),
    ...(e.all_day && { diaInteiro: true }),
    ...(e.location_name?.trim() && { local: e.location_name.trim() }),
    ...(e.html_url && { url: e.html_url }),
  };
}

/* ---------------------------------------------------------------------
   Um curso
   --------------------------------------------------------------------- */

async function lerTarefas(curso) {
  const lista = await todos(`/api/v1/courses/${curso.id}/assignments`, {
    "include[]": ["all_dates"],
    order_by: "due_at",
  });
  return lista.filter((t) => t.published !== false);
}

// Alunos ativos (só os ids) e as entregas deles somadas por tarefa
async function lerEntregas(curso) {
  const alunos = await todos(`/api/v1/courses/${curso.id}/users`, {
    "enrollment_type[]": ["student"],
    "enrollment_state[]": ["active"],
  });
  const ativos = new Set(alunos.map((a) => String(a.id)));
  if (ativos.size === 0) return { totalDeAlunos: 0, ativos, contagens: new Map() };
  const entregas = await todos(`/api/v1/courses/${curso.id}/students/submissions`, {
    "student_ids[]": ["all"],
    enrollment_state: "active",
  });
  return { totalDeAlunos: ativos.size, ativos, contagens: somarEntregas(entregas, ativos) };
}

/* ---------------------------------------------------------------------
   Arquivo gerado
   --------------------------------------------------------------------- */

const chaveJs = (k) => (/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k));
const ehSimples = (v) => v === null || typeof v !== "object";

// Como JSON.stringify(…, 2), mas listas e objetos pequenos ficam numa linha
function emJs(valor, recuo = "") {
  const dentro = `${recuo}  `;
  if (Array.isArray(valor)) {
    if (valor.length === 0) return "[]";
    if (valor.every(ehSimples)) return `[${valor.map((v) => JSON.stringify(v)).join(", ")}]`;
    return `[\n${valor.map((v) => dentro + emJs(v, dentro)).join(",\n")},\n${recuo}]`;
  }
  if (valor && typeof valor === "object") {
    const entradas = Object.entries(valor).filter(([, v]) => v !== undefined);
    const linha = `{ ${entradas.map(([k, v]) => `${chaveJs(k)}: ${JSON.stringify(v)}`).join(", ")} }`;
    if (entradas.every(([, v]) => ehSimples(v)) && linha.length <= 120) return linha;
    return `{\n${entradas.map(([k, v]) => `${dentro}${chaveJs(k)}: ${emJs(v, dentro)}`).join(",\n")},\n${recuo}}`;
  }
  return JSON.stringify(valor);
}

async function dadosAnteriores() {
  if (!existsSync(OUTPUT)) return null;
  try {
    return await import(`${pathToFileURL(OUTPUT).href}?t=${Date.now()}`);
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------------
   Terminal
   --------------------------------------------------------------------- */

const SIGLA_CAMPUS = (campus) => (campus ? `${campus[0].toUpperCase()}${campus.slice(1)}` : null);
const NOME_DO_TURNO = { manha: "manhã", tarde: "tarde", noite: "noite" };

// "DIAW · Coreu · G1 · noite · 8218.1.01": o código do SGA diz qual é a turma
function rotuloDoCurso({ campos }, curso) {
  if (campos.rotulo) return campos.rotulo;
  if (!campos.disciplina) return curso.name;
  return [
    DISCIPLINAS[campos.disciplina]?.sigla ?? campos.disciplina,
    SIGLA_CAMPUS(campos.campus),
    campos.turma,
    NOME_DO_TURNO[campos.turno],
    campos.sga,
  ]
    .filter(Boolean)
    .join(" · ");
}

const plural = (n, um, varios) => `${n.toLocaleString("pt-BR")} ${n === 1 ? um : varios}`;
const dataCurta = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)} às ${iso.slice(11, 16)}`;

function quantoFalta(ms) {
  const horas = Math.round(ms / 3_600_000);
  if (horas < 1) return "em menos de 1 hora";
  if (horas < 48) return `em ${plural(horas, "hora", "horas")}`;
  return `em ${plural(Math.floor(ms / DIA_MS), "dia", "dias")}`;
}

/* ---------------------------------------------------------------------
   Principal
   --------------------------------------------------------------------- */

const OPCOES = ["--cursos", "--semestre"];

function lerArgumentos() {
  const args = process.argv.slice(2);
  const opcoes = { soListar: false, semestre: null };
  for (let i = 0; i < args.length; i++) {
    const [nome, valor] = args[i].toLowerCase().split("=");
    if (!OPCOES.includes(nome)) {
      throw new Error(`Opção desconhecida: ${args[i]}. Use --cursos ou --semestre AAAA-N.`);
    }
    if (nome === "--cursos") opcoes.soListar = true;
    if (nome === "--semestre") {
      opcoes.semestre = valor ?? args[++i];
      if (!opcoes.semestre) throw new Error("Faltou o semestre: --semestre 2026-2.");
    }
  }
  return opcoes;
}

async function main() {
  const opcoes = lerArgumentos();

  if (!TOKEN) {
    const soVite = existsSync(ENV_LOCAL) && /^\s*VITE_CANVAS_TOKEN\s*=/m.test(readFileSync(ENV_LOCAL, "utf8"));
    throw new Error(
      soVite
        ? "Achei VITE_CANVAS_TOKEN no .env.local. Tire o VITE_ da frente (CANVAS_TOKEN=...): " +
            "com VITE_, a chave pode ir para o build e ficar visível no navegador."
        : "Sem CANVAS_TOKEN. Crie o token no Canvas (Conta → Configurações → Integrações aprovadas → " +
            '"+ Novo token de acesso") e acrescente CANVAS_TOKEN=... no .env.local.'
    );
  }

  const semestre = escolherSemestre(opcoes.semestre);
  const chave = chaveDo(semestre);

  let eu;
  try {
    eu = await um("/api/v1/users/self");
  } catch (error) {
    if (error.status === 401) {
      throw new Error(
        `O Canvas recusou o token (${ORIGEM_TOKEN}): está vencido, foi apagado ou é de outro Canvas (${BASE}).`
      );
    }
    throw error;
  }
  console.log(`Canvas: ${BASE} · token de ${eu.name ?? eu.short_name ?? "?"} (${ORIGEM_TOKEN}).`);
  console.log(`Semestre ${chave}: ${semestre.inicio} a ${semestre.fim}.`);

  // 1. Cursos em que sou professor
  const todosOsCursos = await todos("/api/v1/courses", {
    enrollment_type: "teacher",
    enrollment_state: "active",
    "state[]": ["available"],
    "include[]": ["term", "sections"],
  });
  const cursos = todosOsCursos.map((c) => ({ ...c, id: String(c.id) }));
  const classificados = cursos.map((curso) => ({
    curso,
    ...classificar(curso, semestre),
    ...descobrirDisciplina(curso),
  }));
  disciplinaPeloNome(classificados);
  classificados.sort(compararCursos);

  // 2. Tarefas e calendário de quem entra ou ainda está em dúvida
  const candidatos = classificados.filter((c) => c.entra !== false);
  const { inicioMs, fimMs } = limitesDo(semestre);
  const falhas = new Map();
  await emParalelo(candidatos, CONCORRENCIA, async (c) => {
    try {
      c.tarefas = await lerTarefas(c.curso);
    } catch (error) {
      falhas.set(c.curso.id, `tarefas: ${error.message}`);
      c.tarefas = null;
    }
  });
  let eventos = [];
  try {
    eventos = await lerEventos(
      candidatos.map((c) => c.curso),
      semestre
    );
  } catch (error) {
    console.warn(`⚠ Não deu para ler o calendário (${error.message}). Os eventos ficam como estavam.`);
    eventos = null;
  }

  for (const c of candidatos.filter((c) => c.entra === null)) {
    const noSemestre = (ms) => ms >= inicioMs && ms <= fimMs;
    const temTarefa = (c.tarefas ?? []).some((t) => datasDa(t).some(noSemestre));
    const temEvento = (eventos ?? []).some((e) => e.curso === c.curso.id);
    c.entra = temTarefa || temEvento;
    c.motivo = c.entra ? "tem tarefa ou evento no semestre" : "nenhuma tarefa ou evento no semestre";
  }

  // Sem nenhuma tarefa publicada (a sala que o SGA cria ao lado da que eu
  // uso, por exemplo): fica de fora, a não ser que esteja em INCLUIR
  for (const c of candidatos) {
    if (c.entra && c.tarefas?.length === 0 && !IDS_INCLUIR.has(c.curso.id)) {
      c.entra = false;
      c.motivo = "nenhuma tarefa publicada";
    }
  }

  const doSemestre = classificados.filter((c) => c.entra);
  const fora = classificados.filter((c) => !c.entra);
  console.log(
    `Cursos em que você é professor: ${cursos.length} · ${plural(doSemestre.length, "entra", "entram")} ` +
      "(do semestre e com tarefas)."
  );

  if (opcoes.soListar) {
    for (const c of classificados) {
      const marca = c.entra ? "✓" : "·";
      const disciplina = c.campos.disciplina || c.campos.rotulo ? ` → ${rotuloDoCurso(c, c.curso)} (${c.como})` : "";
      console.log(`  ${marca} ${c.curso.id.padEnd(8)} ${c.curso.name}${disciplina}`);
      console.log(`      ${c.motivo}${c.avisos.length ? ` ⚠ ${c.avisos.join("; ")}` : ""}`);
    }
    console.log("\nNada foi gravado (--cursos). Para corrigir algo, edite src/data/canvasCursos.js.");
    return;
  }

  // 3. Entregas dos cursos do semestre
  await emParalelo(doSemestre, CONCORRENCIA, async (c) => {
    if (c.tarefas === null) return;
    try {
      Object.assign(c, await lerEntregas(c.curso));
    } catch (error) {
      // Sem permissão para ver as entregas (papel de designer, por exemplo):
      // as tarefas entram sem as contagens
      c.avisoEntregas = error.message;
      c.contagens = null;
      c.totalDeAlunos = null;
    }
  });

  const anterior = await dadosAnteriores();
  const agora = Date.now();
  const rotulo = (c) => rotuloDoCurso(c, c.curso);
  const saida = { cursos: [], tarefas: [], eventos: [] };

  for (const c of doSemestre) {
    const { curso, campos } = c;
    if (c.tarefas === null) {
      // Falhou agora: ficam os dados da última vez, se houver
      const antigo = anterior?.cursos?.find((x) => x.id === curso.id);
      if (antigo) {
        saida.cursos.push({ ...antigo, aviso: falhas.get(curso.id) });
        saida.tarefas.push(...anterior.tarefas.filter((t) => t.curso === curso.id));
      }
      console.log(`  ✗ ${rotulo(c)}: ${falhas.get(curso.id)}${antigo ? " (ficam os dados anteriores)" : ""}`);
      continue;
    }

    const tarefas = c.tarefas.map((t) => tarefaParaOSite(t, curso, c.contagens, c.totalDeAlunos ?? 0));
    saida.cursos.push({
      id: curso.id,
      nome: curso.name?.trim() || curso.course_code || `Curso ${curso.id}`,
      ...(curso.course_code && curso.course_code !== curso.name && { codigo: curso.course_code }),
      url: `${BASE}/courses/${curso.id}`,
      ...campos,
      alunos: c.totalDeAlunos ?? null,
      atualizadoEm: isoBrasilia(agora),
    });
    saida.tarefas.push(...tarefas);

    const qtdEventos = (eventos ?? []).filter((e) => e.curso === curso.id).length;
    const aCorrigir = tarefas.reduce((soma, t) => soma + (t.entregas?.aCorrigir ?? 0), 0);
    const detalhes = [
      plural(tarefas.length, "tarefa", "tarefas"),
      c.totalDeAlunos !== null && plural(c.totalDeAlunos, "aluno", "alunos"),
      qtdEventos && plural(qtdEventos, "evento", "eventos"),
      aCorrigir && `${aCorrigir} a corrigir`,
    ].filter(Boolean);
    const aviso = c.avisoEntregas ? ` ⚠ entregas: ${c.avisoEntregas}` : "";
    const como = campos.disciplina || campos.rotulo ? "" : " (disciplina não reconhecida: veja CURSOS em canvasCursos.js)";
    console.log(`  ✓ ${rotulo(c)}: ${detalhes.join(" · ")}${aviso}${como}`);
    c.avisos.forEach((a) => console.log(`    ⚠ ${a}`));
  }

  if (fora.length) {
    console.log(
      `  · Ficaram de fora: ${fora.length}, de outros semestres ou sem tarefas (npm run canvas -- --cursos mostra quais).`
    );
  }

  // Eventos: se o calendário falhou, ficam os da última vez
  const idsNoSite = new Set(saida.cursos.map((c) => c.id));
  saida.eventos = (eventos === null ? anterior?.eventos ?? [] : eventos.map(eventoParaOSite))
    .filter((e) => idsNoSite.has(e.curso))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
  saida.tarefas.sort((a, b) => (a.prazo ?? "9999").localeCompare(b.prazo ?? "9999"));

  // Alunos diferentes somando todos os cursos (quem está em dois cursos conta
  // uma vez). Só o número sai daqui.
  const alunosDistintos = new Set(doSemestre.flatMap((c) => [...(c.ativos ?? [])])).size;

  const info = {
    url: BASE,
    semestre: chave,
    inicio: semestre.inicio,
    fim: semestre.fim,
    geradoEm: isoBrasilia(agora),
    ...(doSemestre.every((c) => c.ativos) && { alunos: alunosDistintos }),
  };

  const arquivo = `// Gerado por "npm run canvas" (scripts/canvas.mjs) em ${info.geradoEm.slice(0, 10)}.
// Não edite à mão: rode o script de novo. Ajustes de cursos ficam em
// src/data/canvasCursos.js.
//
// Só tarefas, prazos e contagens: nada de nomes, e-mails ou notas de alunos.
// "entregas" soma os alunos ativos de cada tarefa: no prazo, atrasadas,
// faltando (ainda não entregaram), dispensados, corrigidas e a corrigir.
// Datas no horário de Brasília.

export const canvasInfo = ${emJs(info)};

export const cursos = ${emJs(saida.cursos)};

export const tarefas = ${emJs(saida.tarefas)};

export const eventos = ${emJs(saida.eventos)};
`;
  writeFileSync(OUTPUT, arquivo);

  const proxima = saida.tarefas
    .filter((t) => t.prazo && Date.parse(t.prazo) > agora)
    .sort((a, b) => Date.parse(a.prazo) - Date.parse(b.prazo))[0];
  if (proxima) {
    const curso = classificados.find((c) => c.curso.id === proxima.curso);
    console.log(
      `\nPróxima entrega: ${proxima.nome} (${rotulo(curso)}), ` +
        `${dataCurta(proxima.prazo)}, ${quantoFalta(Date.parse(proxima.prazo) - agora)}.`
    );
  }
  console.log(
    `\nGravado em src/data/canvasData.js: ${plural(saida.cursos.length, "curso", "cursos")}, ` +
      `${plural(saida.tarefas.length, "tarefa", "tarefas")}, ${plural(saida.eventos.length, "evento", "eventos")}.`
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
