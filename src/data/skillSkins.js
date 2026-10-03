import { parseSkin } from "../terminal/parseSkin";

// Estilos (skins) do comando "skills". Todas estas formas funcionam:
//   skills --terminal   skills terminal   skills --skin terminal
//   skills --skin=terminal
// Sem opção, abre o estilo terminal. A ordem abaixo é a do rodapé
// "Estilos:" (o padrão vem primeiro), a mesma do comando "wakatime".

export const SKINS = ["terminal", "cards", "lista"];
export const DEFAULT_SKIN = "terminal";

// Nomes aceitos (PT e EN) → estilo
const SKIN_ALIASES = {
  cards: "cards",
  card: "cards",
  lista: "lista",
  list: "lista",
  terminal: "terminal",
  term: "terminal",
};

// Recebe as palavras depois do comando e devolve o estilo,
// ou null se a opção não existir (o App mostra a mensagem de uso)
export const parseSkillSkin = (args) =>
  parseSkin(args, SKIN_ALIASES, DEFAULT_SKIN);
