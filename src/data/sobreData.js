import {
  AE,
  AR,
  BR,
  CH,
  CN,
  DE,
  FR,
  HK,
  ID,
  IT,
  JP,
  KR,
  MO,
  MY,
  SG,
  TH,
  UY,
  VA,
} from "country-flag-icons/react/3x2";

// Dados do comando "sobre".
//
// Aqui ficam só a estrutura, os links, os anos e os logos. Os textos
// (cargos, descrições, nomes traduzidos) ficam no i18n, em sobre.<seção>.<id>.
// As disciplinas NÃO ficam aqui: vêm do docenciaData.js (o mesmo do
// "lattes --docencia"), então o sobre sempre mostra a lista atualizada.

// Início da contagem dos anos de mercado: Banco do Brasil, como no README do
// GitHub (14 anos em 2026). A Álamo TI (2011) aparece na trajetória, mas
// fica fora da conta; troque para 2011 para contar a partir dela.
export const DEV_DESDE = 2012;

// Data de nascimento: a idade do cabeçalho é calculada a partir dela
export const NASCIMENTO = { ano: 1990, mes: 12, dia: 21 };

// Mesmos números do "lattes" (lattesData.js, gerado do XML do Lattes). Ficam
// fixos aqui para o sobre não baixar os ~90 kB do lattes: atualize junto.
export const TCCS_ORIENTADOS = 40;
export const BANCAS = 75;

// Agência Experimental de Software
export const AES = { times: 7, pessoas: 35 };

// Comandos com nome em português e o alias em inglês (ver commands.js),
// para as dicas "$ comando" aparecerem no idioma da página
export const COMANDO_EN = {
  experiencias: "experience",
  habilidades: "skills",
  premios: "awards",
  recomendacoes: "recommendations",
  projetos: "projects",
  curriculo: "resume",
  contato: "contact",
};

// O que faço hoje (sobre.hoje.<id>.cargo | org | detalhe)
//   logo   imagem em /public; sem logo, usa o ícone na cor `cor`
export const hoje = [
  {
    id: "puc",
    logo: "/logos/puc.jpg",
    url: "https://www.pucminas.br/",
  },
  {
    id: "aes",
    logo: "/logos/aes.jpg",
    url: "https://icei.pucminas.br/aes/",
  },
  {
    id: "jedis",
    logo: "/logos/jedis.jpeg",
    url: "https://www.jedis.com.br/",
  },
];

// "Programador por profissão, professor por vocação": a atuação em duas
// colunas, da mais recente para a mais antiga (sobre.trajetoria.<id>.cargo |
// org | detalhe). fim: null → "hoje". Sem url, a organização fica sem link.
// meses: [início, fim] para um período dentro do mesmo ano ("mar – out 2020").
export const trajetoria = {
  profissao: [
    {
      id: "jedis",
      inicio: 2025,
      fim: null,
      logo: "/logos/jedis.jpeg",
      url: "https://www.jedis.com.br/",
    },
    {
      id: "in8_manager",
      inicio: 2023,
      fim: 2023,
      logo: "/logos/in8.jpeg",
      url: "https://in8.com.br/",
    },
    {
      id: "trybe",
      inicio: 2020,
      fim: 2023,
      logo: "/logos/trybe.jpeg",
      url: "https://www.betrybe.com/",
    },
    { id: "in8_dev", inicio: 2019, fim: 2020, logo: "/logos/in8.jpeg", url: "https://in8.com.br/" },
    {
      id: "capgemini",
      inicio: 2013,
      fim: 2017,
      logo: "/logos/capgemini.jpeg",
      url: "https://www.capgemini.com/br-pt/",
    },
    {
      id: "bb",
      inicio: DEV_DESDE,
      fim: 2013,
      logo: "/logos/bb.png",
      url: "https://www.bb.com.br/",
    },
    { id: "alamo", inicio: 2011, fim: 2011, logo: "/logos/alamoti.jpeg" },
  ],
  vocacao: [
    { id: "puc", inicio: 2024, fim: null, logo: "/logos/puc.jpg", url: "https://www.pucminas.br/" },
    {
      id: "newton",
      inicio: 2023,
      fim: 2024,
      logo: "/logos/newton.jpg",
      url: "https://newtonpaiva.br/",
    },
    {
      id: "xpe",
      inicio: 2020,
      fim: 2021,
      logo: "/logos/xpe.jpeg",
      url: "https://www.xpeducacao.com.br/",
    },
    {
      id: "trybe_instrucao",
      inicio: 2020,
      fim: 2020,
      meses: [3, 10],
      logo: "/logos/trybe.jpeg",
      url: "https://www.betrybe.com/",
    },
    { id: "fumec", inicio: 2016, fim: 2020, logo: "/logos/fumec.jpg", url: "http://www.fumec.br/" },
  ],
};

