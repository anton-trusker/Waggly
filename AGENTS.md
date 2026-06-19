# Waggly — Agent Guide

> This document is written for AI coding agents who need to understand and work on the Waggly codebase. It describes the project's architecture, conventions, build/test processes, and known risks based on the actual files in this repository.

## Project Overview

**Waggly** (formerly Pawzly) is a cross-platform pet-management application — an AI-first digital pet passport and all-in-one pet health/lifestyle platform. It is built with **Expo + React Native** and targets **iOS, Android, and Web** from a single TypeScript codebase.

The app currently supports:

- Email/password authentication with Supabase Auth (session persistence via `expo-secure-store` on native and `localStorage` on web).
- Pet CRUD, photo uploads, co-owner sharing, and public share links.
- Health tracking: vaccinations, treatments/medications, medical visits, weight logs, allergies, conditions, veterinarians/providers.
- Notifications, calendar events, documents, and an activity feed.
- Light/dark UI, i18n (7 languages), and a design system built on Tamagui tokens.

Key top-level status docs:

- `APP_STATUS.md` — working-state report, fixed issues, verified components, testing checklist.
- `FIX_SUMMARY.md` — explanation of the resolved Worklets/Reanimated Babel conflict.
- `UI_UX_ENHANCEMENT_SUMMARY.md` — recent design-system overhaul notes.
- `current-data-metrics-analysis.md` — proposed health metrics/scores based on the V2 schema.
- `improvement-plan/` — a structured, evidence-based remediation roadmap (data layer, code quality, architecture, feature gaps).

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo ~54.0.30, React Native 0.81.5, React 19.1.0 |
| Router | Expo Router v6 (file-based routing, typed routes enabled) |
| UI / Styling | Tamagui 1.141.5, React Native `StyleSheet`, `cssInterop` for web |
| Animations | React Native Reanimated 3.16.1 |
| State (server) | TanStack React Query v5 |
| State (global) | React Context (`AuthContext`, `ThemeContext`, `ToastContext`, `WidgetContext`) |
| Forms | `react-hook-form` + `@hookform/resolvers` + Zod |
| Backend / DB | Supabase (`@supabase/supabase-js` v2) |
| Edge Functions | Deno / Supabase Functions |
| Auth | Supabase Auth (email/password, magic links, OAuth callbacks) |
| i18n | `i18next` + `react-i18next` + `expo-localization` |
| Analytics | PostHog React Native |
| Notifications | `expo-notifications` |
| Maps / Places | `react-native-maps`, Google Places autocomplete |
| Build / CI | EAS Build, Vercel (web), GitHub Actions for Supabase Functions |
| Testing | Jest 29, React Native Testing Library, jsdom |
| Linting | ESLint 8 with Expo/TypeScript/React configs |

## Project Structure

```
Waggly/
├── app/                    # Expo Router routes
├── components/             # React components organized by concern
├── contexts/               # Global React Context providers
├── constants/              # Design tokens, theme, app config, reference data
├── design-system/          # Tamagui tokens and provider
├── hooks/                  # Custom hooks; domain/api subfolders
├── lib/                    # Core clients (Supabase, i18n, PostHog, storage)
├── locales/                # i18n translation JSON files
├── types/                  # TypeScript types including Supabase generated types
├── utils/                  # Validation schemas, date utilities, helpers
├── supabase/               # Migrations, canonical schema, Edge Functions
├── scripts/                # Migration/verification helper scripts
├── __tests__/              # Jest test files
├── __mocks__/              # Manual Jest mocks
├── babel-plugins/          # Dev-only editable-components Babel plugins
├── public/                 # Static web assets (icon, splash, favicon)
```

### Route Layout (`app/`)

Expo Router uses file-based routing. The root layout is in `app/_layout.tsx` (and `app/_layout.native.tsx` for native).

