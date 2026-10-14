// Vercel Function: GET /api/codando
// Em que projeto estou mexendo no editor agora, pelos heartbeats do WakaTime,
// com o token OAuth WAKATIME_ACCESS_TOKEN, que fica só no servidor. Regras em
// api/_codando.js.

import { atenderCodando } from "./_codando.js";

export default function handler(req, res) {
  return atenderCodando(req, res, process.env);
}
