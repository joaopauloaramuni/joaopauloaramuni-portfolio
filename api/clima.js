// Vercel Function: GET /api/clima
// Devolve o clima atual da cidade aproximada do visitante (pelos cabeçalhos
// x-vercel-ip-* da Vercel), sem cache de CDN. Regras em api/_clima.js.

import { atenderClima } from "./_clima.js";

export default function handler(req, res) {
  return atenderClima(req, res);
}
