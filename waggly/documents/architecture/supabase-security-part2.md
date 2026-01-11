# Supabase Security Architecture - Part 2: Deployment, RLS & Migration

**Continuation of**: supabase-security-architecture.md  
**Document Version**: 1.0  
**Created**: January 3, 2026

---

## ⚙️ Phase 3: Row-Level Security (RLS) Policies

### 3.1 RLS Best Practices

**Core Principle**: Defense in depth - assume client can be compromised

```sql
-- ==========================================
-- PETS TABLE RLS POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own pets
CREATE POLICY "Users can view own pets"
  ON pets
  FOR SELECT
  USING (owner_user_id = auth.uid());

-- Policy 2: Users can view pets shared with them (co-ownership)
CREATE POLICY "Users can view shared pets"
  ON pets
  FOR SELECT
  USING (
    id IN (
      SELECT pet_id 
      FROM pet_co_owners 
      WHERE user_id = auth.uid()
      AND status = 'active'
    )
  );

-- Policy 3: Users can insert their own pets only
CREATE POLICY "Users can create own pets"
  ON pets
  FOR INSERT
  WITH CHECK (owner_user_id = auth.uid());

-- Policy 4: Users can update their own pets
CREATE POLICY "Users can update own pets"
  ON pets
  FOR UPDATE
  USING (owner_user_id = auth.uid())
  WITH CHECK (owner_user_id = auth.uid()); -- Prevent ownership change

-- Policy 5: Users can delete their own pets
CREATE POLICY "Users can delete own pets"
  ON pets
  FOR DELETE
  USING (owner_user_id = auth.uid());

-- Policy 6: Service role can do anything (for Edge Functions)
-- Note: This is implicit - service_role key bypasses RLS
```

### 3.2 RLS for Sensitive Data

```sql
-- ==========================================
-- HEALTH RECORDS - EXTRA PRIVACY
-- ==========================================

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Only owners can access health records
CREATE POLICY "Only pet owners can access health records"
  ON health_records
  FOR ALL
  USING (
    pet_id IN (
      SELECT id FROM pets 
      WHERE owner_user_id = auth.uid()
    )
  );

-- Shared access with explicit permissions
CREATE POLICY "Shared pet co-owners can view health records"
  ON health_records
  FOR SELECT
  USING (
    pet_id IN (
      SELECT co.pet_id 
      FROM pet_co_owners co
      WHERE co.user_id = auth.uid()
        AND co.status = 'active'
        AND co.permissions ? 'view_health_records' -- JSONB permission check
    )
  );
```

### 3.3 RLS Performance Optimization

```sql
-- Create indexes to support RLS policies efficiently
CREATE INDEX idx_pets_owner_user_id ON pets(owner_user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_health_records_pet_id ON health_records(pet_id);
CREATE INDEX idx_pet_co_owners_user_pet ON pet_co_owners(user_id, pet_id, status);
```

**Important**: RLS policies run on EVERY query. Poorly designed policies can cause severe performance issues.

---

## 🚀 Phase 4: Deployment Strategy

### 4.1 Environment Configuration

#### Development (.env.local)
```bash
# Local development
EXPO_PUBLIC_SUPABASE_URL=https://tcuftpjqjpmytshoaqxr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_dev_anon_key

# Local Edge Functions testing
SUPABASE_SERVICE_ROLE_KEY=your_dev_service_role_key
GOOGLE_MAPS_API_KEY_SERVER=your_dev_key
```

#### Production (Vercel/EAS Secrets)

**Expo Application (Mobile)**:
```bash
# Add to EAS Secrets (never commit)
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://prod.supabase.co" --type string
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your_prod_anon_key" --type string
eas secret:create --scope project --name EXPO_PUBLIC_GOOGLE_MAPS_API_KEY --value "your_prod_key" --type string
```

**Supabase Edge Functions**:
```bash
# Set secrets for Edge Functions
supabase secrets set GOOGLE_MAPS_API_KEY_SERVER=your_prod_server_key
supabase secrets set STRIPE_SECRET_KEY=your_prod_stripe_key
supabase secrets set OPENAI_API_KEY=your_prod_openai_key

# Supabase automatically provides these:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY  
# - SUPABASE_SERVICE_ROLE_KEY
```

### 4.2 Deploy Edge Functions

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref tcuftpjqjpmytshoaqxr

# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy api-v1-pets

# Test function locally
supabase functions serve api-v1-pets --env-file .env.local

# View logs
supabase functions logs api-v1-pets
```

### 4.3 GitHub Actions CI/CD

**File**: `.github/workflows/deploy-edge-functions.yml`

```yaml
name: Deploy Supabase Edge Functions

on:
  push:
    branches: [main]
    paths:
      - 'supabase/functions/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Deploy Edge Functions
        run: |
          supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
          supabase functions deploy
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Run Tests
        run: deno test --allow-all supabase/functions/**/*_test.ts
