-- Update RLS Policies for Pets and Related Tables
-- FIX: pets.owner_id does not exist, it is pets.user_id

-- 1. Helper Function to Check Access (Updated for correct column)
CREATE OR REPLACE FUNCTION has_pet_access(target_pet_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  pet_owner_id uuid;
  caller_id uuid;
BEGIN
  caller_id := auth.uid();
  
  -- 1. Get Pet Owner (Use user_id column)
  SELECT user_id INTO pet_owner_id FROM pets WHERE id = target_pet_id;
  
  -- If pet doesn't exist, return false
  IF pet_owner_id IS NULL THEN RETURN false; END IF;

  -- 2. If caller is owner, YES
  IF pet_owner_id = caller_id THEN RETURN true; END IF;

  -- 3. Check Co-Owner Permissions
  RETURN EXISTS (
    SELECT 1 FROM co_owners
    WHERE main_owner_id = pet_owner_id
    AND co_owner_id = caller_id
    AND status = 'accepted'
    AND (valid_until IS NULL OR valid_until > NOW())
    AND (
      (permissions->>'scope' = 'all')
      OR
      (permissions->'pet_ids' @> to_jsonb(target_pet_id::text))
    )
  );
END;
$$;

-- 2. Pets Table Policies
DROP POLICY IF EXISTS "Users can view their own pets" ON pets;
CREATE POLICY "Users can view their own pets" ON pets
  FOR SELECT USING (
    auth.uid() = user_id 
    OR 
    has_pet_access(id)
  );

DROP POLICY IF EXISTS "Users can update their own pets" ON pets;
CREATE POLICY "Users can update their own pets" ON pets
  FOR UPDATE USING (
    auth.uid() = user_id 
    OR 
    (has_pet_access(id) AND 
     EXISTS (
       SELECT 1 FROM co_owners 
       WHERE main_owner_id = pets.user_id 
       AND co_owner_id = auth.uid() 
       AND permissions->>'access_level' IN ('admin', 'editor')
     )
    )
  );

-- 3. Vaccinations Table
DROP POLICY IF EXISTS "Users can view vaccinations" ON vaccinations;
CREATE POLICY "Users can view vaccinations" ON vaccinations
  FOR SELECT USING (
    has_pet_access(pet_id)
  );

DROP POLICY IF EXISTS "Users can manage vaccinations" ON vaccinations;
CREATE POLICY "Users can manage vaccinations" ON vaccinations
  FOR ALL USING (
    (SELECT user_id FROM pets WHERE id = vaccinations.pet_id) = auth.uid()
    OR
    (
        has_pet_access(pet_id) AND
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE main_owner_id = (SELECT user_id FROM pets WHERE id = vaccinations.pet_id) 
            AND co_owner_id = auth.uid() 
            AND permissions->>'access_level' IN ('admin', 'editor')
        )
    )
  );

-- 4. Treatments Table
DROP POLICY IF EXISTS "Users can view treatments" ON treatments;
CREATE POLICY "Users can view treatments" ON treatments
  FOR SELECT USING (has_pet_access(pet_id));

DROP POLICY IF EXISTS "Users can manage treatments" ON treatments;
CREATE POLICY "Users can manage treatments" ON treatments
  FOR ALL USING (
    (SELECT user_id FROM pets WHERE id = treatments.pet_id) = auth.uid()
    OR
    (
        has_pet_access(pet_id) AND
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE main_owner_id = (SELECT user_id FROM pets WHERE id = treatments.pet_id) 
            AND co_owner_id = auth.uid() 
            AND permissions->>'access_level' IN ('admin', 'editor')
        )
    )
  );

-- 5. Medical Visits Table
DROP POLICY IF EXISTS "Users can view medical visits" ON medical_visits;
CREATE POLICY "Users can view medical visits" ON medical_visits
  FOR SELECT USING (has_pet_access(pet_id));

DROP POLICY IF EXISTS "Users can manage medical visits" ON medical_visits;
CREATE POLICY "Users can manage medical visits" ON medical_visits
  FOR ALL USING (
    (SELECT user_id FROM pets WHERE id = medical_visits.pet_id) = auth.uid()
    OR
    (
        has_pet_access(pet_id) AND
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE main_owner_id = (SELECT user_id FROM pets WHERE id = medical_visits.pet_id) 
            AND co_owner_id = auth.uid() 
            AND permissions->>'access_level' IN ('admin', 'editor')
        )
    )
  );

-- 6. Events Table
DROP POLICY IF EXISTS "Users can view events" ON events;
CREATE POLICY "Users can view events" ON events
  FOR SELECT USING (has_pet_access(pet_id));

DROP POLICY IF EXISTS "Users can manage events" ON events;
CREATE POLICY "Users can manage events" ON events
  FOR ALL USING (
    (SELECT user_id FROM pets WHERE id = events.pet_id) = auth.uid()
    OR
    (
        has_pet_access(pet_id) AND
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE main_owner_id = (SELECT user_id FROM pets WHERE id = events.pet_id) 
            AND co_owner_id = auth.uid() 
            AND permissions->>'access_level' IN ('admin', 'editor')
        )
    )
  );
