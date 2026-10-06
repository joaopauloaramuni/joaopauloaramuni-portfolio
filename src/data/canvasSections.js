import { CAMPI, DISCIPLINAS } from "./horarioData";

// Seções e filtros do comando "canvas". Exemplos:
//   canvas                   resumo: próxima entrega, indicadores e cursos
//   canvas --tarefas         todas as tarefas, da que vence primeiro à última
//   canvas --agenda          tarefas, eventos e feriados, dia a dia
//   canvas diw               só os cursos de DIW (vale com qualquer seção)
//   canvas ti5 coreu --tarefas
//   canvas g2 --agenda       só as turmas G2
// As opções valem com ou sem "--" (canvas tarefas) e em inglês (--tasks).
// Outras palavras procuram no nome do curso no Canvas (canvas noite).
// A ordem abaixo é a do rodapé "Seções:" e a do "canvas --tudo".

export const SECTIONS = ["resumo", "tarefas", "agenda"];
export const DEFAULT_SECTION = "resumo";
export const ALL_SECTIONS = "tudo";

export const SECTION_OPTIONS = [...SECTIONS, ALL_SECTIONS];

// Nomes aceitos (PT e EN) → seção
const SECTION_ALIASES = {
  resumo: "resumo",
  summary: "resumo",
  overview: "resumo",
  tarefas: "tarefas",
  tarefa: "tarefas",
  tasks: "tarefas",
  assignments: "tarefas",
  prazos: "tarefas",
  deadlines: "tarefas",
  entregas: "tarefas",
  submissions: "tarefas",
  agenda: "agenda",
  calendario: "agenda",
  "calendário": "agenda",
  calendar: "agenda",
  eventos: "agenda",
  events: "agenda",
  tudo: "tudo",
  all: "tudo",
};

// Opções do Tab: seções, disciplinas e campi
export const canvasSubcommands = [
  ...SECTION_OPTIONS.map((s) => `--${s}`),
  ...Object.keys(DISCIPLINAS),
  ...Object.keys(CAMPI),
];

// "Ciência da Computação" → "cienciadacomputacao"
export const slug = (texto) =>
  (texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

// { section, filtros } ou null (opção desconhecida ou duas seções: o App
// mostra a mensagem de uso). Palavras soltas não falham aqui: quem sabe se
// um nome de curso existe é o componente, que carrega os dados.
export function parseCanvas(args) {
  const words = args
    .flatMap((arg) => arg.split("="))
    .filter((word) => word && word !== "--skin" && word !== "skin");

  let section = null;
  const filtros = { disciplinas: [], campi: [], turmas: [], termos: [] };

  for (const raw of words) {
    const word = raw.replace(/^-+/, "");
    if (!word) continue;
    if (Object.hasOwn(SECTION_ALIASES, word)) {
      if (section) return null;
      section = SECTION_ALIASES[word];
    } else if (raw.startsWith("-")) {
      return null;
    } else if (Object.hasOwn(DISCIPLINAS, word)) {
      filtros.disciplinas.push(word);
    } else if (Object.hasOwn(CAMPI, word)) {
      filtros.campi.push(word);
    } else if (/^g\d+$/.test(word)) {
      filtros.turmas.push(word.toUpperCase());
    } else if (slug(word).length >= 2) {
      filtros.termos.push(slug(word));
    } else {
      return null;
    }
  }

  return { section: section ?? DEFAULT_SECTION, filtros };
}

export const semFiltro = (filtros) =>
  !filtros || Object.values(filtros).every((lista) => lista.length === 0);

// Cada tipo de filtro restringe; dentro do mesmo tipo, qualquer um serve.
// Os termos procuram no nome e no código do curso no Canvas.
export function aplicarFiltros(cursos, filtros) {
  if (semFiltro(filtros)) return cursos;
  const { disciplinas, campi, turmas, termos } = filtros;
  const passa = (lista, valor) => lista.length === 0 || lista.includes(valor);
  return cursos.filter((c) => {
    const texto = slug(`${c.nome} ${c.codigo ?? ""}`);
    return (
      passa(disciplinas, c.disciplina) &&
      passa(campi, c.campus) &&
      passa(turmas, c.turma) &&
      termos.every((termo) => texto.includes(termo))
    );
  });
}
