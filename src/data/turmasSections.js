import { idDoGrupo, slugDoGrupo } from "./turmasRepos";

// Gráficos e filtros do comando "turmas". Exemplos:
//   turmas                    resumo das duas disciplinas
//   turmas --ritmo            commits por semana de cada grupo
//   turmas ti5 coreu          resumo só da TI:V no Coração Eucarístico
//   turmas ti2 g3 --codigo    linhas de código dos dois G3 da TI:II
//   turmas uaiport            ficha de um grupo só (pelo nome, sem acento)
// As opções valem com ou sem "--" (turmas ritmo) e em inglês (turmas --pace).
// A ordem abaixo é a do rodapé "Gráficos:" e a do "turmas --tudo".

export const SECTIONS = ["resumo", "codigo", "linguagens", "ritmo", "equilibrio", "prs", "projetos"];
export const DEFAULT_SECTION = "resumo";
export const ALL_SECTIONS = "tudo";

// Com um grupo só e sem gráfico escolhido, abre a ficha dele
export const GROUP_SECTION = "grupo";

export const SECTION_OPTIONS = [...SECTIONS, ALL_SECTIONS];

// Nomes aceitos (PT e EN) → gráfico. "turmas --github" é o resumo.
const SECTION_ALIASES = {
  resumo: "resumo",
  summary: "resumo",
  overview: "resumo",
  github: "resumo",
  codigo: "codigo",
  code: "codigo",
  linhas: "codigo",
  lines: "codigo",
  loc: "codigo",
  linguagens: "linguagens",
  languages: "linguagens",
  langs: "linguagens",
  ritmo: "ritmo",
  pace: "ritmo",
  commits: "ritmo",
  atividade: "ritmo",
  activity: "ritmo",
  equilibrio: "equilibrio",
  balance: "equilibrio",
  integrantes: "equilibrio",
  members: "equilibrio",
  prs: "prs",
  pulls: "prs",
  issues: "prs",
  projetos: "projetos",
  projects: "projetos",
  readme: "projetos",
  tudo: "tudo",
  all: "tudo",
};

const DISCIPLINAS = ["ti2", "ti5"];
const CAMPUS_ALIASES = { lourdes: "lourdes", coreu: "coreu" };

// Opções do Tab: gráficos, filtros e o nome de cada grupo
export const turmasSubcommands = (grupos) => [
  ...SECTION_OPTIONS.map((s) => `--${s}`),
  ...DISCIPLINAS,
  ...Object.keys(CAMPUS_ALIASES),
  ...grupos.map((g) => slugDoGrupo(g.nome)),
];

// { section, explicit, filtros } ou null (opção desconhecida, dois gráficos
// ou nome que não é de nenhum grupo: o App mostra a mensagem de uso)
export function parseTurmas(args, grupos) {
  const words = args
    .flatMap((arg) => arg.split("="))
    .filter((word) => word && word !== "--skin" && word !== "skin");

  let section = null;
  const filtros = { disciplinas: [], campi: [], numeros: [], ids: [] };

  for (const raw of words) {
    const word = raw.replace(/^-+/, "");
    if (!word) continue;
    if (SECTION_ALIASES[word]) {
      if (section) return null;
      section = SECTION_ALIASES[word];
    } else if (raw.startsWith("-")) {
      return null;
    } else if (DISCIPLINAS.includes(word)) {
      filtros.disciplinas.push(word);
    } else if (CAMPUS_ALIASES[word]) {
      filtros.campi.push(CAMPUS_ALIASES[word]);
    } else if (/^g\d+$/.test(word)) {
      filtros.numeros.push(word.toUpperCase());
    } else {
      // Nome do grupo, ou o começo dele: "uai" acha o UaiPort
      const slug = slugDoGrupo(word);
      const achados = grupos.filter((g) => slug && slugDoGrupo(g.nome).startsWith(slug));
      if (slug.length < 2 || achados.length === 0) return null;
      filtros.ids.push(...achados.map(idDoGrupo));
    }
  }

  return { section: section ?? DEFAULT_SECTION, explicit: section !== null, filtros };
}

// Cada tipo de filtro restringe; dentro do mesmo tipo, qualquer um serve
export function aplicarFiltros(grupos, { disciplinas, campi, numeros, ids }) {
  const passa = (lista, valor) => lista.length === 0 || lista.includes(valor);
  return grupos.filter(
    (g) =>
      passa(disciplinas, g.disciplina) &&
      passa(campi, g.campus) &&
      passa(numeros, g.grupo) &&
      passa(ids, g.id)
  );
}
