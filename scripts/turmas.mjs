// Gera os dados do comando "turmas", o acompanhamento de turmas de TI
// (Trabalhos Interdisciplinares): métricas dos repositórios dos grupos que
// eu oriento.
//
// Uso:
//   npm run turmas                todos os grupos de src/data/turmasRepos.js
//   npm run turmas -- ti5         só uma disciplina
//   npm run turmas -- ti2 coreu   só uma disciplina num campus
//   npm run turmas -- uaiport     só um grupo (pelo nome, sem acento)
// Os grupos que ficam de fora, ou que falham, mantêm os dados da última vez.
//
// Para cada grupo, o script:
//   1. Clona o repositório (git clone --bare) em node_modules/.cache/turmas,
//      ou só faz git fetch, se já clonou antes.
//   2. Conta as linhas de código por linguagem em todas as branches (cada
//      arquivo uma vez, na versão com mais linhas).
//   3. Lê o git log de todas as branches desde o início do semestre: commits
//      por semana, último commit e a fatia de commits e de linhas de cada
//      integrante. Bots, os professores (PROFESSORES, em turmasRepos.js) e
//      os orientadores do README não contam, nem nos PRs e issues.
//   4. Pergunta à GitHub API pelos pull requests e issues.
//   5. Lê o README: título, descrição, quantos integrantes e link de deploy.
//   6. Descobre a stack pelos arquivos de dependências (package.json,
//      pom.xml, pubspec.yaml, docker-compose.yml...).
//
// Token: os repositórios são privados. O script procura, nesta ordem,
// GITHUB_TOKEN (ou GH_TOKEN) no ambiente, GITHUB_TOKEN no .env.local, o
// `gh auth token` do GitHub CLI e a credencial que o git já usa para o
// github.com (Keychain no macOS, Git Credential Manager no Windows). Nunca com VITE_ na frente: o token não
// pode ir para o build do site. Basta leitura dos repositórios das
// organizações da PUC.
//
// Privacidade: o portfólio é público. Nomes, e-mails e logins dos alunos só
// existem na memória deste script, para juntar os commits da mesma pessoa.
// O arquivo gerado guarda números e o resumo do projeto; a fatia de cada
// integrante vai sem identificação, ordenada da maior para a menor.
//
// Sem dependências: git, fetch e o que vem com o Node.

import { execFile, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = resolve(ROOT, "src/data/turmasData.js");
const CACHE = resolve(ROOT, "node_modules/.cache/turmas");

const importar = (caminho) => import(pathToFileURL(resolve(ROOT, caminho)).href);
const { SEMESTRE, DISCIPLINAS_TI, GRUPOS, PROFESSORES, IGNORAR_AUTORES, idDoGrupo, slugDoGrupo } = await importar(
  "src/data/turmasRepos.js"
);
const { CALENDARIOS_PUC } = await importar("src/data/calendarioPuc.js");

const FUSO = "-03:00"; // Brasília, sem horário de verão
const FUSO_MS = 3 * 3_600_000;
const SEMANA_MS = 7 * 86_400_000;
const CONCORRENCIA = 4;
const PAGINAS_MAX = 10; // até 1000 PRs ou issues por repositório
const PAGINAS_COMMITS = 3; // commits da API, só para ligar e-mail → login
const LINHAS_MAX_ARQUIVO = 10_000; // mais que isso é gerado ou biblioteca copiada
const LINHAS_MAX_COMMIT = 5_000; // idem, num arquivo só, num commit só
const DESCRICAO_MAX = 320;

const run = promisify(execFile);

/* ---------------------------------------------------------------------
   Semestre e token
   --------------------------------------------------------------------- */

function datasDoSemestre() {
  const semestre = CALENDARIOS_PUC[SEMESTRE.ano]?.semestres?.[SEMESTRE.numero - 1];
  if (!semestre) {
    throw new Error(
      `O calendário da PUC não tem o ${SEMESTRE.numero}º semestre de ${SEMESTRE.ano}. ` +
        "Cadastre-o em src/data/calendarioPuc.js."
    );
  }
  return semestre;
}

function lerToken() {
  const doAmbiente = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (doAmbiente) return { token: doAmbiente.trim(), origem: "variável de ambiente" };

  const envLocal = resolve(ROOT, ".env.local");
  if (existsSync(envLocal)) {
    const linha = readFileSync(envLocal, "utf8")
      .split(/\r?\n/)
      .find((l) => /^\s*GITHUB_TOKEN\s*=/.test(l));
    const valor = linha
      ?.slice(linha.indexOf("=") + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (valor) return { token: valor, origem: ".env.local" };
  }

  try {
    const valor = execFileSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (valor) return { token: valor, origem: "gh auth token" };
  } catch {
    // GitHub CLI ausente ou sem login
  }

  // A mesma credencial que faz o git clone funcionar sem pedir senha. Sem
  // ela, o clone pode até dar certo (o git acha a senha sozinho) mas a API
  // fica sem token: 60 chamadas por hora e os PRs e issues não vêm.
  try {
    const saida = execFileSync("git", ["credential", "fill"], {
      input: "protocol=https\nhost=github.com\n\n",
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
      timeout: 15_000,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never" },
    });
    const valor = saida.match(/^password=(.+)$/m)?.[1]?.trim();
    if (valor) return { token: valor, origem: "credencial salva do git" };
  } catch {
    // Nenhuma credencial salva para o github.com
  }
  return { token: null, origem: null };
}

const { token: TOKEN, origem: ORIGEM_TOKEN } = lerToken();

// O VITE_GITHUB_TOKEN do .env.local é o dos comandos "github" e "stats": vai
// para o build e deve ler só repositórios públicos. O script não usa ele.
const SO_TEM_VITE_TOKEN =
  !TOKEN &&
  existsSync(resolve(ROOT, ".env.local")) &&
  /^\s*VITE_GITHUB_TOKEN\s*=\s*\S/m.test(readFileSync(resolve(ROOT, ".env.local"), "utf8"));

/* ---------------------------------------------------------------------
   git e GitHub API
   --------------------------------------------------------------------- */

// O token vai num cabeçalho só destes comandos (GIT_CONFIG_*), sem ficar
// gravado no .git/config do clone nem aparecer na linha de comando
const GIT_ENV = {
  ...process.env,
  GIT_TERMINAL_PROMPT: "0",
  ...(TOKEN && {
    GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "http.https://github.com/.extraheader",
    GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${TOKEN}`).toString("base64")}`,
  }),
};

const git = async (dir, args) =>
  (
    await run("git", ["-C", dir, "-c", "core.quotepath=off", ...args], {
      env: GIT_ENV,
      maxBuffer: 512 * 1024 * 1024,
    })
  ).stdout;

// git grep sai com código 1 quando não acha nada
async function gitOuVazio(dir, args) {
  try {
    return await git(dir, args);
  } catch (error) {
    if (error.code === 1) return "";
    throw error;
  }
}

async function atualizarClone(repo) {
  const dir = resolve(CACHE, `${repo.replace("/", "__")}.git`);
  if (existsSync(dir)) {
    await git(dir, ["fetch", "--quiet", "--prune", "origin", "+refs/heads/*:refs/heads/*"]);
  } else {
    mkdirSync(CACHE, { recursive: true });
    await run("git", ["clone", "--bare", "--quiet", `https://github.com/${repo}.git`, dir], {
      env: GIT_ENV,
      maxBuffer: 64 * 1024 * 1024,
    });
  }
  return dir;
}

class LimiteDaApi extends Error {}

// GITHUB_API_URL troca o endereço da API (GitHub Enterprise ou testes)
const API_URL = (process.env.GITHUB_API_URL ?? "https://api.github.com").replace(/\/$/, "");

const API_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "joaopauloaramuni-portfolio-turmas",
  ...(TOKEN && { Authorization: `Bearer ${TOKEN}` }),
};

// { dados, proxima } ou { dados: null } quando o repositório não existe, não
// está acessível ou está vazio (404, 403 sem ser limite, 409)
async function api(caminho) {
  const url = caminho.startsWith("http") ? caminho : `${API_URL}${caminho}`;
  const res = await fetch(url, { headers: API_HEADERS });
  const semCota = res.headers.get("x-ratelimit-remaining") === "0";
  if ((res.status === 403 || res.status === 429) && semCota) {
    const volta = new Date(Number(res.headers.get("x-ratelimit-reset")) * 1000);
    throw new LimiteDaApi(
      `limite da GitHub API atingido (volta às ${volta.toLocaleTimeString("pt-BR")})`
    );
  }
  if ([403, 404, 409].includes(res.status)) return { dados: null };
  if (!res.ok) throw new Error(`GitHub API respondeu ${res.status} em ${caminho}`);
  const proxima = res.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/)?.[1] ?? null;
  return { dados: await res.json(), proxima };
}

