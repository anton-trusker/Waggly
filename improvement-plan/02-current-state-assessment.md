# 02 — Current State Assessment

## Codebase metrics (`Waggly/`)

| Area | Lines | Notes |
|------|------:|-------|
| `app/` (routes) | 15,561 | Expo Router; 45+ screens incl. nested pet detail tabs |
| `components/` | 47,328 | 247 `.tsx` files across 19 domains |
| `hooks/` | 7,377 | 40+ hooks; split into legacy + `domain/` + `passport/` |
| `types/` | 3,573 | incl. generated `db.ts` (2,288) and a `v2/` schema |
| `utils/` | 1,813 | logger, errorHandler, validation, responsive |
| `lib/` | 494 | `supabase.ts`, `api.ts`, `i18n.ts`, `posthog.ts` |
| **Tests** | — | **6 files total** for ~78k LOC |

## Tech stack

- **Frontend**: Expo ~54, React Native, Expo Router, Tamagui, React Query, react-hook-form + zod.
- **Backend**: Supabase JS v2; SecureStore-backed session on native, localStorage on web.
- **Analytics**: PostHog. **Maps**: Google Maps. **AI**: OpenAI key present in `.env`.
- **Auth**: email/password, Google (`@react-native-google-signin`), Apple.

## Strengths

- Clean module separation (`components/{auth,health,pet,passport,profile,...}`).
- Platform-aware files (`*.ios.tsx`, `*.native.tsx`) — real cross-platform intent.
- A v2 domain layer already started (`hooks/domain/usePetV2`, `types/v2/schema`) — the
  intended modern data path.
- i18n with multiple locales; design-system folder; skeleton loaders; error boundaries.
- A normalized DB target is already designed in `documentation/spec/db-refactor/`.

## Risk signals (measured)

| Signal | Count | Risk |
|--------|------:|------|
| `: any` / `as any` / `@ts-ignore` | **749** | Defeats `strict: true`; hides real type errors |
| `console.log/warn/error` calls | **218** | Noise in prod; a `utils/logger.ts` exists but is bypassed |
| TODO/FIXME/HACK | 3 | Low — issues are undocumented rather than marked |
| Distinct tables queried by code | 28 | vs 39 in `types/db.ts` vs 16 in `v2/` migrations |
| ESLint rules disabled | 2 | `react-hooks/exhaustive-deps`, `import/no-unresolved` (per `APP_STATUS.md`) |

> **`react-hooks/exhaustive-deps` being disabled is notable.** `APP_STATUS.md` says it was
> turned off as "false positives," but this rule catches genuine stale-closure bugs in hooks.
> With 40+ data hooks, this is a meaningful source of latent bugs.

## Backend state

- `supabase/migrations/`: **88 files**, including diagnostics committed as migrations
  (`DISCOVER_schema.sql`, `check_permissions.sql`), multiple competing RLS rewrites
  (`*_comprehensive_rls_policies*`, `*_core_rls_policies`, `*_cleanup_existing_rls`), and a
  parallel clean rewrite in `supabase/migrations/v2/` (0000–0010).
- `v2/0008` references `update_modified_column()` which is never defined (only
  `update_updated_at_column()` exists) — i.e. the v2 set would fail if applied as-is.
- The app's two RPCs (`get_public_pet_details`, `calculate_health_score`) and storage buckets
  (`avatars`, `documents`, `pet-photos`/`pet_photos`, `user-photos`) are implied by code but
  scattered across migrations.

## Repository landscape (workspace root)

| Repo | Stack | Last commit | Role |
|------|-------|-------------|------|
| `Waggly/` | Expo RN (this app) | 2026-01-14 | The most complete product — **canonical for now** |
| `Waggli-New/` | Turbo monorepo, Vite/React web + packages | 2026-02-23 | Newer web rewrite; 2 migrations only |
| `waggli-landing/` | Vite landing | 2026-01-29 | Marketing site |
| `Waggli-main/` | web | 2026-01-14 | Older web variant |
| `Waggli-web/` | empty | — | Placeholder |

This fragmentation (see [05](./05-code-quality-and-architecture.md)) needs an explicit
canonical-repo decision before team scale-up.

## Documentation state

- `documentation/spec/` — 144-doc, v2.0 "Production Ready" PRD set across 18 areas. High
  quality and the best reference for product intent.
- Minor doc debt: duplicate area folders (`10-sharing` vs `10-sharing-collaboration`,
  `13-ui-ux` vs `13-ui-ux-design`); `documents/` still carries "Pawzly-" filenames.
- `documentation/research/` — investor/business material (pitch, financial model, GTM).
