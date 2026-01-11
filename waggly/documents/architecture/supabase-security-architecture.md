# Pawzly Supabase Architecture - Security & Performance Improvement Solution

**Document Version**: 1.0  
**Created**: January 3, 2026  
**Status**: Architecture Design & Recommendations

---

## 🔴 CRITICAL SECURITY ISSUES IDENTIFIED

### Current Architecture Problems

#### 1. **Hardcoded Credentials in Source Code** ⚠️ CRITICAL
**Location**: `src/lib/supabase.ts`
```typescript
// ❌ SECURITY VULNERABILITY - Hardcoded credentials
const supabaseUrl = 'https://tcuftpjqjpmytshoaqxr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Risk**: 
- Credentials committed to Git repository
- Visible in GitHub/source control history
- Can be extracted from compiled JavaScript bundles
- Anyone with repository access can see and use credentials

#### 2. **Exposed Sensitive Keys in .env Files** ⚠️ HIGH RISK
**Location**: `.env.example` and `.env`
```
GOOGLE_OAUTH_CLIENT_SECRET=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  ❌
SUPABASE_ACCESS_TOKEN=sbp_5fbd26dc789019f8896a849c9a4e81ccc048c0fb  ❌
posthog_api_key=phx_uoDVrdK2VghXFRtRYi9AuACvUu1A4ReoB87gzJAdiIt4cVH  ❌
```

**Risk**:
- `.env.example` should NEVER contain real secrets
- If `.env` is accidentally committed, all secrets are exposed
- Service role keys can bypass RLS completely

#### 3. **Direct Client-Side Database Access** ⚠️ MEDIUM RISK
**Current Pattern**:
```typescript
// Client directly queries database
const { data } = await supabase
  .from('pets')
  .select('*')
  .eq('owner_id', userId);
```

**Risks**:
- Anon key is visible in client bundle
- Complex RLS policies required for every table
- Performance issues with complex queries
- Difficult to implement business logic
- Hard to audit/log database access
- Can't implement rate limiting per user
- Difficult to cache responses

#### 4. **Missing Backend API Layer**
**Current State**: No Edge Functions except `send-invite`

**Consequences**:
- No centralized business logic
- Can't implement complex operations securely
- Can't hide sensitive data transformations
- No ability to integrate third-party APIs securely
- Can't implement server-side caching
- Limited ability to add middleware (rate limiting, logging, validation)

#### 5. **Duplicate Supabase Client Files**
Both `/lib/supabase.ts` and `/src/lib/supabase.ts` exist with different implementations

---

## ✅ RECOMMENDED ARCHITECTURE

### High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   iOS App   │  │ Android App │  │   Web App   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                 │                 │                 │
│         └─────────────────┴─────────────────┘                 │
│                           │                                   │
│                  Only EXPO_PUBLIC_* variables                │
│                  (Safe to expose in client)                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            │ HTTPS/WSS
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              SUPABASE EDGE FUNCTIONS                   │ │
│  │  (Deno Runtime - Serverless Functions)                │ │
│  │                                                        │ │
│  │  /api/v1/pets/*      → Pet operations                │ │
│  │  /api/v1/health/*    → Health records                │ │
│  │  /api/v1/social/*    → Social network                │ │
│  │  /api/v1/auth/*      → Custom auth logic             │ │
│  │  /api/v1/media/*     → File uploads                  │ │
│  │                                                        │ │
│  │  Features:                                            │ │
│  │  • Business logic isolation                           │ │
│  │  • Secret keys (service_role)                        │ │
│  │  • Third-party API calls                             │ │
│  │  • Complex queries & joins                           │ │
│  │  • Rate limiting & validation                        │ │
│  │  • Response caching                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                  │
│                            ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              POSTGRESQL DATABASE                       │ │
│  │  • Row Level Security (RLS)                           │ │
│  │  • Database Functions                                 │ │
│  │  • Triggers                                           │ │
│  │  • Indexes                                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              SUPABASE STORAGE                          │ │
│  │  • Secure file uploads                                │ │
│  │  • Image transformations                              │ │
│  │  • CDN delivery                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              SUPABASE AUTH                             │ │
│  │  • JWT token management                               │ │
│  │  • OAuth providers                                    │ │
│  │  • Session handling                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              SUPABASE REALTIME                         │ │
│  │  • WebSocket connections                              │ │
│  │  • Live updates                                       │ │
│  │  • Presence                                           │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES (Server-Side Only)            │
│  • Google Maps API                                           │
│  • Stripe Payment Processing                                 │
│  • Email Service (Resend/SendGrid)                          │
│  • AI Services (OpenAI)                                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 🏗 IMPLEMENTATION PLAN

### Phase 1: Immediate Security Fixes (Week 1) ⚡ URGENT

#### 1.1 Remove Hardcoded Credentials

**File**: `src/lib/supabase.ts`

**BEFORE (❌ Insecure)**:
```typescript
const supabaseUrl = 'https://tcuftpjqjpmytshoaqxr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**AFTER (✅ Secure)**:
```typescript
import { createClient } from '@supabase/supabase-js'

// Load from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
```

