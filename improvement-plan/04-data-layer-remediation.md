# 04 — Data Layer Remediation (the #1 priority)

This is the foundational work. Everything else is built on it.

## The problem, precisely

| Source of truth candidate | `pets` owner column | Tables | Trustworthy? |
|---------------------------|---------------------|-------:|--------------|
| Legacy migration chain (`supabase/migrations/*.sql`) | `user_id` | ~all | No — contradicts the v2 code |
| `supabase/migrations/v2/` rewrite | `owner_id` | 16 | No — missing ~14 tables the app queries; `0008` has a broken trigger fn |
| `types/db.ts` (generated) | `user_id` | 39 | **Most** — but itself slightly stale (lacks `health_scores`, `weight_history` the code calls) |
| `db-refactor` spec (PAWAG) | `owner_id` (normalized target) | 34+ | Design intent, not implemented here |
| App code | **both** (`usePets`→`owner_id`, `usePetV2`→`owner_id`; legacy types→`user_id`) | 28 referenced | Contradicts itself |

The codebase is **mid-migration between two schemas and was never finished**. The new
Supabase project (see [03](./03-supabase-new-project.md)) is now a clean, self-consistent
`user_id` baseline — use it as the anchor to finish the migration deliberately.

## Decision required (P0)

**Choose the canonical ownership model and table set, then make ONE migration directory the
source of truth.** Recommended target (matches the `db-refactor` spec and 3NF):

- `pets.owner_id` as the single ownership root.
- Child tables own **no** redundant owner column; access derives via `pet_id → pets.owner_id`.
- Drop the diagnostic/duplicate migrations; keep one ordered, timestamped set.

> If you prefer the lowest-effort path to "shipping now", keep the `user_id` baseline that is
> already live on the new project and **delete the `owner_id` code paths** instead. The cost
> is naming that disagrees with the spec. Either way: **pick one and delete the other.**

## Step plan

1. **Freeze a baseline.** The new project is your baseline. Snapshot it:
   `supabase db dump` (once you have an org access token) → commit as
   `supabase/migrations/0000_baseline.sql`.
2. **Archive the legacy mess.** Move the 88 ad-hoc files + `v2/` to
   `supabase/migrations/_archive/`. Remove diagnostics (`DISCOVER_schema.sql`,
   `check_permissions.sql`, `check_events_permissions.sql`) from the migration path entirely.
3. **Reconcile code to one column.** Pick `owner_id` (recommended) and:
   - Rename `pets.user_id → owner_id` in a migration (or keep `user_id` and remove `owner_id`
     usage). Update RLS accordingly.
   - Delete the deprecated `hooks/usePets.ts`; standardize on `hooks/domain/usePetV2`.
   - Unify `types/db.ts` and `types/v2/schema` into a single generated types file.
4. **Reconcile the table set.** The app references tables not in `types/db.ts`
   (`health_scores`, `health_risks`, `health_recommendations`, `weight_history`,
   `weight_logs`, `body_condition_scores`, `emergency_contacts`, `share_links`,
   `pet_share_tokens`). Decide per table: create it, or fix the code to use the canonical
   table (e.g. consolidate `weight_logs`/`weight_entries`/`weight_history` into one).
5. **Add integrity** the reconstruction dropped: enum/`CHECK` constraints, `NOT NULL` where
   appropriate, and **indexes on every foreign key** (the `db-refactor` review found 100+
   unindexed FKs).
6. **Seed reference data** from `documentation/documents/*.csv`
   (`all_dog_breeds_comprehensive.csv`, `pet_vaccinations_complete.csv`,
   `pet_medicines_comprehensive.csv`) and `translations.sql`.
7. **CI guard.** Add a check that fails if `supabase gen types` output differs from the
   committed `types/db.ts` — so code and DB can never silently drift again.

## Definition of done

- One Supabase project, one migration directory, one ownership column, one types file.
- `npm run` against a fresh clone + `supabase db push` reproduces the schema exactly.
- The golden-path validation in [03](./03-supabase-new-project.md) passes.
- `get_advisors` returns no `ERROR`-level lints.
