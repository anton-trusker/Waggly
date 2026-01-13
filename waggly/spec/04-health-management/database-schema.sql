-- Health Management Database Schema
-- Waggly Platform Specification
-- Version: 1.0

-- ============================================
-- MEDICAL VISITS TABLE
-- ============================================
CREATE TABLE medical_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  visit_type VARCHAR(50) NOT NULL CHECK (visit_type IN (
    'routine_checkup', 'vaccination', 'sick_visit', 'emergency',
    'surgery', 'specialist', 'follow_up', 'dental', 'lab_work'
  )),
  visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Location
  clinic_name VARCHAR(200),
  clinic_address TEXT,
  clinic_place_id VARCHAR(100),
  veterinarian VARCHAR(200),
  
  -- Details
  reason TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  prescriptions TEXT,
  
  -- Follow-up
  follow_up_date DATE,
  follow_up_notes TEXT,
  
  -- Cost
  cost DECIMAL(10,2),
  cost_currency VARCHAR(3) DEFAULT 'EUR',
  
  -- Additional
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visits_pet ON medical_visits(pet_id);
CREATE INDEX idx_visits_date ON medical_visits(visit_date);
CREATE INDEX idx_visits_type ON medical_visits(visit_type);

-- ============================================
-- VACCINATIONS TABLE
-- ============================================
CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  vaccine_id UUID REFERENCES vaccines(id),
  vaccine_name VARCHAR(200) NOT NULL,
  
  -- Administration
  date_given DATE NOT NULL,
  next_due_date DATE,
  
  -- Location
  clinic_name VARCHAR(200),
  clinic_place_id VARCHAR(100),
  veterinarian VARCHAR(200),
  
  -- Details
  batch_number VARCHAR(100),
  manufacturer VARCHAR(100),
  site_of_injection VARCHAR(100),
  
  -- Reaction
  had_reaction BOOLEAN DEFAULT false,
  reaction_details TEXT,
  
  -- Documents
  certificate_url TEXT,
  
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vaccinations_pet ON vaccinations(pet_id);
CREATE INDEX idx_vaccinations_date ON vaccinations(date_given);
CREATE INDEX idx_vaccinations_due ON vaccinations(next_due_date);

-- ============================================
-- VACCINES REFERENCE TABLE
-- ============================================
CREATE TABLE vaccines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  abbreviation VARCHAR(20),
  species TEXT[] NOT NULL,
  vaccine_type VARCHAR(50) CHECK (vaccine_type IN ('core', 'non_core', 'risk_based')),
  initial_age_weeks INTEGER,
  initial_series_count INTEGER DEFAULT 1,
  booster_interval_months INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common vaccines
INSERT INTO vaccines (name, abbreviation, species, vaccine_type, initial_age_weeks, booster_interval_months) VALUES
  ('Rabies', 'RAB', ARRAY['dog', 'cat'], 'core', 12, 12),
  ('Distemper', 'CDV', ARRAY['dog'], 'core', 6, 36),
  ('Parvovirus', 'CPV', ARRAY['dog'], 'core', 6, 36),
  ('Adenovirus/Hepatitis', 'CAV-2', ARRAY['dog'], 'core', 6, 36),
  ('DHPP Combination', 'DHPP', ARRAY['dog'], 'core', 6, 36),
  ('Leptospirosis', 'LEPTO', ARRAY['dog'], 'risk_based', 12, 12),
  ('Bordetella', 'KC', ARRAY['dog'], 'non_core', 8, 12),
  ('Lyme Disease', 'LYME', ARRAY['dog'], 'risk_based', 12, 12),
  ('Feline Panleukopenia', 'FPV', ARRAY['cat'], 'core', 6, 36),
  ('Feline Herpesvirus', 'FHV-1', ARRAY['cat'], 'core', 6, 36),
  ('Feline Calicivirus', 'FCV', ARRAY['cat'], 'core', 6, 36),
  ('FVRCP Combination', 'FVRCP', ARRAY['cat'], 'core', 6, 36),
  ('Feline Leukemia', 'FeLV', ARRAY['cat'], 'risk_based', 8, 12);

