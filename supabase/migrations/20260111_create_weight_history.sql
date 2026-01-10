CREATE TABLE IF NOT EXISTS weight_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    unit VARCHAR(10) DEFAULT 'kg' CHECK (unit IN ('kg', 'lbs')),
    date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_weight_history_pet_id ON weight_history(pet_id);
CREATE INDEX IF NOT EXISTS idx_weight_history_date ON weight_history(date DESC);

-- RLS
ALTER TABLE weight_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their pets' weight history"
    ON weight_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = weight_history.pet_id
            AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their pets' weight history"
    ON weight_history FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = weight_history.pet_id
            AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their pets' weight history"
    ON weight_history FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = weight_history.pet_id
            AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their pets' weight history"
    ON weight_history FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = weight_history.pet_id
            AND pets.owner_id = auth.uid()
        )
    );
