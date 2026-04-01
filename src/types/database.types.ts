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
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          created_at?: string | null
        }
      }
      prompts: {
        Row: {
          id: string
          title: string
          content: string
          image_url: string | null
          category_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          image_url?: string | null
          category_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image_url?: string | null
          category_id?: string | null
          created_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          phone_number: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          phone_number?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          phone_number?: string | null
          created_at?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string | null
          prompt_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          prompt_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          prompt_id?: string | null
          created_at?: string | null
        }
      }
    }
  }
}
