import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, 
  Trophy, 
  Target, 
  Award, 
  Calendar, 
  Edit,
  Settings,
  Star,
  TrendingUp,
  Users,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import Loader, { SkeletonCard } from '../components/Loader'
import { supabaseHelpers } from '../lib/supabase'
import type { Profile, Badge, UserBadge } from '../types/database.types'

const Profil: React.FC = () => {
  const { pseudo } = useParams<{ pseudo: string }>()
  const { user: currentUser, isAuthenticated } = useAuthStore()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [badges, setBadges] = useState<(UserBadge & { badge: Badge })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger le profil
  useEffect(() => {
    const loadProfile = async () => {
      if (!pseudo) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const { data: profileData, error: profileError } = await supabaseHelpers.getProfileByPseudo(pseudo)
        
        if (profileError) {
          setError('Profil introuvable')
          return
        }
        
        if (!profileData) {
          setError('Profil introuvable')
          return
        }
        
        setProfile(profileData)
        setIsOwnProfile(currentUser?.id === (profileData as any)?.id)
        
        // Charger les badges
        const { data: badgeData } = await supabaseHelpers.getUserBadges((profileData as any)?.id)
        setBadges(badgeData || [])
        
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err)
        setError('Erreur lors du chargement du profil')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [pseudo, currentUser])

  // Fonction pour calculer le rang basé sur l'XP
  const getRank = (xp: number) => {
    if (xp >= 10000) return { name: 'Légende', color: 'from-yellow-400 to-yellow-600', icon: '👑' }
    if (xp >= 5000) return { name: 'Expert', color: 'from-purple-400 to-purple-600', icon: '⭐' }
    if (xp >= 2500) return { name: 'Vétéran', color: 'from-blue-400 to-blue-600', icon: '🛡️' }
    if (xp >= 1000) return { name: 'Confirmé', color: 'from-green-400 to-green-600', icon: '🎯' }
    if (xp >= 500) return { name: 'Intermédiaire', color: 'from-orange-400 to-orange-600', icon: '🚀' }
    if (xp >= 100) return { name: 'Débutant', color: 'from-gray-400 to-gray-600', icon: '🌟' }
    return { name: 'Novice', color: 'from-gray-500 to-gray-700', icon: '🆕' }
  }

  // Données mockées pour les statistiques
  const stats = [
    { label: 'Défis complétés', value: '42', icon: <Target className="w-5 h-5" />, color: 'text-blue-400' },
    { label: 'Tournois', value: '8', icon: <Trophy className="w-5 h-5" />, color: 'text-yellow-400' },
    { label: 'Badges obtenus', value: badges.length.toString(), icon: <Award className="w-5 h-5" />, color: 'text-purple-400' },
    { label: 'Équipes', value: '2', icon: <Users className="w-5 h-5" />, color: 'text-green-400' },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Loader type="gaming" size="lg" text="Chargement du profil..." />
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <User className="w-16 h-16 text-esport-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Profil introuvable</h2>
          <p className="text-esport-gray-400 mb-6">
            {error || `Aucun joueur trouvé avec le pseudo "${pseudo}"`}
          </p>
        </motion.div>
      </div>
    )
  }

  const rank = getRank(profile.xp)

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* En-tête du profil */}
          <motion.div
            className="bg-gradient-gaming rounded-2xl p-8 mb-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Effet de particules en arrière-plan */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-10, -30, -10],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              
              {/* Avatar */}
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <div className="w-32 h-32 bg-esport-gray-800 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.pseudo}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-white/70" />
                  )}
                </div>
                
                {/* Badge de rang */}
                <motion.div
                  className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${rank.color} shadow-lg`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="mr-1">{rank.icon}</span>
                  {rank.name}
                </motion.div>
              </motion.div>

              {/* Informations principales */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h1 className="text-4xl font-bold text-white mb-2">{profile.pseudo}</h1>
                  <p className="text-white/80 mb-4">{profile.bio || 'Aucune bio configurée'}</p>
                  
                  {/* XP et niveau */}
                  <div className="flex items-center justify-center lg:justify-start space-x-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-semibold">{profile.xp.toLocaleString()} XP</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-esport-purple" />
                      <span className="text-white">{profile.role}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <span className="text-white/80">
                        Membre depuis {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Barre de progression vers le prochain rang */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-white/70 mb-2">
                      <span>Prochain rang: {getRank(profile.xp + 1000).name}</span>
                      <span>{Math.min(100, (profile.xp % 1000) / 10)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-esport-purple to-esport-light-purple h-2 rounded-full"
                        style={{ width: `${Math.min(100, (profile.xp % 1000) / 10)}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (profile.xp % 1000) / 10)}%` }}
                        transition={{ delay: 0.8, duration: 1 }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Bouton d'édition pour son propre profil */}
                {isOwnProfile && (
                  <motion.button
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <Edit size={18} />
                    <span>Modifier le profil</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Statistiques */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="card-gaming text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`w-12 h-12 rounded-full bg-esport-gray-800 flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-esport-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Grille principale - Badges et Activité */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Badges obtenus */}
            <div className="lg:col-span-2">
              <motion.div
                className="card-gaming"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                  <Award className="w-6 h-6 text-esport-purple" />
                  <span>Badges obtenus ({badges.length})</span>
                </h2>

                {badges.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-esport-gray-600 mx-auto mb-4" />
                    <p className="text-esport-gray-400">Aucun badge obtenu pour le moment</p>
                    {isOwnProfile && (
                      <p className="text-esport-gray-500 text-sm mt-2">
                        Complétez des défis pour débloquer vos premiers badges !
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {badges.map((userBadge, index) => (
                      <motion.div
                        key={userBadge.badge_id}
                        className="group relative bg-esport-gray-800 rounded-lg p-4 text-center hover:bg-esport-gray-700 transition-colors cursor-pointer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {/* Badge icon */}
                        <div className="w-12 h-12 bg-gradient-gaming rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        
                        <h4 className="text-white font-medium text-sm mb-1">
                          {userBadge.badge?.name || 'Badge'}
                        </h4>
                        <p className="text-esport-gray-400 text-xs mb-2">
                          {userBadge.badge?.description || ''}
                        </p>
                        <p className="text-esport-gray-500 text-xs">
                          {new Date(userBadge.earned_at).toLocaleDateString()}
                        </p>

                        {/* Effet de brillance au survol */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-esport-purple/10 to-transparent opacity-0 group-hover:opacity-100"
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

            {/* Activité récente */}
            <motion.div
              className="card-gaming"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-esport-purple" />
                <span>Activité récente</span>
              </h2>

              <div className="space-y-4">
                {/* Activités mockées */}
                {[
                  { type: 'defi', text: 'Défi "Première victoire" complété', time: '2h', icon: <Target className="w-4 h-4" /> },
                  { type: 'badge', text: 'Badge "Grimpeur" obtenu', time: '1j', icon: <Award className="w-4 h-4" /> },
                  { type: 'xp', text: '+150 XP gagnés', time: '2j', icon: <Zap className="w-4 h-4" /> },
                  { type: 'team', text: 'Rejoint l\'équipe "Dragons"', time: '3j', icon: <Users className="w-4 h-4" /> },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-esport-gray-800 rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <div className="w-8 h-8 bg-esport-purple/20 rounded-full flex items-center justify-center text-esport-purple flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">{activity.text}</p>
                      <p className="text-esport-gray-400 text-xs flex items-center space-x-1 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Il y a {activity.time}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="w-full mt-6 py-2 px-4 bg-esport-purple/20 text-esport-purple rounded-lg hover:bg-esport-purple hover:text-white transition-all duration-300 text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Voir toute l'activité
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profil
