# 05 - Current App Gap Analysis

## Current App Strengths

The app already has a lot of MVP surface area:

- Auth screens.
- Home/dashboard.
- Pet list and pet detail tabs.
- Add pet flow.
- Health records: visits, vaccines, treatments, medications, allergies, conditions, metrics.
- Passport screens and widgets.
- Documents screen and upload components.
- Calendar screen.
- Notifications screen.
- Co-owner and sharing hooks.
- Responsive web/mobile components.
- i18n and theming foundations.
- Supabase client and typed DB setup.

This is not a blank project. The risk is drift, not lack of effort.

## Current Technical Risks

### 1. Too Many Direct Data Paths

Hooks call Supabase directly across many files. This makes table renaming or RLS fixes expensive.

Fix:

- Add domain service layer: `petService`, `healthService`, `documentService`, `sharingService`, `passportService`.
- Hooks call services; services own Supabase query details.

### 2. Schema Drift

Current app references duplicate concepts:

- `pets.user_id` vs `owner_id`.
- `weight_logs`, `weight_entries`, `weight_history`.
- `public_shares`, `share_links`, `pet_share_tokens`.
- Storage bucket/table naming inconsistencies like `pet-photos` vs `pet_photos`.

Fix:

- Freeze canonical schema.
- Add compatibility views only briefly.
- Refactor hooks to canonical names.

### 3. Type Safety Debt

Codebase has hundreds of `any`/casts around data. That is understandable during prototyping but dangerous for a health/passport product.

Fix:

- Generate DB types from final Supabase schema.
- Create typed insert/update DTOs.
- Replace `as any` around Supabase calls first.

### 4. Low Test Coverage

Only a small number of tests exist relative to app size.

Fix priority:

1. Auth/session smoke tests.
2. Pet creation tests.
3. Health record CRUD tests.
4. Sharing permission tests.
5. Passport health score tests.
6. Document upload/OCR mock tests.

### 5. Brand Inconsistency

The app has Waggli and Waggli visible in different places.

Fix:

- Create one brand constants file.
- Product name: Waggli.
- Domain: current `waggli.app` until changed.
- App slug/package/bundle ID need an explicit release decision.

### 6. Current Architecture vs Spec Architecture

Spec says monorepo with web, mobile, admin, landing, shared packages. Current active repo is Expo-first.

Fix:

- Do not force monorepo immediately.
- Stabilize DB and domain services first.
- Then extract shared packages if the sibling projects are consolidated.

## Highest Impact Code Fixes

1. Centralize Supabase queries into services.
2. Align pet ownership field.
3. Align sharing tables.
4. Align weight/history tables.
5. Regenerate DB types.
6. Add golden path tests.
7. Clean brand constants.
8. Remove old generated schema experiments once canonical schema is accepted.

## Golden Path Test Checklist

- User signs up.
- User completes onboarding.
- User creates pet.
- User uploads photo.
- User adds vaccination.
- User adds medication.
- User logs visit.
- User records weight and BCS.
- Passport reflects updated data.
- User generates share link.
- Anonymous viewer sees scoped passport.
- Owner revokes link.
- Anonymous viewer loses access.
