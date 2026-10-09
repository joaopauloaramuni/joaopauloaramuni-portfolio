import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import WAKATIME_CONFIG from './src/config/wakaTimeConfig.js'
import GITHUB_STATS_CONFIG from './src/config/gitHubStatsConfig.js'
import { atenderGitHub, PROXY_PATH } from './api/_github.js'
import { atenderAsk, PROXY_PATH as ASK_PATH } from './api/_ask.js'
import { atenderClima, PROXY_PATH as CLIMA_PATH } from './api/_clima.js'
import { atenderCodando, PROXY_PATH as CODANDO_PATH } from './api/_codando.js'

// O WakaTime não libera CORS: o navegador chama /api/wakatime/... e o
// servidor do Vite repassa para a API pública do usuário. Em produção quem
// faz esse papel é o rewrite do vercel.json.
const wakatimeProxy = {
  [WAKATIME_CONFIG.API_PATH]: {
    target: 'https://wakatime.com',
    changeOrigin: true,
    rewrite: (path) =>
      path.replace(
        WAKATIME_CONFIG.API_PATH,
        `/api/v1/users/${WAKATIME_CONFIG.USERNAME}`
      ),
  },
}

// Comando "stats": os badges de visitas (komarev e views-counter) também não
// liberam CORS. Em produção quem repassa são os rewrites do vercel.json.
const { USERNAME, PROFILE_VIEWS_PATH, REPO_VIEWS_PATH } = GITHUB_STATS_CONFIG
const githubStatsProxy = {
  [PROFILE_VIEWS_PATH]: {
    target: 'https://komarev.com',
    changeOrigin: true,
    rewrite: () => `/ghpvc/?username=${USERNAME}`,
  },
  [REPO_VIEWS_PATH]: {
    target: 'https://views-counter.vercel.app',
    changeOrigin: true,
    // Mantém a query (?pageId=...&type=total)
    rewrite: (path) => path.replace(REPO_VIEWS_PATH, '/badge'),
  },
}

const proxy = { ...wakatimeProxy, ...githubStatsProxy }

// Comandos "github" e "stats": /api/github?path=... repassa à GitHub API com o
// token do site. Em produção quem faz isso é a Vercel Function api/github.js;
// aqui, no npm run dev e no npm run preview, é este middleware. O token fica
// só no servidor do Vite: sem o prefixo VITE_, ele não entra no build.
function githubSiteToken(token) {
  const middleware = (req, res, next) => {
    if (new URL(req.url, 'http://localhost').pathname !== PROXY_PATH) return next()
    atenderGitHub(req, res, token).catch(next)
  }
  return {
    name: 'github-site-token',
    configureServer: (server) => {
      server.middlewares.use(middleware)
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(middleware)
    },
  }
}

// Comando "ask": POST /api/ask manda a pergunta para a IA (Gemini) com a
// chave do site e devolve a resposta em streaming. Em produção quem faz isso
// é a Vercel Function api/ask.js; aqui, no npm run dev e no npm run preview,
// é este middleware. A chave (GEMINI_API_KEY) fica só no servidor do Vite.
function askIA(env) {
  const middleware = (req, res, next) => {
    if (new URL(req.url, 'http://localhost').pathname !== ASK_PATH) return next()
    atenderAsk(req, res, env).catch(next)
  }
  return {
    name: 'ask-ia',
    configureServer: (server) => {
      server.middlewares.use(middleware)
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(middleware)
    },
  }
}

// Clima da boas-vindas: GET /api/clima. Em produção a Vercel Function
// api/clima.js lê a cidade dos cabeçalhos x-vercel-ip-*; aqui eles não
// existem, então vale o CLIMA_LOCAL_DEV do .env.local (sem ele, a linha do
// clima não aparece no dev).
function clima(env) {
  const middleware = (req, res, next) => {
    if (new URL(req.url, 'http://localhost').pathname !== CLIMA_PATH) return next()
    atenderClima(req, res, env.CLIMA_LOCAL_DEV).catch(next)
  }
  return {
    name: 'clima',
    configureServer: (server) => {
      server.middlewares.use(middleware)
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(middleware)
    },
  }
}

// "Codando agora" (boas-vindas e wakatime --agora): GET /api/codando lê os
// heartbeats do WakaTime com a WAKATIME_API_KEY. Em produção quem faz isso é
// a Vercel Function api/codando.js; aqui, no npm run dev e no npm run
// preview, é este middleware. A chave fica só no servidor do Vite.
function codando(env) {
  const middleware = (req, res, next) => {
    if (new URL(req.url, 'http://localhost').pathname !== CODANDO_PATH) return next()
    atenderCodando(req, res, env).catch(next)
  }
  return {
    name: 'codando',
    configureServer: (server) => {
      server.middlewares.use(middleware)
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(middleware)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Prefixo '' lê todas as variáveis do .env.local, inclusive as sem VITE_
  // (isso não as expõe: o que vai para o navegador continua só VITE_*)
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), githubSiteToken(env.GITHUB_SITE_TOKEN), askIA(env), clima(env), codando(env)],
    server: { proxy },
    preview: { proxy },
  }
})