async function apiPaginas(caminho, paginas = PAGINAS_MAX) {
  const itens = [];
  let url = caminho;
  for (let i = 0; url && i < paginas; i++) {
    const { dados, proxima } = await api(url);
    if (!Array.isArray(dados)) break;
    itens.push(...dados);
    url = proxima;
  }
  return itens;
}

/* ---------------------------------------------------------------------
   Arquivos: o que conta como código e em qual linguagem
   --------------------------------------------------------------------- */

// Extensão → nome da linguagem no GitHub (o mesmo do data/wakaTimeLanguages.js,
// que dá ícone e cor no terminal). Markdown conta à parte, como documentação.
// JSON, YAML, XML, SVG e afins ficam de fora: são dados ou configuração.
const EXTENSOES = {
  js: "JavaScript", mjs: "JavaScript", cjs: "JavaScript", jsx: "JavaScript",
  ts: "TypeScript", mts: "TypeScript", cts: "TypeScript", tsx: "TypeScript",
  html: "HTML", htm: "HTML", css: "CSS", scss: "SCSS", sass: "Sass", less: "Less",
  vue: "Vue", svelte: "Svelte", ejs: "EJS", hbs: "Handlebars",
  java: "Java", kt: "Kotlin", kts: "Kotlin", groovy: "Groovy", scala: "Scala",
  py: "Python", cs: "C#", cshtml: "HTML+Razor", razor: "HTML+Razor",
  go: "Go", dart: "Dart", php: "PHP", rb: "Ruby", rs: "Rust", swift: "Swift",
  c: "C", h: "C", cpp: "C++", cc: "C++", cxx: "C++", hpp: "C++",
  r: "R", lua: "Lua", ex: "Elixir", exs: "Elixir",
  sql: "SQL", sh: "Shell", bash: "Shell", zsh: "Shell",
  ps1: "PowerShell", bat: "Batchfile", cmd: "Batchfile",
  md: "Markdown", mdx: "Markdown",
};

// Pastas de dependências, build, cache e ferramentas (em qualquer nível).
// Pastas que começam com ponto também ficam de fora (.github, .vscode...).
const PASTAS_IGNORADAS = new Set([
  "node_modules", "bower_components", "vendor", "vendors", "dist", "build", "out",
  "target", "coverage", "__pycache__", "venv", "env", "obj", "Pods",
  "migrations", "Migrations", "generated", "storybook-static",
]);

// Pastas de documentação do template dos trabalhos interdisciplinares
const PASTAS_DE_DOCS = /^(docs?|documenta[cç][aã]o|documentation)$/i;

// Lockfiles, wrappers do Maven/Gradle, minificados e código gerado
const ARQUIVOS_IGNORADOS =
  /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|mvnw(\.cmd)?|gradlew(\.bat)?|generated_plugin_registrant\.\w+)$|[.-]min\.\w+$|\.map$|\.bundle\.js$|\.(g|freezed|gr|config)\.dart$|\.designer\.cs$/i;

// Pastas de plataforma criadas pelo `flutter create` (android, ios, windows...)
const PLATAFORMAS_FLUTTER = /^(android|ios|linux|macos|windows|web)\//;

function classificador(caminhos) {
  const raizesFlutter = caminhos
    .filter((c) => c === "pubspec.yaml" || c.endsWith("/pubspec.yaml"))
    .map((c) => c.slice(0, -"pubspec.yaml".length));

  // "codigo" | "docs" | null, e a linguagem
  return (caminho) => {
    const partes = caminho.split("/");
    if (partes.slice(0, -1).some((p) => p.startsWith(".") || PASTAS_IGNORADAS.has(p))) return null;
    if (ARQUIVOS_IGNORADOS.test(caminho)) return null;
    if (
      raizesFlutter.some(
        (raiz) => caminho.startsWith(raiz) && PLATAFORMAS_FLUTTER.test(caminho.slice(raiz.length))
      )
    ) {
      return null;
    }
    const nome = partes[partes.length - 1];
    if (/^dockerfile/i.test(nome)) return { tipo: "codigo", linguagem: "Dockerfile" };
    const extensao = nome.includes(".") ? nome.split(".").pop().toLowerCase() : "";
    const linguagem = EXTENSOES[extensao];
    if (!linguagem) return null;
    // Markdown e tudo dentro de docs/ (protótipos, diagramas) é documentação
    const emDocs = partes.slice(0, -1).some((p) => PASTAS_DE_DOCS.test(p));
    return { tipo: linguagem === "Markdown" || emDocs ? "docs" : "codigo", linguagem };
  };
}

