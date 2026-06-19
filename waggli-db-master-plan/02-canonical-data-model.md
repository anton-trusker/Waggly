# 02 - Canonical Data Model

## Naming Rules

- Singular ownership root: `pets.user_id`.
- Pet child records: `pet_id`, no duplicated `owner_id`.
- Timestamps: `created_at`, `updated_at`; domain-specific dates use clear names such as `administered_at`, `recorded_at`, `valid_until`, `next_due_at`.
- Public share records: `public_shares`, not `share_links` or `pet_share_tokens`.
- Weight records: `weight_logs`, not `weight_entries` or `weight_history`.
- Reference data: prefix with `ref_` for normalized glossaries and `reference_` only where existing app compatibility requires it.

## Domain 1 - Identity, Auth, Preferences

### `profiles`

Purpose: user profile extension for `auth.users`.

Important columns:

- `id uuid primary key references auth.users(id)`
- `email text`
- `first_name text`
- `last_name text`
- `phone text`
- `country_code text references countries(iso2)`
- `language_code text references languages(code)`
- `timezone text`
- `photo_url text`
- `onboarding_completed boolean`
- `notification_prefs jsonb`
- `privacy_prefs jsonb`
- `created_at timestamptz`
- `updated_at timestamptz`

### `user_devices`

Purpose: push tokens and device metadata.

Columns:

- `id uuid pk`
- `user_id uuid references auth.users(id)`
- `platform text check in ('ios','android','web')`
- `push_token text`
- `device_name text`
- `locale text`
- `timezone text`
- `last_seen_at timestamptz`

### `user_consents`

Purpose: GDPR/privacy/AI consent audit.

Columns:

- `id uuid pk`
- `user_id uuid references auth.users(id)`
- `consent_type text` (`privacy_policy`, `terms`, `marketing`, `ai_processing`, `provider_sharing`)
- `version text`
- `accepted boolean`
- `accepted_at timestamptz`
- `metadata jsonb`

### `roles`, `user_roles`

Purpose: admin/support/provider role management.

## Domain 2 - Pets and Pet Identity

### `pets`

Purpose: central pet record.

Columns:

- `id uuid pk`
- `user_id uuid references auth.users(id)`
- `name text not null`
- `species_code text references species(code)`
- `breed_id uuid references breeds(id) null`
- `breed_name text` for mixed/custom breed display
- `gender text`
- `date_of_birth date`
- `age_approximate text`
- `life_stage text` (`puppy_kitten`, `adult`, `senior`, etc.)
- `weight_current numeric`
- `weight_unit text default 'kg'`
- `height_cm numeric`
- `color text`
- `coat_type_code text references ref_coat_types(code)`
- `eye_color_code text references ref_eye_colors(code)`
- `distinguishing_marks text`
- `photo_url text`
- `microchip_number text unique null`
- `microchip_implanted_at date`
- `tattoo_id text`
- `registration_id text`
- `is_spayed_neutered boolean`
- `spayed_neutered_at date`
- `blood_type_code text references ref_blood_types(code)`
- `passport_id text unique`
- `status text` (`active`, `lost`, `deceased`, `rehomed`)
- `created_at`, `updated_at`

Logic:

- Generate `passport_id` on insert.
- Update `updated_at` on every change.
- Optional: update `life_stage` from species + age.

### `pet_photos`

- `id`, `pet_id`, `storage_path`, `public_url`, `caption`, `is_primary`, `photo_type`, `created_at`.

### `pet_behavior`

One-to-one extension.

- `pet_id unique`
- `temperament_tags text[]`
- `good_with_children text`
- `good_with_dogs text`
- `good_with_cats text`
- `training_level int`
- `commands_known text[]`
- `behavioral_notes text`
- `triggers_fears text`

### `pet_lifestyle`

One-to-one extension.

- `pet_id unique`
- `primary_diet text`
- `diet_brand text`
- `feeding_schedule jsonb`
- `exercise_needs text`
- `daily_exercise_minutes int`
- `living_environment text`
- `sleep_location text`
- `special_needs text`

### `pet_genetics`

- `pet_id`
- `dna_test_provider_id uuid references ref_dna_test_providers(id)`
- `tested_at date`
- `dna_results jsonb`
- `genetic_markers jsonb`
- `pedigree jsonb`
- `document_id uuid references documents(id)`

### `emergency_contacts`

