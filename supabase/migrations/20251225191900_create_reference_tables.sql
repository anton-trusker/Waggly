-- Migration: Create reference tables for form data
-- Description: Add lookup tables for vaccines, medications, symptoms, and allergens
-- Date: 2025-12-25

-- Vaccine reference data
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

COMMENT ON TABLE ref_vaccines IS 'Reference data for common pet vaccines';
COMMENT ON COLUMN ref_vaccines.vaccine_type IS 'core or non-core';
COMMENT ON COLUMN ref_vaccines.booster_interval IS 'Typical interval between boosters (e.g., 1 year, 3 years)';

-- Medication reference data  
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

COMMENT ON TABLE ref_medications IS 'Reference data for common pet medications';
COMMENT ON COLUMN ref_medications.brand_names IS 'Array of brand names for this medication';
COMMENT ON COLUMN ref_medications.category IS 'antibiotic, pain_relief, antiparasitic, etc';
COMMENT ON COLUMN ref_medications.side_effects IS 'Array of common side effects';

-- Symptom reference for quick selection
CREATE TABLE IF NOT EXISTS ref_symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symptom_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  severity_indicator BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE ref_symptoms IS 'Reference data for common symptoms';
COMMENT ON COLUMN ref_symptoms.category IS 'gastrointestinal, respiratory, neurological, dermatological, etc';
COMMENT ON COLUMN ref_symptoms.severity_indicator IS 'TRUE if symptom typically indicates urgent care needed';

-- Allergen reference data
CREATE TABLE IF NOT EXISTS ref_allergens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allergen_name VARCHAR(255) NOT NULL,
  allergen_type VARCHAR(50),
  common_reactions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE ref_allergens IS 'Reference data for common allergens';
COMMENT ON COLUMN ref_allergens.allergen_type IS 'food, environmental, medication, insect, contact';
COMMENT ON COLUMN ref_allergens.common_reactions IS 'Array of typical reactions to this allergen';

-- Create indexes for reference tables
CREATE INDEX IF NOT EXISTS idx_ref_vaccines_species ON ref_vaccines(species);
CREATE INDEX IF NOT EXISTS idx_ref_vaccines_name ON ref_vaccines(vaccine_name);
CREATE INDEX IF NOT EXISTS idx_ref_medications_name ON ref_medications(medication_name);
CREATE INDEX IF NOT EXISTS idx_ref_medications_category ON ref_medications(category);
CREATE INDEX IF NOT EXISTS idx_ref_symptoms_category ON ref_symptoms(category);
CREATE INDEX IF NOT EXISTS idx_ref_allergens_type ON ref_allergens(allergen_type);

-- Populate with common vaccine data
INSERT INTO ref_vaccines (species, vaccine_name, abbreviation, vaccine_type, booster_interval, description) VALUES
('Dog', 'Rabies', 'RAB', 'core', '1-3 years', 'Essential vaccine protecting against rabies virus'),
('Dog', 'Distemper, Hepatitis, Parvovirus, Parainfluenza', 'DHPP', 'core', '1-3 years', 'Combination vaccine protecting against multiple diseases'),
('Dog', 'Bordetella', 'BORD', 'non-core', '6-12 months', 'Kennel cough vaccine, recommended for dogs in social settings'),
('Dog', 'Lyme Disease', 'LYME', 'non-core', '1 year', 'Recommended in areas with high tick prevalence'),
('Dog', 'Leptospirosis', 'LEPTO', 'non-core', '1 year', 'Protects against bacterial disease spread through water'),
('Dog', 'Canine Influenza', 'CIV', 'non-core', '1 year', 'Protection against dog flu'),
('Cat', 'Rabies', 'RAB', 'core', '1-3 years', 'Essential vaccine protecting against rabies virus'),
('Cat', 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia', 'FVRCP', 'core', '1-3 years', 'Combination vaccine protecting against multiple diseases'),
('Cat', 'Feline Leukemia Virus', 'FeLV', 'non-core', '1 year', 'Recommended for outdoor cats and multi-cat households'),
('Cat', 'Feline Immunodeficiency Virus', 'FIV', 'non-core', '1 year', 'Recommended for outdoor cats at risk')
ON CONFLICT DO NOTHING;

-- Populate with common symptoms
INSERT INTO ref_symptoms (symptom_name, category, severity_indicator) VALUES
('Vomiting', 'gastrointestinal', TRUE),
('Diarrhea', 'gastrointestinal', TRUE),
('Loss of Appetite', 'general', TRUE),
('Lethargy', 'general', TRUE),
('Coughing', 'respiratory', FALSE),
('Sneezing', 'respiratory', FALSE),
('Difficulty Breathing', 'respiratory', TRUE),
('Limping', 'musculoskeletal', FALSE),
('Ear Infection', 'dermatological', FALSE),
('Eye Discharge', 'ophthalmological', FALSE),
('Fever', 'general', TRUE),
('Itching/Scratching', 'dermatological', FALSE),
('Hair Loss', 'dermatological', FALSE),
('Seizures', 'neurological', TRUE),
('Excessive Drinking', 'general', FALSE),
('Excessive Urination', 'urinary', FALSE),
('Blood in Urine', 'urinary', TRUE),
('Blood in Stool', 'gastrointestinal', TRUE)
ON CONFLICT DO NOTHING;

-- Populate with common allergens
INSERT INTO ref_allergens (allergen_name, allergen_type, common_reactions) VALUES
('Chicken', 'food', '["itching", "skin_rash", "gastrointestinal_upset"]'),
('Beef', 'food', '["itching", "ear_infections", "paw_licking"]'),
('Dairy', 'food', '["vomiting", "diarrhea", "gas"]'),
('Wheat', 'food', '["itching", "ear_infections"]'),
('Soy', 'food', '["gastrointestinal_upset"]'),
('Corn', 'food', '["skin_issues"]'),
('Pollen', 'environmental', '["sneezing", "itching", "eye_discharge"]'),
('Dust Mites', 'environmental', '["respiratory_issues", "itching"]'),
('Mold', 'environmental', '["respiratory_issues", "skin_irritation"]'),
('Flea Saliva', 'insect', '["intense_itching", "hair_loss", "hot_spots"]'),
('Penicillin', 'medication', '["rash", "vomiting", "anaphylaxis"]'),
('NSAIDs', 'medication', '["gastrointestinal_bleeding", "kidney_issues"]')
ON CONFLICT DO NOTHING;
