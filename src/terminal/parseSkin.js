// Lê o estilo (skin) escolhido nas palavras depois do comando.
// Usado por "skills" e "wakatime". Todas estas formas funcionam:
//   skills --terminal   skills terminal   skills --skin terminal
//   skills --skin=terminal
// Sem opção, devolve o estilo padrão. Opção desconhecida ou mais de uma
// devolve null (o App mostra a mensagem de uso do comando).
export function parseSkin(args, aliases, defaultSkin) {
  const words = args
    .flatMap((arg) => arg.split("="))
    .map((word) => word.replace(/^-+/, ""))
    .filter((word) => word && word !== "skin");

  if (words.length === 0) return defaultSkin;
  if (words.length > 1) return null;
  return aliases[words[0]] ?? null;
}
