import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Award, 
  Trophy, 
  Medal, 
  Crown, 
  Star,
  Calendar,
  Target,
  Filter,
  Search,
  X,
  Users,
  MapPin,
  Clock,
  Image as ImageIcon
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import Loader, { SkeletonCard } from '../components/Loader'

// Types pour les récompenses
interface Recompense {
  id: string
  type: 'tournament' | 'badge' | 'achievement' | 'special'
  title: string
  description: string
  winner: string
  date: string
  game?: string
  value?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// Types pour les tournois remportés par la section esport
interface TournoiRemporte {
  id: string
  nom: string
  jeu: string
  date: string
  lieu?: string
  format: string
  participants: number
  prix?: string
  description: string
  images: string[]
  equipeGagnante?: string[]
  classement?: Array<{ position: number; equipe: string }>
}

// Configuration des raretés
const RARITY_CONFIG = {
  common: { color: 'from-gray-400 to-gray-600', label: 'Commun', icon: '⚪' },
  rare: { color: 'from-blue-400 to-blue-600', label: 'Rare', icon: '🔵' },
  epic: { color: 'from-purple-400 to-purple-600', label: 'Épique', icon: '🟣' },
  legendary: { color: 'from-yellow-400 to-yellow-600', label: 'Légendaire', icon: '🟡' },
}

// Configuration des types de récompenses
const TYPE_CONFIG = {
  tournament: { icon: <Trophy className="w-5 h-5" />, label: 'Tournoi', color: 'text-yellow-500' },
  badge: { icon: <Award className="w-5 h-5" />, label: 'Badge', color: 'text-purple-500' },
  achievement: { icon: <Target className="w-5 h-5" />, label: 'Exploit', color: 'text-green-500' },
  special: { icon: <Crown className="w-5 h-5" />, label: 'Spécial', color: 'text-orange-500' },
}

const Recompenses: React.FC = () => {
  const { user } = useAuthStore()
  const [selectedType, setSelectedType] = useState<'all' | keyof typeof TYPE_CONFIG>('all')
  const [selectedRarity, setSelectedRarity] = useState<'all' | keyof typeof RARITY_CONFIG>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [recompenses, setRecompenses] = useState<Recompense[]>([])
  const [topPlayers, setTopPlayers] = useState([])
  const [tournoisRemportes, setTournoisRemportes] = useState<TournoiRemporte[]>([])
  const [selectedTournoi, setSelectedTournoi] = useState<TournoiRemporte | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Charger les tournois remportés
  useEffect(() => {
    const loadTournoisRemportes = async () => {
      try {
        // Données mockées pour le tournoi inter-établissements remporté en 2025
        const mockTournois: TournoiRemporte[] = [
          {
            id: 'tournoi-1',
            nom: 'Tournoi Inter-Établissements 2025',
            jeu: 'Multi-jeux',
            date: '2025-05-16',
            lieu: 'Ermont-Eaubonne, France',
            format: 'Multi-disciplines',
            participants: 200,
            prix: 'Trophé du meilleur établissement d\'IDF',
            description: 'Victoire remportée lors du championnat inter-établissements 2025. Notre section eSport a brillé dans toutes les disciplines et a remporté le titre de champion inter-établissements.',
            images: [],
            equipeGagnante: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'],
            classement: [
              { position: 1, equipe: 'Lycée Jules Ferry' },
              { position: 2, equipe: '//' },
              { position: 3, equipe: '//' }
            ]
          }
        ]
        setTournoisRemportes(mockTournois)
      } catch (error) {
        console.error('Erreur lors du chargement des tournois:', error)
      }
    }

    loadTournoisRemportes()
  }, [])

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
            <Award className="w-10 h-10 text-esport-purple" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Récompenses <span className="text-gradient">& Classements</span>
            </h1>
          </div>
          <p className="text-xl text-esport-gray-300 max-w-3xl mx-auto">
            Découvrez les champions de la communauté et leurs exploits remarquables !
          </p>
        </motion.div>

        {/* Section Tournois remportés par la section esport en 2025 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <span>Tournois remportés <span className="text-gradient">2025</span></span>
              </h2>
              <p className="text-esport-gray-400">
                Les victoires de la section eSport cette année
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-esport-purple">{tournoisRemportes.length}</div>
              <div className="text-esport-gray-400 text-sm">Tournois gagnés</div>
            </div>
          </div>
          
          {tournoisRemportes.length === 0 ? (
            <div className="text-center py-12 bg-esport-gray-900 rounded-lg">
              <Trophy className="w-16 h-16 text-esport-gray-600 mx-auto mb-4" />
              <p className="text-esport-gray-400">Aucun tournoi remporté en 2025 pour le moment</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {tournoisRemportes.map((tournoi, index) => (
                <motion.div
                  key={tournoi.id}
                  className="card-gaming cursor-pointer group relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => {
                    setSelectedTournoi(tournoi)
                    setIsModalOpen(true)
                  }}
                >
                  {/* Badge de victoire */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full px-3 py-1 text-xs font-bold text-black flex items-center space-x-1">
                      <Trophy className="w-3 h-3" />
                      <span>VICTOIRE</span>
                    </div>
                  </div>

                  <div className="relative z-10 p-6">
                    {/* Icône du jeu */}
                    <div className="w-16 h-16 bg-gradient-gaming rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>

                    {/* Informations */}
                    <h3 className="text-white font-bold text-xl mb-2 text-center">
                      {tournoi.nom}
                    </h3>
                    <p className="text-esport-purple text-base font-medium mb-4 text-center">
                      {tournoi.jeu}
                    </p>

                    {/* Détails */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center space-x-2 text-esport-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(tournoi.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {tournoi.lieu && (
                        <div className="flex items-center justify-center space-x-2 text-esport-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{tournoi.lieu}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-center space-x-2 text-esport-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{tournoi.participants} participants</span>
                      </div>
                      {tournoi.prix && (
                        <div className="text-center mt-4">
                          <span className="text-green-400 font-bold text-xl">{tournoi.prix}</span>
                        </div>
                      )}
          </div>
          
                    {/* Bouton pour voir plus */}
                    <div className="mt-6 text-center">
                      <span className="text-esport-purple text-sm font-medium group-hover:text-white transition-colors flex items-center justify-center space-x-1">
                        <span>Voir les détails</span>
                        <ImageIcon className="w-4 h-4" />
                      </span>
                    </div>
          </div>
          
                  {/* Effet de brillance au survol */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-esport-purple/20 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: -100 }}
                    animate={{ x: 200 }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
              ))}
          </div>
          )}
        </motion.div>

      </div>

      {/* Modale de détails du tournoi */}
      <AnimatePresence>
        {isModalOpen && selectedTournoi && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-esport-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bouton de fermeture */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-esport-gray-800 rounded-full flex items-center justify-center text-white hover:bg-esport-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Images du tournoi */}
              {selectedTournoi.images && selectedTournoi.images.length > 0 && (
                <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
                  <img
                    src={selectedTournoi.images[0]}
                    alt={selectedTournoi.nom}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-esport-gray-900 to-transparent" />
                  
                  {/* Badge de victoire */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full px-4 py-2 text-sm font-bold text-black flex items-center space-x-2">
                      <Trophy className="w-5 h-5" />
                      <span>CHAMPION 2025</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Contenu */}
              <div className="p-6 md:p-8">
                {/* En-tête */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedTournoi.nom}</h2>
                  <p className="text-esport-purple text-xl font-medium mb-4">{selectedTournoi.jeu}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-esport-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedTournoi.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    {selectedTournoi.lieu && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedTournoi.lieu}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{selectedTournoi.participants} participants</span>
                    </div>
                    {selectedTournoi.prix && (
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4" />
                        <span className="text-green-400 font-bold">{selectedTournoi.prix}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Description</h3>
                  <p className="text-esport-gray-300 leading-relaxed">{selectedTournoi.description}</p>
              </div>

                {/* Informations du tournoi */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-esport-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Format</h4>
                    <p className="text-esport-gray-300">{selectedTournoi.format}</p>
                  </div>
                  {selectedTournoi.prix && (
                    <div className="bg-esport-gray-800 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">Récompense</h4>
                      <p className="text-green-400 font-bold text-lg">{selectedTournoi.prix}</p>
              </div>
                  )}
              </div>

                {/* Équipe gagnante */}
                {selectedTournoi.equipeGagnante && selectedTournoi.equipeGagnante.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <span>Équipe Gagnante</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTournoi.equipeGagnante.map((joueur, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg px-4 py-2 text-white font-medium"
                        >
                          {joueur}
                        </div>
                      ))}
                          </div>
                            </div>
                )}

                {/* Classement */}
                {selectedTournoi.classement && selectedTournoi.classement.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Classement Final</h3>
                    <div className="space-y-2">
                      {selectedTournoi.classement.map((item) => (
                        <div
                          key={item.position}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            item.position === 1
                              ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30'
                              : 'bg-esport-gray-800'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              item.position === 1 ? 'bg-yellow-500 text-black' :
                              item.position === 2 ? 'bg-gray-400 text-black' :
                              item.position === 3 ? 'bg-orange-600 text-white' :
                              'bg-esport-gray-700 text-white'
                            }`}>
                              {item.position}
                            </div>
                            <span className="text-white font-medium">{item.equipe}</span>
                          </div>
                          {item.position === 1 && (
                            <Trophy className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Galerie d'images */}
                {selectedTournoi.images && selectedTournoi.images.length > 1 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Galerie</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedTournoi.images.slice(1).map((image, index) => (
                          <motion.div
                          key={index}
                          className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={image}
                            alt={`${selectedTournoi.nom} - Image ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-white" />
                          </div>
                      </motion.div>
                      ))}
                    </div>
                  </div>
                  )}
              </div>
                </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Recompenses
