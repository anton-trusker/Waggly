## Overview
Implement a polished 4-step pet registration wizard with dynamic breed data, calendar-based birthdate selection with automatic age calculation, robust photo upload, and responsive, accessible UI that aligns with your Figma references.

## Flow & Screens
1. Step 1 — Type
- Dog / Cat / Other with icons and radio selection
- Search filter on species list
- If Other, show free-text species

2. Step 2 — Breed (dogs/cats only)
- Dynamic list sourced from DB `breeds` table
- Search filter; fast querying with index
- Fallback to curated local list if DB empty
- Hidden when type is Other (skips to Step 3)

3. Step 3 — Details
- Photo upload with preview and validation
- Name input (required)
- Birthdate via calendar
- Automatic age calculation shown as “X years Y months”
- Manual age fallback when birthdate not provided

4. Step 4 — Additional Info
- Gender selection with icon-based bullets (male/female)
- Color, microchip (optional)
- Size field removed per requirement
- Clear, concise hints under each field

## Calendar & Age
- Use `@react-native-community/datetimepicker` for birthdate
- Age calc helper: compute years/months from selected birthdate
- Show live age text next to date; update as user changes date
- Manual age input appears only when birthdate is unset

## Database: Breeds
### Schema
- Table: `breeds`
  - `id uuid primary key`
  - `species text check in ('dog','cat')`
  - `name text not null`
  - Indexes: `(species)`, `(species, name)`, `gin` on `name` for search (optional)

### Seeds
- Populate complete dog and cat breed lists (Akita, Beagle, … for dogs; Siamese, Persian, … for cats)
- Provide SQL seed files (`supabase/migrations/.../seed_breeds.sql`)

### Queries
- Breed step fetch: `supabase.from('breeds').select('name').eq('species', type).ilike('name', %query%)`
- Paginate for performance; debounce search input
- Fallback list when query returns 0 results or table absent

## UI/Visual System
- Consistent spacing (8/12/16 grid), touch target ≥44px
- Clear section headers and progress indicator (Step X/4)
- Hints below inputs (e.g., “Upload a clear photo of your pet’s face”)
- Bottom CTA bar fixed; content uses bottom padding to avoid overlay
- Gender selection: round icon bullets (♂/♀), accessible labels
- Remove any adoption date UI remnants

### Design Tokens
- Colors
  - Primary: `#0A84FF`
  - Primary/Pressed: `#0062D6`
  - Primary/Disabled: `#9CC6FF`
  - Text/Primary: `#111827`
  - Text/Secondary: `#6B7280`
  - Border: `#E5E7EB`
  - Background: `#FFFFFF`
  - Background/Subtle: `#F8FAFC`
  - Success: `#10B981`
  - Error: `#EF4444`
- Typography
  - Title: SF Pro Text Semibold 17
  - Subtitle: SF Pro Text Regular 13
  - Body: SF Pro Text Regular 15
  - Label: SF Pro Text Medium 13
  - Numeric Emphasis: SF Pro Display Bold 48
- Spacing scale
  - `4, 8, 12, 16, 20, 24, 32, 40`
- Radii and strokes
  - Avatar: 96–128 circular
  - Input: 12 radius, 1px border `#E5E7EB`
  - CTA buttons: 12 radius
- Shadows
  - Card/Modal: iOS `shadowColor #000`, `opacity 0.08`, `radius 12`, `offset (0,6)`; Android `elevation 6`

### Header & Progress
- Title area shows `Add Pet Profile` with a centered title and step subtitle
- Back action: left chevron hit area `44×44` with `accessibilityLabel="Back"`
- Step indicator: top-right `Step X/4` using Label typography and `Text/Secondary`
- Bottom progress bar under header: 2px accent line reflecting current step

### Search Field (Breed)
- Field
  - Height `48`, radius `12`, border `#E5E7EB`, background `#F8FAFC`
  - Left icon: magnifier `24×24` with `Text/Secondary`
  - Placeholder: `Search by animal species`
  - Debounce `250ms` before querying
