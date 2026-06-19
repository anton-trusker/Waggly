create or replace function public.is_pet_owner(p_pet_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.pets p where p.id = p_pet_id and p.user_id = auth.uid());
$$;

create or replace function public.can_read_pet(p_pet_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_pet_owner(p_pet_id)
    or exists(
      select 1 from public.co_owners c
      where c.pet_id = p_pet_id
        and c.user_id = auth.uid()
        and c.status = 'accepted'
        and c.revoked_at is null
    );
$$;

create or replace function public.can_write_pet(p_pet_id uuid, p_permission text default 'write')
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_pet_owner(p_pet_id)
    or exists(
      select 1 from public.co_owners c
      where c.pet_id = p_pet_id
        and c.user_id = auth.uid()
        and c.status = 'accepted'
        and c.revoked_at is null
        and (c.permissions ? p_permission or c.role in ('co_owner','editor'))
    );
$$;

-- Example policy pattern:
-- alter table public.vaccinations enable row level security;
-- create policy vaccinations_read on public.vaccinations for select using (public.can_read_pet(pet_id));
-- create policy vaccinations_write on public.vaccinations for all using (public.can_write_pet(pet_id, 'health_write')) with check (public.can_write_pet(pet_id, 'health_write'));
