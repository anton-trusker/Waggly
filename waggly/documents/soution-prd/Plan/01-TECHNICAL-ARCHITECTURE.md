# PAWZLY - TECHNICAL ARCHITECTURE

## Architecture Overview

### Design Principles

1. **Monorepo First** - Share code efficiently across web and mobile
2. **Progressive Enhancement** - Start simple, scale as needed
3. **API-First** - Clean separation between frontend and backend
4. **Type Safety** - TypeScript everywhere
5. **Performance** - Edge-first, optimized for speed
6. **Security** - Row Level Security, encrypted data
7. **Scalability** - Horizontal scaling ready

## Technology Stack

### Frontend

#### Web Application
```typescript
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript 5.3+",
  "ui": "Shadcn/ui + Radix UI",
  "styling": "TailwindCSS 3.4+",
  "state": {
    "server": "@tanstack/react-query v5",
    "client": "Zustand",
    "forms": "React Hook Form + Zod"
  },
  "animation": "Framer Motion",
  "icons": "Lucide React",
  "maps": "Mapbox GL JS",
  "charts": "Recharts"
}
```

#### Mobile Application
```typescript
{
  "framework": "Expo (React Native)",
  "language": "TypeScript",
  "ui": "Tamagui / React Native Paper",
  "styling": "NativeWind (TailwindCSS for RN)",
  "navigation": "Expo Router",
  "state": "Same as web (React Query + Zustand)",
  "maps": "react-native-maps"
}
```

### Backend

#### Database & Auth
```typescript
{
  "database": "Supabase (PostgreSQL 15+)",
  "auth": "Supabase Auth (JWT-based)",
  "storage": "Supabase Storage",
  "realtime": "Supabase Realtime (WebSockets)",
  "functions": "Supabase Edge Functions (Deno)",
  "orm": "Supabase JS Client (auto-generated types)"
}
```

#### APIs & Services
```typescript
{
  "payments": "Stripe",
  "maps": "Mapbox API",
  "places": "Google Places API (cached)",
  "email": "Resend",
  "sms": "Twilio",
  "translation": "DeepL API",
  "ai": {
    "imageRecognition": "TensorFlow.js",
    "ocr": "Tesseract.js",
    "moderation": "OpenAI Moderation API",
    "embeddings": "OpenAI Embeddings (text-embedding-3-small)"
  }
}
```

### Infrastructure

#### Hosting & Deployment
```typescript
{
  "web": "Vercel (Edge Network)",
  "mobile": "Expo EAS (Build & Submit)",
  "cdn": "Cloudflare",
  "dns": "Cloudflare",
  "ci_cd": "GitHub Actions"
}
```

#### Monitoring & Analytics
```typescript
{
  "errors": "Sentry",
  "analytics": "PostHog",
  "webVitals": "Vercel Analytics",
  "logs": "Supabase Logs",
  "sessionReplay": "LogRocket (optional)"
}
```

## Monorepo Structure

