# 01 — Executive Summary

## What Waggli is

An AI-first **digital pet passport** and all-in-one pet platform for the European market
(€121B pet care, 91M households). Freemium SaaS (€4.99–€9.99/mo) + marketplace/affiliate
revenue. Cross-platform: Expo + React Native + Tamagui for iOS/Android/Web, Supabase backend
(Postgres + Auth + Storage + Edge Functions), with planned OpenAI/Vision AI features.

## Where the product actually is

The `Waggly/` app is **substantially built**, not a prototype:

- ~78,000 lines of TypeScript, 247 component files, 40+ hooks, 45+ screens.
- Implemented: auth (email + Google + Apple), pet CRUD, health records (vaccinations,
  visits, medications, allergies, conditions, weight), documents, calendar/events,
  notifications, pet passport, public sharing, co-owners, i18n, light/dark theming.
- The "Pawzly → Waggli" rebrand is **effectively complete in code** (0 stale references;
  `app.json` is already `Waggli`, scheme `waggli`).

## The core problem

The **data layer has fragmented**. Evidence found during review:

1. **Four+ Supabase projects** are referenced across the workspace:
   - `kfruxpfrtewmynxqewjh` — the app's runtime URL (`.env`, now replaced)
   - `tcuftpjqjpmytshoaqxr` (MyPaw) — in `supabase/config.toml`
   - `zcskkzeguyirfliebjqg` (PAWAG) — target of the `db-refactor` spec
   - `fbeldieclcltyuqvomjx` (**Waggly, new**) — created 2026-06-18, now wired up
2. **Two incompatible in-code schemas**: legacy hooks use `pets.user_id`; newer `usePetV2`
   / `@/types/v2/schema` use `pets.owner_id`. The deprecated `usePets` queries a column the
   newer code renamed.
3. **88 migration files that contradict each other** (legacy chain uses `user_id`; the
   `supabase/migrations/v2/` rewrite uses `owner_id` but is missing ~14 tables the app
   queries) and **contradict the generated `types/db.ts`**. Migrations are no longer a
   reliable source of truth.
4. The team already **documented this** in `documentation/spec/db-refactor/` (flagging
   redundant ownership columns, missing FK indexes, RLS gaps) — but it targets PAWAG, not
   the project the app runs against.

Until this is resolved, every feature touches an unstable foundation: schema changes are
risky, onboarding a new engineer is hard, and "works on my machine" depends on which of four
databases is wired.

## What was done in this session

- **Connected the new Supabase project** (`fbeldieclcltyuqvomjx`, "Waggly", eu-west-1):
  `.env` and `.env.local` now point at it (old values preserved as comments).
- **Reconstructed and applied the schema** from `types/db.ts` (the most authoritative
  artifact): 39 tables, 31 foreign keys, 38 RLS policies, 5 storage buckets, a
  `handle_new_user` signup trigger, and the two RPCs the app calls
  (`get_public_pet_details`, `calculate_health_score`). See
  [03-supabase-new-project.md](./03-supabase-new-project.md).
- Generator script committed at `scripts/gen_schema_from_types.js`; the emitted DDL is at
  `supabase/generated_schema.sql`.

## Top priorities (detail in [07](./07-prioritized-roadmap.md))

| Priority | Theme | Why |
|----------|-------|-----|
| **P0** | Pick ONE schema + ONE database; make migrations the source of truth | Removes the foundational instability |
| **P0** | Validate the new DB end-to-end (signup → add pet → health record → share) | Confirms the new backend is production-usable |
| **P1** | Type safety (749 `any`/`ts-ignore`) and re-enable lint rules | Hidden bugs; `react-hooks/exhaustive-deps` is currently disabled |
| **P1** | Test coverage (only 6 test files for ~78k LOC) | No safety net for the refactors above |
| **P2** | Repository consolidation (Waggly vs Waggli-New monorepo vs landing) | Decide canonical codebase before scaling the team |
| **P2** | Close feature gaps vs spec (AI entry/OCR, social, monetization, providers) | These are the differentiators in the business plan |
