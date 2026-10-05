import { parseSkin } from "../terminal/parseSkin";

// Seções do comando "lattes". Todas estas formas funcionam:
//   lattes --tccs   lattes tccs   lattes --skin tccs   lattes --theses
// A seção "interdisciplinares" aparece como --tis (nome curto, no i18n),
// mas --ti, --interdisciplinares e --interdisciplinary também funcionam.
// Sem opção, abre o resumo. A ordem abaixo é a do rodapé "Seções:" e a
// do "lattes --tudo", que mostra todas, uma embaixo da outra.
// "lattes --pdf" não é uma seção do resumo: mostra o card de download.

export const SECTIONS = ["resumo", "tccs", "interdisciplinares", "aes", "bancas"];
export const DEFAULT_SECTION = "resumo";
export const ALL_SECTIONS = "tudo";
export const PDF_SECTION = "pdf";

// Opções do rodapé: as seções + "tudo" + "pdf"
export const SECTION_OPTIONS = [...SECTIONS, ALL_SECTIONS, PDF_SECTION];

// Nomes aceitos (PT e EN) → seção
const SECTION_ALIASES = {
  resumo: "resumo",
  summary: "resumo",
  overview: "resumo",
  tccs: "tccs",
  tcc: "tccs",
  orientacoes: "tccs",
  theses: "tccs",
  thesis: "tccs",
  interdisciplinares: "interdisciplinares",
  interdisciplinar: "interdisciplinares",
  interdisciplinary: "interdisciplinares",
  ti: "interdisciplinares",
  tis: "interdisciplinares",
  aes: "aes",
  agencia: "aes",
  agency: "aes",
  bancas: "bancas",
  banca: "bancas",
  committees: "bancas",
  committee: "bancas",
  boards: "bancas",
  tudo: "tudo",
  all: "tudo",
  pdf: "pdf",
  download: "pdf",
  baixar: "pdf",
};

export const parseLattesSection = (args) =>
  parseSkin(args, SECTION_ALIASES, DEFAULT_SECTION);