| Group / File | Purpose |
|--------------|---------|
| `app/index.tsx` | Entry gate; redirects authenticated users to `/(tabs)/(home)` and guests to `/(auth)/login` |
| `app/_layout.tsx` | Global providers: PostHog, React Query, Tamagui, gesture handler, theme, toast, auth |
| `app/(auth)/` | Public auth screens: login, signup, forgot-password |
| `app/(tabs)/` | Authenticated main shell with tabs: home, pets, calendar, notifications, profile |
| `app/(tabs)/pets/` | Pet hub: list, detail, add/edit, vaccinations, treatments, visits, photos, documents, health records |
| `app/(tabs)/calendar/` | Calendar and add-event screens |
| `app/auth/callback.tsx` | OAuth/email verification callback handler |
| `app/pet/shared/[token].tsx` | Public shared pet passport view |
| `app/share/[token].tsx` | Public share landing |
| `app/(dev)/design-system.tsx` | Design-system sandbox |
| `app/events/[id].tsx` | Deep-linked event detail |

Platform-specific variants use `.ios.tsx`, `.android.tsx`, and `.native.tsx` suffixes where needed.

### Key Module Divisions

- **`components/`** — UI layer split by domain:
  - `auth/`, `common/`, `forms/`, `health/`, `layout/`, `navigation/`, `profile/`
  - `design-system/` — reusable primitives, form inputs, widgets
  - `features/` — feature-specific components (pets, calendar, documents, sharing, etc.)
  - `passport/` — passport/chart/form/modal widgets
- **`hooks/`** — Custom hooks.
  - `hooks/api/` — Edge Function API clients.
  - `hooks/domain/` — newer V2 data hooks (`usePetV2`, `useHealthV2`, `useHealthMutationsV2`).
  - Root-level hooks: `usePets`, `useEvents`, `useNotifications`, `useDocuments`, `useCityAutocomplete`, etc.
- **`contexts/`** — Global providers. `AuthContext` is the source of truth for session/user/profile.
- **`lib/`** — Core integrations:
  - `supabase.ts` — typed Supabase client, auth persistence adapter.
  - `i18n.ts` — i18next configuration.
  - `posthog.ts` — PostHog analytics config.
  - `storage.ts`, `api.ts`, `age.ts` — helpers.
- **`constants/`** — `designSystem.ts` is the canonical token source; also `Colors.ts`, `theme.ts`, `darkTheme.ts`, `app.ts`, `countries.ts`, `medicines.ts`, `vaccines.ts`.
- **`types/`** — `db.ts` (Supabase generated), `v2/schema.ts` (hand-written V2 schema), `index.ts`, `passport.ts`, `components.ts`, `toast.ts`.
- **`utils/`** — `validation/` (Zod schemas), `dateUtils.ts`, `designSystem.ts`, `persistentState.ts`, `errorHandler.ts`, `logger.ts`, etc.
- **`supabase/`** —
  - `migrations/` — ~80+ timestamped SQL migrations (schema, RLS, triggers, reference data).
  - `canonical-schema/` — target/reference schema split into numbered SQL files.
  - `functions/` — Deno Edge Functions (`api-v1-pets`, `api-v1-pet-detail`, `api-v2-health-check`, `generate-passport-pdf`, `send-invite`, plus `_shared/` helpers).
  - `config.toml` — Supabase CLI configuration.

## Build and Run Commands

All Expo scripts preload `metro-polyfills.js` and disable telemetry.

```bash
# Install dependencies
npm install

# Start the development server (uses tunnel)
npm run dev

# Platform-specific development
npm run ios
npm run android
npm run web

# Clear the Metro cache (recommended when Babel/Metro configs change)
npx expo start --clear

# Build web export and generate PWA service worker
npm run build:web

# Prebuild Android native project
npm run build:android

# Lint
npm run lint

# Run tests
npm test
```

### Web Build Details

- `build:web` runs `expo export -p web` using Metro, then `npx workbox generateSW workbox-config.js`.
- `workbox-config.js` precaches `dist/**/*.{js,css,html,png,jpg,jpeg,svg,ico,json}` and emits `dist/sw.js`.
- `vercel.json` rewrites non-asset paths to `index.html` for SPA behavior.

### Native Build Details

