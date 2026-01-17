import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // Base path pour GitHub Pages
  // Forcer /site-esport/ pour tous les builds de production
  // Vérifier aussi la variable d'environnement GITHUB_PAGES
  const isProd = mode === 'production' || command === 'build'
  const isGitHubPages = process.env.GITHUB_PAGES === 'true' || isProd
  const base = isGitHubPages ? '/site-esport/' : '/'
  
  console.log('[Vite Config]', {
    command,
    mode,
    isProd,
    GITHUB_PAGES: process.env.GITHUB_PAGES,
    isGitHubPages,
    base
  })
  
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
    build: {
      // S'assurer que les assets sont bien générés avec le base path
      assetsDir: 'assets',
      outDir: 'dist',
    },
  }
})
