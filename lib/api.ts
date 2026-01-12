import { supabase } from '@/lib/supabase'

const API_BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL + '/functions/v1'

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

async function callEdgeFunction<T = any>(
  functionName: string,
  options: RequestInit = {}
): Promise<T> {
  // Get current user's JWT token
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new APIError('Not authenticated', 401)
  }

  const url = `${API_BASE_URL}/${functionName}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    } as any,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new APIError(error.error || 'Request failed', response.status, error)
  }

  return await response.json()
}

// Type-safe API client
export const api = {
  // Pets
  pets: {
    list: (params?: { page?: number; limit?: number; search?: string }) =>
      callEdgeFunction<{ pets: any[]; pagination: any }>(`api-v1-pets${params ? '?' + new URLSearchParams(params as any) : ''}`),

    get: (id: string) =>
      callEdgeFunction(`api-v1-pet-detail?id=${id}`),

    create: (data: any) =>
      callEdgeFunction('api-v1-pets', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      callEdgeFunction('api-v1-pet-detail', {
        method: 'PUT',
        body: JSON.stringify({ id, ...data }),
      }),

    delete: (id: string) =>
      callEdgeFunction('api-v1-pet-detail', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      }),
  },

  // Health records
  health: {
    list: (petId: string) =>
      callEdgeFunction(`api-v1-health?pet_id=${petId}`),

    create: (data: any) =>
      callEdgeFunction('api-v1-health', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      callEdgeFunction('api-v1-health', {
        method: 'PUT',
        body: JSON.stringify({ id, ...data }),
      }),

    delete: (id: string) =>
      callEdgeFunction('api-v1-health', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      }),
  },

  // Vaccinations
  vaccinations: {
    list: (petId: string) =>
      callEdgeFunction(`api-v1-vaccinations?pet_id=${petId}`),

    create: (data: any) =>
      callEdgeFunction('api-v1-vaccinations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Media uploads
  media: {
    upload: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      return callEdgeFunction('api-v1-media-upload', {
        method: 'POST',
        body: formData,
      })
    },
  },

  // Social features
  social: {
    feed: (page: number = 1) =>
      callEdgeFunction(`api-v1-social-feed?page=${page}`),

    share: (petId: string, data: any) =>
      callEdgeFunction('api-v1-social-share', {
        method: 'POST',
        body: JSON.stringify({ pet_id: petId, ...data }),
      }),
  },
}