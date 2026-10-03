import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import WAKATIME_CONFIG from './src/config/wakaTimeConfig.js'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy: wakatimeProxy },
  preview: { proxy: wakatimeProxy },
})
