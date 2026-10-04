import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import WAKATIME_CONFIG from './src/config/wakaTimeConfig.js'
import GITHUB_STATS_CONFIG from './src/config/gitHubStatsConfig.js'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})
