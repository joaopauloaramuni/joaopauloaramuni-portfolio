import GALO_CONFIG from "../config/galoConfig";

// Comando "jogos": busca e organiza os jogos do Galo (ver config/galoConfig.js).
//
//   fetchJogosDoGalo()  → { time, proximos, ultimo } da ESPN
//
// São duas chamadas à ESPN em paralelo: o calendário (?fixture=true) e os
// resultados. Os resultados servem para o placar agregado: no jogo de volta
// de um mata-mata, o placar da ida vem de lá. Se só os resultados falharem,
// os jogos aparecem do mesmo jeito, sem o agregado.
//
// A resposta fica guardada por CACHE_MS: rodar "jogos" e "galo" seguidos não
// repete as chamadas. Se der erro, o cache é limpo para tentar de novo.

const CACHE_MS = 60 * 1000;
let request = null;
let requestEm = 0;

export function fetchJogosDoGalo() {
  if (!request || Date.now() - requestEm > CACHE_MS) {
    requestEm = Date.now();
    request = load().catch((error) => {
      request = null;
      throw error;
    });
  }
  return request;
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} em ${url}`);
  return response.json();
}

async function load() {
  const { ESPN_API, ESPN_TEAM_ID } = GALO_CONFIG;
  const base = `${ESPN_API}/${ESPN_TEAM_ID}/schedule`;
  const [calendario, resultados] = await Promise.allSettled([
    getJson(`${base}?fixture=true`),
    getJson(base),
  ]);
  if (calendario.status === "rejected") throw calendario.reason;

  const fixtures = (calendario.value.events ?? []).map(normalizarEvento);
  const passados =
    resultados.status === "fulfilled"
      ? (resultados.value.events ?? []).map(normalizarEvento)
      : [];

  // Jogo em andamento pode estar nas duas listas: fica o do calendário
  const idsFixtures = new Set(fixtures.map((jogo) => jogo.id));
  const encerrados = passados
    .filter((jogo) => jogo.estado === "post" && !idsFixtures.has(jogo.id))
    .sort((a, b) => a.data - b.data);

  const proximos = fixtures
    .filter((jogo) => jogo.estado !== "post")
    .sort((a, b) => a.data - b.data)
    .map((jogo) => ({ ...jogo, serie: serieDoJogo(jogo, encerrados, fixtures) }));

  return {
    time: normalizarTime(calendario.value.team ?? resultados.value?.team),
    proximos,
    ultimo: encerrados.at(-1) ?? null,
  };
}

/* ---------------------------------------------------------------------
   Normalização da resposta da ESPN
   --------------------------------------------------------------------- */

const ESPN_TEAM_LOGO = "https://a.espncdn.com/i/teamlogos/soccer";
const ESPN_LEAGUE_LOGO = "https://a.espncdn.com/i/leaguelogos/soccer";

// O placar vem como número, texto ("2") ou objeto ({ value: 2, ... })
const numero = (valor) => {
  const n = typeof valor === "object" && valor !== null ? valor.value : valor;
  if (n === undefined || n === null || n === "") return null;
  const convertido = Number(n);
  return Number.isFinite(convertido) ? convertido : null;
};

// Escudo claro e escuro (a ESPN tem versões para fundo escuro)
function escudos(team = {}) {
  const logos = team.logos ?? [];
  const achar = (rel) => logos.find((logo) => logo.rel?.includes(rel))?.href;
  const padrao =
    achar("default") ?? team.logo ?? (team.id ? `${ESPN_TEAM_LOGO}/500/${team.id}.png` : null);
  return { escudo: padrao, escudoEscuro: achar("dark") ?? padrao };
}

function normalizarTime(team) {
  if (!team) return null;
  // "7th in Brazilian Serie A" → 7 (o texto vem em inglês: o componente
  // monta a frase no idioma do site)
  const posicao = /^(\d+)\w*\s+in\s+.*serie a/i.exec(team.standingSummary ?? "")?.[1];
  return {
    id: team.id,
    nome: team.displayName,
    ...escudos(team),
    posicao: posicao ? Number(posicao) : null,
  };
}

function normalizarCompetidor(competidor = {}) {
  const team = competidor.team ?? {};
  return {
    id: String(team.id ?? competidor.id),
    nome: team.displayName ?? team.name ?? "?",
    curto: team.shortDisplayName ?? team.displayName ?? "?",
    sigla: team.abbreviation ?? "",
    ...escudos({ ...team, id: team.id ?? competidor.id }),
    casa: competidor.homeAway === "home",
    gols: numero(competidor.score),
    agregado: numero(competidor.score?.aggregateScore ?? competidor.aggregateScore),
    penaltis: numero(competidor.shootoutScore ?? competidor.score?.shootoutScore),
  };
}

// "Semifinals", "Round of 16", "Playoffs - Final"... ou o nome da temporada
// nos pontos corridos ("2026 Brasileiro Serie A"), que não é uma fase
function faseDoJogo(seasonType) {
  const nome = seasonType?.name?.trim();
  if (!nome || /\d{4}/.test(nome) || /regular season/i.test(nome)) return null;
  return nome;
}

function normalizarEvento(evento) {
  const competicao = evento.competitions?.[0] ?? {};
  const status = competicao.status ?? evento.status ?? {};
  const liga = evento.league ?? {};
  const competidores = (competicao.competitors ?? []).map(normalizarCompetidor);
  const galo = competidores.find((time) => time.id === GALO_CONFIG.ESPN_TEAM_ID);
  const adversario = competidores.find((time) => time !== galo);
  const mandante = competidores.find((time) => time.casa) ?? competidores[0];
  const visitante = competidores.find((time) => time !== mandante);
  const logoId = liga.alternateId ?? liga.id;
  const venue = competicao.venue ?? evento.venue ?? {};
  const link = (evento.links ?? []).find(
    (l) => l.rel?.includes("summary") && l.rel?.includes("desktop")
  )?.href;

  return {
    id: evento.id,
    data: Date.parse(evento.date),
    // Sem horário confirmado a ESPN manda um horário qualquer: só vale o dia
    horaDefinida: evento.timeValid !== false && competicao.timeValid !== false,
    competicao: {
      slug: liga.slug ?? "",
      nome: liga.name ?? liga.shortName ?? "",
      logo: logoId ? `${ESPN_LEAGUE_LOGO}/500/${logoId}.png` : null,
      logoEscuro: logoId ? `${ESPN_LEAGUE_LOGO}/500-dark/${logoId}.png` : null,
    },
    fase: faseDoJogo(evento.seasonType),
    // 1 = ida, 2 = volta (só nos mata-matas de dois jogos)
    perna: competicao.leg?.value ?? null,
    estado: status.type?.state ?? "pre", // pre | in | post
    statusNome: status.type?.name ?? "",
    relogio: status.displayClock ?? "",
    local: [venue.fullName, venue.address?.city].filter(Boolean).join(", "),
    mandante,
    visitante,
    galo,
    adversario,
    galoEmCasa: Boolean(galo?.casa),
    link,
  };
}

/* ---------------------------------------------------------------------
   Mata-mata de dois jogos: ida, volta e placar agregado
   --------------------------------------------------------------------- */

const mesmoConfronto = (a, b) =>
  a.id !== b.id &&
  a.competicao.slug === b.competicao.slug &&
  a.adversario?.id === b.adversario?.id;

// Na volta: placar da ida e agregado (soma dos dois jogos, do ponto de vista
// do Galo). Na ida: a data da volta, se já estiver marcada.
//   { perna: 2, ida, agregado: { galo, adversario } | null, idaEm }
//   { perna: 1, volta }
function serieDoJogo(jogo, encerrados, fixtures) {
  if (jogo.perna === 1) {
    const volta = fixtures.find((outro) => outro.perna === 2 && mesmoConfronto(jogo, outro));
    return { perna: 1, volta: volta?.data ?? null };
  }
  if (jogo.perna !== 2) return null;

  const ida = [...encerrados].reverse().find((outro) => outro.perna === 1 && mesmoConfronto(jogo, outro));

  // Com a volta rolando, a ESPN já manda o agregado dos dois jogos
  if (jogo.estado === "in" && jogo.galo?.agregado !== null && jogo.adversario?.agregado !== null) {
    return {
      perna: 2,
      ida: ida ? placarDoGalo(ida) : null,
      agregado: { galo: jogo.galo.agregado, adversario: jogo.adversario.agregado },
    };
  }

  if (!ida) {
    // A ida ainda não foi jogada: só a data dela
    const idaMarcada = fixtures.find((outro) => outro.perna === 1 && mesmoConfronto(jogo, outro));
    return { perna: 2, ida: null, agregado: null, idaEm: idaMarcada?.data ?? null };
  }
  const placarIda = placarDoGalo(ida);
  return {
    perna: 2,
    ida: placarIda,
    // Antes da volta, o agregado é o placar da ida
    agregado: placarIda && { galo: placarIda.galo, adversario: placarIda.adversario },
  };
}

function placarDoGalo(jogo) {
  if (jogo.galo?.gols === null || jogo.adversario?.gols === null) return null;
  return {
    galo: jogo.galo.gols,
    adversario: jogo.adversario.gols,
    mandante: jogo.mandante,
    visitante: jogo.visitante,
  };
}
