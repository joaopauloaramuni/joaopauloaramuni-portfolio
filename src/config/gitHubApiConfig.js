// gitHubApiConfig.js
// Comandos "github" e "stats". O token do GitHub não fica aqui: ele é lido só
// no servidor (GITHUB_SITE_TOKEN), pela Vercel Function api/github.js e pelo
// vite.config.js no npm run dev. Quando precisa dele, o navegador chama
// PROXY_PATH (/api/github?path=...) no próprio domínio.
// Este arquivo não lê import.meta.env porque o api/_github.js (Node) também
// o importa.
const GITHUB_API_CONFIG = {
  USERNAME: "joaopauloaramuni",
  BASE_URL: "https://api.github.com",
  PROXY_PATH: "/api/github",
  PER_PAGE: 100, // quantidade máxima de repositórios por página
};

export default GITHUB_API_CONFIG;
