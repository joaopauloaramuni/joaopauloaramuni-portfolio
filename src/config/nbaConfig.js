// nbaConfig.js
// Comando "basquete" (ou "basketball", "nba"): próximos jogos da NBA,
// buscados ao vivo no navegador do visitante (ver lib/nba.js).
// Mesma fonte do comando "campeonato": a API pública da ESPN
// (site.api.espn.com), sem chave e com CORS liberado.
//
//   basquete              os próximos jogos da liga (todos os times)
//   basquete lal          os próximos jogos de um time (sigla ou apelido)
//   basquete --todos      todos os jogos dos próximos dias
//   basquete lakers --todos
const NBA_CONFIG = {
  ESPN_API: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba",
  // Página do calendário na ESPN, no rodapé do comando
  ESPN_PAGE: "https://www.espn.com/nba/schedule",
  // Calendário de um time na ESPN (a sigla entra no fim)
  ESPN_TEAM_PAGE: "https://www.espn.com/nba/team/schedule/_/name/",
  // Logo da NBA (claro e para fundo escuro)
  LOGO: "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png",
  LOGO_ESCURO:
    "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500-dark/nba.png&w=500&h=500&transparent=true",

  // Quantos jogos o "basquete" mostra
  PROXIMOS: 5,
  // A ESPN não aceita intervalo de datas no placar da liga: o comando busca
  // dia a dia, nos dias que têm jogo (o calendário vem na própria resposta).
  // "basquete" busca até DIAS_MAX dias com jogo, de DIAS_POR_VEZ em
  // DIAS_POR_VEZ, até juntar PROXIMOS jogos; "--todos" mostra os jogos dos
  // próximos DIAS_TODOS dias com jogo.
  DIAS_POR_VEZ: 3,
  DIAS_MAX: 9,
  DIAS_TODOS: 5,

  // Sigla da ESPN (usada na URL) → apelidos e siglas alternativas aceitos
  TIMES: {
    atl: ["hawks"],
    bos: ["celtics"],
    bkn: ["nets", "brk"],
    cha: ["hornets", "cho"],
    chi: ["bulls"],
    cle: ["cavaliers", "cavs"],
    dal: ["mavericks", "mavs"],
    den: ["nuggets"],
    det: ["pistons"],
    gs: ["warriors", "gsw"],
    hou: ["rockets"],
    ind: ["pacers"],
    lac: ["clippers"],
    lal: ["lakers"],
    mem: ["grizzlies"],
    mia: ["heat"],
    mil: ["bucks"],
    min: ["timberwolves", "wolves"],
    no: ["pelicans", "nop"],
    ny: ["knicks", "nyk"],
    okc: ["thunder"],
    orl: ["magic"],
    phi: ["76ers", "sixers"],
    phx: ["suns", "pho"],
    por: ["blazers", "trailblazers"],
    sac: ["kings"],
    sa: ["spurs", "sas"],
    tor: ["raptors"],
    utah: ["jazz", "uta"],
    wsh: ["wizards", "was"],
  },
};

const TODOS = ["--todos", "--all"];

// Sigla da ESPN a partir do que o visitante digitou ("lakers" → "lal")
export function siglaDoTime(palavra) {
  if (NBA_CONFIG.TIMES[palavra]) return palavra;
  return Object.keys(NBA_CONFIG.TIMES).find((sigla) => NBA_CONFIG.TIMES[sigla].includes(palavra)) ?? null;
}

// Autocomplete (Tab) da segunda palavra: opções, siglas e apelidos
export const nbaSubcommands = [
  ...TODOS,
  ...Object.keys(NBA_CONFIG.TIMES),
  ...Object.values(NBA_CONFIG.TIMES).flat(),
];

// ["lal", "--todos"] → { time: "lal", todos: true }; null se não entender
export function parseBasquete(args) {
  const resultado = { time: null, todos: false };
  for (const arg of args) {
    if (TODOS.includes(arg)) {
      resultado.todos = true;
      continue;
    }
    const sigla = siglaDoTime(arg);
    if (!sigla || resultado.time) return null;
    resultado.time = sigla;
  }
  return resultado;
}

export default NBA_CONFIG;
