# Desktop Pages Rollout Mapped to Existing Mobile Code

## Approach
- Keep existing mobile-first pages under `app/(auth)`, `app/(onboarding)`, `app/(tabs)/*`.
- Add a new desktop route group: `app/web/*` with a desktop root layout (`app/web/_layout.web.tsx`) that:
  - Initializes `i18n`
  - Uses desktop design tokens
  - Provides desktop navigation (sidebar/topbar)
- For each mobile page, create a desktop counterpart (different layout/features) using `Designs/web/*` for UI reference.

## Desktop Routes to Add (One-to-One With Mobile)

### Auth
- Mobile: `app/(auth)/login.tsx`, `signup.tsx`, `forgot-password.tsx`
- Desktop (new):
  - `app/web/auth/login.tsx` → reference `Designs/web/auth/login_page/code.html`
  - `app/web/auth/signup.tsx` → reference `Designs/web/auth/sign_up_page_1/code.html`
  - `app/web/auth/forgot.tsx` → reference `Designs/web/auth/forgot_pass/code.html`
- Features: desktop two-column hero, OAuth buttons, inline validation summaries.

### Onboarding
- Mobile: `app/(onboarding)/index.tsx`, `language-selection.tsx`, `profile-setup.tsx`
- Desktop (new):
  - `app/web/onboarding/language.tsx` → `Designs/web/onboarding/onboarding:_language/code.html`
  - `app/web/onboarding/profile.tsx` → `Designs/web/onboarding/onboarding:_user_profile/code.html`
- Features: desktop hero + form, country selector, avatar upload with larger preview.

### Dashboard
- Mobile home: `app/(tabs)/(home)/index.tsx`
- Desktop (new):
  - `app/web/dashboard/index.tsx` → `Designs/web/dashboard/code.html`
- Features: sidebar nav, quick actions, pets grid, upcoming care, priority alerts, activity feed.

### Calendar
- Mobile: `app/(tabs)/calendar/index.tsx`, `add-event.tsx`
- Desktop (new):
  - `app/web/calendar/index.tsx` → `Designs/web/cal_page/code.html`
- Features: segmented views (day/week/month/year), filters sidebar, mini calendar, upcoming events panel.

### Pets — Add/Edit
- Mobile add: `app/(tabs)/pets/add-pet-wizard.tsx`, `add-pet.tsx`
- Mobile edit: `app/(tabs)/pets/pet-edit.tsx`
- Desktop (new):
  - `app/web/pets/add.tsx` → `Designs/web/add_pet/*` (basic info, details, contacts, review/confirm)
  - `app/web/pets/[id]/edit.tsx` → `Designs/web/edit_pet/*` (sections with review/save)
- Features: desktop wizard with progress, review diffs, richer field sets.

### Pets — Details (Tabs)
- Mobile: `app/(tabs)/pets/pet-detail.tsx`
- Desktop (new):
  - `app/web/pets/[id]/index.tsx` → `Designs/web/pet_details/*` (Overview, Health, Album, Documents)
- Features: desktop header with actions, tabbed content, timeline blocks, key info cards.

### Pets — Health Forms
- Mobile: `app/(tabs)/pets/health-wizard.tsx`, `add-treatment.tsx`, `add-vaccination.tsx`, `add-visit.tsx`
- Desktop (new):
  - Modal routes: `app/web/pets/[id]/health/medication.tsx`, `treatment.tsx`, `visit.tsx`, `vaccination.tsx`
  - UI refs: `Designs/web/forms/*`
- Features: pet picker, dosage+unit, frequency, clinic/pharmacy autocomplete, currency, attachments (drag-drop), reminders toggle.

### Pets — Media/Weight/Records
- Mobile: `add-photos.tsx`, `log-weight.tsx`, `record-detail.tsx`
- Desktop (new):
  - `app/web/pets/[id]/album.tsx` (photo grid + viewer)
  - `app/web/pets/[id]/weight.tsx` (desktop chart and form)
  - `app/web/pets/[id]/records/[recordId].tsx` (document viewer)
- Features: larger grids, keyboard navigation, file previews/downloads.

### Profile — Co-Owners u000b- Mobile: `app/(tabs)/profile/co-owners.tsx`
- Desktop (new):
  - `app/web/profile/co-owners.tsx` → `Designs/web/share_coowner/main_dashboard_page/code.html`
- Features: roles/permissions matrix, invite management, public passport share link (view-only route `app/web/share/[token].tsx`).

## Shared Services u000b- Keep business logic in hooks/services; extend types for desktop-only fields.
- Extend Supabase schemas for units/costs/roles and update CRUD in `useVaccinations`, `useTreatments`, `useMedicalVisits`.

## Desktop Layout Structure
- `app/web/_layout.web.tsx`: desktop `ThemeProvider`, `ThemeContextProvider`, `SidebarNav`, `Topbar`, global CSS/Tailwind.
- `components/desktop/*`: reusable desktop atoms (buttons, inputs, cards, tables, modals).

## Acceptance Criteria (per page)
- Auth: login/signup/forgot mirror design, OAuth works, keyboard accessible.
- Onboarding: language/profile match design, persists to profile.
- Dashboard: loads pets, alerts, activity; responsive grid; performant.
- Calendar: view switchers functional; filters apply; add-event works; data syncs to Supabase.
- Add/Edit Pet: validation and review diffs; saves to Supabase; images upload.
- Pet Details/Tabs: data cards populate; quick actions launch modals; timeline renders.
- Health Forms: dosage units, currency, attachments, reminders; saves and updates due dates.
- Co-Owners: invite accept flow and roles; share links render limited passport view.

## Sequencing
1. Scaffold `app/web/_layout.web.tsx` and desktop tokens/components.
2. Implement Auth u000b→ Onboarding u000b→ Dashboard.
3. Implement Calendar (views + filters).
4. Implement Pets (Add/Edit/Details tabs).
5. Implement Health forms and modals.
6. Implement Co-Owners and Share pages.

## Testing u000b- Unit: adapters/validators.
- Integration: Supabase CRUD hooks.
- E2E: auth → onboarding → dashboard → calendar → add/edit pet → health forms.
- A11y: axe-core on desktop pages.

## Notes
- Designs used: `Designs/web/auth/*`, `cal_page/*`, `dashboard/*`, `add_pet/*`, `edit_pet/*`, `forms/*`, `onboarding/*`, `pet_details/*`, `share_coowner/*`.
- Keep mobile unaffected; use route segregation and shared logic