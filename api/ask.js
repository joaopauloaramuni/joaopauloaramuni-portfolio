// Vercel Function: POST /api/ask
// Recebe a pergunta do comando "ask" e devolve a resposta da IA em streaming
// (texto puro), com a chave GEMINI_API_KEY, que fica só no servidor. Regras,
// prompt e limites em api/_ask.js.

import { atenderAsk } from "./_ask.js";

export default function handler(req, res) {
  return atenderAsk(req, res, process.env);
}
