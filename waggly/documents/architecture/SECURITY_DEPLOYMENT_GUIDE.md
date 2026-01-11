# 🚀 Waggli Security Architecture - Deployment Guide

## 📋 Overview

This guide covers the deployment of the comprehensive security architecture for Waggli, including Edge Functions, RLS policies, and environment configuration.

## 🔒 Phase 1: Immediate Security Fixes ✅ COMPLETED

### ✅ Completed Tasks:
- [x] Removed hardcoded credentials from `src/lib/supabase.ts`
- [x] Updated `.env.example` with placeholder values
- [x] Enhanced secure `/lib/supabase.ts` with authenticated client helper
- [x] Secured environment files with proper `.gitignore`

### ⚠️ CRITICAL: API Key Rotation Required
The following keys were exposed in Git history and **MUST** be rotated immediately:

- **Supabase Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Google OAuth Client Secret**: `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`
- **Supabase Access Token**: `sbp_5fbd26dc789019f8896a849c9a4e81ccc048c0fb`
- **PostHog API Key**: `phx_uoDVrdK2VghXFRtRYi9AuACvUu1A4ReoB87gzJAdiIt4cVH`

## 🏗️ Phase 2: Edge Functions Infrastructure ✅ COMPLETED

### ✅ Infrastructure Created:

#### Shared Utilities (`supabase/functions/_shared/`)
- [x] **supabase-client.ts** - Server-side clients with service role
- [x] **auth-middleware.ts** - JWT validation and user authentication
- [x] **rate-limiter.ts** - Rate limiting (100 req/min per user)
- [x] **error-handler.ts** - Centralized error handling and CORS
- [x] **validators.ts** - Input validation with Zod schemas

#### First Edge Function (`supabase/functions/api-v1-pets/`)
- [x] **GET /pets** - List pets with pagination and search
- [x] **POST /pets** - Create new pet with validation
- [x] Full authentication and rate limiting
- [x] Server-enforced ownership

#### Client API Helper (`/lib/api.ts`)
- [x] Type-safe API client
- [x] Automatic JWT token handling
- [x] Comprehensive error handling
- [x] Covers pets, health, vaccinations, media, social

## 🔐 Phase 3: RLS Policies ✅ COMPLETED

### ✅ Comprehensive RLS Implementation:
- [x] **Pets Table** - Owner-only access with co-owner sharing
- [x] **Health Records** - Strict privacy with permission-based sharing
- [x] **All Medical Tables** - Vaccinations, visits, medications, allergies, conditions
- [x] **Documents** - Pet owner access only
- [x] **Co-owners** - Bidirectional access control
- [x] **Notifications & Events** - User-specific access
- [x] **Profiles** - Self-service access
- [x] **Performance Indexes** - Optimized for RLS queries
- [x] **Role Permissions** - Proper anon/authenticated role grants

## 🚀 Phase 4: Deployment

### 4.1 Environment Configuration

#### Development (.env.local)
```bash
# Public keys - Safe to expose in client
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Server-side only (never commit to Git)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_MAPS_API_KEY_SERVER=your_server_key
```

#### Production (EAS Secrets)
```bash
# Add to EAS Secrets (never commit)
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://prod.supabase.co" --type string
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your_prod_anon_key" --type string
```

### 4.2 Deploy Edge Functions

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy api-v1-pets

# Test function locally
supabase functions serve api-v1-pets --env-file .env.local

# View logs
supabase functions logs api-v1-pets
```

### 4.3 Apply RLS Policies

```bash
# Apply the comprehensive RLS migration
supabase migration new comprehensive_rls_policies
# Copy the contents of supabase/migrations/20260103_comprehensive_rls_policies.sql
supabase migration up
```

## 🧪 Phase 5: Testing

### 5.1 Test Edge Functions

```bash
# Test authentication
curl -X GET \
  https://your-project.supabase.co/functions/v1/api-v1-pets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test rate limiting (run multiple times)
curl -X GET \
  https://your-project.supabase.co/functions/v1/api-v1-pets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test input validation
curl -X POST \
  https://your-project.supabase.co/functions/v1/api-v1-pets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "", "species": "invalid"}'
```

### 5.2 Test RLS Policies

```sql
-- Test as different users
SET auth.uid = 'user-1-id';
SELECT * FROM pets; -- Should only see own pets

SET auth.uid = 'user-2-id';
SELECT * FROM pets; -- Should only see own pets

-- Test co-owner access
INSERT INTO pet_co_owners (pet_id, user_id, status, permissions) 
VALUES ('pet-1', 'user-2-id', 'active', '{"view_health_records": true}');

SET auth.uid = 'user-2-id';
SELECT * FROM health_records WHERE pet_id = 'pet-1'; -- Should be able to view
```

## 📊 Monitoring & Observability

### Key Metrics to Track:
- **Performance**: Edge Function response times (p50, p95, p99)
- **Security**: Failed authentication attempts, rate limit violations
- **Business**: API calls per user, most used endpoints, error rates

### Critical Alerts:
- Error rate > 5% for any endpoint
- Authentication failures > 100/min
- Response time p95 > 2 seconds

## 🔒 Security Checklist

### Before Production:
- [ ] Rotate all exposed API keys
- [ ] Deploy RLS policies
- [ ] Test all Edge Functions
- [ ] Configure monitoring alerts
- [ ] Set up GitHub Actions secrets
- [ ] Test rate limiting
- [ ] Validate input sanitization

### Ongoing:
- [ ] Regular security audits (quarterly)
- [ ] Secret rotation (every 90 days)
- [ ] RLS policy reviews
- [ ] Performance optimization
- [ ] Error log analysis

## 🚨 Critical Security Reminders

1. **NEVER** commit real secrets to Git
2. **NEVER** expose service role keys to clients
3. **ALWAYS** validate input on the server
4. **ALWAYS** use parameterized queries
5. **NEVER** trust client-side validation alone
6. **ALWAYS** log errors but not sensitive data
7. **NEVER** allow anonymous access to sensitive data

## 📞 Support

If you encounter issues:
1. Check Edge Function logs: `supabase functions logs api-v1-pets`
2. Verify RLS policies: `SELECT * FROM pg_policies`
3. Test authentication: Check JWT token validity
4. Monitor rate limits: Check for 429 responses

---

**🔐 Security First. Performance Second. Developer Experience Third.** 🔐