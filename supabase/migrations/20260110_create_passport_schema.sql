-- Pet Passport Schema Migration
-- Created: 2026-01-10
-- Purpose: Add complete passport functionality including health scoring, BCS tracking, and enhanced medical records

BEGIN;

-- ========================================
-- PART 1: MODIFY EXISTING TABLES
-- ========================================

-- Extend pets table with passport fields
ALTER TABLE pets ADD COLUMN IF NOT EXISTS passport_id VARCHAR(16) UNIQUE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS passport_generated_at TIMESTAMP;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS passport_updated_at TIMESTAMP;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS microchip_date DATE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS pet_status VARCHAR(20) DEFAULT 'active';
ALTER TABLE pets ADD COLUMN IF NOT EXISTS spayed_neutered_date DATE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS tattoo_id VARCHAR(50);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS coat_type VARCHAR(50);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS eye_color VARCHAR(50);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS distinguishing_marks TEXT;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS ideal_weight_min DECIMAL(5,2);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS ideal_weight_max DECIMAL(5,2);

-- Add indexes for pets table
CREATE INDEX IF NOT EXISTS idx_pets_passport_id ON pets(passport_id);
CREATE INDEX IF NOT EXISTS idx_pets_status ON pets(user_id, pet_status);

-- Extend vaccinations table
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(200);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS lot_number VARCHAR(100);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS clinic VARCHAR(200);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS route VARCHAR(50); -- subcutaneous, intramuscular, intranasal
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS injection_site VARCHAR(100);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS certificate_number VARCHAR(100);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS required_for_travel BOOLEAN DEFAULT FALSE;

-- Add indexes for vaccinations
CREATE INDEX IF NOT EXISTS idx_vaccinations_next_due ON vaccinations(pet_id, next_due_date);
CREATE INDEX IF NOT EXISTS idx_vaccinations_category ON vaccinations(pet_id, category);

-- Extend treatments table
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS prescribed_by VARCHAR(200);
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS prescription_number VARCHAR(100);
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS pharmacy VARCHAR(200);
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS refills_remaining INTEGER;
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS side_effects TEXT[];
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS with_food BOOLEAN;
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS special_instructions TEXT;

-- Add indexes for treatments
CREATE INDEX IF NOT EXISTS idx_treatments_active ON treatments(pet_id, is_active);
CREATE INDEX IF NOT EXISTS idx_treatments_start_date ON treatments(pet_id, start_date DESC);

-- Extend veterinarians table if exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'veterinarians') THEN
        ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS hours TEXT;
        ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS emergency_available BOOLEAN DEFAULT FALSE;
        ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS vet_license_number VARCHAR(100);
        
        CREATE INDEX IF NOT EXISTS idx_vets_primary ON veterinarians(pet_id, is_primary);
    END IF;
END $$;

-- ========================================
-- PART 2: CREATE NEW TABLES
-- ========================================

-- Body Condition Score tracking
CREATE TABLE IF NOT EXISTS body_condition_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 9),
    scale_type VARCHAR(20) DEFAULT '9-point',
    assessed_date DATE NOT NULL,
    assessed_by VARCHAR(200),
    ribs_palpable BOOLEAN,
    waist_visible BOOLEAN,
    abdominal_tuck BOOLEAN,
    category VARCHAR(50), -- underweight, ideal, overweight, obese
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bcs_pet_id ON body_condition_scores(pet_id);
CREATE INDEX IF NOT EXISTS idx_bcs_date ON body_condition_scores(pet_id, assessed_date DESC);

-- Health scores tracking
CREATE TABLE IF NOT EXISTS health_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    calculated_date TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Overall score (0-100)
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    score_category VARCHAR(20), -- excellent, good, fair, poor, critical
    
    -- Component scores (each 0-100)
    preventive_care_score INTEGER,
    vaccination_score INTEGER,
    weight_management_score INTEGER,
    
    -- Metadata
    data_completeness_percentage INTEGER,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_scores_pet_id ON health_scores(pet_id);
CREATE INDEX IF NOT EXISTS idx_health_scores_date ON health_scores(pet_id, calculated_date DESC);

-- Health risks tracking
CREATE TABLE IF NOT EXISTS health_risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    risk_type VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20), -- low, medium, high, critical
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    description TEXT,
    mitigation TEXT,
    contributing_factors TEXT[],
    first_identified DATE,
    last_assessed TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active', -- active, monitoring, resolved
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_risks_pet_id ON health_risks(pet_id);
CREATE INDEX IF NOT EXISTS idx_health_risks_status ON health_risks(pet_id, status);

