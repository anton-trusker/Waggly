## Recommendation
- Keep one codebase using Expo React Native with platform-specific files instead of separate projects.
- Leverage existing `*.web.tsx`, `*.native.tsx` and `*.ios.tsx` overrides and Expo Router’s per-platform layouts.
- Share business logic (data, services, hooks) across platforms; vary only UI, navigation, and capabilities.

## Current Repo Signals
- Expo with web support: `package.json` includes `expo`, `expo-router`, `react-native-web`, web scripts.
- Platform overrides already exist: `/app/_layout.web.tsx`, `/components/FloatingTabBar.web.tsx`, multiple `.ios.tsx` files.
- Web assets and tooling: `/public/*`, `workbox-config.js`, `expo export -p web` script.

## Where to Differentiate
- Screens: create `screen.web.tsx` next to `screen.tsx` when UI diverges (e.g., table vs card grid).
- Components: add `Component.web.tsx` variants for navigation, headers, and interactions (pattern already used by `FloatingTabBar.web.tsx`).
- Layouts: customize per-platform via `app/_layout.web.tsx` and `app/(tabs)/_layout.ios.tsx`.
- Styling: use responsive props and `Platform.select` for spacing/typography deltas; adopt `react-native-css-interop` for web-only CSS when needed.
- Behavior: gate capabilities with `Platform.OS === 'web'` (e.g., file uploads, hover, keyboard shortcuts).

## Routing & Navigation
- Use Expo Router groups for feature separation (e.g., `(auth)`, `(tabs)` already present).
- Provide platform-specific route files when navigation differs (e.g., `profile.web.tsx` vs `profile.tsx`).
- Keep deep links universal; handle minor per-platform config in layout components.

## Data & Services
- Centralize data access in shared modules (e.g., Supabase client and types).
- Avoid platform-only SDKs in shared layers; wrap them behind interfaces and platform-specific implementations when necessary (`service.web.ts` / `service.native.ts`).

## Config & Environments
- Use `.env` / `.env.local` and Expo `app.json` `extra` fields to inject platform-specific values.
- Web: place icons/manifest in `/public`; adjust PWA settings and service worker via `workbox`.
- Mobile: keep native permissions and icons in `app.json` / `eas.json`.

## Build & Deployment
- Dev: `expo start --web` for web, `expo start --ios/android` for mobile.
- Web build: `expo export -p web` + `workbox generateSW` for PWA.
- Mobile build: EAS Build or `expo run:ios/android` for local testing.

## Implementation Steps
1. Audit screens/components to decide where web/mobile should diverge.
2. Add platform-specific files for those targets (`*.web.tsx`, `*.native.tsx`).
3. Refactor shared logic (data, hooks, utils) into platform-agnostic modules.
4. Update layouts and navigation with per-platform headers/actions.
5. Introduce feature flags for optional web-only experiences (keyboard, hover, multi-column layouts).
6. Adjust env/config for platform needs (PWA manifest, permissions).
7. Set up CI jobs: web build/deploy + mobile build pipelines.
8. QA both platforms with smoke tests; ensure parity where intended and deliberate differences where desired.

## Optional: When to Split Apps
- Split into two apps within a monorepo only if UX or dependencies diverge heavily (e.g., Next.js for advanced web SSR). Keep shared packages for domain logic.

Please confirm, and I will carry out the audit and implement the platform-specific variants where needed.