- Behavior
  - Clear button appears when text length `>0`
  - Keyboard return triggers fetch; results update inline
  - Empty state: `No breeds found` with guidance to try another term
- Accessibility
  - `accessibilityRole="search"`, label `Search by animal species`
  - Ensure announce of result count changes

### Breed List
- Item height `56`, horizontal padding `16`, divider color `#E5E7EB`
- Selection control: right-aligned radio
  - Unselected: 20 outer stroke `#D1D5DB`
  - Selected: 20 stroke `#0A84FF` with 10 inner fill `#0A84FF`
- Text: Body typography, color `Text/Primary`
- States
  - Default, Pressed (background `#F3F4F6`), Disabled (opacity `0.5`)
- Performance
  - Virtualized list, `getItemLayout` for consistent row height
  - Paginated fetch `limit 50`, fetch-more on scroll end
- Misc
  - `Mixed Breed` always available when species is dog
  - When pet type is `Other`, skip Breed step

### Calendar Modal (Birthdate)
- Invocation
  - Button style: outline, radius `12`, height `48`, icon left `24×24`
  - Label `Add birth date`
- Modal presentation
  - Bottom sheet style with handle
  - Header icon and label `Birth date`
  - Year horizontal scroller, month tabs, day grid
  - Primary action `Save` full-width at bottom (height `52`)
- Constraints
  - Disable future dates
  - Leap year handling
  - Minimum year `1970`
- Age preview
  - Live text below field: `X years Y months` using Label typography
  - Updates on selection change
- Accessibility
  - Focus trap inside modal
  - `accessibilityRole="dialog"`, announce selected date

### Avatar & Photo Upload
- Avatar
  - Circle `128` with subtle ring `#E5E7EB`
  - Center overlay camera icon button `44×44`, radius `12`, shadow
- Validation
  - Types: `jpg`, `png`
  - Max size: `5MB`
  - Square crop recommended; auto-center face when possible
- Preview
  - Cropped to circle, cover fit, no distortion
- Error states
  - Inline message in `Error` color below avatar
- Accessibility
  - Upload button `accessibilityLabel="Add photo"`

### Bottom CTA Bar
- Fixed bar with safe-area padding; height `88` including inset
- Left: secondary rounded button `44×44` for Back
- Right: primary `Continue` button `minWidth 160`, height `52`
- Disabled state when validations fail
- Elevation/shadow matching Header

### Name Field
- Placeholder `Your pet’s name`
- Validation required; show hint below when empty on blur
- `autoCapitalize="words"`, `textContentType="name"`

### Gender Selection
- Two options with icon bullets and labels `Male`, `Female`
- Radio style as Breed list, horizontally spaced `12`
- Include `Prefer not to say` option for inclusivity

### Optional Weight Input (if enabled)
- Large numeric display using Numeric Emphasis typography
- Slider with tick marks; step `0.1` for `kg`, `0.2` for `lb`
- Unit toggle segmented control with `kg` default
- Auto-suggest initial value from breed average when available
- Validation range `0.1–120kg`

## Photo Upload
- Replace upload component with `expo-image-picker`
- Validation: file type (jpg/png), size (<5MB)
- Preview in circular avatar
- Upload to Supabase Storage (`profiles/<user_id>/<pet_id>.jpg`) after submission
- Show progress indicator during upload; retry on failure

### UI Details
- Avatar initial state shows placeholder silhouette
- Tap-to-upload from avatar or dedicated button below
- Progress indicator inline ring around avatar with percent text in center
- Retry state shows `Try again` text button next to error

## Form Logic & State
- Centralized wizard state (React) persisted across steps
- Conditional rendering for Breed step (only dog/cat)
- Validation per step (e.g., name required; birthdate OR manual age)
- Seamless next/back navigation; preserve values

### Validation Rules
- Step 1 Type: required
- Step 2 Breed: required for dog/cat; skipped for Other
- Step 3 Details: name required; birthdate optional but must be past date; if birthdate absent, manual age required
- Step 4 Additional: gender optional; color optional; microchip optional alphanumeric length `9–15`

