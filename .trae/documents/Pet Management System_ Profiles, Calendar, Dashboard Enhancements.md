## Overview
- Implement editable Pet Profile, dedicated Calendar, and dashboard quick-view without redirects.
- Leverage existing Supabase tables and hooks; add event aggregation and image upload to `pet-photos` bucket.
- Add validation, accessibility, error handling, and unit tests for critical logic.

## Data & APIs
- Use existing hooks: `usePets`, `useVaccinations`, `useTreatments`, `useAllergies`, `useWeightEntries`.
- Add `useEvents(petIds?, filters?)` that aggregates events from:
  - `vaccinations.next_due_date` and `date_given`
  - `treatments.start_date`, `end_date`, `frequency`, `time_of_day`
  - `notifications` table (vet visits and custom reminders)
- Provide event shape: `{ id, petId, petName, type, title, dueDate, priority, notes, color }`.
- Implement Supabase Storage upload for pet photos to `pet-photos` bucket; generate public URL and update `pets.photo_url`.

## Pet Profile Management
- Create `components/PetProfileForm.tsx` used for add/edit:
  - Sections: Basic Info, Medical Details, Lifestyle (Allergies, Behavior Tags, Food), Photo.
  - Use `AvatarUpload` for image selection; upload on Save.
  - Bind to `usePets.updatePet(petId, data)` for basic fields; use existing add screens for vaccinations/treatments.
  - Inline validation (no new libs):
    - Required: `name`, `species`
    - Formats: `date_of_birth` `YYYY-MM-DD`, `weight` numeric > 0
    - Length limits, enum checks (`gender`, `size`)
  - Save/Cancel:
    - On Save: confirm dialog; optimistic UI, error rollback.
    - On Cancel: confirm discard changes.
  - Accessibility: labels, `accessibilityRole`, `accessibilityLabel`, 44px touch targets.
- Wire edit entry points:
  - Edit button in `app/(tabs)/pets/pet-detail.tsx:61` opens form modal.
  - Quick action in dashboard quick-view opens form.

## Calendar Page
- Add `app/(tabs)/calendar.tsx` with month/week switch and list view.
- Header shows design image `assets/images/Calendar.png` as visual guide, not as interactive UI.
- Event rendering:
  - Color-code by pet; assign palette per pet and reuse.
  - Show: Pet name, type, due date, priority (derived: overdue/high, due-soon/medium, upcoming/low), notes.
- Filters:
  - By pet (multi-select chips), event type (vaccination/treatment/vet_visit), date range.
- Loading & errors: activity indicators, empty states, retry.
- Tap event → detail sheet with actions: mark as done (if applicable), edit (routes to relevant add/edit screen).
- Update tab route: change Calendar tab to `/(tabs)/calendar` in `app/(tabs)/_layout.tsx:39–43`.

## Dashboard Enhancements
- In `app/(tabs)/(home)/index.tsx`, replace avatar tap navigation with `PetQuickViewModal` (bottom sheet/modal):
  - Shows condensed health card: next vaccination status, active treatments count.
  - Pet avatar/icon and name.
  - Recent activity feed: last profile updates (`pets.updated_at`), new vaccinations/treatments, upcoming events (from `useEvents`).
  - Quick actions: Edit Profile (modal), Add Event (opens vaccination/treatment add), View Full Profile (navigate to detail).
- Responsive layout: flex-based, avoid fixed widths; ensure web and mobile parity.
- Loading states tied to hooks; skeleton or spinners.

## Validation & Errors
- Validation helpers in `utils/validation.ts` (simple functions reused by forms).
- Use `Alert.alert` for user feedback; log details via `utils/errorLogger.ts`.
- Guard Supabase failures and show retry.

## Unit Tests
- Add Jest and Testing Library:
  - `jest`, `babel-jest`, `@testing-library/react-native`, `@testing-library/react` for web.
  - Configure RN preset; add sample tests.
- Test targets:
  - `useEvents` aggregation (date/status calculations, filtering).
  - Validation helpers (date/number/enum rules).
  - Photo upload util (path building, error cases; mock Supabase).

## Accessibility (WCAG 2.1 AA)
- Ensure text contrast per `colors` palette.
- Keyboard navigation support on web: focusable controls, visible focus.
- Roles/labels on interactive elements.
- Dynamic content updates announce with accessibility hints where appropriate.

## Code References
- Hooks: `hooks/usePets.ts:42–85`, `hooks/useVaccinations.ts:40–116`, `hooks/useTreatments.ts:40–103`, `hooks/useWeightEntries.ts:40–103`, `hooks/useAllergies.ts:40–103`.
- Detail screen: `app/(tabs)/pets/pet-detail.tsx:61` (edit button), routes at `140–165`.
- Dashboard: `app/(tabs)/(home)/index.tsx:120–151` (pet avatars), `175–206` (health card), `206–271` (activity cards).
- Tab layout: `app/(tabs)/_layout.tsx:31–43` (Calendar tab).
- Storage policies: `supabase/migrations/20251215164052_create_storage_policies.sql:1–33`.

## Deliverables
- New components: `PetProfileForm`, `PetQuickViewModal`, `CalendarPage`, `useEvents`, `utils/validation.ts`.
- Updated routes and dashboard behavior.
- Unit test suite and config.
- Accessibility pass and loading/error UX.

## Verification
- Manual checks per `TESTING_GUIDE.md` and new Calendar scenarios.
- Run unit tests locally; confirm no console errors; validate across iOS, Android, Web.