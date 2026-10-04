import GITHUB_API_CONFIG from "../config/gitHubApiConfig";
import GITHUB_STATS_CONFIG, {
  repoViewsPageId,
  hasRepoViewsBadge,
} from "../config/gitHubStatsConfig";

// Busca e calcula as estatísticas do comando "stats" (ver config/gitHubStatsConfig.js).
//
// Cada fonte é buscada uma vez por visita, como no lib/wakatime.js: trocar de
// gráfico (stats --resumo → --atividade) reaproveita os dados. Se der erro, o
// cache é limpo para tentar de novo no próximo comando.
//
// Limites da GitHub API sem token, por IP do visitante: 60 chamadas por hora e
// 10 buscas (/search) por minuto. Uma visita que abre todos os gráficos usa
// 2 chamadas comuns e 7 buscas. Com o token (VITE_GITHUB_TOKEN):
//   • as linguagens saem por bytes de código, numa chamada só (GraphQL);
//   • as outras chamadas continuam sem token (o limite por IP é do visitante)
//     e só repetem com o token se o limite do IP acabar, como numa rede
//     compartilhada de faculdade. O limite do token (5.000/h e 30 buscas/min)
//     é dividido por todos os visitantes, por isso ele fica de reserva.

const { TOKEN, BASE_URL } = GITHUB_API_CONFIG;
const GRAPHQL_URL = `${BASE_URL}/graphql`;
const {
  USERNAME,
  TIME_ZONE,
  CONTRIBUTIONS_URL,
  PROFILE_VIEWS_PATH,
  REPO_VIEWS_PATH,
  HIDDEN_REPO_PREFIXES,
  REPO_VIEWS_CONCURRENCY,
} = GITHUB_STATS_CONFIG;

// Erro específico para o limite da GitHub API (o painel mostra outra mensagem)
export class GitHubRateLimitError extends Error {}

/* =====================================================================
   Cache por visita
   ===================================================================== */

// Guarda a promessa da busca e o resultado. Buscas demoradas avisam o
// progresso (ex.: 12 de 43 repositórios) para quem estiver inscrito.
function createSource(loader) {
  let request = null;
  let data = null;
  let progress = null;
  const listeners = new Set();

  const setProgress = (value) => {
    progress = value;
    listeners.forEach((listener) => listener(value));
  };

  return {
    peek: () => data,
    progress: () => progress,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    load() {
      if (!request) {
        request = loader(setProgress)
          .then((value) => (data = value))
          .catch((error) => {
            request = null;
            progress = null;
            throw error;
          });
      }
      return request;
    },
  };
}

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

/* =====================================================================
   GitHub REST API
   ===================================================================== */

const headers = (auth) => ({
  Accept: "application/vnd.github+json",
  ...(auth && TOKEN && { Authorization: `Bearer ${TOKEN}` }),
});

// 403/429 numa rota pública é o limite de chamadas (por hora ou por minuto)
const isRateLimited = (response) =>
  response.status === 403 || response.status === 429;

// Sem token primeiro; se o limite do IP acabou e existe token, repete com ele.
// { auth: true } já vai direto com o token.
async function github(path, { auth = false } = {}) {
  const url = `${BASE_URL}${path}`;
  let response = await fetch(url, { headers: headers(auth) });
  if (!auth && TOKEN && isRateLimited(response)) {
    response = await fetch(url, { headers: headers(true) });
  }
  if (isRateLimited(response)) {
    throw new GitHubRateLimitError(`GitHub: HTTP ${response.status}`);
  }
  if (!response.ok) throw new Error(`GitHub: HTTP ${response.status}`);
  return response.json();
}

