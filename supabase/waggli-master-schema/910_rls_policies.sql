-- Waggli RLS policy draft.
-- Apply only after reviewing app auth flows. Enabling RLS without matching policies will block client access.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create index if not exists idx_care_notes_pet_id on public.care_notes(pet_id);
create index if not exists idx_pet_genetics_pet_id on public.pet_genetics(pet_id);
create index if not exists idx_pet_photos_user_id on public.pet_photos(user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = (select auth.uid())
      and ur.role in ('admin', 'super_admin')
  );
$$;

create or replace function public.is_pet_owner(p_pet_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.pets p
    where p.id = p_pet_id
      and p.user_id = (select auth.uid())
  );
$$;

create or replace function public.can_read_pet(p_pet_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_pet_owner(p_pet_id)
    or exists (
      select 1
      from public.co_owners c
      where c.pet_id = p_pet_id
        and c.user_id = (select auth.uid())
        and c.status = 'accepted'
        and c.revoked_at is null
    );
$$;

create or replace function public.can_write_pet(p_pet_id uuid, p_permission text default 'write')
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_pet_owner(p_pet_id)
    or exists (
      select 1
      from public.co_owners c
      where c.pet_id = p_pet_id
        and c.user_id = (select auth.uid())
        and c.status = 'accepted'
        and c.revoked_at is null
        and (
          c.role in ('co_owner', 'editor')
          or c.permissions ? p_permission
          or c.permissions ? 'write'
        )
    );
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'roles', 'user_roles', 'pets', 'pet_photos', 'pet_behavior',
    'pet_lifestyle', 'pet_genetics', 'behavior_tags', 'care_notes', 'food',
    'emergency_contacts', 'co_owners', 'documents', 'document_links',
    'veterinarians', 'medical_visits', 'vaccinations', 'medications',
    'treatments', 'allergies', 'conditions', 'health_metrics', 'weight_logs',
    'body_condition_scores', 'health_scores', 'health_risks',
    'health_recommendations', 'activity_logs', 'events', 'notifications',
    'public_shares', 'pet_share_tokens', 'share_links'
  ]
  loop
    if to_regclass('public.' || table_name) is not null then
      execute format('alter table public.%I enable row level security', table_name);
    end if;
  end loop;
end $$;

drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()));

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists roles_admin_read on public.roles;
create policy roles_admin_read on public.roles
  for select to authenticated
  using ((select public.is_admin()));

drop policy if exists user_roles_select_self_or_admin on public.user_roles;
create policy user_roles_select_self_or_admin on public.user_roles
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists pets_select_owned_or_shared on public.pets;
create policy pets_select_owned_or_shared on public.pets
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.can_read_pet(id)) or (select public.is_admin()));

drop policy if exists pets_insert_owner on public.pets;
create policy pets_insert_owner on public.pets
  for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists pets_update_owner_or_editor on public.pets;
create policy pets_update_owner_or_editor on public.pets
  for update to authenticated
  using (user_id = (select auth.uid()) or (select public.can_write_pet(id, 'pet_write')))
  with check (user_id = (select auth.uid()) or (select public.can_write_pet(id, 'pet_write')));

drop policy if exists pets_delete_owner on public.pets;
create policy pets_delete_owner on public.pets
  for delete to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists co_owners_select_involved on public.co_owners;
create policy co_owners_select_involved on public.co_owners
  for select to authenticated
  using ((select public.is_pet_owner(pet_id)) or user_id = (select auth.uid()) or invited_by = (select auth.uid()) or (select public.is_admin()));

drop policy if exists co_owners_owner_insert on public.co_owners;
create policy co_owners_owner_insert on public.co_owners
  for insert to authenticated
  with check ((select public.is_pet_owner(pet_id)) or (select public.is_admin()));

drop policy if exists co_owners_owner_update on public.co_owners;
create policy co_owners_owner_update on public.co_owners
  for update to authenticated
  using ((select public.is_pet_owner(pet_id)) or user_id = (select auth.uid()) or (select public.is_admin()))
  with check ((select public.is_pet_owner(pet_id)) or user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists co_owners_owner_delete on public.co_owners;
create policy co_owners_owner_delete on public.co_owners
  for delete to authenticated
  using ((select public.is_pet_owner(pet_id)) or (select public.is_admin()));

-- Pet-scoped tables: read if owner/co-owner, write if owner/editor.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'pet_photos', 'pet_behavior', 'pet_lifestyle', 'pet_genetics',
    'behavior_tags', 'care_notes', 'food', 'emergency_contacts',
    'veterinarians', 'medical_visits', 'vaccinations', 'medications',
    'treatments', 'allergies', 'conditions', 'health_metrics', 'weight_logs',
    'body_condition_scores', 'health_scores', 'health_risks',
    'health_recommendations', 'activity_logs', 'events', 'documents',
    'public_shares', 'pet_share_tokens', 'share_links'
  ]
  loop
    if to_regclass('public.' || table_name) is not null then
      execute format('drop policy if exists %I on public.%I', table_name || '_select_pet_access', table_name);
      execute format(
        'create policy %I on public.%I for select to authenticated using ((select public.can_read_pet(pet_id)) or (select public.is_admin()))',
        table_name || '_select_pet_access',
        table_name
      );

      execute format('drop policy if exists %I on public.%I', table_name || '_insert_pet_access', table_name);
      execute format(
        'create policy %I on public.%I for insert to authenticated with check ((select public.can_write_pet(pet_id, %L)) or (select public.is_admin()))',
        table_name || '_insert_pet_access',
        table_name,
        'write'
      );

      execute format('drop policy if exists %I on public.%I', table_name || '_update_pet_access', table_name);
      execute format(
        'create policy %I on public.%I for update to authenticated using ((select public.can_write_pet(pet_id, %L)) or (select public.is_admin())) with check ((select public.can_write_pet(pet_id, %L)) or (select public.is_admin()))',
        table_name || '_update_pet_access',
        table_name,
        'write',
        'write'
      );

      execute format('drop policy if exists %I on public.%I', table_name || '_delete_pet_access', table_name);
      execute format(
        'create policy %I on public.%I for delete to authenticated using ((select public.can_write_pet(pet_id, %L)) or (select public.is_admin()))',
        table_name || '_delete_pet_access',
        table_name,
        'write'
      );
    end if;
  end loop;
end $$;

drop policy if exists notifications_user_access on public.notifications;
create policy notifications_user_access on public.notifications
  for all to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()))
  with check (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists events_user_or_pet_access on public.events;
create policy events_user_or_pet_access on public.events
  for all to authenticated
  using (
    user_id = (select auth.uid())
    or (pet_id is not null and (select public.can_read_pet(pet_id)))
    or (select public.is_admin())
  )
  with check (
    user_id = (select auth.uid())
    or (pet_id is not null and (select public.can_write_pet(pet_id, 'write')))
    or (select public.is_admin())
  );

drop policy if exists documents_owner_or_pet_access on public.documents;
create policy documents_owner_or_pet_access on public.documents
  for all to authenticated
  using (
    owner_id = (select auth.uid())
    or uploaded_by = (select auth.uid())
    or (pet_id is not null and (select public.can_read_pet(pet_id)))
    or (select public.is_admin())
  )
  with check (
    owner_id = (select auth.uid())
    or uploaded_by = (select auth.uid())
    or (pet_id is not null and (select public.can_write_pet(pet_id, 'write')))
    or (select public.is_admin())
  );
