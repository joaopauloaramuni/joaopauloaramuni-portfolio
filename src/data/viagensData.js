// Dados do comando "viagens": os lugares por onde já passei, no mapa.
//
// Os países (bandeira, continente e cor) vêm do `continentes` do
// sobreData.js, o mesmo do "Carimbos no passaporte" do comando "sobre":
// aqui ficam só as cidades. Os nomes ficam no i18n, em viagens.cidades.<id>.
//
// Depois de mexer nas cidades ou nas visões, rode `npm run viagens`: ele
// redesenha a grade de pontos de cada mapa em src/data/viagensMapa.js
// (os países com cidade aqui ficam coloridos). Uma cidade num país novo
// precisa do país no `continentes` do sobreData.js, com a bandeira.

// Casa: o ponto verde pulsando (não conta como destino)
export const BASE = { id: "belo_horizonte", pais: "BR", lat: -19.9167, lon: -43.9345 };

// Cidades visitadas. A ordem é a prioridade do rótulo no mapa: quando dois
// nomes não cabem lado a lado, aparece o que vem primeiro (o outro continua
// no pino, ao passar o mouse ou tocar).
//   id    chave do nome (viagens.cidades.<id>)
//   pais  código ISO do país, o mesmo `sigla` do sobreData.js
export const CIDADES = [
  // Ásia
  { id: "toquio", pais: "JP", lat: 35.6762, lon: 139.6503 },
  { id: "kyoto", pais: "JP", lat: 35.0116, lon: 135.7681 },
  { id: "osaka", pais: "JP", lat: 34.6937, lon: 135.5023 },
  { id: "kawaguchiko", pais: "JP", lat: 35.5167, lon: 138.7517 },
  { id: "yuzawa", pais: "JP", lat: 36.9497, lon: 138.8125 },
  { id: "seul", pais: "KR", lat: 37.5665, lon: 126.978 },
  { id: "pequim", pais: "CN", lat: 39.9042, lon: 116.4074 },
  { id: "hong_kong", pais: "HK", lat: 22.3193, lon: 114.1694 },
  { id: "macau", pais: "MO", lat: 22.1987, lon: 113.5439 },
  { id: "bangkok", pais: "TH", lat: 13.7563, lon: 100.5018 },
  { id: "phuket", pais: "TH", lat: 7.8804, lon: 98.3923 },
  { id: "phi_phi", pais: "TH", lat: 7.7407, lon: 98.7784 },
  { id: "singapura", pais: "SG", lat: 1.3521, lon: 103.8198 },
  { id: "tioman", pais: "MY", lat: 2.7906, lon: 104.1694 },
  { id: "mersing", pais: "MY", lat: 2.4312, lon: 103.8405 },
  { id: "bali", pais: "ID", lat: -8.5069, lon: 115.2625 },
  { id: "uluwatu", pais: "ID", lat: -8.8291, lon: 115.0849 },
  { id: "dubai", pais: "AE", lat: 25.2048, lon: 55.2708 },
  { id: "abu_dhabi", pais: "AE", lat: 24.4539, lon: 54.3773 },

  // Europa
  { id: "paris", pais: "FR", lat: 48.8566, lon: 2.3522 },
  { id: "berlim", pais: "DE", lat: 52.52, lon: 13.405 },
  { id: "roma", pais: "IT", lat: 41.9028, lon: 12.4964 },
  { id: "milao", pais: "IT", lat: 45.4642, lon: 9.19 },
  { id: "veneza", pais: "IT", lat: 45.4408, lon: 12.3155 },
  { id: "florenca", pais: "IT", lat: 43.7696, lon: 11.2558 },
  { id: "pisa", pais: "IT", lat: 43.7228, lon: 10.4017 },
  { id: "zurique", pais: "CH", lat: 47.3769, lon: 8.5417 },
  { id: "st_moritz", pais: "CH", lat: 46.4908, lon: 9.8355 },
  { id: "vaticano", pais: "VA", lat: 41.9029, lon: 12.4534 },

  // América do Sul
  { id: "rio_de_janeiro", pais: "BR", lat: -22.9068, lon: -43.1729 },
  { id: "sao_paulo", pais: "BR", lat: -23.5505, lon: -46.6333 },
  { id: "buenos_aires", pais: "AR", lat: -34.6037, lon: -58.3816 },
  { id: "montevideu", pais: "UY", lat: -34.9011, lon: -56.1645 },
  { id: "punta_del_este", pais: "UY", lat: -34.96, lon: -54.933 },
  { id: "florianopolis", pais: "BR", lat: -27.5954, lon: -48.548 },
  { id: "curitiba", pais: "BR", lat: -25.4284, lon: -49.2733 },
  { id: "aracaju", pais: "BR", lat: -10.9472, lon: -37.0731 },
  { id: "feira_de_santana", pais: "BR", lat: -12.2664, lon: -38.9663 },
  { id: "porto_seguro", pais: "BR", lat: -16.4435, lon: -39.0643 },
  { id: "alcobaca", pais: "BR", lat: -17.5195, lon: -39.1956 },
  { id: "campinas", pais: "BR", lat: -22.9099, lon: -47.0626 },
  { id: "batatais", pais: "BR", lat: -20.8911, lon: -47.5853 },
  { id: "petropolis", pais: "BR", lat: -22.5112, lon: -43.1779 },
  { id: "niteroi", pais: "BR", lat: -22.8832, lon: -43.1034 },
  { id: "arraial_do_cabo", pais: "BR", lat: -22.9661, lon: -42.0278 },
  { id: "cabo_frio", pais: "BR", lat: -22.8894, lon: -42.0286 },
  { id: "buzios", pais: "BR", lat: -22.7469, lon: -41.8817 },
  { id: "paraty", pais: "BR", lat: -23.2178, lon: -44.7131 },
  { id: "angra_dos_reis", pais: "BR", lat: -23.0067, lon: -44.3181 },
  { id: "ouro_preto", pais: "BR", lat: -20.3856, lon: -43.5035 },
  { id: "diamantina", pais: "BR", lat: -18.2413, lon: -43.6033 },
  { id: "tiradentes", pais: "BR", lat: -21.1102, lon: -44.1781 },
  { id: "sao_tome_das_letras", pais: "BR", lat: -21.7214, lon: -44.9847 },
  { id: "vicosa", pais: "BR", lat: -20.7546, lon: -42.8825 },
  { id: "rio_casca", pais: "BR", lat: -20.2286, lon: -42.6503 },
  { id: "catas_altas", pais: "BR", lat: -20.0731, lon: -43.4061 },
  { id: "lavras_novas", pais: "BR", lat: -20.4697, lon: -43.5203 },
  { id: "brumadinho", pais: "BR", lat: -20.1433, lon: -44.2003 },
  { id: "macacos", pais: "BR", lat: -20.1347, lon: -43.8497 },
  { id: "caete", pais: "BR", lat: -19.8803, lon: -43.6697 },
  { id: "dores_do_indaia", pais: "BR", lat: -19.4628, lon: -45.6011 },
  { id: "estrela_do_indaia", pais: "BR", lat: -19.5167, lon: -45.7833 },
  { id: "congonhas", pais: "BR", lat: -20.4997, lon: -43.8586 },
  { id: "sao_joao_del_rei", pais: "BR", lat: -21.1356, lon: -44.2617 },
  { id: "mariana", pais: "BR", lat: -20.3778, lon: -43.4161 },
  { id: "sabara", pais: "BR", lat: -19.8886, lon: -43.8056 },
  { id: "tres_coracoes", pais: "BR", lat: -21.6956, lon: -45.2553 },
  { id: "bichinho", pais: "BR", lat: -21.0697, lon: -44.15 },
  { id: "divinopolis", pais: "BR", lat: -20.1446, lon: -44.8912 },
  { id: "governador_valadares", pais: "BR", lat: -18.8511, lon: -41.9494 },
  { id: "santana_do_riacho", pais: "BR", lat: -19.1661, lon: -43.7139 },
  { id: "rio_acima", pais: "BR", lat: -20.0878, lon: -43.7878 },
  { id: "serra_do_cipo", pais: "BR", lat: -19.3486, lon: -43.6175 },
  { id: "betim", pais: "BR", lat: -19.9678, lon: -44.1983 },
  { id: "contagem", pais: "BR", lat: -19.9317, lon: -44.0536 },
  { id: "nova_lima", pais: "BR", lat: -19.9858, lon: -43.8467 },
  { id: "formiga", pais: "BR", lat: -20.4644, lon: -45.4264 },
  { id: "pains", pais: "BR", lat: -20.3711, lon: -45.6628 },
];

// Recorte de cada mapa (graus). "passo" é a altura de cada ponto da grade em
// graus de latitude; a largura é corrigida pelo cosseno da latitude do meio,
// para o recorte não sair esticado (o mundo fica sem correção, como um
// mapa-múndi comum). O id das regiões é o mesmo do `continentes` (menos o
// "minas", que é só um zoom).
export const VISOES = {
  mundo: { norte: 78, sul: -56, oeste: -180, leste: 180, passo: 2.4, corrigir: false },
  america_do_sul: { norte: -7, sul: -37, oeste: -62, leste: -33, passo: 0.4 },
  // Zoom em Minas: as cidades perto de BH não cabem com nome no recorte acima
  minas: { norte: -17.6, sul: -22.2, oeste: -46.3, leste: -41.4, passo: 0.06 },
  europa: { norte: 55, sul: 39.5, oeste: -3, leste: 18, passo: 0.2 },
  asia: { norte: 44, sul: -12, oeste: 50, leste: 146, passo: 0.7 },
};
