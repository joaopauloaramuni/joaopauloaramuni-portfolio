import {
  fetchGitHub as github,
  fetchGitHubGraphQL,
  GitHubProxyUnavailableError,
  GitHubRateLimitError,
} from "./githubApi";
import GITHUB_STATS_CONFIG, {
  repoViewsPageId,
  hasRepoViewsBadge,
} from "../config/gitHubStatsConfig";
import {
  addDays,
  dateKey,
  githubPaths,
  lastYear,
  MAX_REPO_PAGES,
  weekdayOf,
} from "./githubPaths";

// Busca e calcula as estatísticas do comando "stats" (ver config/gitHubStatsConfig.js).
//
// Cada fonte é buscada uma vez por visita, como no lib/wakatime.js: trocar de
// gráfico (stats --resumo → --atividade) reaproveita os dados. Se der erro, o
// cache é limpo para tentar de novo no próximo comando. As fontes que dependem
// do "hoje" (contribuições, sequências, buscas dos últimos 12 meses) vencem
// quando o dia muda em Belo Horizonte: com a aba aberta depois da meia-noite,
// o próximo "stats" busca de novo, em vez de continuar no dia anterior.
//
// Limites da GitHub API sem token, por IP do visitante: 60 chamadas por hora e
// 10 buscas (/search) por minuto. Uma visita que abre todos os gráficos usa
// 2 chamadas comuns e 7 buscas. Com o token do site (GITHUB_SITE_TOKEN, que
// fica só no servidor e é usado pelo proxy /api/github, ver lib/githubApi.js):
//   • as linguagens saem por bytes de código, numa chamada só (GraphQL);
//   • as outras chamadas continuam sem token (o limite por IP é do visitante)
//     e só repetem pelo proxy se o limite do IP acabar, como numa rede
//     compartilhada de faculdade. O limite do token (5.000/h e 30 buscas/min)
//     é dividido por todos os visitantes, por isso ele fica de reserva.
const {
  TIME_ZONE,
  CONTRIBUTIONS_URL,
  PROFILE_VIEWS_PATH,
  REPO_VIEWS_PATH,
  HIDDEN_REPO_PREFIXES,
  REPO_VIEWS_CONCURRENCY,
} = GITHUB_STATS_CONFIG;

// Erro específico para o limite da GitHub API (o painel mostra outra mensagem)
export { GitHubRateLimitError };

/* =====================================================================
   Cache por visita
   ===================================================================== */

// Guarda a promessa da busca e o resultado. Buscas demoradas avisam o
// progresso (ex.: 12 de 43 repositórios) para quem estiver inscrito.
// daily: o resultado vale só no dia (em BH) em que foi buscado.
function createSource(loader, { daily = false } = {}) {
  let request = null;
  let data = null;
  let progress = null;
  let day = null; // dia da busca (fontes diárias)
  let generation = 0; // descarta respostas de uma busca já vencida
  const listeners = new Set();

  const setProgress = (value) => {
    progress = value;
    listeners.forEach((listener) => listener(value));
  };

  const expired = () => daily && day !== null && day !== dateKey(new Date());

  return {
    peek: () => (expired() ? null : data),
    progress: () => progress,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    load() {
      if (expired()) {
        request = null;
        data = null;
        progress = null;
      }
      if (!request) {
        const current = ++generation;
        day = dateKey(new Date());
        request = loader(setProgress)
          .then((value) => {
            if (current === generation) data = value;
            return value;
          })
          .catch((error) => {
            if (current === generation) {
              request = null;
              progress = null;
            }
            throw error;
          });
      }
      return request;
    },
  };
}

/* =====================================================================
   Datas no fuso configurado (ver lib/githubPaths.js)
   ===================================================================== */

export { addDays, dateKey, weekdayOf };
export { splitDays } from "./githubPaths";

/* =====================================================================
   GitHub REST API
   ===================================================================== */

