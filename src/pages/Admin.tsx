import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  Users, 
  Target, 
  Award, 
  Activity,
  Plus,
  Edit,
  Trash2,
  Search,
  Shield,
  Eye,
  X,
  Save,
  ToggleLeft,
  ToggleRight,
  AlertCircle
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { supabase, supabaseHelpers } from '../lib/supabase'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import type { Profile, Defi, Badge, Log, GameType, DefiInsert, BadgeInsert, ProfileUpdate } from '../types/database.types'

// Onglets d'administration
const ADMIN_TABS = [
  { id: 'defis', label: 'Gestion des Défis', icon: <Target className="w-5 h-5" /> },
  { id: 'users', label: 'Gestion des Utilisateurs', icon: <Users className="w-5 h-5" /> },
  { id: 'badges', label: 'Gestion des Badges', icon: <Award className="w-5 h-5" /> },
  { id: 'logs', label: 'Logs Système', icon: <Activity className="w-5 h-5" /> },
]

const GAMES: GameType[] = ['LoL', 'Valorant', 'Rocket League', 'Mario Kart 8', 'Smash Bros', 'FC26']

const Admin: React.FC = () => {
  const { user, isAdmin } = useAuthStore()
  const [activeTab, setActiveTab] = useState('defis')
  const [isLoading, setIsLoading] = useState(false)
  
  // États pour les différentes sections
  const [defis, setDefis] = useState<Defi[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  
  // États pour les modals/formulaires
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showDefiModal, setShowDefiModal] = useState(false)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // États pour les formulaires
  const [defiForm, setDefiForm] = useState<Partial<DefiInsert>>({
    game: 'LoL',
    title: '',
    description: '',
    reward_xp: 0,
    reward_badge_id: null,
    is_active: true
  })
  
  const [badgeForm, setBadgeForm] = useState<Partial<BadgeInsert>>({
    name: '',
    description: '',
    image_url: null,
    is_special: false
  })

  // Vérifier les permissions admin
  if (!user || !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Accès refusé</h2>
          <p className="text-esport-gray-400">Seuls les administrateurs peuvent accéder à cette page.</p>
        </motion.div>
      </div>
    )
  }

  // Charger les données selon l'onglet actif
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        switch (activeTab) {
          case 'defis': {
            const { data, error } = await supabase
              .from('defis')
              .select('*')
              .order('created_at', { ascending: false })
            
            if (error) throw error
            setDefis(data || [])
            break
          }
          case 'users': {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .order('created_at', { ascending: false })
            
            if (error) throw error
            setUsers(data || [])
            break
          }
          case 'badges': {
            const { data, error } = await supabase
              .from('badges')
              .select('*')
              .order('created_at', { ascending: false })
            
            if (error) throw error
            setBadges(data || [])
            break
          }
          case 'logs': {
            const { data, error } = await supabase
              .from('logs')
              .select('*')
              .order('timestamp', { ascending: false })
              .limit(100)
            
            if (error) throw error
            setLogs(data || [])
            break
        }
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des données:', error)
        
        // Messages d'erreur plus détaillés
        let errorMessage = 'Erreur lors du chargement des données'
        
        if (error?.message) {
          errorMessage = error.message
        } else if (error?.code === 'PGRST116') {
          errorMessage = 'Aucune donnée trouvée'
        } else if (error?.code) {
          errorMessage = `Erreur ${error.code}: ${error.message || 'Erreur inconnue'}`
        }
        
        // Ne pas afficher de toast pour les erreurs de connexion réseau, juste les logger
        if (errorMessage.includes('ERR_NAME_NOT_RESOLVED') || errorMessage.includes('Failed to fetch') || error?.message?.includes('ERR_NAME_NOT_RESOLVED')) {
          console.error('❌ Erreur de connexion Supabase:', {
            message: errorMessage,
            error: error,
            tab: activeTab
          })
          errorMessage = 'Impossible de se connecter à la base de données. Vérifiez votre connexion internet et la configuration Supabase.'
        }
        
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [activeTab])

  // Filtrer les données selon la recherche
  const getFilteredData = () => {
    switch (activeTab) {
      case 'users':
        return users.filter(u => 
          u.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
        )
      case 'defis':
        return defis.filter(d => 
          d.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      case 'badges':
        return badges.filter(b => 
          b.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      default:
        return []
    }
  }

  // Changer le rôle d'un utilisateur
  const handleChangeUserRole = async (userId: string, newRole: 'visiteur' | 'joueur' | 'admin') => {
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
      
      if (error) throw error
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      
      // Log l'action
      if (user) {
        await supabaseHelpers.addLog(user.id, 'changement_role', { userId, newRole })
      }
      
      toast.success(`Rôle mis à jour avec succès`)
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour: ${error.message || 'Erreur inconnue'}`)
    }
  }

  // Supprimer un élément
  const handleDelete = async (id: string, type: 'defi' | 'badge' | 'user') => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) return
    
    try {
      let error
      
      switch (type) {
        case 'defi':
          ({ error } = await supabase.from('defis').delete().eq('id', id))
          if (!error) setDefis(defis.filter(d => d.id !== id))
          break
        case 'badge':
          ({ error } = await supabase.from('badges').delete().eq('id', id))
          if (!error) setBadges(badges.filter(b => b.id !== id))
          break
        case 'user':
          ({ error } = await supabase.from('profiles').delete().eq('id', id))
          if (!error) setUsers(users.filter(u => u.id !== id))
          break
      }
      
      if (error) throw error
      
      // Log l'action
      if (user) {
        await supabaseHelpers.addLog(user.id, 'suppression', { type, id })
      }
      
      toast.success('Élément supprimé avec succès')
    } catch (error: any) {
      toast.error(`Erreur lors de la suppression: ${error.message || 'Erreur inconnue'}`)
    }
  }

  // Toggle état actif d'un défi
  const handleToggleDefiActive = async (defi: Defi) => {
    try {
      const { error } = await (supabase as any)
        .from('defis')
        .update({ is_active: !defi.is_active })
        .eq('id', defi.id)
      
      if (error) throw error
      
      setDefis(defis.map(d => d.id === defi.id ? { ...d, is_active: !d.is_active } : d))
      toast.success(`Défi ${!defi.is_active ? 'activé' : 'désactivé'}`)
    } catch (error: any) {
      toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`)
    }
  }

  // Ouvrir le modal de création de défi
  const handleCreateDefi = () => {
    setDefiForm({
      game: 'LoL',
      title: '',
      description: '',
      reward_xp: 0,
      reward_badge_id: null,
      is_active: true,
      created_by: user?.id
    })
    setShowDefiModal(true)
  }

  // Ouvrir le modal d'édition de défi
  const handleEditDefi = (defi: Defi) => {
    setDefiForm({
      game: defi.game as GameType,
      title: defi.title,
      description: defi.description,
      reward_xp: defi.reward_xp,
      reward_badge_id: defi.reward_badge_id,
      is_active: defi.is_active
    })
    setEditingItem(defi)
    setShowDefiModal(true)
  }

  // Sauvegarder un défi
  const handleSaveDefi = async () => {
    if (!defiForm.title || !defiForm.description) {
      toast.error('Le titre et la description sont requis')
      return
    }

    // Validation des longueurs
    if (defiForm.title.length < 5 || defiForm.title.length > 200) {
      toast.error('Le titre doit contenir entre 5 et 200 caractères')
      return
    }

    if (defiForm.description.length < 10) {
      toast.error('La description doit contenir au moins 10 caractères')
      return
    }

    // Validation : au moins une récompense requise
    const rewardXp = defiForm.reward_xp || 0
    if (rewardXp === 0 && !defiForm.reward_badge_id) {
      toast.error('Un défi doit avoir une récompense XP (minimum 1) ou un badge')
      return
    }

    // Si pas de badge, s'assurer que l'XP est au moins 1
    if (!defiForm.reward_badge_id && rewardXp < 1) {
      toast.error('La récompense XP doit être d\'au moins 1 si aucun badge n\'est attribué')
      return
    }

    try {
      if (editingItem) {
        // Édition
        const { error } = await (supabase as any)
          .from('defis')
          .update({
            game: defiForm.game,
            title: defiForm.title,
            description: defiForm.description,
            reward_xp: rewardXp,
            reward_badge_id: defiForm.reward_badge_id || null,
            is_active: defiForm.is_active
          })
          .eq('id', editingItem.id)
        
        if (error) throw error
        
        // Recharger les données
        const { data } = await supabase
          .from('defis')
          .select('*')
          .order('created_at', { ascending: false })
        setDefis(data || [])
        
        toast.success('Défi modifié avec succès')
      } else {
        // Création
        const { error } = await (supabase as any)
          .from('defis')
          .insert({
            game: defiForm.game,
            title: defiForm.title,
            description: defiForm.description,
            reward_xp: rewardXp,
            reward_badge_id: defiForm.reward_badge_id || null,
            is_active: defiForm.is_active,
            created_by: user?.id
          })
        
        if (error) throw error
        
        // Recharger les données
        const { data } = await supabase
          .from('defis')
          .select('*')
          .order('created_at', { ascending: false })
        setDefis(data || [])
        
        toast.success('Défi créé avec succès')
      }
      
      // Log l'action
      if (user) {
        await supabaseHelpers.addLog(user.id, editingItem ? 'modification_defi' : 'creation_defi', { defiId: editingItem?.id })
      }
      
      setShowDefiModal(false)
      setEditingItem(null)
      setDefiForm({
        game: 'LoL',
        title: '',
        description: '',
        reward_xp: 0,
        reward_badge_id: null,
        is_active: true
      })
    } catch (error: any) {
      toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`)
    }
  }

  // Ouvrir le modal de création de badge
  const handleCreateBadge = () => {
    setBadgeForm({
      name: '',
      description: '',
      image_url: null,
      is_special: false,
      created_by: user?.id
    })
    setShowBadgeModal(true)
  }

  // Ouvrir le modal d'édition de badge
  const handleEditBadge = (badge: Badge) => {
    setBadgeForm({
      name: badge.name,
      description: badge.description,
      image_url: badge.image_url,
      is_special: badge.is_special
    })
    setEditingItem(badge)
    setShowBadgeModal(true)
  }

  // Sauvegarder un badge
  const handleSaveBadge = async () => {
    if (!badgeForm.name || !badgeForm.description) {
      toast.error('Le nom et la description sont requis')
      return
    }

    // Validation de la longueur de la description (minimum 5 caractères)
    if (badgeForm.description.length < 5) {
      toast.error('La description doit contenir au moins 5 caractères')
      return
    }

    // Validation de la longueur du nom (minimum 2 caractères, maximum 100)
    if (badgeForm.name.length < 2 || badgeForm.name.length > 100) {
      toast.error('Le nom doit contenir entre 2 et 100 caractères')
      return
    }

    try {
      if (editingItem) {
        // Édition
        const { error } = await (supabase as any)
          .from('badges')
          .update({
            name: badgeForm.name,
            description: badgeForm.description,
            image_url: badgeForm.image_url || null,
            is_special: badgeForm.is_special
          })
          .eq('id', editingItem.id)
        
        if (error) throw error
        
        // Recharger les données
        const { data } = await supabase
          .from('badges')
          .select('*')
          .order('created_at', { ascending: false })
        setBadges(data || [])
        
        toast.success('Badge modifié avec succès')
      } else {
        // Création
        const { error } = await (supabase as any)
          .from('badges')
          .insert({
            name: badgeForm.name,
            description: badgeForm.description,
            image_url: badgeForm.image_url || null,
            is_special: badgeForm.is_special,
            created_by: user?.id
          })
        
        if (error) throw error
        
        // Recharger les données
        const { data } = await supabase
          .from('badges')
          .select('*')
          .order('created_at', { ascending: false })
        setBadges(data || [])
        
        toast.success('Badge créé avec succès')
      }
      
      // Log l'action
      if (user) {
        await supabaseHelpers.addLog(user.id, editingItem ? 'modification_badge' : 'creation_badge', { badgeId: editingItem?.id })
      }
      
      setShowBadgeModal(false)
      setEditingItem(null)
      setBadgeForm({
        name: '',
        description: '',
        image_url: null,
        is_special: false
      })
    } catch (error: any) {
      toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`)
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
            <Settings className="w-10 h-10 text-esport-purple" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Administration <span className="text-gradient">Panel</span>
            </h1>
          </div>
          <p className="text-xl text-esport-gray-300">
            Gérez la plateforme de la section esport
          </p>
        </motion.div>

        {/* Onglets */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 bg-esport-gray-900 p-2 rounded-lg">
            {ADMIN_TABS.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-esport-purple text-white shadow-lg'
                    : 'text-esport-gray-300 hover:text-white hover:bg-esport-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Barre d'actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Barre de recherche */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-esport-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Rechercher ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-esport-gray-800 border border-esport-gray-700 rounded-lg text-white placeholder-esport-gray-400 focus:outline-none focus:border-esport-purple transition-colors"
            />
          </div>

          {/* Bouton d'ajout */}
          {activeTab !== 'logs' && (
            <motion.button
              onClick={() => {
                if (activeTab === 'defis') {
                  handleCreateDefi()
                } else if (activeTab === 'badges') {
                  handleCreateBadge()
                }
              }}
              className="btn-gaming flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              <span>Ajouter {activeTab === 'defis' ? 'un défi' : activeTab === 'badges' ? 'un badge' : 'un utilisateur'}</span>
            </motion.button>
          )}
        </motion.div>

        {/* Contenu selon l'onglet actif */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <Loader type="gaming" size="lg" text="Chargement des données..." />
            ) : (
              <div className="card-gaming">
                {/* Gestion des utilisateurs */}
                {activeTab === 'users' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Gestion des Utilisateurs</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-esport-gray-700">
                            <th className="text-left py-3 px-4 text-esport-gray-300 font-medium">Utilisateur</th>
                            <th className="text-left py-3 px-4 text-esport-gray-300 font-medium">XP</th>
                            <th className="text-left py-3 px-4 text-esport-gray-300 font-medium">Rôle</th>
                            <th className="text-left py-3 px-4 text-esport-gray-300 font-medium">Inscription</th>
                            <th className="text-left py-3 px-4 text-esport-gray-300 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(getFilteredData() as Profile[]).map((user: Profile) => (
                            <motion.tr
                              key={user.id}
                              className="border-b border-esport-gray-800 hover:bg-esport-gray-800/50"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-gaming rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                      {user.pseudo[0].toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-white font-medium">{user.pseudo}</div>
                                    <div className="text-esport-gray-400 text-sm">{user.bio}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-white">{user.xp.toLocaleString()}</td>
                              <td className="py-4 px-4">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleChangeUserRole(user.id, e.target.value as any)}
                                  className="bg-esport-gray-700 text-white px-3 py-1 rounded border border-esport-gray-600 focus:border-esport-purple focus:outline-none"
                                >
                                  <option value="visiteur">Visiteur</option>
                                  <option value="joueur">Joueur</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                              <td className="py-4 px-4 text-esport-gray-400">
                                {new Date(user.created_at).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2">
                                  <motion.button
                                    className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Voir le profil"
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setShowUserModal(true)
                                    }}
                                  >
                                    <Eye size={16} />
                                  </motion.button>
                                  <motion.button
                                    className="p-2 text-yellow-400 hover:bg-yellow-400/20 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Modifier"
                                    onClick={() => {
                                      setEditingItem(user)
                                      setSelectedUser(user)
                                      setShowUserModal(true)
                                    }}
                                  >
                                    <Edit size={16} />
                                  </motion.button>
                                  {user.role !== 'admin' && (
                                    <motion.button
                                      className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      title="Supprimer"
                                      onClick={() => handleDelete(user.id, 'user')}
                                    >
                                      <Trash2 size={16} />
                                    </motion.button>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Gestion des défis */}
                {activeTab === 'defis' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Gestion des Défis</h2>
                    {defis.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="w-16 h-16 text-esport-gray-600 mx-auto mb-4" />
                        <p className="text-esport-gray-400">Aucun défi disponible</p>
                    </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-esport-gray-700">
                              <th className="text-left py-3 px-4 text-esport-gray-300 font-medium">Titre</th>
                              <th className="text-left py-3 px-4 text-esport-gray-300 font-medium">Jeu</th>
                              <th className="text-left py-3 px-4 text-esport-gray-300 font-medium">XP</th>
                              <th className="text-left py-3 px-4 text-esport-gray-300 font-medium">État</th>
                              <th className="text-left py-3 px-4 text-esport-gray-300 font-medium">Créé le</th>
                              <th className="text-left py-3 px-4 text-esport-gray-300 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(getFilteredData() as Defi[]).map((defi: Defi) => (
                              <motion.tr
                                key={defi.id}
                                className="border-b border-esport-gray-800 hover:bg-esport-gray-800/50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <td className="py-4 px-4">
                                  <div className="text-white font-medium">{defi.title}</div>
                                  <div className="text-esport-gray-400 text-sm line-clamp-1">{defi.description}</div>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="px-2 py-1 bg-esport-purple/20 text-esport-purple rounded text-sm">
                                    {defi.game}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-white">{defi.reward_xp} XP</td>
                                <td className="py-4 px-4">
                                  <button
                                    onClick={() => handleToggleDefiActive(defi)}
                                    className="flex items-center space-x-2 text-esport-gray-300 hover:text-white transition-colors"
                                  >
                                    {defi.is_active ? (
                                      <>
                                        <ToggleRight className="w-5 h-5 text-green-500" />
                                        <span className="text-green-500">Actif</span>
                                      </>
                                    ) : (
                                      <>
                                        <ToggleLeft className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-500">Inactif</span>
                                      </>
                                    )}
                                  </button>
                                </td>
                                <td className="py-4 px-4 text-esport-gray-400">
                                  {new Date(defi.created_at).toLocaleDateString('fr-FR')}
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center space-x-2">
                                    <motion.button
                                      className="p-2 text-yellow-400 hover:bg-yellow-400/20 rounded-lg transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      title="Modifier"
                                      onClick={() => handleEditDefi(defi)}
                                    >
                                      <Edit size={16} />
                                    </motion.button>
                                    <motion.button
                                      className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      title="Supprimer"
                                      onClick={() => handleDelete(defi.id, 'defi')}
                                    >
                                      <Trash2 size={16} />
                                    </motion.button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                    </div>
                    )}
                  </div>
                )}

                {/* Gestion des badges */}
                {activeTab === 'badges' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Gestion des Badges</h2>
                    {badges.length === 0 ? (
                    <div className="text-center py-12">
                      <Award className="w-16 h-16 text-esport-gray-600 mx-auto mb-4" />
                        <p className="text-esport-gray-400">Aucun badge disponible</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(getFilteredData() as Badge[]).map((badge: Badge) => (
                          <motion.div
                            key={badge.id}
                            className="bg-esport-gray-800 rounded-lg p-4 border border-esport-gray-700 hover:border-esport-purple transition-colors"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-gaming rounded-full flex items-center justify-center">
                                  <Award className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-white font-medium">{badge.name}</h3>
                                  {badge.is_special && (
                                    <span className="text-xs text-yellow-400">⭐ Spécial</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-esport-gray-400 text-sm mb-4 line-clamp-2">
                              {badge.description}
                            </p>
                            <div className="flex items-center space-x-2">
                              <motion.button
                                className="flex-1 px-3 py-2 bg-esport-purple/20 text-esport-purple rounded text-sm hover:bg-esport-purple/30 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleEditBadge(badge)}
                              >
                                <Edit size={14} className="inline mr-1" />
                                Modifier
                              </motion.button>
                              <motion.button
                                className="p-2 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(badge.id, 'badge')}
                              >
                                <Trash2 size={16} />
                              </motion.button>
                    </div>
                          </motion.div>
                        ))}
                    </div>
                    )}
                  </div>
                )}

                {/* Logs système */}
                {activeTab === 'logs' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Logs Système</h2>
                    {logs.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="w-16 h-16 text-esport-gray-600 mx-auto mb-4" />
                        <p className="text-esport-gray-400">Aucun log disponible</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {logs.map((log: Log) => (
                          <motion.div
                            key={log.id}
                            className="bg-esport-gray-800 rounded-lg p-4 border-l-4 border-esport-purple"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <Activity className="w-4 h-4 text-esport-purple" />
                                  <span className="text-white font-medium">{log.action}</span>
                                  <span className="text-esport-gray-400 text-sm">
                                    {new Date(log.timestamp).toLocaleString('fr-FR')}
                                  </span>
                                </div>
                                {log.details && Object.keys(log.details).length > 0 && (
                                  <div className="text-esport-gray-400 text-sm ml-7">
                                    <details>
                                      <summary className="cursor-pointer hover:text-white transition-colors">
                                        Détails
                                      </summary>
                                      <pre className="mt-2 text-xs bg-esport-gray-900 p-2 rounded overflow-x-auto">
                                        {JSON.stringify(log.details, null, 2)}
                                      </pre>
                                    </details>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal de création/édition de défi */}
      <AnimatePresence>
        {showDefiModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowDefiModal(false)
              setEditingItem(null)
            }}
          >
            <motion.div
              className="bg-esport-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowDefiModal(false)
                  setEditingItem(null)
                }}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-esport-gray-800 rounded-full flex items-center justify-center text-white hover:bg-esport-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingItem ? 'Modifier le défi' : 'Créer un nouveau défi'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                      Jeu *
                    </label>
                    <select
                      value={defiForm.game}
                      onChange={(e) => setDefiForm({ ...defiForm, game: e.target.value as GameType })}
                      className="w-full px-4 py-3 bg-esport-gray-800 border border-esport-gray-700 rounded-lg text-white focus:outline-none focus:border-esport-purple"
                    >
                      {GAMES.map(game => (
                        <option key={game} value={game}>{game}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                      Titre * (5-200 caractères)
                    </label>
                    <input
                      type="text"
                      value={defiForm.title}
                      onChange={(e) => setDefiForm({ ...defiForm, title: e.target.value })}
                      placeholder="Titre du défi (5-200 caractères)"
                      className={`w-full px-4 py-3 bg-esport-gray-800 border rounded-lg text-white placeholder-esport-gray-500 focus:outline-none ${
                        defiForm.title && (defiForm.title.length < 5 || defiForm.title.length > 200)
                          ? 'border-red-500 focus:border-red-400'
                          : 'border-esport-gray-700 focus:border-esport-purple'
                      }`}
                      maxLength={200}
                      minLength={5}
                    />
                    {defiForm.title && (defiForm.title.length < 5 || defiForm.title.length > 200) && (
                      <p className="text-red-400 text-sm mt-1">
                        Le titre doit contenir entre 5 et 200 caractères ({defiForm.title.length}/200)
                      </p>
                    )}
                    </div>

                  <div>
                    <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                      Description * (minimum 10 caractères)
                    </label>
                    <textarea
                      value={defiForm.description}
                      onChange={(e) => setDefiForm({ ...defiForm, description: e.target.value })}
                      placeholder="Description du défi (minimum 10 caractères)"
                      rows={4}
                      minLength={10}
                      className={`w-full px-4 py-3 bg-esport-gray-800 border rounded-lg text-white placeholder-esport-gray-500 focus:outline-none ${
                        defiForm.description && defiForm.description.length < 10
                          ? 'border-red-500 focus:border-red-400'
                          : 'border-esport-gray-700 focus:border-esport-purple'
                      }`}
                    />
                    {defiForm.description && defiForm.description.length < 10 && (
                      <p className="text-red-400 text-sm mt-1">
                        La description doit contenir au moins 10 caractères ({defiForm.description.length}/10)
                      </p>
                    )}
                    </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                        Récompense XP
                      </label>
                      <input
                        type="number"
                        value={defiForm.reward_xp}
                        onChange={(e) => setDefiForm({ ...defiForm, reward_xp: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-4 py-3 bg-esport-gray-800 border border-esport-gray-700 rounded-lg text-white focus:outline-none focus:border-esport-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                        Badge de récompense (optionnel)
                      </label>
                      <select
                        value={defiForm.reward_badge_id || ''}
                        onChange={(e) => setDefiForm({ ...defiForm, reward_badge_id: e.target.value || null })}
                        className="w-full px-4 py-3 bg-esport-gray-800 border border-esport-gray-700 rounded-lg text-white focus:outline-none focus:border-esport-purple"
                      >
                        <option value="">Aucun badge</option>
                        {badges.map(badge => (
                          <option key={badge.id} value={badge.id}>{badge.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={defiForm.is_active}
                      onChange={(e) => setDefiForm({ ...defiForm, is_active: e.target.checked })}
                      className="w-5 h-5 text-esport-purple bg-esport-gray-800 border-esport-gray-700 rounded focus:ring-esport-purple"
                    />
                    <label htmlFor="is_active" className="text-esport-gray-300">
                      Défi actif
                    </label>
                  </div>

                  {(!defiForm.reward_xp || defiForm.reward_xp === 0) && !defiForm.reward_badge_id && (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <p className="text-yellow-500 text-sm">
                        Un défi doit avoir au moins une récompense XP ou un badge.
                      </p>
                  </div>
                )}

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      onClick={() => {
                        setShowDefiModal(false)
                        setEditingItem(null)
                      }}
                      className="flex-1 py-3 px-4 bg-esport-gray-700 text-white rounded-lg font-medium transition-colors hover:bg-esport-gray-600"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      onClick={handleSaveDefi}
                      className="flex-1 py-3 px-4 bg-esport-purple text-white rounded-lg font-medium transition-colors hover:bg-esport-light-purple flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save size={20} />
                      <span>{editingItem ? 'Enregistrer' : 'Créer'}</span>
                    </motion.button>
              </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de création/édition de badge */}
      <AnimatePresence>
        {showBadgeModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowBadgeModal(false)
              setEditingItem(null)
            }}
          >
            <motion.div
              className="bg-esport-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowBadgeModal(false)
                  setEditingItem(null)
                }}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-esport-gray-800 rounded-full flex items-center justify-center text-white hover:bg-esport-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingItem ? 'Modifier le badge' : 'Créer un nouveau badge'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={badgeForm.name}
                      onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })}
                      placeholder="Nom du badge"
                      className="w-full px-4 py-3 bg-esport-gray-800 border border-esport-gray-700 rounded-lg text-white placeholder-esport-gray-500 focus:outline-none focus:border-esport-purple"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                      Description * (minimum 5 caractères)
                    </label>
                    <textarea
                      value={badgeForm.description}
                      onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })}
                      placeholder="Description du badge (minimum 5 caractères)"
                      rows={4}
                      minLength={5}
                      className={`w-full px-4 py-3 bg-esport-gray-800 border rounded-lg text-white placeholder-esport-gray-500 focus:outline-none ${
                        badgeForm.description && badgeForm.description.length < 5
                          ? 'border-red-500 focus:border-red-400'
                          : 'border-esport-gray-700 focus:border-esport-purple'
                      }`}
                    />
                    {badgeForm.description && badgeForm.description.length < 5 && (
                      <p className="text-red-400 text-sm mt-1">
                        La description doit contenir au moins 5 caractères ({badgeForm.description.length}/5)
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                      URL de l'image (optionnel)
                    </label>
                    <input
                      type="url"
                      value={badgeForm.image_url || ''}
                      onChange={(e) => setBadgeForm({ ...badgeForm, image_url: e.target.value || null })}
                      placeholder="https://example.com/image.png"
                      className="w-full px-4 py-3 bg-esport-gray-800 border border-esport-gray-700 rounded-lg text-white placeholder-esport-gray-500 focus:outline-none focus:border-esport-purple"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="is_special"
                      checked={badgeForm.is_special}
                      onChange={(e) => setBadgeForm({ ...badgeForm, is_special: e.target.checked })}
                      className="w-5 h-5 text-esport-purple bg-esport-gray-800 border-esport-gray-700 rounded focus:ring-esport-purple"
                    />
                    <label htmlFor="is_special" className="text-esport-gray-300">
                      Badge spécial
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      onClick={() => {
                        setShowBadgeModal(false)
                        setEditingItem(null)
                      }}
                      className="flex-1 py-3 px-4 bg-esport-gray-700 text-white rounded-lg font-medium transition-colors hover:bg-esport-gray-600"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      onClick={handleSaveBadge}
                      className="flex-1 py-3 px-4 bg-esport-purple text-white rounded-lg font-medium transition-colors hover:bg-esport-light-purple flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save size={20} />
                      <span>{editingItem ? 'Enregistrer' : 'Créer'}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
          </motion.div>
          </motion.div>
          )}
        </AnimatePresence>

      {/* Modal de visualisation/modification d'utilisateur */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowUserModal(false)
              setSelectedUser(null)
              setEditingItem(null)
            }}
          >
            <motion.div
              className="bg-esport-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowUserModal(false)
                  setSelectedUser(null)
                  setEditingItem(null)
                }}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-esport-gray-800 rounded-full flex items-center justify-center text-white hover:bg-esport-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingItem ? 'Modifier l\'utilisateur' : 'Profil de l\'utilisateur'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                      Pseudo
                    </label>
                    <input
                      type="text"
                      value={selectedUser.pseudo}
                      readOnly={!editingItem}
                      onChange={(e) => editingItem && setSelectedUser({ ...selectedUser, pseudo: e.target.value })}
                      className="w-full px-4 py-3 bg-esport-gray-800 border border-esport-gray-700 rounded-lg text-white focus:outline-none focus:border-esport-purple disabled:opacity-50 disabled:cursor-not-allowed"
                    />
      </div>

                  <div>
                    <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={selectedUser.bio || ''}
                      readOnly={!editingItem}
                      onChange={(e) => editingItem && setSelectedUser({ ...selectedUser, bio: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-esport-gray-800 border border-esport-gray-700 rounded-lg text-white focus:outline-none focus:border-esport-purple disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                      Rôle
                    </label>
                    <select
                      value={selectedUser.role}
                      disabled={!editingItem}
                      onChange={(e) => editingItem && setSelectedUser({ ...selectedUser, role: e.target.value as any })}
                      className="w-full px-4 py-3 bg-esport-gray-800 border border-esport-gray-700 rounded-lg text-white focus:outline-none focus:border-esport-purple disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="visiteur">Visiteur</option>
                      <option value="joueur">Joueur</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                      XP
                    </label>
                    <input
                      type="number"
                      value={selectedUser.xp}
                      readOnly={!editingItem}
                      onChange={(e) => editingItem && setSelectedUser({ ...selectedUser, xp: parseInt(e.target.value) || 0 })}
                      min="0"
                      className="w-full px-4 py-3 bg-esport-gray-800 border border-esport-gray-700 rounded-lg text-white focus:outline-none focus:border-esport-purple disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-esport-gray-300 mb-2">
                      Date d'inscription
                    </label>
                    <input
                      type="text"
                      value={new Date(selectedUser.created_at).toLocaleString('fr-FR')}
                      readOnly
                      className="w-full px-4 py-3 bg-esport-gray-800 border border-esport-gray-700 rounded-lg text-white opacity-50 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    {!editingItem ? (
                      <>
                        <motion.button
                          onClick={() => {
                            setShowUserModal(false)
                            setSelectedUser(null)
                          }}
                          className="flex-1 py-3 px-4 bg-esport-gray-700 text-white rounded-lg font-medium transition-colors hover:bg-esport-gray-600"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Fermer
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            setEditingItem(selectedUser)
                          }}
                          className="flex-1 py-3 px-4 bg-esport-purple text-white rounded-lg font-medium transition-colors hover:bg-esport-light-purple flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Edit size={20} />
                          <span>Modifier</span>
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          onClick={() => {
                            setEditingItem(null)
                            setSelectedUser(users.find(u => u.id === selectedUser.id) || selectedUser)
                          }}
                          className="flex-1 py-3 px-4 bg-esport-gray-700 text-white rounded-lg font-medium transition-colors hover:bg-esport-gray-600"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Annuler
                        </motion.button>
                        <motion.button
                          onClick={async () => {
                            try {
                              const { error } = await (supabase as any)
                                .from('profiles')
                                .update({
                                  pseudo: selectedUser.pseudo,
                                  bio: selectedUser.bio,
                                  role: selectedUser.role,
                                  xp: selectedUser.xp
                                })
                                .eq('id', selectedUser.id)
                              
                              if (error) throw error
                              
                              // Recharger les données
                              const { data } = await supabase
                                .from('profiles')
                                .select('*')
                                .order('created_at', { ascending: false })
                              setUsers(data || [])
                              
                              toast.success('Utilisateur modifié avec succès')
                              setEditingItem(null)
                              setSelectedUser(users.find(u => u.id === selectedUser.id) || selectedUser)
                              
                              // Log l'action
                              if (user) {
                                await supabaseHelpers.addLog(user.id, 'modification_utilisateur', { userId: selectedUser.id })
                              }
                            } catch (error: any) {
                              toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`)
                            }
                          }}
                          className="flex-1 py-3 px-4 bg-esport-purple text-white rounded-lg font-medium transition-colors hover:bg-esport-light-purple flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Save size={20} />
                          <span>Enregistrer</span>
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Admin