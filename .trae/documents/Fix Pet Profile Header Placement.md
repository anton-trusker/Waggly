## Goal
- Place the global header at the very top of the Pet Profile screen (above tabs), showing the page title inside the header.
- Ensure the header appears across all tabs for pet detail, not only the Main tab.

## Current State
- The Pet Profile screen renders `AppHeader` inside the Main tab only (`app/(tabs)/pets/pet-detail.tsx:216–219`).
- This makes the header scroll with the Main tab content and disappear on other tabs.

## Changes
1. Move header to top of screen:
   - In `app/(tabs)/pets/pet-detail.tsx`, render `<AppHeader title="Pet Profile" showBack onBack={router.back} />` once, above the tabs and scrollable content.
   - Remove the existing `AppHeader` from `renderMainTab`.

2. Keep styling consistent:
   - Use existing `AppHeader` gradient and spacing.
   - Verify `styles.tabContentContainer` / `styles.container` top padding so content doesn’t overlap the header.

3. Apply to all tabs:
   - Since header is now outside tab content, it will be visible for Main, Details, Health, Photos, and Documents tabs.

4. Verify behavior:
   - Back button returns to the previous route.
   - Page title reads “Pet Profile” in the header.
   - Content scrolls below the header without overlap on small/large screens.

## Testing
- Run on mobile and web, switch tabs to confirm the header remains at the top.
- Confirm no duplicate headers and that the profile card area retains pet name and details as before.

## Scope
- Only `app/(tabs)/pets/pet-detail.tsx` changes are required; no modifications to `AppHeader` or other pages.