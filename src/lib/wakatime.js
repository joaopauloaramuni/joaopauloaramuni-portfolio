import WAKATIME_CONFIG from "../config/wakaTimeConfig";

// Busca as estatísticas públicas do WakaTime (GET /users/:user/stats/:range)
// pelo proxy do próprio site (ver config/wakaTimeConfig.js).
//
// A promessa fica guardada: trocar de estilo (wakatime --lista → --terminal)
// não repete a chamada. Se der erro, o cache é limpo para tentar de novo.

let request = null;
let cached = null;

// Erro específico para quando o WakaTime ainda está calculando (HTTP 202)
export class WakaTimePendingError extends Error {}

export const getCachedWakaTimeStats = () => cached;

export function fetchWakaTimeStats() {
  if (!request) {
    request = load()
      .then((stats) => (cached = stats))
      .catch((error) => {
        request = null;
        throw error;
      });
  }
  return request;
}

async function load() {
  const { API_PATH, RANGE } = WAKATIME_CONFIG;
  const response = await fetch(`${API_PATH}/stats/${RANGE}`);
  if (!response.ok) throw new Error(`WakaTime: HTTP ${response.status}`);

  // Sem o proxy (ex.: outro host), a rota devolve o index.html e o json() falha
  const { data } = await response.json();
  if (data?.status === "pending_update" || !Array.isArray(data?.languages)) {
    throw new WakaTimePendingError("WakaTime ainda está calculando");
  }
  return normalize(data);
}

// Menos de 1 minuto não aparece em nenhum estilo
const MIN_SECONDS = 60;

const toItems = (list = []) =>
  list
    .filter((item) => item.total_seconds >= MIN_SECONDS)
    .map(({ name, total_seconds, percent }) => ({
      name,
      seconds: total_seconds,
      percent,
    }));

// "since Sep 6 2022" → "2022-09-06". Para visitantes (sem login), a API não
// manda "start", "end", "timezone" nem "best_day": só este texto, em inglês.
const MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split(" ");
function parseSince(text = "") {
  const match = /(\w{3})\w*\.? (\d{1,2}),? (\d{4})/.exec(text);
  const month = match ? MONTHS.indexOf(match[1].toLowerCase()) : -1;
  if (month < 0) return null;
  const pad = (n) => String(n).padStart(2, "0");
  return `${match[3]}-${pad(month + 1)}-${pad(match[2])}`;
}

// Fica só com o que os estilos usam. As porcentagens do WakaTime são sobre o
// total "including other language", então o total exibido é esse também.
function normalize(data) {
  const hidden = new Set(WAKATIME_CONFIG.HIDDEN_LANGUAGES);
  return {
    totalSeconds:
      data.total_seconds_including_other_language ?? data.total_seconds ?? 0,
    dailyAverage:
      data.daily_average_including_other_language ?? data.daily_average ?? 0,
    activeDays: data.days_minus_holidays ?? null,
    totalDays: data.days_including_holidays ?? null,
    since: data.start?.slice(0, 10) ?? parseSince(data.human_readable_range),
    languages: toItems(data.languages).filter((l) => !hidden.has(l.name)),
    editors: toItems(data.editors),
    categories: toItems(data.categories),
    operatingSystems: toItems(data.operating_systems),
  };
}

// Primeiros `limit` itens + o resto somado (ou null se não sobrar nada)
export function splitTop(items, limit) {
  const top = items.slice(0, limit);
  const rest = items.slice(limit);
  if (rest.length === 0) return { top, rest: null };
  return {
    top,
    rest: {
      count: rest.length,
      seconds: rest.reduce((sum, item) => sum + item.seconds, 0),
      percent: rest.reduce((sum, item) => sum + item.percent, 0),
    },
  };
}

/* ---------- Formatação (segue o idioma do i18n) ---------- */

// 457722 s → "127 h 8 min" (arredonda para baixo, como o WakaTime)
export function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

// 31.76 → "31,8%" (pt) ou "31.8%" (en)
export function formatPercent(percent, locale) {
  if (percent > 0 && percent < 0.1) return `<${formatPercent(0.1, locale)}`;
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(percent / 100);
}

// "2022-09-06" → "6 de set. de 2022" / "Sep 6, 2022" (ou null se inválida)
export function formatDate(value, locale) {
  // Meio-dia no fuso do visitante: a data não "volta" um dia em nenhum fuso
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
