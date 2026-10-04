import { parseSkin } from "../terminal/parseSkin";

// Grupos de gráficos do comando "stats". Todas estas formas funcionam:
//   stats --linguagens   stats linguagens   stats --skin linguagens
//   stats --languages    stats --langs
// Sem opção, abre o resumo. A ordem abaixo é a do rodapé "Gráficos:" e a
// do "stats --tudo", que mostra todos os grupos, um embaixo do outro.

export const SECTIONS = ["resumo", "linguagens", "atividade", "horarios", "repos"];
export const DEFAULT_SECTION = "resumo";
export const ALL_SECTIONS = "tudo";

// Opções do rodapé: os grupos + "tudo"
export const SECTION_OPTIONS = [...SECTIONS, ALL_SECTIONS];

// Nomes aceitos (PT e EN) → grupo
const SECTION_ALIASES = {
  resumo: "resumo",
  summary: "resumo",
  overview: "resumo",
  linguagens: "linguagens",
  languages: "linguagens",
  langs: "linguagens",
  atividade: "atividade",
  activity: "atividade",
  contribuicoes: "atividade",
  contributions: "atividade",
  streak: "atividade",
  horarios: "horarios",
  hours: "horarios",
  commits: "horarios",
  repos: "repos",
  repositorios: "repos",
  views: "repos",
  tudo: "tudo",
  all: "tudo",
};

export const parseGitHubStatsSection = (args) =>
  parseSkin(args, SECTION_ALIASES, DEFAULT_SECTION);
