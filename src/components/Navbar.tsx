import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Trophy, 
  Users, 
  Target, 
  Award, 
  Settings,
  Menu, 
  X, 
  User,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

// Interface pour les liens de navigation
interface NavLink {
  path: string
  label: string
  icon: React.ReactNode
  adminOnly?: boolean
}

const Navbar: React.FC = () => {
  const location = useLocation()
  const { user, isAuthenticated, logout, isAdmin, refreshUserProfile } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Gestion du scroll pour masquer/afficher la navbar
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY
      
      // Afficher la navbar si on est en haut de la page
      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling vers le bas et on a scrollé plus de 100px
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling vers le haut
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlNavbar)
    return () => window.removeEventListener('scroll', controlNavbar)
  }, [lastScrollY])

  // Configuration des liens de navigation
  const navLinks: NavLink[] = [
    { path: '/', label: 'Accueil', icon: <Home size={20} /> },
    { path: '/defis', label: 'Défis', icon: <Target size={20} /> },
    { path: '/equipes', label: 'Équipes', icon: <Users size={20} /> },
    { path: '/recompenses', label: 'Récompenses', icon: <Award size={20} /> },
    { path: '/admin', label: 'Admin', icon: <Settings size={20} />, adminOnly: true },
  ]

  // Filtrer les liens selon les permissions
  const visibleLinks = navLinks.filter(link => 
    !link.adminOnly || (link.adminOnly && isAdmin())
  )

  // DEBUG TEMPORAIRE - À SUPPRIMER APRÈS
  useEffect(() => {
    console.log('=== DEBUG NAVBAR ===')
    console.log('User:', user)
    console.log('IsAuthenticated:', isAuthenticated)
    console.log('IsAdmin():', isAdmin())
    console.log('User role:', user?.role)
    console.log('Visible links count:', visibleLinks.length)
    console.log('===================')
  }, [user, isAuthenticated])

  // Animation pour les liens
  const linkVariants = {
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95 }
  }

  // Fonction pour déterminer si un lien est actif
  const isActiveLink = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className={`bg-esport-black border-b border-esport-gray-800 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-95 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Trophy className="w-6 h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gradient">Section</h1>
                <p className="text-xs text-esport-gray-400 -mt-1">eSport</p>
              </div>
            </Link>
          </motion.div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleLinks.map((link, index) => (
              <motion.div
                key={link.path}
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
                    ${isActiveLink(link.path) 
                      ? 'bg-esport-purple text-white shadow-lg shadow-esport-purple/30' 
                      : 'text-esport-gray-300 hover:text-white hover:bg-esport-gray-800'
                    }
                  `}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Profil utilisateur */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {/* Informations utilisateur desktop */}
                <div className="hidden sm:block text-right">
                  <Link 
                    to={`/profil/${user.pseudo}`}
                    className="block text-sm font-medium text-white hover:text-esport-purple transition-colors"
                  >
                    {user.pseudo}
                  </Link>
                  <p className="text-xs text-esport-gray-400">
                    {user.xp} XP • {user.role}
                  </p>
                </div>
                
                {/* Avatar */}
                <Link to={`/profil/${user.pseudo}`}>
                  <motion.div 
                    className="w-10 h-10 bg-gradient-gaming rounded-full flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.pseudo}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </motion.div>
                </Link>
                
                {/* DEBUG TEMPORAIRE - Bouton refresh profil */}
                <motion.button
                  onClick={refreshUserProfile}
                  className="p-2 text-esport-gray-400 hover:text-blue-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Recharger profil (DEBUG)"
                >
                  🔄
                </motion.button>

                {/* Bouton déconnexion */}
                <motion.button
                  onClick={logout}
                  className="p-2 text-esport-gray-400 hover:text-red-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Se déconnecter"
                >
                  <LogOut size={18} />
                </motion.button>
              </div>
            ) : (
              <Link to="/login">
                <motion.button 
                  className="btn-gaming text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Se connecter
                </motion.button>
              </Link>
            )}

            {/* Menu mobile */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-esport-gray-300 hover:text-white"
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-esport-gray-900 border-t border-esport-gray-800"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-4 space-y-2">
            {visibleLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 w-full
                    ${isActiveLink(link.path) 
                      ? 'bg-esport-purple text-white' 
                      : 'text-esport-gray-300 hover:text-white hover:bg-esport-gray-800'
                    }
                  `}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              </motion.div>
            ))}
            
            {/* Informations utilisateur mobile */}
            {isAuthenticated && user && (
              <div className="pt-4 border-t border-esport-gray-700">
                <Link 
                  to={`/profil/${user.pseudo}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-esport-gray-300 hover:text-white hover:bg-esport-gray-800 rounded-lg transition-colors"
                >
                  <User size={20} />
                  <div>
                    <p className="font-medium">{user.pseudo}</p>
                    <p className="text-xs text-esport-gray-400">{user.xp} XP • {user.role}</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar
