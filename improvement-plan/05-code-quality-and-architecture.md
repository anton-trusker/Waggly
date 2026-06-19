# 05 — Code Quality & Architecture

## Type safety (P1)

- **749** occurrences of `: any` / `as any` / `@ts-ignore` across `app`, `components`,
  `hooks`, `lib`. `tsconfig.json` sets `strict: true`, but these escape hatches neutralize it.
- The Supabase client is even cast (`storage: ExpoSecureStoreAdapter as any` in
  `lib/supabase.ts`) and the public-share RPC call uses `as any`.
- **Plan**: ratchet down. Add an ESLint rule (`@typescript-eslint/no-explicit-any: warn`),
  set a baseline count, and fail CI if it increases. Burn down hotspots first — data hooks and
  Supabase response handling — because those are where wrong types cause real bugs.

## Re-enable lint safety (P1)

- `APP_STATUS.md` documents disabling `react-hooks/exhaustive-deps` and `import/no-unresolved`.
- `exhaustive-deps` catches stale-closure bugs; with 40+ hooks this is the highest-value rule
  to restore. Re-enable as `warn`, fix the real violations, then promote to `error`.
- `import/no-unresolved` should be fixed via correct `eslint-import-resolver` config (the `@/*`
  path alias) rather than disabled.

## Logging (P2)

- 218 raw `console.*` calls despite `utils/logger.ts` existing. Route everything through the
  logger, strip logs in production builds (babel `transform-remove-console`), and forward
  errors to a sink (PostHog is already wired; consider Sentry for crashes).

## Testing (P1)

- **6 test files for ~78k LOC** is effectively no safety net — dangerous given the data-layer
  refactor ahead.
- **Plan**:
  - Unit-test the data hooks against a mocked Supabase client (start with `usePets`/
    `usePetV2`, `useVaccinations`, `usePetHealthScore`).
  - Add a smoke E2E (Maestro or Detox) for the golden path: signup → add pet → add record.
  - Wire `jest` + lint + `tsc --noEmit` into CI (the `.github/` folder exists — confirm the
    workflow runs on PRs).

## Repository consolidation (P2)

Five repos exist (see [02](./02-current-state-assessment.md)). Decide the canonical topology:

- **Recommended**: a single Turbo monorepo (the `Waggli-New` structure is the right shape)
  with `apps/mobile` (this Expo app), `apps/web`, `apps/landing`, and shared
  `packages/{types,ui-kit,services}`. Share the Supabase types and client from one package so
  drift like the current `db.ts` vs `v2/schema` split cannot recur.
- Until that migration happens, **declare `Waggly/` canonical** and freeze the others to avoid
  divergent backends. Do not split engineering effort across `Waggly/` and `Waggli-New/` in
  parallel.

## App identity hygiene (P2)

- `app.json` `bundleIdentifier`/`package` are `com.anonymous.Waggli` — placeholder
  `com.anonymous`. Set a real reverse-DNS id (e.g. `app.waggli.mobile`) **before** any store
  build; changing it later forks installs.
- `EXPO_PUBLIC_APP_GROUP_ID=group.com.yourname.yourapp` is also a placeholder (breaks iOS app
  group / widget sharing).

## Secrets hygiene (P1 — security-adjacent)

- `.env` / `.env.local` contain a live **OpenAI key**, Google OAuth client secret, and Google
  Maps key. Confirm these files are git-ignored (`.gitignore` exists — verify they're listed),
  rotate anything that has been committed historically, and move server-only secrets
  (OpenAI, OAuth secret) out of `EXPO_PUBLIC_*` and into Edge Function secrets so they are
  never shipped in the client bundle.
