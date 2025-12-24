-- Create co_owners table
CREATE TABLE IF NOT EXISTS co_owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  main_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  co_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  co_owner_email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(main_owner_id, co_owner_email)
);

CREATE INDEX IF NOT EXISTS idx_co_owners_main_owner ON co_owners(main_owner_id);
CREATE INDEX IF NOT EXISTS idx_co_owners_co_owner ON co_owners(co_owner_id);
CREATE INDEX IF NOT EXISTS idx_co_owners_email ON co_owners(co_owner_email);

ALTER TABLE co_owners ENABLE ROW LEVEL SECURITY;

-- Policy: Main owner can view/insert/update/delete their co-owners
DROP POLICY IF EXISTS "Users can manage their co-owners" ON co_owners;
CREATE POLICY "Users can manage their co-owners" ON co_owners
  FOR ALL USING (auth.uid() = main_owner_id);

-- Policy: Co-owners can view records where they are the co-owner
DROP POLICY IF EXISTS "Co-owners can view their status" ON co_owners;
CREATE POLICY "Co-owners can view their status" ON co_owners
  FOR SELECT USING (auth.uid() = co_owner_id OR (auth.jwt() ->> 'email') = co_owner_email);

-- Policy: Co-owners can update status (accept invite)
DROP POLICY IF EXISTS "Co-owners can accept invites" ON co_owners;
CREATE POLICY "Co-owners can accept invites" ON co_owners
  FOR UPDATE USING (auth.uid() = co_owner_id OR (auth.jwt() ->> 'email') = co_owner_email);

-- Update Pets RLS
DROP POLICY IF EXISTS "Users can view their own pets" ON pets;
CREATE POLICY "Users can view their own and shared pets" ON pets
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM co_owners 
      WHERE main_owner_id = pets.user_id 
      AND co_owner_id = auth.uid() 
      AND status = 'accepted'
    )
  );

DROP POLICY IF EXISTS "Users can update their own pets" ON pets;
CREATE POLICY "Users can update their own and shared pets" ON pets
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM co_owners 
      WHERE main_owner_id = pets.user_id 
      AND co_owner_id = auth.uid() 
      AND status = 'accepted'
    )
  );

-- Child Tables Policy Update Helper Block
DO $$
DECLARE
  tables text[] := ARRAY[
    'veterinarians', 'allergies', 'behavior_tags', 'medical_history', 
    'food', 'care_notes', 'vaccinations', 'treatments', 'weight_entries',
    'documents', 'medical_visits'
  ];
  t text;
  policy_prefix text;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    -- SELECT
    EXECUTE format('DROP POLICY IF EXISTS "Users can view %I for their pets" ON %I', t, t);
    EXECUTE format('CREATE POLICY "Users can view %I for their pets" ON %I FOR SELECT USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = %I.pet_id))', t, t, t);
    
    -- INSERT
    EXECUTE format('DROP POLICY IF EXISTS "Users can insert %I for their pets" ON %I', t, t);
    EXECUTE format('CREATE POLICY "Users can insert %I for their pets" ON %I FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = %I.pet_id))', t, t, t);
    
    -- UPDATE
    EXECUTE format('DROP POLICY IF EXISTS "Users can update %I for their pets" ON %I', t, t);
    EXECUTE format('CREATE POLICY "Users can update %I for their pets" ON %I FOR UPDATE USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = %I.pet_id))', t, t, t);
    
    -- DELETE
    EXECUTE format('DROP POLICY IF EXISTS "Users can delete %I for their pets" ON %I', t, t);
    EXECUTE format('CREATE POLICY "Users can delete %I for their pets" ON %I FOR DELETE USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = %I.pet_id))', t, t, t);
  END LOOP;
END $$;
