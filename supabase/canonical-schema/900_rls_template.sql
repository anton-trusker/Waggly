-- RLS template. Expand per table after schema is frozen.

alter table public.profiles enable row level security;
create policy profiles_self_all on public.profiles
for all using (id = auth.uid()) with check (id = auth.uid());

alter table public.pets enable row level security;
create policy pets_owner_all on public.pets
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Pet-scoped table pattern:
-- alter table public.<table> enable row level security;
-- create policy <table>_pet_read on public.<table>
-- for select using (
--   exists (select 1 from public.pets p where p.id = <table>.pet_id and p.user_id = auth.uid())
--   or exists (select 1 from public.co_owners c where c.pet_id = <table>.pet_id and c.user_id = auth.uid() and c.status = 'accepted')
-- );
-- create policy <table>_pet_write on public.<table>
-- for all using (
--   exists (select 1 from public.pets p where p.id = <table>.pet_id and p.user_id = auth.uid())
-- ) with check (
--   exists (select 1 from public.pets p where p.id = <table>.pet_id and p.user_id = auth.uid())
-- );
