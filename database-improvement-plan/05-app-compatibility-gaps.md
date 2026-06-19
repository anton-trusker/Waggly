# 05 - App Compatibility Gaps

The current app is valuable because it shows what the UI already expects. It also exposes schema drift that must be cleaned before production.

## Tables Queried Today

High-use tables from the app:

- `vaccinations`
- `medications`
- `pets`
- `medical_visits`
- `conditions`
- `allergies`
- `emergency_contacts`
- `profiles`
- `veterinarians`
- `pet_share_tokens`
- `notifications`
- `co_owners`
- `treatments`
- `activity_logs`
- `events`
- `weight_logs`
- `weight_entries`
- `body_condition_scores`
- `weight_history`
- `share_links`
- `health_scores`
- `health_metrics`
- `documents`

## Drift To Fix

### 1. `user_id` vs `owner_id`

Docs and older generated types use `pets.user_id`. Some newer hooks use `owner_id`. Canonical decision: use `pets.user_id`; refactor hooks that query `owner_id`.

### 2. Weight tables

Current code references all of these:

- `weight_logs`
- `weight_entries`
- `weight_history`

Canonical decision: use `weight_logs`. Add temporary compatibility views only if needed:

- `weight_entries` view over `weight_logs`
- `weight_history` view over `weight_logs`

### 3. Sharing tables

Current code references:

- `public_shares`
- `share_links`
- `pet_share_tokens`

Canonical decision: use `public_shares` + `share_access_logs`. Keep `share_links`/`pet_share_tokens` as temporary compatibility views or migrate code immediately.

### 4. Storage bucket names

Current code references:

- `pet-photos`
- `user-photos`
- `avatars`
- `pet-documents`

Canonical decision: keep these bucket names. Avoid adding duplicate `pet_photos` bucket unless needed for legacy code.

### 5. Health score RPC

Current app calls:

- `calculate_health_score(p_pet_id)`
- `get_public_pet_details(share_token)`

Canonical decision:

- Keep both RPCs for compatibility.
- Internally calculate score using weighted spec: preventive care 30%, vaccination 25%, weight 20%, data completeness 15%, recent wellness 10%.
- Store each run in `health_scores`.

## Before Table Creation

Do these first:

1. Decide whether to migrate app hooks now or provide compatibility views.
2. Freeze canonical table names.
3. Create the canonical migration folder.
4. Review RLS policy template once.
5. Only then apply to Supabase.
