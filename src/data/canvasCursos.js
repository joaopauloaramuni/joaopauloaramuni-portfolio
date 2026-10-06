// Cursos do Canvas usados pelo comando "canvas": tarefas, prazos, entregas e
// o calendário das minhas disciplinas.
//
// O "npm run canvas" (scripts/canvas.mjs) lê este arquivo, busca no Canvas os
// cursos em que sou professor e grava src/data/canvasData.js, que é o que o
// terminal mostra. A chave da API (CANVAS_TOKEN) fica só no .env.local da
// minha máquina: o site nunca fala com o Canvas.
//
// Na maioria das vezes não precisa mexer aqui. O script já:
//   • fica só com os cursos do semestre (data/calendarioPuc.js) que têm
//     alguma tarefa publicada;
//   • descobre a disciplina, o campus e a turma pelo código do SGA do curso
//     (o "codigo" das aulas em data/horarioData.js), para usar as mesmas
//     siglas e cores do "cal";
//   • mostra o código completo da disciplina ("(6288100)" no Canvas →
//     6288.1.00);
//   • tira o curso (Engenharia de Software ou Ciência da Computação), o campus
//     e o turno do nome ("... - Engenharia de Software - Campus Lourdes - PLU -
//     Noite - 2026/2") e, num curso sem código, a disciplina de outro curso
//     com o mesmo nome de disciplina.
// O script lista no terminal o id de cada curso e o que descobriu. Se algo
// vier errado, corrija com CURSOS, INCLUIR e IGNORAR e rode de novo.
//
// Este arquivo não importa nada porque o script (Node) também o lê.

// Endereço do Canvas. Para testar com outro servidor, use CANVAS_URL no
// ambiente (CANVAS_URL=http://localhost:4010 npm run canvas).
export const CANVAS_URL = "https://pucminas.instructure.com";

// id do curso no Canvas (o número em /courses/<id>) → o que mostrar.
//   disciplina: chave de DISCIPLINAS (data/horarioData.js): sigla e nome
//   campus: chave de CAMPI (data/horarioData.js): letra e cor
//   turma: opcional (G1, G2...)
//   turno: opcional, "manha" | "tarde" | "noite"
//   curso: opcional, "ES" (Engenharia de Software) | "CC" (Ciência da Computação)
//   sga: opcional, código completo da disciplina no SGA ("8148.1.01")
//   nome: opcional, troca o nome que aparece no terminal
// Exemplo:
//   12345: { disciplina: "diw", campus: "coreu", turma: "G1", curso: "CC" },
export const CURSOS = {};

// ids de cursos que entram mesmo sem tarefa publicada ou fora do semestre
export const INCLUIR = [];

// ids de cursos que nunca entram (sandbox, cursos de capacitação, monitoria...)
export const IGNORAR = [];