```
pawzly/
├── apps/
│   ├── web/                    # Next.js 14 - User Platform
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── pets/
│   │   │   │   ├── services/
│   │   │   │   ├── bookings/
│   │   │   │   ├── help-requests/
│   │   │   │   └── messages/
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── about/
│   │   │   │   └── contact/
│   │   │   └── api/
│   │   │       ├── webhooks/
│   │   │       └── og/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── middleware.ts
│   │   ├── next.config.js
│   │   └── package.json
│   │
│   ├── admin/                  # Next.js 14 - Admin Panel (Refine.dev)
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── cases/
│   │   │   ├── services/
│   │   │   ├── bookings/
│   │   │   └── analytics/
│   │   └── package.json
│   │
│   ├── mobile/                 # Expo React Native
│   │   ├── app/
│   │   │   ├── (tabs)/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── pets.tsx
│   │   │   │   ├── services.tsx
│   │   │   │   ├── messages.tsx
│   │   │   │   └── profile.tsx
│   │   │   ├── (auth)/
│   │   │   └── _layout.tsx
│   │   ├── components/
│   │   ├── app.json
│   │   ├── eas.json
│   │   └── package.json
│   │
│   └── landing/                # Next.js 14 - Marketing Site
│       ├── app/
│       └── package.json
│
├── packages/
│   ├── ui/                     # Shared UI Components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/         # Shadcn base components
│   │   │   │   └── custom/     # Pawzly-specific components
│   │   │   ├── hooks/
│   │   │   └── lib/
│   │   └── package.json
│   │
│   ├── database/               # Supabase Client & Types
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── types.ts
│   │   │   └── migrations/
│   │   └── package.json
│   │
│   ├── api/                    # API Client & Hooks
│   │   ├── src/
│   │   │   ├── hooks/
│   │   │   │   ├── usePets.ts
│   │   │   │   ├── useServices.ts
│   │   │   │   ├── useBookings.ts
│   │   │   │   └── useHelpRequests.ts
│   │   │   ├── queries/
│   │   │   └── mutations/
│   │   └── package.json
│   │
│   ├── auth/                   # Auth Utilities
│   │   ├── src/
│   │   │   ├── provider.tsx
│   │   │   ├── hooks.ts
│   │   │   └── utils.ts
│   │   └── package.json
│   │
│   ├── i18n/                   # Internationalization
│   │   ├── locales/
│   │   │   ├── en-GB.json
│   │   │   ├── de-DE.json
│   │   │   ├── fr-FR.json
│   │   │   ├── es-ES.json
│   │   │   └── it-IT.json
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── payments/               # Stripe Integration
│   │   ├── src/
│   │   │   ├── stripe.ts
│   │   │   ├── webhooks.ts
│   │   │   └── types.ts
│   │   └── package.json
│   │
│   ├── notifications/          # Push/Email Notifications
│   │   ├── src/
│   │   │   ├── push.ts
│   │   │   ├── email.ts
│   │   │   └── templates/
│   │   └── package.json
│   │
│   ├── utils/                  # Shared Utilities
│   │   ├── src/
│   │   │   ├── date.ts
│   │   │   ├── currency.ts
│   │   │   ├── validation.ts
│   │   │   └── format.ts
│   │   └── package.json
│   │
│   └── config/                 # Shared Configs
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── services/
│   └── supabase/
│       └── functions/
│           ├── payment-webhook/
│           ├── send-notification/
│           ├── process-image/
│           ├── vaccination-reminders/
│           └── moderate-content/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-web.yml
│       ├── deploy-mobile.yml
│       └── test.yml
│
├── package.json
├── turbo.json
├── pnpm-workspace.yaml
└── README.md
```

## Database Architecture

### Core Principles

1. **Single Database** - PostgreSQL with multi-tenancy
2. **Row Level Security (RLS)** - Supabase policies for data access
3. **Partitioning** - By country for performance
4. **Soft Deletes** - `deleted_at` timestamp
5. **Audit Trails** - `created_at`, `updated_at`, `created_by`
6. **JSONB** - For flexible metadata and translations

### Key Tables

```sql
-- Core tables (Phase 0-1)
profiles                    -- User profiles (extends auth.users)
pets                        -- Pet profiles
pet_health_records          -- Digital passport entries
pet_documents               -- Attached files

-- Marketplace (Phase 2)
services                    -- Service offerings
service_availability        -- Provider schedules
bookings                    -- Service bookings
reviews                     -- Service reviews

-- Help Requests (Phase 3)
help_requests               -- Fundraising cases
donations                   -- Individual donations
case_updates                -- Case progress updates
case_comments               -- Public comments

-- Organizations (Phase 4)
organizations               -- Businesses, shelters, clinics
organization_locations      -- Physical locations
organization_members        -- Team members
adoption_listings           -- Shelter adoptions

-- Social (Phase 5)
pet_posts                   -- Social feed posts
pet_places                  -- Pet-friendly locations
messages                    -- Direct messaging
conversations               -- Message threads
```