- EAS Build config is in `eas.json`: `development`, `preview`, and `production` profiles.
- `app.json` enables the new architecture (`newArchEnabled: true`), sets bundle/package IDs to `com.anonymous.Waggli`, and defines the deep-link scheme `waggli://`.

### Metro and Babel Configuration

- `metro.config.js` loads `metro-polyfills.js` first, configures the Metro cache, adds `.mjs`/`.cjs` source extensions, and disables `unstable_enablePackageExports`.
- `babel.config.js` uses `babel-preset-expo`, module-resolver aliases (`@`, `@components`, `@style`, `@hooks`, `@types`, `@contexts`), and includes `react-native-reanimated/plugin` **last**.
- **Dev-only Babel plugins**: when `EXPO_PUBLIC_ENABLE_EDIT_MODE=TRUE` and `NODE_ENV=development`, two custom plugins in `babel-plugins/` inject editable-element wrappers and source-location props. Leave these off in production/staging builds.

## Code Style Guidelines

### TypeScript

- TypeScript `strict` mode is enabled.
- Path alias `@/` maps to the project root (defined in `tsconfig.json`, `babel.config.js`, and `jest.config.js`).
- Supabase functions are excluded from TypeScript compilation (`tsconfig.json` excludes `supabase/functions`).

### File and Naming Conventions

- React components: PascalCase files with default exports, e.g. `CalendarMonthView.tsx`.
- Hooks: camelCase prefixed with `use`, e.g. `useEvents.ts`.
- Utilities: camelCase, e.g. `dateUtils.ts`, `designSystem.ts`.
- Validation: Zod schemas live in `utils/validation/schemas.ts`.

### Imports

- Standard path aliases use `@/`, e.g. `@/lib/supabase`, `@/hooks/usePets`, `@/contexts/AuthContext`, `@/constants/designSystem`.
- React imports are explicit in component files (`import React from 'react'`).
- Mixed quote styles exist across the repo; new code should match the surrounding file.

### ESLint

- Configuration: `.eslintrc.js`.
- Run: `npm run lint`.
- Several rules are intentionally disabled to reduce noise in the current codebase:
  - `@typescript-eslint/no-explicit-any`
  - `@typescript-eslint/no-unused-vars`
  - `react-hooks/exhaustive-deps`
  - `import/no-unresolved`
  - `prefer-const`, `no-var`, `no-empty`
- `react/prop-types` is set to `warn`.
- The project currently does **not** use Prettier or an automated formatter.

### Styling

- Most components use `constants/designSystem.ts` tokens directly.
- Tamagui provider is configured in `tamagui.config.ts` with tokens from `design-system/tokens/`.
- `ThemeContext` currently exposes a light-only design-system theme.
- Some web-specific styling uses `className` via `cssInterop`, which can produce React Native warnings in tests.

## Testing Instructions

### Test Runner

- Jest 29 with `react-native` preset and `babel-jest` transform.
- Environment: `jsdom`.
- Setup: `@testing-library/jest-native/extend-expect`.
- Path mapping: `@/` → `<rootDir>/`.
- Manual mocks: `__mocks__/@expo/vector-icons.js`, `__mocks__/expo-blur.js`.

### Running Tests

```bash
npm test
```

### Existing Tests

Only a small set of tests currently exists under `__tests__/`:

- `calendarLanguage.test.tsx` — localized weekday headers in `CalendarMonthView`.
- `calendarMarkers.test.tsx` — event dot rendering by color.
- `useEvents.test.tsx` — `useEvents` hook with mocked Supabase/auth/pets.
- `validation.test.ts` — validation utility helpers.
- `utils/formUtils.test.ts` — form calculation helpers (weight trend, medication interactions, etc.).

`__tests__/FORMS_TESTS_README.md` documents an intended larger test suite (180+ tests for modals and forms), but those files do not yet exist.

### Adding Tests

- Place new tests in `__tests__/` mirroring the source structure.
- Mock native modules and `@expo/vector-icons` as needed.
- Be aware that `className` prop warnings are expected due to `cssInterop`; use `waitFor` carefully when async mock data is involved.

