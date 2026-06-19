# 02 - Canonical Tables

## P0 Tables

### Identity & Auth

- `profiles`: one row per `auth.users.id`; profile fields, country/language, notification preferences, onboarding status.
- `roles`: named permission bundles.
- `user_roles`: user to role mapping.
- `user_sessions`: optional device/session metadata for push and security.

### Pet Core

- `pets`: central pet record. Canonical owner column: `user_id`.
- `pet_photos`: gallery/media metadata.
- `pet_behavior`: temperament, training, compatibility, triggers.
- `pet_lifestyle`: diet, exercise, living environment, feeding schedule.
- `pet_genetics`: DNA provider/results, markers, pedigree.
- `emergency_contacts`: emergency contacts per pet.
- `care_notes`: freeform operational care notes.
- `food`: current food/feed records.

### Health

- `medical_visits`: vet/provider visits, diagnosis, recommendations, invoice link.
- `vaccinations`: vaccine records, expiry, next due, certificate link.
- `medications`: active/past medication plans.
- `treatments`: broader treatments and recurring care tasks.
- `allergies`: structured allergy records.
- `conditions`: chronic/temporary conditions.
- `health_metrics`: vitals, weight, temperature, HR/RR, hydration, appetite, activity.
- `weight_logs`: canonical weight history.
- `body_condition_scores`: BCS history.
- `dental_records`: dental cleaning and condition history.
- `wellness_logs`: appetite/activity/mood logs for health score recency.
- `health_scores`: calculated score snapshots with component breakdown.
- `health_risks`: known/predicted risk records.
- `health_recommendations`: actionable recommendations.

### Passport & Compliance

- `pet_passports`: digital passport snapshot and QR/token data.
- `passport_versions`: immutable version history for sharing/audit.
- `travel_requirements`: country/species travel rules.
- `travel_plans`: planned trips and compliance checks.
- `passport_exports`: PDF/QR export history.

### Documents

- `documents`: storage metadata and document category.
- `document_links`: many-to-many links to visits, vaccines, meds, passports, providers.
- `ocr_jobs`: OCR processing lifecycle, provider, status, confidence.
- `ocr_extracted_fields`: normalized extracted facts awaiting user confirmation.

### Calendar & Notifications

- `events`: canonical calendar event table, with `recurrence_rule` support.
- `event_reminders`: reminder schedule per event.
- `notifications`: generated in-app/push/email/SMS notifications.
- `notification_preferences`: per-user/per-pet preferences.

### Sharing

- `co_owners`: user-to-pet collaboration with role and permissions.
- `public_shares`: secure time-limited public/professional links.
- `share_access_logs`: every access to a public/pro link.

### Reference Data

- `reference_breeds`
- `reference_vaccinations`
- `reference_medications`
- `reference_treatments`
- `ref_allergens`
- `ref_symptoms`
- `species`
- `countries`
- `languages`

## P1 Tables

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

### AI

- `ai_conversations`
- `ai_messages`
- `ai_extractions`
- `ai_recommendations`
- `health_predictions`
- `breed_risk_assessments`
- `ai_usage_logs`

### Monetization

- `plans`
- `subscriptions`
- `entitlements`
- `usage_counters`
- `invoices`
- `affiliate_partners`
- `affiliate_attributions`

### Admin & Ops

- `audit_logs`
- `activity_logs`
- `feature_flags`
- `settings`
- `content`
- `translations`
- `mail_queue`

## P2 Tables

- `social_posts`
- `post_comments`
- `post_reactions`
- `pet_stories`
- `groups`
- `group_members`
- `community_events`
- `moderation_reports`

## Naming Rules

- Prefer one canonical table name. Avoid parallel duplicates like `share_links`, `pet_share_tokens`, and `public_shares`.
- Prefer one timestamp vocabulary: `created_at`, `updated_at`, domain dates like `recorded_at`/`recorded_date`.
- Use `pet_id` for child records. Do not duplicate `user_id` unless the record is not pet-scoped.
- Keep storage bucket names hyphenated: `pet-photos`, `user-photos`, `pet-documents`, `avatars`.