### Database Indexes Strategy

```sql
-- Performance-critical indexes
CREATE INDEX idx_pets_owner ON pets(owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_services_location ON services(latitude, longitude) WHERE status = 'active';
CREATE INDEX idx_bookings_date ON bookings(booking_date, status);
CREATE INDEX idx_help_requests_status ON help_requests(status, urgency, published_at DESC);

-- Full-text search
CREATE INDEX idx_services_search ON services USING GIN (search_vector);
CREATE INDEX idx_help_requests_search ON help_requests USING GIN (search_vector);

-- Spatial indexes for maps
CREATE INDEX idx_services_coords ON services USING GIST (ll_to_earth(latitude, longitude));
CREATE INDEX idx_pet_places_coords ON pet_places USING GIST (ll_to_earth(latitude, longitude));
```

## API Architecture

### RESTful Endpoints (Supabase Auto-Generated)

```typescript
// Supabase provides REST API automatically
GET    /rest/v1/pets
POST   /rest/v1/pets
PATCH  /rest/v1/pets?id=eq.{id}
DELETE /rest/v1/pets?id=eq.{id}

// With RLS policies enforced
// With automatic OpenAPI documentation
```

### Edge Functions (Custom Logic)

```typescript
// services/supabase/functions/payment-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.0.0';

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
  const signature = req.headers.get('stripe-signature')!;
  
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    signature,
    Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  );
  
  // Handle payment events
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update booking status
      break;
    case 'payment_intent.payment_failed':
      // Handle failure
      break;
  }
  
  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

## Authentication & Authorization

### Authentication Flow

```typescript
// Supabase Auth with multiple providers
const authProviders = {
  email: 'Email + Password',
  google: 'Google OAuth',
  apple: 'Apple Sign In',
  facebook: 'Facebook Login',
};

// MFA support
const mfaOptions = {
  sms: 'SMS OTP',
  totp: 'Authenticator App',
};
```

### Authorization (RLS Policies)

```sql
-- Example: Users can only view their own pets
CREATE POLICY "Users can view own pets"
  ON pets FOR SELECT
  USING (owner_id = auth.uid());

-- Example: Service providers can view their bookings
CREATE POLICY "Providers can view their bookings"
  ON bookings FOR SELECT
  USING (provider_id = auth.uid());

-- Example: Admins can view everything
CREATE POLICY "Admins can view all"
  ON pets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND 'admin' = ANY(roles)
    )
  );
```

## Caching Strategy

### Multi-Layer Caching

```typescript
// 1. Browser Cache (Service Worker)
// - Static assets: 1 year
// - API responses: 5 minutes
// - Images: 24 hours

// 2. CDN Cache (Cloudflare)
// - Static pages: 1 hour
// - API responses: 1 minute
// - Images: 1 week

// 3. Edge Cache (Vercel)
// - ISR pages: 60 seconds
// - API routes: Custom per endpoint

// 4. Database Cache (Supabase)
// - Connection pooling
// - Query result caching
```

### Cache Invalidation

```typescript
// React Query cache invalidation
queryClient.invalidateQueries({ queryKey: ['pets'] });

// Supabase Realtime for live updates
supabase
  .channel('pets')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'pets',
  }, (payload) => {
    queryClient.invalidateQueries({ queryKey: ['pets'] });
  })
  .subscribe();
```

## Security Architecture

### Security Layers

1. **Network Security**
   - TLS 1.3 encryption
   - DDoS protection (Cloudflare)
   - Rate limiting (Vercel)

2. **Application Security**
   - JWT authentication
   - Row Level Security (RLS)
   - Input validation (Zod)
   - XSS protection
   - CSRF tokens

3. **Data Security**
   - Encrypted at rest (Supabase)
   - Encrypted in transit (TLS)
   - PII masking in logs
   - Secure file uploads

4. **Payment Security**
   - PCI DSS compliant (Stripe)
   - Tokenized payments
   - 3D Secure support
   - Fraud detection

### Security Checklist

- [ ] HTTPS everywhere
- [ ] Secure headers (CSP, HSTS, X-Frame-Options)
- [ ] Input sanitization
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React auto-escaping)
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Secrets management (environment variables)
- [ ] Regular security audits
- [ ] Dependency scanning (Dependabot)

## Performance Optimization

### Frontend Performance

```typescript
// 1. Code Splitting
const MapView = dynamic(() => import('./MapView'), { ssr: false });

