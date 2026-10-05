// Disciplinas que lecionei, por instituição (comando "lattes --docencia").
//
// Diferente do lattesData.js, este arquivo é mantido à mão: o XML do
// Lattes não traz os semestres de cada disciplina. As fontes foram o
// README de cada repositório de disciplina no GitHub, as fichas de
// horário da FUMEC e as orientações de TCC do Lattes.
//
// Instituições, na ordem em que aparecem (da mais recente para a mais antiga):
//   id       chave da cor (--docencia-<id>, no theme.css) e da observação
//            (lattes.docencia.observacoes.<id>, no i18n.js)
//   nome     nome completo, mostrado no título da tabela
//   sigla    nome curto, usado nos gráficos
//
// Disciplinas:
//   id           chave do nome em inglês (lattes.docencia.disciplinas.<id>);
//                sem a chave, aparece o nome em português
//   nome         nome da disciplina
//   instituicao  id da instituição
//   cursos       chaves de lattes.cursos (uma disciplina pode ser de vários)
//   modalidade   "ead", "bootcamp" ou "curso_livre": entra junto do nome do
//                curso (lattes.docencia.modalidades.<modalidade>)
//   modulo       módulo do curso em que a disciplina era dada
//                (lattes.docencia.modulos.<modulo>)
//   semestres    lista de "AAAA.S" (1 = jan–jun, 2 = jul–dez), feita com
//                semestres(inicio, fim); semestres soltos podem ser somados
//   meses        ["AAAA-MM", "AAAA-MM"], para curso livre (Trybe), no lugar
//                de semestres
//   turmas       quantas turmas tiveram a disciplina, quando o curso não é
//                semestral (Trybe: a coluna vira "Qtd. de Turmas")
//   repo         repositório da disciplina em github.com/joaopauloaramuni

export const GITHUB = "https://github.com/joaopauloaramuni";

// semestres("2024.2", "2026.1") → ["2024.2", "2025.1", "2025.2", "2026.1"]
function semestres(inicio, fim = inicio) {
  const toIndex = (s) => {
    const [ano, sem] = s.split(".").map(Number);
    return ano * 2 + (sem - 1);
  };
  const lista = [];
  for (let i = toIndex(inicio); i <= toIndex(fim); i++) {
    lista.push(`${Math.floor(i / 2)}.${(i % 2) + 1}`);
  }
  return lista;
}

export const instituicoes = [
  { id: "puc", nome: "Pontifícia Universidade Católica de Minas Gerais - PUC Minas", sigla: "PUC Minas" },
  { id: "newton", nome: "Centro Universitário Newton Paiva", sigla: "Newton Paiva" },
  { id: "igti", nome: "Instituto de Gestão e Tecnologia da Informação (IGTI)", sigla: "IGTI" },
  { id: "trybe", nome: "Trybe", sigla: "Trybe" },
  { id: "fumec", nome: "Universidade FUMEC", sigla: "FUMEC" },
];

const CC = "ciencia_da_computacao";
const ES = "engenharia_de_software";
const SI = "sistemas_de_informacao";
const ADS = "analise_e_desenvolvimento_de_sistemas";
const REDES = "redes_de_computadores";
const ARQUITETURA = "arquitetura_de_software";
const WEB = "desenvolvimento_web";

