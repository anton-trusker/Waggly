# 03 - Views, Functions, Logic, and Performance

## Views

Views should make the app simpler without duplicating data. Use views for read models, dashboard cards, public summaries, and temporary compatibility during migration.

### `v_pet_dashboard_summary`

Purpose: one row per pet for dashboard cards.

Fields:

- pet identity: `pet_id`, `name`, `species_code`, `breed_name`, `photo_url`, `status`
- latest health score: `health_score`, `score_category`, `calculated_at`
- next event/reminder: `next_event_title`, `next_event_at`
- vaccine status: `overdue_vaccines_count`, `due_soon_vaccines_count`
- active meds count
- unread alerts count

Source tables:

- `pets`
- `health_scores`
- `vaccinations`
- `medications`
- `events`
- `notifications`

Index support:

- `health_scores(pet_id, calculated_at desc)`
- `vaccinations(pet_id, next_due_at)`
- `events(pet_id, starts_at)`
- `notifications(pet_id, read_at)`

### `v_pet_passport_summary`

Purpose: passport screen read model.

Fields:

- identity fields
- microchip/registration/passport fields
- owner profile summary
- emergency primary contact
- latest vaccination set
- active medications
- active allergies
- active conditions
- latest health score
- linked critical documents

This view should not expose private financial data. Public sharing should use RPCs that filter the view by scope.

### `v_pet_health_timeline`

Purpose: unified history timeline.

Union sources:

- medical visits
- vaccinations
- medications started/ended
- treatments
- weight logs
- BCS records
- allergies
- conditions
- documents
- wellness logs

Standard fields:

- `pet_id`
- `event_at`
- `event_type`
- `title`
- `description`
- `source_table`
- `source_id`
- `metadata jsonb`

### `v_upcoming_care`

Purpose: dashboard and calendar upcoming list.

Sources:

- vaccination `next_due_at`
- medication schedules
- treatment `next_due_at`
- medical visit follow-up
- events/reminders

### `v_document_search`

Purpose: searchable document metadata + OCR text.

Fields:

- `document_id`, `pet_id`, `title`, `document_type`, `document_category`
- `ocr_text`
- `linked_entities`
- `search_vector`

Use GIN full-text index on generated/search materialized version for scale.

### `v_provider_directory`

Purpose: public provider search.

Fields:

- provider identity, type, service categories, ratings, location, subscription tier, verification status.

### Compatibility Views

Use only during migration:

- `weight_entries` view over `weight_logs`
- `weight_history` view over `weight_logs`
- `share_links` view over `public_shares`
- `pet_share_tokens` view over `public_shares`
- `veterinarians` view or compatibility table over `providers where provider_type = 'veterinary'`

## Materialized Views

Use materialized views for expensive dashboard/analytics/search operations. Refresh via scheduled jobs or triggers.

### `mv_pet_health_rollups`

One row per pet:

- last visit date
- last wellness log
- latest weight
- latest BCS
- active conditions count
- overdue vaccines count
- active meds count
- document count

Refresh:

- On demand after health write, or scheduled every hour.

### `mv_reference_search`

Unified multilingual search across:

- breeds
- vaccines
- medications
- allergens
- symptoms
- provider services
- glossary terms

Fields:

- `entity_type`
- `entity_id`
- `language_code`
- `name`
- `aliases`
- `description`
- `search_vector`

### `mv_admin_platform_metrics`

Admin analytics:

- users by country/language
- pets by species
- records per pet
- OCR usage
- AI cost
- subscription status
- provider onboarding funnel

## RPC Functions

### `handle_new_user()`

Creates `profiles`, default preferences, default role, and user settings after Supabase auth signup.

### `generate_passport_id(p_pet_id uuid)`

Creates stable passport IDs, e.g. `WG-<country>-<year>-<shortid>`.

### `calculate_health_score(p_pet_id uuid)`

Compatibility function used by app.

MVP component weights:

- preventive care: 30
- vaccination: 25
- weight/BCS: 20
- data completeness: 15
- recent wellness: 10

Stores snapshot into `health_scores` and returns score + components.

### `get_public_pet_details(share_token text)`

Public share function.

Must:

- Hash incoming token and find `public_shares.token_hash`.
- Check revoked/expired/max views.
- Apply scope filters.
- Log access in `share_access_logs`.
- Return only allowed fields.

### `create_public_share(p_pet_id, p_share_type, p_scope, p_expires_at)`

Creates token once, stores token hash, returns plaintext token only in response.

### `generate_due_notifications()`

Creates notification records from due reminders/events.

### `search_reference_data(query, language_code, entity_types)`

Search breeds, vaccines, meds, allergens, symptoms, and glossary terms.

### `search_documents(p_pet_id, query, filters)`

Full-text search over document metadata and OCR text.

## Triggers

### Updated At

Every mutable table gets `set_updated_at()`.

### Passport Dirty Trigger

Any write to health, documents, pet identity, emergency contacts, behavior/lifestyle/genetics marks passport stale:

- update `pet_passports.last_source_change_at`
- optionally enqueue passport summary refresh

### Vaccination Status Trigger

On insert/update:

- `valid` if `valid_until >= today` and `next_due_at` not near.
- `due_soon` if due within configured window.
- `overdue` if `next_due_at < today`.
- `expired` if `valid_until < today`.

### Reminder Sync Trigger

When vaccination/medication/treatment/follow-up changes:

- upsert relevant `events`
- upsert `event_reminders`

### OCR Confirmation Trigger

When extracted field is confirmed:

- If target record exists: update draft target.
- If target record not exists and enough fields exist: create draft domain record.
- Never silently create final medical records without user confirmation in MVP.

## Index Strategy

Rules:

- Every FK gets a btree index.
- Every RLS join path gets an index.
- Every dashboard date query gets `(pet_id, date desc)`.
- Every unread notification query gets partial index.
- Every public token hash gets unique index.
- Every searchable reference table gets trigram or full-text index.

Important indexes:

```sql
create index idx_pets_user_id on pets(user_id);
create index idx_co_owners_pet_user on co_owners(pet_id, user_id) where status = 'accepted';
create index idx_vaccinations_pet_due on vaccinations(pet_id, next_due_at);
create index idx_medications_pet_active on medications(pet_id) where is_ongoing = true;
create index idx_events_pet_starts on events(pet_id, starts_at);
create index idx_notifications_user_unread on notifications(user_id, created_at desc) where read_at is null;
create unique index idx_public_shares_token_hash on public_shares(token_hash);
create index idx_documents_pet_created on documents(pet_id, created_at desc);
create index idx_ocr_jobs_status on ocr_jobs(status, created_at);
create index idx_breeds_search on breeds using gin(name gin_trgm_ops);
```

## Partitioning Strategy

Do not partition too early. Add partitioning only when scale requires it.

Candidate future partitioning:

- `notifications` by month.
- `audit_logs` by month.
- `activity_logs` by month.
- `ai_usage_logs` by month.
- `documents` metadata by country or created month if needed.

For MVP, indexes plus clean table design are more valuable than complex partitioning.

## Caching Strategy

Database-level:

- Materialized views for expensive read models.
- `updated_at` based cache invalidation.

App-level:

- React Query cache for pet dashboard, passport, reference data.
- Long stale time for reference data.

Edge/backend:

- Cache static reference/glossary data aggressively.
- Do not cache private pet health responses outside authenticated scope.