// Repositórios do usuário, 100 por página, até a última (no máximo
// MAX_REPO_PAGES, o mesmo limite que o proxy aceita)
async function githubRepos() {
  const items = [];
  for (let page = 1; page <= MAX_REPO_PAGES; page++) {
    const batch = await github(githubPaths.repos(page));
    items.push(...batch);
    if (batch.length < 100) break;
  }
  return items;
}

const searchCount = async (path) => (await github(path)).total_count;

// Roda fn em todos os itens, no máximo `limit` ao mesmo tempo, mantendo a ordem
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index], index);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker)
  );
  return results;
}

/* =====================================================================
   Perfil e repositórios: seguidores, estrelas, forks
   ===================================================================== */

const isHiddenRepo = (name) =>
  HIDDEN_REPO_PREFIXES.some((prefix) =>
    name.toLowerCase().startsWith(prefix.toLowerCase())
  );

export function normalizeProfile(user, repos) {
  const list = repos
    .filter((repo) => !repo.fork && !repo.private && !isHiddenRepo(repo.name))
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description ?? "",
      language: repo.language ?? null,
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
    }));

  return {
    user: {
      login: user.login,
      name: user.name || user.login,
      avatarUrl: user.avatar_url,
      url: user.html_url,
      bio: user.bio?.trim() ?? "",
      company: user.company ?? "",
      location: user.location ?? "",
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      createdAt: user.created_at?.slice(0, 10) ?? null,
    },
    repos: list,
    stars: list.reduce((sum, repo) => sum + repo.stars, 0),
    forks: list.reduce((sum, repo) => sum + repo.forks, 0),
  };
}

export const profileSource = createSource(async () => {
  const [user, repos] = await Promise.all([github(githubPaths.user()), githubRepos()]);
  return normalizeProfile(user, repos);
});

/* =====================================================================
   Linguagens: por bytes (com token) ou por repositório (sem token)
   ===================================================================== */

