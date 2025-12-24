-- Create translations table for i18n
create table if not exists public.translations (
  id bigserial primary key,
  namespace text not null default 'common',
  key text not null,
  language_code text not null,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint translations_unique unique (namespace, key, language_code)
);

alter table public.translations enable row level security;

-- Allow read for everyone
drop policy if exists "translations_select_for_all" on public.translations;
create policy "translations_select_for_all"
  on public.translations
  for select
  to public
  using (true);

-- Allow insert/update for authenticated users only
drop policy if exists "translations_write_for_authenticated" on public.translations;
create policy "translations_write_for_authenticated"
  on public.translations
  for all
  to authenticated
  using (true)
  with check (true);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_on_translations on public.translations;
create trigger set_updated_at_on_translations
before update on public.translations
for each row execute function public.set_updated_at();

-- Helpful indexes
create index if not exists translations_lang_idx on public.translations(language_code);
create index if not exists translations_ns_key_idx on public.translations(namespace, key);
