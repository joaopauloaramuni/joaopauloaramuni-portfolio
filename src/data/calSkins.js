import { parseSkin } from "../terminal/parseSkin";

// Visões do comando "cal". Todas estas formas funcionam:
//   cal --semana   cal semana   cal --skin semana   cal --skin=semana
// Sem opção, abre o mês (como o cal do Linux).
// A ordem abaixo é a do rodapé "Estilos:" (o padrão vem primeiro).

export const SKINS = ["mes", "semana", "hoje"];
export const DEFAULT_SKIN = "mes";

// Nomes aceitos (PT e EN) → visão
const SKIN_ALIASES = {
  mes: "mes",
  month: "mes",
  semana: "semana",
  week: "semana",
  hoje: "hoje",
  today: "hoje",
  agora: "hoje",
  now: "hoje",
};

export const parseCalSkin = (args) => parseSkin(args, SKIN_ALIASES, DEFAULT_SKIN);