// "src/{velho => novo}/a.js" e "velho.js => novo.js" (renomeações do --numstat)
function caminhoNovo(caminho) {
  let c = caminho.replace(/^"(.*)"$/, "$1");
  if (!c.includes(" => ")) return c;
  if (c.includes("{")) c = c.replace(/\{[^{}]*? => ([^{}]*)\}/g, "$1").replace(/\/\//g, "/");
  else c = c.split(" => ").pop();
  return c.replace(/^\//, "");
}

/* ---------------------------------------------------------------------
   Linhas de código
   --------------------------------------------------------------------- */

// Todas as branches juntas: cada arquivo conta uma vez, na versão com mais
// linhas entre as branches em que ele existe. Assim entra o código que ainda
// não foi mergeado na main (develop, feature/*), sem contar duas vezes o
// mesmo arquivo. Um arquivo movido de pasta numa branch e não na outra conta
// nas duas: são caminhos diferentes.
async function contarLinhas(dir, branches) {
  const refs = branches.map((b) => `refs/heads/${b}`);
  const refDoCaminho = new Map(); // onde ler o arquivo (manifestos da stack)
  for (const ref of refs) {
    const saida = await git(dir, ["ls-tree", "-r", "-z", "--name-only", "--full-tree", ref]);
    for (const caminho of saida.split("\0")) {
      if (caminho && !refDoCaminho.has(caminho)) refDoCaminho.set(caminho, ref);
    }
  }
  const caminhos = [...refDoCaminho.keys()];
  const classificar = classificador(caminhos);

  // Linhas que não estão em branco, por arquivo, em todas as branches de uma
  // vez: "refs/heads/x:caminho\0N\n" (nome de branch não pode ter ":")
  const saida = await gitOuVazio(dir, ["grep", "-I", "-c", "-z", "-E", "[^[:space:]]", ...refs]);
  const linhasDoCaminho = new Map();
  for (const registro of saida.split("\n")) {
    const [prefixado, quantas] = registro.split("\0");
    if (!quantas) continue;
    const ref = refs.find((r) => prefixado.startsWith(`${r}:`));
    if (!ref) continue;
    const caminho = prefixado.slice(ref.length + 1);
    linhasDoCaminho.set(caminho, Math.max(linhasDoCaminho.get(caminho) ?? 0, Number(quantas)));
  }

  const porLinguagem = new Map();
  let linhas = 0;
  let arquivos = 0;
  let docs = 0;
  for (const [caminho, n] of linhasDoCaminho) {
    const tipo = classificar(caminho);
    if (!tipo || n > LINHAS_MAX_ARQUIVO) continue;
    if (tipo.tipo === "docs") {
      docs += n;
      continue;
    }
    linhas += n;
    arquivos += 1;
    porLinguagem.set(tipo.linguagem, (porLinguagem.get(tipo.linguagem) ?? 0) + n);
  }

  return {
    refDoCaminho,
    classificar,
    codigo: {
      linhas,
      arquivos,
      linguagens: [...porLinguagem].sort((a, b) => b[1] - a[1]),
    },
    docs,
  };
}

/* ---------------------------------------------------------------------
   Pessoas: quem é bot, quem é orientador, quem é a mesma pessoa
   --------------------------------------------------------------------- */

// "João  Paulo" → "joao paulo"
const normalizarNome = (texto) =>
  (texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const BOTS = new Set([
  "github classroom", "github", "github actions", "dependabot", "copilot", "renovate",
]);
const ehBot = ({ nome, email, login }) =>
  /\[bot\]$/i.test(nome) ||
  /\[bot\]$/i.test(login ?? "") ||
  /\[bot\]@|^noreply@github\.com$/i.test(email) ||
  BOTS.has(normalizarNome(nome).replace(/ bot$/, ""));

// "joaopauloaramuni" é "joao paulo carneiro aramuni": partes do nome
// coladas, na ordem, podendo pular alguma
function nomeColado(colado, partes, inicio = 0) {
  if (colado === "") return true;
  return partes.some(
    (parte, i) =>
      i >= inicio && colado.startsWith(parte) && nomeColado(colado.slice(parte.length), partes, i + 1)
  );
}

function mesmaPessoa(autor, pessoa) {
  if (!autor || !pessoa) return false;
  if (autor === pessoa) return true;
  const partesAutor = autor.split(" ");
  const partesPessoa = pessoa.split(" ");
  if (partesAutor.length >= 2 && partesAutor.every((p) => partesPessoa.includes(p))) return true;
  const colado = autor.replace(/ /g, "");
  return colado.length >= 8 && nomeColado(colado, partesPessoa);
}

// Professores (PROFESSORES, de todas as turmas) e IGNORAR_AUTORES, em minúsculas
const LOGINS_EXCLUIDOS = new Set(
  [
    ...Object.values(PROFESSORES).flatMap((porCampus) => Object.values(porCampus).flat()),
    ...IGNORAR_AUTORES.filter((x) => !x.includes("@") && !x.includes(" ")),
  ].map((login) => login.toLowerCase())
);

// Nome do perfil de cada professor no GitHub (preenchido no início do main)
const nomesDosProfessores = [];

const ehLoginExcluido = (login) => Boolean(login) && LOGINS_EXCLUIDOS.has(login.toLowerCase());

// Quem não conta como integrante: professores (login, e-mails dos commits
// deles e nome do perfil), orientadores do README e IGNORAR_AUTORES
function criarFiltroDeExcluidos({ nomesDoReadme, emailsDosProfessores }) {
  const nomes = [
    ...nomesDoReadme,
    ...nomesDosProfessores,
    ...IGNORAR_AUTORES.filter((x) => x.includes(" ")),
  ].map(normalizarNome);
  const extras = IGNORAR_AUTORES.map((x) => x.toLowerCase());
  return ({ nome, email, login }) => {
    const n = normalizarNome(nome);
    return (
      ehLoginExcluido(login) ||
      emailsDosProfessores.has(email) ||
      extras.includes(email) ||
      LOGINS_EXCLUIDOS.has(n.replace(/ /g, "")) ||
      nomes.some((pessoa) => mesmaPessoa(n, pessoa))
    );
  };
}

const loginDoNoreply = (email) =>
  email.match(/^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/)?.[1]?.toLowerCase() ?? null;

// Junta e-mails, logins e nomes da mesma pessoa (union-find)
function criarIdentidades() {
  const pai = new Map();
  const achar = (x) => {
    if (!pai.has(x)) pai.set(x, x);
    while (pai.get(x) !== x) {
      pai.set(x, pai.get(pai.get(x)));
      x = pai.get(x);
    }
    return x;
  };
  const unir = (a, b) => pai.set(achar(a), achar(b));
  return { achar, unir };
}

/* ---------------------------------------------------------------------
   Commits: total, semanas, último commit e fatia de cada integrante
   --------------------------------------------------------------------- */

async function lerCommits(dir, { inicioMs, semanas, classificar, loginPorEmail, ehExcluido }) {
  const saida = await git(dir, [
    "log",
    "--branches",
    "--no-merges",
    `--since=${new Date(inicioMs).toISOString()}`,
    "--format=%x1e%H%x1f%an%x1f%ae%x1f%ct",
    "--numstat",
  ]);

  const identidades = criarIdentidades();
  const commits = [];
  const nomes = new Set();
  const emails = new Set();
  const logins = new Set();
  for (const registro of saida.split("\x1e").slice(1)) {
    const [cabecalho, ...resto] = registro.split("\n");
    const [, nome, emailBruto, segundos] = cabecalho.split("\x1f");
    const email = emailBruto.toLowerCase();
    const login = loginPorEmail.get(email) ?? loginDoNoreply(email);
    const pessoa = { nome, email, login };
    if (ehBot(pessoa) || ehExcluido(pessoa)) continue;

    // Mesma pessoa: mesmo login, mesmo e-mail ou mesmo nome completo
    const chave = login ? `@${login}` : `e:${email}`;
    identidades.unir(`e:${email}`, chave);
    emails.add(email);
    if (login) logins.add(login);
    const nomeNormal = normalizarNome(nome);
    if (nomeNormal.includes(" ")) {
      identidades.unir(`n:${nomeNormal}`, chave);
      nomes.add(nomeNormal);
    }

    let adicoes = 0;
    for (const linha of resto) {
      const [mais, , caminho] = linha.split("\t");
      if (!caminho || mais === "-") continue;
      const n = Number(mais);
      if (n > LINHAS_MAX_COMMIT || classificar(caminhoNovo(caminho))?.tipo !== "codigo") continue;
      adicoes += n;
    }
    commits.push({ chave, ms: Number(segundos) * 1000, adicoes });
  }

  // Também é a mesma pessoa: "Ana Souza" e "Ana Luiza Souza" (nome contido
  // no outro) e o e-mail vicenzofms@gmail.com com o login vicenzofms
  const listaDeNomes = [...nomes];
  for (const a of listaDeNomes) {
    for (const b of listaDeNomes) {
      if (a !== b && mesmaPessoa(a, b)) identidades.unir(`n:${a}`, `n:${b}`);
    }
  }
  for (const email of emails) {
    const local = email.split("@")[0].split("+")[0];
    if (logins.has(local)) identidades.unir(`e:${email}`, `@${local}`);
  }

  const porPessoa = new Map();
  const porSemana = new Array(semanas).fill(0);
  let ultimo = 0;
  for (const { chave, ms, adicoes } of commits) {
    const id = identidades.achar(chave);
    const total = porPessoa.get(id) ?? { commits: 0, adicoes: 0 };
    total.commits += 1;
    total.adicoes += adicoes;
    porPessoa.set(id, total);
    const semana = Math.floor((ms - inicioMs) / SEMANA_MS);
    if (semana >= 0 && semana < semanas) porSemana[semana] += 1;
    ultimo = Math.max(ultimo, ms);
  }

  const totalAdicoes = commits.reduce((soma, c) => soma + c.adicoes, 0);
  const fatia = (parte, todo) => (todo ? Math.round((parte / todo) * 1000) / 1000 : 0);
  const autores = [...porPessoa.values()]
    .sort((a, b) => b.commits - a.commits || b.adicoes - a.adicoes)
    .map((p) => ({ c: fatia(p.commits, commits.length), l: fatia(p.adicoes, totalAdicoes) }));

  return {
    commits: commits.length,
    autores,
    semanas: porSemana,
    ultimoCommit: ultimo ? isoBrasilia(ultimo) : null,
  };
}

// 1759712400000 → "2026-10-05T22:00-03:00"
const isoBrasilia = (ms) => `${new Date(ms - FUSO_MS).toISOString().slice(0, 16)}${FUSO}`;

/* ---------------------------------------------------------------------
   README
   --------------------------------------------------------------------- */

const limparMarkdown = (texto) =>
  texto
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/(\*\*|__|\*|_|~~|`)/g, "")
    .replace(/\s+/g, " ")
    .trim();

const PLACEHOLDER =
  /t[ií]tulo do projeto|nome do projeto|descri[cç][aã]o (breve )?do (seu )?projeto|lorem ipsum|insira aqui|escreva aqui|nome do (aluno|integrante)|aluno \d|integrante \d/i;

function cortar(texto, max) {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max);
  return `${corte.slice(0, corte.lastIndexOf(" "))}…`;
}

// [{ nivel, titulo, linhas }]; a primeira é o que vem antes de qualquer título
function secoesDoReadme(texto) {
  const secoes = [{ nivel: 0, titulo: "", linhas: [] }];
  let emBlocoDeCodigo = false;
  for (const linha of texto.split("\n")) {
    if (/^\s*(```|~~~)/.test(linha)) emBlocoDeCodigo = !emBlocoDeCodigo;
    const titulo = !emBlocoDeCodigo && linha.match(/^(#{1,6})\s+(.*)$/);
    if (titulo) {
      secoes.push({ nivel: titulo[1].length, titulo: limparMarkdown(titulo[2]), linhas: [] });
    } else {
      secoes[secoes.length - 1].linhas.push(linha);
    }
  }
  return secoes;
}

const ITEM_DE_LISTA = /^\s{0,3}(?:[-*+]|\d+[.)])\s+(.+)$/;
const itensDaSecao = (secao) =>
  secao.linhas
    .map((l) => l.match(ITEM_DE_LISTA)?.[1])
    .filter(Boolean)
    .map(limparMarkdown)
    .filter((item) => item && !PLACEHOLDER.test(item));

function linhasDaTabela(secao) {
  const linhas = secao.linhas.filter((l) => l.trim().startsWith("|"));
  const separador = linhas.findIndex((l) => /^\|?[\s:|-]+$/.test(l.trim()) && l.includes("-"));
  if (separador < 0) return 0;
  return linhas.slice(separador + 1).filter((l) => !PLACEHOLDER.test(l)).length;
}

// Primeiro parágrafo de texto corrido: pula selos, imagens, HTML, citações,
// tabelas, listas e blocos de código, e frases curtas ("`CURSO` `DISCIPLINA`")
function primeiroParagrafo(linhas, proibidos) {
  const paragrafos = linhas.join("\n").split(/\n\s*\n/);
  for (const paragrafo of paragrafos) {
    if (/^\s*(```|~~~)/.test(paragrafo)) continue;
    const util = paragrafo
      .split("\n")
      .filter((l) => !/^\s*(!\[|\[!\[|<|>|\||```|~~~|---|\*\*\*)/.test(l) && !ITEM_DE_LISTA.test(l))
      .join(" ");
    const texto = limparMarkdown(util);
    if (texto.length < 40 || PLACEHOLDER.test(texto)) continue;
    // Nunca leva nome de aluno para o portfólio
    const normal = normalizarNome(texto);
    if (proibidos.some((nome) => nome && normal.includes(nome))) continue;
    return cortar(texto, DESCRICAO_MAX);
  }
  return null;
}

const DOMINIOS_DE_DEPLOY =
  /https?:\/\/[^\s)<>"']+\.(?:vercel\.app|netlify\.app|onrender\.com|render\.com|github\.io|herokuapp\.com|railway\.app|up\.railway\.app|fly\.dev|pages\.dev|web\.app|firebaseapp\.com|azurewebsites\.net|surge\.sh)(?:\/[^\s)<>"']*)?/i;

function lerReadme(texto) {
  const limpo = texto.replace(/\r/g, "").replace(/<!--[\s\S]*?-->/g, "");
  const secoes = secoesDoReadme(limpo);

  const ehOrientadores = (s) => /orientador|professor|docente/i.test(s.titulo);
  const ehIntegrantes = (s) =>
    /integrantes|alunos|membros|equipe|autores|desenvolvedores|participantes|team|members|authors/i.test(
      s.titulo
    ) && !ehOrientadores(s);
  const integrantesSecao = secoes.find(ehIntegrantes);
  const nomesDosIntegrantes = integrantesSecao ? itensDaSecao(integrantesSecao) : [];
  const integrantes = integrantesSecao
    ? nomesDosIntegrantes.length || linhasDaTabela(integrantesSecao) || null
    : null;
  const orientadores = secoes.filter(ehOrientadores).flatMap(itensDaSecao);

  // Título: o primeiro "# ". Descrição: o que vem antes de qualquer título,
  // logo depois do "# " ou numa seção "Sobre"/"Descrição"
  const indiceTitulo = secoes.findIndex((s) => s.nivel === 1 && s.titulo);
  const titulo = indiceTitulo > 0 ? secoes[indiceTitulo].titulo : null;
  const sobre = secoes.find(
    (s) => !ehIntegrantes(s) && /sobre|descri|apresenta|introdu|about|overview/i.test(s.titulo)
  );
  const candidatos = [secoes[0], secoes[indiceTitulo], sobre].filter(
    (s) => s && !ehIntegrantes(s) && !ehOrientadores(s)
  );
  const proibidos = [...nomesDosIntegrantes, ...orientadores].map(normalizarNome);
  const descricao =
    candidatos.map((s) => primeiroParagrafo(s.linhas, proibidos)).find(Boolean) ?? null;

  return {
    titulo: titulo && !PLACEHOLDER.test(titulo) ? cortar(titulo, 80) : null,
    descricao,
    integrantes,
    orientadores,
    deploy: limpo.match(DOMINIOS_DE_DEPLOY)?.[0] ?? null,
  };
}

/* ---------------------------------------------------------------------
   Stack: pelos arquivos de dependências e de infraestrutura
   --------------------------------------------------------------------- */

// Em ordem de exibição: front, mobile, back, dados, mensageria, infra.
//   npm     → nomes no package.json (dependencies e devDependencies)
//   texto   → procurado nos outros manifestos (pom.xml, requirements.txt,
//             docker-compose.yml, pubspec.yaml, application.properties...)
//   arquivo → basta existir um arquivo com esse caminho
const STACK = [
  { nome: "React", npm: ["react"] },
  { nome: "Next.js", npm: ["next"] },
  { nome: "Vue", npm: ["vue"] },
  { nome: "Nuxt", npm: ["nuxt"] },
  { nome: "Angular", npm: ["@angular/core"] },
  { nome: "Svelte", npm: ["svelte"] },
  { nome: "React Native", npm: ["react-native"] },
  { nome: "Expo", npm: ["expo"] },
  { nome: "Flutter", arquivo: /(^|\/)pubspec\.yaml$/ },
  { nome: "Express", npm: ["express"] },
  { nome: "NestJS", npm: ["@nestjs/core"] },
  { nome: "Fastify", npm: ["fastify"] },
  { nome: "Spring Boot", texto: /spring-boot/ },
  { nome: "Quarkus", texto: /io\.quarkus/ },
  { nome: ".NET", arquivo: /\.csproj$/ },
  { nome: "Django", texto: /\bdjango\b/ },
  { nome: "Flask", texto: /\bflask\b/ },
  { nome: "FastAPI", texto: /\bfastapi\b/ },
  { nome: "JSON Server", npm: ["json-server"] },
  { nome: "PostgreSQL", npm: ["pg", "postgres"], texto: /postgres|psycopg|npgsql/ },
  { nome: "MySQL", npm: ["mysql", "mysql2"], texto: /mysql/ },
  { nome: "MongoDB", npm: ["mongodb", "mongoose"], texto: /mongo/ },
  { nome: "Redis", npm: ["redis", "ioredis"], texto: /redis/ },
  { nome: "Supabase", npm: ["@supabase/supabase-js"], texto: /supabase/ },
  { nome: "Firebase", npm: ["firebase", "firebase-admin"], texto: /firebase/ },
  { nome: "Prisma", npm: ["prisma", "@prisma/client"] },
  { nome: "TypeORM", npm: ["typeorm"] },
  { nome: "Sequelize", npm: ["sequelize"] },
  { nome: "RabbitMQ", npm: ["amqplib", "amqp-connection-manager"], texto: /rabbitmq|amqp/ },
  { nome: "Kafka", npm: ["kafkajs"], texto: /kafka/ },
  { nome: "Socket.IO", npm: ["socket.io", "socket.io-client"] },
  { nome: "Tailwind", npm: ["tailwindcss"] },
  { nome: "Bootstrap", npm: ["bootstrap", "react-bootstrap"] },
  { nome: "Docker", arquivo: /(^|\/)(dockerfile[^/]*|docker-compose[^/]*\.ya?ml|compose\.ya?ml)$/i },
  { nome: "GitHub Actions", arquivo: /^\.github\/workflows\/[^/]+\.ya?ml$/ },
  { nome: "Jest", npm: ["jest"] },
  { nome: "Vitest", npm: ["vitest"] },
  { nome: "Cypress", npm: ["cypress"] },
  { nome: "Playwright", npm: ["@playwright/test", "playwright"] },
];

const MANIFESTOS =
  /(^|\/)(package\.json|pom\.xml|build\.gradle(\.kts)?|pubspec\.yaml|requirements\.txt|pyproject\.toml|[^/]+\.csproj|docker-compose[^/]*\.ya?ml|compose\.ya?ml|application(-\w+)?\.(properties|ya?ml))$/i;
const MANIFESTOS_MAX = 40;

async function descobrirStack(dir, refDoCaminho) {
  const caminhos = [...refDoCaminho.keys()];
  const foraDeDependencias = (c) => !c.split("/").some((p) => PASTAS_IGNORADAS.has(p));
  const manifestos = caminhos.filter((c) => MANIFESTOS.test(c) && foraDeDependencias(c));
  const pacotes = new Set();
  let texto = "";
  for (const caminho of manifestos.slice(0, MANIFESTOS_MAX)) {
    const conteudo = await gitOuVazio(dir, ["show", `${refDoCaminho.get(caminho)}:${caminho}`]);
    if (caminho.endsWith("package.json")) {
      try {
        const pkg = JSON.parse(conteudo);
        Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).forEach((p) => pacotes.add(p));
      } catch {
        // package.json inválido: ignora
      }
    } else {
      texto += `\n${conteudo.toLowerCase()}`;
    }
  }
  return STACK.filter(
    (item) =>
      item.npm?.some((p) => pacotes.has(p)) ||
      item.texto?.test(texto) ||
      (item.arquivo && caminhos.some((c) => foraDeDependencias(c) && item.arquivo.test(c)))
  ).map((item) => item.nome);
}

