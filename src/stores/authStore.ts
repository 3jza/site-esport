import React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabaseHelpers } from '../lib/supabase'
import type { Profile, UserRole } from '../types/database.types'

// Interface pour l'état d'authentification
interface AuthState {
  // État
  isAuthenticated: boolean
  user: Profile | null
  isLoading: boolean
  error: string | null
  
  // Actions
  loginWithPseudo: (pseudo: string) => Promise<boolean>
  logout: () => void
  updateUserProfile: (updates: Partial<Profile>) => Promise<boolean>
  refreshUser: () => Promise<void>
  clearError: () => void
  refreshUserProfile: () => Promise<boolean>
  
  // Utilitaires
  isAdmin: () => boolean
  isPlayer: () => boolean
  canCreateDefis: () => boolean
  canManageUsers: () => boolean
}

// Store Zustand avec persistance dans localStorage
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // État initial
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      // Action de connexion par pseudo
      loginWithPseudo: async (pseudo: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // Nettoyer le pseudo (enlever espaces, caractères spéciaux)
          const cleanPseudo = pseudo.trim().toLowerCase()
          
          // Valider le format du pseudo
          if (!cleanPseudo || cleanPseudo.length < 2 || cleanPseudo.length > 30) {
            set({ error: 'Le pseudo doit contenir entre 2 et 30 caractères', isLoading: false })
            return false
          }
          
          // Vérifier le format (alphanumériques, tirets, underscores)
          if (!/^[a-zA-Z0-9_-]+$/.test(cleanPseudo)) {
            set({ error: 'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores', isLoading: false })
            return false
          }
          
          // Essayer de récupérer le profil existant
          const { data: existingProfile, error: fetchError } = await supabaseHelpers.getProfileByPseudo(cleanPseudo)
          
          if (existingProfile) {
            // Utilisateur existant - connexion
            set({ 
              user: existingProfile, 
              isAuthenticated: true, 
              isLoading: false,
              error: null
            })
            
            // Log de connexion
            await supabaseHelpers.addLog((existingProfile as any)?.id, 'connexion', { pseudo: cleanPseudo })
            
            return true
          } else if (fetchError && fetchError.code !== 'PGRST116') {
            // Erreur autre que "not found"
            console.error('Erreur lors de la récupération du profil:', fetchError)
            set({ error: 'Erreur de connexion', isLoading: false })
            return false
          } else {
            // Utilisateur inexistant - création
            const { data: newProfile, error: createError } = await supabaseHelpers.createProfile({
              pseudo: cleanPseudo,
              role: 'joueur' as UserRole,
              xp: 0,
              bio: `Salut ! Je suis ${cleanPseudo}, nouveau membre d'EducArma Esport ! 🎮`,
            })
            
            if (createError) {
              console.error('Erreur lors de la création du profil:', createError)
              if (createError.code === '23505') {
                set({ error: 'Ce pseudo est déjà pris', isLoading: false })
              } else {
                set({ error: 'Erreur lors de la création du profil', isLoading: false })
              }
              return false
            }
            
            if (!newProfile) {
              set({ error: 'Erreur lors de la création du profil', isLoading: false })
              return false
            }
            
            // Connexion automatique avec le nouveau profil
            set({ 
              user: newProfile, 
              isAuthenticated: true, 
              isLoading: false,
              error: null
            })
            
            // Log de création de compte
            await supabaseHelpers.addLog((newProfile as any)?.id, 'creation_compte', { pseudo: cleanPseudo })
            
            return true
          }
        } catch (error) {
          console.error('Erreur inattendue:', error)
          set({ error: 'Erreur inattendue lors de la connexion', isLoading: false })
          return false
        }
      },

      // Action de déconnexion
      logout: () => {
        const { user } = get()
        
        // Log de déconnexion
        if (user) {
          supabaseHelpers.addLog(user.id, 'deconnexion', {})
        }
        
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        })
      },

      // Mise à jour du profil utilisateur
      updateUserProfile: async (updates: Partial<Profile>) => {
        const { user } = get()
        if (!user) return false
        
        set({ isLoading: true, error: null })
        
        try {
          const { data: updatedProfile, error } = await supabaseHelpers.updateProfile(user.id, updates)
          
          if (error) {
            console.error('Erreur lors de la mise à jour:', error)
            set({ error: 'Erreur lors de la mise à jour du profil', isLoading: false })
            return false
          }
          
          if (updatedProfile) {
            set({ user: updatedProfile, isLoading: false })
            
            // Log de mise à jour
            await supabaseHelpers.addLog(user.id, 'mise_a_jour_profil', updates)
          }
          
          return true
        } catch (error) {
          console.error('Erreur inattendue:', error)
          set({ error: 'Erreur inattendue lors de la mise à jour', isLoading: false })
          return false
        }
      },

      // Actualiser les données utilisateur
      refreshUser: async () => {
        const { user } = get()
        if (!user) return
        
        set({ isLoading: true })
        
        try {
          const { data: refreshedUser, error } = await supabaseHelpers.getProfileByPseudo(user.pseudo)
          
          if (error) {
            console.error('Erreur lors du rafraîchissement:', error)
            set({ isLoading: false })
            return
          }
          
          if (refreshedUser) {
            set({ user: refreshedUser, isLoading: false })
          }
        } catch (error) {
          console.error('Erreur inattendue:', error)
          set({ isLoading: false })
        }
      },

      // Effacer l'erreur
      clearError: () => {
        set({ error: null })
      },

      // DEBUG TEMPORAIRE - Fonction pour recharger le profil utilisateur
      refreshUserProfile: async () => {
        const { user } = get()
        if (!user) return false

        try {
          const { data: updatedProfile, error } = await supabaseHelpers.getProfileByPseudo(user.pseudo)
          if (error) {
            console.error('Erreur lors du refresh du profil:', error)
            return false
          }
          
          if (updatedProfile) {
            set({ user: updatedProfile })
            console.log('Profil utilisateur rechargé:', updatedProfile)
            return true
          }
        } catch (error) {
          console.error('Erreur lors du refresh du profil:', error)
        }
        return false
      },

      // Utilitaires pour vérifier les permissions
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },

      isPlayer: () => {
        const { user } = get()
        return user?.role === 'joueur' || user?.role === 'admin'
      },

      canCreateDefis: () => {
        const { user } = get()
        return user?.role === 'joueur' || user?.role === 'admin'
      },

      canManageUsers: () => {
        const { user } = get()
        return user?.role === 'admin'
      },
    }),
    {
      name: 'educarma-auth', // nom dans localStorage
      partialize: (state) => ({
        // Persister seulement certaines propriétés
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Hook personnalisé pour vérifier l'authentification au démarrage
export const useInitAuth = () => {
  const { user, isAuthenticated, refreshUser } = useAuthStore()
  
  // Effect pour rafraîchir les données au démarrage si connecté
  React.useEffect(() => {
    if (isAuthenticated && user) {
      refreshUser()
    }
  }, [])
  
  return { user, isAuthenticated }
}

// Fonction utilitaire pour vérifier si l'utilisateur a un rôle spécifique
export const hasRole = (role: UserRole): boolean => {
  const user = useAuthStore.getState().user
  return user?.role === role
}

// Fonction utilitaire pour vérifier si l'utilisateur peut effectuer une action
export const canPerformAction = (action: 'create_defis' | 'manage_users' | 'manage_badges' | 'view_logs'): boolean => {
  const { isAdmin, canCreateDefis, canManageUsers } = useAuthStore.getState()
  
  switch (action) {
    case 'create_defis':
      return canCreateDefis()
    case 'manage_users':
    case 'manage_badges':
    case 'view_logs':
      return canManageUsers()
    default:
      return false
  }
}

export default useAuthStore
