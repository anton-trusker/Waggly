## Onboarding Form
- Create `app/(auth)/onboarding.tsx` with required fields: `first_name`, `last_name` (mandatory), `country`, `language`, `date_of_birth`, `photo_url`.
- Add validation: required checks, dd-mm-yyyy format, and inline errors; prevent continue until valid.
- Build components:
  - `components/CountrySelect.tsx`: searchable dropdown; full ISO 3166 list; flag rendered via emoji regional indicators from `country_code` with text fallback.
  - `components/LanguageSelect.tsx`: searchable dropdown; full ISO 639-1 list; flag icon based on best-match country (use emoji for now) or language initial badge.
  - `components/DateInput.tsx`: auto-inserts hyphens to `dd-mm-yyyy`, validates, shows a calendar icon button; opens `@react-native-community/datetimepicker` to pick date.
  - `components/AvatarUpload.tsx`: reuse current picker, hook to user photo upload.
- Data model:
  - Ensure `profiles` table has columns: `first_name`, `last_name`, `country_code`, `language_code`, `date_of_birth`, `photo_url`. If absent, add a migration later; for now, code reads/writes these fields.
  - Add `lib/storage-user.ts` with `uploadUserPhoto(userId, uri)` that saves to `user-photos/{userId}/profile/<timestamp>.jpg` and returns a public URL; store into `profiles.photo_url`.
- Flow:
  - After signup, route to onboarding; on save, persist profile, then route to `/(tabs)/(home)`.

## Display Profile Photo Everywhere
- Dashboard header avatar: show `profiles.photo_url` if present; fallback to initial.
- User profile page(s): use `profiles.photo_url`; provide edit action to change photo.
- Ensure auth context exposes `profile` with photo URL; re-fetch and update after onboarding save.

## Calendar Page: Month View & Filtering
- Replace header image on `app/(tabs)/calendar.tsx` with a month-view calendar component `components/CalendarMonthView.tsx` implemented as a grid (Sun–Sat header, 5–6 rows) with today highlight.
- Add view switch (e.g., Month / List) as segmented control; default to Month.
- Clicking a date filters `useEvents` to that day; below the calendar, show Upcoming events list for selected day; add “Show all upcoming” toggle.
- Keep existing pet/type filters; combine with date filter.

## Accessibility & UX
- Add `accessibilityRole`, `accessibilityLabel`, and keyboard navigation to dropdowns and date picker toggle.
- Support long lists performance with `FlatList` + simple `includes` search; throttle input.

## Validation & Utils
- Extend `utils/validation.ts` with `formatDDMMYYYY(input)` and `isDDMMYYYY(value)` + `toISODate(value)`.
- Ensure date picker updates text input consistently and vice versa; on save, store ISO `yyyy-mm-dd` in DB while displaying `dd-mm-yyyy`.

## Testing
- Unit tests: date input auto-format and validation; country search; language search; `useEvents` date filtering.
- Smoke test: onboarding save updates `profiles.photo_url`, dashboard avatar reflects new photo.

## Delivery & Verification
- Wire routing: add onboarding route after signup; guard to prevent skipping when mandatory fields missing.
- Run web preview and verify: onboarding validations, dropdown search, emoji flags, date picker, photo upload stored and visible on dashboard/profile.
- Confirm calendar: month view renders, date click filters events, upcoming list visible.

## Follow-ups (Optional)
- Flags: If emoji support is insufficient on Android, add lightweight flag assets for top countries; later integrate a flag package.
- Migrations: add SQL migration to create missing `profiles` columns, and create `user-photos` bucket policies.
- i18n: localize labels using existing or minimal i18n setup.
