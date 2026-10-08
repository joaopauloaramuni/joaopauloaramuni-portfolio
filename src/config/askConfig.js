// askConfig.js
// Comando "ask": o visitante pergunta e uma IA responde em primeira pessoa,
// com base no meu currículo e no conteúdo deste portfólio.
//
// A chave da API (GEMINI_API_KEY) não fica aqui: ela é lida só no servidor,
// pela Vercel Function api/ask.js e pelo vite.config.js no npm run dev. O
// navegador chama PROXY_PATH (/api/ask) no próprio domínio.
// Este arquivo não lê import.meta.env porque o api/_ask.js (Node) também o
// importa: os limites abaixo valem igual para os dois lados.
const ASK_CONFIG = {
  PROXY_PATH: "/api/ask",

  // Foto que aparece ao lado de cada resposta (a mesma do comando "sobre")
  AVATAR: "/avatar.jpeg",

  // Tamanho máximo da pergunta, em caracteres
  MAX_PERGUNTA: 500,

  // Quantas mensagens anteriores (perguntas e respostas) vão junto, para
  // dar para perguntar "e antes disso?". 6 = as últimas 3 perguntas.
  MAX_HISTORICO: 6,

  // Cada mensagem do histórico é cortada neste tamanho
  MAX_TEXTO_HISTORICO: 1500,
};

export default ASK_CONFIG;
