// Funções puras do comando "cal" (sem React, fáceis de testar).
//
// Tudo é calculado no fuso de Belo Horizonte (FUSO_HORARIO), não no do
// navegador: um aluno abrindo o site de fora do Brasil vê a mesma agenda.
// Datas de calendário são tratadas como meia-noite UTC ("dia" puro, sem
// hora), assim somar dias nunca esbarra em horário de verão.

import { AULAS, FUSO_HORARIO } from "../data/horarioData";
import { diaEspecialEm, ehLetivo, SEMESTRES } from "../data/feriados";

const DIA_MS = 24 * 60 * 60 * 1000;

export const minutosDe = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const isoDoDia = (diaMs) => new Date(diaMs).toISOString().slice(0, 10);

const formatoSP = new Intl.DateTimeFormat("en-US", {
  timeZone: FUSO_HORARIO,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
});

// "Agora" em BH: { diaMs, ano, mes (1-12), dia, diaSemana (0-6), minutos }
export function agoraEmBH(data = new Date()) {
  const p = Object.fromEntries(
    formatoSP.formatToParts(data).map(({ type, value }) => [type, Number(value)])
  );
  const diaMs = Date.UTC(p.year, p.month - 1, p.day);
  return {
    diaMs,
    ano: p.year,
    mes: p.month,
    dia: p.day,
    diaSemana: new Date(diaMs).getUTCDay(),
    minutos: p.hour * 60 + p.minute,
  };
}

// Aulas de um dia da semana, em ordem de início
export const aulasDoDiaSemana = (diaSemana) =>
  AULAS.filter((aula) => aula.dia === diaSemana).sort(
    (a, b) => minutosDe(a.inicio) - minutosDe(b.inicio)
  );

// Aulas que de fato acontecem numa data: feriado, recesso e dias fora do
// semestre letivo não têm aula
export function aulasNaData(diaMs) {
  const iso = isoDoDia(diaMs);
  if (diaEspecialEm(iso) || !ehLetivo(iso)) return [];
  return aulasDoDiaSemana(new Date(diaMs).getUTCDay());
}

// "passada", "atual" ou "futura", comparando com o agora (mesmo dia)
export function statusDaAula(aula, diaMs, agora) {
  if (diaMs < agora.diaMs) return "passada";
  if (diaMs > agora.diaMs) return "futura";
  if (agora.minutos >= minutosDe(aula.fim)) return "passada";
  if (agora.minutos >= minutosDe(aula.inicio)) return "atual";
  return "futura";
}

// Semestre de hoje: { numero, inicio, fim, semana } ou, nas férias,
// { proximo } com o semestre seguinte (ou null se não houver calendário)
export function semestreAtual(agora) {
  const hoje = isoDoDia(agora.diaMs);
  const atual = SEMESTRES.find((s) => hoje >= s.inicio && hoje <= s.fim);
  if (atual) {
    const inicioMs = Date.parse(`${atual.inicio}T00:00:00Z`);
    const semana = Math.floor((agora.diaMs - inicioMs) / (7 * DIA_MS)) + 1;
    return { ...atual, semana };
  }
  return { proximo: SEMESTRES.find((s) => s.inicio > hoje) ?? null };
}

// Próxima aula que ainda não começou (procura até 12 semanas à frente,
// o bastante para atravessar as férias de fim de ano)
export function proximaAula(agora) {
  for (let k = 0; k < 84; k++) {
    const diaMs = agora.diaMs + k * DIA_MS;
    const aula = aulasNaData(diaMs).find(
      (a) => k > 0 || minutosDe(a.inicio) > agora.minutos
    );
    if (aula) {
      return {
        aula,
        diaMs,
        faltam: k * 1440 + minutosDe(aula.inicio) - agora.minutos,
      };
    }
  }
  return null;
}

// Segunda-feira da semana mostrada: no fim de semana, já mostra a próxima
export function segundaDaSemana(agora) {
  const { diaSemana, diaMs } = agora;
  const desloc = diaSemana === 0 ? 1 : diaSemana === 6 ? 2 : 1 - diaSemana;
  return diaMs + desloc * DIA_MS;
}

export const somarDias = (diaMs, dias) => diaMs + dias * DIA_MS;

// Faixas de horário distintas (linhas da grade), em ordem
export function faixasDeHorario() {
  const faixas = new Map();
  AULAS.forEach(({ inicio, fim }) => faixas.set(`${inicio}-${fim}`, { inicio, fim }));
  return [...faixas.values()].sort(
    (a, b) => minutosDe(a.inicio) - minutosDe(b.inicio) || minutosDe(a.fim) - minutosDe(b.fim)
  );
}

// Total da semana: quantidade de aulas e minutos em sala
export const resumoDaSemana = () => ({
  aulas: AULAS.length,
  minutos: AULAS.reduce((total, a) => total + minutosDe(a.fim) - minutosDe(a.inicio), 0),
});

// Total em horas, sem virar dias: 2060 → "34h20"
export function formatarHoras(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

// 25 → "25min" · 1150 → "19h10" · 3000 → "2d 2h"
export function formatarDuracao(minutos) {
  if (minutos < 60) return `${minutos}min`;
  if (minutos < 1440) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
  }
  const d = Math.floor(minutos / 1440);
  const h = Math.floor((minutos % 1440) / 60);
  return h ? `${d}d ${h}h` : `${d}d`;
}
