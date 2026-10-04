// Horários de aula do comando "cal" (2º semestre de 2026).
//
// dia: 1 = segunda ... 5 = sexta (mesmo número do Date.getDay())
// campus: chave de CAMPI (define a letra e a cor na grade)
// disciplina: chave de DISCIPLINAS (nome completo vem do i18n:
//   cal.disciplinas.<chave>)
// turma: opcional (G1, G2, G3)
// curso: opcional ("CC" = Ciência da Computação)
// link: opcional; se existir, a aula vira link na grade e na agenda
// codigo: opcional, código da turma no SGA (aparece ao passar o mouse)
// local: opcional, onde é a aula (coluna "local" do cal --hoje e linha
//   extra na grade). Presencial: { predio, edificio?, andar, espaco?, sala }
//   Online: { online: "Teams" }
//
// Para trocar de semestre, basta editar a lista AULAS. Feriados, recessos e
// datas do semestre letivo vêm do calendário da PUC (data/calendarioPuc.js).

export const FUSO_HORARIO = "America/Sao_Paulo";

// Ordem = ordem da legenda. "cor" é o nome do token em theme.css.
export const CAMPI = {
  coreu: { sigla: "C", cor: "--cal-coreu" },
  lourdes: { sigla: "L", cor: "--cal-lourdes" },
  oficinas: { sigla: "O", cor: "--cal-oficinas" },
  teams: { sigla: "T", cor: "--cal-teams" },
};

// Sigla curta usada na grade da semana (o nome completo fica no i18n)
export const DISCIPLINAS = {
  diaw: { sigla: "DIAW" },
  diw: { sigla: "DIW" },
  ti5: { sigla: "TI:V" },
  ti2: { sigla: "TI:II" },
  tcc2: { sigla: "TCC II" },
  aes: { sigla: "AES/CTOs" },
  spring: { sigla: "Spring" },
  devlabs: { sigla: "DevLabs" },
  aeds1: { sigla: "AEDS I" },
  oficinas: { sigla: "Oficinas" },
};

// Prédios mais usados (só para não repetir o nome do edifício)
const FERNANDA = { predio: 4, edificio: "Ed. Fernanda" }; // Lourdes

export const AULAS = [
  // Segunda
  {
    dia: 1, inicio: "07:00", fim: "08:40", campus: "coreu", disciplina: "diaw", turma: "G1",
    codigo: "8148.1.01",
    local: { predio: 34, andar: 2, espaco: "Laboratório de Informática 04", sala: "210" },
  },
  { dia: 1, inicio: "15:20", fim: "17:00", campus: "oficinas", disciplina: "spring" },
  {
    dia: 1, inicio: "17:10", fim: "18:50", campus: "lourdes", disciplina: "ti5",
    codigo: "0492.1.03",
    local: { ...FERNANDA, andar: 4, sala: "403" },
  },
  {
    dia: 1, inicio: "19:00", fim: "20:40", campus: "lourdes", disciplina: "diaw", turma: "G1",
    codigo: "7555.1.01",
    local: { ...FERNANDA, andar: 14, espaco: "Laboratório de Informática C", sala: "1403" },
  },

  // Terça
  {
    dia: 2, inicio: "08:50", fim: "10:30", campus: "coreu", disciplina: "diw", turma: "G1", curso: "CC",
    codigo: "6162.1.01",
    local: { predio: 34, andar: 2, espaco: "Laboratório de Informática 03", sala: "208" },
  },
  {
    dia: 2, inicio: "15:20", fim: "17:00", campus: "teams", disciplina: "aes",
    local: { online: "Teams" },
  },
  {
    dia: 2, inicio: "17:10", fim: "18:50", campus: "coreu", disciplina: "diaw", turma: "G1",
    codigo: "8218.1.01",
    local: { predio: 34, andar: 1, espaco: "Laboratório de Informática 08", sala: "114" },
  },
  {
    dia: 2, inicio: "19:00", fim: "20:40", campus: "coreu", disciplina: "ti5",
    codigo: "6904.1.03",
    local: { predio: 43, andar: 2, sala: "205" },
  },
  {
    dia: 2, inicio: "20:50", fim: "22:30", campus: "coreu", disciplina: "diaw", turma: "G3",
    codigo: "8218.1.03",
    local: { predio: 34, andar: 1, espaco: "Laboratório de Informática 08", sala: "114" },
  },

  // Quarta
  { dia: 3, inicio: "07:00", fim: "08:40", campus: "lourdes", disciplina: "tcc2" },
  {
    dia: 3, inicio: "10:40", fim: "12:20", campus: "lourdes", disciplina: "diaw", turma: "G2",
    codigo: "7546.1.02",
    local: { ...FERNANDA, andar: 14, espaco: "Laboratório de Informática C", sala: "1403" },
  },
  { dia: 3, inicio: "15:00", fim: "17:00", campus: "oficinas", disciplina: "devlabs" },
  {
    dia: 3, inicio: "17:10", fim: "18:50", campus: "lourdes", disciplina: "diaw", turma: "G2",
    codigo: "7555.1.02",
    local: { ...FERNANDA, andar: 14, espaco: "Laboratório de Informática C", sala: "1403" },
  },

  // Quinta
  { dia: 4, inicio: "07:00", fim: "08:40", campus: "coreu", disciplina: "tcc2" },
  {
    dia: 4, inicio: "10:40", fim: "12:20", campus: "coreu", disciplina: "diaw", turma: "G2",
    codigo: "8148.1.02",
    local: { predio: 34, andar: 2, espaco: "Laboratório de Informática 04", sala: "210" },
  },
  {
    dia: 4, inicio: "15:20", fim: "17:00", campus: "coreu", disciplina: "ti2", curso: "CC",
    codigo: "6288.1.01",
    local: { predio: 43, andar: 2, sala: "203" },
  },
  {
    dia: 4, inicio: "17:10", fim: "18:50", campus: "coreu", disciplina: "diaw", turma: "G2",
    codigo: "8218.1.02",
    local: { predio: 34, andar: 2, espaco: "Laboratório de Informática 11", sala: "209" },
  },

  // Sexta
  {
    dia: 5, inicio: "07:00", fim: "08:40", campus: "lourdes", disciplina: "diw", turma: "G3", curso: "CC",
    codigo: "4347.1.03",
    local: { ...FERNANDA, andar: 14, espaco: "Laboratório de Informática B", sala: "1402" },
  },
  {
    dia: 5, inicio: "08:50", fim: "10:30", campus: "lourdes", disciplina: "ti2", curso: "CC",
    codigo: "4354.1.03",
    local: { ...FERNANDA, andar: 3, sala: "302" },
  },
  { dia: 5, inicio: "13:30", fim: "15:10", campus: "lourdes", disciplina: "oficinas", curso: "CC" },
  { dia: 5, inicio: "17:00", fim: "18:00", campus: "oficinas", disciplina: "aeds1" },
];
