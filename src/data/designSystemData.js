import {
  IoSchoolOutline,
  IoBriefcaseOutline,
  IoBookOutline,
  IoLocationOutline,
  IoMailOutline,
  IoLogoGithub,
} from "react-icons/io5";

// Dados do comando "design".
//
// Os valores das cores NÃO ficam aqui: o DesignSystem.jsx lê cada token
// direto do theme.css enquanto a página roda, nos dois temas. Se uma cor
// mudar lá, muda aqui também. Este arquivo só diz a ordem, o grupo e como
// desenhar a amostra de cada token. A descrição vem do i18n
// (design.tokens.<nome sem os dois traços>).
//
// kind:
//   "color"      quadrado preenchido com a cor
//   "text"       "Aa" escrito na cor, com o contraste calculado
//   "icon"       ícone pintado na cor (ícones pedem contraste de 3:1)
//   "shadow"     caixa com a sombra
//   "scanline"   linhas do efeito CRT da sequência de boot
//   "background" caixa com o fundo (aceita gradiente)
//   "mark"       barra de gráfico pintada na cor (marcas pedem contraste de 3:1)
//   "tint"       valor em %: fundo tingido com a cor de `base` nessa porcentagem
// on: token do fundo usado no contraste (padrão: --bg-terminal)
// base: token da cor tingida (só no "tint")

export const tokenGroups = [
  {
    id: "fundos",
    tokens: [
      { name: "--bg-page", kind: "color" },
      { name: "--bg-terminal", kind: "color" },
      { name: "--surface", kind: "color" },
      { name: "--surface-input", kind: "color" },
      { name: "--track", kind: "color" },
    ],
  },
  {
    id: "bordas",
    tokens: [
      { name: "--border", kind: "color" },
      { name: "--border-input", kind: "color" },
    ],
  },
  {
    id: "texto",
    tokens: [
      { name: "--text", kind: "text" },
      { name: "--text-soft", kind: "text" },
      { name: "--text-muted", kind: "text" },
      { name: "--text-dim", kind: "text" },
      { name: "--terminal-chrome", kind: "text" },
      { name: "--cursor", kind: "color" },
    ],
  },
  {
    id: "destaque",
    tokens: [
      { name: "--accent", kind: "text" },
      { name: "--accent-hover", kind: "color" },
      { name: "--accent-focus", kind: "color" },
      { name: "--link-hover", kind: "text" },
      { name: "--on-accent", kind: "text", on: "--accent" },
    ],
  },
  {
    id: "tags",
    tokens: [
      { name: "--tag-bg", kind: "color" },
      { name: "--tag-text", kind: "text", on: "--tag-bg" },
    ],
  },
  {
    id: "semanticas",
    tokens: [
      { name: "--highlight", kind: "text" },
      { name: "--warn", kind: "text" },
      { name: "--info", kind: "text" },
      { name: "--success", kind: "text" },
    ],
  },
  {
    id: "icones",
    tokens: [
      { name: "--icon-school", kind: "icon", icon: IoSchoolOutline },
      { name: "--icon-work", kind: "icon", icon: IoBriefcaseOutline },
      { name: "--icon-book", kind: "icon", icon: IoBookOutline },
      { name: "--icon-location", kind: "icon", icon: IoLocationOutline },
      { name: "--icon-mail-gmail", kind: "icon", icon: IoMailOutline },
      { name: "--icon-mail-puc", kind: "icon", icon: IoMailOutline },
      { name: "--icon-github", kind: "icon", icon: IoLogoGithub },
    ],
  },
  {
    // Comando "cal": cor de cada campus na agenda e na grade de horários
    id: "calendario",
    tokens: [
      { name: "--cal-coreu", kind: "text" },
      { name: "--cal-lourdes", kind: "text" },
      { name: "--cal-oficinas", kind: "text" },
      { name: "--cal-teams", kind: "text" },
      { name: "--cal-tinta", kind: "tint", base: "--cal-coreu" },
    ],
  },
  {
    // Comando "lattes": cor de cada tipo de produção (gráfico, cards e listas)
    id: "lattes",
    tokens: [
      { name: "--lattes-tccs", kind: "mark" },
      { name: "--lattes-interdisciplinares", kind: "mark" },
      { name: "--lattes-aes", kind: "mark" },
      { name: "--lattes-bancas", kind: "mark" },
    ],
  },
  {
    // Comando "lattes --docencia": cor de cada instituição
    id: "docencia",
    tokens: [
      { name: "--docencia-puc", kind: "mark" },
      { name: "--docencia-newton", kind: "mark" },
      { name: "--docencia-igti", kind: "mark" },
      { name: "--docencia-trybe", kind: "mark" },
      { name: "--docencia-fumec", kind: "mark" },
    ],
  },
  {
    // Comando "turmas": estado de PRs e issues e as 6 linguagens com mais
    // linhas em cada disciplina (paleta categórica validada nessa ordem)
    id: "turmas",
    tokens: [
      { name: "--turmas-concluido", kind: "mark" },
      { name: "--turmas-aberto", kind: "mark" },
      { name: "--turmas-ling-1", kind: "mark" },
      { name: "--turmas-ling-2", kind: "mark" },
      { name: "--turmas-ling-3", kind: "mark" },
      { name: "--turmas-ling-4", kind: "mark" },
      { name: "--turmas-ling-5", kind: "mark" },
      { name: "--turmas-ling-6", kind: "mark" },
    ],
  },
  {
    id: "scrollbar",
    tokens: [
      { name: "--scrollbar-thumb", kind: "color" },
      { name: "--scrollbar-thumb-hover", kind: "color" },
    ],
  },
  {
    id: "efeitos",
    tokens: [
      { name: "--shadow-project-hover", kind: "shadow" },
      { name: "--shadow-xp-hover", kind: "shadow" },
      { name: "--scanline", kind: "scanline" },
      { name: "--game-sky", kind: "background" },
    ],
  },
];