export const disciplinas = [
  /* ---------- PUC Minas ---------- */
  {
    id: "desenvolvimento_de_interfaces_web",
    nome: "Desenvolvimento de Interfaces Web",
    instituicao: "puc",
    cursos: [CC],
    semestres: semestres("2026.2"),
    repo: "desenvolvimento-de-interfaces-web",
  },
  {
    id: "ti_front_end",
    nome: "Trabalho Interdisciplinar II: Front-End",
    instituicao: "puc",
    cursos: [CC],
    semestres: semestres("2026.2"),
    repo: "trabalho-interdisciplinar-front-end",
  },
  {
    id: "laboratorio_de_iniciacao_a_programacao",
    nome: "Laboratório de Iniciação à Programação",
    instituicao: "puc",
    cursos: [CC],
    semestres: semestres("2024.1"),
    repo: "laboratorio-de-introducao-a-programacao",
  },
  {
    id: "trabalho_de_conclusao_de_curso",
    nome: "Trabalho de Conclusão de Curso",
    instituicao: "puc",
    cursos: [ES],
    semestres: semestres("2025.1", "2026.2"),
    repo: "trabalho-de-conclusao-de-curso-ii",
  },
  {
    id: "projeto_de_software",
    nome: "Projeto de Software",
    instituicao: "puc",
    cursos: [ES],
    semestres: semestres("2024.2", "2026.1"),
    repo: "projeto-de-software",
  },
  {
    id: "laboratorio_de_desenvolvimento_de_software",
    nome: "Laboratório de Desenvolvimento de Software",
    instituicao: "puc",
    cursos: [ES],
    semestres: semestres("2024.2", "2026.1"),
    repo: "laboratorio-de-desenvolvimento-de-software",
  },
  {
    id: "laboratorio_de_experimentacao_de_software",
    nome: "Laboratório de Experimentação de Software",
    instituicao: "puc",
    cursos: [ES],
    semestres: semestres("2024.2", "2025.2"),
    repo: "laboratorio-de-experimentacao-de-software",
  },
  {
    id: "ti_aplicacoes_para_cenarios_reais",
    nome: "Trabalho Interdisciplinar III: Aplicações para Cenários Reais",
    instituicao: "puc",
    cursos: [ES],
    semestres: semestres("2024.2", "2025.2"),
    repo: "trabalho-interdisciplinar-aplicacoes-para-cenarios-reais",
  },
  {
    id: "ti_aplicacoes_distribuidas",
    nome: "Trabalho Interdisciplinar V: Aplicações Distribuídas",
    instituicao: "puc",
    cursos: [ES],
    semestres: semestres("2026.1", "2026.2"),
    repo: "trabalho-interdisciplinar-aplicacoes-distribuidas",
  },
  {
    id: "fundamentos_de_projeto_e_analise_de_algoritmos",
    nome: "Fundamentos de Projeto e Análise de Algoritmos",
    instituicao: "puc",
    cursos: [ES],
    semestres: semestres("2025.1", "2025.2"),
    repo: "fundamentos-de-projeto-e-analise-de-algoritmos",
  },
  {
    id: "ti_aplicacoes_web",
    nome: "Trabalho Interdisciplinar I: Aplicações Web",
    instituicao: "puc",
    cursos: [ES],
    semestres: semestres("2024.1", "2024.2"),
    repo: "trabalho-interdisciplinar-aplicacoes-web",
  },
  {
    id: "desenvolvimento_e_integracao_de_aplicacoes_web",
    nome: "Desenvolvimento e Integração de Aplicações Web",
    instituicao: "puc",
    cursos: [ES],
    semestres: semestres("2026.2"),
    repo: "desenvolvimento-e-integracao-de-aplicacoes-web",
  },
  {
    id: "algoritmos_e_estruturas_de_dados_i",
    nome: "Algoritmos e Estruturas de Dados I",
    instituicao: "puc",
    cursos: [ES],
    semestres: semestres("2024.1"),
    repo: "algoritmos-e-estruturas-de-dados-i",
  },

  /* ---------- Newton Paiva: as disciplinas eram ofertadas para os 3 cursos ---------- */
  {
    id: "linguagens_de_programacao",
    nome: "Linguagens de Programação",
    instituicao: "newton",
    cursos: [CC, SI, ADS],
    semestres: semestres("2023.2", "2024.1"),
    repo: "linguagens-de-programacao",
  },
  {
    id: "arquitetura_de_aplicacoes_web",
    nome: "Arquitetura de Aplicações Web",
    instituicao: "newton",
    cursos: [CC, SI, ADS],
    semestres: semestres("2024.1"),
    repo: "arquitetura-de-aplicacoes-web",
  },
  {
    id: "banco_de_dados",
    nome: "Banco de Dados",
    instituicao: "newton",
    cursos: [CC, SI, ADS],
    semestres: semestres("2023.2"),
    repo: "banco-de-dados",
  },

  /* ---------- IGTI ---------- */
  {
    id: "engenharia_de_requisitos",
    nome: "Engenharia de Requisitos",
    instituicao: "igti",
    cursos: [ARQUITETURA],
    modalidade: "bootcamp",
    semestres: semestres("2020.2"),
    repo: "engenharia-de-requisitos",
  },

  /* ---------- Trybe: curso livre, contado em meses ----------
     O módulo de Ciência da Computação com Python, do curso de
     Desenvolvimento Web, durava 2 meses e foi dado para as turmas 1 a 4
     (4 × 2 meses, de março a outubro de 2020). */
  {
    id: "estruturas_de_dados_com_python",
    nome: "Estruturas de Dados com Python",
    instituicao: "trybe",
    cursos: [WEB],
    modalidade: "curso_livre",
    modulo: "ciencia_da_computacao_com_python",
    meses: ["2020-03", "2020-10"],
    turmas: 4,
  },
  {
    id: "algoritmos_com_python",
    nome: "Algoritmos com Python",
    instituicao: "trybe",
    cursos: [WEB],
    modalidade: "curso_livre",
    modulo: "ciencia_da_computacao_com_python",
    meses: ["2020-03", "2020-10"],
    turmas: 4,
  },
  {
    id: "raspagem_de_dados_com_python",
    nome: "Raspagem de Dados com Python",
    instituicao: "trybe",
    cursos: [WEB],
    modalidade: "curso_livre",
    modulo: "ciencia_da_computacao_com_python",
    meses: ["2020-03", "2020-10"],
    turmas: 4,
  },

  /* ---------- Universidade FUMEC ---------- */
  {
    id: "trabalho_de_conclusao_de_curso",
    nome: "Trabalho de Conclusão de Curso",
    instituicao: "fumec",
    cursos: [CC],
    semestres: semestres("2016.2", "2020.1"),
    repo: "trabalho-de-conclusao-de-curso-ii",
  },
  {
    id: "fundamentos_teoricos_da_computacao",
    nome: "Fundamentos Teóricos da Computação",
    instituicao: "fumec",
    cursos: [CC],
    semestres: semestres("2016.2", "2019.2"),
    repo: "fundamentos-teoricos-da-computacao",
  },
  {
    id: "compiladores_com_cpp",
    nome: "Compiladores com C++",
    instituicao: "fumec",
    cursos: [CC],
    semestres: semestres("2017.2", "2020.1"),
    repo: "compiladores",
  },
  {
    id: "poo_com_java",
    nome: "Programação Orientada a Objetos com Java",
    instituicao: "fumec",
    cursos: [CC],
    semestres: semestres("2017.2", "2020.1"),
    repo: "poo",
  },
  {
    id: "desenvolvimento_de_scripts_ii",
    nome: "Desenvolvimento de Scripts II com ShellScript",
    instituicao: "fumec",
    cursos: [REDES],
    semestres: semestres("2016.1", "2018.1"),
    repo: "desenvolvimento-de-scripts-ii",
  },
  {
    id: "desenvolvimento_de_scripts_i",
    nome: "Desenvolvimento de Scripts I com VBScript",
    instituicao: "fumec",
    cursos: [REDES],
    semestres: semestres("2016.1", "2017.1"),
    repo: "desenvolvimento-de-scripts-i",
  },
  {
    id: "engenharia_de_software_ii",
    nome: "Engenharia de Software II",
    instituicao: "fumec",
    cursos: [SI],
    modalidade: "ead",
    semestres: [...semestres("2018.1"), ...semestres("2019.1")],
  },
  {
    id: "introducao_a_programacao_web",
    nome: "Introdução à Programação Web",
    instituicao: "fumec",
    cursos: [SI],
    modalidade: "ead",
    semestres: semestres("2018.2"),
  },
];

