# 04 - Technical Roadmap

## Phase 0 - Freeze Decisions Before More Building

Duration: 2-4 days.

Decisions:

- Product name: Waggli.
- Domain strategy: keep `waggli.app` or migrate later.
- Canonical DB ownership: `pets.user_id`.
- Canonical sharing model: `public_shares`.
- Canonical weight model: `weight_logs`.
- Supabase project: new Waggli project only.
- Old migrations: archived, not applied.

Deliverables:

- Final canonical schema SQL.
- RLS policy matrix.
- Storage bucket policy matrix.
- Generated TypeScript types from new schema.
- App data-access migration checklist.

## Phase 1 - Database Foundation

Duration: 1 week.

Build:

- Extensions and helper functions.
- Profiles, roles, consents.
- Reference data.
- Pets and pet extension tables.
- Co-owner/public sharing tables.
- Documents and OCR tables.
- Core health tables.
- RLS and indexes.

Validation:

- Supabase advisors show no critical errors.
- Every exposed table has RLS.
- Every FK has index.
- Storage buckets are private/public correctly.

## Phase 2 - App Data Layer Repair

Duration: 1-2 weeks.

Build:

- Replace scattered direct Supabase calls with domain services.
- Regenerate `types/db.ts` from the new project.
- Refactor hooks from `owner_id` to `user_id`.
- Refactor weight hooks to `weight_logs`.
- Refactor sharing hooks to `public_shares`.
- Remove or isolate `as any` around database calls.

Validation:

- Golden path works: signup, profile, create pet, upload photo, add vaccine, add visit, add medication, record weight, share passport.
- Tests cover health, passport, documents, sharing.

## Phase 3 - Passport MVP Polish

Duration: 1-2 weeks.

Build:

- Passport summary read model.
- Health score RPC.
- Passport QR share flow.
- Offline cache for latest passport.
- Passport activity/version history.

Validation:

- Passport screen loads under poor network after cache.
- QR link expires and respects scope.
- Health score explains why the score changed.

## Phase 4 - Documents + OCR MVP

Duration: 1-2 weeks.

Build:

- Document metadata table and bucket policies.
- OCR job lifecycle.
- Extracted fields review UI.
- Link documents to health records.

Validation:

- Upload vaccine document.
- Extract draft fields.
- Confirm and create vaccination record.
- Link certificate to vaccination.

## Phase 5 - Calendar + Reminders

Duration: 1 week.

Build:

- Canonical events and reminders.
- Generated reminders from vaccines and medications.
- Notification delivery records.
- Snooze/complete actions.

Validation:

- Vaccine due date creates reminder.
- Medication schedule creates recurring reminders.
- Co-owner notification works.

## Phase 6 - Monetization Readiness

Duration: 1 week.

Build:

- Plans, subscriptions, entitlements, usage counters.
- UI guards by entitlement.
- Stripe webhook skeleton.

Validation:

- Free plan limits are enforced.
- Premium unlocks are immediate after webhook update.

## Phase 7 - Provider Foundation

Duration: 2-3 weeks.

Build:

- Provider onboarding.
- Provider profile/services/verification.
- Professional access grants.
- Provider directory.

Validation:

- Vet can be granted scoped access.
- Provider access is logged.
- Owner can revoke access.

## Phase 8 - AI Assistant

Duration: 2-4 weeks.

Build:

- AI conversation storage.
- OCR/NLP extraction confirmation flow.
- Safe health assistant boundaries.
- Cost tracking.

Validation:

- AI drafts records but does not silently create sensitive records.
- User corrections are stored.
- Costs are visible per feature.

## Phase 9 - Admin + Operations

Duration: 2 weeks.

Build:

- Admin roles.
- User/pet/provider support tools.
- Feature flags.
- Translation/content management.
- Audit dashboards.

## Phase 10 - Social Later

Build only after health/passport retention is proven.

Start with:

- Lost pet alerts.
- Local events.
- Lightweight groups.

Avoid building a full feed until core care workflows are excellent.
