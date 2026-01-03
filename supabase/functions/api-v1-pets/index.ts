import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { authenticateRequest } from '../_shared/auth-middleware.ts'
import { checkRateLimit } from '../_shared/rate-limiter.ts'
import { createErrorResponse, createSuccessResponse, handleCorsPreflight } from '../_shared/error-handler.ts'
import { validateBody, CreatePetSchema } from '../_shared/validators.ts'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreflight()
  }

  try {
    // Authenticate user
    const authResult = await authenticateRequest(req)
    if (authResult instanceof Response) {
      return authResult // Authentication failed
    }
    
    // Use authenticated client for RLS
    const { userId, authenticatedClient } = authResult

    // Rate limiting
    const rateLimit = checkRateLimit(userId, { maxRequests: 100, windowMs: 60000 })
    if (!rateLimit.allowed) {
      return createErrorResponse('Rate limit exceeded', 429, { resetAt: rateLimit.resetAt })
    }

    // Route handling
    if (req.method === 'GET') {
      return await handleGetPets(authenticatedClient, userId, req)
    }

    if (req.method === 'POST') {
      return await handleCreatePet(authenticatedClient, userId, req)
    }

    return createErrorResponse('Method not allowed', 405)

  } catch (error) {
    console.error('Edge function error:', error)
    return createErrorResponse('Internal server error', 500)
  }
})

// GET /pets - Get all pets for user
async function handleGetPets(supabase: any, userId: string, req: Request) {
  try {
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
    const search = url.searchParams.get('search') || ''

    // RLS automatically filters pets the user owns or is a co-owner of
    let query = supabase
      .from('pets')
      .select(`
        *,
        vaccinations (count),
        medical_history (count)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data: pets, error, count } = await query.range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error('Database error:', error)
      return createErrorResponse('Failed to fetch pets', 500)
    }

    return createSuccessResponse({ 
      pets: pets || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Get pets error:', error)
    return createErrorResponse('Failed to fetch pets', 500)
  }
}

// POST /pets - Create new pet
async function handleCreatePet(supabase: any, userId: string, req: Request) {
  try {
    // Validate input
    const validationResult = await validateBody(req, CreatePetSchema)
    if (validationResult instanceof Response) {
      return validationResult
    }

    const petData = validationResult

    // Insert with automatic user_id
    const { data: pet, error } = await supabase
      .from('pets')
      .insert({
        ...petData,
        user_id: userId, // Enforce owner
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return createErrorResponse('Failed to create pet', 500)
    }

    return createSuccessResponse({ pet }, 201)
  } catch (error) {
    console.error('Create pet error:', error)
    return createErrorResponse('Failed to create pet', 500)
  }
}
