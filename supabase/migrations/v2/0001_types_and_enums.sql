-- Enums for Pet Attributes
CREATE TYPE species_type AS ENUM ('dog', 'cat', 'other');
CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE pet_size_type AS ENUM ('small', 'medium', 'large', 'giant');
CREATE TYPE pet_concerns_type AS ENUM ('anxiety', 'aggression', 'dietary', 'mobility', 'other');

-- Enums for Medical & Health
CREATE TYPE visit_type_enum AS ENUM ('checkup', 'vaccination', 'surgery', 'emergency', 'grooming', 'other');
CREATE TYPE severity_level_enum AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE vaccination_status_enum AS ENUM ('pending', 'completed', 'overdue', 'scheduled');

-- Enums for Providers
CREATE TYPE provider_category_enum AS ENUM ('veterinarian', 'groomer', 'insurance', 'trainer', 'sitter/walker', 'boarding');

-- Enums for Documents
CREATE TYPE document_category_enum AS ENUM ('medical_record', 'prescription', 'lab_result', 'contract', 'invoice', 'photo', 'passport', 'other');

-- Reusable functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
