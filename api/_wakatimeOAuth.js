// Token OAuth do WakaTime, compartilhado por api/_wakatime.js (estatísticas)
// e api/_codando.js ("Codando agora").
//
// Desde 01/11/2026 a API key do WakaTime só serve para os plugins mandarem
// dados; para ler, a API exige um token OAuth, enviado em
// "Authorization: Bearer <token>". O token sai do scripts/wakatime-oauth.mjs
// (npm run wakatime:oauth) e fica só no servidor (WAKATIME_ACCESS_TOKEN, sem
// o prefixo VITE_).
//
// Token expirado ou revogado (401): se WAKATIME_APP_ID, WAKATIME_APP_SECRET e
// WAKATIME_REFRESH_TOKEN existirem, pede um novo e tenta de novo. O novo
// fica só na memória da função; para valer de vez, rode o script de novo.
//
// O nome começa com "_" para a Vercel não transformar este arquivo em rota.

export const WAKATIME_API = "https://wakatime.com/api/v1";
const OAUTH_TOKEN_URL = "https://wakatime.com/oauth/token";
const TIMEOUT_RENOVAR_MS = 6000;

const limpo = (valor) => String(valor ?? "").trim();

// Token renovado nesta instância da função (null = usar o do env)
let tokenRenovado = null;
let renovando = null;

export const temToken = (env) => Boolean(limpo(env.WAKATIME_ACCESS_TOKEN));

const tokenAtual = (env) => tokenRenovado ?? limpo(env.WAKATIME_ACCESS_TOKEN);

const podeRenovar = (env) =>
  Boolean(
    limpo(env.WAKATIME_APP_ID) &&
      limpo(env.WAKATIME_APP_SECRET) &&
      limpo(env.WAKATIME_REFRESH_TOKEN)
  );

// Vários pedidos com 401 ao mesmo tempo: uma renovação só
function renovarToken(env) {
  if (!renovando) {
    renovando = (async () => {
      const resp = await fetch(OAUTH_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          client_id: limpo(env.WAKATIME_APP_ID),
          client_secret: limpo(env.WAKATIME_APP_SECRET),
          grant_type: "refresh_token",
          refresh_token: limpo(env.WAKATIME_REFRESH_TOKEN),
        }),
        signal: AbortSignal.timeout(TIMEOUT_RENOVAR_MS),
      });
      const texto = await resp.text();
      if (!resp.ok) throw new Error(`WakaTime OAuth ${resp.status} ao renovar o token`);
      // O WakaTime pode responder em JSON ou em form-urlencoded
      let dados;
      try {
        dados = JSON.parse(texto);
      } catch {
        dados = Object.fromEntries(new URLSearchParams(texto));
      }
      if (!dados.access_token) throw new Error("WakaTime OAuth: resposta sem access_token");
      tokenRenovado = dados.access_token;
      console.warn("WakaTime: token renovado. Rode npm run wakatime:oauth para atualizar o env.");
    })().finally(() => {
      renovando = null;
    });
  }
  return renovando;
}

// GET na API do WakaTime; devolve o Response e quem chama trata o status.
//   autenticado: true  → manda o token (dados da própria conta, "current")
//   autenticado: false → sem token (perfil público)
export async function chamarWakaTime(caminho, env, { autenticado = true, timeout = 6000 } = {}) {
  const pedir = () => {
    const headers = { Accept: "application/json" };
    if (autenticado) headers.Authorization = `Bearer ${tokenAtual(env)}`;
    return fetch(`${WAKATIME_API}${caminho}`, { headers, signal: AbortSignal.timeout(timeout) });
  };

  const resp = await pedir();
  if (autenticado && resp.status === 401 && podeRenovar(env)) {
    try {
      await renovarToken(env);
    } catch (erro) {
      console.error("WakaTime:", erro?.message ?? erro);
      return resp;
    }
    return pedir();
  }
  return resp;
}
