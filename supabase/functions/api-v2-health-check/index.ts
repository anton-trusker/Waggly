import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    const data = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: 'v2',
        region: Deno.env.get('SUPABASE_REGION') || 'unknown',
    }

    return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
})
