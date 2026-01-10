-- 1. Enhance 'pets' table with detailed physical attributes
ALTER TABLE pets
ADD COLUMN IF NOT EXISTS tail_length text,
ADD COLUMN IF NOT EXISTS fur_description text,
ADD COLUMN IF NOT EXISTS coat_type text,
ADD COLUMN IF NOT EXISTS eye_color text,
ADD COLUMN IF NOT EXISTS tattoo_id text;

-- 2. Create 'medical_conditions' table
CREATE TABLE IF NOT EXISTS medical_conditions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
    condition_name text NOT NULL,
    diagnosed_date date,
    status text DEFAULT 'Active' CHECK (status IN ('Active', 'Chronic', 'Resolved', 'Watch')),
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Create 'share_links' table for secure token sharing
CREATE TABLE IF NOT EXISTS share_links (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
    token text UNIQUE NOT NULL,
    permissions jsonb DEFAULT '{"basic": true, "medical": true, "documents": false}'::jsonb,
    created_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    active boolean DEFAULT true
);

-- 4. Enable RLS
ALTER TABLE medical_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- 5. Policies for medical_conditions (Same as other pet records: Owner access)
CREATE POLICY "Users can view conditions for their pets" ON medical_conditions
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM pets WHERE id = medical_conditions.pet_id));

CREATE POLICY "Users can insert conditions for their pets" ON medical_conditions
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM pets WHERE id = medical_conditions.pet_id));

CREATE POLICY "Users can update conditions for their pets" ON medical_conditions
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM pets WHERE id = medical_conditions.pet_id));

CREATE POLICY "Users can delete conditions for their pets" ON medical_conditions
    FOR DELETE USING (auth.uid() = (SELECT user_id FROM pets WHERE id = medical_conditions.pet_id));

-- 6. Policies for share_links (Owner manages, Public reads via token - separate logic needed for public access, but here owner management)
CREATE POLICY "Users can manage share links for their pets" ON share_links
    FOR ALL USING (auth.uid() = (SELECT user_id FROM pets WHERE id = share_links.pet_id));

-- Note: Public access to share_links usually bypasses RLS via a secure function or service role, or a specific "public view" policy if anon key is used differently. 
-- For now, we ensure the Creator (Owner) can manage them.
