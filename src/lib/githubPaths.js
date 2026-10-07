// Caminhos da GitHub API que o site usa, montados num lugar só.
//
// O navegador monta as chamadas com estas funções (lib/githubStats.js e
// ProjetosGitHub.jsx), e o proxy /api/github (api/_github.js) só aceita
// exatamente estes caminhos. Antes ele aceitava qualquer variação que
// começasse do jeito certo (/users/<usuário>?x=1, ?x=2...): cada variação era
// uma URL nova para a CDN, que não tinha nada em cache, e cada uma gastava
// uma chamada do limite do token. Agora o conjunto é fechado: perfil,
// repositórios (até MAX_REPO_PAGES páginas), as buscas de PRs, issues e
// commits (com as datas de hoje) e as linguagens de cada repositório.
//
// Este arquivo também roda no Node (Vercel Function e vite.config.js): não lê
// import.meta.env e importa com a extensão .js.

import GITHUB_API_CONFIG from "../config/gitHubApiConfig.js";
import GITHUB_STATS_CONFIG from "../config/gitHubStatsConfig.js";

const { USERNAME, PER_PAGE } = GITHUB_API_CONFIG;
const { TIME_ZONE } = GITHUB_STATS_CONFIG;

// Repositórios: até 10 páginas de 100 (1.000 repositórios)
export const MAX_REPO_PAGES = 10;

// Nome de repositório válido no GitHub ("." e ".." não valem)
export const REPO_NAME = /^(?!\.\.?$)[\w.-]{1,100}$/;

/* =====================================================================
   Datas no fuso configurado
   ===================================================================== */

// Date → "2026-10-03" no fuso do config (o "hoje" de Belo Horizonte)
export const dateKey = (date, timeZone = TIME_ZONE) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

// "2026-10-03" + 1 → "2026-10-04". Meio-dia UTC: nenhum fuso muda o dia.
export function addDays(key, days) {
  const date = new Date(`${key}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// 0 = domingo … 6 = sábado
export const weekdayOf = (key) => new Date(`${key}T12:00:00Z`).getUTCDay();

// Divide o intervalo [from, to] em `parts` pedaços de dias seguidos
export function splitDays(from, to, parts) {
  const total =
    Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 864e5) + 1;
  const size = Math.ceil(total / parts);
  const ranges = [];
  for (let start = 0; start < total; start += size) {
    ranges.push({
      from: addDays(from, start),
      to: addDays(from, Math.min(start + size, total) - 1),
    });
  }
  return ranges;
}

// Os últimos 12 meses, até hoje: [hoje - 364, hoje]
export const lastYear = (today) => ({ from: addDays(today, -364), to: today });

// Os horários dos commits saem de 4 buscas de 100 commits, uma por trimestre
export const COMMIT_CLOCK_PARTS = 4;

/* =====================================================================
   Caminhos
   ===================================================================== */

const commitSearch = ({ from, to }, perPage) =>
  `/search/commits?q=author:${USERNAME}+author-date:${from}..${to}&per_page=${perPage}`;

export const githubPaths = {
  // Comando "github": os repositórios mais recentes
  recentRepos: () => `/users/${USERNAME}/repos?sort=updated&per_page=${PER_PAGE}`,

  // Comando "stats"
  user: () => `/users/${USERNAME}`,
  repos: (page) => `/users/${USERNAME}/repos?type=owner&sort=pushed&per_page=100&page=${page}`,
  languages: (repo) => `/repos/${USERNAME}/${repo}/languages`,
  pullRequests: () => `/search/issues?q=author:${USERNAME}+type:pr&per_page=1`,
  issues: () => `/search/issues?q=author:${USERNAME}+type:issue&per_page=1`,
  commitCount: (today) => commitSearch(lastYear(today), 1),
  commitClock: (today) => {
    const { from, to } = lastYear(today);
    return splitDays(from, to, COMMIT_CLOCK_PARTS).map((range) => commitSearch(range, 100));
  },
};

// Todos os caminhos fixos que o site pede num dia (as linguagens, que
// dependem do nome do repositório, o proxy confere à parte). O proxy aceita
// as datas de ontem, hoje e amanhã: o relógio do visitante pode estar
// adiantado ou atrasado em relação ao do servidor perto da meia-noite.
export function allowedPaths(now = new Date()) {
  const today = dateKey(now);
  const days = [addDays(today, -1), today, addDays(today, 1)];
  return new Set([
    githubPaths.recentRepos(),
    githubPaths.user(),
    ...Array.from({ length: MAX_REPO_PAGES }, (_, i) => githubPaths.repos(i + 1)),
    githubPaths.pullRequests(),
    githubPaths.issues(),
    ...days.flatMap((day) => [githubPaths.commitCount(day), ...githubPaths.commitClock(day)]),
  ]);
}

// "/repos/<usuário>/<repo>/languages" → "<repo>" (ou null)
export function languagesRepo(path) {
  const prefix = `/repos/${USERNAME}/`;
  const suffix = "/languages";
  if (!path.startsWith(prefix) || !path.endsWith(suffix)) return null;
  const repo = path.slice(prefix.length, -suffix.length);
  return REPO_NAME.test(repo) ? repo : null;
}
