create table if not exists public.species (
  code text primary key,
  name_en text not null,
  default_lifespan_min int,
  default_lifespan_max int,
  supports_breed_database boolean default false
);

create table if not exists public.breeds (
  id uuid primary key default gen_random_uuid(),
  species_code text not null references public.species(code),
  name text not null,
  normalized_name text not null,
  country_origin text,
  size_category text,
  weight_min_kg numeric,
  weight_max_kg numeric,
  height_min_cm numeric,
  height_max_cm numeric,
  life_expectancy_min int,
  life_expectancy_max int,
  temperament_tags text[],
  exercise_needs text,
  grooming_needs text,
  common_health_risks jsonb default '[]'::jsonb,
  aliases text[],
  image_url text,
  unique(species_code, normalized_name)
);
create index if not exists idx_breeds_species on public.breeds(species_code);
create index if not exists idx_breeds_name_trgm on public.breeds using gin(name gin_trgm_ops);

create table if not exists public.breed_translations (
  breed_id uuid references public.breeds(id) on delete cascade,
  language_code text references public.languages(code),
  name text not null,
  description text,
  temperament_text text,
  health_notes text,
  primary key(breed_id, language_code)
);

create table if not exists public.ref_conditions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  species_codes text[],
  description text,
  common_symptoms text[],
  emergency_signs text[],
  aliases text[]
);
create index if not exists idx_ref_conditions_name_trgm on public.ref_conditions using gin(name gin_trgm_ops);

create table if not exists public.breed_health_risks (
  id uuid primary key default gen_random_uuid(),
  breed_id uuid not null references public.breeds(id) on delete cascade,
  condition_id uuid references public.ref_conditions(id),
  risk_level text,
  evidence_level text,
  recommended_screening text,
  source_url text
);
create index if not exists idx_breed_health_risks_breed on public.breed_health_risks(breed_id);

create table if not exists public.ref_vaccines (
  id uuid primary key default gen_random_uuid(),
  species_code text not null references public.species(code),
  code text not null,
  name text not null,
  category text not null default 'core',
  pathogen text,
  description text,
  default_validity_months int,
  default_booster_interval_months int,
  minimum_age_weeks int,
  requires_batch_number boolean default true,
  travel_relevant boolean default false,
  aliases text[],
  contraindications jsonb default '[]'::jsonb,
  common_reactions jsonb default '[]'::jsonb,
  unique(species_code, code)
);
create index if not exists idx_ref_vaccines_species on public.ref_vaccines(species_code);
create index if not exists idx_ref_vaccines_name_trgm on public.ref_vaccines using gin(name gin_trgm_ops);

create table if not exists public.vaccine_schedules (
  id uuid primary key default gen_random_uuid(),
  vaccine_id uuid not null references public.ref_vaccines(id) on delete cascade,
  country_code text references public.countries(iso2),
  life_stage text,
  first_due_age_weeks int,
  booster_interval_months int,
  required_for_travel boolean default false,
  legal_requirement boolean default false,
  notes text,
  source_url text,
  effective_from date,
  effective_to date
);
create index if not exists idx_vaccine_schedules_vaccine_country on public.vaccine_schedules(vaccine_id, country_code);

create table if not exists public.ref_medications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  generic_name text,
  brand_names text[],
  species_codes text[],
  medication_class text,
  forms text[],
  common_dosage_units text[],
  route_options text[],
  controlled_substance boolean default false,
  prescription_required boolean default true,
  warnings jsonb default '[]'::jsonb,
  contraindications jsonb default '[]'::jsonb,
  interactions jsonb default '[]'::jsonb,
  aliases text[]
);
create index if not exists idx_ref_medications_name_trgm on public.ref_medications using gin(name gin_trgm_ops);

create table if not exists public.ref_allergens (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  allergen_type text,
  common_symptoms text[],
  emergency_risk boolean default false,
  aliases text[]
);

create table if not exists public.ref_symptoms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  severity_default text,
  emergency_flag boolean default false,
  species_codes text[],
  triage_questions jsonb default '[]'::jsonb,
  aliases text[]
);