- `pet_id`
- `contact_type text`
- `name text`
- `relationship text`
- `phone text`
- `email text`
- `is_primary boolean`
- `notes text`

## Domain 3 - Health Records

### `medical_visits`

- `id`, `pet_id`
- `visited_at timestamptz`
- `visit_type text`
- `reason text`
- `diagnosis text`
- `treatment_summary text`
- `provider_id uuid references providers(id)`
- `veterinarian_name text`
- `clinic_name text`
- `cost_amount numeric`
- `currency_code text references currencies(code)`
- `invoice_document_id uuid references documents(id)`
- `follow_up_required boolean`
- `follow_up_at timestamptz`
- `notes text`

### `vaccinations`

- `id`, `pet_id`
- `vaccine_id uuid references ref_vaccines(id)`
- `vaccine_name text`
- `administered_at date`
- `valid_until date`
- `next_due_at date`
- `batch_number text`
- `manufacturer text`
- `provider_id uuid references providers(id)`
- `administered_by text`
- `certificate_document_id uuid references documents(id)`
- `status text` (`valid`, `due_soon`, `overdue`, `expired`, `unknown`)
- `reaction_notes text`
- `notes text`

Logic:

- Trigger recomputes status from `valid_until`/`next_due_at`.
- Trigger creates/updates reminder events.

### `medications`

- `id`, `pet_id`
- `medication_id uuid references ref_medications(id)`
- `name text`
- `dosage_value numeric`
- `dosage_unit text`
- `route text`
- `frequency text`
- `schedule jsonb`
- `start_at date`
- `end_at date`
- `is_ongoing boolean`
- `prescribed_by_provider_id uuid references providers(id)`
- `prescription_document_id uuid references documents(id)`
- `reason text`
- `instructions text`
- `side_effects text`
- `reminders_enabled boolean`

### `medication_doses`

Purpose: adherence tracking.

- `medication_id`
- `scheduled_at timestamptz`
- `taken_at timestamptz`
- `status text` (`scheduled`, `taken`, `skipped`, `missed`)
- `given_by uuid references auth.users(id)`
- `notes text`

### `treatments`

For non-medication recurring care such as flea/tick, grooming health tasks, deworming.

- `pet_id`, `treatment_id`, `name`, `category`, `start_at`, `end_at`, `next_due_at`, `frequency`, `status`, `notes`.

### `allergies`

- `pet_id`
- `allergen_id uuid references ref_allergens(id)`
- `allergen_name text`
- `allergy_type text`
- `severity text`
- `symptoms jsonb`
- `reaction_description text`
- `diagnosed_at date`
- `test_document_id uuid references documents(id)`
- `emergency_plan text`
- `notes text`

### `conditions`

- `pet_id`
- `condition_id uuid references ref_conditions(id)`
- `name text`
- `status text`
- `severity text`
- `diagnosed_at date`
- `resolved_at date`
- `treatment_plan text`
- `notes text`

### `health_metrics`

General vitals.

- `pet_id`
- `recorded_at timestamptz`
- `weight numeric`
- `weight_unit text`
- `temperature_c numeric`
- `heart_rate_bpm int`
- `respiratory_rate_bpm int`
- `blood_pressure_systolic int`
- `blood_pressure_diastolic int`
- `hydration_status text`
- `appetite_level text`
- `activity_level text`
- `pain_score int`
- `notes text`

### `weight_logs`

Canonical weight history.

- `pet_id`, `recorded_at`, `weight`, `unit`, `body_condition_score`, `notes`, `source`.

### `body_condition_scores`

- `pet_id`, `assessed_at`, `score`, `scale`, `category`, `notes`.

### `dental_records`

- `pet_id`, `exam_at`, `condition_score`, `last_cleaning_at`, `procedures jsonb`, `extractions int`, `notes`.

### `wellness_logs`

- `pet_id`, `logged_at`, `appetite_level`, `activity_level`, `mood`, `stool_quality`, `vomiting boolean`, `notes`.

### `health_scores`

- `pet_id`
- `calculated_at`
- `overall_score int`
- `score_category text`
- `preventive_care_score int`
- `vaccination_score int`
- `weight_score int`
- `data_completeness_score int`
- `recent_wellness_score int`
- `component_details jsonb`
- `recommendations jsonb`

## Domain 4 - Documents and OCR

### `documents`

