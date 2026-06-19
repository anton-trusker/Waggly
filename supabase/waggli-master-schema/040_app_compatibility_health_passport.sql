-- Waggli app compatibility + health/passport tables.
-- Purpose: fill the current app-facing gaps after the foundation/pet tables.
-- Do not apply blindly; review together with 910_rls_policies.sql.

create table if not exists public.pet_photos (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  caption text,
  is_favorite boolean default false,
  created_at timestamptz default now()
);
create index if not exists idx_pet_photos_pet_id on public.pet_photos(pet_id);
create index if not exists idx_pet_photos_user_id on public.pet_photos(user_id);

create table if not exists public.behavior_tags (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  tag text not null,
  notes text,
  created_at timestamptz default now()
);
create index if not exists idx_behavior_tags_pet_id on public.behavior_tags(pet_id);

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
create index if not exists idx_emergency_contacts_primary on public.emergency_contacts(pet_id, is_primary);

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
  updated_at timestamptz default now(),
  unique(pet_id, user_id)
);
create index if not exists idx_co_owners_pet_id on public.co_owners(pet_id);
create index if not exists idx_co_owners_user_id on public.co_owners(user_id);
create index if not exists idx_co_owners_email_status on public.co_owners(lower(invited_email), status) where invited_email is not null;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade,
  owner_id uuid references auth.users(id) on delete cascade,
  uploaded_by uuid references auth.users(id),
  name text,
  title text,
  description text,
  category text,
  document_type text,
  file_name text,
  file_path text,
  file_url text,
  storage_bucket text default 'pet-documents',
  storage_path text,
  mime_type text,
  file_type text,
  file_size bigint,
  size_bytes bigint,
  visibility text not null default 'private',
  is_favorite boolean default false,
  ocr_status text not null default 'not_started',
  ocr_text text,
  ocr_json jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_documents_pet_created on public.documents(pet_id, created_at desc);
create index if not exists idx_documents_owner_created on public.documents(owner_id, created_at desc);
create index if not exists idx_documents_category on public.documents(category);

create table if not exists public.document_links (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  created_at timestamptz default now(),
  unique(document_id, entity_type, entity_id)
);
create index if not exists idx_document_links_entity on public.document_links(entity_type, entity_id);

