-- Create storage policies for pet-photos bucket
CREATE POLICY "Users can upload their own pet photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pet-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own pet photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'pet-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own pet photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pet-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own pet photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pet-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to pet photos
CREATE POLICY "Public can view pet photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'pet-photos');;
