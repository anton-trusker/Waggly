-- Reference data. Keep flexible text columns in pet records, but use refs for search, suggestions, and validation.

create table if not exists public.species (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists public.reference_breeds (
  id uuid primary key default gen_random_uuid(),
  species_code text not null,
  name text not null,
  normalized_name text,
  country_origin text,
  size_category text,
  life_expectancy_min int,
  life_expectancy_max int,
  temperament text[],
  health_risks jsonb,
  created_at timestamptz default now(),
  unique(species_code, name)
);

create table if not exists public.reference_vaccinations (
  id uuid primary key default gen_random_uuid(),
  species_code text not null,
  vaccine_name text not null,
  category text default 'core',
  default_interval_months int,
  is_travel_required boolean default false,
  country_code text,
  created_at timestamptz default now()
);

create table if not exists public.reference_medications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  medication_type text,
  species_code text,
  common_dosages jsonb,
  warnings jsonb,
  created_at timestamptz default now()
);

create table if not exists public.reference_treatments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  species_code text,
  default_interval_days int,
  created_at timestamptz default now()
);

create table if not exists public.ref_allergens (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  allergen_type text,
  created_at timestamptz default now()
);

create table if not exists public.ref_symptoms (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  category text,
  severity_default text,
  created_at timestamptz default now()
);

create index if not exists idx_reference_breeds_species on public.reference_breeds(species_code);
create index if not exists idx_reference_breeds_search on public.reference_breeds using gin (name gin_trgm_ops);
