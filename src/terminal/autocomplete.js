// Autocomplete estilo bash, sem dependência de React (fácil de testar).
//
// Completa a primeira palavra com comandos e aliases do commandList e a
// segunda com os subcomandos do comando (ex.: "tema c" → "tema claro").
//
// Retorna um destes formatos:
//   { value: "guestbook " }        → há o que completar
//   { options: ["git", "github"] } → ambíguo, sem prefixo comum a avançar
//   {}                             → nada a fazer

const findCommand = (word, commands) =>
  Object.values(commands).find(
    (cmd) => cmd.name === word || cmd.aliases.includes(word)
  );

const commandWords = (commands) =>
  [
    ...new Set(
      Object.values(commands).flatMap((cmd) => [cmd.name, ...cmd.aliases])
    ),
  ].sort();

const commonPrefix = (words) =>
  words.reduce((prefix, word) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === word[i]) i++;
    return prefix.slice(0, i);
  });

export function autocomplete(input, commands) {
  const parts = input.toLowerCase().trimStart().split(/ +/);
  if (parts.length > 2) return {};

  const completingSubcommand = parts.length === 2;
  const command = completingSubcommand ? findCommand(parts[0], commands) : null;
  const candidates = completingSubcommand
    ? command?.subcommands ?? []
    : commandWords(commands);
  const typed = parts[parts.length - 1];
  const base = completingSubcommand ? `${parts[0]} ` : "";

  const matches = candidates.filter((word) => word.startsWith(typed));
  if (matches.length === 0) return {};

  if (matches.length === 1) {
    const [match] = matches;
    // Como no bash: se o comando aceita subcomando, já deixa o espaço pronto
    const hasSubcommands =
      !completingSubcommand && findCommand(match, commands)?.subcommands;
    const value = base + match + (hasSubcommands ? " " : "");
    return value === input ? {} : { value };
  }

  const prefix = commonPrefix(matches);
  if (prefix.length > typed.length) return { value: base + prefix };
  return { options: matches };
}
