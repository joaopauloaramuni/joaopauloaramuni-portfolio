// Calendário Acadêmico e Administrativo da PUC Minas, só o que importa para
// os campi de Belo Horizonte (Coreu e Lourdes). Fonte:
// https://www.pucminas.br/calendario/Documents/calendario-academico-2026.pdf
//
// Para um ano novo, copie o bloco de 2026 e preencha com o PDF do ano.
// Enquanto um ano não tiver bloco aqui, o cal mostra os feriados calculados
// de data/feriados.js, mas não marca aulas nele (não dá para saber quando o
// semestre começa).
//
// tipo:
//   feriado          feriado nacional ou de BH
//   recesso          recesso escolar e do corpo docente (sem aula)
//   recesso_docente  recesso só do corpo docente (fora do semestre letivo)
//   ferias           férias coletivas do corpo docente
// chave: nome no i18n (cal.feriados.<chave>)
// Ficaram de fora os feriados só de Poços de Caldas (13/5 e 6/11) e do
// Serro (6/7), que não valem para BH.

export const CALENDARIOS_PUC = {
  2026: {
    // Semestre letivo dos veteranos de 20 semanas, o mais longo dos três
    // da tabela. Se as suas turmas forem de 18 semanas, troque os fins:
    //   1º semestre: 2026-06-30 · 2º semestre: 2026-12-15
    // (calouros 18 semanas: 23/2 a 10/7 e 3/8 a 15/12)
    semestres: [
      { inicio: "2026-02-09", fim: "2026-07-10" },
      { inicio: "2026-08-03", fim: "2026-12-22" },
    ],
    dias: [
      { de: "2026-01-01", tipo: "feriado", chave: "confraternizacao" },
      { de: "2026-01-02", ate: "2026-01-31", tipo: "ferias", chave: "ferias_docentes" },
      { de: "2026-02-14", ate: "2026-02-17", tipo: "recesso", chave: "carnaval" },
      { de: "2026-02-18", tipo: "recesso", chave: "cinzas" },
      { de: "2026-03-30", ate: "2026-04-05", tipo: "recesso", chave: "semana_santa" },
      { de: "2026-04-21", tipo: "feriado", chave: "tiradentes" },
      { de: "2026-05-01", tipo: "feriado", chave: "trabalho" },
      { de: "2026-06-04", tipo: "feriado", chave: "corpus_christi" },
      { de: "2026-07-13", ate: "2026-07-27", tipo: "recesso_docente", chave: "recesso_docente" },
      { de: "2026-08-15", tipo: "feriado", chave: "assuncao" },
      { de: "2026-09-07", tipo: "feriado", chave: "independencia" },
      { de: "2026-10-12", tipo: "feriado", chave: "aparecida" },
      { de: "2026-10-13", tipo: "recesso", chave: "dia_professor" },
      { de: "2026-11-02", tipo: "feriado", chave: "finados" },
      { de: "2026-11-15", tipo: "feriado", chave: "republica" },
      { de: "2026-11-20", tipo: "feriado", chave: "consciencia_negra" },
      { de: "2026-12-08", tipo: "feriado", chave: "imaculada" },
      { de: "2026-12-24", ate: "2026-12-31", tipo: "recesso_docente", chave: "recesso_docente" },
      { de: "2026-12-25", tipo: "feriado", chave: "natal" },
    ],
  },
};
