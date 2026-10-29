// wakaTimeConfig.js
// Os estilos --terminal (padrão), --grade e --lista leem as estatísticas do
// WakaTime (https://wakatime.com/developers) em API_PATH, no próprio site
// (o WakaTime não libera CORS). Quem chama o WakaTime é o servidor:
//   • Vercel                → Vercel Function api/wakatime.js
//   • npm run dev / preview → vite.config.js (mesma regra, api/_wakatime.js)
//   • Docker                → nginx.conf (só a rota pública; troque o usuário lá)
// Com o token OAuth WAKATIME_ACCESS_TOKEN (escopo read_stats) os dados vêm da
// própria conta e funcionam mesmo com o perfil privado. Sem ele, o servidor
// usa o perfil público de USERNAME (https://wakatime.com/settings/profile).
const WAKATIME_CONFIG = {
  USERNAME: "aramuni",
  API_PATH: "/api/wakatime",
  RANGE: "all_time", // mesmo período dos cards
  PROFILE_URL: "https://wakatime.com/@aramuni",

  // Quantos itens cada estilo mostra (o resto vira "+ N linguagens")
  LIMITS: {
    grade: 12,
    lista: 10,
    terminal: { languages: 8, editors: 4, categories: 5, operatingSystems: 3 },
    // wakatime --projetos (todos com nome, menos os de HIDDEN_PROJECTS)
    projetos: 10,
    // wakatime --libs (as bibliotecas mais usadas, menos as de HIDDEN_DEPENDENCIES)
    libs: 12,
  },

  // Linguagens que não devem aparecer, ex.: ["Text", "Other"]
  HIDDEN_LANGUAGES: [],

  // Projetos que não devem aparecer pelo nome, ex.: ["cliente-x"]. No
  // wakatime --projetos eles saem da lista; no "codando agora" viram "projeto
  // privado". É tudo no servidor (api/_wakatime.js e api/_codando.js), então o
  // nome não vaza. O nome é o que o WakaTime mostra no dashboard (em geral, o
  // nome da pasta).
  HIDDEN_PROJECTS: [],

  // Bibliotecas que não devem aparecer no wakatime --libs. O WakaTime anota
  // os imports dos arquivos que você edita, então entram também pacotes
  // internos de clientes (ex.: "@cliente-x/auth") e a biblioteca padrão das
  // linguagens (ex.: "os", "sys", "java.util"), que só fazem barulho.
  // Comparação sem diferenciar maiúsculas; termine com "*" para esconder
  // tudo que começa assim, ex.: ["os", "sys", "@cliente-x/*", "java.*"].
  // É tudo no servidor (api/_wakatime.js), então o nome não vaza.
  HIDDEN_DEPENDENCIES: [],

  // "Codando agora" (boas-vindas e wakatime --agora). Usa os heartbeats do
  // WakaTime, que são privados e não têm versão pública: só funciona com o
  // token OAuth WAKATIME_ACCESS_TOKEN (escopo read_heartbeats), que fica só no
  // servidor (api/_codando.js). O navegador chama AGORA.API_PATH.
  AGORA: {
    API_PATH: "/api/codando",
    // Fuso da sua conta no WakaTime: é por ele que a API separa os dias
    TIMEZONE: "America/Sao_Paulo",
    // Último heartbeat há até tantos minutos = "codando agora". A extensão
    // manda um a cada ~2 min enquanto você digita.
    ATIVO_MINUTOS: 10,
    // Pausa maior que isso encerra a sessão (mesmo timeout padrão do WakaTime)
    PAUSA_MINUTOS: 15,
    // De quanto em quanto tempo o site pergunta de novo
    ATUALIZAR_SEGUNDOS: 60,
    // Todo projeto aparece pelo nome (com a branch), menos os de
    // HIDDEN_PROJECTS, que viram "projeto privado"
  },
};

export default WAKATIME_CONFIG;
