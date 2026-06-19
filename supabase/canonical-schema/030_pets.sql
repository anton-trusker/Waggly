-- Pet core. Ownership root is pets.user_id.

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  species text not null check (species in ('dog','cat','bird','rabbit','reptile','other')),
  breed text,
  gender text check (gender in ('male','female')),
  date_of_birth date,
  age_approximate text,
  size text check (size in ('small','medium','large','giant')),
  weight numeric,
  weight_unit text default 'kg',
  height numeric,
  color text,
  coat_type text,
  eye_color text,
  distinguishing_marks text,
  ideal_weight_min numeric,
  ideal_weight_max numeric,
  photo_url text,
  photo_gallery text[],
  microchip_number text,
  microchip_implantation_date date,
  tattoo_id text,
  registration_id text,
  is_spayed_neutered boolean default false,
  spayed_neutered_date date,
  blood_type text,
  passport_id text unique,
  passport_issuer text,
  passport_issue_date date,
  passport_generated_at timestamptz,
  passport_updated_at timestamptz,
  address_json jsonb,
  pet_status text default 'active' check (pet_status in ('active','deceased','adopted','lost')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_pets_user_id on public.pets(user_id);
create index if not exists idx_pets_species on public.pets(species);
create index if not exists idx_pets_status on public.pets(pet_status);
create unique index if not exists idx_pets_microchip on public.pets(microchip_number) where microchip_number is not null;
create index if not exists idx_pets_search on public.pets using gin (to_tsvector('simple', name || ' ' || coalesce(breed,'')));

create trigger trg_pets_updated before update on public.pets
for each row execute function public.set_updated_at();

create table if not exists public.pet_photos (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  url text not null,
  caption text,
  is_favorite boolean default false,
  created_at timestamptz default now()
);
create index if not exists idx_pet_photos_pet_id on public.pet_photos(pet_id);

create table if not exists public.pet_behavior (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade unique,
  temperament_tags text[],
  good_with_children text check (good_with_children in ('yes','no','unknown')),
  good_with_dogs text check (good_with_dogs in ('yes','no','unknown')),
  good_with_cats text check (good_with_cats in ('yes','no','unknown')),
  training_level int check (training_level between 1 and 5),
  commands_known text[],
  behavioral_notes text,
  triggers_fears text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.pet_lifestyle (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade unique,
  primary_diet text,
  diet_brand text,
  feeding_schedule jsonb,
  exercise_needs text check (exercise_needs in ('low','moderate','high','very_high')),
  daily_exercise_minutes int,
  living_environment text check (living_environment in ('indoor','outdoor','both')),
  sleep_location text,
  special_needs text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.pet_genetics (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  dna_test_provider text,
  dna_results jsonb,
  genetic_markers jsonb,
  pedigree jsonb,
  lineage text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  contact_type text default 'alternate',
  name text not null,
  relationship text,
  phone text,
  email text,
  is_primary boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_emergency_contacts_pet_id on public.emergency_contacts(pet_id);
