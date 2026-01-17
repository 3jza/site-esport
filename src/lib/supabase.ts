import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pxcwnhrxxrgujqnosvty.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Y3duaHJ4eHJndWpxbm9zdnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzkzMDQsImV4cCI6MjA3NzIxNTMwNH0.TTdp-1DG3xuUch7s4gW7Pgg6rOJ2uauAWuYWEgXoZHQ'

// Log pour debug (en développement seulement)
if (import.meta.env.DEV) {
  console.log('🔧 Configuration Supabase:', {
    url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'NON DÉFINI',
    hasKey: !!supabaseAnonKey
  })
}

// Création du client Supabase avec les types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Pas d'auth traditionnelle, on gère par pseudo
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-my-custom-header': 'educarma-esport',
    },
  },
})

// Fonction utilitaire pour vérifier la connexion
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1)
    if (error) {
      console.error('Erreur de connexion Supabase:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Erreur de connexion Supabase:', error)
    return false
  }
}

// Fonctions utilitaires pour les requêtes communes
export const supabaseHelpers = {
  // Profils
  async getProfileByPseudo(pseudo: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('pseudo', pseudo)
      .single()
    
    return { data, error }
  },

  async createProfile(profile: any) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile as any)
      .select()
      .single()
    
    return { data, error }
  },

  async updateProfile(id: string, updates: any) {
    const { data, error } = await (supabase as any)
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Badges
  async getUserBadges(userId: string) {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', userId)
    
    return { data, error }
  },

  async awardBadge(userId: string, badgeId: string) {
    const { data, error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId,
      } as any)
      .select()
      .single()
    
    return { data, error }
  },

  // Défis
  async getDefisByGame(game: string) {
    const { data, error } = await supabase
      .from('defis')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('game', game)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Logs
  async addLog(userId: string, action: string, details?: Record<string, any>) {
    const { data, error } = await supabase
      .from('logs')
      .insert({
        user_id: userId,
        action,
        details,
      } as any)
    
    return { data, error }
  },

  // Tournois
  async getUpcomingTournois() {
    const { data, error } = await supabase
      .from('tournois')
      .select('*')
      .in('status', ['à venir', 'en cours'])
      .order('date', { ascending: true })
    
    return { data, error }
  },

  async joinTournoi(tournoiId: string, userId: string) {
    // D'abord récupérer le tournoi
    const { data: tournoi, error: fetchError } = await supabase
      .from('tournois')
      .select('participants, max_participants')
      .eq('id', tournoiId)
      .single()
    
    if (fetchError) return { data: null, error: fetchError }
    
    // Vérifier si l'utilisateur est déjà inscrit
    if ((tournoi as any)?.participants?.includes(userId)) {
      return { data: null, error: { message: 'Déjà inscrit à ce tournoi' } as any }
    }
    
    // Vérifier la limite de participants
    if ((tournoi as any)?.max_participants && (tournoi as any)?.participants?.length >= (tournoi as any)?.max_participants) {
      return { data: null, error: { message: 'Tournoi complet' } as any }
    }
    
    // Ajouter le participant
    const newParticipants = [...((tournoi as any)?.participants || []), userId]
    const { data, error } = await (supabase as any)
      .from('tournois')
      .update({ participants: newParticipants })
      .eq('id', tournoiId)
      .select()
      .single()
    
    return { data, error }
  },

  // Équipes
  async getTeamsByGame(game: string) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('game', game)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  async getTeamWithMembers(teamId: string) {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        captain:profiles!teams_captain_id_fkey(*)
      `)
      .eq('id', teamId)
      .single()
    
    return { data, error }
  },
}

// Types d'erreur personnalisés
export interface SupabaseError {
  message: string
  details?: string
  hint?: string
  code?: string
}

// Fonction pour formater les erreurs Supabase
export const formatSupabaseError = (error: any): string => {
  if (!error) return 'Erreur inconnue'
  
  // Erreurs communes
  if (error.code === '23505') {
    return 'Cette valeur existe déjà'
  }
  
  if (error.code === '23503') {
    return 'Référence invalide'
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'Une erreur est survenue'
}

export default supabase
