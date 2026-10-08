// galoConfig.js
// Comando "jogos" (ou "galo", "atletico"): próximos jogos do Atlético
// Mineiro, buscados ao vivo no navegador do visitante (ver lib/galo.js).
// Uma fonte só, a API pública da ESPN (site.api.espn.com): não pede chave e
// libera CORS. Dela vêm o calendário e os resultados de todas as
// competições, os escudos dos times, os logos dos campeonatos, o jogo de ida
// e de volta (leg) e o placar agregado.
const GALO_CONFIG = {
  // Id do Atlético-MG na ESPN (espn.com/soccer/club/_/id/7632/atletico-mg)
  ESPN_TEAM_ID: "7632",
  ESPN_API: "https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams",
  // Página "Calendário" do Galo na ESPN, no rodapé do comando
  ESPN_PAGE: "https://www.espn.com.br/futebol/time/calendario/_/id/7632/atletico-mg",

  // Quantos jogos o "jogos" mostra ("jogos --todos" mostra todos os marcados)
  PROXIMOS: 5,

  // Nome traduzido de cada campeonato (jogos.competicoes.<chave> no i18n),
  // pelo "slug" da ESPN. Campeonato fora da lista aparece com o nome que a
  // ESPN mandar; o logo vem sempre da ESPN.
  COMPETICOES: {
    "bra.1": "brasileirao",
    "bra.copa_do_brazil": "copa_do_brasil",
    "conmebol.libertadores": "libertadores",
    "conmebol.sudamericana": "sulamericana",
    "conmebol.recopa": "recopa",
    "fifa.cwc": "mundial",
    "bra.camp.mineiro": "mineiro",
    "bra.supercopa_do_brazil": "supercopa",
    "club.friendly": "amistoso",
  },
};

export default GALO_CONFIG;