### Accessibility
- Every interactive element `min 44×44`; labels on all controls
- Dynamic announcements for validation errors and step changes
- Keyboard-aware scroll prevents obscured inputs

## Responsiveness & Accessibility
- Keyboard-aware scroll for text fields
- Works on iOS/Android/Web (Expo)
- High-contrast text and accessible labels for screen readers
- Larger tap targets; no nested interactive controls per UX guidance

## Testing
- Manual test scripts covering:
  - Type → Breed (dog/cat) → Details → Additional
  - Calendar edge cases (leap years, future dates blocked)
  - Photo upload (valid/invalid type and oversize)
  - Breed search performance and fallback behavior
  - Conditional logic for Other type (no breed step)
- Unit helpers for age calculation

### Visual Regression Scenarios
- Breed list selection radio states and pressed feedback
- Calendar modal layout across iOS/Android/Web
- Avatar overlay button and progress ring
- Bottom CTA bar safe-area handling on devices with home indicator

### Accessibility Tests
- Screen reader traversal order per step
- Announcements for result counts and validation messages
- Focus management inside calendar modal

## Implementation Outline (Files)
- `app/(tabs)/pets/add-pet-wizard.tsx` — Refactor to 4-step flow, new UI and logic
- `hooks/useBreeds.ts` — DB-backed breeds + search + fallback
- `lib/age.ts` — Age calculation helper in years/months
- `supabase/migrations/*` — `breeds` table creation + seeds + indexes
- `styles/commonStyles.ts` — Reusable hints and layout tokens (if needed)

## Deliverables
- Fully functional 4-step wizard with validation and hints
- Dynamic breed lists (DB + seeded data)
- Calendar-based birthdate entry with automatic age
- Photo upload with preview and validation
- Responsive, accessible UI consistent with Figma

## Next Steps
- Proceed to refactor `add-pet-wizard.tsx` and add migrations/seeds
- After implementation, run platform tests (web/iOS/Android) and verify DB queries & uploads

## Modernization Addendum (Design System v2)
- Color tokens
  - Primary: `#0A84FF`
  - Primary/Pressed: `#0062D6`
  - Primary/Disabled: `#9CC6FF`
  - Text/Primary: `#111827`
  - Text/Secondary: `#6B7280`
  - Border: `#E5E7EB`
  - Background: `#FFFFFF`
  - Background/Subtle: `#F8FAFC`
  - Success: `#10B981`
  - Error: `#EF4444`
- Typography
  - Title: SF Pro Text Semibold 17
  - Subtitle: SF Pro Text Regular 13
  - Body: SF Pro Text Regular 15
  - Label: SF Pro Text Medium 13
  - Numeric Emphasis: SF Pro Display Bold 48
- Layout
  - Spacing: `4, 8, 12, 16, 20, 24, 32, 40`
  - Radii: inputs/buttons `12`, avatar circular `96–128`
  - Shadows: iOS `opacity 0.08`, `radius 12`, `offset (0,6)`; Android `elevation 6`

## Component Architecture (Expo/React Native)
- WizardHeader
  - Renders centered title `Add Pet Profile`, step subtitle, top-right `Step X/4`
  - Left back chevron hit area `44×44` with `accessibilityLabel="Back"`
  - Bottom 2px progress bar reflecting current step
- BottomCTA
  - Fixed safe-area bar, height `88`; left secondary back pill `44×44`, right primary `Continue` button `minWidth 160`, height `52`
  - Disabled state when validations fail
- SearchField
  - Debounced input `250ms`, `accessibilityRole="search"`, placeholder `Search by animal species`
  - Left magnifier icon `24×24`; clear button when text length `>0`
  - Announces result count changes
- Radio
  - 20 outer stroke `#D1D5DB`; selected adds 10 inner fill `#0A84FF`
- BreedList
  - `FlatList` with `getItemLayout` and pagination (`limit 50`), fetch-more on scroll end
  - Item height `56`, horizontal padding `16`, divider `#E5E7EB`
  - `Mixed Breed` always visible for dogs
