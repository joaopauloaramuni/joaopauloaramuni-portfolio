// Acompanhamento de turmas de TI (Trabalhos Interdisciplinares): os
// repositórios dos grupos que eu oriento, usados pelo comando "turmas".
//
// O "npm run turmas" (scripts/turmas.mjs) lê esta lista, busca cada
// repositório no GitHub e grava src/data/turmasData.js, que é o que o
// terminal mostra. Os repositórios dos grupos são privados: o script roda na
// minha máquina, com o meu token, e só leva para o portfólio números e o
// resumo do projeto, nunca nomes, e-mails ou logins de alunos.
//
// Para um semestre novo: troque SEMESTRE e a lista GRUPOS e rode o script.
//
// Este arquivo não importa nada porque o script (Node) também o lê.

// Semestre letivo das turmas: as datas de início e fim vêm do calendário da
// PUC (data/calendarioPuc.js). Os commits contam a partir do início.
export const SEMESTRE = { ano: 2026, numero: 2 };

// Disciplinas, na ordem em que aparecem no terminal. O nome vem do i18n
// (cal.disciplinas.<chave>, o mesmo do comando "cal"); "material" é o meu
// repositório da disciplina, com enunciado e lista de grupos.
export const DISCIPLINAS_TI = {
  ti2: {
    curso: "CC",
    material: "https://github.com/joaopauloaramuni/trabalho-interdisciplinar-front-end",
  },
  ti5: {
    curso: "ES",
    material:
      "https://github.com/joaopauloaramuni/trabalho-interdisciplinar-aplicacoes-distribuidas",
  },
};

// Professores de cada turma (login no GitHub). Ficam fora de todas as
// análises, em qualquer repositório: commits, linhas, fatias do equilíbrio,
// PRs e issues abertos por eles. O script reconhece os commits deles pela
// conta do GitHub de cada e-mail e, se o e-mail não estiver em conta
// nenhuma, pelo nome do perfil.
export const PROFESSORES = {
  ti2: {
    lourdes: ["rommelcarneiro", "hayalacurto"],
    coreu: ["joaopauloaramuni"],
  },
  ti5: {
    lourdes: ["CleitonSilvaT", "cmnetos"],
    coreu: ["lvcardoso", "arturmol"],
  },
};

// Mais gente que não conta como integrante (monitores, convidados): login,
// e-mail ou nome. O script também ignora bots e quem está na seção
// "Orientadores" do README de cada grupo.
export const IGNORAR_AUTORES = [];