/* ---------------------------------------------------------------------
   Um grupo
   --------------------------------------------------------------------- */

async function contarPrsEIssues(repo) {
  // Sem bots (Dependabot) e sem o que os professores abriram
  const conta = (item) => item.user?.type !== "Bot" && !ehLoginExcluido(item.user?.login);
  const prs = (await apiPaginas(`/repos/${repo}/pulls?state=all&per_page=100`)).filter(conta);
  const issues = (await apiPaginas(`/repos/${repo}/issues?state=all&per_page=100`)).filter(
    (item) => conta(item) && !item.pull_request
  );
  return {
    prs: {
      abertos: prs.filter((p) => p.state === "open").length,
      mergeados: prs.filter((p) => p.merged_at).length,
      fechados: prs.filter((p) => p.state === "closed" && !p.merged_at).length,
    },
    issues: {
      abertas: issues.filter((i) => i.state === "open").length,
      fechadas: issues.filter((i) => i.state === "closed").length,
    },
  };
}

// E-mail do commit → login no GitHub, para juntar commits feitos de
// máquinas diferentes. Só os últimos commits das branches principais.
async function loginsPorEmail(repo, branches, desde) {
  const mapa = new Map();
  for (const branch of new Set(branches)) {
    const commits = await apiPaginas(
      `/repos/${repo}/commits?sha=${encodeURIComponent(branch)}&since=${desde}&per_page=100`,
      PAGINAS_COMMITS
    );
    for (const c of commits) {
      const email = c.commit?.author?.email?.toLowerCase();
      if (email && c.author?.login) mapa.set(email, c.author.login.toLowerCase());
    }
  }
  return mapa;
}

