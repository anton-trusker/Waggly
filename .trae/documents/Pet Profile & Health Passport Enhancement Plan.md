# Pet Profile & Health Passport Enhancement Plan

I have analyzed the current project structure, database schema, and existing components. Here is the plan to implement the comprehensive Pet Profile and Health Passport features.

## 1. Database Enhancements
We need to store documents (vet records, prescriptions) separately from general pet photos.
- **Create `documents` table**:
  - Columns: `id`, `pet_id`, `type` (passport, certificate, prescription, lab_result, other), `file_url`, `file_name`, `created_at`.
  - Enable RLS policies for security.
- **Update Types**: Update `types/db.ts` and `types/index.ts` to include the new `Document` type.

## 2. Backend & Hooks
- **Create `useDocuments` hook**: To fetch, upload, and delete documents for a pet.
- **Update `usePets` hook**: Ensure `photo_gallery` (array of strings) is properly handled for general pet memories.

## 3. Frontend: Unified Health Wizard (`health-wizard.tsx`)
Create a new comprehensive wizard to replace/unify the separate "Add" screens.
- **Step 1: Type Selection**: User selects Vaccination, Treatment, or Medical Visit.
- **Step 2: Details Entry**:
  - **Vaccination**: Select from reference list (prefills category, validity), or manual entry.
  - **Treatment**: Select from reference list, or manual entry.
  - **Visit**: Date, Vet/Clinic, Reason, Notes.
- **Step 3: Document Upload**: Upload a photo of the vaccine sticker, prescription, or receipt.
- **Step 4: Reminders**: Confirm next due date (calculated from validity) to set a reminder.

## 4. Frontend: Pet Profile Dashboard (`pet-detail.tsx`)
Refactor the profile screen to match the requirements.
- **Header**: Add **Microchip Number** display.
- **Tabs**:
  - **About**: Enhanced details (as requested).
  - **Health (Passport)**:
    - **Timeline View**: Show vaccinations and treatments in a chronological list (not just buttons to add them).
    - **Grouped View**: Separate sections for "Vaccinations" and "Treatments" for easy scanning.
  - **Gallery (Memories)**:
    - Grid view of `pet.photo_gallery`.
    - Upload button for new photos.
  - **Documents**:
    - List view of files from the `documents` table.
    - Icons based on file type (PDF, Image).

## 5. Implementation Order
1.  **Database**: Create `documents` table.
2.  **Hooks**: Implement `useDocuments`.
3.  **Wizard**: Build the `HealthWizard` component.
4.  **Profile**: Refactor `PetDetailScreen` to display the new data and tabs.

---

## 6. Detailed Specifications

### 6.1 Pet Profile Data Model
- Core fields (extend `pets`):
  - `name` (string, required)
  - `species` (enum: dog, cat, other; required)
  - `breed` (string, optional; backed by breeds catalog)
  - `gender` (enum: male, female; optional)
  - `date_of_birth` (date, optional)
  - `age_approximate` (string, optional; used when DoB unknown)
  - `size` (enum: small, medium, large; optional)
  - `weight` (number, optional; kg with 0.1 precision)
  - `color` (string, optional)
  - `is_spayed_neutered` (boolean, optional)
  - `microchip_number` (string, optional; validate length 10–15, digits and letters)
  - `registration_id` (string, optional; vet passport/registration number)
  - `photo_url` (string, optional)
  - `photo_gallery` (string[]; optional; user memories)
- Additional health context:
  - Allergies (free-text)
  - Chronic conditions (free-text)
  - Diet notes (free-text)
  - Behavior tags (`behavior_tags` table already present)
- Important dates (stored or derived):
  - Adoption date (date, optional)
  - Next vaccination due (derived from `vaccinations.next_due_date`)
  - Next treatment due (derived from `treatments.end_date` or schedule)

### 6.2 Health Passport Data Model
- Vaccinations (`vaccinations` exists): extend and standardize
  - Current columns: `vaccine`, `date_administered`, `next_due_date`, `notes`
  - Recommended extension columns:
    - `category` (enum: core, non_core)
    - `manufacturer` (string)
    - `batch_number` (string)
    - `dose_number` (int; 1..n)
    - `admin_vet` (string)
    - `clinic_name` (string)
    - `attachment_urls` (string[]; vaccine sticker photos)
  - Status logic:
    - Up to date: `next_due_date` > today + 30d
    - Due soon: today <= `next_due_date` <= today + 30d
    - Overdue: `next_due_date` < today
