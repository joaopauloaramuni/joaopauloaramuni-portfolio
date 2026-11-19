// Séries do comando "series". Nomes originais, não traduzidos (como no
// "sobre"); o título com que a série passou no Brasil vai em `br`.
//
//   id      chave única (nome do arquivo do cartaz em public/series/)
//   nome    título original
//   br      título no Brasil, quando é outro (aparece só em português)
//   ano     ano de estreia (desempata a busca no TVmaze)
//   lista   "assistindo" | "vistas" | "desenhos"
//   imdb    id no IMDb: o `npm run series` acha a série por ele no TVmaze
//   busca   texto da busca no TVmaze, quando não há imdb (padrão: nome)
//   tvmaze  id no TVmaze: fixa a série quando a busca erra
//   temporada  usa o cartaz desta temporada do show do TVmaze (Power Rangers
//           é um show só no TVmaze, e cada fase é uma temporada)
//   poster  caminho de um cartaz próprio em public/ (pula o TVmaze)
//
// Os cartazes e links vêm do `npm run series` (scripts/series.mjs), que
// grava data/seriesPosters.js e baixa as imagens para public/series/.
// A ordem aqui não importa: o comando ordena por nome.

export const SERIES = [
  // ---------- Assistindo agora ----------
  { id: "silo", nome: "Silo", ano: 2023, lista: "assistindo", imdb: "tt14688458" },
  { id: "rings-of-power", nome: "The Lord of the Rings: The Rings of Power", ano: 2022, lista: "assistindo", imdb: "tt7631058" },
  { id: "harry-potter", nome: "Harry Potter", ano: 2026, lista: "assistindo", tvmaze: 68803 },
  { id: "seal-team", nome: "SEAL Team", ano: 2017, lista: "assistindo", tvmaze: 28160 },
  { id: "the-purge", nome: "The Purge", br: "Uma Noite de Crime", ano: 2018, lista: "assistindo" },
  { id: "pawn-stars", nome: "Pawn Stars", br: "Trato Feito", ano: 2009, lista: "assistindo" },
  { id: "masterchef-profissionais", nome: "MasterChef Profissionais", ano: 2016, lista: "assistindo" },
  { id: "constantine", nome: "Constantine", ano: 2014, lista: "assistindo", imdb: "tt3489184" },
  { id: "fear-the-walking-dead", nome: "Fear the Walking Dead", ano: 2015, lista: "assistindo" },

  // ---------- Já vi ----------
  { id: "24", nome: "24", br: "24 Horas", ano: 2001, lista: "vistas", imdb: "tt0285331" },
  { id: "alcatraz", nome: "Alcatraz", ano: 2012, lista: "vistas", imdb: "tt1728102" },
  { id: "arrow", nome: "Arrow", ano: 2012, lista: "vistas", imdb: "tt2193021" },
  { id: "the-big-bang-theory", nome: "The Big Bang Theory", ano: 2007, lista: "vistas", imdb: "tt0898266" },
  { id: "castelo-ra-tim-bum", nome: "Castelo Rá-Tim-Bum", ano: 1994, lista: "vistas" },
  { id: "el-chavo-del-ocho", nome: "El Chavo del Ocho", br: "Chaves", ano: 1973, lista: "vistas" },
  { id: "dahmer", nome: "Dahmer – Monster: The Jeffrey Dahmer Story", ano: 2022, lista: "vistas", imdb: "tt13207736" },
  { id: "the-day-of-the-jackal", nome: "The Day of the Jackal", br: "O Dia do Chacal", ano: 2024, lista: "vistas" },
  { id: "dexter", nome: "Dexter", ano: 2006, lista: "vistas", imdb: "tt0773262" },
  { id: "dune-prophecy", nome: "Dune: Prophecy", br: "Duna: A Profecia", ano: 2024, lista: "vistas", imdb: "tt10466872" },
  { id: "elize-matsunaga", nome: "Elize Matsunaga: Era Uma Vez um Crime", ano: 2021, lista: "vistas", busca: "Elize Matsunaga" },
  { id: "falling-skies", nome: "Falling Skies", ano: 2011, lista: "vistas", imdb: "tt1462059" },
  { id: "the-following", nome: "The Following", ano: 2013, lista: "vistas", imdb: "tt2071645" },
  { id: "foundation", nome: "Foundation", br: "Fundação", ano: 2021, lista: "vistas", imdb: "tt0804484" },
  { id: "the-fresh-prince-of-bel-air", nome: "The Fresh Prince of Bel-Air", br: "Um Maluco no Pedaço", ano: 1990, lista: "vistas", imdb: "tt0098800" },
  { id: "fringe", nome: "Fringe", ano: 2008, lista: "vistas", imdb: "tt1119644" },
  { id: "from", nome: "From", ano: 2022, lista: "vistas", imdb: "tt9813792" },
  { id: "gossip-girl", nome: "Gossip Girl", ano: 2007, lista: "vistas", imdb: "tt0397442" },
  { id: "the-it-crowd", nome: "The IT Crowd", ano: 2006, lista: "vistas", imdb: "tt0487831" },
  { id: "kaleidoscope", nome: "Kaleidoscope", br: "Caleidoscópio", ano: 2023, lista: "vistas" },
  { id: "kenan-and-kel", nome: "Kenan & Kel", ano: 1996, lista: "vistas" },
  { id: "la-casa-de-papel", nome: "La Casa de Papel", ano: 2017, lista: "vistas", imdb: "tt6468322" },
  { id: "the-last-of-us", nome: "The Last of Us", ano: 2023, lista: "vistas", imdb: "tt3581920" },
  { id: "lie-to-me", nome: "Lie to Me", ano: 2009, lista: "vistas", imdb: "tt1235099" },
  { id: "lost", nome: "Lost", ano: 2004, lista: "vistas", imdb: "tt0411008" },
  { id: "masterchef-brasil", nome: "MasterChef Brasil", br: "MasterChef Amadores", ano: 2014, lista: "vistas" },
  { id: "masterchef-confeitaria", nome: "MasterChef Confeitaria", ano: 2024, lista: "vistas" },
  { id: "o-mecanismo", nome: "O Mecanismo", ano: 2018, lista: "vistas" },
  { id: "mr-bean", nome: "Mr. Bean", ano: 1990, lista: "vistas", imdb: "tt0096657" },
  { id: "oz", nome: "Oz", ano: 1997, lista: "vistas", imdb: "tt0118421" },
  { id: "pacto-brutal", nome: "Pacto Brutal: O Assassinato de Daniella Perez", ano: 2022, lista: "vistas", busca: "Pacto Brutal" },
  { id: "the-penguin", nome: "The Penguin", ano: 2024, lista: "vistas", imdb: "tt15435876" },
  // Power Rangers: cada fase é uma série própria, com o seu cartaz. No
  // TVmaze é um show só (794), e cada fase é uma temporada
  { id: "mighty-morphin-power-rangers", nome: "Mighty Morphin Power Rangers", ano: 1993, lista: "vistas", tvmaze: 794, temporada: 1 },
  { id: "power-rangers-turbo", nome: "Power Rangers Turbo", ano: 1997, lista: "vistas", tvmaze: 794, temporada: 5 },
  { id: "power-rangers-in-space", nome: "Power Rangers in Space", br: "Power Rangers no Espaço", ano: 1998, lista: "vistas", tvmaze: 794, temporada: 6 },
  { id: "power-rangers-lightspeed-rescue", nome: "Power Rangers Lightspeed Rescue", br: "Power Rangers Resgate", ano: 2000, lista: "vistas", tvmaze: 794, temporada: 8 },
  { id: "power-rangers-time-force", nome: "Power Rangers Time Force", br: "Power Rangers Força do Tempo", ano: 2001, lista: "vistas", tvmaze: 794, temporada: 9 },
  { id: "power-rangers-wild-force", nome: "Power Rangers Wild Force", br: "Power Rangers Força Animal", ano: 2002, lista: "vistas", tvmaze: 794, temporada: 10 },
  { id: "prison-break", nome: "Prison Break", ano: 2005, lista: "vistas", imdb: "tt0455275" },
  { id: "sai-de-baixo", nome: "Sai de Baixo", ano: 1996, lista: "vistas" },
  { id: "stranger-things", nome: "Stranger Things", ano: 2016, lista: "vistas", imdb: "tt4574334" },
  { id: "tremembe", nome: "Tremembé", ano: 2025, lista: "vistas" },
  { id: "true-blood", nome: "True Blood", ano: 2008, lista: "vistas", imdb: "tt0844441" },
  { id: "verdades-secretas", nome: "Verdades Secretas", ano: 2015, lista: "vistas" },
  { id: "the-walking-dead", nome: "The Walking Dead", ano: 2010, lista: "vistas", imdb: "tt1520211" },
  { id: "xena", nome: "Xena: Warrior Princess", br: "Xena: A Princesa Guerreira", ano: 1995, lista: "vistas" },

  // ---------- Desenhos ----------
  { id: "death-note", nome: "Death Note", ano: 2006, lista: "desenhos", imdb: "tt0877057" },
  { id: "dexters-laboratory", nome: "Dexter's Laboratory", br: "O Laboratório de Dexter", ano: 1996, lista: "desenhos", imdb: "tt0115157" },
  { id: "doug", nome: "Doug", ano: 1991, lista: "desenhos" },
  { id: "hey-arnold", nome: "Hey Arnold!", ano: 1996, lista: "desenhos" },
  { id: "johnny-bravo", nome: "Johnny Bravo", ano: 1997, lista: "desenhos" },
  { id: "pokemon", nome: "Pokémon", ano: 1997, lista: "desenhos", imdb: "tt0168366" },
  { id: "scooby-doo", nome: "Scooby-Doo, Where Are You!", br: "Scooby-Doo, Cadê Você?", ano: 1969, lista: "desenhos", tvmaze: 53331 },
  { id: "the-simpsons", nome: "The Simpsons", br: "Os Simpsons", ano: 1989, lista: "desenhos", imdb: "tt0096697" },
  { id: "yu-gi-oh", nome: "Yu-Gi-Oh!", ano: 2000, lista: "desenhos", busca: "Yu-Gi-Oh! Duel Monsters" },
];

// Ordem das seções na tela
export const LISTAS = ["assistindo", "vistas", "desenhos"];

// Ordem alfabética pelo nome original, sem o artigo do começo
// ("The Walking Dead" fica no W, "La Casa de Papel" no C), como numa estante
const ARTIGO = /^(the|a|an|la|el|los|las|o|os|as)\s+/i;
export const chaveOrdem = (nome) => nome.replace(ARTIGO, "");

export const ordenar = (lista) =>
  [...lista].sort((a, b) =>
    chaveOrdem(a.nome).localeCompare(chaveOrdem(b.nome), "pt", {
      sensitivity: "base",
      numeric: true,
    }),
  );
