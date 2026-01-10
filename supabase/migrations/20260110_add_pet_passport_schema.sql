-- Pet Passport Schema Migration
-- Created: 2026-01-10
-- Purpose: Add comprehensive passport functionality to Pawzly

BEGIN;

-- ============================================================================
-- SECTION 1: UPDATE EXISTING TABLES
-- ============================================================================

-- Add passport-related columns to pets table
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

-- Add constraints
ALTER TABLE pets ADD CONSTRAINT pet_status_check CHECK (pet_status IN ('active', 'deceased', 'lost', 'transferred'));

-- Enhance vaccinations table
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(200);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS lot_number VARCHAR(100);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS clinic VARCHAR(200);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS route VARCHAR(50);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS injection_site VARCHAR(100);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS certificate_number VARCHAR(100);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS required_for_travel BOOLEAN DEFAULT FALSE;

-- Enhance treatments table
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS prescribed_by VARCHAR(200);
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS prescription_number VARCHAR(100);
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS pharmacy VARCHAR(200);
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS refills_remaining INTEGER;
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS side_effects TEXT[];
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS with_food BOOLEAN;
ALTER TABLE treatments ADD COLUMN IF NOT EXISTS special_instructions TEXT;

-- Enhance veterinarians table
ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS hours TEXT;
ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS emergency_available BOOLEAN DEFAULT FALSE;
ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS vet_license_number VARCHAR(100);

-- ============================================================================
-- SECTION 2: CREATE NEW TABLES
-- ============================================================================

-- Body Condition Scores
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
  category VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Health Scores
CREATE TABLE IF NOT EXISTS health_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  calculated_date TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Overall score (0-100)
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  score_category VARCHAR(20),
  
  -- Component scores (each 0-100)
  preventive_care_score INTEGER,
  vaccination_score INTEGER,
  weight_management_score INTEGER,
  
  -- Metadata
  data_completeness_percentage INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Health Risks
CREATE TABLE IF NOT EXISTS health_risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  risk_type VARCHAR(100) NOT NULL,
  risk_level VARCHAR(20),
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  description TEXT,
  mitigation TEXT,
  contributing_factors TEXT[],
  first_identified DATE,
  last_assessed TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Health Recommendations
CREATE TABLE IF NOT EXISTS health_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  recommendation_type VARCHAR(100) NOT NULL,
  priority VARCHAR(20) NOT NULL,
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

-- Medical Visits
CREATE TABLE IF NOT EXISTS medical_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  visit_date DATE NOT NULL,
  visit_type VARCHAR(50),
  veterinarian VARCHAR(200),
  clinic VARCHAR(200),
  reason TEXT,
  diagnosis TEXT,
  treatment_provided TEXT,
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Surgeries
CREATE TABLE IF NOT EXISTS surgeries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  surgery_date DATE NOT NULL,
  surgery_type VARCHAR(50),
  surgery_name VARCHAR(200) NOT NULL,
  surgeon VARCHAR(200),
  clinic VARCHAR(200),
  anesthesia_type VARCHAR(100),
  duration_minutes INTEGER,
  reason TEXT NOT NULL,
  outcome VARCHAR(100),
  complications TEXT[],
  recovery_period_days INTEGER,
  cost DECIMAL(10,2),
  pre_op_notes TEXT,
  post_op_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Emergency Contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  contact_type VARCHAR(50),
  name VARCHAR(200) NOT NULL,
  relationship VARCHAR(100),
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(200),
  address TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Travel Plans
CREATE TABLE IF NOT EXISTS travel_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  destination_country VARCHAR(100) NOT NULL,
  travel_date DATE,
  return_date DATE,
  compliance_percentage INTEGER,
  status VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Travel Requirements
CREATE TABLE IF NOT EXISTS travel_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  travel_plan_id UUID REFERENCES travel_plans(id) ON DELETE CASCADE NOT NULL,
  requirement_type VARCHAR(100),
  requirement_name VARCHAR(200) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  completed_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- SECTION 3: CREATE INDEXES
-- ============================================================================

-- Pets table indexes
CREATE INDEX IF NOT EXISTS idx_pets_passport_id ON pets(passport_id);
CREATE INDEX IF NOT EXISTS idx_pets_status ON pets(user_id, pet_status);

-- Body Condition Scores indexes
CREATE INDEX IF NOT EXISTS idx_bcs_pet_id ON body_condition_scores(pet_id);
CREATE INDEX IF NOT EXISTS idx_bcs_date ON body_condition_scores(pet_id, assessed_date DESC);

-- Health Scores indexes
CREATE INDEX IF NOT EXISTS idx_health_scores_pet_id ON health_scores(pet_id);
CREATE INDEX IF NOT EXISTS idx_health_scores_date ON health_scores(pet_id, calculated_date DESC);

-- Health Risks indexes
CREATE INDEX IF NOT EXISTS idx_health_risks_pet_id ON health_risks(pet_id);
CREATE INDEX IF NOT EXISTS idx_health_risks_status ON health_risks(pet_id, status);

