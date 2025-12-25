-- Expand pets table
ALTER TABLE pets ADD COLUMN IF NOT EXISTS blood_type TEXT;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS address_json JSONB;

-- Expand veterinarians table
ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('clinic', 'emergency', 'specialist')) DEFAULT 'clinic';
ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS location_lat DOUBLE PRECISION;
ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS location_lng DOUBLE PRECISION;
ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS place_id TEXT;
ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Create conditions table (Medical History Timeline)
CREATE TABLE IF NOT EXISTS conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'resolved', 'recurring')) DEFAULT 'active',
    diagnosed_date DATE,
    resolved_date DATE,
    notes TEXT,
    severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
    treatment_plan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for conditions
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'conditions' AND policyname = 'Users can view their own pets conditions'
    ) THEN
        CREATE POLICY "Users can view their own pets conditions" ON conditions
            FOR SELECT USING (
                auth.uid() IN (SELECT user_id FROM pets WHERE id = conditions.pet_id)
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'conditions' AND policyname = 'Users can insert conditions for their pets'
    ) THEN
        CREATE POLICY "Users can insert conditions for their pets" ON conditions
            FOR INSERT WITH CHECK (
                auth.uid() IN (SELECT user_id FROM pets WHERE id = conditions.pet_id)
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'conditions' AND policyname = 'Users can update their pets conditions'
    ) THEN
        CREATE POLICY "Users can update their pets conditions" ON conditions
            FOR UPDATE USING (
                auth.uid() IN (SELECT user_id FROM pets WHERE id = conditions.pet_id)
            );
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'conditions' AND policyname = 'Users can delete their pets conditions'
    ) THEN
        CREATE POLICY "Users can delete their pets conditions" ON conditions
            FOR DELETE USING (
                auth.uid() IN (SELECT user_id FROM pets WHERE id = conditions.pet_id)
            );
    END IF;
END
$$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_conditions_pet_id ON conditions(pet_id);
