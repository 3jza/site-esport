import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'

// Import des pages (nous les créerons ensuite)
import Home from './pages/Home'
import Profil from './pages/Profil'
import Defis from './pages/Defis'
import Equipes from './pages/Equipes'
import Recompenses from './pages/Recompenses'
import Admin from './pages/Admin'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

// Hook pour l'authentification
import { useAuthStore } from './stores/authStore'

// Composant pour les routes protégées (admin)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

// Composant pour rediriger si déjà connecté
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

const App: React.FC = () => {
  // Base path pour GitHub Pages
  const basename = import.meta.env.GITHUB_PAGES ? '/site-esport' : '/'
  
  return (
    <Router basename={basename}>
      <div className="App">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Layout />}>
              {/* Page d'accueil */}
              <Route index element={<Home />} />
              
              {/* Pages accessibles sans authentification */}
              <Route path="defis" element={<Defis />} />
              <Route path="equipes" element={<Equipes />} />
              <Route path="recompenses" element={<Recompenses />} />
              
              {/* Page de profil (paramètre dynamique) */}
              <Route path="profil/:pseudo" element={<Profil />} />
              
              {/* Page de connexion (redirection si connecté) */}
              <Route path="login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              
              {/* Page admin (protégée) */}
              <Route path="admin/*" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              
              {/* Routes supplémentaires pour l'extension future */}
              <Route path="classements" element={
                <div className="container mx-auto px-4 py-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <h1 className="text-3xl font-bold text-white mb-4">Classements</h1>
                    <p className="text-esport-gray-400">Fonctionnalité à venir... 🚀</p>
                  </motion.div>
                </div>
              } />
              
              <Route path="evenements" element={
                <div className="container mx-auto px-4 py-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <h1 className="text-3xl font-bold text-white mb-4">Événements</h1>
                    <p className="text-esport-gray-400">Fonctionnalité à venir... 🎪</p>
                  </motion.div>
                </div>
              } />
              
              <Route path="contact" element={
                <div className="container mx-auto px-4 py-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <h1 className="text-3xl font-bold text-white mb-4">Contact</h1>
                    <p className="text-esport-gray-400 mb-4">
                      Contactez-nous à : <span className="text-esport-purple">//</span>
                    </p>
                  </motion.div>
                </div>
              } />
              
              <Route path="faq" element={
                <div className="container mx-auto px-4 py-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <h1 className="text-3xl font-bold text-white mb-4">FAQ</h1>
                    <p className="text-esport-gray-400">Questions fréquentes à venir... ❓</p>
                  </motion.div>
                </div>
              } />
              
              {/* Page 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App
