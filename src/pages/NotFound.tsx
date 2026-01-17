import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Gamepad2, 
  AlertCircle,
  ChevronRight
} from 'lucide-react'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Particules animées en arrière-plan */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-esport-purple rounded-full opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -80, -20],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            {/* Code d'erreur 404 */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <div className="text-9xl font-bold text-gradient mb-4">
                404
              </div>
              <div className="flex items-center justify-center space-x-2 text-esport-gray-400 mb-6">
                <AlertCircle className="w-6 h-6" />
                <span className="text-xl">Page introuvable</span>
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Oups ! Cette page n'existe pas
              </h1>
              <p className="text-esport-gray-300 text-lg mb-6">
                La page que vous recherchez a peut-être été déplacée, supprimée ou n'a jamais existé.
              </p>
            </motion.div>

            {/* Boutons d'action */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/">
                <motion.button
                  className="btn-gaming text-lg px-8 py-4 flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home size={24} />
                  <span>Retour à l'accueil</span>
                  <ChevronRight size={20} />
                </motion.button>
              </Link>
              
              <Link to="/defis">
                <motion.button
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-esport-purple transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Gamepad2 size={24} />
                  <span>Explorer les défis</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Suggestions de navigation */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-esport-gray-400 mb-4">Ou visitez :</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/recompenses"
                  className="text-esport-purple hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Récompenses</span>
                  <ChevronRight size={16} />
                </Link>
                <Link 
                  to="/equipes"
                  className="text-esport-purple hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Équipes</span>
                  <ChevronRight size={16} />
                </Link>
                <Link 
                  to="/"
                  className="text-esport-purple hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>Accueil</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound

