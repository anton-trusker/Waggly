-- Create pet_photos table
CREATE TABLE IF NOT EXISTS pet_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pet_photos_pet_id ON pet_photos(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_photos_user_id ON pet_photos(user_id);

ALTER TABLE pet_photos ENABLE ROW LEVEL SECURITY;

-- Policies
-- View: If user owns pet or is co-owner
CREATE POLICY "Users can view photos for their pets" ON pet_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = pet_photos.pet_id 
      AND (
        pets.user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM co_owners 
          WHERE main_owner_id = pets.user_id 
          AND co_owner_id = auth.uid() 
          AND status = 'accepted'
        )
      )
    )
  );

-- Insert: If user owns pet or is co-owner
CREATE POLICY "Users can insert photos for their pets" ON pet_photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = pet_photos.pet_id 
      AND (
        pets.user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM co_owners 
          WHERE main_owner_id = pets.user_id 
          AND co_owner_id = auth.uid() 
          AND status = 'accepted'
        )
      )
    )
  );

-- Update/Delete: If user owns pet or is co-owner (or maybe just owner? let's allow co-owners too)
CREATE POLICY "Users can manage photos for their pets" ON pet_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = pet_photos.pet_id 
      AND (
        pets.user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM co_owners 
          WHERE main_owner_id = pets.user_id 
          AND co_owner_id = auth.uid() 
          AND status = 'accepted'
        )
      )
    )
  );