// Cargos em cada instituição, como no LinkedIn. Só a Trybe tem: depois dos
// 8 meses lecionando, passei para cargos de coordenação e liderança, até
// junho de 2023. Eles entram no tempo total da instituição (linha do tempo,
// cards e "tempo por instituição"), mas não no tempo lecionando.
//   id          chave do nome em inglês (lattes.docencia.cargos.<id>)
//   nome        nome do cargo em português
//   meses       ["AAAA-MM", "AAAA-MM"], como no LinkedIn: o mês da troca de
//               cargo aparece nos dois (na soma, conta uma vez só)
//   lecionando  true no cargo em que eu dava as aulas das disciplinas
export const cargos = [
  {
    id: "cs_specialist_instructor",
    instituicao: "trybe",
    nome: "Especialista em Instrução de Ciência da Computação",
    meses: ["2020-03", "2020-10"],
    lecionando: true,
  },
  {
    id: "backend_cs_lead_instructor",
    instituicao: "trybe",
    nome: "Liderança de Instrução de Back-end e Ciência da Computação",
    meses: ["2020-10", "2021-04"],
  },
  {
    id: "cs_lead_instructor",
    instituicao: "trybe",
    nome: "Liderança de Instrução de Ciência da Computação",
    meses: ["2021-04", "2022-08"],
  },
  {
    id: "cs_curriculum_lead_tech_lead",
    instituicao: "trybe",
    nome: "Líder de Currículo e Líder Técnico de Ciência da Computação",
    meses: ["2022-08", "2023-03"],
  },
  {
    id: "cs_curriculum_tech_lead",
    instituicao: "trybe",
    nome: "Líder Técnico de Currículo de Ciência da Computação",
    meses: ["2023-03", "2023-06"],
  },
];
