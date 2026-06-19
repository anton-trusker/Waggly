-- Platform domain tables. Expand columns from waggli-db-master-plan/02-canonical-data-model.md before applying.

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  event_type text not null,
  source_type text,
  source_id uuid,
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean default false,
  recurrence_rule text,
  timezone text,
  location jsonb,
  status text default 'scheduled',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_events_pet_starts on public.events(pet_id, starts_at);
create index if not exists idx_events_user_starts on public.events(user_id, starts_at);

create table if not exists public.event_reminders (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  remind_at timestamptz not null,
  channel text not null,
  status text default 'pending',
  created_at timestamptz default now()
);
create index if not exists idx_event_reminders_due on public.event_reminders(status, remind_at);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  payload jsonb default '{}'::jsonb,
  channel text default 'in_app',
  status text default 'pending',
  read_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_notifications_user_unread on public.notifications(user_id, created_at desc) where read_at is null;

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  provider_type text not null,
  business_name text,
  slug text unique,
  verification_status text default 'pending',
  country_code text references public.countries(iso2),
  location jsonb,
  service_radius_km int,
  subscription_status text,
  rating_avg numeric,
  rating_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_providers_type_country on public.providers(provider_type, country_code);
create index if not exists idx_providers_name_trgm on public.providers using gin(business_name gin_trgm_ops);

create table if not exists public.provider_services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  category text not null,
  name text not null,
  base_price_amount numeric,
  currency_code text references public.currencies(code),
  duration_minutes int,
  is_active boolean default true,
  created_at timestamptz default now()
);
create index if not exists idx_provider_services_provider on public.provider_services(provider_id);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete set null,
  channel text default 'app',
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_ai_conversations_user on public.ai_conversations(user_id, created_at desc);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null,
  content text,
  content_json jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_ai_messages_conversation on public.ai_messages(conversation_id, created_at);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  provider_id uuid references public.providers(id) on delete cascade,
  plan_code text not null,
  status text not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_subscriptions_provider on public.subscriptions(provider_id);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  ip_hash text,
  created_at timestamptz default now()
);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id, created_at desc);
