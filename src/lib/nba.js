import NBA_CONFIG from "../config/nbaConfig";

// Comando "basquete": busca e organiza os jogos da NBA (ver config/nbaConfig.js).
//
//   fetchJogosDaNba({ todos })  → { temporada, fase, proximos } (a liga toda)
//   fetchJogosDoTime(sigla)     → { time, temporada, proximos, ultimo }
//
// A liga vem do placar do dia (/scoreboard), que traz também o calendário
// com os dias que têm jogo; a ESPN não aceita intervalo de datas ali, então
// os dias seguintes são buscados um a um, em paralelo.
//
// O time vem do calendário dele (/teams/<sigla>/schedule). Sem parâmetro a
// ESPN manda só a fase atual (na pré-temporada, só os amistosos): por isso
// vai junto a temporada regular (?seasontype=2), e as duas listas se juntam.
//
// Cada resposta fica guardada por CACHE_MS, como no "campeonato".

const CACHE_MS = 60 * 1000;
const cache = new Map();

function comCache(chave, carregar) {
  const guardado = cache.get(chave);
  if (guardado && Date.now() - guardado.em < CACHE_MS) return guardado.request;
  const request = carregar().catch((error) => {
    cache.delete(chave);
    throw error;
  });
  cache.set(chave, { request, em: Date.now() });
  return request;
}

export function fetchJogosDaNba({ todos = false } = {}) {
  return comCache(todos ? "liga:todos" : "liga", () => carregarLiga(todos));
}

