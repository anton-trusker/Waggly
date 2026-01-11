-- 0008_missing_tables.sql

-- Conditions Table (Medical History)
CREATE TABLE IF NOT EXISTS conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    diagnosed_date DATE,
    treatment_plan TEXT,
    notes TEXT,
    status TEXT CHECK (status IN ('active', 'resolved', 'managed', 'unknown')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Logs Table (Feed)
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- User who performed the action
    activity_type TEXT NOT NULL, -- e.g., 'weight', 'visit', 'vaccination', 'custom'
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB, -- Flexible payload for details (e.g., old_weight, new_weight)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers for updated_at
CREATE TRIGGER update_conditions_modtime
    BEFORE UPDATE ON conditions
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Enable RLS
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Reuse simplified policy from 0007 if possible, or define standard ones)

-- Conditions Policies
CREATE POLICY "Users can view conditions for their pets"
    ON conditions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets WHERE pets.id = conditions.pet_id AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert conditions for their pets"
    ON conditions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pets WHERE pets.id = conditions.pet_id AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update conditions for their pets"
    ON conditions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM pets WHERE pets.id = conditions.pet_id AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete conditions for their pets"
    ON conditions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM pets WHERE pets.id = conditions.pet_id AND pets.owner_id = auth.uid()
        )
    );

-- Activity Logs Policies
CREATE POLICY "Users can view activity_logs for their pets"
    ON activity_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets WHERE pets.id = activity_logs.pet_id AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert activity_logs for their pets"
    ON activity_logs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pets WHERE pets.id = activity_logs.pet_id AND pets.owner_id = auth.uid()
        )
    );

-- (Logs are typically append-only, but allow delete if needed)
CREATE POLICY "Users can delete activity_logs for their pets"
    ON activity_logs FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM pets WHERE pets.id = activity_logs.pet_id AND pets.owner_id = auth.uid()
        )
    );

-- Behavior Tags Table
CREATE TABLE IF NOT EXISTS behavior_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    tag TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Behavior Tags RLS
ALTER TABLE behavior_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view behavior_tags for their pets"
    ON behavior_tags FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets WHERE pets.id = behavior_tags.pet_id AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert behavior_tags for their pets"
    ON behavior_tags FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pets WHERE pets.id = behavior_tags.pet_id AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update behavior_tags for their pets"
    ON behavior_tags FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM pets WHERE pets.id = behavior_tags.pet_id AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete behavior_tags for their pets"
    ON behavior_tags FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM pets WHERE pets.id = behavior_tags.pet_id AND pets.owner_id = auth.uid()
        )
    );
