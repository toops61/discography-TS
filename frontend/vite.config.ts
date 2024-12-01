import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    server: {
      port:5175
    },
    plugins: [react()],
    base: '/',
    /* build: {
      target: ["es2019","chrome70"]
    } */
  }

  if (command !== 'serve') {
    config.base = 'https://toops61.github.io/Toops-discography/'
  }

  return config
})