// E-mails usados nos commits de cada professor neste repositório: pega os
// commits feitos com um e-mail que não está ligado ao login
async function emailsDosProfessores(repo, desde) {
  const emails = new Set();
  for (const login of LOGINS_EXCLUIDOS) {
    const commits = await apiPaginas(
      `/repos/${repo}/commits?author=${encodeURIComponent(login)}&since=${desde}&per_page=100`,
      PAGINAS_COMMITS
    );
    for (const c of commits) {
      const email = c.commit?.author?.email?.toLowerCase();
      if (email) emails.add(email);
    }
  }
  return emails;
}

let avisoDaApi = null;

// Por que o clone falhou (só para o terminal, não vai para o arquivo gerado)
const motivos = new Map();

function motivoDaFalha(saida) {
  const texto = String(saida ?? "");
  if (!TOKEN) return "sem token, e o repositório é privado";
  if (/SAML|SSO/i.test(texto)) {
    return "a organização exige SSO: autorize o token para ela em github.com/settings/tokens (Configure SSO)";
  }
  if (/not found|404/i.test(texto)) {
    return "o token não enxerga o repositório (classic precisa do escopo repo; fine-grained precisa ter a organização como dona e acesso aos repositórios dela)";
  }
  if (/authentication failed|401|403|could not read/i.test(texto)) return "o GitHub recusou o token";
  return texto.trim().split("\n").pop() || "falha no git clone";
}

