import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcuftpjqjpmytshoaqxr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjdWZ0cGpxanBteXRzaG9hcXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MDE1ODgsImV4cCI6MjA4MTM3NzU4OH0.sCDNrjlLMwlqPvt0WrVxxs6N6QfvxN6muEOvRGyvK90'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export type SupabaseClient = typeof supabase