-- Health Recommendations indexes
CREATE INDEX IF NOT EXISTS idx_recommendations_pet_id ON health_recommendations(pet_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_priority ON health_recommendations(pet_id, priority);

-- Medical Visits indexes
CREATE INDEX IF NOT EXISTS idx_medical_visits_pet_id ON medical_visits(pet_id);
CREATE INDEX IF NOT EXISTS idx_medical_visits_date ON medical_visits(pet_id, visit_date DESC);

-- Surgeries indexes
CREATE INDEX IF NOT EXISTS idx_surgeries_pet_id ON surgeries(pet_id);
CREATE INDEX IF NOT EXISTS idx_surgeries_date ON surgeries(pet_id, surgery_date DESC);

-- Emergency Contacts indexes
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_pet_id ON emergency_contacts(pet_id);

-- Travel Plans indexes
CREATE INDEX IF NOT EXISTS idx_travel_plans_pet_id ON travel_plans(pet_id);

-- Travel Requirements indexes
CREATE INDEX IF NOT EXISTS idx_travel_reqs_plan_id ON travel_requirements(travel_plan_id);

-- Vaccinations indexes
CREATE INDEX IF NOT EXISTS idx_vaccinations_next_due ON vaccinations(pet_id, next_due_date);
CREATE INDEX IF NOT EXISTS idx_vaccinations_category ON vaccinations(pet_id, category);

-- Treatments indexes
CREATE INDEX IF NOT EXISTS idx_treatments_active ON treatments(pet_id, is_active);
CREATE INDEX IF NOT EXISTS idx_treatments_start_date ON treatments(pet_id, start_date DESC);

-- Veterinarians indexes
CREATE INDEX IF NOT EXISTS idx_vets_primary ON veterinarians(pet_id, is_primary);

-- ============================================================================
-- SECTION 4: FUNCTIONS
-- ============================================================================

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

-- Trigger to auto-generate passport ID
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

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_passport_id ON pets;
CREATE TRIGGER trigger_set_passport_id
  BEFORE INSERT OR UPDATE ON pets
  FOR EACH ROW
  EXECUTE FUNCTION set_passport_id();

-- ============================================================================
-- SECTION 5: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE body_condition_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_requirements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for body_condition_scores
CREATE POLICY "Users can view their own pet BCS"
  ON body_condition_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = body_condition_scores.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own pet BCS"
  ON body_condition_scores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = body_condition_scores.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own pet BCS"
  ON body_condition_scores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = body_condition_scores.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own pet BCS"
  ON body_condition_scores FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = body_condition_scores.pet_id
      AND pets.user_id = auth.uid()
    )
  );

-- Repeat similar policies for all other new tables
-- (health_scores, health_risks, health_recommendations, medical_visits, surgeries, emergency_contacts, travel_plans)

-- For brevity, creating policy template that applies to all tables
DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOR table_name IN 
    SELECT unnest(ARRAY[
      'health_scores',
      'health_risks', 
      'health_recommendations',
      'medical_visits',
      'surgeries',
      'emergency_contacts',
      'travel_plans'
    ])
  LOOP
    -- SELECT policy
    EXECUTE format('
      CREATE POLICY "Users can view their own pet %I"
        ON %I FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = %I.pet_id
            AND pets.user_id = auth.uid()
          )
        )', table_name, table_name, table_name);
    
    -- INSERT policy
    EXECUTE format('
      CREATE POLICY "Users can insert their own pet %I"
        ON %I FOR INSERT
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = %I.pet_id
            AND pets.user_id = auth.uid()
          )
        )', table_name, table_name, table_name);
    
    -- UPDATE policy
    EXECUTE format('
      CREATE POLICY "Users can update their own pet %I"
        ON %I FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = %I.pet_id
            AND pets.user_id = auth.uid()
          )
        )', table_name, table_name, table_name);
    
    -- DELETE policy
    EXECUTE format('
      CREATE POLICY "Users can delete their own pet %I"
        ON %I FOR DELETE
        USING (
          EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = %I.pet_id
            AND pets.user_id = auth.uid()
          )
        )', table_name, table_name, table_name);
  END LOOP;
END $$;

-- Special policy for travel_requirements (references travel_plans, not pets)
CREATE POLICY "Users can view their own travel requirements"
  ON travel_requirements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM travel_plans
      JOIN pets ON pets.id = travel_plans.pet_id
      WHERE travel_plans.id = travel_requirements.travel_plan_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own travel requirements"
  ON travel_requirements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM travel_plans
      JOIN pets ON pets.id = travel_plans.pet_id
      WHERE travel_plans.id = travel_requirements.travel_plan_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own travel requirements"
  ON travel_requirements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM travel_plans
      JOIN pets ON pets.id = travel_plans.pet_id
      WHERE travel_plans.id = travel_requirements.travel_plan_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own travel requirements"
  ON travel_requirements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM travel_plans
      JOIN pets ON pets.id = travel_plans.pet_id
      WHERE travel_plans.id = travel_requirements.travel_plan_id
      AND pets.user_id = auth.uid()
    )
  );

COMMIT;
