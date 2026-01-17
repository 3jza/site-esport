import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Users, 
  Target, 
  Zap, 
  Calendar,
  Gamepad2,
  ChevronRight,
  Newspaper,
  Clock,
  Award
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import LoginModal from '../components/LoginModal'
import Loader, { SkeletonCard } from '../components/Loader'
import { supabaseHelpers } from '../lib/supabase'
import type { Profile, Tournoi, Badge } from '../types/database.types'

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [upcomingTournois, setUpcomingTournois] = useState<Tournoi[]>([])

  // Charger les données de la page d'accueil
  useEffect(() => {
    const loadHomeData = async () => {
      setIsLoading(true)
      try {
        // Simuler le chargement des données (remplacer par vraies requêtes)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // TODO: Implémenter les vraies requêtes Supabase
        // const { data: players } = await supabaseHelpers.getTopPlayers()
        // const { data: tournois } = await supabaseHelpers.getUpcomingTournois()
        // const { data: badges } = await supabaseHelpers.getRecentBadges()
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHomeData()
  }, [])

  // Configuration des jeux supportés
  const games = [
    { name: 'League of Legends', icon: '🏆', players: '1.2M+' },
    { name: 'Valorant', icon: '🎯', players: '800K+' },
    { name: 'Rocket League', icon: '⚽', players: '500K+' },
    { name: 'Mario Kart 8', icon: '🏎️', players: '300K+' },
    { name: 'Smash Bros', icon: '👊', players: '400K+' },
    { name: 'FC26', icon: '⚽', players: '600K+' },
  ]

  // Configuration des statistiques
  const stats = [
    { label: 'Joueurs actifs', value: 'A venir', icon: <Users className="w-6 h-6" /> },
    { label: 'Défis complétés', value: 'A venir', icon: <Target className="w-6 h-6" /> },
    { label: 'Tournois organisés', value: 'A venir', icon: <Trophy className="w-6 h-6" /> },
    { label: 'Badges distribués', value: 'A venir', icon: <Award className="w-6 h-6" /> },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        {/* Particules animées en arrière-plan */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
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

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Titre principal */}
            <motion.h1
              className="text-5xl lg:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Section{' '}
              <span className="text-gradient">eSport</span>
              <br />
              <span className="text-gradient">Lycée</span>
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              className="text-xl lg:text-2xl text-esport-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Plateforme officielle de la section eSport du lycée.
              <br />
              Progressez, compétitionnez et développez vos compétences gaming !
            </motion.p>

            {/* Boutons CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {isAuthenticated ? (
                <>
                  <Link to="/defis">
                    <motion.button
                      className="btn-gaming text-lg px-8 py-4 flex items-center space-x-3"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Target size={24} />
                      <span>Voir les défis</span>
                      <ChevronRight size={20} />
                    </motion.button>
                  </Link>
                  <Link to={`/profil/${user?.pseudo}`}>
                    <motion.button
                      className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-esport-purple transition-all duration-300 flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Users size={24} />
                      <span>Mon profil</span>
                    </motion.button>
                  </Link>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => setShowLoginModal(true)}
                    className="btn-gaming text-lg px-8 py-4 flex items-center space-x-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Zap size={24} />
                      <span>Intégrer la section</span>
                    <ChevronRight size={20} />
                  </motion.button>
                  <Link to="/defis">
                    <motion.button
                      className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-esport-purple transition-all duration-300 flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Target size={24} />
                      <span>Explorer</span>
                    </motion.button>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Indicateur de scroll */}
            <motion.div
              className="mt-16 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <motion.div
                className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="w-1 h-3 bg-white/70 rounded-full mt-2"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-16 bg-esport-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-gaming rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-esport-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Jeux supportés */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Jeux <span className="text-gradient">Supportés</span>
            </h2>
            <p className="text-esport-gray-400 text-lg max-w-2xl mx-auto">
              Découvrez les jeux officiels de la section eSport et progressez dans vos disciplines favorites
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.name}
                className="card-gaming text-center group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4">{game.icon}</div>
                <h3 className="text-white font-semibold mb-2 text-sm">{game.name}</h3>
                <p className="text-esport-gray-400 text-xs">{game.players} joueurs</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Dernières actualités */}
      <section className="py-16 bg-esport-gray-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Activité <span className="text-gradient">Récente</span>
            </h2>
            <p className="text-esport-gray-400 text-lg">
              Suivez les dernières actualités de la section eSport
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Évènements LoL */}
            <motion.div
              className="card-gaming"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-esport-purple" />
                <span>LoL - Évènements</span>
              </h3>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="loading-shimmer h-16 rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-esport-gray-800 rounded-lg border-l-4 border-blue-500">
                    <div className="text-white font-medium text-sm">LEC Spring Split</div>
                    <div className="text-esport-gray-400 text-xs mt-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>15-17 Mars 2026</span>
                    </div>
                    <div className="text-blue-400 text-xs mt-2">Championnat européen</div>
                  </div>
                  <div className="p-4 bg-esport-gray-800 rounded-lg border-l-4 border-blue-400">
                    <div className="text-white font-medium text-sm">MSI 2026</div>
                    <div className="text-esport-gray-400 text-xs mt-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Mai 2026</span>
                    </div>
                    <div className="text-blue-400 text-xs mt-2">Tournoi international</div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Évènements Rocket League */}
            <motion.div
              className="card-gaming"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-esport-purple" />
                <span>RL - Évènements</span>
              </h3>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="loading-shimmer h-16 rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-esport-gray-800 rounded-lg border-l-4 border-orange-500">
                    <div className="text-white font-medium text-sm">RLCS Spring Major</div>
                    <div className="text-esport-gray-400 text-xs mt-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Avril 2026</span>
                    </div>
                    <div className="text-orange-400 text-xs mt-2">Championnat mondial</div>
                  </div>
                  <div className="p-4 bg-esport-gray-800 rounded-lg border-l-4 border-orange-400">
                    <div className="text-white font-medium text-sm">Gamers8 Rocket League</div>
                    <div className="text-esport-gray-400 text-xs mt-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Juillet 2026</span>
                    </div>
                    <div className="text-orange-400 text-xs mt-2">Tournoi premium</div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Évènements Valorant */}
            <motion.div
              className="card-gaming"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-esport-purple" />
                <span>Valo - Évènements</span>
              </h3>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="loading-shimmer h-16 rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-esport-gray-800 rounded-lg border-l-4 border-red-500">
                    <div className="text-white font-medium text-sm">VCT Masters</div>
                    <div className="text-esport-gray-400 text-xs mt-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Juin 2026</span>
                    </div>
                    <div className="text-red-400 text-xs mt-2">Championnat mondial</div>
                  </div>
                  <div className="p-4 bg-esport-gray-800 rounded-lg border-l-4 border-red-400">
                    <div className="text-white font-medium text-sm">Champions Tour</div>
                    <div className="text-esport-gray-400 text-xs mt-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Août 2026</span>
                    </div>
                    <div className="text-red-400 text-xs mt-2">Tournoi annuel</div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* News Esports */}
            <motion.div
              className="card-gaming"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Newspaper className="w-6 h-6 text-esport-purple" />
                <span>News Esports</span>
              </h3>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="loading-shimmer h-16 rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-esport-gray-800 rounded-lg hover:bg-esport-gray-700 transition-colors cursor-pointer">
                    <div className="text-white font-medium text-sm mb-1">LFL 2025 : Nouveau format avec 63 journées</div>
                    <div className="text-esport-gray-400 text-xs">La Ligue Française de League of Legends annonce trois splits sur 63 journées de diffusion en 2025...</div>
                    <div className="text-esport-purple text-xs mt-2">Janvier 2025</div>
                  </div>
                  <div className="p-3 bg-esport-gray-800 rounded-lg hover:bg-esport-gray-700 transition-colors cursor-pointer">
                    <div className="text-white font-medium text-sm mb-1">RLCS 2025 : Saison démarrée avec Vitality et KC</div>
                    <div className="text-esport-gray-400 text-xs">La saison 2025 des Rocket League Championship Series a débuté le 3 janvier...</div>
                    <div className="text-esport-purple text-xs mt-2">Janvier 2025</div>
                  </div>
                  <div className="p-3 bg-esport-gray-800 rounded-lg hover:bg-esport-gray-700 transition-colors cursor-pointer">
                    <div className="text-white font-medium text-sm mb-1">Riot autorise les partenariats avec les bookmakers</div>
                    <div className="text-esport-gray-400 text-xs">Riot Games autorise les partenariats avec des plateformes de paris pour Valorant et LoL...</div>
                    <div className="text-esport-purple text-xs mt-2">Récent</div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-gradient-gaming">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Prêt à rejoindre l'aventure ?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Créez votre profil, relevez des défis et montez dans les classements. 
              La section eSport vous attend !
            </p>
            
            {!isAuthenticated && (
              <motion.button
                onClick={() => setShowLoginModal(true)}
                className="bg-white text-esport-purple px-8 py-4 rounded-lg font-bold text-lg hover:bg-esport-gray-100 transition-colors flex items-center space-x-3 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Gamepad2 size={24} />
                <span>Commencer maintenant</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Modal de connexion */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  )
}

export default Home
