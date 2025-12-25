## Goals
- Align the web dashboard UI with the provided design (`code.html` and `screen.png`).
- Correct Quick Actions so each routes to its proper form instead of the add-pet flow.

## Current Findings
- Design includes five Quick Actions: Book Visit, Add Vaccine, Add Meds, Add Weight, Add Photo.
- Web dashboard page exists: `app/web/dashboard/index.tsx`.
- Web Quick Actions route incorrectly to generic pets pages: `components/desktop/dashboard/QuickActionsGrid.tsx:21, 28–50`.
- Mobile Quick Actions already point to dedicated forms: `components/dashboard/QuickActions.tsx:20, 26, 32, 38, 44`.
- Add-pet flow is used widely from dashboard: `app/(tabs)/(home)/index.tsx:71–75`, `components/dashboard/NoPetsState.tsx:36`, `app/web/dashboard/index.tsx:45–50, 60–69`.
- Available form screens:
  - Visit: `app/(tabs)/pets/add-visit.tsx`
  - Vaccination: `app/(tabs)/pets/add-vaccination.tsx`
  - Treatment/Meds: `app/(tabs)/pets/add-treatment.tsx`
  - Weight: `app/(tabs)/pets/log-weight.tsx`
  - Photos: `app/(tabs)/pets/add-photos.tsx`

## Design Enhancements
- Typography and icons: apply `Plus Jakarta Sans` and Material Symbols across dashboard header, nav, cards, and Quick Actions.
- Color tokens and radii: mirror design theme (primary/secondary/background/surface/border, rounded-xl) using Tailwind config or utility classes.
- Layout: implement sidebar (desktop), sticky header with search and notifications, responsive grid (12 columns) for main sections.
- Pets section: use card style with subtle hover, metadata rows, and dashed "Add New Pet" card.
- Quick Actions: use icon chips with soft color backgrounds and hover elevation; grid 2–5 columns responsive.
- Upcoming Care: add filter chips (All/Medical/Hygiene), compact event cards.
- Priority Alerts: compact list with action buttons.
- Activity Feed: vertical timeline with category badges and media attachments.
- Accessibility: focus-visible styles on all interactive elements; aria-labels for icon-only buttons.

## Routing Corrections (Web)
- Book Visit → route to `/(tabs)/pets/add-visit` (or create `/web/pets/visit/new` that reuses the same form component).
- Add Vaccine → route to `/(tabs)/pets/add-vaccination` (or `/web/pets/vaccination/new`).
- Add Meds → route to `/(tabs)/pets/add-treatment` (or `/web/pets/treatment/new`).
- Add Weight → route to `/(tabs)/pets/log-weight` (or `/web/pets/weight/log`).
- Add Photo → route to `/(tabs)/pets/add-photos` (or `/web/pets/photos/add`).
- Update `components/desktop/dashboard/QuickActionsGrid.tsx:21, 28–50` to use the dedicated routes above.
- Fix `components/dashboard/QuickActionsPanel.tsx:42, 49, 56` by replacing missing routes (`add-image`, `add-document`, `add-record`) with existing ones (`add-photos`, document upload if available) or removing until implemented.

## Implementation Steps
1. Audit dashboard code paths and extract shared UI primitives for cards, chips, and grids.
2. Update `app/web/dashboard/index.tsx` structure to match design: sidebar, header, sections, and responsive grid.
3. Apply typography, icon, spacing, and color tokens consistent with the design; ensure Tailwind config supports these tokens or use utilities directly.
4. Refactor Pets cards to match design interactions and add the dashed "Add New Pet" card.
5. Replace Web Quick Actions routing targets in `components/desktop/dashboard/QuickActionsGrid.tsx` with dedicated form routes.
6. Align `components/dashboard/QuickActionsPanel.tsx` to existing routes; remove or rewire non-existent paths.
7. If web-specific form pages are preferred, create `/web/pets/...` pages that reuse the existing mobile form components.

## Verification
- Click each Quick Action on web dashboard: confirm it opens the correct form screen, not add-pet.
- Visual check against `Designs/web/dashboard/screen.png` for layout, hover, and spacing fidelity.
- Add lightweight navigation tests (Playwright) to assert button → route mapping for Visit/Vaccine/Meds/Weight/Photo.

## Deliverables
- Updated web dashboard layout and styles aligned to the design.
- Correct Quick Action routing for all actions on the web dashboard.
- Optional new web form pages reusing shared components, if needed.