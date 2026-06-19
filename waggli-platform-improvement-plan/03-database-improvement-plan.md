# 03 - Database Improvement Plan

## Core DB Principle

The database must represent Waggli as a platform, not a single mobile app. The correct shape is domain-driven, pet-centered, and permission-aware.

## Canonical Ownership Model

Use:

- `auth.users.id` for auth identity.
- `profiles.id = auth.users.id` for user profile.
- `pets.user_id` for primary owner.
- `pet_id` on child records.
- `co_owners` for collaboration.
- `public_shares` for public/professional links.

Avoid:

- Duplicating `owner_id` in every child table.
- Having `user_id`, `owner_id`, `main_owner_id`, `profile_id` all mean ownership in different places.
- Multiple sharing tables for the same feature.

## Improved Domain Tables

### Identity

- `profiles`
- `roles`
- `user_roles`
- `user_sessions`
- `user_devices`
- `user_consents`

Logic:

- New auth user creates profile automatically.
- Consent history stores privacy, marketing, AI processing, and data export approvals.

### Pets

- `pets`
- `pet_photos`
- `pet_behavior`
- `pet_lifestyle`
- `pet_genetics`
- `emergency_contacts`
- `care_notes`
- `food`

Logic:

- Passport ID generated on pet creation.
- `pets` stays core identity; large optional sections go into one-to-one extension tables.
- Pet photos are metadata records linked to storage.

### Health

- `medical_visits`
- `vaccinations`
- `medications`
- `treatments`
- `allergies`
- `conditions`
- `health_metrics`
- `weight_logs`
- `body_condition_scores`
- `dental_records`
- `wellness_logs`
- `health_scores`
- `health_risks`
- `health_recommendations`

Logic:

- Vaccination status is computed from `next_due_date`.
- Medication reminders are generated from medication schedules.
- Weight and BCS feed health score.
- Health score snapshots store component values, not just a single number.

Recommended MVP health score:

- Preventive care: 30%.
- Vaccination status: 25%.
- Weight/BCS: 20%.
- Data completeness: 15%.
- Recent wellness: 10%.

### Passport & Travel

- `pet_passports`
- `passport_versions`
- `passport_exports`
- `travel_requirements`
- `travel_plans`
- `travel_compliance_checks`

Logic:

- Passport is a generated read model from pet + health + documents.
- Version history preserves auditability.
- Travel checks evaluate destination, species, vaccination validity, microchip, and waiting periods.

### Documents & OCR

- `documents`
- `document_links`
- `ocr_jobs`
- `ocr_extracted_fields`

Logic:

- Uploaded file creates `documents` row.
- OCR creates extracted-field draft rows.
- User confirmation writes into health tables.
- Documents can link to many domain records.

### Calendar & Notifications

- `events`
- `event_reminders`
- `notifications`
- `notification_preferences`

Logic:

- Events can be manual or generated from health/passport/provider records.
- Recurrence uses iCal `recurrence_rule`.
- Notifications are generated records with delivery attempts.

### Sharing

- `co_owners`
- `public_shares`
- `share_access_logs`
- `professional_access_grants`

Logic:

- Co-owner access supports role + permissions JSON.
- Public shares store token hash, not plaintext token.
- Every public access is logged.
- Professional grants allow scoped provider access.

### Providers

- `providers`
- `provider_services`
- `provider_verifications`
- `provider_team_members`
- `provider_dashboard_settings`
- `bookings`
- `booking_series`
- `conversations`
- `messages`

Logic:

- Start with directory and verification.
- Add booking after provider model stabilizes.
- Vet/provider record writing requires explicit grant.

### AI

- `ai_conversations`
- `ai_messages`
- `ai_extractions`
- `ai_recommendations`
- `health_predictions`
- `breed_risk_assessments`
- `ai_usage_logs`

Logic:

- AI never writes final health records without confirmation for MVP.
- Store corrections to improve extraction quality.
- Track token/cost usage per feature.

### Monetization

- `plans`
- `subscriptions`
- `entitlements`
- `usage_counters`
- `invoices`
- `affiliate_partners`
- `affiliate_attributions`

Logic:

- UI checks entitlements, not hardcoded plan names.
- Usage counters enforce AI queries, storage, pet limits, co-owner limits.

### Admin & Ops

- `audit_logs`
- `activity_logs`
- `feature_flags`
- `settings`
- `content`
- `translations`
- `mail_queue`

Logic:

- `mail_queue` is service-role only.
- Admin actions are audited.
- Feature flags support country, role, plan, beta cohort.

## RLS Model

Owner read/write:

```sql
exists (
  select 1 from pets p
  where p.id = table.pet_id
  and p.user_id = auth.uid()
)
```

Co-owner read/write:

```sql
exists (
  select 1 from co_owners c
  where c.pet_id = table.pet_id
  and c.user_id = auth.uid()
  and c.status = 'accepted'
  and c.permissions ? 'read'
)
```

Provider read/write:

- Only via `professional_access_grants` or `bookings` relationship.
- Every access logged.

Public access:

- Only through `get_public_pet_details(token)` or edge function.
- Validate token hash, expiry, revoked state, max views, and scope.

## Migration Rule

Do not apply old 88 migrations. Build a clean schema from `supabase/canonical-schema/`, then generate TypeScript types, then update app code to those types.

## Compatibility Views During Transition

Temporary views may reduce app rewrite risk:

- `weight_entries` -> `weight_logs`
- `weight_history` -> `weight_logs`
- `share_links` -> `public_shares`
- `pet_share_tokens` -> `public_shares`

But views should be removed before production if possible.
