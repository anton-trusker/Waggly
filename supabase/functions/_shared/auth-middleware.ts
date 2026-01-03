import { createServerClient, createAuthenticatedClient } from './supabase-client.ts'

export interface AuthContext {
  userId: string
  user: any
  supabase: ReturnType<typeof createServerClient>
  authenticatedClient: ReturnType<typeof createAuthenticatedClient>
}

export async function authenticateRequest(
  req: Request
): Promise<AuthContext | Response> {
  const authHeader = req.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid authorization header' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const token = authHeader.replace('Bearer ', '')
  const supabase = createServerClient()
  const authenticatedClient = createAuthenticatedClient(token)

  try {
    // Verify JWT token using the authenticated client (or server client, but auth client is fine)
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return {
      userId: user.id,
      user,
      supabase, // Service role client (for admin tasks)
      authenticatedClient, // RLS-respecting client (for user data access)
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return new Response(
      JSON.stringify({ error: 'Authentication failed' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }
}