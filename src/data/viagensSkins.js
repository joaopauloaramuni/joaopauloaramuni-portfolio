import { parseSkin } from "../terminal/parseSkin";

// Visões do comando "viagens". Todas estas formas funcionam:
//   viagens --asia   viagens asia   viagens --skin asia   viagens --skin=asia
// Sem opção, abre o mapa-múndi. A ordem abaixo é a do rodapé "Mapas:".
// As regiões usam o mesmo id do `continentes` (sobreData.js).

export const SKINS = ["mundo", "america_do_sul", "minas", "europa", "asia", "lista"];
export const DEFAULT_SKIN = "mundo";

// Nomes aceitos (PT e EN) → visão
const SKIN_ALIASES = {
  mundo: "mundo",
  mapa: "mundo",
  world: "mundo",
  map: "mundo",
  america: "america_do_sul",
  sul: "america_do_sul",
  brasil: "america_do_sul",
  brazil: "america_do_sul",
  minas: "minas",
  mg: "minas",
  europa: "europa",
  europe: "europa",
  asia: "asia",
  lista: "lista",
  list: "lista",
};

// Subcomandos do autocomplete (Tab)
export const viagensSubcommands = [
  "--mundo",
  "--america",
  "--brasil",
  "--minas",
  "--europa",
  "--asia",
  "--lista",
  "--world",
  "--europe",
  "--list",
];

export const parseViagensSkin = (args) => parseSkin(args, SKIN_ALIASES, DEFAULT_SKIN);