// Chamadas à API que podem esbarrar no limite: o resto dos dados continua
async function tentarApi(fn, padrao = null) {
  if (avisoDaApi) return padrao;
  try {
    return await fn();
  } catch (error) {
    if (!(error instanceof LimiteDaApi)) throw error;
    avisoDaApi = error.message;
    return padrao;
  }
}

async function coletar(grupo, { inicioMs, semanas, agora }) {
  const base = {
    id: idDoGrupo(grupo),
    disciplina: grupo.disciplina,
    campus: grupo.campus,
    ...(grupo.grupo && { grupo: grupo.grupo }),
    nome: grupo.nome,
    repo: grupo.repo,
    url: `https://github.com/${grupo.repo}`,
    atualizadoEm: isoBrasilia(agora),
  };

  let dir;
  try {
    dir = await atualizarClone(grupo.repo);
  } catch (error) {
    motivos.set(base.id, motivoDaFalha(error.stderr ?? error.message));
    return { ...base, erro: "sem_acesso" };
  }

  const branches = (await git(dir, ["for-each-ref", "--format=%(refname:short)", "refs/heads"]))
    .split("\n")
    .filter(Boolean);
  if (branches.length === 0) return { ...base, erro: "vazio" };

  const meta = await tentarApi(async () => (await api(`/repos/${grupo.repo}`)).dados);
  const head = (await gitOuVazio(dir, ["symbolic-ref", "--short", "HEAD"])).trim();
  const padrao = [meta?.default_branch, head, "main", "master"].find((b) => branches.includes(b)) ?? branches[0];

  // README da branch padrão (o que o GitHub mostra na página do repositório)
  const raiz = (await git(dir, ["ls-tree", "-z", "--name-only", `refs/heads/${padrao}`])).split("\0");
  const arquivoReadme = raiz.find((nome) => /^readme(\.md|\.markdown)?$/i.test(nome));
  const readme = lerReadme(
    arquivoReadme ? await gitOuVazio(dir, ["show", `refs/heads/${padrao}:${arquivoReadme}`]) : ""
  );

  // A padrão primeiro: é dela que saem os manifestos que existem em várias
  const ordem = [padrao, ...branches.filter((b) => b !== padrao)];
  const { refDoCaminho, classificar, codigo, docs } = await contarLinhas(dir, ordem);
  const stack = await descobrirStack(dir, refDoCaminho);

  // E-mail → login: commits da padrão e das 3 branches com commit mais recente
  const recentes = (
    await git(dir, ["for-each-ref", "--sort=-committerdate", "--count=3", "--format=%(refname:short)", "refs/heads"])
  )
    .split("\n")
    .filter(Boolean);
  const loginPorEmail = await tentarApi(
    () => loginsPorEmail(grupo.repo, [padrao, ...recentes], new Date(inicioMs).toISOString()),
    new Map()
  );
  const desde = new Date(inicioMs).toISOString();
  const emailsDeProfessores = await tentarApi(() => emailsDosProfessores(grupo.repo, desde), new Set());
  const historico = await lerCommits(dir, {
    inicioMs,
    semanas,
    classificar,
    loginPorEmail,
    ehExcluido: criarFiltroDeExcluidos({
      nomesDoReadme: readme.orientadores,
      emailsDosProfessores: emailsDeProfessores,
    }),
  });

  // Se a API não enxerga o repositório (token sem acesso), PRs e issues ficam
  // sem dados em vez de zerados
  const prsEIssues = meta ? await tentarApi(() => contarPrsEIssues(grupo.repo)) : null;
  const homepage = /^https?:\/\//.test(meta?.homepage ?? "") ? meta.homepage : null;

  return {
    ...base,
    titulo: readme.titulo,
    descricao: readme.descricao ?? meta?.description ?? null,
    deploy: homepage ?? readme.deploy,
    stack,
    integrantes: readme.integrantes,
    branches: branches.length,
    codigo,
    docs,
    ...historico,
    prs: prsEIssues?.prs ?? null,
    issues: prsEIssues?.issues ?? null,
  };
}

