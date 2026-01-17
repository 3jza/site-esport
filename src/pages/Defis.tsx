import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, 
  Search, 
  Trophy, 
  CheckCircle,
  Clock,
  Zap,
  Award,
  Plus
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import LoginModal from '../components/LoginModal'
import Loader, { SkeletonCard } from '../components/Loader'
import { supabaseHelpers } from '../lib/supabase'
import toast from 'react-hot-toast'
import type { Defi, GameType } from '../types/database.types'

// Configuration des jeux
const GAMES: { id: GameType; name: string; icon: string; color: string }[] = [
  { id: 'LoL', name: 'League of Legends', icon: '🏆', color: 'from-blue-600 to-blue-800' },
  { id: 'Valorant', name: 'Valorant', icon: '🎯', color: 'from-red-600 to-red-800' },
  { id: 'Rocket League', name: 'Rocket League', icon: '⚽', color: 'from-orange-600 to-orange-800' },
  { id: 'Mario Kart 8', name: 'Mario Kart 8', icon: '🏎️', color: 'from-green-600 to-green-800' },
  { id: 'Smash Bros', name: 'Super Smash Bros', icon: '👊', color: 'from-purple-600 to-purple-800' },
  { id: 'FC26', name: 'FC 26', icon: '⚽', color: 'from-emerald-600 to-emerald-800' },
]