create table if not exists public.veterinarians (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  clinic_name text,
  phone text,
  email text,
  website text,
  address text,
  country text,
  place_id text,
  location_lat numeric,
  location_lng numeric,
  is_primary boolean default false,
  emergency_available boolean default false,
  license_number text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_veterinarians_pet_primary on public.veterinarians(pet_id, is_primary);
create index if not exists idx_veterinarians_user on public.veterinarians(user_id);

create table if not exists public.medical_visits (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  visit_date date,
  visited_at timestamptz,
  date text,
  visit_time text,
  visit_type text,
  reason text,
  diagnosis text,
  treatment_summary text,
  recommendations jsonb default '[]'::jsonb,
  provider_id uuid,
  veterinarian_id uuid references public.veterinarians(id) on delete set null,
  veterinarian_name text,
  clinic_name text,
  cost numeric,
  cost_amount numeric,
  currency text default 'EUR',
  invoice_document_id uuid references public.documents(id),
  follow_up_required boolean default false,
  follow_up_date date,
  follow_up_at timestamptz,
  attachments jsonb default '[]'::jsonb,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_medical_visits_pet_visit_date on public.medical_visits(pet_id, visit_date desc);
create index if not exists idx_medical_visits_pet_visited_at on public.medical_visits(pet_id, visited_at desc);

create table if not exists public.vaccinations (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  vaccine_id uuid,
  vaccine_name text not null,
  vaccination_type text,
  category text default 'core',
  manufacturer text,
  batch_number text,
  lot_number text,
  date_given date,
  administered_date date,
  administered_at date,
  valid_until date,
  next_due_date date,
  next_due_at date,
  administered_by uuid,
  administering_vet text,
  provider text,
  provider_id uuid,
  clinic text,
  location text,
  route text,
  route_of_administration text,
  dose_number numeric,
  certificate_number text,
  certificate_document_id uuid references public.documents(id),
  required_for_travel boolean default false,
  status text default 'valid',
  reactions jsonb default '[]'::jsonb,
  reaction_notes text,
  cost numeric,
  currency text default 'EUR',
  reminder_enabled boolean default false,
  reminder_days_before numeric,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_vaccinations_pet_date_given on public.vaccinations(pet_id, date_given desc);
create index if not exists idx_vaccinations_pet_next_due_date on public.vaccinations(pet_id, next_due_date);
create index if not exists idx_vaccinations_status on public.vaccinations(status);

create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  medication_id uuid,
  name text not null,
  treatment_type text,
  dosage text,
  dosage_value numeric,
  dosage_unit text,
  strength text,
  form text,
  route text,
  frequency text,
  schedule jsonb default '{}'::jsonb,
  administration_times jsonb default '[]'::jsonb,
  administration_instructions text,
  instructions text,
  start_date date,
  start_at date,
  end_date date,
  end_at date,
  is_ongoing boolean default false,
  provider_id uuid,
  prescribed_by uuid,
  prescription_number text,
  prescription_document_id uuid references public.documents(id),
  pharmacy_name text,
  reason text,
  reason_for_treatment text,
  condition_being_treated text,
  side_effects jsonb default '[]'::jsonb,
  interactions jsonb default '[]'::jsonb,
  contraindications text,
  reminders_enabled boolean default false,
  cost numeric,
  currency text default 'EUR',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_medications_pet_start on public.medications(pet_id, start_date desc);
create index if not exists idx_medications_pet_ongoing on public.medications(pet_id) where is_ongoing = true;

create table if not exists public.treatments (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  treatment_name text not null,
  category text,
  dosage text,
  dosage_value numeric,
  dosage_unit text,
  frequency text,
  time_of_day text,
  start_date date,
  end_date date,
  next_due_date date,
  is_active boolean default true,
  provider text,
  vet text,
  prescribed_by text,
  prescription_number text,
  pharmacy text,
  refills_remaining int,
  side_effects text[],
  with_food boolean,
  special_instructions text,
  cost numeric,
  currency text default 'EUR',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_treatments_pet_active on public.treatments(pet_id, is_active);
create index if not exists idx_treatments_pet_next_due on public.treatments(pet_id, next_due_date);

create table if not exists public.allergies (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  allergen_id uuid,
  name text,
  allergen text,
  type text,
  allergy_type text,
  severity text,
  severity_level text,
  reaction text,
  reaction_description text,
  symptoms jsonb default '[]'::jsonb,
  triggers jsonb default '[]'::jsonb,
  avoidance_measures jsonb default '[]'::jsonb,
  current_treatment jsonb default '[]'::jsonb,
  diagnosed_date date,
  emergency_contact_plan jsonb default '{}'::jsonb,
  allergy_alert_enabled boolean default true,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_allergies_pet_id on public.allergies(pet_id);

create table if not exists public.conditions (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  condition_id uuid,
  name text not null,
  description text,
  status text default 'active',
  severity text,
  diagnosed_date date,
  resolved_date date,
  treatment_plan text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_conditions_pet_status on public.conditions(pet_id, status);
create index if not exists idx_conditions_pet_diagnosed on public.conditions(pet_id, diagnosed_date desc);

create table if not exists public.health_metrics (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  measured_by uuid references auth.users(id) on delete set null,
  measured_at timestamptz default now(),
  date date,
  weight numeric,
  weight_unit text default 'kg',
  height_at_shoulder numeric,
  height_unit text default 'cm',
  heart_rate_bpm int,
  temperature_celsius numeric,
  respiratory_rate int,
  hydration_status text,
  coat_condition text,
  appetite_level text,
  activity_level text,
  pain_score numeric,
  lab_results jsonb default '{}'::jsonb,
  consultation_reasons jsonb default '[]'::jsonb,
  veterinary_consultation_needed boolean,
  notes text,
  created_at timestamptz default now()
);
create index if not exists idx_health_metrics_pet_measured on public.health_metrics(pet_id, measured_at desc);
create index if not exists idx_health_metrics_pet_date on public.health_metrics(pet_id, date desc);

create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  recorded_at timestamptz not null default now(),
  recorded_date date not null default current_date,
  date date,
  weight numeric not null,
  unit text default 'kg',
  weight_unit text default 'kg',
  body_condition_score numeric,
  source text default 'manual',
  notes text,
  created_at timestamptz default now()
);
create index if not exists idx_weight_logs_pet_recorded on public.weight_logs(pet_id, recorded_at desc);
create index if not exists idx_weight_logs_pet_date on public.weight_logs(pet_id, recorded_date desc);

create table if not exists public.body_condition_scores (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  score int not null check (score between 1 and 9),
  scale_type text default '9-point',
  assessed_date date not null default current_date,
  assessed_by text,
  ribs_palpable boolean,
  waist_visible boolean,
  abdominal_tuck boolean,
  category text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_body_condition_scores_pet_date on public.body_condition_scores(pet_id, assessed_date desc);

create table if not exists public.health_scores (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  calculated_at timestamptz not null default now(),
  calculated_date timestamptz not null default now(),
  overall_score int check (overall_score between 0 and 100),
  score_category text,
  preventive_care_score int,
  vaccination_score int,
  weight_score int,
  weight_management_score int,
  data_completeness_score int,
  data_completeness_percentage int,
  recent_wellness_score int,
  component_details jsonb default '{}'::jsonb,
  recommendations jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_health_scores_pet_calculated on public.health_scores(pet_id, calculated_at desc);

create table if not exists public.health_risks (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  risk_name text,
  risk_type text,
  risk_level text,
  risk_score int check (risk_score between 0 and 100),
  source text,
  description text,
  mitigation text,
  contributing_factors text[],
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_health_risks_pet_status on public.health_risks(pet_id, status);

create table if not exists public.health_recommendations (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  title text not null,
  description text,
  priority text,
  category text,
  recommendation_type text,
  action_items text[],
  due_date date,
  completed boolean default false,
  dismissed boolean default false,
  is_dismissed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_health_recommendations_pet_priority on public.health_recommendations(pet_id, priority);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  action_type text,
  activity_type text,
  title text,
  description text,
  activity_data jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  timestamp timestamptz default now()
);
create index if not exists idx_activity_logs_pet_created on public.activity_logs(pet_id, created_at desc);
create index if not exists idx_activity_logs_profile_created on public.activity_logs(profile_id, created_at desc);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  event_type text not null,
  source_type text,
  source_id uuid,
  starts_at timestamptz,
  start_date date,
  ends_at timestamptz,
  all_day boolean default false,
  recurrence_rule text,
  timezone text,
  location jsonb default '{}'::jsonb,
  status text default 'scheduled',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_events_pet_starts on public.events(pet_id, starts_at);
create index if not exists idx_events_user_starts on public.events(user_id, starts_at);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  message text,
  payload jsonb default '{}'::jsonb,
  channel text default 'in_app',
  status text default 'pending',
  read boolean default false,
  read_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_notifications_user_unread on public.notifications(user_id, created_at desc) where read_at is null;

create table if not exists public.public_shares (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  created_by uuid references auth.users(id) on delete cascade,
  token_hash text unique,
  token text unique,
  share_type text not null default 'passport',
  scope jsonb not null default '{}'::jsonb,
  permissions jsonb not null default '{}'::jsonb,
  active boolean default true,
  expires_at timestamptz,
  revoked_at timestamptz,
  max_views int,
  view_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_public_shares_pet_active on public.public_shares(pet_id, active);
create index if not exists idx_public_shares_token on public.public_shares(token) where token is not null;
create index if not exists idx_public_shares_token_hash on public.public_shares(token_hash) where token_hash is not null;

-- Temporary compatibility table for hooks/usePetSharing.ts.
-- Long term, use public_shares with token_hash only and route public access through RPCs.
create table if not exists public.pet_share_tokens (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  token text not null unique,
  permission_level text not null default 'basic',
  is_active boolean default true,
  created_at timestamptz default now(),
  expires_at timestamptz,
  accessed_count int default 0,
  last_accessed_at timestamptz
);
create index if not exists idx_pet_share_tokens_pet on public.pet_share_tokens(pet_id);
create index if not exists idx_pet_share_tokens_active_token on public.pet_share_tokens(token) where is_active = true;

-- Temporary compatibility table for hooks/passport/useSharePassport.ts.
create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  token text not null unique,
  permissions jsonb not null default '{}'::jsonb,
  active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_share_links_pet_active on public.share_links(pet_id, active);
