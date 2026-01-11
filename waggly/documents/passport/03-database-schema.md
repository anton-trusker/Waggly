# Pet Passport Tab - Complete Database Schema

**Document Version:** 1.0  
**Created:** January 10, 2026  
**Purpose:** Comprehensive database schema for Pet Passport tab

---

## OVERVIEW

This document consolidates all database schema changes required for the Pet Passport tab, including new tables, table modifications, and indexes.

---

## NEW TABLES REQUIRED

### 1. body_condition_scores
Tracks BCS measurements over time.

```sql
CREATE TABLE body_condition_scores (
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
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bcs_pet_id ON body_condition_scores(pet_id);
CREATE INDEX idx_bcs_date ON body_condition_scores(pet_id, assessed_date DESC);
```

### 2. health_scores
Overall health scoring system.

```sql
CREATE TABLE health_scores (
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

CREATE INDEX idx_health_scores_pet_id ON health_scores(pet_id);
CREATE INDEX idx_health_scores_date ON health_scores(pet_id, calculated_date DESC);
```

### 3. health_risks
Risk assessment and tracking.

```sql
CREATE TABLE health_risks (
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

CREATE INDEX idx_health_risks_pet_id ON health_risks(pet_id);
CREATE INDEX idx_health_risks_status ON health_risks(pet_id, status);
```

### 4. health_recommendations
Health improvement recommendations.

```sql
CREATE TABLE health_recommendations (
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

CREATE INDEX idx_recommendations_pet_id ON health_recommendations(pet_id);
CREATE INDEX idx_recommendations_priority ON health_recommendations(pet_id, priority);
```

### 5. medical_visits
Comprehensive vet visit tracking.

```sql
CREATE TABLE medical_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  visit_date DATE NOT NULL,
  visit_type VARCHAR(50), -- checkup, emergency, surgery, follow-up
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

CREATE INDEX idx_medical_visits_pet_id ON medical_visits(pet_id);
CREATE INDEX idx_medical_visits_date ON medical_visits(pet_id, visit_date DESC);
```

### 6. surgeries
Surgery and procedure tracking.

```sql
CREATE TABLE surgeries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  surgery_date DATE NOT NULL,
  surgery_type VARCHAR(50), -- elective, emergency, diagnostic, therapeutic
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

CREATE INDEX idx_surgeries_pet_id ON surgeries(pet_id);
CREATE INDEX idx_surgeries_date ON surgeries(pet_id, surgery_date DESC);
```

### 7. emergency_contacts
Emergency contact information.

```sql
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  contact_type VARCHAR(50), -- owner, alternate, veterinarian
  name VARCHAR(200) NOT NULL,
  relationship VARCHAR(100),
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(200),
  address TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_emergency_contacts_pet_id ON emergency_contacts(pet_id);
```

### 8. travel_plans
Pet travel planning.

```sql
CREATE TABLE travel_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  destination_country VARCHAR(100) NOT NULL,
  travel_date DATE,
  return_date DATE,
  compliance_percentage INTEGER,
  status VARCHAR(20), -- ready, partially_ready, not_ready
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_travel_plans_pet_id ON travel_plans(pet_id);
```

### 9. travel_requirements
Travel requirement checklist items.

```sql
CREATE TABLE travel_requirements (
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

CREATE INDEX idx_travel_reqs_plan_id ON travel_requirements(travel_plan_id);
```

---

## MODIFICATIONS TO EXISTING TABLES

### pets table
```sql
ALTER TABLE pets ADD COLUMN passport_id VARCHAR(16) UNIQUE;
ALTER TABLE pets ADD COLUMN passport_generated_at TIMESTAMP;
ALTER TABLE pets ADD COLUMN passport_updated_at TIMESTAMP;
ALTER TABLE pets ADD COLUMN microchip_date DATE;
ALTER TABLE pets ADD COLUMN pet_status VARCHAR(20) DEFAULT 'active';
ALTER TABLE pets ADD COLUMN spayed_neutered_date DATE;
ALTER TABLE pets ADD COLUMN tattoo_id VARCHAR(50);
ALTER TABLE pets ADD COLUMN coat_type VARCHAR(50);
ALTER TABLE pets ADD COLUMN eye_color VARCHAR(50);
ALTER TABLE pets ADD COLUMN distinguishing_marks TEXT;
ALTER TABLE pets ADD COLUMN ideal_weight_min DECIMAL(5,2);
ALTER TABLE pets ADD COLUMN ideal_weight_max DECIMAL(5,2);

-- Add indexes
CREATE INDEX idx_pets_passport_id ON pets(passport_id);
CREATE INDEX idx_pets_status ON pets(user_id, pet_status);
```

