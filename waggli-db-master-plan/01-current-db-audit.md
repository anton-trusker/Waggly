# 01 - Current DB Audit

## What I Could Inspect Locally

Supabase MCP tools are not exposed inside this Codex turn, so this audit is based on local project artifacts:

- `types/db.ts` generated DB snapshot.
- `supabase/migrations/` migration history.
- `supabase/canonical-schema/` existing blueprint work.
- App code querying Supabase.
- Documentation in `documentation/spec/` and `documentation/spec/db-refactor/`.

If the MCP tools become visible, the next step is to compare this plan against the live schema using `information_schema`, `pg_indexes`, `pg_policies`, and Supabase advisors.

## Current App Usage

The app currently references these data tables most often:

| Table | Usage Count | Notes |
|---|---:|---|
| `vaccinations` | 20 | Core health/passport feature. |
| `medications` | 19 | Medication tracking and reminders. |
| `pets` | 13 | Core identity root. |
| `medical_visits` | 12 | Vet visit history. |
| `conditions` | 12 | Health conditions. |
| `allergies` | 12 | Allergy tracking. |
| `emergency_contacts` | 11 | Passport/emergency feature. |
| `profiles` | 8 | User profile/onboarding. |
| `veterinarians` | 7 | Provider/vet data; should evolve toward providers. |
| `pet_share_tokens` | 7 | Legacy sharing. Retire into `public_shares`. |
| `notifications` | 7 | In-app/reminder delivery. |
| `co_owners` | 7 | Collaboration. |
| `treatments` | 6 | Broader care/treatment tasks. |
| `activity_logs` | 6 | Timeline/activity. |
| `events` | 5 | Calendar. |
| `weight_logs` | 4 | Canonical target for weight. |
| `weight_entries` | 4 | Legacy/alternate. Replace or view over `weight_logs`. |
| `body_condition_scores` | 4 | BCS history. |
| `weight_history` | 3 | Legacy/alternate. Replace or view over `weight_logs`. |
| `share_links` | 3 | Legacy/alternate. Replace or view over `public_shares`. |
| `health_scores` | 3 | Score snapshots. |
| `health_metrics` | 3 | Vitals/physical metrics. |
| `documents` | 3 | File metadata. |
| `health_risks` | 2 | AI/breed risk/prediction. |
| `health_recommendations` | 2 | Advice/recommendations. |
| `behavior_tags` | 2 | Behavior profile. |
| `reference_vaccinations` | 1 | Reference dropdowns. |
| `pet_photos` | 1 | Gallery metadata. |

RPCs currently referenced:

- `calculate_health_score(p_pet_id)`
- `get_public_pet_details(share_token)`

Storage buckets currently referenced:

- `avatars`
- `pet-photos`
- `user-photos`

The app also has string references to bucket-like names through table scans, such as `pet-documents`, but direct storage usage locally is mostly photos/avatars.

## Generated DB Snapshot

`types/db.ts` exposes these tables:

- `activity_logs`, `allergies`, `audit_logs`, `behavior_tags`, `breeds`, `care_notes`, `co_owners`, `conditions`, `content`, `documents`, `events`, `food`, `health_metrics`, `mail_queue`, `medical_history`, `medical_visits`, `medications`, `notifications`, `pet_photos`, `pets`, `profiles`, `public_shares`, `ref_allergens`, `ref_medications`, `ref_symptoms`, `ref_vaccines`, `reference_breeds`, `reference_treatments`, `reference_vaccinations`, `roles`, `settings`, `shared_links`, `translations`, `treatments`, `user_sessions`, `users`, `vaccinations`, `veterinarians`, `weight_entries`.

Missing from generated snapshot but referenced/planned:

- `weight_logs`
- `weight_history`
- `body_condition_scores`
- `emergency_contacts`
- `health_scores`
- `health_risks`
- `health_recommendations`
- `pet_behavior`
- `pet_lifestyle`
- `pet_genetics`
- `events` needs recurrence support
- provider ecosystem tables
- monetization tables
- AI/OCR tables
- richer glossary tables

## Main Problems To Fix

### 1. Ownership Drift

The docs and older DB types use `pets.user_id`; some newer code uses `owner_id`. The db-refactor docs warn that repeated owner columns violate normalization.

Decision:

- `pets.user_id` is the only primary ownership root.
- Pet-scoped child rows use `pet_id` only.
- RLS derives access through `pets` and `co_owners`.

### 2. Duplicate Table Concepts

Current duplicate concepts:

- `weight_logs`, `weight_entries`, `weight_history`
- `public_shares`, `share_links`, `shared_links`, `pet_share_tokens`
- `breeds`, `reference_breeds`, dog/cat breed CSVs
- `veterinarians` vs future generic `providers`

Decision:

- Keep one canonical table per concept.
- Provide temporary compatibility views during migration.

### 3. Old Migration Chain Is Not Safe

There are nearly 100 SQL migration files with old generations, diagnostics, seed files, and v2/schema experiments. Applying all of them to a clean project would reproduce drift.

Decision:

- Archive old migration history.
- Build new project from a clean canonical migration set.

### 4. Reference Data Is Underpowered

Waggli needs more than simple dropdowns. It needs multilingual, country-aware, species-aware reference data for:

- Breeds.
- Vaccines and country schedules.
- Medications and dosing warnings.
- Symptoms and triage categories.
- Allergens.
- Countries and travel rules.
- Providers/categories/services.
- Translation glossary and content keys.

Decision:

- Create a real reference/glossary subsystem.