-- Health recommendations
CREATE TABLE IF NOT EXISTS health_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    recommendation_type VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL, -- urgent, high, medium, low
    title VARCHAR(200) NOT NULL,
    description TEXT,
    action_items TEXT[],
    action_button_text VARCHAR(100),
    expected_benefit TEXT,
    estimated_cost_min DECIMAL(10,2),
    estimated_cost_max DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    due_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    completed_date TIMESTAMP,
    dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_pet_id ON health_recommendations(pet_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_priority ON health_recommendations(pet_id, priority);
CREATE INDEX IF NOT EXISTS idx_recommendations_completed ON health_recommendations(pet_id, completed);

-- Emergency contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    contact_type VARCHAR(50), -- owner, alternate, veterinarian, emergency_vet
    name VARCHAR(200) NOT NULL,
    relationship VARCHAR(100),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(200),
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emergency_contacts_pet_id ON emergency_contacts(pet_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_primary ON emergency_contacts(pet_id, is_primary);

-- ========================================
-- PART 3: DATABASE FUNCTIONS
-- ========================================

-- Function to generate unique passport ID
CREATE OR REPLACE FUNCTION generate_passport_id()
RETURNS VARCHAR(16) AS $$
DECLARE
    new_id VARCHAR(16);
    id_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate PP-{8-digit-random-number}
        new_id := 'PP-' || LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
        
        -- Check if ID already exists
        SELECT EXISTS(SELECT 1 FROM pets WHERE passport_id = new_id) INTO id_exists;
        
        -- Exit loop if unique
        EXIT WHEN NOT id_exists;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-generate passport ID
CREATE OR REPLACE FUNCTION set_passport_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.passport_id IS NULL THEN
        NEW.passport_id := generate_passport_id();
        NEW.passport_generated_at := NOW();
    END IF;
    NEW.passport_updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on pets table
DROP TRIGGER IF EXISTS trigger_set_passport_id ON pets;
CREATE TRIGGER trigger_set_passport_id
    BEFORE INSERT OR UPDATE ON pets
    FOR EACH ROW
    EXECUTE FUNCTION set_passport_id();

-- Function to calculate health score
CREATE OR REPLACE FUNCTION calculate_health_score(p_pet_id UUID)
RETURNS TABLE(
    overall_score INTEGER,
    score_category VARCHAR(20),
    preventive_care INTEGER,
    vaccination INTEGER,
    weight_management INTEGER,
    data_completeness INTEGER
) AS $$
DECLARE
    v_preventive INTEGER := 0;
    v_vaccination INTEGER := 0;
    v_weight INTEGER := 0;
    v_completeness INTEGER := 0;
    v_overall INTEGER := 0;
    v_category VARCHAR(20);
BEGIN
    -- Calculate Preventive Care Score (0-100)
    -- Based on: checkups, vaccinations, dental care
    SELECT 
        CASE 
            WHEN MAX(mv.visit_date) >= CURRENT_DATE - INTERVAL '12 months' THEN 30
            WHEN MAX(mv.visit_date) >= CURRENT_DATE - INTERVAL '18 months' THEN 15
            ELSE 0
        END
    INTO v_preventive
    FROM medical_visits mv
    WHERE mv.pet_id = p_pet_id
        AND mv.visit_type IN ('checkup', 'wellness');
    
    -- If no medical_visits table, default to 0
    IF v_preventive IS NULL THEN
        v_preventive := 0;
    END IF;
    
    -- Calculate Vaccination Score (0-100)
    -- Based on: % of required vaccines current
    WITH required_count AS (
        SELECT COUNT(*) as total FROM vaccinations 
        WHERE pet_id = p_pet_id
    ),
    current_count AS (
        SELECT COUNT(*) as current FROM vaccinations
        WHERE pet_id = p_pet_id AND next_due_date >= CURRENT_DATE
    )
    SELECT 
        CASE 
            WHEN rc.total = 0 THEN 0
            ELSE ROUND((cc.current::DECIMAL / rc.total) * 100)
        END
    INTO v_vaccination
    FROM required_count rc, current_count cc;
    
    -- Calculate Weight Management Score (0-100)
    -- Based on: BCS ideal, weight in range, tracking consistency
    SELECT
        CASE
            WHEN bcs.score BETWEEN 4 AND 5 THEN 40  -- Ideal BCS
            WHEN bcs.score IN (3, 6) THEN 25         -- Slightly off
            ELSE 10                                   -- Underweight or obese
        END +
        CASE
            WHEN COUNT(we.id) >= 2 THEN 20           -- Regular tracking
            ELSE 5
        END
    INTO v_weight
    FROM pets p
    LEFT JOIN body_condition_scores bcs ON bcs.pet_id = p.id
        AND bcs.assessed_date = (
            SELECT MAX(assessed_date) FROM body_condition_scores WHERE pet_id = p.id
        )
    LEFT JOIN weight_entries we ON we.pet_id = p.id
        AND we.date >= CURRENT_DATE - INTERVAL '6 months'
    WHERE p.id = p_pet_id
    GROUP BY bcs.score;
    
    -- Default if no data
    IF v_weight IS NULL THEN
        v_weight := 0;
    END IF;
    
    -- Calculate Data Completeness (0-100)
    -- Based on: filled passport fields
    SELECT
        ROUND(
            ((CASE WHEN name IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN species IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN breed IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN date_of_birth IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN gender IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN weight IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN microchip_number IS NOT NULL THEN 1 ELSE 0 END +
              CASE WHEN photo_url IS NOT NULL THEN 1 ELSE 0 END)::DECIMAL / 8) * 100
        )
    INTO v_completeness
    FROM pets
    WHERE id = p_pet_id;
    
    -- Calculate Overall Score (weighted average)
    v_overall := ROUND(
        (v_preventive * 0.3) + 
        (v_vaccination * 0.3) + 
        (v_weight * 0.3) + 
        (v_completeness * 0.1)
    );
    
    -- Determine Category
    v_category := CASE
        WHEN v_overall >= 90 THEN 'excellent'
        WHEN v_overall >= 75 THEN 'good'
        WHEN v_overall >= 60 THEN 'fair'
        WHEN v_overall >= 40 THEN 'poor'
        ELSE 'critical'
    END;
    
    -- Return results
    RETURN QUERY SELECT 
        v_overall,
        v_category,
        v_preventive,
        v_vaccination,
        v_weight,
        v_completeness;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- PART 4: ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on new tables
ALTER TABLE body_condition_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for body_condition_scores
CREATE POLICY "Users can view their own pet BCS"
    ON body_condition_scores FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = body_condition_scores.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert BCS for their pets"
    ON body_condition_scores FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = body_condition_scores.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their pet BCS"
    ON body_condition_scores FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = body_condition_scores.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their pet BCS"
    ON body_condition_scores FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = body_condition_scores.pet_id
            AND pets.user_id = auth.uid()
        )
    );