// Recebe um mapa { linguagem: valor } por repositório e soma tudo
export function sumLanguages(maps, unit) {
  const totals = new Map();
  maps.forEach((map) =>
    Object.entries(map).forEach(([name, value]) =>
      totals.set(name, (totals.get(name) ?? 0) + value)
    )
  );
  const total = [...totals.values()].reduce((sum, value) => sum + value, 0);
  const items = [...totals]
    .map(([name, value]) => ({
      name,
      value,
      percent: total ? (value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  return { unit, total, items };
}

// Bytes de cada linguagem em todos os repositórios públicos, numa chamada só.
// A consulta fica no servidor, junto do token (CONSULTAS.languages em
// api/_github.js), e é o servidor que percorre as páginas de 100 repositórios.

// Resposta da GraphQL → um mapa { linguagem: bytes } por repositório
export function languageMapsFromGraphQL(nodes) {
  return nodes
    .filter((repo) => !isHiddenRepo(repo.name))
    .map((repo) =>
      Object.fromEntries(
        (repo.languages?.edges ?? []).map((edge) => [edge.node.name, edge.size])
      )
    );
}

async function languagesFromGraphQL() {
  const data = await fetchGitHubGraphQL("languages");
  return languageMapsFromGraphQL(data.user.repositories.nodes);
}

// Plano B, se a GraphQL falhar: uma chamada REST por repositório, pelo proxy
async function languagesFromRest(repos, onProgress) {
  let done = 0;
  return mapLimit(repos, REPO_VIEWS_CONCURRENCY, async (repo) => {
    const languages = await github(githubPaths.languages(repo.name), { auth: true });
    onProgress({ done: ++done, total: repos.length });
    return languages;
  });
}

// Sem o proxy (ou sem token no servidor), 43 chamadas estourariam o limite de
// 60/h do visitante: conta a linguagem principal de cada repositório (já veio
// na lista)
const languagesByMainLanguage = (repos) =>
  sumLanguages(
    repos.map((repo) => (repo.language ? { [repo.language]: 1 } : {})),
    "repos"
  );

export const languagesSource = createSource(async (onProgress) => {
  const { repos } = await profileSource.load();

  let maps;
  try {
    maps = await languagesFromGraphQL();
  } catch (error) {
    if (error instanceof GitHubRateLimitError) throw error;
    if (error instanceof GitHubProxyUnavailableError) return languagesByMainLanguage(repos);
    console.warn("GitHub stats: GraphQL indisponível, usando a REST API", error);
    try {
      maps = await languagesFromRest(repos, onProgress);
    } catch (restError) {
      if (restError instanceof GitHubRateLimitError) throw restError;
      return languagesByMainLanguage(repos);
    }
  }
  return sumLanguages(maps, "bytes");
});

/* =====================================================================
   PRs, issues e commits dos últimos 12 meses (busca do GitHub)
   ===================================================================== */

export const countsSource = createSource(
  async () => {
    const today = dateKey(new Date());
    const [pullRequests, issues, commits] = await Promise.all([
      searchCount(githubPaths.pullRequests()),
      searchCount(githubPaths.issues()),
      searchCount(githubPaths.commitCount(today)),
    ]);
    return { pullRequests, issues, commits, since: lastYear(today).from };
  },
  { daily: true }
);

/* =====================================================================
   Horários dos commits
   ===================================================================== */

// Períodos do dia (horas de início e fim, inclusive)
export const PERIODS = [
  { key: "madrugada", from: 0, to: 5 },
  { key: "manha", from: 6, to: 11 },
  { key: "tarde", from: 12, to: 17 },
  { key: "noite", from: 18, to: 23 },
];

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// A busca devolve no máximo 100 commits por chamada. Os 12 meses são divididos
// em trimestres, com uma amostra de cada um; cada commit da amostra vale
// (total do trimestre / tamanho da amostra), para nenhum trimestre pesar mais
// do que realmente pesou. Resultado em % do total e em commits estimados.
export function commitClock(samples, timeZone = TIME_ZONE) {
  const format = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hourCycle: "h23",
    weekday: "short",
  });
  const hours = new Array(24).fill(0);
  const weekdays = new Array(7).fill(0);
  let sampled = 0;
  let total = 0;

  samples.forEach(({ total: rangeTotal, dates }) => {
    if (!dates.length) return;
    total += rangeTotal;
    const weight = rangeTotal / dates.length;
    dates.forEach((iso) => {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return;
      const parts = format.formatToParts(date);
      const hour = Number(parts.find((p) => p.type === "hour")?.value) % 24;
      const weekday = WEEKDAY_NAMES.indexOf(
        parts.find((p) => p.type === "weekday")?.value
      );
      if (Number.isNaN(hour)) return;
      hours[hour] += weight;
      if (weekday >= 0) weekdays[weekday] += weight;
      sampled++;
    });
  });

  const weightSum = hours.reduce((sum, value) => sum + value, 0);
  const toItem = (estimate) => ({
    estimate,
    percent: weightSum ? (estimate / weightSum) * 100 : 0,
  });
  const hourItems = hours.map(toItem);
  const peakHour = hours.indexOf(Math.max(...hours));

  return {
    sampled,
    total,
    peakHour: weightSum ? peakHour : null,
    hours: hourItems,
    weekdays: weekdays.map(toItem),
    periods: PERIODS.map((period) => ({
      ...period,
      ...toItem(
        hours
          .slice(period.from, period.to + 1)
          .reduce((sum, value) => sum + value, 0)
      ),
    })),
  };
}

export const commitClockSource = createSource(
  async () => {
    const today = dateKey(new Date());
    const pages = await Promise.all(githubPaths.commitClock(today).map((path) => github(path)));
    return commitClock(
      pages.map((page) => ({
        total: page.total_count ?? 0,
        dates: (page.items ?? []).map((item) => item.commit?.author?.date),
      }))
    );
  },
  { daily: true }
);

/* =====================================================================
   Contribuições: total, por ano, sequências e calendário
   ===================================================================== */

const NO_STREAK = { length: 0, start: null, end: null };

// Níveis 1–4 pelos quartis dos dias com contribuição (como o GitHub faz)
function levelScale(counts) {
  const sorted = counts.filter((count) => count > 0).sort((a, b) => a - b);
  const at = (q) => sorted[Math.floor((sorted.length - 1) * q)] ?? 0;
  const [q1, q2, q3] = [at(0.25), at(0.5), at(0.75)];
  return (count) =>
    count <= 0 ? 0 : count <= q1 ? 1 : count <= q2 ? 2 : count <= q3 ? 3 : 4;
}

// contributions: [{ date: "2025-06-09", count: 7 }, ...] (qualquer ordem)
// today: "2026-10-03" no fuso do config
export function summarizeContributions(contributions, today) {
  // Uma entrada por dia, em ordem, só até hoje (o ano atual vem com o futuro zerado)
  const counts = new Map();
  contributions.forEach(({ date, count }) => {
    if (typeof date === "string" && date <= today) counts.set(date, count ?? 0);
  });
  const days = [...counts]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, count]) => ({ date, count }));

  let total = 0;
  let activeDays = 0;
  let firstDate = null;
  let bestDay = null;
  let run = null;
  let longestStreak = NO_STREAK;
  const years = new Map();
  const weekdays = new Array(7).fill(0);

  days.forEach((day) => {
    const year = Number(day.date.slice(0, 4));
    years.set(year, (years.get(year) ?? 0) + day.count);
    weekdays[weekdayOf(day.date)] += day.count;
    total += day.count;

    if (day.count <= 0) {
      run = null;
      return;
    }
    activeDays++;
    firstDate ??= day.date;
    if (!bestDay || day.count > bestDay.count) bestDay = day;
    // Só emenda com o dia anterior se ele for mesmo o dia anterior
    run =
      run && addDays(run.end, 1) === day.date
        ? { ...run, end: day.date, length: run.length + 1 }
        : { start: day.date, end: day.date, length: 1 };
    if (run.length > longestStreak.length) longestStreak = run;
  });

  // Sequência atual: termina hoje ou ontem (hoje ainda pode ganhar contribuições)
  let currentStreak = NO_STREAK;
  let i = days.length - 1;
  if (days[i]?.date === today && days[i].count <= 0) i--;
  if (days[i] && days[i].count > 0 && days[i].date >= addDays(today, -1)) {
    const end = days[i].date;
    let start = end;
    let length = 0;
    while (i >= 0 && days[i].count > 0 && addDays(days[i].date, length) === end) {
      start = days[i].date;
      length++;
      i--;
    }
    currentStreak = { length, start, end };
  }

  // Calendário dos últimos 12 meses, uma coluna por semana (domingo a sábado),
  // igual ao do perfil do GitHub: 53 colunas, a última até hoje
  const start = addDays(today, -52 * 7 - weekdayOf(today));
  const cells = [];
  for (let key = start; key <= today; key = addDays(key, 1)) {
    cells.push({ date: key, count: counts.get(key) ?? 0 });
  }
  const level = levelScale(cells.map((cell) => cell.count));
  const weeks = [];
  cells.forEach((cell, index) => {
    if (index % 7 === 0) weeks.push([]);
    weeks[weeks.length - 1].push({ ...cell, level: level(cell.count) });
  });

  // Anos sem nenhum dia na lista (antes do primeiro) não aparecem
  const firstYear = days.length ? Number(days[0].date.slice(0, 4)) : null;
  const lastYear = Number(today.slice(0, 4));
  const yearList = [];
  for (let year = firstYear; firstYear && year <= lastYear; year++) {
    yearList.push({ year, total: years.get(year) ?? 0 });
  }

  return {
    today,
    total,
    activeDays,
    firstDate,
    bestDay,
    longestStreak,
    currentStreak,
    years: yearList,
    weekdays,
    calendar: {
      start,
      end: today,
      weeks,
      total: cells.reduce((sum, cell) => sum + cell.count, 0),
    },
  };
}