// Formação, separada da atuação (sobre.formacao.<id>.nivel | curso | org).
//   trabalho  trabalho final: tipo (sobre.formacao.tipos.<tipo>), título
//             original em português, link e orientador; tituloEn é a
//             tradução mostrada na página em inglês. Os PDFs e os slides das defesas estão no
//             repositório TRABALHOS_FINAIS.
//             quebrarApos / quebrarAposEn: trechos do título depois dos
//             quais a linha quebra, em ordem (o texto continua inteiro,
//             para o ask.mjs)
//   modulos   chaves de sobre.formacao.<id>.modulos.<modulo>
//   logo      imagem em /public; sem logo, usa o ícone na cor `cor`
const FUMEC_PPG =
  "https://www.fumec.br/pos-graduacao-em-tecnologia-da-informacao-e-comunicacao-e-gestao-do-conhecimento";

export const TRABALHOS_FINAIS = "https://github.com/joaopauloaramuni/trabalhos-finais";

const LUIZ_MAIA = {
  nome: "Prof. Dr. Luiz Cláudio Gomes Maia",
  url: "http://lattes.cnpq.br/6502942873335887",
};

export const formacao = [
  {
    id: "doutorado",
    inicio: 2017,
    fim: 2020,
    logo: "/logos/fumec.jpg",
    url: FUMEC_PPG,
    trabalho: {
      tipo: "tese",
      quebrarApos: ["conhecimento:", "exerce na gestão do conhecimento"],
      titulo:
        "Gestão ágil do conhecimento: uma análise da influência que a filosofia ágil exerce na gestão do conhecimento em organizações do segmento de tecnologia da informação",
      url: "https://repositorio.fumec.br/handle/123456789/878",
      orientador: LUIZ_MAIA,
      tituloEn:
        "Agile knowledge management: an analysis of the influence that the agile philosophy has on knowledge management in organizations in the information technology sector",
      quebrarAposEn: ["management:", "has on knowledge management"],
    },
  },
  {
    id: "mestrado",
    inicio: 2014,
    fim: 2015,
    logo: "/logos/fumec.jpg",
    url: FUMEC_PPG,
    trabalho: {
      tipo: "dissertacao",
      quebrarApos: ["informação:"],
      titulo:
        "Análise da adoção do Lean Manufacturing na gestão de projetos de tecnologia da informação: estudo de caso em uma multinacional desse segmento",
      url: "https://repositorio.fumec.br/handle/123456789/270",
      orientador: LUIZ_MAIA,
      tituloEn:
        "Analysis of the adoption of Lean Manufacturing in information technology project management: a case study in a multinational company in this sector",
      quebrarAposEn: ["management:"],
    },
  },
  {
    id: "graduacao",
    inicio: 2010,
    fim: 2013,
    logo: "/logos/fumec.jpg",
    url: "https://processoseletivo.fumec.br/curso/ciencia-da-computacao/",
    trabalho: {
      tipo: "monografia",
      titulo: "Desenvolvimento ágil de aplicações web",
      url: `${TRABALHOS_FINAIS}/blob/main/BACHARELADO/Monografia.pdf`,
      orientador: {
        nome: "Prof. Dr. Flávio Velloso Laper",
        url: "http://lattes.cnpq.br/7122929836289475",
      },
      tituloEn: "Agile development of web applications",
    },
  },
  {
    id: "pdl",
    inicio: 2022,
    fim: 2022,
    logo: "/logos/fdc.jpg",
    url: "https://www.fdc.org.br/",
    modulos: ["lideres_de_lideres", "lideres_de_equipes"],
  },
];