```

---

## 🔄 Phase 5: Migration Strategy

### 5.1 Gradual Migration Plan

**Week 1-2: Security Fixes (Zero Downtime)**
- ✅ Fix hardcoded credentials in `src/lib/supabase.ts`
- ✅ Update `.env.example` and rotate secrets
- ✅ Add `.gitignore` entries
- ✅ Deploy to production (backward compatible)

**Week 3-4: Backend Infrastructure**
- ✅ Create Edge Functions structure
- ✅ Deploy first Edge Function (pets API)
- ✅ Test in parallel with direct client access
- ✅ No breaking changes yet

**Week 5-6: Client Migration (Feature by Feature)**
- ✅ Migrate pet operations to Edge Functions
- ✅ Update React Native code to use `/lib/api.ts`
- ✅ Monitor performance and errors
- ✅ Rollback capability maintained

**Week 7-8: Complete Migration**
- ✅ Migrate all operations to Edge Functions
- ✅ Strengthen RLS policies (deny direct access)
- ✅ Remove direct client database calls
- ✅ Full API layer in place

### 5.2 Migration Example: Pet Operations

#### Old Pattern (Direct Client Access) ❌
```typescript
// components/Pet/PetList.tsx
import { supabase } from '@/lib/supabase'

async function loadPets() {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_user_id', userId)
  
  if (error) throw error
  return data
}
```

#### New Pattern (Via Edge Function) ✅
```typescript
// components/Pet/PetList.tsx
import { api } from '@/lib/api'

async function loadPets() {
  try {
    const { pets } = await api.pets.list()
    return pets
  } catch (error) {
    if (error instanceof APIError) {
      // Handle API errors
      console.error('API Error:', error.message, error.status)
    }
    throw error
  }
}
```

### 5.3 Backward Compatibility During Migration

```typescript
// lib/api.ts - Gradual migration helper

export const api = {
  pets: {
    list: async () => {
      // Feature flag for gradual rollout
      const useEdgeFunction = getFeatureFlag('use_edge_functions_pets')
      
      if (useEdgeFunction) {
        // New way: Edge Function
        return callEdgeFunction<{ pets: any[] }>('api-v1-pets')
      } else {
        // Old way: Direct client access (fallback)
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('owner_user_id', (await getAuthenticatedClient()).userId)
        
        if (error) throw error
        return { pets: data }
      }
    },
  },
}
```

---

## 🛡️ Phase 6: Security Best Practices

### 6.1 Secret Management

#### ✅ DO:
- Store secrets in environment variables (never commit)
- Use Expo EAS Secrets for mobile app
- Use Supabase Secrets for Edge Functions
- Use separate keys for development/staging/production
- Rotate secrets regularly (every 90 days minimum)
- Use `EXPO_PUBLIC_*` prefix ONLY for truly public keys
- Document which keys are safe to expose

#### ❌ DON'T:
- Hardcode secrets in source code
- Commit `.env` files to Git
- Put real secrets in `.env.example`
- Use production keys in development
- Share service role keys with clients
- Log secrets in console output

### 6.2 API Security Checklist

**Every Edge Function MUST**:
- ✅ Validate JWT token (use auth middleware)
- ✅ Implement rate limiting
- ✅ Validate and sanitize all inputs
- ✅ Use parameterized queries (prevent SQL injection)
- ✅ Return appropriate error codes
- ✅ Implement CORS properly
- ✅ Log errors (but not sensitive data)
- ✅ Handle timeouts gracefully
- ✅ Use HTTPS only

### 6.3 RLS Security Checklist

**For Every Table**:
- ✅ Enable RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- ✅ Define SELECT, INSERT, UPDATE, DELETE policies separately
- ✅ Use `auth.uid()` to restrict to current user
- ✅ Test policies with different user roles
- ✅ Never allow Anonymous access to sensitive data
- ✅ Create indexes to support policy performance
- ✅ Document policy logic

### 6.4 Input Validation

**Edge Function Example**:
```typescript
import { z } from 'https://deno.land/x/zod@v3.21.4/mod.ts'

// Define schema
const CreatePetSchema = z.object({
  name: z.string().min(1).max(100),
  species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'other']),
  breed: z.string().min(1).max(100).optional(),
  birth_date: z.string().datetime().optional(),
  weight_kg: z.number().positive().optional(),
  microchip_number: z.string().max(50).optional(),
})

// Validate in Edge Function
const body = await req.json()

try {
  const validatedData = CreatePetSchema.parse(body)
  // Proceed with validated data
} catch (error) {
  if (error instanceof z.ZodError) {
    return new Response(
      JSON.stringify({ 
        error: 'Validation failed', 
        details: error.errors 
      }),
      { status: 400, headers: corsHeaders }
    )
  }
}
```

### 6.5 Error Handling Best Practices

```typescript
// ❌ BAD: Exposes internal details
try {
  await supabase.from('pets').insert(data)
} catch (error) {
  return new Response(JSON.stringify({ error: error.message }), { status: 500 })
}