// A GraphQL API do GitHub só responde com token
async function githubGraphQL(query, variables) {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { ...headers(true), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (isRateLimited(response)) {
    throw new GitHubRateLimitError(`GitHub GraphQL: HTTP ${response.status}`);
  }
  if (!response.ok) throw new Error(`GitHub GraphQL: HTTP ${response.status}`);
  const { data, errors } = await response.json();
  if (errors?.some((error) => error.type === "RATE_LIMITED")) {
    throw new GitHubRateLimitError("GitHub GraphQL: RATE_LIMITED");
  }
  if (errors?.length || !data) {
    throw new Error(`GitHub GraphQL: ${errors?.[0]?.message ?? "sem dados"}`);
  }
  return data;
}

// Lista paginada (100 por página) até a última página
async function githubList(path) {
  const items = [];
  for (let page = 1; ; page++) {
    const batch = await github(`${path}&per_page=100&page=${page}`);
    items.push(...batch);
    if (batch.length < 100) return items;
  }
}

const searchCount = async (query) =>
  (await github(`/search/${query}&per_page=1`)).total_count;

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
  const [user, repos] = await Promise.all([
    github(`/users/${USERNAME}`),
    githubList(`/users/${USERNAME}/repos?type=owner&sort=pushed`),
  ]);
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

// Bytes de cada linguagem em todos os repositórios públicos, numa chamada só
// (100 repositórios por página). Validada com o schema público do GitHub.
const LANGUAGES_QUERY = `
  query ($login: String!, $cursor: String) {
    user(login: $login) {
      repositories(
        first: 100
        after: $cursor
        ownerAffiliations: OWNER
        isFork: false
        privacy: PUBLIC
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name
          languages(first: 50, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;

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
  const nodes = [];
  let cursor = null;
  do {
    const data = await githubGraphQL(LANGUAGES_QUERY, { login: USERNAME, cursor });
    const page = data.user.repositories;
    nodes.push(...page.nodes);
    cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (cursor);
  return languageMapsFromGraphQL(nodes);
}

// Plano B, se a GraphQL não aceitar o token: uma chamada REST por repositório
async function languagesFromRest(repos, onProgress) {
  let done = 0;
  return mapLimit(repos, REPO_VIEWS_CONCURRENCY, async (repo) => {
    const languages = await github(`/repos/${USERNAME}/${repo.name}/languages`, {
      auth: true,
    });
    onProgress({ done: ++done, total: repos.length });
    return languages;
  });
}

export const languagesSource = createSource(async (onProgress) => {
  const { repos } = await profileSource.load();

  // Sem token, 43 chamadas estourariam o limite de 60/h do visitante: conta a
  // linguagem principal de cada repositório (já veio na lista)
  if (!TOKEN) {
    return sumLanguages(
      repos.map((repo) => (repo.language ? { [repo.language]: 1 } : {})),
      "repos"
    );
  }

  let maps;
  try {
    maps = await languagesFromGraphQL();
  } catch (error) {
    if (error instanceof GitHubRateLimitError) throw error;
    console.warn("GitHub stats: GraphQL indisponível, usando a REST API", error);
    maps = await languagesFromRest(repos, onProgress);
  }
  return sumLanguages(maps, "bytes");
});

/* =====================================================================
   PRs, issues e commits dos últimos 12 meses (busca do GitHub)
   ===================================================================== */

export const countsSource = createSource(async () => {
  const today = dateKey(new Date());
  const since = addDays(today, -364);
  const [pullRequests, issues, commits] = await Promise.all([
    searchCount(`issues?q=author:${USERNAME}+type:pr`),
    searchCount(`issues?q=author:${USERNAME}+type:issue`),
    searchCount(`commits?q=author:${USERNAME}+author-date:${since}..${today}`),
  ]);
  return { pullRequests, issues, commits, since };
});

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

export const commitClockSource = createSource(async () => {
  const today = dateKey(new Date());
  const ranges = splitDays(addDays(today, -364), today, 4);
  const pages = await Promise.all(
    ranges.map(({ from, to }) =>
      github(
        `/search/commits?q=author:${USERNAME}+author-date:${from}..${to}&per_page=100`
      )
    )
  );
  return commitClock(
    pages.map((page) => ({
      total: page.total_count ?? 0,
      dates: (page.items ?? []).map((item) => item.commit?.author?.date),
    }))
  );
});

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

export const contributionsSource = createSource(async () => {
  const response = await fetch(CONTRIBUTIONS_URL);
  if (!response.ok) throw new Error(`Contribuições: HTTP ${response.status}`);
  const { contributions } = await response.json();
  if (!Array.isArray(contributions)) {
    throw new Error("Contribuições: formato inesperado");
  }
  return summarizeContributions(contributions, dateKey(new Date()));
});

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
