// wakaTimeConfig.js
// Os estilos --terminal (padrão), --grade e --lista leem a API pública do WakaTime
// (https://wakatime.com/developers). O perfil precisa estar público em
// https://wakatime.com/settings/profile; assim nenhuma chave é necessária.
//
// O WakaTime não libera CORS, então o navegador chama um caminho do próprio
// site (API_PATH) e quem repassa para wakatime.com/api/v1/users/<USERNAME> é:
//   • npm run dev / preview → proxy do vite.config.js (lê este arquivo)
//   • Vercel                → rewrite do vercel.json (troque o usuário lá também)
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
  },

  // Linguagens que não devem aparecer, ex.: ["Text", "Other"]
  HIDDEN_LANGUAGES: [],

  // "Codando agora" (boas-vindas e wakatime --agora). Diferente do resto, usa
  // os heartbeats do WakaTime, que são privados: precisa da WAKATIME_API_KEY,
  // que fica só no servidor (api/_codando.js). O navegador chama AGORA.API_PATH.
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
    // Só estes projetos aparecem pelo nome (com a branch). Os outros viram
    // "projeto privado", para não expor projeto de cliente. O nome é o que o
    // WakaTime mostra no dashboard (em geral, o nome da pasta).
    PROJETOS_PUBLICOS: ["joaopauloaramuni-portfolio"],
    // false: projeto fora da lista não aparece de jeito nenhum
    MOSTRAR_PRIVADOS: true,
  },
};

export default WAKATIME_CONFIG;