- `id`, `pet_id`, `uploaded_by`
- `storage_bucket`, `storage_path`
- `file_name`, `mime_type`, `file_size_bytes`
- `document_type text`
- `document_category text`
- `title text`
- `description text`
- `visibility text` (`private`, `co_owners`, `professional`, `public_link`)
- `ocr_status text`
- `created_at`, `updated_at`

### `document_links`

Polymorphic link table.

- `document_id`
- `entity_type text` (`medical_visit`, `vaccination`, `medication`, `allergy`, `passport`, `provider`, `insurance`)
- `entity_id uuid`

### `ocr_jobs`

- `document_id`
- `status text`
- `provider text`
- `ocr_raw_text text`
- `confidence numeric`
- `cost_cents int`
- `started_at`, `completed_at`, `error_message`

### `ocr_extracted_fields`

- `ocr_job_id`
- `target_entity_type text`
- `field_key text`
- `field_value jsonb`
- `confidence numeric`
- `status text` (`draft`, `confirmed`, `rejected`, `corrected`)
- `confirmed_by uuid`

## Domain 5 - Passport and Travel

### `pet_passports`

- `id`, `pet_id unique`
- `passport_id text unique`
- `status text`
- `summary jsonb`
- `last_generated_at`
- `expires_at`
- `qr_share_id uuid references public_shares(id)`

### `passport_versions`

- `passport_id`
- `version_number int`
- `snapshot jsonb`
- `created_by uuid`
- `created_at`

### `travel_requirements`

- `country_code`
- `species_code`
- `requirement_type`
- `rule_json`
- `source_url`
- `effective_from`
- `effective_to`

### `travel_plans`

- `pet_id`
- `origin_country_code`
- `destination_country_code`
- `depart_at`
- `return_at`
- `status`

### `travel_compliance_checks`

- `travel_plan_id`
- `status`
- `missing_requirements jsonb`
- `checked_at`

## Domain 6 - Calendar and Notifications

### `events`

- `id`, `pet_id`, `user_id`
- `title`, `description`
- `event_type text`
- `source_type text`
- `source_id uuid`
- `starts_at`, `ends_at`
- `all_day boolean`
- `recurrence_rule text`
- `timezone text`
- `location jsonb`
- `status text`

### `event_reminders`

- `event_id`
- `remind_at`
- `channel text`
- `status text`

### `notifications`

- `user_id`, `pet_id`
- `type`, `title`, `body`
- `payload jsonb`
- `channel text`
- `status text`
- `read_at`, `delivered_at`

## Domain 7 - Sharing and Collaboration

### `co_owners`

- `pet_id`
- `user_id`
- `invited_email text`
- `role text` (`co_owner`, `editor`, `viewer`)
- `permissions jsonb`
- `status text`
- `invited_by uuid`
- `accepted_at`, `revoked_at`

### `public_shares`

- `id`, `pet_id`
- `created_by uuid`
- `token_hash text unique`
- `share_type text`
- `scope jsonb`
- `expires_at`
- `revoked_at`
- `max_views int`
- `view_count int`

### `share_access_logs`

- `share_id`
- `accessed_at`
- `ip_hash text`
- `user_agent text`
- `result text`

### `professional_access_grants`

- `pet_id`
- `provider_id`
- `granted_by uuid`
- `scope jsonb`
- `expires_at`
- `revoked_at`

## Domain 8 - Providers

Tables:

- `providers`
- `provider_services`
- `provider_locations`
- `provider_verifications`
- `provider_team_members`
- `provider_availability`
- `bookings`
- `booking_series`
- `provider_reviews`
- `conversations`
- `messages`

## Domain 9 - AI

Tables:

- `ai_conversations`
- `ai_messages`
- `ai_extractions`
- `ai_recommendations`
- `health_predictions`
- `breed_risk_assessments`
- `ai_usage_logs`
- `ai_feedback`

## Domain 10 - Monetization

Tables:

- `plans`
- `subscriptions`
- `entitlements`
- `usage_counters`
- `invoices`
- `payment_events`
- `affiliate_partners`
- `affiliate_attributions`

## Domain 11 - Admin, Audit, Content

Tables:

- `audit_logs`
- `activity_logs`
- `feature_flags`
- `settings`
- `content`
- `translations`
- `mail_queue`
- `data_export_requests`
- `deletion_requests`
