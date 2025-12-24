## Overview
- Create a reusable header that matches the main page top header (user avatar, greeting, notifications icon, gradient background) and use it across all app pages.
- Keep page-specific titles inside the header and preserve current navigation behavior.

## Component Design
- Create `components/layout/AppHeader.tsx` that renders:
  - Left: user avatar (from profile image), greeting with first name.
  - Center/Right: page title styled prominently.
  - Right: notifications icon with badge, press navigates to `/(tabs)/notifications`.
  - Optional back button for nested detail screens (e.g., pet detail) when needed.
- Props: `{ title?: string; showBack?: boolean; onBack?: () => void; }`.
- Internal hooks: `useProfile`, `useAuth` (for avatar/name); optional `usePathname` for title defaults.

## Styling
- Reuse main page colors (`colors.backgroundGradientStart`, `colors.backgroundGradientEnd`) via `LinearGradient` for header background.
- Adopt sizes/paddings from existing home header (`homeStyles.headerGradient`, `homeStyles.header`, `homeStyles.userInfo`, `homeStyles.avatar`, `homeStyles.avatarImage`).
- Standard header height and spacing suitable across 320–1440px widths; ensure touch targets ≥ 48x48.
- Extract header-specific styles into `components/styles/headerStyles.ts` to avoid route misclassification and ensure reuse.

## Image Resolution
- Implement a small utility inside the header (or `lib/images.ts`) to resolve profile image URLs:
  - Prefer `profile.photo_url`; fallback to `profile.avatar_url`.
  - If the value is a storage-relative path (`user-photos/...`), call `supabase.storage.from('user-photos').getPublicUrl(...)` to get a public URL.
  - If missing/invalid, show fallback emoji (first letter of first name).

## Page Integrations
- Replace ad‑hoc header code in:
  - `app/(tabs)/(home)/index.tsx` (use `<AppHeader title="Home" />`).
  - `app/(tabs)/calendar.tsx` (use `<AppHeader title="Calendar" />`).
  - `app/(tabs)/pets/index.tsx` (use `<AppHeader title="My Pets" />`).
  - `app/(tabs)/pets/pet-detail.tsx` (use `<AppHeader title={pet.name} showBack onBack={router.back} />`).
  - `app/(tabs)/notifications.tsx` (use `<AppHeader title="Alerts" />`).
  - `app/(tabs)/profile.tsx` (use `<AppHeader title="Profile" />`).
- Keep `Stack` headers hidden in layouts (`headerShown: false`) and render this header within the page component near the top, above content scroll.

## Navigation Behavior
- Notifications icon press → `router.push('/(tabs)/notifications')`.
- Optional back button when not on a root tab route.
- Maintain existing FloatingTabBar and plus button; header sits at top and does not interfere.

## Accessibility & Responsiveness
- Avatar and notification icons sized for ≥48x48 touch area.
- Title scales and truncates correctly on narrow screens; use single-line with ellipsis where needed.
- Verify on 320px, 390px (iPhone 13), 768px, 1024px, 1280–1440px.

## Verification
- Add the header to each page and run the app on web and a mobile simulator.
- Check profile image renders, greeting shows first name, page title is inside header, and notifications icon works across all pages.

## Notes
- No changes to business logic or data fetching beyond reading `useProfile`.
- Header styles and layout will be consistent with the main page’s current visuals while centralized for reuse.