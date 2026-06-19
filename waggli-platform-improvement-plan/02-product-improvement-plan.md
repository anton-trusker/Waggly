# 02 - Product Improvement Plan

## Product North Star

Waggli should be the trusted pet health passport: complete, shareable, AI-assisted, and useful in urgent real-world contexts like vet visits, travel, medication care, boarding, and emergencies.

## P0 - Stabilize The Core Passport Product

### Auth & Profile

Improve:

- Finish onboarding as a reliable user profile setup, not just a modal.
- Store language, country, notification preferences, and consent choices.
- Add account deletion/export flows for GDPR readiness.
- Fix brand name across auth screens.

Success criteria:

- New user can sign up, finish onboarding, create first pet, and return later with persisted session.
- Profile has country/language because these drive travel, reminders, localization, and compliance.

### Pet Profile

Improve:

- Treat pet profile as the root object for the whole app.
- Keep the 4-step wizard but align fields to canonical DB.
- Add behavior/lifestyle/genetics as secondary sections, not required MVP steps.
- Improve breed autocomplete using comprehensive dog/cat CSV data.
- Generate passport ID at pet creation.

Success criteria:

- Pet identity, photo, species, breed, age, weight, microchip, and ownership are stable.
- Pet detail tabs are powered by one consistent pet model.

### Health Records

Improve:

- Standardize record types: visits, vaccinations, medications, treatments, allergies, conditions, metrics, weight, BCS, dental, wellness.
- Make each form use canonical table names and date fields.
- Add document linking to health records.
- Generate reminders from vaccines, medications, and treatments.
- Track source of data: manual, OCR, AI, provider, import.

Success criteria:

- Health timeline shows all record types consistently.
- Passport updates automatically when a health record changes.
- The app can calculate a meaningful health score.

### Digital Passport

Improve:

- Make passport the read model/summary of pet identity + health + documents, not a separate disconnected form.
- Add offline cache for mobile.
- Add QR sharing with expiry and scope.
- Add PDF export later, after data model is stable.
- Track passport version history.

Success criteria:

- Owner can show a trusted, readable pet passport in less than 10 seconds.
- Shared passport never exposes more than the selected scope.

### Documents & OCR

Improve:

- Standardize storage buckets and metadata.
- Add OCR job lifecycle: uploaded, queued, processing, needs_review, confirmed, failed.
- Store extracted fields separately before writing health records.
- Support document links to visits, vaccines, medications, passports, insurance, providers.

Success criteria:

- User uploads a vaccine certificate and can confirm extracted vaccine/date/provider fields.
- Sensitive documents remain private unless explicitly shared.

### Sharing & Collaboration

Improve:

- Consolidate `public_shares`, `share_links`, and `pet_share_tokens` into one model.
- Add roles: primary owner, co-owner, editor, viewer, provider-view.
- Add audit logs for access and changes.
- Add immediate revocation.

Success criteria:

- Owner can invite a co-owner.
- Owner can generate a temporary QR/passport link.
- Access can be revoked instantly.

## P1 - Make The Product Intelligent

### Calendar & Reminders

Improve:

- Create canonical event model with recurrence rule.
- Generate events from health records.
- Add native calendar export/sync later.
- Add snooze, completion, and escalation behavior.

### AI Assistant

Improve:

- Start with narrow, safe AI flows: OCR confirmation, natural-language record drafting, reminder creation.
- Avoid diagnostic claims. Use triage language and clear disclaimers.
- Store AI conversations and extractions with user corrections.
- Track cost per user and feature.

### Monetization

Improve:

- Add entitlements before payments UI gets complex.
- Model free vs premium limits: pets, storage, AI queries, co-owners, passport features.
- Integrate Stripe only once entitlements are clear.

## P2 - Provider Ecosystem

Improve:

- Add provider profile, services, verification, and subscription tables.
- Start with directory + professional sharing before full marketplace booking.
- Vet/provider write access should require explicit grants.
- Provider billing can be subscription-led before commission-led marketplace.

## P3 - Community/Social

Improve:

- Keep social network out of MVP DB unless needed for lost pet/community alerts.
- Build only after health/passport retention is proven.
- Start with lost pet alerts and local events, not full social feed.

## Cross-Cutting Improvements

- Rename product-facing text to Waggli.
- Freeze table names and generated TypeScript types.
- Add golden-path automated tests.
- Reduce `any` usage and scattered Supabase calls.
- Move domain data logic into a typed service layer.
- Create a single roadmap that resolves duplicate docs.