- Treatments (`treatments` exists):
  - Current columns: `type`, `medication`, `dosage`, `start_date`, `end_date`, `notes`
  - Recommended extension columns:
    - `schedule` (string; e.g., every 30 days)
    - `admin_method` (enum: oral, topical, injection)
    - `attachment_urls` (string[]; prescription, packaging)
    - `is_active` (boolean; whether ongoing)
- Medical appointments (new table: `medical_visits`):
  - Columns: `id`, `pet_id`, `date`, `clinic_name`, `vet_name`, `reason`, `diagnosis`, `procedures`, `prescriptions`, `notes`, `attachment_urls`, `created_at`, `updated_at`
  - RLS policies same as other pet-scoped tables

### 6.3 Documents Repository (`documents` table)
- Columns: `id (uuid)`, `pet_id (uuid)`, `type (enum)`, `file_url (string)`, `file_name (string)`, `mime_type (string)`, `size_bytes (int)`, `created_at (timestamp)`
- `type` enum values:
  - `passport`, `certificate`, `prescription`, `lab_result`, `invoice`, `insurance`, `microchip_registration`, `other`
- Indexes:
  - `idx_documents_pet_id` for quick filtering
  - `idx_documents_type` for category views
- RLS:
  - Enable and restrict by owning `pets.user_id = auth.uid()`
- Storage:
  - Use Supabase Storage bucket `pet-documents/` with path: `pet_id/YYYY/MM/<uuid>-<sanitized-file-name>`

### 6.4 API & Hooks
- `usePets`:
  - Read/write extended pet fields
  - Manage `photo_gallery` append/remove and captions (optional future: `photo_gallery_meta` table)
- `useVaccinations`:
  - CRUD with status calculation helper
  - Prefill logic given vaccine type reference (see §6.6)
- `useTreatments`:
  - CRUD with activity flags and schedule helpers
- `useMedicalVisits`:
  - CRUD for appointments with attachments
- `useDocuments`:
  - List, upload, delete documents for a pet
  - Client-side mime validation and size limits (images/PDF <= 10MB)

### 6.5 Pet Profile Dashboard (`app/(tabs)/pets/pet-detail.tsx`)
- Header:
  - Avatar/photo, name, breed
  - Microchip number prominent under name
  - Edit button for quick profile updates
- Tabs:
  - About: full profile info grid (name, gender, size, weight, color, spayed/neutered, DoB/age, adoption date)
  - Health (Passport):
    - Timeline combining vaccinations, treatments, and medical visits
    - Grouped lists: Vaccinations, Treatments, Visits with status badges
    - Quick actions: Add vaccination, Add treatment, Add visit
  - Gallery (Memories):
    - Responsive grid of `photo_gallery`
    - Upload CTA; optional caption & date
  - Documents:
    - List with icons by `mime_type`
    - Preview (images inline, PDFs open in viewer)

### 6.6 Unified Health Wizard (`health-wizard.tsx`)
- Step 1: Select entry type
  - Options: Vaccination, Treatment, Medical Visit
  - Brief descriptions under each
- Step 2: Details
  - Vaccination:
    - Type selection via searchable reference list (core/non-core); manual name entry allowed
    - On type select, prefill: `vaccine`, `category`, typical `validity` months, next due calculation
    - Fields: vaccine name, category, date administered, dose number, manufacturer, batch number, administering vet, clinic, notes
  - Treatment:
    - Type selection (deworming, flea/tick, heartworm, medication course); optional medication name
    - Fields: medication, dosage, start date, end date, schedule (repeat cadence), administration method, notes
  - Medical Visit:
    - Fields: date, clinic name, vet name, reason, diagnosis, procedures, prescriptions, notes
- Step 3: Attachments
  - Upload photos: vaccine sticker, prescription, receipt; multiple files
  - Accept `image/*` and `application/pdf`
- Step 4: Reminder
  - Auto-calculate next due (vaccinations based on validity; treatments based on schedule; visits optional follow-up)
  - Allow user adjustments; create calendar event and notification
- UX requirements:
  - Inline validation, clear error messages
  - Save as draft and resume later
  - Progress indicator and back/next controls always visible

### 6.7 Reference Data
- Vaccine reference list:
  - Core dog: Rabies, Distemper, Parvovirus, Adenovirus (DHPP)
  - Core cat: Rabies, Panleukopenia, Herpesvirus-1, Calicivirus (FVRCP)
  - Non-core examples: Leptospirosis, Bordetella, Lyme, FeLV (cats)
  - Each entry: name, species, category, typical validity months, optional manufacturer notes
