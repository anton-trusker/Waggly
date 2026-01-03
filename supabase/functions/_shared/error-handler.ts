// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// Standard error response helper
export function createErrorResponse(
  message: string, 
  status: number = 500,
  details?: any
): Response {
  console.error(`Error ${status}: ${message}`, details)
  
  return new Response(
    JSON.stringify({ 
      error: message,
      ...(details && { details })
    }),
    { 
      status, 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  )
}

// Success response helper
export function createSuccessResponse(
  data: any, 
  status: number = 200
): Response {
  return new Response(
    JSON.stringify(data),
    { 
      status, 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  )
}

// Handle CORS preflight requests
export function handleCorsPreflight(): Response {
  return new Response('ok', { headers: corsHeaders })
}