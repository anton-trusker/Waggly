import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Server-side client with SERVICE ROLE key (bypasses RLS)
// NEVER expose this to client!
export function createServerClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server configuration')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Client with user's JWT token (respects RLS)
export function createAuthenticatedClient(authToken: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}