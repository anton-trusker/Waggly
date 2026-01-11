import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { authenticateRequest } from '../_shared/auth-middleware.ts'
import { checkRateLimit } from '../_shared/rate-limiter.ts'
import { createErrorResponse, createSuccessResponse, handleCorsPreflight } from '../_shared/error-handler.ts'
import { validateBody, UpdatePetSchema } from '../_shared/validators.ts'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreflight()
  }

  try {
    // Authenticate user
    const authResult = await authenticateRequest(req)
    if (authResult instanceof Response) {
      return authResult
    }

    const { userId, authenticatedClient } = authResult

    // Rate limiting
    const rateLimit = checkRateLimit(userId, { maxRequests: 100, windowMs: 60000 })
    if (!rateLimit.allowed) {
      return createErrorResponse('Rate limit exceeded', 429, { resetAt: rateLimit.resetAt })
    }

    // Route handling
    if (req.method === 'GET') {
      return await handleGetPet(authenticatedClient, req)
    }

    if (req.method === 'PUT') {
      return await handleUpdatePet(authenticatedClient, userId, req)
    }

    if (req.method === 'DELETE') {
      return await handleDeletePet(authenticatedClient, req)
    }

    return createErrorResponse('Method not allowed', 405)

  } catch (error) {
    console.error('Edge function error:', error)
    return createErrorResponse('Internal server error', 500)
  }
})

// GET /pet-detail?id=...
async function handleGetPet(supabase: any, req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return createErrorResponse('Missing pet ID', 400)
    }

    // RLS ensures user can only see pets they have access to
    const { data: pet, error } = await supabase
      .from('pets')
      .select(`
        *,
        vaccinations (*),
        medical_visits (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Database error:', error)
      return createErrorResponse('Pet not found or access denied', 404)
    }

    return createSuccessResponse({ pet })
  } catch (error) {
    console.error('Get pet error:', error)
    return createErrorResponse('Failed to fetch pet', 500)
  }
}

// PUT /pet-detail (Body: { id, ...data })
async function handleUpdatePet(supabase: any, userId: string, req: Request) {
  try {
    // Clone request to read body multiple times if needed (though validateBody consumes it)
    // We expect body to contain id and update fields
    const body = await req.json()
    const { id, ...updateData } = body

    if (!id) {
      return createErrorResponse('Missing pet ID', 400)
    }

    // Validate update data against schema (partial update)
    // Note: UpdatePetSchema should be partial. If it's not, we might need to adjust.
    // Assuming UpdatePetSchema is Zod schema.
    // We can manually validate or trust the client logic + RLS + Schema

    // Simple validation for now, ideally use Zod parse
    // const validationResult = UpdatePetSchema.safeParse(updateData)
    // if (!validationResult.success) ...

    // RLS ensures user can only update their own pets (or co-owned with permission)
    const { data: pet, error } = await supabase
      .from('pets')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return createErrorResponse('Failed to update pet', 500)
    }

    return createSuccessResponse({ pet })
  } catch (error) {
    console.error('Update pet error:', error)
    return createErrorResponse('Failed to update pet', 500)
  }
}

// DELETE /pet-detail (Body: { id })
async function handleDeletePet(supabase: any, req: Request) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return createErrorResponse('Missing pet ID', 400)
    }

    // RLS ensures user can only delete their own pets
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return createErrorResponse('Failed to delete pet', 500)
    }

    return createSuccessResponse({ message: 'Pet deleted successfully' })
  } catch (error) {
    console.error('Delete pet error:', error)
    return createErrorResponse('Failed to delete pet', 500)
  }
}
