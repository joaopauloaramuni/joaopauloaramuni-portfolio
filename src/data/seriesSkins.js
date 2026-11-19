import { parseSkin } from "../terminal/parseSkin";

// Visões do comando "series". Todas estas formas funcionam:
//   series --vistas   series vistas   series --skin vistas
// Sem opção, mostra tudo. A ordem abaixo é a do rodapé "Listas:".

export const SKINS = ["tudo", "assistindo", "vistas", "desenhos"];
export const DEFAULT_SKIN = "tudo";

// Nomes aceitos (PT e EN) → visão
const SKIN_ALIASES = {
  tudo: "tudo",
  all: "tudo",
  assistindo: "assistindo",
  agora: "assistindo",
  watching: "assistindo",
  now: "assistindo",
  vistas: "vistas",
  vi: "vistas",
  watched: "vistas",
  desenhos: "desenhos",
  cartoons: "desenhos",
};

// Subcomandos do autocomplete (Tab)
export const seriesSubcommands = [
  "--tudo",
  "--assistindo",
  "--vistas",
  "--desenhos",
  "--all",
  "--watching",
  "--watched",
  "--cartoons",
];

export const parseSeriesSkin = (args) => parseSkin(args, SKIN_ALIASES, DEFAULT_SKIN);
