// Dados do comando "design".
//
// Os valores das cores NÃO ficam aqui: o DesignSystem.jsx lê cada token
// direto do theme.css enquanto a página roda, nos três temas. Este arquivo
// só diz quais tokens mostrar, em que ordem e como desenhar a amostra.
//
// kind:
//   "color"  quadrado preenchido com a cor
//   "text"   "Aa" escrito na cor, com o contraste calculado (pede 4.5:1)
// on: token do fundo usado no contraste (padrão: --bg-terminal)

// Os tokens que importam: a base de todo componente
export const tokenGroups = [
  {
    id: "superficies",
    tokens: [
      { name: "--bg-page", kind: "color" },
      { name: "--bg-terminal", kind: "color" },
      { name: "--surface", kind: "color" },
      { name: "--border", kind: "color" },
    ],
  },
  {
    id: "texto",
    tokens: [
      { name: "--text", kind: "text" },
      { name: "--text-muted", kind: "text" },
      { name: "--text-dim", kind: "text" },
      { name: "--terminal-chrome", kind: "text" },
    ],
  },
  {
    id: "destaque",
    tokens: [
      { name: "--accent", kind: "text" },
      { name: "--accent-hover", kind: "color" },
      { name: "--on-accent", kind: "text", on: "--accent" },
    ],
  },
  {
    id: "estados",
    tokens: [
      { name: "--highlight", kind: "text" },
      { name: "--warn", kind: "text" },
      { name: "--info", kind: "text" },
      { name: "--success", kind: "text" },
      { name: "--busy", kind: "text" },
    ],
  },
];

// As cinco cores que resumem cada tema no cartão de "Temas"
export const themeSummary = ["--bg-terminal", "--surface", "--text", "--text-muted", "--accent"];

// Paletas categóricas dos gráficos: só as cores, no tema da página. O galo
// herda as do escuro; o claro tem versões escurecidas (ver theme.css).
export const dataPalettes = [
  { id: "cal", tokens: ["--cal-coreu", "--cal-lourdes", "--cal-oficinas", "--cal-teams"] },
  {
    id: "lattes",
    tokens: ["--lattes-tccs", "--lattes-interdisciplinares", "--lattes-aes", "--lattes-bancas"],
  },
  {
    id: "docencia",
    tokens: [
      "--docencia-puc",
      "--docencia-newton",
      "--docencia-igti",
      "--docencia-trybe",
      "--docencia-fumec",
    ],
  },
  {
    id: "turmas",
    tokens: [
      "--turmas-ling-1",
      "--turmas-ling-2",
      "--turmas-ling-3",
      "--turmas-ling-4",
      "--turmas-ling-5",
      "--turmas-ling-6",
    ],
  },
  { id: "canvas", tokens: ["--canvas-entregue", "--canvas-atrasada", "--canvas-faltando"] },
];

export const allTokenNames = [
  ...new Set([...tokenGroups.flatMap((g) => g.tokens.map((t) => t.name)), ...themeSummary]),
];

// Fonte carregada por @font-face em App.css (só o peso 400)
export const fontStack = '"FiraCode", "JetBrainsMono", "Consolas", "Monaco", monospace';

// Tamanhos de fonte mais usados nos componentes
export const typeScale = [
  { id: "titulo_secao", size: "1.8rem" },
  { id: "titulo_card", size: "1.5rem" },
  { id: "destaque", size: "1.2rem" },
  { id: "corpo", size: "1rem" },
  { id: "dica", size: "0.85rem" },
];

// Espaçamentos (padding, margin e gap) mais usados
export const spacingScale = ["0.25rem", "0.5rem", "1rem", "1.5rem", "2rem", "3rem"];

// Raios mais usados (há outros pontuais nos componentes)
export const radii = [
  { id: "r4", value: "4px" },
  { id: "r6", value: "6px" },
  { id: "r8", value: "8px" },
  { id: "r10", value: "10px" },
  { id: "pilula", value: "9999px" },
  { id: "circulo", value: "50%" },
];

// Breakpoints (max-width) mais usados nos componentes
export const breakpoints = [
  { id: "bp900", value: "900px" },
  { id: "bp768", value: "768px" },
  { id: "bp480", value: "480px" },
];
