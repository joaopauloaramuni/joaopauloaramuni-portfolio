// Estilos (skins) do comando "skills". Todas estas formas funcionam:
//   skills --terminal   skills terminal   skills --skin terminal
//   skills --skin=terminal
// Sem opção, abre o estilo padrão.

export const SKINS = ["cards", "lista", "terminal"];
export const DEFAULT_SKIN = "cards";

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
export function parseSkin(args) {
  const words = args
    .flatMap((arg) => arg.split("="))
    .map((word) => word.replace(/^-+/, ""))
    .filter((word) => word && word !== "skin");

  if (words.length === 0) return DEFAULT_SKIN;
  if (words.length > 1) return null;
  return SKIN_ALIASES[words[0]] ?? null;
}
