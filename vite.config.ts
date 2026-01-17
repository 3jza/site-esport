import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // Base path pour GitHub Pages
  // En mode build (production), toujours utiliser /site-esport/
  // En mode dev, utiliser / pour le développement local
  const base = command === 'build' ? '/site-esport/' : '/'
  
  console.log('Vite config - command:', command, 'mode:', mode, 'base:', base)
  
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