// campus: chave de CAMPI (data/horarioData.js), que define letra e cor
// grupo: opcional (G1, G2...), para as turmas que numeram os grupos
export const GRUPOS = [
  // TI:II - Front-end · Lourdes
  {
    disciplina: "ti2", campus: "lourdes", grupo: "G1", nome: "Trilhô",
    repo: "ICEI-PUC-Minas-CC-TI/plu-cc-2026-2-ti2-4354100-plu-cc-2026-2-ti2-4354100-group-1",
  },
  {
    disciplina: "ti2", campus: "lourdes", grupo: "G2", nome: "Task++",
    repo: "ICEI-PUC-Minas-CC-TI/plu-cc-2026-2-ti2-4354100-plu-cc-2026-2-ti2-4354100-group-2",
  },
  {
    disciplina: "ti2", campus: "lourdes", grupo: "G3", nome: "HealthyStep",
    repo: "ICEI-PUC-Minas-CC-TI/plu-cc-2026-2-ti2-4354100-plu-cc-2026-2-ti2-4354100-group-3",
  },
  {
    disciplina: "ti2", campus: "lourdes", grupo: "G4", nome: "Mentora",
    repo: "ICEI-PUC-Minas-CC-TI/plu-cc-2026-2-ti2-4354100-plu-cc-2026-2-ti2-4354100-group-4",
  },
  {
    disciplina: "ti2", campus: "lourdes", grupo: "G5", nome: "Topdeck",
    repo: "ICEI-PUC-Minas-CC-TI/plu-cc-2026-2-ti2-4354100-plu-cc-2026-2-ti2-4354100-group-5",
  },
  {
    disciplina: "ti2", campus: "lourdes", grupo: "G6", nome: "Vireo",
    repo: "ICEI-PUC-Minas-CC-TI/plu-cc-2026-2-ti2-4354100-plu-cc-2026-2-ti2-4354100-group-6",
  },
  {
    disciplina: "ti2", campus: "lourdes", grupo: "G7", nome: "Mediflow",
    repo: "ICEI-PUC-Minas-CC-TI/plu-cc-2026-2-ti2-4354100-plu-cc-2026-2-ti2-4354100-group-7",
  },
  {
    disciplina: "ti2", campus: "lourdes", grupo: "G8", nome: "Code Rats",
    repo: "ICEI-PUC-Minas-CC-TI/plu-cc-2026-2-ti2-4354100-plu-cc-2026-2-ti2-4354100-group-8",
  },
  {
    disciplina: "ti2", campus: "lourdes", grupo: "G9", nome: "Litera.Cy",
    repo: "ICEI-PUC-Minas-CC-TI/plu-cc-2026-2-ti2-4354100-plu-cc-2026-2-ti2-4354100-group-9",
  },

  // TI:II - Front-end · Coração Eucarístico
  {
    disciplina: "ti2", campus: "coreu", grupo: "G1", nome: "FindPro",
    repo: "ICEI-PUC-Minas-CC-TI/pmg-cc-2026-2-ti2-6288100-pmg-cc-2026-2-6288100-G1-FindPro",
  },
  {
    disciplina: "ti2", campus: "coreu", grupo: "G2", nome: "Contabilidade GE Alves",
    repo: "ICEI-PUC-Minas-CC-TI/pmg-cc-2026-2-ti2-6288100-pmg-cc-2026-2-6288100-G2-Contabilidade-GE-ALVES",
  },
  {
    disciplina: "ti2", campus: "coreu", grupo: "G3", nome: "SportTime",
    repo: "ICEI-PUC-Minas-CC-TI/pmg-cc-2026-2-ti2-6288100-pmg-cc-2026-2-6288100-G3-SportTime",
  },
  {
    disciplina: "ti2", campus: "coreu", grupo: "G4", nome: "Coreu Urban Hotel",
    repo: "ICEI-PUC-Minas-CC-TI/pmg-cc-2026-2-ti2-6288100-pmg-cc-2026-2-6288100-G4-Coreu-Urban-Hotel",
  },
  {
    disciplina: "ti2", campus: "coreu", grupo: "G5", nome: "SiFinance",
    repo: "ICEI-PUC-Minas-CC-TI/pmg-cc-2026-2-ti2-6288100-pmg-cc-2026-2-6288100-G5-SiFinance",
  },
  {
    disciplina: "ti2", campus: "coreu", grupo: "G6", nome: "RPG",
    repo: "ICEI-PUC-Minas-CC-TI/pmg-cc-2026-2-ti2-6288100-pmg-cc-2026-2-6288100-G6-RPG",
  },

  // TI:V - Aplicações Distribuídas · Lourdes (Praça da Liberdade)
  { disciplina: "ti5", campus: "lourdes", nome: "UniCarona", repo: "ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti5-0492100-unicarona" },
  { disciplina: "ti5", campus: "lourdes", nome: "RoadMap", repo: "ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti5-0492100-road-map" },
  { disciplina: "ti5", campus: "lourdes", nome: "Routina", repo: "ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti5-0492100-routina" },
  { disciplina: "ti5", campus: "lourdes", nome: "Psihub", repo: "ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti5-0492100-psihub" },
  { disciplina: "ti5", campus: "lourdes", nome: "MatchSport", repo: "ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti5-0492100-match-sport" },
  { disciplina: "ti5", campus: "lourdes", nome: "PlaySportsFalcao", repo: "ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti5-0492100-play-sports-falcao" },
  { disciplina: "ti5", campus: "lourdes", nome: "SplitHub", repo: "ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti5-0492100-splithub" },
  { disciplina: "ti5", campus: "lourdes", nome: "Nautilus", repo: "ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti5-0492100-nautilus" },
  { disciplina: "ti5", campus: "lourdes", nome: "Tocae", repo: "ICEI-PUC-Minas-PPLES-TI/plf-es-2026-2-ti5-0492100-tocae" },

  // TI:V - Aplicações Distribuídas · Coração Eucarístico
  { disciplina: "ti5", campus: "coreu", nome: "Ajuda-ai", repo: "ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-ajuda-ai" },
  { disciplina: "ti5", campus: "coreu", nome: "UaiPort", repo: "ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-uaiport" },
  { disciplina: "ti5", campus: "coreu", nome: "TicketMind", repo: "ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-ticket-mind" },
  { disciplina: "ti5", campus: "coreu", nome: "HomeFix", repo: "ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-homefix" },
  { disciplina: "ti5", campus: "coreu", nome: "LanShow", repo: "ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-lanshow" },
  { disciplina: "ti5", campus: "coreu", nome: "Limity", repo: "ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-limity" },
  { disciplina: "ti5", campus: "coreu", nome: "Pulso", repo: "ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso" },
  { disciplina: "ti5", campus: "coreu", nome: "SystemOps", repo: "ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-systemops" },
  { disciplina: "ti5", campus: "coreu", nome: "Le-ai", repo: "ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-le-ai" },
];

// "Trilhô" → "trilho", "Task++" → "task", "Code Rats" → "coderats".
// É o nome que se digita no terminal (turmas uaiport) e o fim do id.
export const slugDoGrupo = (nome) =>
  nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

// "ti5-coreu-uaiport": liga a lista acima aos dados gerados (turmasData.js)
export const idDoGrupo = (g) => `${g.disciplina}-${g.campus}-${slugDoGrupo(g.nome)}`;
