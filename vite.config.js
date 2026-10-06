import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import WAKATIME_CONFIG from './src/config/wakaTimeConfig.js'
import GITHUB_STATS_CONFIG from './src/config/gitHubStatsConfig.js'
import { atenderGitHub, PROXY_PATH } from './api/_github.js'

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

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Prefixo '' lê todas as variáveis do .env.local, inclusive as sem VITE_
  // (isso não as expõe: o que vai para o navegador continua só VITE_*)
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), githubSiteToken(env.GITHUB_SITE_TOKEN)],
    server: { proxy },
    preview: { proxy },
  }
})
