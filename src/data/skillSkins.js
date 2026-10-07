import { parseSkin } from "../terminal/parseSkin";

// Estilos (skins) do comando "skills". Todas estas formas funcionam:
//   skills --terminal   skills terminal   skills --skin terminal
//   skills --skin=terminal   skills --globo (globo 3D)
// Sem opção, abre o estilo terminal. A ordem abaixo é a do rodapé
// "Estilos:" (o padrão vem primeiro), a mesma do comando "wakatime".

export const SKINS = ["terminal", "cards", "lista", "globo"];
export const DEFAULT_SKIN = "terminal";

// Nomes aceitos (PT e EN) → estilo
const SKIN_ALIASES = {
  cards: "cards",
  card: "cards",
  lista: "lista",
  list: "lista",
  terminal: "terminal",
  term: "terminal",
  globo: "globo",
  globe: "globo",
  "3d": "globo",
};

// Recebe as palavras depois do comando e devolve o estilo,
// ou null se a opção não existir (o App mostra a mensagem de uso)
export const parseSkillSkin = (args) =>
  parseSkin(args, SKIN_ALIASES, DEFAULT_SKIN);
