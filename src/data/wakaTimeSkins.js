import { parseSkin } from "../terminal/parseSkin";

// Estilos (skins) do comando "wakatime". Todas estas formas funcionam:
//   wakatime --lista   wakatime lista   wakatime --skin lista
//   wakatime --skin=lista
// Sem opção, abre o estilo terminal. Terminal, grade e lista desenham os dados
// da API pública do WakaTime; cards são as duas imagens do helio-github-stats.
// A ordem abaixo é a do rodapé "Estilos:" (o padrão vem primeiro).

export const SKINS = ["terminal", "grade", "lista", "cards"];
export const DEFAULT_SKIN = "terminal";

// Nomes aceitos (PT e EN) → estilo
const SKIN_ALIASES = {
  cards: "cards",
  card: "cards",
  grade: "grade",
  grid: "grade",
  lista: "lista",
  list: "lista",
  terminal: "terminal",
  term: "terminal",
};

export const parseWakaTimeSkin = (args) =>
  parseSkin(args, SKIN_ALIASES, DEFAULT_SKIN);
