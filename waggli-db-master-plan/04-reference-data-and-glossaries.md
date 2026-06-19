# 04 - Reference Data and Glossaries

Waggli needs a serious reference-data layer. This is not just dropdown content. It powers autocomplete, OCR normalization, AI grounding, translations, travel compliance, recommendations, reminders, and provider search.

## Reference Data Principles

- Stable canonical IDs.
- Language-neutral codes.
- Localized names/descriptions in translation tables.
- Aliases and synonyms for search/OCR/AI.
- Country-specific variants where rules differ.
- Species-specific filtering.
- Versioning for medical/travel rules.
- Source attribution for regulatory/medical data.

## Core Tables

### `languages`

Columns:

- `code text primary key` (`en`, `nl`, `de`, `fr`, etc.)
- `name_en text`
- `native_name text`
- `is_supported boolean`
- `is_rtl boolean`
- `fallback_language_code text`
- `sort_order int`

Initial languages:

- English
- Dutch
- German
- French
- Spanish
- Italian
- Portuguese
- Polish
- Ukrainian
- Russian

### `countries`

Columns:

- `iso2 text primary key`
- `iso3 text`
- `name_en text`
- `region text`
- `subregion text`
- `eu_member boolean`
- `eea_member boolean`
- `currency_code text`
- `default_language_code text`
- `calling_code text`
- `timezone_default text`
- `pet_travel_region text`
- `rabies_status text`
- `notes jsonb`

Initial high-priority countries:

- NL, DE, BE, AT, FR, ES, IT, PT, PL, UK, IE, CH, NO, SE, DK, FI.

### `currencies`

- `code text primary key`
- `symbol text`
- `name text`
- `decimal_places int`

## Translation System

### `translation_namespaces`

Examples:

- `app.common`
- `auth`
- `onboarding`
- `pet_profile`
- `health`
- `passport`
- `documents`
- `calendar`
- `sharing`
- `providers`
- `billing`
- `admin`
- `reference`
- `medical_glossary`
- `legal_travel`

### `translation_keys`

Columns:

- `id uuid pk`
- `namespace text`
- `key text`
- `description text`
- `default_value text`
- `icu_message boolean`
- `screenshot_url text`
- `status text`
- unique `(namespace, key)`

### `translations`

Columns:

- `key_id uuid references translation_keys(id)`
- `language_code text references languages(code)`
- `value text`
- `status text` (`machine`, `reviewed`, `approved`)
- `reviewed_by uuid`
- `updated_at`
- unique `(key_id, language_code)`

### `glossary_terms`

Purpose: canonical vocabulary used by UI, OCR, AI, and translations.

Columns:

- `id uuid pk`
- `term_key text unique`
- `domain text` (`medical`, `passport`, `travel`, `billing`, `provider`, `species`, `health_metric`)
- `canonical_en text`
- `definition_en text`
- `preferred_translation_notes text`
- `do_not_translate boolean`
- `sensitive_medical boolean`
- `created_at`, `updated_at`

### `glossary_translations`

- `term_id uuid references glossary_terms(id)`
- `language_code text`
- `term text`
- `definition text`
- `synonyms text[]`
- `status text`

Glossary examples:

- rabies
- DHPP / DHP / DAPP
- leptospirosis
- bordetella
- microchip
- pet passport
- valid until
- batch number
- body condition score
- respiratory rate
- allergic reaction
- anaphylaxis
- spayed/neutered
- co-owner
- provider access
- travel compliance

## Breeds

### `species`

- `code text primary key` (`dog`, `cat`, `bird`, `rabbit`, `reptile`, `other`)
- `default_lifespan_min int`
- `default_lifespan_max int`
- `supports_breed_database boolean`

### `breeds`

Columns:

- `id uuid pk`
- `species_code text references species(code)`
- `name text`
- `normalized_name text`
- `country_origin text`
- `size_category text`
- `weight_min_kg numeric`
- `weight_max_kg numeric`
- `height_min_cm numeric`
- `height_max_cm numeric`
- `life_expectancy_min int`
- `life_expectancy_max int`
- `temperament_tags text[]`
- `exercise_needs text`
- `grooming_needs text`
- `common_health_risks jsonb`
- `aliases text[]`
- `image_url text`
- unique `(species_code, normalized_name)`

### `breed_translations`

- `breed_id`
- `language_code`
- `name`
- `description`
- `temperament_text`
- `health_notes`

### `breed_health_risks`

- `breed_id`
- `condition_id references ref_conditions(id)`
- `risk_level text`
- `evidence_level text`
- `recommended_screening text`
- `source_url text`

