// Total de horas lecionadas na PUC Minas, para a página "sobre" (funções
// puras, sem React, fáceis de testar).
//
// Os semestres já encerrados entram como um número fechado. O semestre em
// andamento (2º/2026) é somado dia a dia, a partir do horário do comando
// "cal" (data/horarioData.js), até o minuto de agora: a aula em andamento
// conta só a parte já dada.
//
// O que conta:
//   aulas das disciplinas, 1h40 cada, menos as que caem em feriado ou
//   recesso (calendário da PUC em data/feriados.js);
//   oficinas de Spring Boot (2h), DevLabs (2h) e DIW para CC (1h40) por
//   semana, nas 20 semanas.
// O que não conta: orientação de TCC (sem orientandos em 2026/2), reuniões
// da AES e aulões de AEDS I.
//
// Para um semestre novo: some o total do semestre que fechou em
// MINUTOS_ENCERRADOS e atualize SEMESTRE_ATUAL e horarioData.js.

import { AULAS } from "../data/horarioData";
import { diaEspecialEm } from "../data/feriados";
import { agoraEmBH, isoDoDia, minutosDe } from "./horario";

const DIA_MS = 24 * 60 * 60 * 1000;
const h = (horas, minutos = 0) => horas * 60 + minutos;

// Semestres encerrados (aulas sem feriados + orientação de TCC + oficinas):
//   2024/1  358h20
//   2024/2  333h20  (253h20 de aulas + 80h de oficinas)
//   2025/1  481h40  (321h40 + 80h de TCC + 80h de oficinas)
//   2025/2  493h20  (373h20 + 40h de TCC + 80h de oficinas)
//   2026/1  496h40  (416h40 + 80h de oficinas)
export const MINUTOS_ENCERRADOS =
  h(358, 20) + h(333, 20) + h(481, 40) + h(493, 20) + h(496, 40); // 2163h20

// 2º semestre de 2026: 20 semanas a partir de 3/8 (segunda), até 18/12
export const SEMESTRE_ATUAL = { inicio: "2026-08-03", semanas: 20 };
export const ULTIMO_DIA = "2026-12-22"; // término das aulas no calendário

// Fora da conta
const IGNORADAS = new Set(["tcc2", "aes", "aeds1"]);

// Oficinas: quanto vale cada uma por semana. Não seguem o calendário de
// feriados (contam as 20 semanas cheias).
const OFICINAS = { spring: h(2), devlabs: h(2), oficina_diw: h(1, 40) };

const ITENS = AULAS.filter((aula) => !IGNORADAS.has(aula.disciplina)).map((aula) => {
  const inicio = minutosDe(aula.inicio);
  const fim = minutosDe(aula.fim);
  const oficina = aula.disciplina in OFICINAS;
  return { dia: aula.dia, inicio, fim, oficina, vale: oficina ? OFICINAS[aula.disciplina] : fim - inicio };
});

// Minutos dados numa data até "ateMinuto" do dia (1440 = o dia inteiro)
function minutosNaData(diaMs, ateMinuto) {
  const diaSemana = new Date(diaMs).getUTCDay();
  const feriado = Boolean(diaEspecialEm(isoDoDia(diaMs)));
  return ITENS.reduce((total, item) => {
    if (item.dia !== diaSemana || (feriado && !item.oficina)) return total;
    const feito = Math.min(Math.max((ateMinuto - item.inicio) / (item.fim - item.inicio), 0), 1);
    return total + item.vale * feito;
  }, 0);
}

// Minutos do semestre atual dados até "agora" (agoraEmBH)
export function minutosDoSemestre(agora) {
  const inicioMs = Date.parse(`${SEMESTRE_ATUAL.inicio}T00:00:00Z`);
  const fimMs = inicioMs + (SEMESTRE_ATUAL.semanas * 7 - 1) * DIA_MS;
  let total = 0;
  for (let diaMs = inicioMs; diaMs <= Math.min(agora.diaMs, fimMs); diaMs += DIA_MS) {
    total += minutosNaData(diaMs, diaMs < agora.diaMs ? 1440 : agora.minutos);
  }
  return Math.floor(total);
}

// Total lecionado na PUC até agora, em minutos
export const minutosLecionados = (agora = agoraEmBH()) =>
  MINUTOS_ENCERRADOS + minutosDoSemestre(agora);

// Total quando o semestre acabar (2711h40min)
export const MINUTOS_TOTAL_SEMESTRE = minutosLecionados({
  diaMs: Date.parse(`${ULTIMO_DIA}T00:00:00Z`),
  minutos: 1440,
});

// 162700 → "2.711h40min" (pt-BR) ou "2,711h40min" (en)
export function formatarTotal(minutos, idioma = "pt-BR") {
  const horas = new Intl.NumberFormat(idioma).format(Math.floor(minutos / 60));
  return `${horas}h${String(minutos % 60).padStart(2, "0")}min`;
}