const Defis: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore()
  const [selectedGame, setSelectedGame] = useState<GameType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [defis, setDefis] = useState<Defi[]>([])
  const [completedDefis, setCompletedDefis] = useState<string[]>([])

  // Charger les défis
  useEffect(() => {
    const loadDefis = async () => {
      setIsLoading(true)
      try {
        // Charger tous les défis ou par jeu
        if (selectedGame === 'all') {
          // TODO: Implémenter la requête pour tous les défis
          // const { data } = await supabase.from('defis').select('*').eq('is_active', true)
          
          // Données fictives pour l'exemple
          const mockDefis: Defi[] = [
            {
              id: '1',
              game: 'LoL',
              title: 'Initiation au ranked - Niveau 1',
              description: 'Complétez vos 10 parties de placement en mode classé. Défi pédagogique pour comprendre le système de rang.',
              reward_xp: 100,
              reward_badge_id: null,
              created_by: 'system',
              is_active: true,
              created_at: new Date().toISOString()
            },
            {
              id: '2',
              game: 'Valorant',
              title: 'Précision et Technique',
              description: 'Exercice d\'entraînement : Atteignez 70% de précision sur 5 parties consécutives. Développez votre aim.',
              reward_xp: 75,
              reward_badge_id: null,
              created_by: 'system',
              is_active: true,
              created_at: new Date().toISOString()
            },
            {
              id: '3',
              game: 'Rocket League',
              title: 'Maîtrise des Mécaniques',
              description: 'Formation technique : Marquez 3 buts aériens en match. Travaillez vos compétences aériennes.',
              reward_xp: 150,
              reward_badge_id: null,
              created_by: 'system',
              is_active: true,
              created_at: new Date().toISOString()
            }
          ]
          setDefis(mockDefis)
        } else {
          const { data, error } = await supabaseHelpers.getDefisByGame(selectedGame)
          if (error) throw error
          setDefis(data || [])
        }
        
        // Charger les défis complétés par l'utilisateur
        if (user) {
          // TODO: Requête pour les défis complétés
          setCompletedDefis([])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des défis:', error)
        toast.error('Erreur lors du chargement des défis')
      } finally {
        setIsLoading(false)
      }
    }

    loadDefis()
  }, [selectedGame, user])

  // Filtrer les défis selon la recherche
  const filteredDefis = defis.filter(defi =>
    defi.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    defi.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Valider un défi (simulation)
  const handleValidateDefi = async (defiId: string) => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    try {
      // TODO: Implémenter la vraie logique de validation
      toast.success('Défi validé ! +100 XP 🎉')
      setCompletedDefis([...completedDefis, defiId])
      
      // Ajouter l'XP au joueur (simulation)
      // await supabaseHelpers.addXpToUser(user.id, defi.reward_xp)
    } catch (error) {
      toast.error('Erreur lors de la validation du défi')
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* En-tête */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Target className="w-10 h-10 text-esport-purple" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Défis <span className="text-gradient">Gaming</span>
            </h1>
          </div>
          <p className="text-xl text-esport-gray-300 max-w-3xl mx-auto">
            Participez aux défis pédagogiques de la section eSport, progressez et débloquez des récompenses !
          </p>
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* Sélection de jeu */}
            <div className="flex flex-wrap gap-3">
              <motion.button
                onClick={() => setSelectedGame('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedGame === 'all'
                    ? 'bg-esport-purple text-white shadow-lg'
                    : 'bg-esport-gray-800 text-esport-gray-300 hover:bg-esport-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tous les jeux
              </motion.button>
              
              {GAMES.map((game) => (
                <motion.button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                    selectedGame === game.id
                      ? 'bg-esport-purple text-white shadow-lg'
                      : 'bg-esport-gray-800 text-esport-gray-300 hover:bg-esport-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{game.icon}</span>
                  <span className="hidden sm:inline">{game.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Barre de recherche */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-esport-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un défi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-esport-gray-800 border border-esport-gray-700 rounded-lg text-white placeholder-esport-gray-400 focus:outline-none focus:border-esport-purple transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Statistiques rapides */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-esport-gray-900 rounded-lg p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{filteredDefis.length}</div>
            <div className="text-esport-gray-400 text-sm">Défis disponibles</div>
          </div>
          
          <div className="bg-esport-gray-900 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{completedDefis.length}</div>
            <div className="text-esport-gray-400 text-sm">Complétés</div>
          </div>
          
          <div className="bg-esport-gray-900 rounded-lg p-4 text-center">
            <Zap className="w-8 h-8 text-esport-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{user?.xp || 0}</div>
            <div className="text-esport-gray-400 text-sm">XP Total</div>
          </div>
          
          <div className="bg-esport-gray-900 rounded-lg p-4 text-center">
            <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-esport-gray-400 text-sm">Badges</div>
          </div>
        </motion.div>

        {/* Grille des défis */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} className="h-64" />
            ))}
          </div>
        ) : filteredDefis.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Target className="w-16 h-16 text-esport-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Aucun défi trouvé</h3>
            <p className="text-esport-gray-400">
              {searchTerm 
                ? 'Essayez de modifier votre recherche'
                : 'Aucun défi disponible pour ce jeu pour le moment'
              }
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredDefis.map((defi, index) => {
                const game = GAMES.find(g => g.id === defi.game)
                const isCompleted = completedDefis.includes(defi.id)
                
                return (
                  <motion.div
                    key={defi.id}
                    className={`card-gaming relative overflow-hidden ${
                      isCompleted ? 'border-green-500 bg-green-500/5' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    {/* Badge de jeu */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${game?.color}`}>
                      <span className="mr-1">{game?.icon}</span>
                      {game?.name}
                    </div>

                    {/* Badge de statut */}
                    {isCompleted && (
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <CheckCircle size={12} />
                        <span>Complété</span>
                      </div>
                    )}

                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-white mb-3">{defi.title}</h3>
                      <p className="text-esport-gray-400 mb-6 line-clamp-3">{defi.description}</p>

                      {/* Récompenses */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          {defi.reward_xp > 0 && (
                            <div className="flex items-center space-x-1 text-esport-purple">
                              <Zap size={16} />
                              <span className="font-semibold">+{defi.reward_xp} XP</span>
                            </div>
                          )}
                          {defi.reward_badge_id && (
                            <div className="flex items-center space-x-1 text-yellow-500">
                              <Award size={16} />
                              <span className="text-sm">Badge</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-esport-gray-500 text-sm flex items-center space-x-1">
                          <Clock size={14} />
                          <span>Nouveau</span>
                        </div>
                      </div>

                      {/* Bouton d'action */}
                      <motion.button
                        onClick={() => handleValidateDefi(defi.id)}
                        disabled={isCompleted}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                          isCompleted
                            ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                            : 'bg-esport-purple text-white hover:bg-esport-light-purple'
                        }`}
                        whileHover={isCompleted ? {} : { scale: 1.05 }}
                        whileTap={isCompleted ? {} : { scale: 0.95 }}
                      >
                        {isCompleted ? (
                          <span className="flex items-center justify-center space-x-2">
                            <CheckCircle size={18} />
                            <span>Défi complété !</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center space-x-2">
                            <Target size={18} />
                            <span>Valider le défi</span>
                          </span>
                        )}
                      </motion.button>
                    </div>

                    {/* Effet de brillance pour les défis complétés */}
                    {isCompleted && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent"
                        animate={{ x: [-100, 300] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Bouton pour créer un défi (si autorisé) */}
        {isAuthenticated && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className="bg-esport-gray-800 hover:bg-esport-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto border-2 border-dashed border-esport-gray-600 hover:border-esport-purple transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              <span>Proposer un nouveau défi</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Modal de connexion */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  )
}

export default Defis