- Treatment types:
  - Deworming, Flea/Tick, Heartworm prevention, Antibiotic course, Anti-inflammatory, Supplement

### 6.8 Reminders & Calendar Integration
- Event creation for upcoming due dates and treatment schedules
- Priority calculation as in `hooks/useEvents.ts` (due soon/overdue logic)
- Notification settings page integration with user preferences

### 6.9 Documents & Gallery UX
- Documents:
  - Filter by type, sort by date
  - Empty state with guidance
  - Delete with confirmation
- Gallery:
  - Grid with lazy loading
  - Add photo, remove photo, set cover
  - Optional captions and timestamps

### 6.10 Accessibility & i18n
- WCAG AA contrast targets using theme colors
- Keyboard navigation for wizard controls
- Screen reader labels for inputs and attachments
- Date/number localization; units preference (kg/lb)
- Language-ready labels; avoid hardcoded strings

### 6.11 Design Tokens (align with `constants/theme.ts`)
- Colors:
  - `primary` `#0A84FF`, `primaryLight` `#9CC6FF`, `primaryDark` `#0062D6`
  - `background` `#FFFFFF`, `card` `#FFFFFF`
  - `text` `#111827`, `textSecondary` `#6B7280`, `textTertiary` `#C7C7CC`
  - `accent` `#FF9500`, `success` `#10B981`, `warning` `#FF9500`, `error` `#EF4444`
  - `border` `#E5E7EB`, `separator` `#E5E7EB`, `highlight` `#F8FAFC`
- Spacing:
  - `xs:4`, `s:8`, `m:16`, `l:24`, `xl:32`, `xxl:48`
- Typography:
  - Title: 34/700, Subtitle: 22/600, Body: 17/400, Caption: 15/400
- Radius:
  - `s:8`, `m:12`, `l:16`, `xl:25`, `round:9999`

### 6.12 Performance & Storage
- Image compression before upload; enforce max 10MB
- Paginate gallery and documents lists
- Use optimistic UI for adds; rollback on failure
- Cache reference lists locally; refresh periodically

### 6.13 Security & Privacy
- RLS for all pet-scoped tables (vaccinations, treatments, visits, documents)
- Do not log sensitive IDs (microchip, registration) to analytics
- Signed URLs for document access; short expiry

### 6.14 Testing & QA
- Unit tests for hooks: CRUD operations and status calculations
- Integration tests for wizard flows and reminders
- Manual QA based on `TESTING_GUIDE.md` sections for vaccinations, treatments, and pet details

### 6.15 Implementation Roadmap (Expanded)
1. Database migrations:
   - Add `documents` table
   - Extend `vaccinations`/`treatments` with suggested columns
   - Create `medical_visits`
2. Types update in `types/db.ts` and `types/index.ts`
3. Hooks: `useDocuments`, `useMedicalVisits`, extend `useVaccinations`/`useTreatments`
4. Build `HealthWizard` and integrate into `pet-detail.tsx`
5. Refactor Pet Profile tabs and add Documents/Gallery UIs
6. Notifications and calendar event wiring
7. Accessibility/i18n review and adjustments
8. QA and polish

---

## 7. UI Layout Specifications (Best-in-Class)

### 7.1 Global Layout & Patterns
- Top safe area padding: `60` for headers
- Content horizontal padding: `20`
- Card component:
  - Background: `colors.card`, radius: `16`, padding: `16`
  - Shadow: opacity `0.06`, radius `12`, offset `{0,2}`
- List rows:
  - Height: `60–72`, horizontal padding: `16`, divider `colors.border`
- Touch targets: minimum `44x44`
- Icon sizes: `20–24`, status badges text `12–13`
- Spacing system: 8pt grid (`xs:4, s:8, m:16, l:24, xl:32`)
- States: default, pressed, focused, disabled, loading; maintain WCAG AA contrast
- Feedback: inline validation, toasts for success/error, skeleton loaders for lists and cards

### 7.2 Pet Detail — About Tab
- Header
  - Layout: back button `44x44` left, centered title stack (name + breed), actions (edit) right
  - Title: `17/600`, Subtitle: `13` `colors.textSecondary`
- Profile Hero
  - Photo/avatar: `120x120`, radius `60`; emoji fallback `fontSize:60`
  - Name row: `28/700` + edit icon `32`
  - Breed line: `15` `colors.textSecondary`
