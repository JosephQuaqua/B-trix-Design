export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: string
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
        }
      }
      services: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          long_description: string | null
          duration_minutes: number | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          slug: string
          description?: string | null
          long_description?: string | null
          duration_minutes?: number | null
          is_active?: boolean
          sort_order?: number
        }
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      collections: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          category: string
          fabric: string | null
          color: string | null
          image_url: string | null
          is_featured: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          title: string
          slug: string
          description?: string | null
          category: string
          fabric?: string | null
          color?: string | null
          image_url?: string | null
          is_featured?: boolean
          sort_order?: number
        }
        Update: Partial<Database['public']['Tables']['collections']['Insert']>
      }
      gallery: {
        Row: {
          id: string
          title: string
          image_url: string
          collection_id: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          title: string
          image_url: string
          collection_id?: string | null
          sort_order?: number
        }
        Update: Partial<Database['public']['Tables']['gallery']['Insert']>
      }
      appointments: {
        Row: {
          id: string
          customer_id: string
          service_id: string
          preferred_date: string
          preferred_time: string
          notes: string | null
          status: string
          admin_notes: string | null
          inspiration_images: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          customer_id: string
          service_id: string
          preferred_date: string
          preferred_time: string
          notes?: string | null
          status?: string
          inspiration_images?: string[] | null
        }
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          customer_id: string
          name: string
          rating: number
          comment: string
          is_published: boolean
          created_at: string
        }
        Insert: {
          customer_id: string
          name: string
          rating: number
          comment: string
          is_published?: boolean
        }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      favorites: {
        Row: {
          id: string
          customer_id: string
          collection_id: string
          created_at: string
        }
        Insert: {
          customer_id: string
          collection_id: string
        }
        Update: {}
      }
      measurements: {
        Row: {
          id: string
          customer_id: string
          bust: number | null
          waist: number | null
          hips: number | null
          shoulder_width: number | null
          arm_length: number | null
          inseam: number | null
          height: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          customer_id: string
          bust?: number | null
          waist?: number | null
          hips?: number | null
          shoulder_width?: number | null
          arm_length?: number | null
          inseam?: number | null
          height?: number | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['measurements']['Insert']>
      }
      messages: {
        Row: {
          id: string
          customer_id: string
          staff_id: string | null
          sender_role: string
          body: string
          read: boolean
          created_at: string
        }
        Insert: {
          customer_id: string
          staff_id?: string | null
          sender_role: string
          body: string
          read?: boolean
        }
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string
          type: string
          read: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          title: string
          body: string
          type: string
          read?: boolean
        }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      availability: {
        Row: {
          id: string
          staff_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
          created_at: string
        }
        Insert: {
          staff_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
        }
        Update: Partial<Database['public']['Tables']['availability']['Insert']>
      }
      settings: {
        Row: {
          id: string
          key: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: { key: string; value: string }
        Update: { value?: string }
      }
      audit_logs: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          metadata: unknown
          created_at: string
        }
        Insert: {
          actor_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: unknown
        }
        Update: {}
      }
      faq: {
        Row: {
          id: string
          question: string
          answer: string
          category: string
          sort_order: number
          is_published: boolean
          created_at: string
        }
        Insert: {
          question: string
          answer: string
          category: string
          sort_order?: number
          is_published?: boolean
        }
        Update: Partial<Database['public']['Tables']['faq']['Insert']>
      }
    }
  }
}
