# 12 - Architecture

This section specifies the technical architecture, database design, API specifications, security, and infrastructure.

---

## Documents in This Section

### System Overview
| Document | Description |
|----------|-------------|
| [architecture-overview.md](./architecture-overview.md) | System architecture diagram |
| [tech-stack.md](./tech-stack.md) | Technology decisions |

### Database
| Document | Description |
|----------|-------------|
| [database/readme.md](./database/readme.md) | Database design principles |
| [database/complete-schema.sql](./database/complete-schema.sql) | Full DDL |
| [database/migrations.md](./database/migrations.md) | Migration strategy |
| [database/indexes.md](./database/indexes.md) | Performance indexes |

### API
| Document | Description |
|----------|-------------|
| [api-specification/overview.md](./api-specification/overview.md) | API design principles |
| [api-specification/authentication.md](./api-specification/authentication.md) | Auth endpoints |
| [api-specification/pets.md](./api-specification/pets.md) | Pet CRUD |
| [api-specification/health.md](./api-specification/health.md) | Health records |
| [api-specification/sharing.md](./api-specification/sharing.md) | Sharing APIs |

### Security
| Document | Description |
|----------|-------------|
| [security/security-overview.md](./security/security-overview.md) | Security architecture |
| [security/authentication.md](./security/authentication.md) | Auth security |
| [security/rls-policies.md](./security/rls-policies.md) | Row Level Security |
| [security/gdpr-compliance.md](./security/gdpr-compliance.md) | Privacy compliance |

### Infrastructure
| Document | Description |
|----------|-------------|
| [infrastructure/deployment.md](./infrastructure/deployment.md) | Deployment strategy |
| [infrastructure/monitoring.md](./infrastructure/monitoring.md) | Observability |
| [infrastructure/scaling.md](./infrastructure/scaling.md) | Scaling plan |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Mobile App** | React Native + Expo |
| **Web App** | React Native Web |
| **UI Framework** | Tamagui |
| **Backend** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Functions** | Supabase Edge Functions (Deno) |
| **AI** | OpenAI / Claude API |
| **OCR** | Google Cloud Vision |
| **Push** | Expo Push Notifications |
| **Analytics** | PostHog |
| **Payments** | Stripe |

---

## Database Statistics

- **Tables**: 50+
- **Relationships**: 80+
- **RLS Policies**: 100+
- **Indexes**: 60+
