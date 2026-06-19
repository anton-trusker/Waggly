# 06 - Migration and Validation Plan

## Important Constraint

Do not create tables from the old migration chain. It contains conflicting generations and naming drift.

Build a clean canonical migration set, then apply to the new Supabase project.

## Recommended Migration Files

```text
supabase/canonical-schema/
  001_extensions.sql
  010_identity.sql
  020_i18n_glossary.sql
  030_reference_core.sql
  040_reference_health.sql
  050_reference_breeds.sql
  060_pets.sql
  070_sharing.sql
  080_documents_ocr.sql
  090_health.sql
  100_passport_travel.sql
  110_calendar_notifications.sql
  120_providers.sql
  130_ai.sql
  140_monetization.sql
  150_admin_ops.sql
  800_views.sql
  810_materialized_views.sql
  900_rls_helpers.sql
  910_rls_policies.sql
  920_functions_triggers.sql
  930_storage.sql
  940_seed_reference.sql
  950_compatibility_views.sql
```

## Implementation Order

### Phase 1 - Foundation

- Extensions.
- Helper functions.
- Profiles, devices, roles, consents.
- Languages, countries, currencies.
- Translation/glossary foundation.

### Phase 2 - Reference Data

- Species.
- Breeds.
- Vaccines.
- Vaccine schedules.
- Medications.
- Treatments.
- Allergens.
- Symptoms.
- Conditions.
- Provider categories/services.
- Travel requirement references.

### Phase 3 - Pet and Health Core

- Pets.
- Pet photos.
- Behavior/lifestyle/genetics.
- Emergency contacts.
- Health tables.
- Health score table.

### Phase 4 - Documents, Sharing, Passport

- Documents.
- OCR jobs/extracted fields.
- Public shares.
- Co-owners.
- Professional access grants.
- Passport tables.
- Travel plans/checks.

### Phase 5 - Calendar, AI, Providers, Billing

- Events/reminders/notifications.
- AI conversations/extractions/usage.
- Providers/services/bookings/messages.
- Plans/subscriptions/entitlements/usage counters.

### Phase 6 - Views, RLS, Storage, Seeds

- Views/materialized views.
- RLS helper functions.
- RLS policies.
- Storage buckets/policies.
- Seed data.
- Compatibility views.

## Compatibility Strategy

If app refactor cannot happen immediately, create temporary compatibility views:

```sql
create view weight_entries as select * from weight_logs;
create view weight_history as select * from weight_logs;
```

Sharing compatibility is trickier because token semantics differ. Prefer refactoring app code to `public_shares`; otherwise create compatibility views only for read operations.

## App Refactor Sequence

1. Generate new `types/db.ts` from Supabase.
2. Update services/hooks to use canonical tables.
3. Replace `owner_id` queries with `user_id`/RLS-derived access.
4. Replace `weight_entries` and `weight_history` with `weight_logs`.
5. Replace `pet_share_tokens`, `share_links`, `shared_links` with `public_shares` flow.
6. Replace `veterinarians` with `providers` or add a compatibility view.
7. Add tests for golden paths.

## Supabase Validation Queries

When MCP is available, run:

```sql
-- Tables
select table_schema, table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;

-- Columns
select table_name, column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;

-- Foreign keys without indexes
-- Check pg_constraint against pg_index for every conkey.

-- RLS enabled status
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;

-- Policies
select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- Indexes
select schemaname, tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
order by tablename, indexname;
```

## Performance Validation

Run explain analyze for:

- Fetch dashboard pets.
- Fetch passport summary.
- Fetch health timeline.
- Fetch upcoming care.
- Search breeds by prefix/similarity.
- Search documents/OCR text.
- Validate public share token.
- Fetch provider directory by location/category.

Targets:

- Dashboard summary under 150ms server time for normal accounts.
- Passport summary under 200ms.
- Reference autocomplete under 50ms.
- Public share lookup under 100ms.

## Quality Gates Before Production

- Supabase advisors: no critical security errors.
- Every exposed table has RLS.
- Every FK has index.
- No duplicate redundant ownership columns on pet child tables.
- No duplicate canonical tables for the same concept.
- Storage buckets have correct public/private policy.
- Health score calculation returns explainable component values.
- Reference data seeded for launch countries and species.
- Translation keys exist for all visible app text.
- Golden-path app tests pass.

## Seed Data Priorities

P0 seeds:

- languages
- countries
- currencies
- species
- dog breeds
- cat breeds
- core dog/cat vaccines
- common medications
- common allergens
- common symptoms
- default roles
- default plans/entitlements
- translation namespaces and first keys

P1 seeds:

- travel requirements by launch countries.
- provider service categories.
- breed health risks.
- medication warnings/interactions.
- dental/BCS glossary.

## Rollback Strategy

For clean new project:

- Keep migrations small and ordered.
- Apply to staging first.
- Snapshot generated types.
- If early migration fails, reset public schema before production data exists.
- Once real users exist, use additive migrations only; no destructive drops without data migration plan.