export const contributionsSource = createSource(
  async () => {
    const response = await fetch(CONTRIBUTIONS_URL);
    if (!response.ok) throw new Error(`Contribuições: HTTP ${response.status}`);
    const { contributions } = await response.json();
    if (!Array.isArray(contributions)) {
      throw new Error("Contribuições: formato inesperado");
    }
    return summarizeContributions(contributions, dateKey(new Date()));
  },
  { daily: true }
);

/* =====================================================================
   Visitas: perfil (komarev) e repositórios (views-counter), via proxy
   ===================================================================== */

// Sem o proxy (ex.: outro host), a rota devolve o index.html em vez do badge
const isSvg = (text) => /<svg[\s>]/i.test(text) && !/<html[\s>]/i.test(text);

// Badge do komarev: "<text>Profile views</text> ... <text>1,234</text>"
export function parseKomarevBadge(svg) {
  if (!isSvg(svg)) return null;
  const numbers = [...svg.matchAll(/>\s*(\d[\d,.]*)\s*</g)];
  const last = numbers.at(-1)?.[1];
  if (!last) return null;
  const value = Number(last.replace(/[,.]/g, ""));
  return Number.isFinite(value) ? value : null;
}

// "1234" → 1234; "1.23K" → 1230 (o views-counter abrevia a partir de mil)
const SCALE = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
export function parseCompactNumber(text) {
  const match = /^(\d[\d.,]*)\s*([KMBT])?$/i.exec(String(text).trim());
  if (!match) return null;
  const suffix = match[2]?.toUpperCase();
  const number = Number(
    suffix ? match[1].replace(",", ".") : match[1].replace(/[.,]/g, "")
  );
  if (!Number.isFinite(number)) return null;
  return {
    value: Math.round(number * (SCALE[suffix] ?? 1)),
    approximate: Boolean(suffix),
  };
}

