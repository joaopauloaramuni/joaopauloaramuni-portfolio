// Dias sem aula do comando "cal": feriados, recessos e férias.
//
// Quando o ano tem calendário da PUC em data/calendarioPuc.js, ele manda:
// feriados, recessos escolares e semestres letivos vêm de lá. Para os outros
// anos, os feriados nacionais e de BH são calculados (os móveis saem da
// Páscoa) só para aparecerem no mês; as aulas desse ano só são marcadas
// depois que o calendário dele for cadastrado.
// O nome de cada dia vem do i18n: cal.feriados.<chave>.

import { CALENDARIOS_PUC } from "./calendarioPuc";

const DIA_MS = 24 * 60 * 60 * 1000;
const isoDe = (ms) => new Date(ms).toISOString().slice(0, 10);
const msDe = (iso) => Date.parse(`${iso}T00:00:00Z`);

// Se dois tipos caem no mesmo dia (Natal dentro do recesso), vale o maior
const PRIORIDADE = { feriado: 4, recesso: 3, recesso_docente: 2, ferias: 1 };

const FIXOS = [
  ["01-01", "confraternizacao"],
  ["04-21", "tiradentes"],
  ["05-01", "trabalho"],
  ["08-15", "assuncao"], // BH
  ["09-07", "independencia"],
  ["10-12", "aparecida"],
  ["11-02", "finados"],
  ["11-15", "republica"],
  ["11-20", "consciencia_negra"],
  ["12-08", "imaculada"], // BH
  ["12-25", "natal"],
];

// Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher, calendário gregoriano)
function pascoa(ano) {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return Date.UTC(ano, mes - 1, dia);
}

function calculados(ano) {
  const feriado = (chave) => ({ tipo: "feriado", chave });
  const mapa = new Map(FIXOS.map(([mmdd, chave]) => [`${ano}-${mmdd}`, feriado(chave)]));
  const p = pascoa(ano);
  mapa.set(isoDe(p - 48 * DIA_MS), feriado("carnaval"));
  mapa.set(isoDe(p - 47 * DIA_MS), feriado("carnaval"));
  mapa.set(isoDe(p - 2 * DIA_MS), feriado("sexta_santa"));
  mapa.set(isoDe(p + 60 * DIA_MS), feriado("corpus_christi"));
  return mapa;
}

function daPuc({ dias }) {
  const mapa = new Map();
  dias.forEach(({ de, ate = de, tipo, chave }) => {
    for (let ms = msDe(de); ms <= msDe(ate); ms += DIA_MS) {
      const iso = isoDe(ms);
      const atual = mapa.get(iso);
      if (!atual || PRIORIDADE[tipo] > PRIORIDADE[atual.tipo]) mapa.set(iso, { tipo, chave });
    }
  });
  return mapa;
}

const cache = new Map();

// Map "AAAA-MM-DD" → { tipo, chave }
export function diasEspeciaisDoAno(ano) {
  if (!cache.has(ano)) {
    const puc = CALENDARIOS_PUC[ano];
    cache.set(ano, puc ? daPuc(puc) : calculados(ano));
  }
  return cache.get(ano);
}

// { tipo, chave } do dia, ou undefined se for um dia comum
export const diaEspecialEm = (iso) => diasEspeciaisDoAno(Number(iso.slice(0, 4))).get(iso);

// Semestres letivos conhecidos, em ordem: [{ ano, numero, inicio, fim }]
export const SEMESTRES = Object.entries(CALENDARIOS_PUC).flatMap(([ano, { semestres }]) =>
  semestres.map((s, i) => ({ ano: Number(ano), numero: i + 1, ...s }))
);

// Dentro de um semestre letivo? Num ano sem calendário da PUC não dá para
// saber quando as aulas começam (em janeiro, por exemplo, ainda são férias),
// então ele só conta como letivo se não houver calendário nenhum cadastrado.
export function ehLetivo(iso) {
  const ano = Number(iso.slice(0, 4));
  if (!CALENDARIOS_PUC[ano]) return SEMESTRES.length === 0;
  return SEMESTRES.some((s) => iso >= s.inicio && iso <= s.fim);
}
