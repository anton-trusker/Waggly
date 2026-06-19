# 03 — New Supabase Project (wired 2026-06-19)

## What was connected

| Item | Value |
|------|-------|
| Project name | **Waggly** |
| Ref | `fbeldieclcltyuqvomjx` |
| URL | `https://fbeldieclcltyuqvomjx.supabase.co` |
| Region | eu-west-1 |
| Postgres | 17 (PostgREST 14.5) |
| Publishable key | `sb_publishable_fXWEl5jElQ1GyHFBkY2gtw_-YvjOpoI` |

`.env` and `.env.local` were updated to point `EXPO_PUBLIC_SUPABASE_URL`,
`EXPO_PUBLIC_SUPABASE_KEY`, `EXPO_PUBLIC_ANON_KEY`, and `EXPO_PUBLIC_SUPABASE_ANON_KEY` at the
new project. **The previous project's values are preserved as comments in `.env`** for
rollback.

> `SUPABASE_ACCESS_TOKEN` in `.env` was left unchanged — it belongs to a *different* Supabase
> account (org `lbutmzjmoxuitdvmihmo`: MyPaw/PAWAG) and does **not** have access to the new
> project. Regenerate a CLI access token from the new project's org if you want
> `supabase` CLI / `db push` to work against it.

## How the schema was built

The repo migrations had diverged from the live database (see
[04](./04-data-layer-remediation.md)), so the new schema was **reconstructed from
`types/db.ts`** — the generated Supabase types, which are the most authoritative snapshot of
the schema the app was actually built against.

- Generator: `scripts/gen_schema_from_types.js` (parses `types/db.ts` → DDL)
- Output: `supabase/generated_schema.sql`
- Applied via 4 migrations on the new project:
  1. `waggli_baseline_tables` — 39 tables
  2. `waggli_foreign_keys` — 31 FK constraints
  3. `waggli_rls_policies` — RLS enabled on all tables + 38 ownership policies
  4. `waggli_triggers_storage_rpcs` — signup trigger, 5 storage buckets, 2 RPCs

### Verified post-state

```
tables: 39   policies: 38   functions: 35   buckets: 5
```

### Ownership model applied

- `pets` is the ownership root via `pets.user_id = auth.uid()`.
- Pet-scoped tables (vaccinations, medications, documents, …) derive access through
  `EXISTS (SELECT 1 FROM pets p WHERE p.id = <t>.pet_id AND p.user_id = auth.uid())`.
- User-scoped tables (notifications, events, pet_photos, audit_logs) use their `user_id`.
- Reference tables (`ref_*`, `reference_*`, `breeds`, `translations`, `roles`, `content`) are
  world-readable.
- `mail_queue` has RLS enabled with **no client policy** by design (service-role only).

### RPCs created

- `get_public_pet_details(share_token text) → jsonb` — validates a `public_shares` token,
  bumps the view counter, returns public pet fields. `anon`-executable (public share links).
- `calculate_health_score(p_pet_id uuid) → numeric` — baseline 0–100 score from vaccination
  recency, recent visits, and active conditions. **This is a working heuristic, not the spec
  algorithm** — replace with the model in `documentation/spec/05-pet-passport/`.

## ⚠️ Known caveats of the reconstruction

Because the schema came from lossy TypeScript types, the following are approximations to flag
during validation:

1. **`pets.user_id` vs `owner_id`.** The new DB uses `user_id` (matching `types/db.ts` and the
   legacy hooks). The newer `usePetV2` path expects `owner_id`. **One must win** — see
   [04](./04-data-layer-remediation.md). Until then, code paths using `owner_id` will fail
   against this DB.
2. **Types are widened.** Enums became `text`; some dates are `text` (e.g. `pets.date_of_birth`,
   `vaccinations.date_given`) because the types encoded them as strings. Functionally fine for
   PostgREST, but add `CHECK`/enum constraints later for integrity.
3. **No seed data.** Reference tables (breeds, ref_vaccines, translations) are empty. Seed from
   `documentation/documents/*.csv` and the `v2/0010` / `seed_*` migrations.
4. **`handle_new_user`** inserts `profiles(id, user_id, first_name)`. Confirm this matches the
   onboarding flow's expectations (the app may also expect a `public.users` row).

## Validation checklist (do this next)

Run the app against the new project and confirm the golden path:

- [ ] Sign up a new user → a `profiles` row is auto-created.
- [ ] Log in; session persists across reload (web) and relaunch (native).
- [ ] Add a pet → appears in list (this is the `user_id`/`owner_id` litmus test).
- [ ] Add a vaccination / visit / weight entry → reads back under RLS.
- [ ] Upload a pet photo (bucket `pet-photos`) and a document (bucket `documents`).
- [ ] Create a public share → open `/share/[token]` in an incognito window.
- [ ] Open the passport screen → `calculate_health_score` returns a value.
- [ ] Run `get_advisors` (security + performance) and triage warnings.

To refresh types from the new DB later:
`supabase gen types typescript --project-id fbeldieclcltyuqvomjx > types/db.ts`
(requires an access token for the new project's org).
