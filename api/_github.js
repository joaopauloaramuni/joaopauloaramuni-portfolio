// Proxy da GitHub API com o token do site, que fica só no servidor.
//
// O navegador nunca vê o token: ele chama /api/github?path=/users/... (ou
// ?graphql=languages) no próprio domínio, e quem acrescenta o token é:
//   • a Vercel Function api/github.js, em produção;
//   • o vite.config.js, no npm run dev e no npm run preview.
// Os dois leem GITHUB_SITE_TOKEN, sem o prefixo VITE_: variáveis com VITE_
// vão para o build e qualquer visitante consegue ler.
//
// Para o proxy não virar uma porta aberta para gastar o token com qualquer
// coisa do GitHub, ele só aceita leitura (GET) dos caminhos que o "github" e
// o "stats" usam, todos do mesmo usuário, e a consulta GraphQL das linguagens
// fica aqui dentro (o navegador só diz o nome dela). As respostas ficam 10 min
// no cache da CDN da Vercel, então o token é gasto uma vez para todo mundo.
//
// O nome começa com "_" para a Vercel não transformar este arquivo em rota.

import GITHUB_API_CONFIG from "../src/config/gitHubApiConfig.js";

const { USERNAME, BASE_URL, PROXY_PATH } = GITHUB_API_CONFIG;

export { PROXY_PATH };

// Caminhos da REST API que podem passar pelo proxy (com a query string)
const CAMINHOS_PERMITIDOS = [
  new RegExp(`^/users/${USERNAME}(/repos)?(\\?|$)`),
  new RegExp(`^/repos/${USERNAME}/[\\w.-]+/languages$`),
  new RegExp(`^/search/(issues|commits)\\?q=author:${USERNAME}\\+`),
];

// Consultas GraphQL conhecidas (o navegador manda só o nome)
const CONSULTAS = {
  // Linguagens de cada repositório público, em bytes (stats --linguagens)
  languages: `
    query ($login: String!, $cursor: String) {
      user(login: $login) {
        repositories(
          first: 100
          after: $cursor
          ownerAffiliations: OWNER
          isFork: false
          privacy: PUBLIC
        ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            name
            languages(first: 50, orderBy: { field: SIZE, direction: DESC }) {
              edges {
                size
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
  `,
};

const CACHE_OK = "public, max-age=0, s-maxage=600, stale-while-revalidate=3600";

const resposta = (status, corpo, cache = "no-store") => ({
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": cache,
    // O navegador confere este cabeçalho para saber que o proxy existe
    // (no Docker, sem ele, /api/github devolveria o index.html)
    "X-GitHub-Proxy": "1",
  },
  corpo: typeof corpo === "string" ? corpo : JSON.stringify(corpo),
});

const cabecalhos = (token) => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "User-Agent": `${USERNAME}-portfolio`,
  "X-GitHub-Api-Version": "2022-11-28",
});

// { status, headers, corpo } para uma URL /api/github?...
export async function responderGitHub(url, token) {
  if (!token) {
    return resposta(503, { message: "GITHUB_SITE_TOKEN não configurado no servidor" });
  }

  let upstream;
  const consulta = url.searchParams.get("graphql");
  if (consulta) {
    if (!CONSULTAS[consulta]) return resposta(400, { message: "Consulta desconhecida" });
    upstream = await fetch(`${BASE_URL}/graphql`, {
      method: "POST",
      headers: { ...cabecalhos(token), "Content-Type": "application/json" },
      body: JSON.stringify({
        query: CONSULTAS[consulta],
        variables: { login: USERNAME, cursor: url.searchParams.get("cursor") || null },
      }),
    });
  } else {
    const caminho = url.searchParams.get("path") ?? "";
    if (!CAMINHOS_PERMITIDOS.some((permitido) => permitido.test(caminho))) {
      return resposta(400, { message: "Caminho não permitido no proxy" });
    }
    upstream = await fetch(`${BASE_URL}${caminho}`, { headers: cabecalhos(token) });
  }

  // Só guarda no cache o que deu certo (GraphQL responde 200 até com erro)
  const corpo = await upstream.text();
  const temErros = () => {
    try {
      return Boolean(JSON.parse(corpo).errors);
    } catch {
      return true;
    }
  };
  const deuCerto = upstream.ok && !(consulta && temErros());
  return resposta(upstream.status, corpo, deuCerto ? CACHE_OK : "no-store");
}

// Adaptador para (req, res) do Node: serve para a Vercel e para o Vite
export async function atenderGitHub(req, res, token) {
  let resultado;
  try {
    resultado = await responderGitHub(new URL(req.url, "http://localhost"), token);
  } catch (error) {
    resultado = resposta(502, { message: `Falha ao falar com o GitHub: ${error.message}` });
  }
  res.statusCode = resultado.status;
  Object.entries(resultado.headers).forEach(([nome, valor]) => res.setHeader(nome, valor));
  res.end(resultado.corpo);
}