**Action Items**:
- ✅ Delete `src/lib/supabase.ts` (use `/lib/supabase.ts` as single source)
- ✅ Update all imports to use `@/lib/supabase`
- ✅ Verify no hardcoded credentials remain in codebase

#### 1.2 Secure .env Files

**Create `.env.example` (Template)**:
```bash
# ============================================
# SUPABASE CONFIGURATION
# ============================================

# Public keys - Safe to expose in client bundles
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# ============================================
# SERVER-SIDE ONLY (Never expose to client)
# ============================================

# CRITICAL: NEVER add these to EXPO_PUBLIC_* variables!
# These should only be in .env (not committed) or Vercel/deployment secrets

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ACCESS_TOKEN=your_access_token

# Third-party API keys (server-side only)
GOOGLE_OAUTH_CLIENT_SECRET=your_secret
GOOGLE_MAPS_API_KEY_SERVER=your_key
STRIPE_SECRET_KEY=your_key
OPENAI_API_KEY=your_key
POSTHOG_API_KEY=your_key

# ============================================
# PUBLIC API KEYS (Safe for client)
# ============================================

EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_public_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
```

**Update `.gitignore`**:
```bash
# Environment variables
.env
.env.local
.env.*.local

# Allow template only
!.env.example
```

**CRITICAL**: Rotate all exposed secrets immediately!

#### 1.3 Implement Secure Supabase Client

**File**: `/lib/supabase.ts`

```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { Database } from '@/types/db';

// Environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validation
if (!supabaseUrl) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL. Please add it to your .env file.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_ANON_KEY. Please add it to your .env file.'
  );
}

// Custom storage implementation for React Native
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

// Create client with security best practices
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Security: prevent URL session injection
  },
  global: {
    headers: {
      'x-application-name': 'pawzly-mobile',
    },
  },
  db: {
    schema: 'public',
  },
  // Rate limiting on client side (basic protection)
  // More sophisticated rate limiting should be on server
});

// Helper to get authenticated client with fresh token
export async function getAuthenticatedClient() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('User not authenticated');
  }
  
  return {
    supabase,
    session,
    userId: session.user.id,
  };
}

export {}
```

---

### Phase 2: Backend API Layer with Edge Functions (Weeks 2-4)

#### 2.1 Project Structure

```
supabase/
├── functions/
│   ├── _shared/
│   │   ├── supabase-client.ts      # Server-side client with service role
│   │   ├── auth-middleware.ts       # JWT validation
│   │   ├── error-handler.ts         # Centralized error handling
│   │   ├── rate-limiter.ts          # Rate limiting logic
│   │   └── validators.ts            # Input validation schemas
│   │
│   ├── api-v1-pets/
│   │   └── index.ts                 # GET /pets, POST /pets
│   │
│   ├── api-v1-pet-detail/
│   │   └── index.ts                 # GET /pets/:id, PUT /pets/:id, DELETE /pets/:id
│   │
│   ├── api-v1-health/
│   │   └── index.ts                 # Health records operations
│   │
│   ├── api-v1-vaccinations/
│   │   └── index.ts                 # Vaccination operations
│   │
│   ├── api-v1-social-feed/
│   │   └── index.ts                 # Social network feed
│   │
│   ├── api-v1-media-upload/
│   │   └── index.ts                 # Secure file uploads
│   │
│   └── api-v1-webhooks/
│       └── index.ts                 # Stripe, OAuth callbacks
│
├── migrations/
│   └── ... (existing)
│
└── config.toml
```

