import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Fonction pour cacher le loader initial
const hideInitialLoader = () => {
  const loader = document.getElementById('initial-loader')
  if (loader) {
    loader.style.transition = 'opacity 0.5s ease-out'
    loader.style.opacity = '0'
    setTimeout(() => {
      loader.remove()
    }, 500)
  }
}

// Cacher le loader immédiatement au chargement du script
hideInitialLoader()

// Initialiser l'application
try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found')
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  
  // S'assurer que le loader est caché après le rendu
  setTimeout(hideInitialLoader, 100)
} catch (error) {
  console.error('Error initializing React app:', error)
  // Afficher un message d'erreur à l'utilisateur
  const rootElement = document.getElementById('root')
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; color: white; text-align: center; padding: 20px;">
        <div>
          <h1>Erreur de chargement</h1>
          <p>Une erreur s'est produite lors du chargement de l'application.</p>
          <p style="color: #888; font-size: 0.9em;">${error instanceof Error ? error.message : 'Erreur inconnue'}</p>
        </div>
      </div>
    `
    hideInitialLoader()
  }
}

