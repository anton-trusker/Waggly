-- Core platform tables: pets, health, documents, passport, sharing.
-- Full column rationale is documented in waggli-db-master-plan/02-canonical-data-model.md.

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  species_code text not null references public.species(code),
  breed_id uuid references public.breeds(id),
  breed_name text,
  gender text,
  date_of_birth date,
  age_approximate text,
  life_stage text,
  weight_current numeric,
  weight_unit text default 'kg',
  height_cm numeric,
  color text,
  coat_type_code text,
  eye_color_code text,
  distinguishing_marks text,
  photo_url text,
  microchip_number text unique,
  microchip_implanted_at date,
  tattoo_id text,
  registration_id text,
  is_spayed_neutered boolean default false,
  spayed_neutered_at date,
  blood_type_code text,
  passport_id text unique,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_pets_user on public.pets(user_id);
create index if not exists idx_pets_species on public.pets(species_code);
create index if not exists idx_pets_breed on public.pets(breed_id);
create index if not exists idx_pets_name_trgm on public.pets using gin(name gin_trgm_ops);

create table if not exists public.co_owners (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  invited_email text,
  role text not null default 'viewer',
  permissions jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  invited_by uuid references auth.users(id),
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz default now(),
  unique(pet_id, user_id)
);
create index if not exists idx_co_owners_pet_user on public.co_owners(pet_id, user_id);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade,
  uploaded_by uuid references auth.users(id),
  storage_bucket text not null,
  storage_path text not null,
  file_name text,
  mime_type text,
  file_size_bytes bigint,
  document_type text,
  document_category text,
  title text,
  description text,
  visibility text default 'private',
  ocr_status text default 'not_started',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(storage_bucket, storage_path)
);
create index if not exists idx_documents_pet on public.documents(pet_id, created_at desc);

create table if not exists public.document_links (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  created_at timestamptz default now(),
  unique(document_id, entity_type, entity_id)
);

create table if not exists public.medical_visits (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  visited_at timestamptz not null,
  visit_type text,
  reason text,
  diagnosis text,
  treatment_summary text,
  provider_id uuid,
  veterinarian_name text,
  clinic_name text,
  cost_amount numeric,
  currency_code text references public.currencies(code),
  invoice_document_id uuid references public.documents(id),
  follow_up_required boolean default false,
  follow_up_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_medical_visits_pet_date on public.medical_visits(pet_id, visited_at desc);

create table if not exists public.vaccinations (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  vaccine_id uuid references public.ref_vaccines(id),
  vaccine_name text not null,
  administered_at date,
  valid_until date,
  next_due_at date,
  batch_number text,
  manufacturer text,
  provider_id uuid,
  administered_by text,
  certificate_document_id uuid references public.documents(id),
  status text default 'unknown',
  reaction_notes text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_vaccinations_pet_due on public.vaccinations(pet_id, next_due_at);
create index if not exists idx_vaccinations_pet_administered on public.vaccinations(pet_id, administered_at desc);

create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  medication_id uuid references public.ref_medications(id),
  name text not null,
  dosage_value numeric,
  dosage_unit text,
  route text,
  frequency text,
  schedule jsonb default '{}'::jsonb,
  start_at date,
  end_at date,
  is_ongoing boolean default false,
  prescription_document_id uuid references public.documents(id),
  reason text,
  instructions text,
  reminders_enabled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_medications_pet_active on public.medications(pet_id) where is_ongoing = true;

create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  recorded_at timestamptz not null default now(),
  weight numeric not null,
  unit text default 'kg',
  body_condition_score numeric,
  notes text,
  source text default 'manual',
  created_at timestamptz default now()
);
create index if not exists idx_weight_logs_pet_recorded on public.weight_logs(pet_id, recorded_at desc);

create table if not exists public.health_scores (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  calculated_at timestamptz not null default now(),
  overall_score int check (overall_score between 0 and 100),
  score_category text,
  preventive_care_score int,
  vaccination_score int,
  weight_score int,
  data_completeness_score int,
  recent_wellness_score int,
  component_details jsonb default '{}'::jsonb,
  recommendations jsonb default '[]'::jsonb
);
create index if not exists idx_health_scores_pet_calculated on public.health_scores(pet_id, calculated_at desc);

create table if not exists public.public_shares (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  created_by uuid not null references auth.users(id),
  token_hash text unique not null,
  share_type text not null,
  scope jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  revoked_at timestamptz,
  max_views int,
  view_count int default 0,
  created_at timestamptz default now()
);
create index if not exists idx_public_shares_pet on public.public_shares(pet_id);