// Artigos publicados em periódicos (do mais recente para o mais antigo).
// Título e periódico originais em português; `tituloEn` e `periodicoEn` são
// as traduções mostradas na página em inglês. Periódico que já tem nome em
// inglês ou latim (RSD, Acta) não precisa de `periodicoEn`.
//   capa  imagem em /public/artigos (300px de largura, proporção ~3:4)
export const artigos = [
  {
    id: "conexao",
    ano: 2022,
    titulo:
      "A relevância da inclusão digital para idosos nas publicações científicas: uma revisão a partir do indexador SCOPUS",
    tituloEn:
      "The relevance of digital inclusion for older adults in scientific publications: a review based on the SCOPUS index",
    periodico: "Conexão: Comunicação e Cultura",
    periodicoEn: "Connection: Communication and Culture",
    url: "https://sou.ucs.br/etc/revistas/index.php/conexao/article/view/7781",
    capa: "/artigos/conexao.jpg",
  },
  {
    id: "rsd",
    ano: 2020,
    titulo:
      "Vulnerabilidades em redes Wi-Fi de instituições de ensino superior: um estudo de múltiplos casos",
    tituloEn:
      "Vulnerabilities in Wi-Fi networks of higher education institutions: a multiple case study",
    periodico: "Research, Society and Development",
    url: "https://rsdjournal.org/index.php/rsd/article/view/1979",
    capa: "/artigos/rsd.jpg",
  },
  {
    id: "tecnologia_cultura",
    ano: 2020,
    titulo:
      "Gestão ágil da memória organizacional: mudança na cultura da organização para melhor aproveitamento do capital intelectual",
    tituloEn:
      "Agile management of organizational memory: changing the organization's culture to make better use of intellectual capital",
    periodico: "Tecnologia & Cultura (CEFET/RJ)",
    periodicoEn: "Technology & Culture (CEFET/RJ)",
    url: "https://www.cefet-rj.br/attachments/article/195/revista36_ago-dez2020_compressed.pdf",
    capa: "/artigos/tecnologia-cultura.jpg",
  },
  {
    id: "gestao_aprendizagem",
    ano: 2020,
    titulo:
      "Proposta de um framework para a construção de uma arquitetura de dados empresarial: um estudo de caso em uma empresa farmacêutica",
    tituloEn:
      "A framework proposal for building an enterprise data architecture: a case study in a pharmaceutical company",
    periodico: "Gestão & Aprendizagem (UFPB)",
    periodicoEn: "Management & Learning (UFPB)",
    url: "https://periodicos.ufpb.br/index.php/mpgoa/article/view/43707/30214",
    capa: "/artigos/gestao-aprendizagem.jpg",
  },
  {
    id: "atoz",
    ano: 2020,
    titulo:
      "O impacto da engenharia social na segurança da informação: uma abordagem orientada à gestão corporativa",
    tituloEn:
      "The impact of social engineering on information security: a corporate management approach",
    periodico: "AtoZ: Novas Práticas em Informação e Conhecimento",
    periodicoEn: "AtoZ: New Practices in Information and Knowledge",
    url: "https://revistas.ufpr.br/atoz/article/view/64640",
    capa: "/artigos/atoz.jpg",
  },
  {
    id: "ci",
    ano: 2019,
    titulo:
      "Filosofia ágil aplicada à gestão do conhecimento: um mapeamento sistemático da literatura",
    tituloEn:
      "Agile philosophy applied to knowledge management: a systematic literature mapping",
    periodico: "Ciência da Informação (IBICT)",
    periodicoEn: "Information Science (IBICT)",
    url: "https://revista.ibict.br/ciinf/article/view/4407",
    capa: "/artigos/ci.jpg",
  },
  {
    id: "edtech",
    ano: 2018,
    titulo:
      "O impacto da tecnologia da informação no ensino superior: desafios da ubiquidade na aprendizagem estudantil",
    tituloEn:
      "The impact of information technology on higher education: challenges of ubiquity in student learning",
    periodico: "Educação & Tecnologia (CEFET-MG)",
    periodicoEn: "Education & Technology (CEFET-MG)",
    url: "https://periodicos.cefetmg.br/index.php/revista-et/article/view/768",
    capa: "/artigos/edtech.jpg",
  },
  {
    id: "gtp",
    ano: 2018,
    titulo:
      "Análise da adoção do Lean Manufacturing na gestão de projetos de tecnologia da informação: estudo de caso em uma multinacional desse segmento",
    tituloEn:
      "Analysis of the adoption of Lean Manufacturing in information technology project management: a case study in a multinational company in this sector",
    periodico: "Gestão & Tecnologia de Projetos (USP)",
    periodicoEn: "Design Management and Technology (USP)",
    url: "https://www.revistas.usp.br/gestaodeprojetos/article/view/105650",
    capa: "/artigos/gtp.jpg",
  },
  {
    id: "acta",
    ano: 2018,
    titulo:
      "A influência da engenharia semiótica na experiência do usuário de aplicativos mobile: uma reflexão sobre a relação entre semiose e o desenvolvimento de apps",
    tituloEn:
      "The influence of semiotic engineering on the user experience of mobile applications: a reflection on the relationship between semiosis and the development of apps",
    periodico: "Acta Semiotica et Lingvistica",
    url: "https://periodicos.ufpb.br/ojs2/index.php/actas/article/view/43701",
    capa: "/artigos/acta.jpg",
  },
  {
    id: "sigc",
    ano: 2014,
    titulo:
      "Impactos da implantação do Lean Manufacturing na gestão de projetos de tecnologia da informação: estudo de caso em uma multinacional do segmento de T.I.",
    tituloEn:
      "Impacts of implementing Lean Manufacturing in information technology project management: a case study in a multinational IT company",
    periodico: "Projetos, Dissertações e Teses em Sistemas de Informação e Gestão do Conhecimento (FUMEC)",
    periodicoEn:
      "Projects, Dissertations and Theses in Information Systems and Knowledge Management (FUMEC)",
    url: "https://repositorio.fumec.br/handle/123456789/2/discover?query=Aramuni",
    capa: "/artigos/sigc.jpg",
  },
];

// Vivência (sobre.vivencia.<id>)
export const vivencia = [
  { id: "docencia" },
  { id: "lideranca" },
  { id: "desenvolvimento" },
  { id: "documentacao" },
  { id: "implantacao" },
  { id: "legado" },
  { id: "design_patterns" },
  { id: "scrum", url: "https://www.scrum.org/" },
  { id: "lean", url: "https://www.lean.org.br/" },
];

// Empresas e instituições para as quais já desenvolvi software, na ordem do
// README do GitHub (sobre.clientes.<id>.nome | desc; desc aparece no title)
export const clientes = [
  { id: "oi", url: "https://www.oi.com.br/" },
  { id: "anp", url: "https://www.gov.br/anp" },
  { id: "bb", url: "https://www.bb.com.br/" },
  { id: "vsb", url: "https://brazil.vallourec.com/" },
  { id: "prosegur", url: "https://www.prosegur.com.br/" },
  { id: "hotmilhas", url: "https://hotmilhas.com.br/" },
  { id: "123milhas", url: "https://123milhas.com/" },
  { id: "jedis", url: "https://www.jedis.com.br/" },
  { id: "mereo", url: "https://www.mereo.com/" },
  { id: "afya", url: "https://institucional.afya.com.br/" },
  { id: "autoglass", url: "https://www.autoglassonline.com.br/" },
  { id: "allos", url: "https://allos.com.br/" },
  { id: "bhtec", url: "https://bhtec.org.br/" },
  { id: "mrv", url: "https://www.mrv.com.br/" },
  { id: "pmmg", url: "https://www.policiamilitar.mg.gov.br/" },
  { id: "apac", url: "https://www.instagram.com/apacfemininabh/" },
  { id: "mario_penna", url: "https://mariopenna.org.br/" },
  {
    id: "fisioterapia",
    url: "https://www.pucminas.br/ServicosComunidade/paginas/centro-clinico-de-fisioterapia.aspx",
  },
  {
    id: "enfermagem",
    url: "https://www.pucminas.br/campus/coracao-eucaristico/ensino/graduacao/Paginas/Enfermagem.aspx",
  },
  { id: "icei", url: "https://icei.pucminas.br/" },
];

