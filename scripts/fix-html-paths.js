import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const distPath = join(process.cwd(), 'dist')
const indexPath = join(distPath, 'index.html')

try {
  let html = readFileSync(indexPath, 'utf-8')
  const basePath = '/site-esport'
  
  // Remplacer les chemins absolus qui ne commencent pas déjà par le base path
  // Exemples: /assets/ -> /site-esport/assets/, /src/ -> /site-esport/src/
  html = html.replace(/(href|src)=["'](\/[^"']+)["']/g, (match, attr, path) => {
    // Ignorer les URLs externes (http://, https://, //)
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
      return match
    }
    // Ignorer si le chemin commence déjà par le base path
    if (path.startsWith(basePath)) {
      return match
    }
    // Ajouter le base path
    return `${attr}="${basePath}${path}"`
  })
  
  writeFileSync(indexPath, html, 'utf-8')
  console.log('✅ HTML paths fixed with base path:', basePath)
} catch (error) {
  console.error('❌ Error fixing HTML paths:', error.message)
  process.exit(1)
}
