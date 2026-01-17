import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Target, Zap } from 'lucide-react'

// Interface pour les props du Loader
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  type?: 'spinner' | 'dots' | 'gaming' | 'full'
  text?: string
  className?: string
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  type = 'gaming', 
  text = 'Chargement...', 
  className = '' 
}) => {
  // Configuration des tailles
  const sizeConfig = {
    sm: { container: 'w-8 h-8', icon: 16, text: 'text-sm' },
    md: { container: 'w-12 h-12', icon: 20, text: 'text-base' },
    lg: { container: 'w-16 h-16', icon: 24, text: 'text-lg' }
  }

  const currentSize = sizeConfig[size]

  // Loader spinner simple
  if (type === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
        <motion.div
          className={`border-2 border-esport-gray-700 border-t-esport-purple rounded-full ${currentSize.container}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {text && (
          <p className={`text-esport-gray-300 ${currentSize.text}`}>{text}</p>
        )}
      </div>
    )
  }

  // Loader avec points animés
  if (type === 'dots') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-esport-purple rounded-full"
              animate={{
                y: [-10, 0, -10],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
        {text && (
          <p className={`text-esport-gray-300 ${currentSize.text}`}>{text}</p>
        )}
      </div>
    )
  }

  // Loader gaming avec icônes animées
  if (type === 'gaming') {
    const icons = [Trophy, Target, Zap]
    
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                rotate: 360,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.6,
                ease: 'linear'
              }}
            >
              <div className={`${currentSize.container} bg-gradient-gaming rounded-full flex items-center justify-center`}>
                <Icon size={currentSize.icon} className="text-white" />
              </div>
            </motion.div>
          ))}
          
          {/* Cercle de fond */}
          <div className={`${currentSize.container} bg-esport-gray-900 rounded-full opacity-20`} />
        </div>
        
        {text && (
          <motion.p 
            className={`text-esport-gray-300 ${currentSize.text} font-medium`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {text}
          </motion.p>
        )}
        
        {/* Points de progression */}
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-esport-purple rounded-full"
              animate={{
                scale: [0.5, 1.2, 0.5],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Loader plein écran
  if (type === 'full') {
    return (
      <motion.div
        className="fixed inset-0 z-50 bg-gradient-hero flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          {/* Logo animé */}
          <motion.div
            className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 mx-auto"
            animate={{
              scale: [1, 1.1, 1],
              rotateY: [0, 180, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Trophy size={40} className="text-esport-purple" />
          </motion.div>
          
          {/* Titre animé */}
          <motion.h1
            className="text-4xl font-bold text-white mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            EducArma <span className="text-gradient">Esport</span>
          </motion.h1>
          
          {/* Sous-titre animé */}
          <motion.p
            className="text-esport-gray-300 mb-8 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {text || 'Chargement de la plateforme...'}
          </motion.p>
          
          {/* Barre de progression */}
          <div className="w-64 mx-auto">
            <div className="h-2 bg-esport-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-esport-purple to-esport-light-purple"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </div>
          </div>
          
          {/* Particules flottantes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-esport-purple rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -40, -20],
                  x: [-10, 10, -10],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return null
}

// Composant de Skeleton pour les cartes
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`card-gaming animate-pulse ${className}`}>
      <div className="loading-shimmer h-4 rounded mb-3" />
      <div className="loading-shimmer h-3 rounded mb-2" />
      <div className="loading-shimmer h-3 rounded w-3/4" />
    </div>
  )
}

// Composant de Skeleton pour les listes
export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({ 
  count = 3, 
  className = '' 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-esport-gray-900 rounded-lg animate-pulse">
          <div className="loading-shimmer w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="loading-shimmer h-4 rounded w-3/4" />
            <div className="loading-shimmer h-3 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Loader