/* ---------- Fora do terminal ---------- */

export const GALO_URL = "https://www.arenamrv.com.br/";

// Hobbies (sobre.pessoal.hobbies.<id>); o ícone é escolhido no SobreMim.jsx
export const hobbies = [
  { id: "mu", url: "https://muonline.webzen.com/pt" },
  { id: "tibia", url: "https://www.demolidores.com.br/" },
  { id: "basquete", url: "https://olympico.com.br/esportes/basquete/" },
  { id: "violao" },
];

// Séries: nomes originais, não traduzidos
export const serieFavorita = { nome: "The IT Crowd", url: "https://www.imdb.com/title/tt0487831/" };

export const assistindo = [
  { nome: "Foundation", url: "https://www.imdb.com/title/tt0804484/" },
  { nome: "Dune: Prophecy", url: "https://www.imdb.com/title/tt10466872/" },
  { nome: "Silo", url: "https://www.imdb.com/title/tt14688458/" },
  { nome: "From", url: "https://www.imdb.com/title/tt9813792/" },
  { nome: "The Penguin", url: "https://www.imdb.com/title/tt15435876/" },
  { nome: "Dope Thief", url: "https://www.imdb.com/title/tt21638826/" },
];

// Lugares que já visitei, por continente, na ordem em que aparecem.
//   id        chave do nome (sobre.pessoal.lugares.<id>)
//   sigla     código ISO do país, no title da bandeira (Dubai e Abu Dhabi
//             são dois emirados dos Emirados Árabes Unidos: os dois são AE)
//   Bandeira  componente do country-flag-icons; importe o novo país lá em
//             cima (import nomeado: só as bandeiras usadas entram no bundle)
//   cor       token da cor do continente (barra e legenda)
export const continentes = [
  {
    id: "america_do_sul",
    cor: "--success",
    lugares: [
      { id: "brasil", sigla: "BR", Bandeira: BR },
      { id: "argentina", sigla: "AR", Bandeira: AR },
      { id: "uruguai", sigla: "UY", Bandeira: UY },
    ],
  },
  {
    id: "europa",
    cor: "--info",
    lugares: [
      { id: "alemanha", sigla: "DE", Bandeira: DE },
      { id: "franca", sigla: "FR", Bandeira: FR },
      { id: "italia", sigla: "IT", Bandeira: IT },
      { id: "vaticano", sigla: "VA", Bandeira: VA },
      { id: "suica", sigla: "CH", Bandeira: CH },
    ],
  },
  {
    id: "asia",
    cor: "--highlight",
    lugares: [
      { id: "japao", sigla: "JP", Bandeira: JP },
      { id: "coreia_do_sul", sigla: "KR", Bandeira: KR },
      { id: "china", sigla: "CN", Bandeira: CN },
      { id: "hong_kong", sigla: "HK", Bandeira: HK },
      { id: "macau", sigla: "MO", Bandeira: MO },
      { id: "tailandia", sigla: "TH", Bandeira: TH },
      { id: "indonesia", sigla: "ID", Bandeira: ID },
      { id: "singapura", sigla: "SG", Bandeira: SG },
      { id: "malasia", sigla: "MY", Bandeira: MY },
      { id: "dubai", sigla: "AE", Bandeira: AE },
      { id: "abu_dhabi", sigla: "AE", Bandeira: AE },
    ],
  },
];

// Links do rodapé "veja também"
export const vejaTambem = [
  "experiencias",
  "lattes",
  "premios",
  "recomendacoes",
  "projetos",
  "curriculo",
  "contato",
];
