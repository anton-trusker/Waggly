-- Consolidated Migration Script for Remote Supabase
-- Apply all form enhancement migrations in sequence
-- Date: 2025-12-25
-- IMPORTANT: Run this in Supabase SQL Editor for your remote database

-- ============================================================================
-- Migration 1: Enhance visits table for multi-provider support
-- ============================================================================

-- Add provider type classification
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS provider_type VARCHAR(50) DEFAULT 'veterinary';
COMMENT ON COLUMN medical_visits.provider_type IS 'Type of service provider: veterinary, groomer, trainer, boarder, daycare, walker, sitter, behaviorist, nutritionist, other';

-- Add service-specific category field
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS service_category VARCHAR(100);
COMMENT ON COLUMN medical_visits.service_category IS 'Specific service type, varies by provider_type';

-- Add time and duration fields
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS visit_time TIME;
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;

-- Add provider/business information fields
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS provider_name VARCHAR(255);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_phone VARCHAR(20);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_email VARCHAR(255);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_website VARCHAR(500);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_place_id VARCHAR(255);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_lat DECIMAL(10, 8);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_lng DECIMAL(11, 8);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS distance_km DECIMAL(6, 2);

-- Add medical-specific fields
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS current_medications JSONB;
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS special_instructions TEXT;
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS recommendations JSONB;

-- Universal fields
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS cost_breakdown JSONB;
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS insurance_provider VARCHAR(255);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS insurance_claim_status VARCHAR(50);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS invoice_document_id UUID REFERENCES documents(id);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS attachments JSONB;

-- Reminder fields
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS reminder_date TIMESTAMP;
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS reminder_type VARCHAR(50);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS shared_with JSONB;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_medical_visits_date ON medical_visits(date);
CREATE INDEX IF NOT EXISTS idx_medical_visits_pet_date ON medical_visits(pet_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_medical_visits_provider_type ON medical_visits(provider_type);
CREATE INDEX IF NOT EXISTS idx_medical_visits_business_place_id ON medical_visits(business_place_id);

-- Update existing data
UPDATE medical_visits SET provider_type = 'veterinary' WHERE provider_type IS NULL;

-- ============================================================================
-- Migration 2: Enhance vaccinations table
-- ============================================================================

ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS administered_time TIME;
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(255);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS route_of_administration VARCHAR(100);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS administered_by VARCHAR(255);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS clinic_place_id VARCHAR(255);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS vaccination_type VARCHAR(50);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS schedule_interval VARCHAR(50);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS insurance_provider VARCHAR(255);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS certificate_document_id UUID REFERENCES documents(id);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS reaction_severity VARCHAR(50);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS reactions JSONB;
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS reminder_days_before INTEGER DEFAULT 14;
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS reminder_methods JSONB;
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS reminder_recipients JSONB;

CREATE INDEX IF NOT EXISTS idx_vaccinations_next_due ON vaccinations(next_due_date) WHERE next_due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vaccinations_pet_date ON vaccinations(pet_id, date_given DESC);
CREATE INDEX IF NOT EXISTS idx_vaccinations_type ON vaccinations(vaccination_type);

-- ============================================================================
-- Migration 3: Enhance medications table
-- ============================================================================

ALTER TABLE medications ADD COLUMN IF NOT EXISTS treatment_type VARCHAR(50);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS administration_times JSONB;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS administration_instructions TEXT;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS best_time_to_give JSONB;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS duration_value INTEGER;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS duration_unit VARCHAR(20);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS is_ongoing BOOLEAN DEFAULT FALSE;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS strength VARCHAR(50);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS form VARCHAR(50);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS prescribed_by VARCHAR(255);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS pharmacy_name VARCHAR(255);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS pharmacy_place_id VARCHAR(255);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS prescription_number VARCHAR(100);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS prescription_document_id UUID REFERENCES documents(id);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS refill_schedule JSONB;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS auto_refill BOOLEAN DEFAULT FALSE;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10, 2);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS quantity INTEGER;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS total_cost DECIMAL(10, 2);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS insurance_coverage_percent INTEGER;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS out_of_pocket_cost DECIMAL(10, 2);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS side_effects JSONB;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS severity_rating VARCHAR(20);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS contraindications TEXT;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS interactions JSONB;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS storage_instructions VARCHAR(255);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS reason_for_treatment TEXT;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS condition_being_treated VARCHAR(255);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS monitor_for JSONB;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS reminder_notify_caregivers JSONB;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS reminder_before_minutes INTEGER DEFAULT 30;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS reminder_calendar_event BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_medications_active ON medications(pet_id, start_date) WHERE end_date IS NULL;
CREATE INDEX IF NOT EXISTS idx_medications_end_date ON medications(end_date);
CREATE INDEX IF NOT EXISTS idx_medications_pet_dates ON medications(pet_id, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_medications_treatment_type ON medications(treatment_type);

-- ============================================================================
-- Migration 4: Enhance health_metrics table
-- ============================================================================

CREATE TABLE IF NOT EXISTS health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id),
  measured_at TIMESTAMP,
  weight DECIMAL(6, 2),
  veterinary_consultation_needed BOOLEAN DEFAULT FALSE
);

ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS measured_by VARCHAR(255);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS measurement_location VARCHAR(100);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS length_value DECIMAL(6, 2);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS length_unit VARCHAR(10);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS height_at_shoulder DECIMAL(6, 2);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS height_unit VARCHAR(10);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS girth_circumference DECIMAL(6, 2);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS girth_unit VARCHAR(10);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS blood_pressure_systolic INTEGER;
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS blood_pressure_diastolic INTEGER;
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS pain_score INTEGER CHECK (pain_score BETWEEN 1 AND 10);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS pain_observations TEXT;
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS coat_condition VARCHAR(50);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS coat_notes TEXT;
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS appetite_level VARCHAR(50);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS appetite_notes TEXT;
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS hydration_status VARCHAR(50);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS activity_level VARCHAR(50);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS activity_observations TEXT;
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS lab_results JSONB;
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS weight_change_percent DECIMAL(5, 2);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS weight_trend VARCHAR(20);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS veterinary_consultation_needed BOOLEAN DEFAULT FALSE;
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS consultation_reasons JSONB;

