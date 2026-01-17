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

// Initialiser l'application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Cacher le loader après le rendu initial
setTimeout(hideInitialLoader, 1000)