export function fetchJogosDoTime(sigla) {
  return comCache(`time:${sigla}`, () => carregarTime(sigla));
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} em ${url}`);
  return response.json();
}

/* ---------------------------------------------------------------------
   A liga toda: placar de hoje + próximos dias com jogo
   --------------------------------------------------------------------- */

// O calendário vem como lista de datas ("2026-10-09T07:00Z") ou de objetos
function diasDoCalendario(liga) {
  return (liga?.calendar ?? [])
    .map((dia) => (typeof dia === "string" ? dia : dia?.startDate ?? dia?.value))
    .filter(Boolean)
    .map((dia) => dia.slice(0, 10));
}

async function carregarLiga(todos) {
  const { ESPN_API, PROXIMOS, DIAS_POR_VEZ, DIAS_MAX, DIAS_TODOS } = NBA_CONFIG;
  const placar = `${ESPN_API}/scoreboard`;
  const hoje = await getJson(placar);
  const liga = hoje.leagues?.[0];
  const diaDeHoje = hoje.day?.date ?? new Date().toISOString().slice(0, 10);
  const proximosDias = diasDoCalendario(liga).filter((dia) => dia > diaDeHoje);

  const porId = new Map();
  const juntar = (eventos) =>
    eventos.forEach((evento) => {
      const jogo = normalizarEvento(evento);
      if (jogo.estado !== "post") porId.set(jogo.id, jogo);
    });
  juntar(hoje.events ?? []);

  // "--todos": os próximos DIAS_TODOS dias com jogo. Sem ele, de
  // DIAS_POR_VEZ em DIAS_POR_VEZ até ter PROXIMOS jogos (na pré-temporada
  // há dias com um ou dois jogos só)
  const limite = todos ? DIAS_TODOS : DIAS_MAX;
  const lote = todos ? DIAS_TODOS : DIAS_POR_VEZ;
  for (let i = 0; i < limite && i < proximosDias.length; i += lote) {
    if (!todos && porId.size >= PROXIMOS) break;
    const dias = proximosDias.slice(i, Math.min(i + lote, limite));
    const respostas = await Promise.allSettled(
      dias.map((dia) => getJson(`${placar}?dates=${dia.replaceAll("-", "")}`))
    );
    respostas.forEach((resposta) => {
      if (resposta.status === "fulfilled") juntar(resposta.value.events ?? []);
    });
  }

  const proximos = [...porId.values()].sort((a, b) => ordemDoJogo(a) - ordemDoJogo(b));
  const tipo = hoje.season?.type ?? proximos[0]?.tipo ?? null;
  return {
    temporada: nomeDaTemporada(hoje.season ?? liga?.season),
    fase: faseDaTemporada(tipo),
    proximos,
  };
}

/* ---------------------------------------------------------------------
   Um time: fase atual + temporada regular
   --------------------------------------------------------------------- */

async function carregarTime(sigla) {
  const base = `${NBA_CONFIG.ESPN_API}/teams/${sigla}/schedule`;
  const [atual, regular] = await Promise.allSettled([getJson(base), getJson(`${base}?seasontype=2`)]);
  if (atual.status === "rejected" && regular.status === "rejected") throw atual.reason;

  const respostas = [atual, regular].filter((r) => r.status === "fulfilled").map((r) => r.value);
  const porId = new Map();
  respostas.forEach((resposta) =>
    (resposta.events ?? []).forEach((evento) => porId.set(evento.id, normalizarEvento(evento)))
  );
  const jogos = [...porId.values()].sort((a, b) => a.data - b.data);
  const time = normalizarTime(respostas[0].team);
  const meuLado = (jogo) => ({
    ...jogo,
    meu: [jogo.mandante, jogo.visitante].find((lado) => lado?.id === time?.id) ?? null,
    adversario: [jogo.mandante, jogo.visitante].find((lado) => lado && lado.id !== time?.id) ?? null,
  });

  const encerrados = jogos.filter((jogo) => jogo.estado === "post").map(meuLado);
  return {
    time,
    temporada: nomeDaTemporada(respostas[0].requestedSeason ?? respostas[0].season),
    proximos: jogos
      .filter((jogo) => jogo.estado !== "post")
      .sort((a, b) => ordemDoJogo(a) - ordemDoJogo(b))
      .map(meuLado),
    ultimo: encerrados.at(-1) ?? null,
  };
}

/* ---------------------------------------------------------------------
   Normalização da resposta da ESPN (placar da liga e calendário do time
   mandam o mesmo jogo com formatos um pouco diferentes)
   --------------------------------------------------------------------- */

const ESPN_TEAM_LOGO = "https://a.espncdn.com/i/teamlogos/nba";

// Jogo em andamento primeiro; depois por horário
const ordemDoJogo = (jogo) => (jogo.estado === "in" ? -Infinity : jogo.data);

// O placar vem como texto ("81") ou objeto ({ value: 81, displayValue })
const numero = (valor) => {
  const n = typeof valor === "object" && valor !== null ? valor.value : valor;
  if (n === undefined || n === null || n === "") return null;
  const convertido = Number(n);
  return Number.isFinite(convertido) ? convertido : null;
};

// { year: 2027 } → "2026-27" (a ESPN chama a temporada pelo ano em que acaba)
function nomeDaTemporada(season) {
  if (!season) return "";
  if (season.displayName && /\d{4}-\d{2}/.test(season.displayName)) return season.displayName;
  const ano = Number(season.year);
  return ano ? `${ano - 1}-${String(ano).slice(2)}` : "";
}

// Tipo da temporada na ESPN: 1 pré-temporada, 2 regular, 3 playoffs, 5 play-in
function faseDaTemporada(tipo) {
  return { 1: "pre", 2: "regular", 3: "playoffs", 5: "playin" }[Number(tipo)] ?? null;
}

// Logo claro e escuro. O placar da liga manda a versão "scoreboard" (cortada
// para caber no placar): melhor montar a URL do logo cheio pela sigla.
function logos(team = {}) {
  const lista = team.logos ?? [];
  const achar = (rel) =>
    lista.find((logo) => logo.rel?.includes(rel) && !logo.rel?.includes("scoreboard"))?.href;
  const sigla = team.abbreviation?.toLowerCase();
  const montado = (pasta) => (sigla ? `${ESPN_TEAM_LOGO}/${pasta}/${sigla}.png` : null);
  const padrao = achar("default") ?? montado("500") ?? team.logo ?? null;
  return { escudo: padrao, escudoEscuro: achar("dark") ?? montado("500-dark") ?? team.logoDark ?? padrao };
}

function normalizarTime(team) {
  if (!team) return null;
  // "2nd in Pacific Division" → { posicao: 2, grupo: "Pacific Division" }
  // (vem em inglês: o componente traduz)
  const [, posicao, grupo] = /^(\d+)\w*\s+in\s+(.+)$/i.exec(team.standingSummary ?? "") ?? [];
  return {
    id: String(team.id),
    nome: team.displayName,
    curto: team.shortDisplayName ?? team.name ?? team.displayName,
    sigla: team.abbreviation ?? "",
    ...logos(team),
    campanha: team.recordSummary ?? null,
    posicao: posicao ? Number(posicao) : null,
    grupo: grupo ?? null,
  };
}

// Campanha (vitórias-derrotas): "records" no placar, "record" no calendário
function campanha(competidor) {
  const total = (lista) => lista?.find((r) => r.type === "total") ?? lista?.[0];
  const valor = total(competidor.records)?.summary ?? total(competidor.record)?.displayValue ?? null;
  return valor === "0-0" ? null : valor;
}

function normalizarCompetidor(competidor = {}) {
  const team = competidor.team ?? {};
  return {
    id: String(team.id ?? competidor.id),
    nome: team.displayName ?? team.name ?? "?",
    curto: team.shortDisplayName ?? team.name ?? team.displayName ?? "?",
    sigla: team.abbreviation ?? "",
    ...logos(team),
    casa: competidor.homeAway === "home",
    pontos: numero(competidor.score),
    venceu: competidor.winner === true,
    campanha: campanha(competidor),
  };
}

// Transmissão nacional (nos EUA): "ESPN", "NBA TV", "Prime Video"...
function transmissao(competicao) {
  const nomes = (competicao.broadcasts ?? []).flatMap((b) => {
    const mercado = typeof b.market === "string" ? b.market : b.market?.type;
    if (mercado && !/national/i.test(mercado)) return [];
    return b.names ?? (b.media?.shortName ? [b.media.shortName] : []);
  });
  return [...new Set(nomes)].join(" / ") || null;
}

function normalizarEvento(evento) {
  const competicao = evento.competitions?.[0] ?? {};
  const status = competicao.status ?? evento.status ?? {};
  const competidores = (competicao.competitors ?? []).map(normalizarCompetidor);
  const mandante = competidores.find((time) => time.casa) ?? competidores[0];
  const visitante = competidores.find((time) => time !== mandante);
  const venue = competicao.venue ?? evento.venue ?? {};
  const tipo = evento.season?.type ?? evento.seasonType?.type ?? evento.seasonType?.id ?? null;
  const serie = competicao.series;

  return {
    id: evento.id,
    data: Date.parse(evento.date),
    horaDefinida: evento.timeValid !== false && competicao.timeValid !== false,
    tipo: Number(tipo) || null,
    fase: faseDaTemporada(tipo),
    // "East 1st Round - Game 3", "NBA Finals - Game 2", "Emirates NBA Cup..."
    nota: competicao.notes?.find((nota) => nota.headline)?.headline ?? null,
    // Série de playoff: "ORL leads series 2-1"
    serie: serie?.summary ?? null,
    estado: status.type?.state ?? "pre", // pre | in | post
    statusNome: status.type?.name ?? "",
    periodo: status.period ?? 0,
    relogio: status.displayClock ?? "",
    local: [venue.fullName, venue.address?.city].filter(Boolean).join(", "),
    tv: transmissao(competicao),
    mandante,
    visitante,
  };
}
