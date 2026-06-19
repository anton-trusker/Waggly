-- Waggli canonical schema: extensions and helpers

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";
-- Optional after Supabase confirms availability:
-- create extension if not exists "postgis";
-- create extension if not exists "pg_cron";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