// Badge do views-counter: <span class="badge" id="count">1.23K</span>
export function parseViewsCounterBadge(svg) {
  if (!isSvg(svg)) return null;
  const match = /id=["']count["'][^>]*>\s*([^<\s]+)\s*</.exec(svg);
  return match ? parseCompactNumber(match[1]) : null;
}

export const profileViewsSource = createSource(async () => {
  const response = await fetch(PROFILE_VIEWS_PATH);
  if (!response.ok) throw new Error(`Visitas: HTTP ${response.status}`);
  const views = parseKomarevBadge(await response.text());
  if (views == null) throw new Error("Visitas: badge inesperado");
  return views;
});

async function fetchRepoViews(repo) {
  // O pageId já vem codificado igual ao badge do README: vai como está
  const response = await fetch(
    `${REPO_VIEWS_PATH}?pageId=${repoViewsPageId(repo)}&type=total`
  );
  if (!response.ok) throw new Error(`Views: HTTP ${response.status}`);
  return parseViewsCounterBadge(await response.text());
}

// Cada leitura soma +1 no contador do repositório (o views-counter não tem
// rota só de leitura), por isso só o "stats --repos" busca, e uma vez por visita.
// Só entram os repositórios com o badge no README (REPO_VIEWS_REPOS do config).
export const repoViewsSource = createSource(async (onProgress) => {
  const repos = (await profileSource.load()).repos.filter((repo) =>
    hasRepoViewsBadge(repo.name)
  );
  if (repos.length === 0) throw new Error("Views: nenhum repositório com badge");
  let done = 0;
  onProgress({ done, total: repos.length });

  const items = await mapLimit(repos, REPO_VIEWS_CONCURRENCY, async (repo) => {
    const views = await fetchRepoViews(repo.name).catch(() => null);
    onProgress({ done: ++done, total: repos.length });
    return { ...repo, views };
  });

  const counted = items.filter((item) => item.views);
  if (counted.length === 0) throw new Error("Views: nenhum contador respondeu");

  return {
    total: counted.reduce((sum, item) => sum + item.views.value, 0),
    approximate: counted.some((item) => item.views.approximate),
    counted: counted.length,
    // Mais vistos primeiro; quem não respondeu vai para o fim
    items: items.sort(
      (a, b) =>
        (b.views?.value ?? -1) - (a.views?.value ?? -1) ||
        a.name.localeCompare(b.name)
    ),
  };
});
