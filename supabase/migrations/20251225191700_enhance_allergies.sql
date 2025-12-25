-- Migration: Enhance allergies table
-- Description: Add comprehensive allergy management and safety tracking
-- Date: 2025-12-25

-- Rename name column to be more specific
ALTER TABLE allergies RENAME COLUMN name TO allergen_name;

-- Add allergy type classification
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS allergy_type VARCHAR(50);
COMMENT ON COLUMN allergies.allergy_type IS 'food, environmental, medication, insect, contact, infection, behavioral, other';

-- Enhance severity tracking
ALTER TABLE allergies DROP COLUMN IF EXISTS severity;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS severity_level VARCHAR(20) CHECK (severity_level IN ('mild', 'moderate', 'severe', 'anaphylaxis'));
COMMENT ON COLUMN allergies.severity_level IS 'Standardized severity classification';

-- Symptom tracking
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS symptoms JSONB;
COMMENT ON COLUMN allergies.symptoms IS 'Array of symptom strings';

ALTER TABLE allergies ADD COLUMN IF NOT EXISTS symptom_onset VARCHAR(50);
COMMENT ON COLUMN allergies.symptom_onset IS 'immediate, delayed, other';

ALTER TABLE allergies ADD COLUMN IF NOT EXISTS reaction_timeline TEXT;
COMMENT ON COLUMN allergies.reaction_timeline IS 'Description of how reaction develops over time';

-- Trigger and avoidance tracking
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS triggers JSONB;
COMMENT ON COLUMN allergies.triggers IS 'Array of specific triggers';

ALTER TABLE allergies ADD COLUMN IF NOT EXISTS avoidance_measures JSONB;
COMMENT ON COLUMN allergies.avoidance_measures IS 'Array of avoidance strategies';

ALTER TABLE allergies ADD COLUMN IF NOT EXISTS safe_alternatives JSONB;
COMMENT ON COLUMN allergies.safe_alternatives IS 'Array of safe food/product alternatives';

-- Diagnosis information
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS diagnosed_by VARCHAR(255);
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS diagnosed_date DATE;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS diagnostic_test VARCHAR(100);
COMMENT ON COLUMN allergies.diagnostic_test IS 'elimination_diet, skin_test, blood_test, food_challenge, clinical_observation, not_diagnosed, other';

ALTER TABLE allergies ADD COLUMN IF NOT EXISTS test_results_document_id UUID REFERENCES documents(id);

-- Treatment tracking
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS current_treatment JSONB;
COMMENT ON COLUMN allergies.current_treatment IS 'Array of treatment items with type and details';

ALTER TABLE allergies ADD COLUMN IF NOT EXISTS emergency_medications JSONB;
COMMENT ON COLUMN allergies.emergency_medications IS 'Array of emergency meds: [{name, dosage, location, expires}]';

ALTER TABLE allergies ADD COLUMN IF NOT EXISTS treatment_effectiveness VARCHAR(50);
COMMENT ON COLUMN allergies.treatment_effectiveness IS 'excellent, good, fair, poor, not_tried';

-- Impact assessment
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS quality_of_life_impact INTEGER CHECK (quality_of_life_impact BETWEEN 1 AND 10);
COMMENT ON COLUMN allergies.quality_of_life_impact IS '1=minimal impact, 10=severe impact';

ALTER TABLE allergies ADD COLUMN IF NOT EXISTS seasonal_pattern JSONB;
COMMENT ON COLUMN allergies.seasonal_pattern IS 'Array of seasons: ["spring", "summer", "fall", "winter", "year-round"]';

ALTER TABLE allergies ADD COLUMN IF NOT EXISTS peak_months VARCHAR(255);

-- Emergency planning
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS emergency_contact_plan JSONB;
COMMENT ON COLUMN allergies.emergency_contact_plan IS '{vet_id, emergency_clinic, contacts[]}';

ALTER TABLE allergies ADD COLUMN IF NOT EXISTS allergy_alert_enabled BOOLEAN DEFAULT TRUE;
COMMENT ON COLUMN allergies.allergy_alert_enabled IS 'Show allergy warning on pet profile';

ALTER TABLE allergies ADD COLUMN IF NOT EXISTS vaccination_considerations TEXT;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS vet_aware BOOLEAN DEFAULT FALSE;

-- Reminder and sharing
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS reminder_type VARCHAR(50);
ALTER TABLE allergies ADD COLUMN IF NOT EXISTS shared_with_vets JSONB;
COMMENT ON COLUMN allergies.shared_with_vets IS 'Array of vet IDs to share allergy info with';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_allergies_pet_severity ON allergies(pet_id, severity_level);
CREATE INDEX IF NOT EXISTS idx_allergies_type ON allergies(allergy_type);
CREATE INDEX IF NOT EXISTS idx_allergies_alert_enabled ON allergies(pet_id, allergy_alert_enabled) WHERE allergy_alert_enabled = TRUE;
