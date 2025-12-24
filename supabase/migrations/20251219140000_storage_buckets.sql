-- Create storage buckets if not exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pet-photos', 'pet-photos', true) 
ON CONFLICT (id) DO NOTHING;

-- Policy for pet-photos bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pet-photos' );

CREATE POLICY "Authenticated users can upload pet photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pet-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own pet photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pet-photos' 
  AND auth.uid() = owner
);

CREATE POLICY "Users can delete their own pet photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pet-photos' 
  AND auth.uid() = owner
);
