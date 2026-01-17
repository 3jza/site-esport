import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, LogIn, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

// Interface pour les props du modal
interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithPseudo, isLoading, error, clearError } = useAuthStore()
  const [pseudo, setPseudo] = useState('')
  const [validationError, setValidationError] = useState('')

  // Nettoyer les erreurs quand le modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      clearError()
      setPseudo('')
      setValidationError('')
    }
  }, [isOpen, clearError])

  // Validation en temps réel du pseudo
  const validatePseudo = (value: string): string => {
    const cleanValue = value.trim()
    
    if (!cleanValue) {
      return 'Le pseudo est requis'
    }
    
    if (cleanValue.length < 2) {
      return 'Le pseudo doit contenir au moins 2 caractères'
    }
    
    if (cleanValue.length > 30) {
      return 'Le pseudo ne peut pas dépasser 30 caractères'
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanValue)) {
      return 'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores'
    }
    
    return ''
  }

  // Gérer le changement de pseudo
  const handlePseudoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPseudo(value)
    
    // Validation en temps réel
    const error = validatePseudo(value)
    setValidationError(error)
  }

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation finale
    const validationErr = validatePseudo(pseudo)
    if (validationErr) {
      setValidationError(validationErr)
      return
    }
    
    // Tentative de connexion
    const success = await loginWithPseudo(pseudo.trim().toLowerCase())
    
    if (success) {
      toast.success('Connexion réussie ! Bienvenue 🎮')
      onSuccess?.()
      onClose()
    } else {
      // L'erreur est déjà gérée dans le store
      toast.error('Erreur lors de la connexion')
    }
  }

  // Animation du backdrop
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  // Animation du modal
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            className="relative bg-esport-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec gradient */}
            <div className="bg-gradient-gaming p-6 text-center relative">
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-white" />
                </div>
              </motion.div>
              
              <motion.h2
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Connexion
              </motion.h2>
              
              <motion.p
                className="text-white/80"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Entrez votre pseudo pour rejoindre la communauté
              </motion.p>
            </div>

            {/* Contenu du formulaire */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Champ pseudo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-esport-gray-300">
                    Pseudo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pseudo}
                      onChange={handlePseudoChange}
                      placeholder="Votre pseudo unique..."
                      className={`
                        w-full px-4 py-3 bg-esport-gray-800 border-2 rounded-lg 
                        text-white placeholder-esport-gray-500 transition-colors
                        focus:outline-none focus:ring-0
                        ${validationError || error 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-esport-gray-700 focus:border-esport-purple'
                        }
                      `}
                      disabled={isLoading}
                      autoFocus
                      maxLength={30}
                    />
                    
                    {/* Icône de validation */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {pseudo && !validationError && !error && (
                        <CheckCircle size={20} className="text-green-500" />
                      )}
                      {(validationError || error) && (
                        <AlertCircle size={20} className="text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  {/* Messages d'erreur */}
                  <AnimatePresence>
                    {validationError && (
                      <motion.p
                        className="text-red-400 text-sm flex items-center space-x-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <AlertCircle size={16} />
                        <span>{validationError}</span>
                      </motion.p>
                    )}
                    {error && !validationError && (
                      <motion.p
                        className="text-red-400 text-sm flex items-center space-x-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <AlertCircle size={16} />
                        <span>{error}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                  
                  {/* Aide sur le format */}
                  <p className="text-esport-gray-500 text-xs">
                    2-30 caractères • Lettres, chiffres, tirets et underscores uniquement
                  </p>
                </div>

                {/* Info sur le système */}
                <div className="bg-esport-gray-800 rounded-lg p-4 border-l-4 border-esport-purple">
                  <h4 className="text-white font-medium mb-2">💡 Comment ça marche ?</h4>
                  <ul className="text-esport-gray-400 text-sm space-y-1">
                    <li>• Si ce pseudo existe déjà → connexion automatique</li>
                    <li>• Sinon → création d'un nouveau profil</li>
                    <li>• Vos données sont sauvegardées automatiquement</li>
                  </ul>
                </div>

                {/* Boutons */}
                <div className="flex space-x-3">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 bg-esport-gray-700 text-white rounded-lg font-medium transition-colors hover:bg-esport-gray-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    Annuler
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-esport-purple text-white rounded-lg font-medium transition-colors hover:bg-esport-light-purple disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    disabled={isLoading || !!validationError || !pseudo.trim()}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <span>Connexion...</span>
                      </>
                    ) : (
                      <>
                        <LogIn size={20} />
                        <span>Se connecter</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>

            {/* Effet de particules */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-esport-purple rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-10, -30, -10],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoginModal
