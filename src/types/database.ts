export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'brand' | 'creator' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'brand' | 'creator' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'brand' | 'creator' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      brand_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string
          website: string | null
          industry: string | null
          description: string | null
          logo_url: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          website?: string | null
          industry?: string | null
          description?: string | null
          logo_url?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          website?: string | null
          industry?: string | null
          description?: string | null
          logo_url?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      creator_profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          bio: string | null
          avatar_url: string | null
          categories: string[]
          social_links: Json
          follower_count: number
          engagement_rate: number | null
          total_earnings: number
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          bio?: string | null
          avatar_url?: string | null
          categories?: string[]
          social_links?: Json
          follower_count?: number
          engagement_rate?: number | null
          total_earnings?: number
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          bio?: string | null
          avatar_url?: string | null
          categories?: string[]
          social_links?: Json
          follower_count?: number
          engagement_rate?: number | null
          total_earnings?: number
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          brand_id: string
          title: string
          description: string
          brief: string | null
          budget: number
          budget_per_creator: number | null
          status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
          category: string
          deliverables: string[]
          requirements: Json
          deadline: string | null
          max_creators: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          title: string
          description: string
          brief?: string | null
          budget: number
          budget_per_creator?: number | null
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
          category: string
          deliverables?: string[]
          requirements?: Json
          deadline?: string | null
          max_creators?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          title?: string
          description?: string
          brief?: string | null
          budget?: number
          budget_per_creator?: number | null
          status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
          category?: string
          deliverables?: string[]
          requirements?: Json
          deadline?: string | null
          max_creators?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          campaign_id: string
          creator_id: string
          status: 'pending' | 'approved' | 'rejected' | 'withdrawn'
          pitch: string | null
          proposed_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          creator_id: string
          status?: 'pending' | 'approved' | 'rejected' | 'withdrawn'
          pitch?: string | null
          proposed_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          creator_id?: string
          status?: 'pending' | 'approved' | 'rejected' | 'withdrawn'
          pitch?: string | null
          proposed_rate?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          campaign_id: string
          creator_id: string
          application_id: string
          content_url: string
          thumbnail_url: string | null
          status: 'pending' | 'approved' | 'rejected' | 'revision_requested'
          feedback: string | null
          revision_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          creator_id: string
          application_id: string
          content_url: string
          thumbnail_url?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'revision_requested'
          feedback?: string | null
          revision_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          creator_id?: string
          application_id?: string
          content_url?: string
          thumbnail_url?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'revision_requested'
          feedback?: string | null
          revision_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          campaign_id: string | null
          sender_id: string
          recipient_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          sender_id: string
          recipient_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string | null
          sender_id?: string
          recipient_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          campaign_id: string
          brand_id: string
          creator_id: string | null
          amount: number
          type: 'payment' | 'refund' | 'payout' | 'fee'
          status: 'pending' | 'completed' | 'failed' | 'cancelled'
          stripe_payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          brand_id: string
          creator_id?: string | null
          amount: number
          type: 'payment' | 'refund' | 'payout' | 'fee'
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          stripe_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          brand_id?: string
          creator_id?: string | null
          amount?: number
          type?: 'payment' | 'refund' | 'payout' | 'fee'
          status?: 'pending' | 'completed' | 'failed' | 'cancelled'
          stripe_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience type helpers
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Named row types
export type Profile = Tables<'profiles'>
export type BrandProfile = Tables<'brand_profiles'>
export type CreatorProfile = Tables<'creator_profiles'>
export type Campaign = Tables<'campaigns'>
export type Application = Tables<'applications'>
export type Submission = Tables<'submissions'>
export type Message = Tables<'messages'>
export type Transaction = Tables<'transactions'>
