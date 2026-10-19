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
          streak: number
          last_study_date: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          streak?: number
          last_study_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          streak?: number
          last_study_date?: string | null
          created_at?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      vocabulary: {
        Row: {
          id: string
          collection_id: string
          user_id: string
          word: string
          reading: string
          meaning_vi: string
          meaning_en: string | null
          example_jp: string | null
          example_vi: string | null
          jisho_slug: string | null
          created_at: string
        }
        Insert: {
          id?: string
          collection_id: string
          user_id: string
          word: string
          reading: string
          meaning_vi: string
          meaning_en?: string | null
          example_jp?: string | null
          example_vi?: string | null
          jisho_slug?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          collection_id?: string
          user_id?: string
          word?: string
          reading?: string
          meaning_vi?: string
          meaning_en?: string | null
          example_jp?: string | null
          example_vi?: string | null
          jisho_slug?: string | null
          created_at?: string
        }
        Relationships: []
      }
      study_logs: {
        Row: {
          id: string
          user_id: string
          vocabulary_id: string
          result: boolean
          studied_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vocabulary_id: string
          result: boolean
          studied_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vocabulary_id?: string
          result?: boolean
          studied_at?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Collection = Database['public']['Tables']['collections']['Row']
export type Vocabulary = Database['public']['Tables']['vocabulary']['Row']
export type StudyLog = Database['public']['Tables']['study_logs']['Row']