/* ---------------------------------------------------------------------
   Arquivo gerado
   --------------------------------------------------------------------- */

const chaveJs = (k) => (/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k));
const ehSimples = (v) => v === null || typeof v !== "object";

// Como JSON.stringify(…, 2), mas listas e objetos pequenos ficam numa linha
function emJs(valor, recuo = "") {
  const dentro = `${recuo}  `;
  if (Array.isArray(valor)) {
    if (valor.length === 0) return "[]";
    if (valor.every(ehSimples)) return `[${valor.map((v) => JSON.stringify(v)).join(", ")}]`;
    return `[\n${valor.map((v) => dentro + emJs(v, dentro)).join(",\n")},\n${recuo}]`;
  }
  if (valor && typeof valor === "object") {
    const entradas = Object.entries(valor).filter(([, v]) => v !== undefined);
    const linha = `{ ${entradas.map(([k, v]) => `${chaveJs(k)}: ${JSON.stringify(v)}`).join(", ")} }`;
    if (entradas.every(([, v]) => ehSimples(v)) && linha.length <= 80) return linha;
    return `{\n${entradas.map(([k, v]) => `${dentro}${chaveJs(k)}: ${emJs(v, dentro)}`).join(",\n")},\n${recuo}}`;
  }
  return JSON.stringify(valor);
}

async function dadosAnteriores() {
  if (!existsSync(OUTPUT)) return new Map();
  try {
    const anterior = await import(`${pathToFileURL(OUTPUT).href}?t=${Date.now()}`);
    return new Map(anterior.grupos.map((g) => [g.id, g]));
  } catch {
    return new Map();
  }
}

// Falhou agora mas funcionou antes: fica o anterior, com o motivo da falha
function juntar(novo, anterior) {
  if (!anterior) return novo;
  if (novo.erro && !anterior.erro) return { ...anterior, aviso: novo.erro };
  return {
    ...novo,
    prs: novo.prs ?? anterior.prs ?? null,
    issues: novo.issues ?? anterior.issues ?? null,
  };
}

/* ---------------------------------------------------------------------
   Terminal
   --------------------------------------------------------------------- */

const numero = (n) => n.toLocaleString("pt-BR");
const SIGLAS = { ti2: "TI:II", ti5: "TI:V" };

