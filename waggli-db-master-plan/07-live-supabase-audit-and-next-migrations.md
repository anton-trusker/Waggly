# Live Supabase Audit and Next Migration Plan

Audit date: 2026-06-19  
Project ref: `fbeldieclcltyuqvomjx`  
Product name: Waggli

## Current Live State

The connected Supabase project has these migrations applied:

1. `20260619003438_waggli_baseline_tables`
2. `20260619003533_waggli_foreign_keys`
3. `20260619003647_waggli_rls_policies`
4. `20260619003754_waggli_triggers_storage_rpcs`
5. `20260619010314_reset_public_schema`
6. `20260619010502_01_foundation_users_pets`

After the reset, the live public schema currently contains only the foundation user/pet domain:

- `profiles`
- `roles`
- `user_roles`
- `pets`
- `pet_photos`
- `pet_behavior`
- `pet_lifestyle`
- `pet_genetics`
- `behavior_tags`
- `care_notes`
- `food`
- `emergency_contacts`

There are no app-facing views yet and no business RPCs yet, except extension functions and `set_updated_at`.

## Critical Security Finding

All 12 current public tables have RLS disabled. Supabase warns that public-schema tables exposed through the Data API must have RLS enabled before the app is treated as safe for real users.

Affected tables:

- `profiles`
- `roles`
- `user_roles`
- `pets`
- `pet_photos`
- `pet_behavior`
- `pet_lifestyle`
- `pet_genetics`
- `behavior_tags`
- `care_notes`
- `food`
- `emergency_contacts`

There is also one function warning:

- `public.set_updated_at` does not set `search_path`.

The draft fix is in:

- `supabase/waggli-master-schema/910_rls_policies.sql`

Do not only run `alter table ... enable row level security`; that would secure the tables but also break the current app until policies are present.

## Performance Findings

Supabase reported missing foreign-key covering indexes for:

- `care_notes.pet_id`
- `pet_genetics.pet_id`
- `pet_photos.user_id`

These should be added before production data grows.

The advisor also reported several unused indexes. Because this database is empty, those are not meaningful yet and should not be removed.

## App Compatibility Gaps

The app currently calls these tables/views/RPCs that do not exist in the live schema yet:

- `vaccinations`
- `medications`
- `medical_visits`
- `conditions`
- `allergies`
- `activity_logs`
- `co_owners`
- `veterinarians`
- `documents`
- `health_metrics`
- `health_scores`
- `health_risks`
- `health_recommendations`
- `body_condition_scores`
- `weight_logs`
- `weight_entries`
- `weight_history`
- `treatments`
- `events`
- `notifications`
- `pet_share_tokens`
- `share_links`
- `view_vaccination_status`
- `view_medication_tracker`
- `get_public_pet_details`
- `calculate_health_score`

The draft table completion layer is in:

- `supabase/waggli-master-schema/040_app_compatibility_health_passport.sql`

## Recommended Migration Order

1. Add app-compatible health/passport tables:
   - Apply `040_app_compatibility_health_passport.sql`.
   - Keep compatibility aliases for the current code (`date_given`, `administered_at`, `next_due_date`, `next_due_at`, `recorded_date`, `recorded_at`, etc.).

2. Fix security immediately after the table layer:
   - Replace `set_updated_at` with the `search_path`-safe version.
   - Add the missing FK indexes Supabase flagged.
   - Create pet access helper functions.
   - Enable RLS and policies for current and new tables.
   - Prefer applying steps 1 and 2 in the same reviewed release.

3. Add reference and glossary data:
   - `languages`, `countries`, `currencies`
   - `translation_namespaces`, `translation_keys`, `translations`
   - `glossary_terms`, `glossary_translations`
   - `species`, `breeds`, `breed_translations`
   - `ref_vaccines`, `vaccine_schedules`
   - `ref_medications`, `ref_allergens`, `ref_symptoms`, `ref_conditions`

4. Add views with `security_invoker = true`:
   - `v_pet_dashboard_summary`
   - `v_pet_health_timeline`
   - `v_upcoming_care`
   - `view_vaccination_status`
   - `view_medication_tracker`

5. Add RPCs:
   - `calculate_health_score(p_pet_id uuid)`
   - `get_public_pet_details(share_token text)`
   - Later replace plaintext share tokens with hashed-token public access.
   - Draft file: `supabase/waggli-master-schema/920_rpcs_and_compatibility.sql`

6. Add storage buckets and policies:
   - `avatars`
   - `user-photos`
   - `pet-photos`
   - `pet-documents`
   - Draft file: `supabase/waggli-master-schema/930_storage.sql`
   - `pet-documents` should be private; the app should move from public URLs to signed URLs for document access.

7. Regenerate TypeScript DB types and align app hooks:
   - Remove duplicate concepts gradually: `weight_entries`/`weight_history` -> `weight_logs`; `share_links`/`pet_share_tokens` -> `public_shares`; `treatments` -> `medications` where possible.

## Go / No-Go

Do not onboard real users until:

- RLS advisor errors are gone.
- App-critical tables exist.
- Public share token flow is reviewed.
- Storage policies are present.
- TypeScript DB types match the live database.
