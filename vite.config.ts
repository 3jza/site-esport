import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Déterminer le base path : toujours /site-esport/ pour la production sur GitHub Pages
  // En mode production, on utilise le base path GitHub Pages
  const base = process.env.GITHUB_PAGES === 'true' || mode === 'production' ? '/site-esport/' : '/'
  
  return {
    plugins: [react()],
    base,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  }
})
