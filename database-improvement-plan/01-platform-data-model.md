# 01 - Platform Data Model

## Product Scope

Waggli is a pet passport and all-in-one pet platform. The database must support:

- Pet profiles and digital passport identity
- Health records: visits, vaccines, medications, treatments, allergies, conditions, metrics
- Documents, OCR, attachments, and professional sharing
- Calendar, reminders, notifications, and care schedules
- Co-owner collaboration and public share links
- AI assistant, OCR extraction, health recommendations, predictions
- Provider ecosystem: veterinarians, groomers, walkers, sitters, boarding, insurance
- Billing, subscriptions, quotas, provider plans, affiliate tracking
- Admin operations, audit logs, feature flags, localization
- Later social/community features without polluting the MVP schema

## Canonical Domains

| Domain | Purpose | MVP Priority |
|---|---|---|
| Identity & Auth | Profiles, roles, preferences, sessions | P0 |
| Pet Core | Pets, photos, behavior, lifestyle, genetics, emergency contacts | P0 |
| Health | Visits, vaccines, medications, treatments, allergies, conditions, metrics, dental, wellness | P0 |
| Passport | Passport snapshot, health score history, travel readiness, compliance | P0 |
| Documents | Storage metadata, OCR jobs, document links | P0 |
| Calendar & Notifications | Events, recurrence, reminders, notifications | P0 |
| Sharing | Co-owners, public shares, professional access, audit | P0 |
| Reference Data | Breeds, vaccines, medications, allergens, species, providers categories | P0 |
| Providers | Provider profiles, services, verification, booking | P1 |
| AI | Conversations, extracted facts, recommendations, cost tracking | P1 |
| Monetization | Plans, subscriptions, entitlements, usage quotas, invoices | P1 |
| Admin & Ops | Audit logs, feature flags, content, localization | P1 |
| Social | Posts, groups, stories, events, moderation | P2 |

## Ownership Rule

Use one owner column only:

- `pets.user_id` is the pet owner.
- Pet-scoped child records use `pet_id` only.
- RLS checks ownership through `exists(select 1 from pets where pets.id = child.pet_id and pets.user_id = auth.uid())`.
- Co-owner access is checked through `co_owners`/`pet_memberships`.

Do not add `owner_id` to every child table. That creates drift, stale permissions, and update anomalies.

## Compatibility Decision

Current app code contains both older and newer assumptions. The canonical schema should be clean, then compatibility views or short-term aliases should bridge the current app during migration.

Examples:

- Keep canonical `weight_logs.recorded_date`; expose a temporary `date` column or view if the app still sorts by `date`.
- Use `pets.user_id` as canonical; refactor hooks that query `owner_id`.
- Standardize public sharing around `public_shares`; retire duplicate `share_links` and `pet_share_tokens` after UI migration.
