// Comando "ask": manda a pergunta para /api/ask e lê a resposta em streaming.
//
// A IA não guarda nada entre as perguntas: quem lembra da conversa é esta
// aba. As últimas mensagens vão junto com cada pergunta, para dar para
// perguntar "e antes disso?". Recarregar a página (ou "ask --nova") esquece.

import ASK_CONFIG from "../config/askConfig";

const { PROXY_PATH, MAX_HISTORICO, MAX_TEXTO_HISTORICO } = ASK_CONFIG;

let conversa = []; // [{ papel: "visitante" | "ia", texto }]

export const esquecerConversa = () => {
  conversa = [];
};

// Erro com o código que o servidor mandou (ver api/_ask.js), ou um destes:
//   indisponivel  a rota /api/ask não existe nesta implantação (ex.: Docker)
//   rede          o fetch falhou (sem internet, servidor fora do ar)
//   vazia         a IA não devolveu texto
export class ErroAsk extends Error {
  constructor(codigo, esperaSegundos = null) {
    super(codigo);
    this.codigo = codigo;
    this.esperaSegundos = esperaSegundos;
  }
}

// Chama aoReceber(textoAteAgora) a cada pedaço e devolve o texto completo
export async function perguntar(pergunta, { idioma, sinal, aoReceber }) {
  let resposta;
  try {
    resposta = await fetch(PROXY_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta, idioma, historico: conversa.slice(-MAX_HISTORICO) }),
      signal: sinal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new ErroAsk("rede");
  }

  // Sem o cabeçalho, quem respondeu não foi a função do ask
  if (!resposta.headers.get("X-Ask-Proxy")) throw new ErroAsk("indisponivel");

  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => ({}));
    const espera = Number(resposta.headers.get("Retry-After")) || null;
    throw new ErroAsk(corpo.erro ?? "falha_ia", espera);
  }

  const leitor = resposta.body.getReader();
  const decoder = new TextDecoder();
  let texto = "";
  for (;;) {
    const { done, value } = await leitor.read();
    if (done) break;
    texto += decoder.decode(value, { stream: true });
    aoReceber?.(texto);
  }
  texto = (texto + decoder.decode()).trim();
  if (!texto) throw new ErroAsk("vazia");
  aoReceber?.(texto);

  conversa = [
    ...conversa,
    { papel: "visitante", texto: pergunta },
    { papel: "ia", texto: texto.slice(0, MAX_TEXTO_HISTORICO) },
  ].slice(-MAX_HISTORICO);

  return texto;
}
