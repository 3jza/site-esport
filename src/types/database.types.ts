// Types générés automatiquement par Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          pseudo: string
          avatar_url: string | null
          bio: string | null
          role: 'visiteur' | 'joueur' | 'admin'
          xp: number
          created_at: string
        }
        Insert: {
          id?: string
          pseudo: string
          avatar_url?: string | null
          bio?: string | null
          role?: 'visiteur' | 'joueur' | 'admin'
          xp?: number
          created_at?: string
        }
        Update: {
          id?: string
          pseudo?: string
          avatar_url?: string | null
          bio?: string | null
          role?: 'visiteur' | 'joueur' | 'admin'
          xp?: number
          created_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string | null
          created_by: string
          is_special: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url?: string | null
          created_by: string
          is_special?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string | null
          created_by?: string
          is_special?: boolean
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_at?: string
        }
      }
      defis: {
        Row: {
          id: string
          game: string
          title: string
          description: string
          reward_xp: number
          reward_badge_id: string | null
          created_by: string
          created_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          game: string
          title: string
          description: string
          reward_xp?: number
          reward_badge_id?: string | null
          created_by: string
          created_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          game?: string
          title?: string
          description?: string
          reward_xp?: number
          reward_badge_id?: string | null
          created_by?: string
          created_at?: string
          is_active?: boolean
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          members: string[]
          game: string
          created_at: string
          captain_id: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          members?: string[]
          game: string
          created_at?: string
          captain_id: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          members?: string[]
          game?: string
          created_at?: string
          captain_id?: string
        }
      }
      tournois: {
        Row: {
          id: string
          name: string
          game: string
          date: string
          reward: string
          status: 'à venir' | 'en cours' | 'terminé'
          max_participants: number | null
          participants: string[]
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          game: string
          date: string
          reward: string
          status?: 'à venir' | 'en cours' | 'terminé'
          max_participants?: number | null
          participants?: string[]
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          game?: string
          date?: string
          reward?: string
          status?: 'à venir' | 'en cours' | 'terminé'
          max_participants?: number | null
          participants?: string[]
          created_by?: string
          created_at?: string
        }
      }
      logs: {
        Row: {
          id: string
          user_id: string
          action: string
          details: Record<string, any> | null
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          details?: Record<string, any> | null
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          details?: Record<string, any> | null
          timestamp?: string
        }
      }
    }
  }
}

// Types d'application utilitaires
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Badge = Database['public']['Tables']['badges']['Row']
export type UserBadge = Database['public']['Tables']['user_badges']['Row']
export type Defi = Database['public']['Tables']['defis']['Row']
export type Team = Database['public']['Tables']['teams']['Row']
export type Tournoi = Database['public']['Tables']['tournois']['Row']
export type Log = Database['public']['Tables']['logs']['Row']

// Types pour les inserts
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type BadgeInsert = Database['public']['Tables']['badges']['Insert']
export type UserBadgeInsert = Database['public']['Tables']['user_badges']['Insert']
export type DefiInsert = Database['public']['Tables']['defis']['Insert']
export type TeamInsert = Database['public']['Tables']['teams']['Insert']
export type TournoiInsert = Database['public']['Tables']['tournois']['Insert']
export type LogInsert = Database['public']['Tables']['logs']['Insert']

// Types pour les updates
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type BadgeUpdate = Database['public']['Tables']['badges']['Update']
export type DefiUpdate = Database['public']['Tables']['defis']['Update']
export type TeamUpdate = Database['public']['Tables']['teams']['Update']
export type TournoiUpdate = Database['public']['Tables']['tournois']['Update']

// Types utilitaires
export type UserRole = 'visiteur' | 'joueur' | 'admin'
export type TournoiStatus = 'à venir' | 'en cours' | 'terminé'
export type GameType = 'LoL' | 'Valorant' | 'Rocket League' | 'Mario Kart 8' | 'Smash Bros' | 'FC26'

// Types étendus avec relations
export interface ProfileWithBadges extends Profile {
  badges?: (UserBadge & { badge: Badge })[]
  badge_count?: number
}

export interface BadgeWithUsers extends Badge {
  users?: (UserBadge & { profile: Profile })[]
  user_count?: number
}

export interface DefiWithBadge extends Defi {
  badge?: Badge
  completed_by?: Profile[]
}

export interface TeamWithMembers extends Team {
  member_profiles?: Profile[]
  captain?: Profile
}

export interface TournoiWithParticipants extends Tournoi {
  participant_profiles?: Profile[]
  winner?: Profile
}

