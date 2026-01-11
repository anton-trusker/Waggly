import { z } from 'https://deno.land/x/zod@v3.21.4/mod.ts'

// Pet validation schemas
export const CreatePetSchema = z.object({
  name: z.string().min(1).max(100),
  species: z.enum(['dog', 'cat', 'other']), // Matching V2 Enum
  breed: z.string().min(1).max(100).optional(),
  date_of_birth: z.string().optional(), // ISO Date string YYYY-MM-DD
  weight_current: z.number().positive().optional(),
  weight_unit: z.enum(['kg', 'lbs']).default('kg'),
  microchip_number: z.string().max(50).optional(),
  gender: z.enum(['male', 'female']).optional(), // Matching V2 Enum
  size: z.enum(['small', 'medium', 'large', 'giant']).optional(),
  color: z.string().max(50).optional(),
  avatar_url: z.string().url().optional(),
})

export const UpdatePetSchema = CreatePetSchema.partial()

// Health record validation schemas
export const CreateHealthRecordSchema = z.object({
  pet_id: z.string().uuid(),
  record_type: z.enum(['vaccination', 'visit', 'treatment', 'condition', 'allergy', 'medication']),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  date: z.string().datetime(),
  veterinarian_id: z.string().uuid().optional(),
  attachments: z.array(z.string().url()).optional(),
})

// User validation schemas
export const UpdateUserSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
})

// Pagination validation
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

// Search validation
export const SearchSchema = z.object({
  q: z.string().min(1).max(100).optional(),
  sort: z.enum(['created_at', 'updated_at', 'name']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

// Helper function to validate request body
export async function validateBody<T>(req: Request, schema: z.ZodSchema<T>): Promise<T | Response> {
  try {
    const body = await req.json()
    return schema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          details: error.errors
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }
    throw error
  }
}