-- Note: health_metrics may use 'created_at' or 'measured_at' instead of 'date'
-- CREATE INDEX IF NOT EXISTS idx_health_metrics_pet_date ON health_metrics(pet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_metrics_weight ON health_metrics(pet_id, weight) WHERE weight IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_health_metrics_consultation_needed ON health_metrics(pet_id, veterinary_consultation_needed) WHERE veterinary_consultation_needed = TRUE;

-- ============================================================================
-- Migration 5: Enhance allergies table  
-- ============================================================================

-- Rename column (if it exists with old name)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allergies' AND column_name = 'name') THEN
    ALTER TABLE allergies RENAME COLUMN name TO allergen_name;
  END IF;
END $$;

ALTER TABLE allergies ADD COLUMN IF NOT EXISTS allergy_type VARCHAR(50);
ALTER TABLE allergies DROP COLUMN IF EXISTS severity;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS severity_level VARCHAR(20) CHECK (severity_level IN ('mild', 'moderate', 'severe', 'anaphylaxis'));
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS symptoms JSONB;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS symptom_onset VARCHAR(50);
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS reaction_timeline TEXT;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS triggers JSONB;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS avoidance_measures JSONB;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS safe_alternatives JSONB;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS diagnosed_by VARCHAR(255);
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS diagnosed_date DATE;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS diagnostic_test VARCHAR(100);
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS test_results_document_id UUID REFERENCES documents(id);
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS current_treatment JSONB;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS emergency_medications JSONB;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS treatment_effectiveness VARCHAR(50);
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS quality_of_life_impact INTEGER CHECK (quality_of_life_impact BETWEEN 1 AND 10);
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS seasonal_pattern JSONB;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS peak_months VARCHAR(255);
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS emergency_contact_plan JSONB;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS allergy_alert_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS vaccination_considerations TEXT;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS vet_aware BOOLEAN DEFAULT FALSE;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS reminder_type VARCHAR(50);
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS shared_with_vets JSONB;

CREATE INDEX IF NOT EXISTS idx_allergies_pet_severity ON allergies(pet_id, severity_level);
CREATE INDEX IF NOT EXISTS idx_allergies_type ON allergies(allergy_type);
CREATE INDEX IF NOT EXISTS idx_allergies_alert_enabled ON allergies(pet_id, allergy_alert_enabled) WHERE allergy_alert_enabled = TRUE;

-- ============================================================================
-- Migration 6: Enhance documents table
-- ============================================================================

ALTER TABLE documents ADD COLUMN IF NOT EXISTS document_source VARCHAR(100);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS document_date DATE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ocr_data JSONB;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ocr_confidence_score INTEGER CHECK (ocr_confidence_score BETWEEN 0 AND 100);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS manual_details JSONB;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS linked_records JSONB;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS tags JSONB;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'private';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS shared_with_users JSONB;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS shared_with_vets JSONB;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS notify_recipients BOOLEAN DEFAULT FALSE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS confidentiality_level VARCHAR(20) DEFAULT 'normal';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS auto_archive_date DATE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS document_range_start DATE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS document_range_end DATE;

CREATE INDEX IF NOT EXISTS idx_documents_pet_type ON documents(pet_id, type);
CREATE INDEX IF NOT EXISTS idx_documents_date ON documents(document_date) WHERE document_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_archived ON documents(pet_id, archived);
CREATE INDEX IF NOT EXISTS idx_documents_visibility ON documents(visibility);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN (tags);

-- ============================================================================
-- Migration 7: Create reference tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS ref_vaccines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species VARCHAR(50) NOT NULL,
  vaccine_name VARCHAR(255) NOT NULL,
  abbreviation VARCHAR(50),
  vaccine_type VARCHAR(20),
  typical_schedule VARCHAR(255),
  booster_interval VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ref_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_name VARCHAR(255) NOT NULL,
  brand_names JSONB,
  active_ingredient VARCHAR(255),
  category VARCHAR(100),
  typical_dosage_range VARCHAR(100),
  common_uses TEXT,
  side_effects JSONB,
  contraindications TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ref_symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symptom_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  severity_indicator BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ref_allergens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allergen_name VARCHAR(255) NOT NULL,
  allergen_type VARCHAR(50),
  common_reactions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for reference tables
CREATE INDEX IF NOT EXISTS idx_ref_vaccines_species ON ref_vaccines(species);
CREATE INDEX IF NOT EXISTS idx_ref_vaccines_name ON ref_vaccines(vaccine_name);
CREATE INDEX IF NOT EXISTS idx_ref_medications_name ON ref_medications(medication_name);
CREATE INDEX IF NOT EXISTS idx_ref_medications_category ON ref_medications(category);
CREATE INDEX IF NOT EXISTS idx_ref_symptoms_category ON ref_symptoms(category);
CREATE INDEX IF NOT EXISTS idx_ref_allergens_type ON ref_allergens(allergen_type);

-- Populate reference data
INSERT INTO ref_vaccines (species, vaccine_name, abbreviation, vaccine_type, booster_interval, description) VALUES
('Dog', 'Rabies', 'RAB', 'core', '1-3 years', 'Essential vaccine protecting against rabies virus'),
('Dog', 'Distemper, Hepatitis, Parvovirus, Parainfluenza', 'DHPP', 'core', '1-3 years', 'Combination vaccine protecting against multiple diseases'),
('Dog', 'Bordetella', 'BORD', 'non-core', '6-12 months', 'Kennel cough vaccine'),
('Dog', 'Lyme Disease', 'LYME', 'non-core', '1 year', 'Recommended in areas with high tick prevalence'),
('Dog', 'Leptospirosis', 'LEPTO', 'non-core', '1 year', 'Protects against bacterial disease'),
('Dog', 'Canine Influenza', 'CIV', 'non-core', '1 year', 'Protection against dog flu'),
('Cat', 'Rabies', 'RAB', 'core', '1-3 years', 'Essential vaccine protecting against rabies virus'),
('Cat', 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia', 'FVRCP', 'core', '1-3 years', 'Combination vaccine'),
('Cat', 'Feline Leukemia Virus', 'FeLV', 'non-core', '1 year', 'For outdoor and multi-cat households'),
('Cat', 'Feline Immunodeficiency Virus', 'FIV', 'non-core', '1 year', 'For outdoor cats at risk')
ON CONFLICT DO NOTHING;

INSERT INTO ref_symptoms (symptom_name, category, severity_indicator) VALUES
('Vomiting', 'gastrointestinal', TRUE),
('Diarrhea', 'gastrointestinal', TRUE),
('Loss of Appetite', 'general', TRUE),
('Lethargy', 'general', TRUE),
('Coughing', 'respiratory', FALSE),
('Difficulty Breathing', 'respiratory', TRUE),
('Limping', 'musculoskeletal', FALSE),
('Fever', 'general', TRUE),
('Seizures', 'neurological', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO ref_allergens (allergen_name, allergen_type, common_reactions) VALUES
('Chicken', 'food', '["itching", "skin_rash"]'),
('Beef', 'food', '["itching", "ear_infections"]'),
('Pollen', 'environmental', '["sneezing", "itching"]'),
('Flea Saliva', 'insect', '["intense_itching", "hair_loss"]')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Verification Queries (run these to verify migrations worked)
-- ============================================================================

-- Check visits table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'medical_visits' 
AND column_name IN ('provider_type', 'service_category', 'business_name')
ORDER BY column_name;

-- Check reference tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE 'ref_%';

-- Success message
SELECT 'All migrations applied successfully!' AS status;
