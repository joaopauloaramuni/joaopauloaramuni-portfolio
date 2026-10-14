// Vercel Function: GET /api/wakatime
// Estatísticas do comando wakatime (--terminal, --grade e --lista), lidas com
// o token OAuth WAKATIME_ACCESS_TOKEN (escopo read_stats), que fica só no
// servidor. Sem o token, usa o perfil público. Regras em api/_wakatime.js.

import { atenderWakaTime } from "./_wakatime.js";

export default function handler(req, res) {
  return atenderWakaTime(req, res, process.env);
}
