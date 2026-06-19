create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.languages (
  code text primary key,
  name_en text not null,
  native_name text not null,
  is_supported boolean not null default true,
  is_rtl boolean not null default false,
  fallback_language_code text,
  sort_order int default 100
);

create table if not exists public.currencies (
  code text primary key,
  symbol text not null,
  name text not null,
  decimal_places int not null default 2
);

create table if not exists public.countries (
  iso2 text primary key,
  iso3 text unique,
  name_en text not null,
  region text,
  subregion text,
  eu_member boolean default false,
  eea_member boolean default false,
  currency_code text references public.currencies(code),
  default_language_code text references public.languages(code),
  calling_code text,
  timezone_default text,
  pet_travel_region text,
  rabies_status text,
  notes jsonb default '{}'::jsonb
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  country_code text references public.countries(iso2),
  language_code text references public.languages(code) default 'en',
  timezone text,
  photo_url text,
  onboarding_completed boolean default false,
  notification_prefs jsonb default '{}'::jsonb,
  privacy_prefs jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_profiles_country on public.profiles(country_code);
create index if not exists idx_profiles_language on public.profiles(language_code);

create table if not exists public.user_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('ios','android','web')),
  push_token text,
  device_name text,
  locale text,
  timezone text,
  last_seen_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_user_devices_user on public.user_devices(user_id);

create table if not exists public.user_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_type text not null,
  version text not null,
  accepted boolean not null,
  accepted_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);
create index if not exists idx_user_consents_user_type on public.user_consents(user_id, consent_type);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  permissions jsonb not null default '{}'::jsonb,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  created_at timestamptz default now(),
  unique(user_id, role)
);
create index if not exists idx_user_roles_user on public.user_roles(user_id);

create table if not exists public.translation_namespaces (
  key text primary key,
  description text
);

create table if not exists public.translation_keys (
  id uuid primary key default gen_random_uuid(),
  namespace text not null references public.translation_namespaces(key),
  key text not null,
  default_value text,
  description text,
  icu_message boolean default false,
  status text default 'active',
  unique(namespace, key)
);

create table if not exists public.translations (
  key_id uuid not null references public.translation_keys(id) on delete cascade,
  language_code text not null references public.languages(code),
  value text not null,
  status text default 'machine',
  reviewed_by uuid references auth.users(id),
  updated_at timestamptz default now(),
  primary key(key_id, language_code)
);

create table if not exists public.glossary_terms (
  id uuid primary key default gen_random_uuid(),
  term_key text unique not null,
  domain text not null,
  canonical_en text not null,
  definition_en text,
  do_not_translate boolean default false,
  sensitive_medical boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.glossary_translations (
  term_id uuid not null references public.glossary_terms(id) on delete cascade,
  language_code text not null references public.languages(code),
  term text not null,
  definition text,
  synonyms text[],
  status text default 'machine',
  primary key(term_id, language_code)
);
create index if not exists idx_glossary_terms_domain on public.glossary_terms(domain);
create index if not exists idx_glossary_translations_search on public.glossary_translations using gin(term gin_trgm_ops);
