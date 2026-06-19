-- Waggli storage buckets and policies.
-- Recommended path convention:
-- avatars/{user_id}/...
-- user-photos/{user_id}/...
-- pet-photos/{user_id}/{pet_id}/...
-- pet-documents/{user_id}/{pet_id}/...

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('user-photos', 'user-photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('pet-photos', 'pet-photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('pet-documents', 'pet-documents', false, 26214400, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.try_uuid(value text)
returns uuid
language plpgsql
immutable
set search_path = public
as $$
begin
  return value::uuid;
exception when others then
  return null;
end;
$$;

drop policy if exists "Public read avatars" on storage.objects;
create policy "Public read avatars"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'avatars');

drop policy if exists "Users write own avatars" on storage.objects;
create policy "Users write own avatars"
on storage.objects for all
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Public read user photos" on storage.objects;
create policy "Public read user photos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'user-photos');

drop policy if exists "Users write own photos" on storage.objects;
create policy "Users write own photos"
on storage.objects for all
to authenticated
using (
  bucket_id = 'user-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'user-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Public read pet photos" on storage.objects;
create policy "Public read pet photos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'pet-photos');

drop policy if exists "Pet collaborators write pet photos" on storage.objects;
create policy "Pet collaborators write pet photos"
on storage.objects for all
to authenticated
using (
  bucket_id = 'pet-photos'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or public.can_write_pet(public.try_uuid((storage.foldername(name))[2]), 'write')
  )
)
with check (
  bucket_id = 'pet-photos'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or public.can_write_pet(public.try_uuid((storage.foldername(name))[2]), 'write')
  )
);

drop policy if exists "Pet collaborators read documents" on storage.objects;
create policy "Pet collaborators read documents"
on storage.objects for select
to authenticated
using (
  bucket_id = 'pet-documents'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or public.can_read_pet(public.try_uuid((storage.foldername(name))[2]))
  )
);

drop policy if exists "Pet collaborators write documents" on storage.objects;
create policy "Pet collaborators write documents"
on storage.objects for all
to authenticated
using (
  bucket_id = 'pet-documents'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or public.can_write_pet(public.try_uuid((storage.foldername(name))[2]), 'write')
  )
)
with check (
  bucket_id = 'pet-documents'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or public.can_write_pet(public.try_uuid((storage.foldername(name))[2]), 'write')
  )
);