#### 2.2 Shared Server-Side Client

**File**: `supabase/functions/_shared/supabase-client.ts`

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import type { Database } from '../_shared/database.types.ts'

// Server-side client with SERVICE ROLE key (bypasses RLS)
// NEVER expose this to client!
export function createServerClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server configuration')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
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

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
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
```

#### 2.3 Authentication Middleware

**File**: `supabase/functions/_shared/auth-middleware.ts`

```typescript
import { createServerClient } from './supabase-client.ts'

export interface AuthContext {
  userId: string
  user: any
  supabase: ReturnType<typeof createServerClient>
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

  try {
    // Verify JWT token
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
      supabase,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return new Response(
      JSON.stringify({ error: 'Authentication failed' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
```

#### 2.4 Rate Limiting

**File**: `supabase/functions/_shared/rate-limiter.ts`

```typescript
// Simple in-memory rate limiter (for demo)
// Production: Use Redis or Supabase database with TTL

const requestCounts = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitConfig {
  maxRequests: number // Max requests per window
  windowMs: number    // Time window in milliseconds
}

export function checkRateLimit(
  identifier: string, // User ID or IP
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 } // 100 req/min
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const existing = requestCounts.get(identifier)

  // Clean up expired entries
  if (existing && existing.resetAt < now) {
    requestCounts.delete(identifier)
  }

  const current = requestCounts.get(identifier) || {
    count: 0,
    resetAt: now + config.windowMs,
  }

  if (current.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    }
  }

  current.count++
  requestCounts.set(identifier, current)

  return {
    allowed: true,
    remaining: config.maxRequests - current.count,
    resetAt: current.resetAt,
  }
}
```

#### 2.5 Example Edge Function: Pets API

**File**: `supabase/functions/api-v1-pets/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { authenticateRequest } from '../_shared/auth-middleware.ts'
import { checkRateLimit } from '../_shared/rate-limiter.ts'
import { createServerClient } from '../_shared/supabase-client.ts'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Authenticate user
    const authResult = await authenticateRequest(req)
    if (authResult instanceof Response) {
      return authResult // Authentication failed
    }
    
    const { userId, supabase } = authResult

    // Rate limiting
    const rateLimit = checkRateLimit(userId, { maxRequests: 100, windowMs: 60000 })
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', resetAt: rateLimit.resetAt }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Route handling
    if (req.method === 'GET') {
      // Get all pets for user
      const { data: pets, error } = await supabase
        .from('pets')
        .select(`
          *,
          vaccinations (count)
        `)
        .eq('owner_user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify({ pets }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST') {
      // Create new pet
      const body = await req.json()
      
      // Server-side validation
      if (!body.name || !body.species) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: name, species' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Insert with automatic owner_user_id
      const { data: pet, error } = await supabase
        .from('pets')
        .insert({
          ...body,
          owner_user_id: userId, // Server enforces owner
        })
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ pet }),
        { 
          status: 201, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

#### 2.6 Client-Side API Helper

**File**: `/lib/api.ts`

```typescript
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
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    },
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
    list: () => callEdgeFunction<{ pets: any[] }>('api-v1-pets'),
    get: (id: string) => callEdgeFunction(`api-v1-pet-detail?id=${id}`),
    create: (data: any) => callEdgeFunction('api-v1-pets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => callEdgeFunction('api-v1-pet-detail', {
      method: 'PUT',
      body: JSON.stringify({ id, ...data }),
    }),
    delete: (id: string) => callEdgeFunction('api-v1-pet-detail', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    }),
  },
  
  // Add more API endpoints...
}
```

---

This is the first part of the comprehensive security architecture document. Would you like me to continue with the remaining sections covering deployment, RLS policies, migration strategy, and security best practices?