## Backend / Data Layer

### Supabase Client

- `lib/supabase.ts` creates a typed Supabase client using `Database` from `@/types/db`.
- Required environment variables:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY` (falls back to `EXPO_PUBLIC_ANON_KEY`)
- The app throws at startup if these are missing.
- Auth persistence:
  - Native: `expo-secure-store`
  - Web: `localStorage`
  - `autoRefreshToken` and `persistSession` are enabled.
  - `detectSessionInUrl` is enabled only on web.

### Schema

- Target schema is documented in `supabase/canonical-schema/`.
- Migration history is in `supabase/migrations/`.
- In-code V2 types are in `types/v2/schema.ts`.
- **Known risk**: the data layer has drifted across multiple Supabase projects and two incompatible in-code schemas (e.g. `user_id` vs `owner_id`). See `improvement-plan/04-data-layer-remediation.md` before making schema or query changes.

### Edge Functions

- Functions live in `supabase/functions/`.
- Shared helpers are in `supabase/functions/_shared/`.
- Deployed functions are referenced in GitHub Actions under `.github/workflows/`.

## Deployment

### EAS / Native

- EAS project ID is in `app.json` under `extra.eas.projectId`.
- Build profiles: `development`, `preview`, `production` (`eas.json`).
- Use `eas build --profile <profile>` to trigger builds.

### Web / Vercel

- Vercel project metadata is in `.vercel/project.json`.
- `vercel.json` handles SPA routing.
- Build command: `npm run build:web`.

### GitHub Actions

Two overlapping workflows deploy Supabase Edge Functions on pushes to `main` that modify `supabase/functions/**`:

- `.github/workflows/deploy-functions.yml`
- `.github/workflows/deploy-edge-functions.yml`

Required secrets include `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD` / `SUPABASE_PROJECT_REF`, and optionally `SLACK_WEBHOOK_URL`.

> There is currently **no CI workflow for Jest, ESLint, or TypeScript type-checking** on PRs/pushes.

## Environment Variables

Common `EXPO_PUBLIC_*` variables used in the app:

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` / `EXPO_PUBLIC_ANON_KEY` | Supabase anonymous key |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Places / Maps |
| `EXPO_PUBLIC_EMAIL_REDIRECT_URL` | Auth email redirect URL |
| `EXPO_PUBLIC_APP_GROUP_ID` | iOS app group for widgets |
| `EXPO_PUBLIC_ENABLE_EDIT_MODE` | Toggle dev-only editable-components Babel plugins |

`.env` and `.env*.local` files are gitignored. Do not commit secrets.

## Security Considerations

- Supabase Row Level Security (RLS) is enabled on tables; policies are defined in migrations.
- Auth session tokens are stored in `expo-secure-store` on native and `localStorage` on web.
- `EXPO_PUBLIC_*` variables are bundled into the client and are not secret. Any server-only credentials should be kept in Supabase Edge Function secrets, not in `EXPO_PUBLIC_*` variables.
- `detectSessionInUrl` is enabled only on web.
- The current codebase contains a significant number of `any` types, `as any` casts, and `@ts-ignore` comments. The improvement plan flags this as a P1 risk.

## Known Issues and Risks

Read these documents before making large changes:

1. **Data-layer drift** — `improvement-plan/04-data-layer-remediation.md`.
2. **Code quality / type safety** — `improvement-plan/05-code-quality-and-architecture.md` notes very low test coverage, widespread `any`/cast usage, disabled lint rules, and ~218 raw `console.*` calls despite the existence of `utils/logger.ts`.
3. **Worklets/Reanimated** — already resolved; `babel.config.js` now uses `react-native-reanimated/plugin` last. If animation errors reappear, clear the cache with `npx expo start --clear`.
4. **Test warnings** — `className` prop warnings in tests are expected from `cssInterop`.

## Quick Reference

```bash
# Start developing
npm run dev

# Clear cache after config/native changes
npx expo start --clear

# Run checks
npm run lint
npm test

# Build web
npm run build:web
```