-- ============================================
-- TREATMENTS TABLE
-- ============================================
CREATE TABLE treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  medication_id UUID REFERENCES medications(id),
  
  -- Basic Info
  name VARCHAR(200) NOT NULL,
  treatment_type VARCHAR(50) NOT NULL CHECK (treatment_type IN (
    'medication', 'parasite_prevention', 'supplement', 'therapy',
    'procedure', 'surgery', 'alternative'
  )),
  
  -- Dosage
  dosage_amount DECIMAL(10,3),
  dosage_unit VARCHAR(50),
  frequency VARCHAR(50),
  administration_times TEXT[], -- ["08:00", "20:00"]
  route VARCHAR(50), -- 'oral', 'topical', 'injection', etc.
  with_food BOOLEAN DEFAULT false,
  
  -- Duration
  start_date DATE NOT NULL,
  end_date DATE,
  duration_type VARCHAR(50) CHECK (duration_type IN ('ongoing', 'fixed', 'as_needed')),
  
  -- Status
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN (
    'active', 'scheduled', 'completed', 'discontinued', 'paused'
  )),
  
  -- Medical
  reason TEXT,
  prescribing_vet VARCHAR(200),
  prescription_url TEXT,
  
  -- Reminders
  reminders_enabled BOOLEAN DEFAULT true,
  
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_treatments_pet ON treatments(pet_id);
CREATE INDEX idx_treatments_status ON treatments(status);

-- ============================================
-- TREATMENT DOSES TABLE (Medication Log)
-- ============================================
CREATE TABLE treatment_doses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_id UUID REFERENCES treatments(id) ON DELETE CASCADE NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  given_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) CHECK (status IN ('pending', 'given', 'skipped', 'late')),
  skipped_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_doses_treatment ON treatment_doses(treatment_id);
CREATE INDEX idx_doses_time ON treatment_doses(scheduled_time);

-- ============================================
-- HEALTH METRICS TABLE
-- ============================================
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  recorded_date TIMESTAMP WITH TIME ZONE NOT NULL,
  recorded_by VARCHAR(200),
  
  -- Weight
  weight_kg DECIMAL(6,2),
  body_condition_score INTEGER CHECK (body_condition_score BETWEEN 1 AND 9),
  
  -- Vital Signs
  heart_rate INTEGER, -- bpm
  respiratory_rate INTEGER, -- breaths per minute
  temperature_celsius DECIMAL(4,1),
  
  -- Other
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_metrics_pet ON health_metrics(pet_id);
CREATE INDEX idx_metrics_date ON health_metrics(recorded_date);

-- ============================================
-- ALLERGIES TABLE
-- ============================================
CREATE TABLE allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  allergen VARCHAR(200) NOT NULL,
  allergen_type VARCHAR(50) NOT NULL CHECK (allergen_type IN (
    'food', 'environmental', 'medication', 'insect', 'contact', 'other'
  )),
  severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe', 'unknown')),
  symptoms TEXT[],
  first_noticed DATE,
  treatment TEXT,
  diagnosed_by VARCHAR(200),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_allergies_pet ON allergies(pet_id);

-- ============================================
-- CONDITIONS TABLE (Chronic Conditions)
-- ============================================
CREATE TABLE conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  condition_name VARCHAR(200) NOT NULL,
  diagnosis_date DATE,
  diagnosed_by VARCHAR(200),
  severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe')),
  status VARCHAR(50) CHECK (status IN ('active', 'in_remission', 'resolved')),
  treatment_plan TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conditions_pet ON conditions(pet_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE medical_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_doses ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;

-- Generic policy for all health tables
CREATE POLICY "Users can manage pet health records"
  ON medical_visits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = medical_visits.pet_id
      AND (
        pets.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM co_owners
          WHERE co_owners.pet_id = pets.id
          AND co_owners.user_id = auth.uid()
          AND co_owners.status = 'accepted'
        )
      )
    )
  );

-- Similar policies for other health tables...