// 2. Image Optimization
<Image
  src={pet.photo}
  alt={pet.name}
  width={400}
  height={400}
  placeholder="blur"
  loading="lazy"
/>

// 3. Prefetching
<Link href="/services" prefetch>Services</Link>

// 4. Bundle Optimization
// - Tree shaking
// - Minification
// - Compression (Brotli)
```

### Backend Performance

```sql
-- 1. Database Indexes
CREATE INDEX idx_bookings_date ON bookings(booking_date);

-- 2. Query Optimization
EXPLAIN ANALYZE
SELECT * FROM services
WHERE status = 'active'
AND latitude BETWEEN 52.0 AND 53.0
LIMIT 20;

-- 3. Connection Pooling
-- Supabase handles automatically

-- 4. Caching
-- React Query + Supabase Realtime
```

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | <1.5s | Lighthouse |
| Time to Interactive | <3.5s | Lighthouse |
| Largest Contentful Paint | <2.5s | Lighthouse |
| Cumulative Layout Shift | <0.1 | Lighthouse |
| API Response Time | <200ms | Vercel Analytics |
| Database Query Time | <50ms | Supabase Logs |

## Scalability Strategy

### Horizontal Scaling

```typescript
// 1. Stateless Architecture
// - No server-side sessions
// - JWT tokens for auth
// - Vercel Edge Functions

// 2. Database Scaling
// - Read replicas (Supabase)
// - Connection pooling
// - Query optimization

// 3. CDN Scaling
// - Cloudflare global network
// - Edge caching
// - Image optimization

// 4. Async Processing
// - Supabase Edge Functions
// - Background jobs
// - Queue system (future)
```

### Vertical Scaling

```typescript
// Supabase scaling tiers
const scalingPath = {
  free: '500MB, 2GB bandwidth',
  pro: '8GB, 50GB bandwidth',
  team: '32GB, 250GB bandwidth',
  enterprise: 'Custom',
};
```

## Deployment Strategy

### Environments

```typescript
const environments = {
  development: {
    url: 'http://localhost:3000',
    database: 'Supabase Local (Docker)',
    payments: 'Stripe Test Mode',
  },
  staging: {
    url: 'https://staging.pawzly.com',
    database: 'Supabase Staging',
    payments: 'Stripe Test Mode',
  },
  production: {
    url: 'https://pawzly.com',
    database: 'Supabase Production',
    payments: 'Stripe Live Mode',
  },
};
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
      - run: pnpm lint
      - run: pnpm type-check

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-mobile:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v8
      - run: cd apps/mobile && eas build --platform all
```

## Disaster Recovery

### Backup Strategy

```typescript
// 1. Database Backups
// - Supabase automatic daily backups
// - Point-in-time recovery (7 days)
// - Manual backups before major changes

// 2. File Storage Backups
// - Supabase Storage automatic replication
// - S3 backup (optional)

// 3. Code Backups
// - Git repository (GitHub)
// - Multiple branches
// - Tagged releases
```

### Recovery Plan

```typescript
// RTO (Recovery Time Objective): 1 hour
// RPO (Recovery Point Objective): 1 hour

const recoverySteps = [
  '1. Identify issue',
  '2. Switch to backup database',
  '3. Restore from latest backup',
  '4. Verify data integrity',
  '5. Resume operations',
  '6. Post-mortem analysis',
];
```

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Next Review**: After Phase 0 Completion
