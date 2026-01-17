import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Déterminer le base path : toujours /site-esport/ pour la production sur GitHub Pages
  // Vérifier si GITHUB_PAGES est défini (peut être 'true', true, ou toute autre valeur)
  const isGitHubPages = !!process.env.GITHUB_PAGES || mode === 'production'
  const base = isGitHubPages ? '/site-esport/' : '/'
  
  console.log('Vite config - GITHUB_PAGES:', process.env.GITHUB_PAGES, 'mode:', mode, 'base:', base)
  
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