Seed sources:

- `documentation/documents/all_dog_breeds_comprehensive.csv`
- `documentation/documents/all_cat_breeds_comprehensive.csv`

## Vaccinations

### `ref_vaccines`

Columns:

- `id uuid pk`
- `species_code text`
- `code text`
- `name text`
- `category text` (`core`, `non_core`, `travel`, `lifestyle`)
- `pathogen text`
- `description text`
- `default_validity_months int`
- `default_booster_interval_months int`
- `minimum_age_weeks int`
- `requires_batch_number boolean`
- `travel_relevant boolean`
- `aliases text[]`
- `contraindications jsonb`
- `common_reactions jsonb`
- unique `(species_code, code)`

### `vaccine_schedules`

Country/species/life-stage schedule.

- `id uuid pk`
- `vaccine_id uuid references ref_vaccines(id)`
- `country_code text references countries(iso2)`
- `life_stage text`
- `first_due_age_weeks int`
- `booster_interval_months int`
- `required_for_travel boolean`
- `legal_requirement boolean`
- `notes text`
- `source_url text`
- `effective_from date`
- `effective_to date`

### `vaccine_translations`

- `vaccine_id`
- `language_code`
- `name`
- `description`
- `aliases text[]`

Seed source:

- `documentation/documents/pet_vaccinations_complete.csv`

Important vaccines to represent:

Dogs:

- Rabies
- DHPP / DAPP / DHP
- Leptospirosis
- Bordetella
- Lyme
- Canine Influenza
- Parainfluenza
- Coronavirus where regionally used

Cats:

- Rabies
- FVRCP / RCP
- FeLV
- FIV where regionally used
- Chlamydia felis
- Bordetella where regionally used

## Medications and Treatments

### `ref_medications`

Columns:

- `id uuid pk`
- `name text`
- `generic_name text`
- `brand_names text[]`
- `species_codes text[]`
- `medication_class text`
- `forms text[]`
- `common_dosage_units text[]`
- `route_options text[]`
- `controlled_substance boolean`
- `prescription_required boolean`
- `warnings jsonb`
- `contraindications jsonb`
- `interactions jsonb`
- `aliases text[]`

### `medication_translations`

- `medication_id`
- `language_code`
- `name`
- `description`
- `instructions_template`

Seed source:

- `documentation/documents/pet_medicines_comprehensive.csv`

### `reference_treatments`

For preventive/treatment tasks that may not be medications.

- flea/tick prevention
- deworming
- grooming
- nail trim
- dental cleaning
- parasite screening
- annual checkup

Columns:

- `id`, `category`, `name`, `species_codes`, `default_interval_days`, `requires_provider`, `aliases`.

## Allergens, Symptoms, Conditions

### `ref_allergens`

- `id`
- `name`
- `allergen_type` (`food`, `environment`, `medication`, `insect`, `vaccine_component`, `other`)
- `common_symptoms text[]`
- `emergency_risk boolean`
- `aliases text[]`

### `ref_symptoms`

- `id`
- `name`
- `category`
- `severity_default`
- `emergency_flag boolean`
- `species_codes text[]`
- `triage_questions jsonb`
- `aliases text[]`

### `ref_conditions`

- `id`
- `name`
- `category`
- `species_codes text[]`
- `description`
- `common_symptoms text[]`
- `emergency_signs text[]`
- `breed_risk_supported boolean`
- `aliases text[]`

## Travel and Legal Reference

### `travel_requirements`

- country pair or destination country.
- species.
- rabies requirements.
- microchip requirements.
- tapeworm treatment rules.
- waiting periods.
- approved entry points.
- source URLs.
- version/effective dates.

### `document_type_glossary`

- pet passport
- vaccination certificate
- prescription
- lab result
- invoice
- insurance policy
- adoption paper
- microchip certificate

## Provider Reference

### `provider_categories`

- veterinarian
- groomer
- trainer
- sitter
- walker
- boarding
- insurance
- emergency clinic
- pharmacy
- pet taxi

### `provider_services_reference`

- category_id
- service_name
- default_duration_minutes
- typical_price_range jsonb
- species_codes
- aliases

## Search Strategy for Reference Data

Use:

- trigram indexes for autocomplete.
- full-text indexes for glossary definitions.
- aliases arrays for OCR and AI matching.
- language-specific translations table.
- materialized unified search view `mv_reference_search`.

Search priority:

1. Exact code match.
2. Exact localized name.
3. Alias match.
4. Trigram similarity.
5. Full-text definition match.
