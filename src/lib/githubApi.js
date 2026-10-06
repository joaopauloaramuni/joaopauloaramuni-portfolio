import GITHUB_API_CONFIG from "../config/gitHubApiConfig";

// Chamadas à GitHub API dos comandos "github" e "stats".
//
// O token do site fica só no servidor: quem precisa dele chama o proxy
// /api/github (Vercel Function api/github.js, ou o vite.config.js no npm run
// dev), que acrescenta o token e guarda a resposta na CDN por 10 minutos.
//
//   • Sem { auth }: vai direto na API, no limite do IP do visitante (60
//     chamadas/hora). Se esse limite acabar, como numa rede de faculdade, ou
//     se a rede bloquear a api.github.com, repete pelo proxy.
//   • { auth: true }: vai direto pelo proxy (linguagens em bytes, que fariam
//     dezenas de chamadas).
//
// Sem proxy (Docker) ou sem token no servidor, tudo continua funcionando no
// limite do visitante, e o "stats" conta a linguagem principal de cada
// repositório em vez dos bytes.

const { BASE_URL, PROXY_PATH } = GITHUB_API_CONFIG;

// Erro específico para o limite da GitHub API (o painel mostra outra mensagem)
export class GitHubRateLimitError extends Error {}

// O proxy não existe (Docker) ou está sem token no servidor
export class GitHubProxyUnavailableError extends Error {}

// 403/429 numa rota pública é o limite de chamadas (por hora ou por minuto)
const isRateLimited = (response) =>
  response.status === 403 || response.status === 429;

// Resposta do proxy, ou null se ele não estiver disponível. O cabeçalho
// X-GitHub-Proxy separa a resposta dele do index.html que um servidor sem o
// proxy devolveria; 503 é o proxy sem token.
async function viaProxy(params) {
  try {
    const response = await fetch(`${PROXY_PATH}?${new URLSearchParams(params)}`);
    if (!response.headers.get("X-GitHub-Proxy") || response.status === 503) return null;
    return response;
  } catch {
    return null;
  }
}

export async function fetchGitHub(path, { auth = false } = {}) {
  let response;
  if (auth) {
    response = await viaProxy({ path });
    if (!response) throw new GitHubProxyUnavailableError("GitHub: proxy indisponível");
  } else {
    try {
      response = await fetch(`${BASE_URL}${path}`, {
        headers: { Accept: "application/vnd.github+json" },
      });
    } catch (error) {
      // api.github.com bloqueada na rede do visitante: tenta pelo próprio site
      response = await viaProxy({ path });
      if (!response) throw error;
    }
    if (isRateLimited(response)) response = (await viaProxy({ path })) ?? response;
  }
  if (isRateLimited(response)) {
    throw new GitHubRateLimitError(`GitHub: HTTP ${response.status}`);
  }
  if (!response.ok) throw new Error(`GitHub: HTTP ${response.status}`);
  return response.json();
}

// Consulta GraphQL pelo nome (o texto dela fica no servidor, em api/_github.js)
export async function fetchGitHubGraphQL(name, { cursor } = {}) {
  const response = await viaProxy({ graphql: name, ...(cursor && { cursor }) });
  if (!response) throw new GitHubProxyUnavailableError("GitHub GraphQL: proxy indisponível");
  if (isRateLimited(response)) {
    throw new GitHubRateLimitError(`GitHub GraphQL: HTTP ${response.status}`);
  }
  if (!response.ok) throw new Error(`GitHub GraphQL: HTTP ${response.status}`);
  const { data, errors } = await response.json();
  if (errors?.some((error) => error.type === "RATE_LIMITED")) {
    throw new GitHubRateLimitError("GitHub GraphQL: RATE_LIMITED");
  }
  if (errors?.length || !data) {
    throw new Error(`GitHub GraphQL: ${errors?.[0]?.message ?? "sem dados"}`);
  }
  return data;
}