- Info Grid (two columns)
  - Items: label `13` secondary, value `17/600`
  - Fields: gender, size, weight, color, spayed/neutered, DoB/age, adoption date, microchip
- Important Dates Cards
  - Card row with icon `20`, title `15/600`, value `15`
  - Examples: next vaccination due, next treatment due
- Actions
  - Primary button: `Add Health Record` (opens wizard)

### 7.3 Pet Detail — Health (Passport) Tab
- Segment controls: `Vaccinations`, `Treatments`, `Visits` — pill buttons with active border `colors.primary`
- Timeline
  - Group by month; section header background `colors.highlight`
  - Item: left icon (type), main line `16` label, subline `13` details (date, clinic), right status chip
  - Status chips: Up to date (green), Due soon (amber), Overdue (red); `12/700`
- Grouped Lists
  - Vaccinations card: list rows with vaccine name, date given, next due, dose
  - Treatments card: type/medication, schedule, start–end
  - Visits card: date, clinic, reason, notes presence indicator
- CTA Row (sticky footer)
  - Buttons: `Add Vaccination`, `Add Treatment`, `Add Visit`; secondary outline for non-primary

### 7.4 Pet Detail — Gallery (Memories) Tab
- Grid
  - 3 columns mobile, gap `8`, item `square` with radius `12`
  - Lazy loading and shimmer placeholders
- Top Row
  - Upload button, filter by year/event
- Image Preview
  - Full-screen viewer with caption, date; actions: set cover, delete

### 7.5 Pet Detail — Documents Tab
- Filter Header
  - Segments: All, Passport, Prescription, Lab Result, Invoice, Insurance, Microchip
- List
  - Row: leading icon (file type), title (file_name), subtitle (type + created_at), trailing chevron
  - Empty state: illustration + guidance text `14` secondary
- File Preview
  - Images inline in lightbox; PDFs open system viewer; delete with confirm

### 7.6 Health Wizard (`health-wizard.tsx`)
- Top Header
  - Back pill `60x44`, centered step label `13` secondary, progress indicator
- Step 1 — Type Selection
  - Cards (3): Vaccination, Treatment, Medical Visit; icon `28`, label `16/700`, helper `13`
- Step 2 — Details
  - Form sections with titles `15/600`
  - Inputs: height `44`, radius `10`, label `13` secondary
  - Searchable selects (vaccine/treatment type) with bottom sheet max height `70%`
  - Date inputs with calendar icon button `44x44`
- Step 3 — Attachments
  - Upload tiles `120x120`, drag-like affordance; accept `image/*, application/pdf`
  - Show upload progress and file size
- Step 4 — Reminder
  - Next due calculator preview; toggle create event; date picker
- Footer CTA (sticky)
  - Back pill, Next primary button (full-width), disabled until valid

### 7.7 Vaccination Details Page
- Header: vaccine name, status chip
- Summary Card: date given, dose, manufacturer, batch, administering vet, clinic
- Next Due Card: date, badge (up to date/due soon/overdue)
- Attachments gallery row; edit/delete actions

### 7.8 Treatment Details Page
- Header: treatment type/medication, active badge
- Schedule Card: dosage, cadence, admin method, start–end
- Notes Card
- Attachments row; edit/delete actions

### 7.9 Medical Visit Details Page
- Header: date + clinic
- Reason & Diagnosis Cards
- Procedures & Prescriptions Cards
- Attachments row; edit/delete actions

### 7.10 Upload Flow (Photos & Documents)
- Picker modal: camera or library; file type restrictions
- Pre-upload preview with filename edit
- Error states: file too large, unsupported type, upload failed (retry)

### 7.11 Empty & Loading States
- About: placeholder avatar, guidance to edit profile
- Health: illustration with `Add vaccination/treatment/visit` CTA
- Gallery: empty grid with upload CTA
- Documents: empty card with upload CTA
- Skeletons: cards with shimmer bars, list rows placeholder

### 7.12 Accessibility
- Labels for all inputs; `accessibilityRole` on buttons, tabs, list items
- Focus order logical; visible focus for selects and buttons
- Contrast: ensure text on `colors.text` vs `colors.card` meets AA
- Haptics: light impact on success, error vibration on invalid submit

### 7.13 Metrics & Performance
- List virtualization for timeline and documents
- Image thumbnail generation to reduce payloads
- Debounced search in reference lists

### 7.14 Cross-Platform Considerations
- iOS: large titles, native date pickers; Android: material date pickers consistency
- Safe area respect for notch devices
- Keyboard avoidance in forms; sticky footer lifts above keyboard