-- RLS Policies for health_scores
CREATE POLICY "Users can view their pet health scores"
    ON health_scores FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_scores.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert health scores for their pets"
    ON health_scores FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_scores.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their pet health scores"
    ON health_scores FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_scores.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their pet health scores"
    ON health_scores FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_scores.pet_id
            AND pets.user_id = auth.uid()
        )
    );

-- RLS Policies for health_risks
CREATE POLICY "Users can view their pet health risks"
    ON health_risks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_risks.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert health risks for their pets"
    ON health_risks FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_risks.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their pet health risks"
    ON health_risks FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_risks.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their pet health risks"
    ON health_risks FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_risks.pet_id
            AND pets.user_id = auth.uid()
        )
    );

-- RLS Policies for health_recommendations
CREATE POLICY "Users can view their pet recommendations"
    ON health_recommendations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_recommendations.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert recommendations for their pets"
    ON health_recommendations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_recommendations.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their pet recommendations"
    ON health_recommendations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_recommendations.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their pet recommendations"
    ON health_recommendations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = health_recommendations.pet_id
            AND pets.user_id = auth.uid()
        )
    );

-- RLS Policies for emergency_contacts
CREATE POLICY "Users can view their pet emergency contacts"
    ON emergency_contacts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = emergency_contacts.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert emergency contacts for their pets"
    ON emergency_contacts FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = emergency_contacts.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their pet emergency contacts"
    ON emergency_contacts FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = emergency_contacts.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their pet emergency contacts"
    ON emergency_contacts FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = emergency_contacts.pet_id
            AND pets.user_id = auth.uid()
        )
    );

COMMIT;
