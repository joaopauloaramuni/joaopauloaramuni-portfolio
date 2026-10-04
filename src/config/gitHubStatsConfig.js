// gitHubStatsConfig.js
// Comando "stats": estatísticas do GitHub buscadas ao vivo, no navegador do
// visitante (ver lib/githubStats.js). Fontes:
//   • GitHub REST API          → perfil, repositórios, estrelas, forks, seguidores,
//                                linguagens, PRs, issues e commits (busca)
//   • github-contributions-api → calendário de contribuições (total e sequências)
//   • komarev.com/ghpvc        → visitas ao perfil (só lê: o contador só soma
//                                quando quem pede é o proxy de imagens do GitHub)
//   • views-counter.vercel.app → visitas dos repositórios com o badge RepoViews
//                                (ATENÇÃO: cada leitura soma +1 no contador)
//
// O komarev e o views-counter não liberam CORS, então o navegador chama um
// caminho do próprio site e quem repassa é:
//   • npm run dev / preview → proxy do vite.config.js (lê este arquivo)
//   • Vercel                → rewrites do vercel.json (troque o usuário lá também)
//
// A URL da GitHub API e o token (VITE_GITHUB_TOKEN) vêm do gitHubApiConfig.js.
// Com o token, as linguagens são somadas por bytes de código (GraphQL); sem
// ele, pela linguagem principal de cada repositório.
// Este arquivo não lê import.meta.env porque o vite.config.js também o importa.

// Mesmo usuário do gitHubApiConfig.js
const USERNAME = "joaopauloaramuni";

// Início do pageId dos badges RepoViews, codificado como nos READMEs
const README_PAGE_ID = `https%3A%2F%2Fgithub%2Ecom%2F${USERNAME}`;

const GITHUB_STATS_CONFIG = {
  USERNAME,
  PROFILE_URL: `https://github.com/${USERNAME}`,

  // Fuso usado nos horários dos commits e no "hoje" das sequências
  TIME_ZONE: "America/Sao_Paulo",

  // Calendário público de contribuições (com CORS, sem chave)
  CONTRIBUTIONS_URL: `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=all`,

  // Caminhos do próprio site que o proxy repassa (vite.config.js e vercel.json)
  PROFILE_VIEWS_PATH: "/api/github/profile-views",
  REPO_VIEWS_PATH: "/api/github/repo-views",

  // Repositórios que não entram nas estatísticas (comparação pelo início do nome)
  HIDDEN_REPO_PREFIXES: ["trybe"],

  // Repositórios com o badge RepoViews no README: só eles aparecem no
  // "stats --repos". Ao colocar o badge num repositório, acrescente o nome aqui.
  REPO_VIEWS_REPOS: [
    "algoritmos-e-estruturas-de-dados-i",
    "arquitetura-de-aplicacoes-web",
    "banco-de-dados",
    "cartas-de-recomendacao",
    "compiladores",
    "desenvolvimento-de-interfaces-web",
    "desenvolvimento-de-scripts-i",
    "desenvolvimento-de-scripts-ii",
    "desenvolvimento-e-integracao-de-aplicacoes-web",
    "fundamentos-de-projeto-e-analise-de-algoritmos",
    "fundamentos-teoricos-da-computacao",
    "github",
    "joaopauloaramuni-portfolio",
    "joaopauloaramuni.github.io",
    "laboratorio-de-desenvolvimento-de-software",
    "laboratorio-de-experimentacao-de-software",
    "laboratorio-de-iniciacao-a-programacao",
    "linguagens-de-programacao",
    "pdf-translator",
    "poo",
    "projeto-de-software",
    "python",
    "trabalho-de-conclusao-de-curso-ii",
    "trabalho-interdisciplinar-aplicacoes-distribuidas",
    "trabalho-interdisciplinar-aplicacoes-para-cenarios-reais",
    "trabalho-interdisciplinar-aplicacoes-web",
    "trabalho-interdisciplinar-front-end",
    "trabalhos-finais",
  ],

  // Quantos contadores de repositório são lidos ao mesmo tempo
  REPO_VIEWS_CONCURRENCY: 6,

  // Quantos itens cada gráfico mostra (o resto vira "+ N linguagens")
  LIMITS: {
    languages: 12,
  },
};

export const hasRepoViewsBadge = (repo) =>
  GITHUB_STATS_CONFIG.REPO_VIEWS_REPOS.includes(repo);

// O pageId vai na URL exatamente como está no badge do README, já codificado
// (https%3A%2F%2Fgithub%2Ecom%2F<usuário>%2F<repo>): o views-counter guarda
// cada forma de codificar como um contador diferente. Não codificar de novo.
export const repoViewsPageId = (repo) => `${README_PAGE_ID}%2F${repo}`;

export default GITHUB_STATS_CONFIG;