// ✅ GOOD: Safe error messages
try {
  await supabase.from('pets').insert(data)
} catch (error) {
  console.error('Database error:', error) // Log for debugging
  
  // Return safe message to client
  return new Response(
    JSON.stringify({ error: 'Failed to create pet. Please try again.' }),
    { status: 500, headers: corsHeaders }
  )
}
```

---

## 📊 Phase 7: Monitoring & Observability

### 7.1 Logging Strategy

**Edge Function Logging**:
```typescript
// Structured logging
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  function: 'api-v1-pets',
  method: req.method,
  user_id: userId,
  action: 'create_pet',
  success: true,
  duration_ms: Date.now() - startTime,
}))

// Error logging (no sensitive data!)
console.error(JSON.stringify({
  timestamp: new Date().toISOString(),
  function: 'api-v1-pets',
  method: req.method,
  user_id: userId,
  error: error.message,
  stack: error.stack?.split('\n')[0], // First line only
}))
```

### 7.2 Metrics to Track

**Performance Metrics**:
- Edge Function response time (p50, p95, p99)
- Database query duration
- API success rate (%)
- Rate limit hits

**Security Metrics**:
- Failed authentication attempts
- Rate limit violations
- Invalid token errors
- Unusual access patterns

**Business Metrics**:
- API calls per user
- Most used endpoints
- Error rates by endpoint

### 7.3 Alerting Rules

**Critical Alerts** (Immediate notification):
- Error rate > 5% for any endpoint
- Authentication failures spike > 100/min
- Database connection failures
- Service role key usage from unexpected IPs

**Warning Alerts** (Review within 24h):
- Response time p95 > 2 seconds
- Rate limit hits > 1000/hour
- Storage quota > 80%

---

## 🔒 Phase 8: Additional Security Layers

### 8.1 Content Security Policy (Web)

**File**: `app.json` or Next.js config

```json
{
  "web": {
    "meta": {
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://tcuftpjqjpmytshoaqxr.supabase.co https://*.supabase.co; connect-src 'self' https://tcuftpjqjpmytshoaqxr.supabase.co wss://tcuftpjqjpmytshoaqxr.supabase.co;",
    }
  }
}
```

### 8.2 Supabase Audit Logging

**Enable audit logs** in Supabase Dashboard:
- Settings → Database → Enable Audit Logs
- Track all service_role key usage
- Monitor RLS policy violations
- Alert on suspicious activity

### 8.3 Database Backups

```bash
# Daily automated backups (Supabase Pro+)
# Configured in Supabase Dashboard

# Manual backup
pg_dump -h db.tcuftpjqjpmytshoaqxr.supabase.co \
  -U postgres \
  -d postgres \
  -F c \
  -f backup-$(date +%Y%m%d).dump
```

---

## 📝 Summary & Action Items

### Immediate Actions (This Week) 🚨

1. **[ ] Remove hardcoded credentials from `src/lib/supabase.ts`**
2. **[ ] Update `.env.example` (remove real secrets)**
3. **[ ] Rotate ALL exposed API keys**:
   - Supabase anon key (if exposed in Git history)
   - Google OAuth client secret
   - Supabase access token
   - PostHog API key
4. **[ ] Add proper `.gitignore` entries**
5. **[ ] Verify no secrets in Git history** (`git log -p | grep -i "secret"`)

### Short-term (Next 2 Weeks)

1. **[ ] Create Edge Functions structure**
2. **[ ] Implement authentication middleware**
3. **[ ] Deploy first Edge Function (pets API)**
4. **[ ] Create `/lib/api.ts` client helper**
5. **[ ] Test Edge Functions in development**

### Medium-term (1-2 Months)

1. **[ ] Migrate all API calls to Edge Functions**
2. **[ ] Strengthen RLS policies**
3. **[ ] Implement rate limiting**
4. **[ ] Add comprehensive logging**
5. **[ ] Set up monitoring and alerts**

### Long-term (Ongoing)

1. **[ ] Regular security audits (quarterly)**
2. **[ ] Secret rotation (every 90 days)**
3. **[ ] RLS policy reviews**
4. **[ ] Performance optimization**
5. **[ ] Team security training**

---

## 📚 Additional Resources

### Documentation
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Deno Security Best Practices](https://deno.land/manual/basics/permissions)

### Tools
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Supabase Studio](https://supabase.com/dashboard)
- [Zod Validation](https://zod.dev/)

---

**This architecture provides enterprise-grade security while maintaining developer experience. The phased migration approach allows you to improve security incrementally without breaking existing functionality.**

🔐 **Security First. Performance Second. Developer Experience Third.** 🔐
