export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      kpis: {
        Row: {
          id: string
          user_id: string
          name: string
          current_value: number
          target_value: number
          phase: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          current_value: number
          target_value: number
          phase: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          current_value?: number
          target_value?: number
          phase?: number
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          user_id: string
          name: string
          tier: 'T1A' | 'T1B' | 'T2'
          status: 'Lead' | 'Applied' | 'Interview' | 'Offer' | 'Rejected'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          tier: 'T1A' | 'T1B' | 'T2'
          status: 'Lead' | 'Applied' | 'Interview' | 'Offer' | 'Rejected'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          tier?: 'T1A' | 'T1B' | 'T2'
          status?: 'Lead' | 'Applied' | 'Interview' | 'Offer' | 'Rejected'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      schedule_blocks: {
        Row: {
          id: string
          user_id: string
          title: string
          tag: 'gym' | 'market' | 'study' | 'network' | 'content' | 'meal' | 'family'
          day: number // 0-6 (Mon-Sun)
          start_time: string
          end_time: string
          details: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          tag: 'gym' | 'market' | 'study' | 'network' | 'content' | 'meal' | 'family'
          day: number
          start_time: string
          end_time: string
          details?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          tag?: 'gym' | 'market' | 'study' | 'network' | 'content' | 'meal' | 'family'
          day?: number
          start_time?: string
          end_time?: string
          details?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_nonnegotiables: {
        Row: {
          id: string
          user_id: string
          title: string
          type: 'morning' | 'evening'
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: 'morning' | 'evening'
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: 'morning' | 'evening'
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      daily_tasks: {
        Row: {
          id: string
          user_id: string
          task_id: string
          date: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          date: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          date?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}