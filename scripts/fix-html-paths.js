import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const distPath = join(process.cwd(), 'dist')
const indexPath = join(distPath, 'index.html')

console.log('🔧 Fixing HTML paths for GitHub Pages...')
console.log('Index path:', indexPath)
console.log('File exists:', existsSync(indexPath))

if (!existsSync(indexPath)) {
  console.error('❌ index.html not found at:', indexPath)
  process.exit(1)
}

try {
  let html = readFileSync(indexPath, 'utf-8')
  const basePath = '/site-esport'
  
  console.log('📄 Original HTML (first 500 chars):')
  console.log(html.substring(0, 500))
  
  // Remplacer les chemins absolus qui ne commencent pas déjà par le base path
  // Exemples: /assets/ -> /site-esport/assets/, /src/ -> /site-esport/src/
  let modified = false
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
    modified = true
    const newPath = `${basePath}${path}`
    console.log(`  ↪ ${match} → ${attr}="${newPath}"`)
    return `${attr}="${newPath}"`
  })
  
  if (modified) {
    writeFileSync(indexPath, html, 'utf-8')
    console.log('✅ HTML paths fixed with base path:', basePath)
    console.log('📄 Modified HTML (first 500 chars):')
    console.log(html.substring(0, 500))
  } else {
    console.log('⚠️ No paths were modified - they might already be correct or not found')
    console.log('Searching for paths in HTML:')
    const paths = html.match(/(href|src)=["'](\/[^"']+)["']/g)
    if (paths) {
      paths.forEach(p => console.log('  -', p))
    }
  }
} catch (error) {
  console.error('❌ Error fixing HTML paths:', error.message)
  console.error(error.stack)
  process.exit(1)
}
