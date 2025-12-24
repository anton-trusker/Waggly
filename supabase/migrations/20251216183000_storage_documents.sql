-- Create documents bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-documents', 'pet-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for pet-documents
CREATE POLICY "Public Access Pet Documents"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pet-documents' );

CREATE POLICY "Auth Users Upload Pet Documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pet-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Auth Users Update Pet Documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pet-documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Auth Users Delete Pet Documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pet-documents' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