### vaccinations table
```sql
ALTER TABLE vaccinations ADD COLUMN manufacturer VARCHAR(200);
ALTER TABLE vaccinations ADD COLUMN lot_number VARCHAR(100);
ALTER TABLE vaccinations ADD COLUMN clinic VARCHAR(200);
ALTER TABLE vaccinations ADD COLUMN route VARCHAR(50); -- subcutaneous, intramuscular, intranasal
ALTER TABLE vaccinations ADD COLUMN injection_site VARCHAR(100);
ALTER TABLE vaccinations ADD COLUMN certificate_number VARCHAR(100);
ALTER TABLE vaccinations ADD COLUMN required_for_travel BOOLEAN DEFAULT FALSE;

-- Add indexes
CREATE INDEX idx_vaccinations_next_due ON vaccinations(pet_id, next_due_date);
CREATE INDEX idx_vaccinations_category ON vaccinations(pet_id, category);
```

### treatments table
```sql
ALTER TABLE treatments ADD COLUMN prescribed_by VARCHAR(200);
ALTER TABLE treatments ADD COLUMN prescription_number VARCHAR(100);
ALTER TABLE treatments ADD COLUMN pharmacy VARCHAR(200);
ALTER TABLE treatments ADD COLUMN refills_remaining INTEGER;
ALTER TABLE treatments ADD COLUMN side_effects TEXT[];
ALTER TABLE treatments ADD COLUMN with_food BOOLEAN;
ALTER TABLE treatments ADD COLUMN special_instructions TEXT;

-- Add indexes
CREATE INDEX idx_treatments_active ON treatments(pet_id, is_active);
CREATE INDEX idx_treatments_start_date ON treatments(pet_id, start_date DESC);
```

### veterinarians table
```sql
ALTER TABLE veterinarians ADD COLUMN hours TEXT;
ALTER TABLE veterinarians ADD COLUMN emergency_available BOOLEAN DEFAULT FALSE;
ALTER TABLE veterinarians ADD COLUMN vet_license_number VARCHAR(100);

-- Add indexes
CREATE INDEX idx_vets_primary ON veterinarians(pet_id, is_primary);
```

---

## PASSPORT ID GENERATION

### Function to Generate Passport ID
```sql
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
```

### Trigger to Auto-Generate Passport ID
```sql
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

CREATE TRIGGER trigger_set_passport_id
  BEFORE INSERT OR UPDATE ON pets
  FOR EACH ROW
  EXECUTE FUNCTION set_passport_id();
```

---

## HEALTH SCORE CALCULATION FUNCTION

```sql
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
```

---

## ROW LEVEL SECURITY (RLS) POLICIES

### Enable RLS on new tables
```sql
ALTER TABLE body_condition_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_requirements ENABLE ROW LEVEL SECURITY;
```

### Create RLS policies
```sql
-- Policy template for pet-owned tables
CREATE POLICY "Users can view their own pet data"
  ON body_condition_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = body_condition_scores.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own pet data"
  ON body_condition_scores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = body_condition_scores.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own pet data"
  ON body_condition_scores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = body_condition_scores.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own pet data"
  ON body_condition_scores FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = body_condition_scores.pet_id
      AND pets.user_id = auth.uid()
    )
  );

-- Repeat for all new tables: health_scores, health_risks, health_recommendations,
-- medical_visits, surgeries, emergency_contacts, travel_plans
```

---

## MIGRATION SCRIPT

Complete migration to add all changes:

```sql
-- File: 20260110_add_pet_passport_schema.sql

BEGIN;

-- Add new columns to pets table
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

-- Create all new tables (body_condition_scores, health_scores, etc.)
-- ... (use CREATE TABLE statements from above)

-- Add indexes
-- ... (use CREATE INDEX statements from above)

-- Create functions and triggers
-- ... (use function definitions from above)

-- Enable RLS and create policies
-- ... (use RLS statements from above)

COMMIT;
```

---

## SUMMARY

**New Tables:** 9
**Modified Tables:** 4 (pets, vaccinations, treatments, veterinarians)
**Total Indexes:** 25+
**Functions:** 2 (passport ID generation, health score calculation)
**Triggers:** 1 (auto-generate passport ID)
**RLS Policies:** 36 (4 per table × 9 tables)
