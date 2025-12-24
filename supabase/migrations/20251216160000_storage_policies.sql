-- Enable Storage
-- This requires the storage extension (usually enabled by default in Supabase)
-- and creating buckets.

-- 1. Create buckets
-- Note: 'storage.buckets' and 'storage.objects' are managed by Supabase Storage API,
-- but we can insert into them via SQL if we have permissions, or use the UI.
-- Here we insert into storage.buckets if they don't exist.

INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-photos', 'pet-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('user-photos', 'user-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies
-- We need to allow authenticated users to upload/select/update/delete.

-- Pet Photos Policies
CREATE POLICY "Public Access Pet Photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pet-photos' );

CREATE POLICY "Auth Users Upload Pet Photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pet-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Auth Users Update Pet Photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pet-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Auth Users Delete Pet Photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pet-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- User Photos Policies
CREATE POLICY "Public Access User Photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'user-photos' );

CREATE POLICY "Auth Users Upload User Photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Auth Users Update User Photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Auth Users Delete User Photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
