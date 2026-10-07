// Proxy da GitHub API com o token do site, que fica só no servidor.
//
// O navegador nunca vê o token: ele chama /api/github?path=/users/... (ou
// ?graphql=languages) no próprio domínio, e quem acrescenta o token é:
//   • a Vercel Function api/github.js, em produção;
//   • o vite.config.js, no npm run dev e no npm run preview.
// Os dois leem GITHUB_SITE_TOKEN, sem o prefixo VITE_: variáveis com VITE_
// vão para o build e qualquer visitante consegue ler.
//
// Para o proxy não virar uma porta aberta para gastar o token:
//   • só aceita GET (e HEAD) e um único parâmetro, path ou graphql;
//   • o path precisa ser exatamente um dos caminhos que o site pede
//     (src/lib/githubPaths.js monta os dois lados). Antes bastava começar do
//     jeito certo, e variações como ?x=1, ?x=2... escapavam do cache da CDN e
//     gastavam uma chamada do token cada uma;
//   • as linguagens de um repositório só passam se ele for do usuário;
//   • a consulta GraphQL fica aqui dentro (o navegador só diz o nome dela), e
//     é o servidor que percorre as páginas: não há cursor para variar;
//   • as respostas ficam 10 min no cache da CDN da Vercel e, como a mesma URL
//     pode ser escrita de vários jeitos (%2F ou /...), também 10 min na
//     memória da função. Assim o token é gasto uma vez por caminho para todo
//     mundo, por mais que alguém varie a URL.
//
// O nome começa com "_" para a Vercel não transformar este arquivo em rota.

import GITHUB_API_CONFIG from "../src/config/gitHubApiConfig.js";
import {
  allowedPaths,
  githubPaths,
  languagesRepo,
  MAX_REPO_PAGES,
} from "../src/lib/githubPaths.js";

const { USERNAME, BASE_URL, PROXY_PATH } = GITHUB_API_CONFIG;

export { PROXY_PATH };

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

const CACHE_MS = 10 * 60 * 1000;
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

/* =====================================================================
   Cache em memória (por instância da função)
   ===================================================================== */

const memoria = new Map(); // chave → { ate, valor }
const emAndamento = new Map(); // chave → promessa: pedidos iguais viram um só

// Busca uma vez e guarda por 10 min o que deu certo. As chaves são poucas e
// conhecidas (os caminhos permitidos), então o mapa não cresce sem limite.
async function comCache(chave, buscar) {
  const guardado = memoria.get(chave);
  if (guardado && guardado.ate > Date.now()) return guardado.valor;
  if (emAndamento.has(chave)) return emAndamento.get(chave);

  const promessa = buscar()
    .then((valor) => {
      if (valor.deuCerto) memoria.set(chave, { ate: Date.now() + CACHE_MS, valor });
      return valor;
    })
    .finally(() => emAndamento.delete(chave));
  emAndamento.set(chave, promessa);
  return promessa;
}

/* =====================================================================
   Chamadas à GitHub API
   ===================================================================== */

async function rest(caminho, token) {
  const upstream = await fetch(`${BASE_URL}${caminho}`, { headers: cabecalhos(token) });
  const corpo = await upstream.text();
  return { status: upstream.status, corpo, deuCerto: upstream.ok };
}

// Nomes dos repositórios do usuário: as linguagens só passam para eles
async function nomesDosRepositorios(token) {
  const resultado = await comCache("repos:nomes", async () => {
    const nomes = new Set();
    for (let pagina = 1; pagina <= MAX_REPO_PAGES; pagina++) {
      const { corpo, deuCerto } = await rest(githubPaths.repos(pagina), token);
      if (!deuCerto) return { deuCerto: false, nomes };
      const lista = JSON.parse(corpo);
      lista.forEach((repo) => nomes.add(repo.name));
      if (lista.length < 100) break;
    }
    return { deuCerto: true, nomes };
  });
  return resultado.nomes;
}

// Todas as páginas da consulta, numa resposta só, no mesmo formato de uma
// página (data.user.repositories.nodes). Erro (inclusive RATE_LIMITED) volta
// como veio, para o navegador reconhecer.
async function graphql(nome, token) {
  const nodes = [];
  let cursor = null;
  for (let pagina = 0; pagina < MAX_REPO_PAGES; pagina++) {
    const upstream = await fetch(`${BASE_URL}/graphql`, {
      method: "POST",
      headers: { ...cabecalhos(token), "Content-Type": "application/json" },
      body: JSON.stringify({ query: CONSULTAS[nome], variables: { login: USERNAME, cursor } }),
    });
    const corpo = await upstream.text();
    let json = null;
    try {
      json = JSON.parse(corpo);
    } catch {
      /* resposta que não é JSON: trata como erro */
    }
    const repositorios = json?.data?.user?.repositories;
    // GraphQL responde 200 até com erro: só vale se não veio "errors"
    if (!upstream.ok || !repositorios || json.errors) {
      return { status: upstream.ok ? 502 : upstream.status, corpo, deuCerto: false };
    }
    nodes.push(...repositorios.nodes);
    if (!repositorios.pageInfo.hasNextPage) break;
    cursor = repositorios.pageInfo.endCursor;
  }
  const corpo = JSON.stringify({
    data: { user: { repositories: { nodes, pageInfo: { hasNextPage: false, endCursor: null } } } },
  });
  return { status: 200, corpo, deuCerto: true };
}

/* =====================================================================
   Rota /api/github
   ===================================================================== */

// { status, headers, corpo } para uma URL /api/github?...
export async function responderGitHub(url, token, metodo = "GET") {
  if (metodo !== "GET" && metodo !== "HEAD") {
    return resposta(405, { message: "Só leitura (GET)" });
  }
  if (!token) {
    return resposta(503, { message: "GITHUB_SITE_TOKEN não configurado no servidor" });
  }

  // Um único parâmetro: path ou graphql
  const parametros = [...url.searchParams.keys()];
  if (parametros.length !== 1 || !["path", "graphql"].includes(parametros[0])) {
    return resposta(400, { message: "Use só ?path=... ou ?graphql=..." });
  }

  let resultado;
  const consulta = url.searchParams.get("graphql");
  if (consulta !== null) {
    if (!Object.hasOwn(CONSULTAS, consulta)) {
      return resposta(400, { message: "Consulta desconhecida" });
    }
    resultado = await comCache(`graphql:${consulta}`, () => graphql(consulta, token));
  } else {
    const caminho = url.searchParams.get("path");
    const repo = languagesRepo(caminho);
    const permitido =
      allowedPaths().has(caminho) ||
      (repo !== null && (await nomesDosRepositorios(token)).has(repo));
    if (!permitido) return resposta(400, { message: "Caminho não permitido no proxy" });
    resultado = await comCache(`rest:${caminho}`, () => rest(caminho, token));
  }

  return resposta(resultado.status, resultado.corpo, resultado.deuCerto ? CACHE_OK : "no-store");
}

// Adaptador para (req, res) do Node: serve para a Vercel e para o Vite
export async function atenderGitHub(req, res, token) {
  let resultado;
  try {
    resultado = await responderGitHub(new URL(req.url, "http://localhost"), token, req.method);
  } catch (error) {
    resultado = resposta(502, { message: `Falha ao falar com o GitHub: ${error.message}` });
  }
  res.statusCode = resultado.status;
  Object.entries(resultado.headers).forEach(([nome, valor]) => res.setHeader(nome, valor));
  res.end(resultado.corpo);
}
