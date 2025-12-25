-- Update RLS policies for documents table to use has_pet_access function
-- This ensures co-owners can also view/manage documents

DROP POLICY IF EXISTS "Users can view documents for their pets" ON documents;
CREATE POLICY "Users can view documents" ON documents
  FOR SELECT USING (has_pet_access(pet_id));

DROP POLICY IF EXISTS "Users can insert documents for their pets" ON documents;
CREATE POLICY "Users can insert documents" ON documents
  FOR INSERT WITH CHECK (has_pet_access(pet_id));

DROP POLICY IF EXISTS "Users can update documents for their pets" ON documents;
CREATE POLICY "Users can update documents" ON documents
  FOR UPDATE USING (
    has_pet_access(pet_id) AND
    (
      (SELECT user_id FROM pets WHERE id = documents.pet_id) = auth.uid()
      OR
      EXISTS (
        SELECT 1 FROM co_owners 
        WHERE main_owner_id = (SELECT user_id FROM pets WHERE id = documents.pet_id) 
        AND co_owner_id = auth.uid() 
        AND permissions->>'access_level' IN ('admin', 'editor')
      )
    )
  );

DROP POLICY IF EXISTS "Users can delete documents for their pets" ON documents;
CREATE POLICY "Users can delete documents" ON documents
  FOR DELETE USING (
    has_pet_access(pet_id) AND
    (
      (SELECT user_id FROM pets WHERE id = documents.pet_id) = auth.uid()
      OR
      EXISTS (
        SELECT 1 FROM co_owners 
        WHERE main_owner_id = (SELECT user_id FROM pets WHERE id = documents.pet_id) 
        AND co_owner_id = auth.uid() 
        AND permissions->>'access_level' IN ('admin', 'editor')
      )
    )
  );