function linhaDoGrupo(g) {
  const nome = `${(SIGLAS[g.disciplina] ?? g.disciplina).padEnd(5)} ${g.campus.padEnd(7)} ${[g.grupo, g.nome].filter(Boolean).join(" ")}`;
  if (g.erro === "sem_acesso") return `  ✗ ${nome}: sem acesso (${motivos.get(g.id) ?? "o token lê esse repositório?"})`;
  if (g.erro === "vazio") return `  · ${nome}: repositório vazio`;
  const prs = g.prs ? ` · ${g.prs.mergeados} PRs mergeados` : "";
  return `  ✓ ${nome}: ${numero(g.commits)} commits · ${numero(g.codigo.linhas)} linhas${prs}`;
}

async function emParalelo(itens, limite, fn) {
  const resultados = new Array(itens.length);
  let proximo = 0;
  const trabalhador = async () => {
    while (proximo < itens.length) {
      const i = proximo++;
      resultados[i] = await fn(itens[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limite, itens.length) }, trabalhador));
  return resultados;
}

async function main() {
  const filtros = process.argv.slice(2).map((a) => a.toLowerCase());
  const escolhidos = GRUPOS.filter((g) =>
    filtros.every(
      (f) => f === g.disciplina || f === g.campus || slugDoGrupo(g.nome).startsWith(slugDoGrupo(f))
    )
  );
  if (escolhidos.length === 0) {
    console.error(`Nenhum grupo combina com "${filtros.join(" ")}". Veja src/data/turmasRepos.js.`);
    process.exit(1);
  }

  const semestre = datasDoSemestre();
  const agora = Date.now();
  const inicioMs = Date.parse(`${semestre.inicio}T00:00:00${FUSO}`);
  const fimMs = Date.parse(`${semestre.fim}T23:59:59${FUSO}`);
  const semanas = Math.max(1, Math.floor((Math.min(agora, fimMs) - inicioMs) / SEMANA_MS) + 1);

  console.log(
    `Turmas do ${SEMESTRE.numero}º semestre de ${SEMESTRE.ano} (desde ${semestre.inicio}, semana ${semanas}): ` +
      `${escolhidos.length} de ${GRUPOS.length} grupos.`
  );
  if (!TOKEN) {
    console.log(
      SO_TEM_VITE_TOKEN
        ? "Sem token para o script: o .env.local só tem o VITE_GITHUB_TOKEN, que é o do site (público). " +
            "Acrescente uma linha GITHUB_TOKEN=... com um token que leia os repositórios das turmas, " +
            "ou faça login no GitHub CLI (gh auth login)."
        : "Sem token do GitHub: só os repositórios públicos vão responder. Use GITHUB_TOKEN no .env.local " +
            "ou faça login no GitHub CLI (gh auth login)."
    );
  } else {
    // De quem é o token e, se for classic, quais escopos ele tem
    const res = await fetch(`${API_URL}/user`, { headers: API_HEADERS });
    if (res.status === 401) {
      console.error(`O token do GitHub (${ORIGEM_TOKEN}) foi recusado: está vencido ou incompleto.`);
      process.exit(1);
    }
    const usuario = res.ok ? await res.json() : null;
    const escopos = res.headers.get("x-oauth-scopes");
    const tipo = escopos === null ? "fine-grained" : `escopos: ${escopos || "nenhum"}`;
    console.log(`Token do GitHub: ${ORIGEM_TOKEN}, de @${usuario?.login ?? "?"} (${tipo}).`);
    if (escopos !== null && !escopos.split(/,\s*/).includes("repo")) {
      console.warn(
        "⚠ Esse token não tem o escopo repo: os repositórios privados das turmas não vão responder."
      );
    }
  }

  // Nome do perfil de cada professor, para reconhecer commits feitos com
  // um e-mail que não está ligado à conta do GitHub
  for (const login of LOGINS_EXCLUIDOS) {
    const nome = await tentarApi(async () => (await api(`/users/${login}`)).dados?.name);
    if (nome) nomesDosProfessores.push(nome);
  }

  const contexto = { inicioMs, semanas, agora };
  const coletados = await emParalelo(escolhidos, CONCORRENCIA, async (grupo) => {
    const g = await coletar(grupo, contexto);
    console.log(linhaDoGrupo(g));
    return g;
  });
  if (avisoDaApi) {
    console.warn(
      TOKEN
        ? `\n⚠ ${avisoDaApi}: PRs e issues ficaram como estavam. Rode de novo depois.`
        : `\n⚠ ${avisoDaApi}: sem token, a GitHub API aceita só 60 chamadas por hora deste computador, ` +
            "e os PRs, as issues e a exclusão dos professores dependem dela. Com um token (GITHUB_TOKEN " +
            "no .env.local ou gh auth login) o limite é de 5.000 por hora e dá para rodar de novo na hora."
    );
  }

  const anteriores = await dadosAnteriores();
  const novos = new Map(coletados.map((g) => [g.id, g]));
  const grupos = GRUPOS.map((grupo) => {
    const id = idDoGrupo(grupo);
    if (novos.has(id)) return juntar(novos.get(id), anteriores.get(id));
    return (
      anteriores.get(id) ?? {
        id,
        disciplina: grupo.disciplina,
        campus: grupo.campus,
        ...(grupo.grupo && { grupo: grupo.grupo }),
        nome: grupo.nome,
        repo: grupo.repo,
        url: `https://github.com/${grupo.repo}`,
        erro: "pendente",
      }
    );
  });

  const info = {
    semestre: `${SEMESTRE.ano}-${SEMESTRE.numero}`,
    inicio: semestre.inicio,
    fim: semestre.fim,
    geradoEm: isoBrasilia(agora),
    disciplinas: Object.keys(DISCIPLINAS_TI),
  };

  const arquivo = `// Gerado por "npm run turmas" (scripts/turmas.mjs) em ${info.geradoEm.slice(0, 10)}.
// Não edite à mão: rode o script de novo. A lista de repositórios fica em
// src/data/turmasRepos.js.
//
// Só números e o resumo de cada projeto: nada de nomes, e-mails ou logins de
// alunos. "autores" é a fatia de commits (c) e de linhas adicionadas (l) de
// cada integrante, sem identificação, da maior para a menor.

export const turmasInfo = ${emJs(info)};

export const grupos = ${emJs(grupos)};
`;
  writeFileSync(OUTPUT, arquivo);

  const ok = grupos.filter((g) => !g.erro).length;
  console.log(`\nGravado em src/data/turmasData.js: ${ok} de ${grupos.length} grupos com dados.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
