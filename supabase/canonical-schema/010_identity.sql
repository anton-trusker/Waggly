-- Identity, auth extension, roles

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  country_code text,
  language_code text default 'en',
  date_of_birth date,
  gender text check (gender in ('male','female','non_binary','prefer_not_to_say')),
  phone text,
  address text,
  location_lat double precision,
  location_lng double precision,
  place_id text,
  photo_url text,
  bio text,
  website text,
  notification_prefs jsonb default '{"email":true,"push":true,"sms":false,"marketing":false}'::jsonb,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_country_code on public.profiles(country_code);

create trigger trg_profiles_updated before update on public.profiles
for each row execute function public.set_updated_at();

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
  role text not null default 'pet_owner',
  created_at timestamptz default now(),
  unique(user_id, role)
);

create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
