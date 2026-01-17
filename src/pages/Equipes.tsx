import React from 'react'
import { motion } from 'framer-motion'

const Equipes: React.FC = () => {
  // Membres Valorant avec leurs rôles
  const valorantMembers = [
    { name: 'Player1', role: 'Duelist' },
    { name: 'Player2', role: 'Initiator' },
    { name: 'Player3', role: 'Controller' },
    { name: 'Player4', role: 'Sentinel' },
    { name: 'Player5', role: 'Duelist' }
  ]

  // Membres League of Legends avec leurs rôles
  const lolMembers = [
    { name: 'Yael', role: 'support' },
    { name: 'Jasper', role: 'Jungle' },
    { name: 'Charles', role: 'mid' },
    { name: 'Bastien', role: 'top' },
    { name: 'Damien', role: 'ADC' }
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Section Valorant */}
          <motion.div
            className="card-gaming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-6">
              {/* Titre */}
              <h2 className="text-3xl font-bold text-white mb-6">VALORANT</h2>
              
              {/* Liste des membres avec leurs rôles alignés */}
              <div className="flex flex-col space-y-3">
                {valorantMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    {/* Nom à gauche */}
                    <p className="text-esport-gray-300 text-lg">{member.name}</p>
                    {/* Rôle à droite */}
                    <p className="text-esport-purple font-semibold text-base">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Section League of Legends */}
          <motion.div
            className="card-gaming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-6">
              {/* Titre */}
              <h2 className="text-3xl font-bold text-white mb-6">LOL</h2>
              
              {/* Liste des membres avec leurs rôles alignés */}
              <div className="flex flex-col space-y-3">
                {lolMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    {/* Nom à gauche */}
                    <p className="text-esport-gray-300 text-lg">{member.name}</p>
                    {/* Rôle à droite */}
                    <p className="text-esport-purple font-semibold text-base">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default Equipes