export const allTokenNames = tokenGroups.flatMap((group) =>
  group.tokens.map((token) => token.name)
);

// Famílias das cores na escala cromática, na ordem em que aparecem
export const colorFamilies = ["neutros", "verdes", "amarelos", "vermelhos", "azuis", "outros"];

// Fontes carregadas por @font-face em App.css (só o peso 400 de cada)
export const fontStack = '"FiraCode", "JetBrainsMono", "Consolas", "Monaco", monospace';
export const brailleStack =
  '"DejaVu Sans Mono", Menlo, "Segoe UI Symbol", "Apple Braille", monospace';

export const fontFamilies = [
  { id: "fira", family: "FiraCode", file: "Fira Code 6.2 · woff2 · 400" },
  { id: "jetbrains", family: "JetBrainsMono", file: "JetBrains Mono 2.304 · woff2 · 400" },
];

// Tamanhos de fonte mais usados nos CSS dos componentes
export const typeScale = [
  { id: "titulo_secao", size: "1.8rem" },
  { id: "titulo_card", size: "1.5rem" },
  { id: "destaque", size: "1.2rem" },
  { id: "corpo", size: "1rem" },
  { id: "dica", size: "0.85rem" },
  { id: "tag", size: "0.8rem" },
];

// Espaçamentos (padding, margin e gap) mais usados nos componentes
export const spacingScale = ["0.25rem", "0.5rem", "0.75rem", "1rem", "1.5rem", "2rem", "2.5rem", "3rem"];

export const radii = [
  { id: "r0", value: "0" },
  { id: "r2", value: "2px" },
  { id: "r3", value: "3px" },
  { id: "r4", value: "4px" },
  { id: "r6", value: "6px" },
  { id: "r8", value: "8px" },
  { id: "r10", value: "10px" },
  { id: "r12", value: "12px" },
  { id: "r14", value: "14px" },
  { id: "r20", value: "20px" },
  { id: "pill", value: "9999px" },
  { id: "circle", value: "50%" },
];

export const breakpoints = [
  { id: "bp1280", value: "1280px" },
  { id: "bp900", value: "900px" },
  { id: "bp768", value: "768px", main: true },
  { id: "bp600", value: "600px" },
  { id: "bp500", value: "500px" },
  { id: "bp480", value: "480px", main: true },
];