- AvatarUpload
  - Uses `expo-image-picker`; validates `jpg/png`, `<5MB`
  - Circular preview with subtle ring `#E5E7EB`; overlay camera button `44×44`, radius `12`
  - Progress ring with percent text center; retry state with `Try again`
- CalendarSheet
  - Bottom-sheet dialog built with `Modal` + `react-native-reanimated` gestures
  - Header icon and label `Birth date`; year scroller, month tabs, day grid
  - Primary `Save` action full-width at bottom (height `52`)
  - Constraints: disable future dates, leap-year aware, min year `1970`
  - Fallback: `@react-native-community/datetimepicker` for platform-native selection
- SegmentedControl
  - For `kg`/`lb` unit toggle; default `kg`
- WeightSlider
  - Custom `react-native-gesture-handler` + `react-native-reanimated` slider with tick marks; step `0.1kg`/`0.2lb`
- AgeText
  - Uses `lib/age.ts` to compute `X years Y months`; updates live with birthdate changes

## Data & Queries (Supabase)
- Breeds
  - Table `breeds(species,name)` with indexes `(species)`, `(species,name)`, optional `gin` on `name`
  - Query: `supabase.from('breeds').select('name').eq('species', type).ilike('name', %query%)`
  - Fallback to curated local lists when query returns 0 or table absent
- Photos
  - Upload after submission to Supabase Storage: `profiles/<user_id>/<pet_id>.jpg`
  - Show progress indicator; allow retry on failure

## Accessibility & Responsiveness
- Tap targets `≥44×44`; labels on all controls
- Dynamic announcements for validation errors and step changes
- Focus trap inside calendar dialog; announce selected date
- Keyboard-aware scroll for text fields; support iOS/Android/Web (Expo)

## Image-to-Component Mapping
- Add Profile – Type
  - Components: `WizardHeader`, `SearchField`, list of species with `Radio`, `BottomCTA`
- Add Profile – Breed
  - Components: `WizardHeader`, `SearchField` (debounced), `BreedList` (`FlatList` + `Radio`), `BottomCTA`
- Add Profile – Name
  - Components: `WizardHeader`, `AvatarUpload`, name `TextInput`, `BottomCTA`
- Add Profile – Important Dates
  - Components: `WizardHeader`, `CalendarSheet` (with native picker fallback), age preview `AgeText`, `BottomCTA`
- Add Profile – Weight Filled
  - Components: `WizardHeader`, `WeightSlider`, `SegmentedControl` for `kg`/`lb`, `BottomCTA`

## Validation (Per Step)
- Step 1 Type: required; when `Other`, skip Breed
- Step 2 Breed: required for dog/cat
- Step 3 Details: name required; birthdate optional but must be past; if unset, require manual age
- Step 4 Additional: gender optional; color optional; microchip optional alphanumeric length `9–15`

## Proposed Component Extraction (Project-Wide)
- `components/WizardHeader.tsx`
- `components/BottomCTA.tsx`
- `components/SearchField.tsx`
- `components/Radio.tsx`
- `components/BreedList.tsx`
- `components/AvatarUpload.tsx`
- `components/CalendarSheet.tsx`
- `components/SegmentedControl.tsx`
- `components/WeightSlider.tsx`
- `lib/age.ts` (helper) and `hooks/useBreeds.ts` (query)

## Performance Improvements
- Breed list virtualization and pagination; `getItemLayout` for constant row height
- Debounced queries `250ms` and server-side `ilike` filtering
- Memoized radio rows; minimal re-renders via stable keys and `React.memo`
- Lazy-load calendar dialog; heavy assets deferred until opened
- Use `expo-haptics` for subtle feedback on selections

## Testing Updates
- Unit tests for `lib/age.ts`
- Integration tests for `SearchField` debounce and breed pagination
- Visual regression: header progress bar, radio states, calendar layout, avatar overlay, bottom CTA safe-area
