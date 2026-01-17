import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Gamepad2, Trophy, Target } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import LoginModal from '../components/LoginModal'

const Login: React.FC = () => {
  const { isAuthenticated } = useAuthStore()
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Redirection si déjà connecté
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Fonctionnalités mises en avant
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Défis Épiques',
      description: 'Relevez des défis dans vos jeux préférés et gagnez des XP'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Compétitions',
      description: 'Participez à des tournois et montez dans les classements'
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: 'Équipes',
      description: 'Rejoignez ou créez votre équipe avec d\'autres joueurs'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-hero">
        {/* Particules flottantes */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-esport-purple rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -80, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Côté gauche - Informations */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
                Rejoignez
                <br />
                <span className="text-gradient">Section Esport</span>
              </h1>
              <p className="text-xl text-esport-gray-300 leading-relaxed">
                La section eSport du Lycée Jules Ferry !
              </p>
            </motion.div>

            {/* Fonctionnalités */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start space-x-4 text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-esport-purple/20 rounded-lg flex items-center justify-center text-esport-purple flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-esport-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Statistiques */}
            <motion.div
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-esport-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white"></div>
                <div className="text-esport-gray-400 text-sm">Joueurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white"></div>
                <div className="text-esport-gray-400 text-sm">Défis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white"></div>
                <div className="text-esport-gray-400 text-sm">Tournois</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Côté droit - Formulaire de connexion */}
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-full max-w-md">
              
              {/* Card de connexion */}
              <motion.div
                className="bg-esport-gray-900/80 backdrop-blur-sm border border-esport-gray-700 rounded-2xl p-8 shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {/* Icône principale */}
                <motion.div
                  className="w-20 h-20 bg-gradient-gaming rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                >
                  <User size={40} className="text-white" />
                </motion.div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Connexion rapide
                  </h2>
                  <p className="text-esport-gray-400">
                    Un pseudo suffit, pas besoin d'email !
                  </p>
                </div>

                {/* Bouton principal de connexion */}
                <motion.button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full btn-gaming text-lg py-4 flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <User size={24} />
                  <span>Se connecter avec un pseudo</span>
                </motion.button>

                {/* Informations sur le système */}
                <motion.div
                  className="mt-6 p-4 bg-esport-gray-800 rounded-lg border-l-4 border-esport-purple"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <h4 className="text-white font-medium mb-2 text-sm">
                    🚀 Comment ça fonctionne ?
                  </h4>
                  <ul className="text-esport-gray-400 text-xs space-y-1">
                    <li>• Pseudo existant ? Connexion instantanée</li>
                    <li>• Nouveau pseudo ? Création automatique du profil</li>
                    <li>• Aucun mot de passe requis</li>
                  </ul>
                </motion.div>

                {/* Liens utiles */}
                <motion.div
                  className="mt-6 text-center text-sm text-esport-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  En vous connectant, vous acceptez nos{' '}
                  <a href="/reglement" className="text-esport-purple hover:underline">
                    conditions d'utilisation
                  </a>
                </motion.div>
              </motion.div>

              {/* Témoignage */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <blockquote className="text-esport-gray-400 italic mb-3">
                  "La section eSport du Lycée Jules Ferry !"
                </blockquote>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal de connexion */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          // Redirection gérée automatiquement par le composant ProtectedRoute
        }}
      />

      {/* Effet de dégradé en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-esport-black to-transparent pointer-events-none" />
    </div>
  )
}

export default Login
