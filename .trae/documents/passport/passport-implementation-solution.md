# Pawzly Pet Passport - Complete Implementation Solution

**Document Version**: 1.0  
**Created**: January 3, 2026  
**Based On**: Pet Passport Data Specification v1.0  
**Purpose**: Detailed solution for implementing comprehensive pet passport features in Pawzly

---

## 📊 EXECUTIVE SUMMARY

This document outlines a complete implementation strategy for enhancing Pawzly with comprehensive digital pet passport capabilities, based on the detailed data specification covering 200+ fields across 9 major categories.

**Current State Gaps**:
- Limited health metrics (basic BCS tracking)
- No comprehensive health scoring system
- Missing breed-specific risk assessments
- No medication/treatment tracking
- Limited vaccination protocol management
- No behavioral/lifestyle data capture
- No partner data export capabilities
- Missing international travel compliance features

**Target State**:
- **Complete Health Passport**: All 200+ data points captured
- **Intelligent Health Scoring**: 0-100 health score with AI-powered risk assessment
- **Partner Integrations**: Insurance, veterinary networks, research
- **International Travel Ready**: EU/UK/US compliance
- **Predictive Analytics**: Claims prediction, health forecasting
- **Premium Monetization**: Advanced features for Pro/Premium tiers

**Implementation Timeline**: 24 weeks (6 months)  
**Estimated Investment**: $180K-$250K  
**Expected ROI**: 150-200% in Year 1 (via insurance partnerships, premium subscriptions)

---

## 1. DATABASE SCHEMA ENHANCEMENTS

### 1.1 Core Tables Additions

#### New Tables to Create

```sql
-- Enhanced Pet Demographics
CREATE TABLE pet_identification_extended (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  microchip_number VARCHAR(15),
  microchip_date DATE,
  microchip_location VARCHAR(100),
  tattoo_id VARCHAR(50),
  registration_number VARCHAR(100),
  breed_secondary VARCHAR(100),
  breed_percentage INTEGER, -- For mixed breeds
  purebred BOOLEAN DEFAULT false,
  breed_registry VARCHAR(100),
  birth_date_estimated BOOLEAN DEFAULT false,
  reproductive_status_date DATE,
  reproductive_status_age INTEGER,
  acquisition_date DATE,
  acquisition_type VARCHAR(50),
  acquisition_location VARCHAR(200),
  breeder_name VARCHAR(200),
  shelter_name VARCHAR(200),
  previous_owner_count INTEGER,
  deceased_date DATE,
  deceased_cause TEXT,
  lost_date DATE,
  found_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Physical Measurements
CREATE TABLE physical_measurements (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  measured_date TIMESTAMP NOT NULL,
  measured_by VARCHAR(200),
  
  -- Weight
  weight_kg DECIMAL(6,2),
  weight_lbs DECIMAL(6,2),
  measurement_method VARCHAR(100),
  is_pregnant BOOLEAN DEFAULT false,
  is_post_surgery BOOLEAN DEFAULT false,
  
  -- Body Measurements
  height_shoulder_cm DECIMAL(5,2),
  length_nose_tail_cm DECIMAL(6,2),
  chest_girth_cm DECIMAL(5,2),
  neck_girth_cm DECIMAL(5,2),
  
  -- Appearance
  color_primary VARCHAR(50),
  color_secondary VARCHAR(50),
  color_pattern VARCHAR(50),
  coat_type VARCHAR(50),
  coat_texture VARCHAR(100),
  eye_color VARCHAR(50),
  distinctive_markings TEXT[],
  
  -- Physical Traits
  tail_type VARCHAR(50),
  ear_type VARCHAR(50),
  claw_status VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Body Condition Scores
CREATE TABLE body_condition_scores (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 9),
  scale_type VARCHAR(20) DEFAULT '9-point',
  assessed_date TIMESTAMP NOT NULL,
  assessed_by VARCHAR(200),
  assessment_method VARCHAR(100),
  
  -- Assessment Details
  ribs_palpable BOOLEAN,
  waist_visible BOOLEAN,
  abdominal_tuck BOOLEAN,
  category VARCHAR(50), -- underweight, ideal, overweight, obese
  
  -- Body Composition
  body_fat_percentage DECIMAL(4,2),
  muscle_condition_score INTEGER CHECK (muscle_condition_score >= 0 AND muscle_condition_score <= 3),
  muscle_mass_category VARCHAR(50),
  muscle_tone VARCHAR(50),
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Health Scores & Metrics
CREATE TABLE health_scores (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  calculated_date TIMESTAMP NOT NULL,
  
  -- Overall Score (0-100)
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  score_category VARCHAR(50), -- critical, poor, fair, good, excellent
  
  -- Component Scores (each 0-100)
  preventive_care_score INTEGER,
  medical_history_score INTEGER,
  lifestyle_score INTEGER,
  genetic_risk_score INTEGER,
  age_adjusted_score INTEGER,
  
  -- Detailed Metrics
  vaccination_compliance INTEGER,
  wellness_visit_compliance INTEGER,
  dental_health_score INTEGER,
  weight_management_score INTEGER,
  parasite_prevention_score INTEGER,
  
  -- Metadata
  data_completeness_percentage INTEGER,
  calculation_method VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Health Risks
CREATE TABLE health_risks (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  risk_type VARCHAR(100) NOT NULL,
  risk_level VARCHAR(20), -- low, medium, high, critical
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  contributing_factors TEXT[],
  mitigation_steps TEXT[],
  first_identified DATE,
  last_assessed TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active', -- active, monitoring, resolved
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Health Red Flags
CREATE TABLE health_red_flags (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  flag_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  identified_date TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  description TEXT NOT NULL,
  action_required TEXT,
  action_taken TEXT,
  resolved_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Health Recommendations
CREATE TABLE health_recommendations (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(100) NOT NULL,
  priority VARCHAR(20) NOT NULL, -- urgent, high, medium, low
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  action_items TEXT[],
  expected_benefit TEXT,
  estimated_cost_min DECIMAL(10,2),
  estimated_cost_max DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_date TIMESTAMP,
  dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vital Signs
CREATE TABLE vital_signs (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  measured_date TIMESTAMP NOT NULL,
  measured_by VARCHAR(200),
  measurement_context VARCHAR(100), -- resting, post-exercise, stressed
  
  -- Cardiovascular
  heart_rate_bpm INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  pulse_quality VARCHAR(50),
  
  -- Respiratory
  respiratory_rate INTEGER,
  respiratory_pattern VARCHAR(50),
  
  -- Temperature
  temperature_celsius DECIMAL(4,2),
  temperature_fahrenheit DECIMAL(5,2),
  temp_measurement_site VARCHAR(50),
  
  -- Clinical Observations
  mucous_membrane_color VARCHAR(50),
  capillary_refill_time_seconds DECIMAL(3,1),
  hydration_status VARCHAR(50),
  
  -- Normal Range Flags
  heart_rate_normal BOOLEAN,
  blood_pressure_normal BOOLEAN,
  respiratory_rate_normal BOOLEAN,
  temperature_normal BOOLEAN,
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chronic Conditions
CREATE TABLE chronic_conditions (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  condition_name VARCHAR(200) NOT NULL,
  icd10_code VARCHAR(10),
  diagnosed_date DATE NOT NULL,
  diagnosed_by VARCHAR(200),
  severity VARCHAR(20), -- low, medium, high, critical
  status VARCHAR(50) NOT NULL, -- active, controlled, in_remission, cured, terminal
  treatment_plan TEXT,
  management_notes TEXT,
  affects_quality_of_life BOOLEAN,
  requires_ongoing_medication BOOLEAN,
  prognosis VARCHAR(50),
  last_flare_up_date DATE,
  related_condition_ids UUID[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Medical Incidents
CREATE TABLE medical_incidents (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  incident_type VARCHAR(100) NOT NULL,
  incident_date TIMESTAMP NOT NULL,
  description TEXT NOT NULL,
  diagnosis TEXT,
  icd10_code VARCHAR(10),
  severity VARCHAR(20),
  treatment_received TEXT,
  outcome VARCHAR(100),
  cost DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  covered_by_insurance BOOLEAN,
  veterinarian VARCHAR(200),
  clinic VARCHAR(200),
  follow_up_required BOOLEAN,
  follow_up_completed_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Surgeries
CREATE TABLE surgeries (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  surgery_type VARCHAR(50) NOT NULL, -- elective, emergency, diagnostic, therapeutic
  surgery_name VARCHAR(200) NOT NULL,
  surgery_date DATE NOT NULL,
  surgeon VARCHAR(200),
  clinic VARCHAR(200),
  anesthesia_type VARCHAR(100),
  duration_minutes INTEGER,
  reason TEXT NOT NULL,
  outcome VARCHAR(100),
  complications TEXT[],
  recovery_period_days INTEGER,
  cost DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  pre_op_notes TEXT,
  post_op_notes TEXT,
  pathology_findings TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Medical Procedures
CREATE TABLE medical_procedures (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  procedure_name VARCHAR(200) NOT NULL,
  procedure_type VARCHAR(100) NOT NULL,
  procedure_date TIMESTAMP NOT NULL,
  performed_by VARCHAR(200),
  clinic VARCHAR(200),
  reason TEXT,
  results TEXT,
  follow_up_required BOOLEAN,
  follow_up_completed_date DATE,
  cost DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Hospitalizations
CREATE TABLE hospitalizations (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  admission_date TIMESTAMP NOT NULL,
  discharge_date TIMESTAMP,
  reason TEXT NOT NULL,
  facility VARCHAR(200) NOT NULL,
  attending_veterinarian VARCHAR(200),
  diagnosis TEXT,
  treatments_received TEXT[],
  discharge_status VARCHAR(100),
  discharge_instructions TEXT,
  total_cost DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hospitalization Daily Notes
CREATE TABLE hospitalization_notes (
  id UUID PRIMARY KEY,
  hospitalization_id UUID REFERENCES hospitalizations(id) ON DELETE CASCADE,
  note_date DATE NOT NULL,
  note_time TIME,
  note TEXT NOT NULL,
  vital_signs_id UUID REFERENCES vital_signs(id),
  treatments_administered TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Laboratory Results
CREATE TABLE lab_results (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  test_date TIMESTAMP NOT NULL,
  test_type VARCHAR(100) NOT NULL,
  test_name VARCHAR(200) NOT NULL,
  ordered_by VARCHAR(200),
  lab_name VARCHAR(200),
  overall_interpretation TEXT,
  abnormal_findings BOOLEAN DEFAULT false,
  critical_values BOOLEAN DEFAULT false,
  veterinarian_notes TEXT,
  follow_up_required BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lab Test Results (individual parameters)
CREATE TABLE lab_test_parameters (
  id UUID PRIMARY KEY,
  lab_result_id UUID REFERENCES lab_results(id) ON DELETE CASCADE,
  parameter_name VARCHAR(100) NOT NULL,
  value_numeric DECIMAL(10,4),
  value_text TEXT,
  unit VARCHAR(50),
  reference_range_min DECIMAL(10,4),
  reference_range_max DECIMAL(10,4),
  is_abnormal BOOLEAN DEFAULT false,
  abnormality_type VARCHAR(20), -- high, low, present, absent
  critical_value BOOLEAN DEFAULT false,
  trend_direction VARCHAR(20), -- improving, stable, worsening, new_finding
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vaccinations (Enhanced)
CREATE TABLE vaccinations_enhanced (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  vaccine_name VARCHAR(200) NOT NULL,
  vaccine_type VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(200),
  lot_number VARCHAR(100),
  administered_date DATE NOT NULL,
  administered_by VARCHAR(200),
  clinic VARCHAR(200),
  route VARCHAR(50), -- subcutaneous, intramuscular, intranasal, oral
  injection_site VARCHAR(100),
  dose_number INTEGER,
  is_booster BOOLEAN DEFAULT false,
  next_due_date DATE,
  expiration_date DATE,
  certificate_number VARCHAR(100),
  
  -- Travel compliance
  required_for_travel BOOLEAN DEFAULT false,
  travel_certificate_issued BOOLEAN DEFAULT false,
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vaccine Reactions
CREATE TABLE vaccine_reactions (
  id UUID PRIMARY KEY,
  vaccination_id UUID REFERENCES vaccinations_enhanced(id) ON DELETE CASCADE,
  reaction_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  onset_time VARCHAR(100),
  description TEXT NOT NULL,
  treatment_required BOOLEAN,
  treatment_given TEXT,
  reported_to_manufacturer BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vaccination Schedules
CREATE TABLE vaccination_schedules (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  species VARCHAR(50) NOT NULL,
  schedule_type VARCHAR(50), -- core, non-core, lifestyle-based
  compliance_percentage INTEGER CHECK (compliance_percentage >= 0 AND compliance_percentage <= 100),
  overdue_vaccines TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Upcoming Vaccinations
CREATE TABLE upcoming_vaccinations (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  vaccination_schedule_id UUID REFERENCES vaccination_schedules(id),
  vaccine_type VARCHAR(100) NOT NULL,
  due_date DATE NOT NULL,
  overdue BOOLEAN DEFAULT false,
  priority VARCHAR(20), -- urgent, high, medium, low
  reason TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_date TIMESTAMP,
  completed BOOLEAN DEFAULT false,
  completed_vaccination_id UUID REFERENCES vaccinations_enhanced(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Medications (Enhanced)
CREATE TABLE medications_enhanced (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  medication_name VARCHAR(200) NOT NULL,
  generic_name VARCHAR(200),
  drug_class VARCHAR(100),
  form VARCHAR(50), -- tablet, capsule, liquid, injection, etc.
  strength VARCHAR(100),
  
  -- Prescription
  prescribed_by VARCHAR(200),
  prescribed_date DATE,
  prescription_number VARCHAR(100),
  pharmacy VARCHAR(200),
  
  -- Dosing
  dosage VARCHAR(200) NOT NULL,
  frequency VARCHAR(200) NOT NULL,
  route VARCHAR(50), -- oral, topical, injection, etc.
  duration VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- active, completed, discontinued, on_hold
  is_long_term BOOLEAN DEFAULT false,
  refills_remaining INTEGER,
  
  -- Indication
  indication TEXT NOT NULL,
  icd10_code VARCHAR(10),
  
  -- Administration
  with_food BOOLEAN,
  special_instructions TEXT,
  side_effects TEXT[],
  
  -- Effectiveness
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  compliance_percentage INTEGER,
  
  -- Cost
  cost_per_unit DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  covered_by_insurance BOOLEAN,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Medication Side Effects (Observed)
CREATE TABLE medication_side_effects (
  id UUID PRIMARY KEY,
  medication_id UUID REFERENCES medications_enhanced(id) ON DELETE CASCADE,
  side_effect VARCHAR(200) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  first_observed TIMESTAMP NOT NULL,
  action_taken TEXT,
  resolved BOOLEAN DEFAULT false,
  resolved_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Parasite Prevention
CREATE TABLE parasite_prevention (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  parasite_type VARCHAR(100) NOT NULL, -- flea, tick, heartworm, intestinal_worm, etc.
  product_name VARCHAR(200) NOT NULL,
  manufacturer VARCHAR(200),
  form VARCHAR(50),
  application_date TIMESTAMP NOT NULL,
  next_application_date DATE,
  coverage_duration_days INTEGER,
  administered_by VARCHAR(200),
  lot_number VARCHAR(100),
  effectiveness TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

(Document continues... This is just Part 1 of the database schema. Should I continue with the remaining tables and then move to the implementation sections?)

### 1.2 Behavioral & Lifestyle Tables

```sql
-- Temperament Traits
CREATE TABLE temperament_traits (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  assessed_date TIMESTAMP NOT NULL,
  assessed_by VARCHAR(200),
  
  -- Trait Scores (1-10)
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  friendliness_humans INTEGER CHECK (friendliness_humans >= 1 AND friendliness_humans <= 10),
  friendliness_dogs INTEGER CHECK (friendliness_dogs >= 1 AND friendliness_dogs <= 10),
  friendliness_cats INTEGER CHECK (friendliness_cats >= 1 AND friendliness_cats <= 10),
  friendliness_children INTEGER CHECK (friendliness_children >= 1 AND friendliness_children <= 10),
  playfulness INTEGER CHECK (playfulness >= 1 AND playfulness <= 10),
  independence INTEGER CHECK (independence >= 1 AND independence <= 10),
  trainability INTEGER CHECK (trainability >= 1 AND trainability <= 10),
  vocalization INTEGER CHECK (vocalization >= 1 AND vocalization <= 10),
  aggression_level INTEGER CHECK (aggression_level >= 1 AND aggression_level <= 10),
  anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  prey_drive INTEGER CHECK (prey_drive >= 1 AND prey_drive <= 10),
  
  overall_temperament VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Behavioral Issues
CREATE TABLE behavioral_issues (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  issue_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  first_observed DATE NOT NULL,
  frequency VARCHAR(50), -- rarely, occasionally, frequently, constantly
  triggers TEXT[],
  management_strategies TEXT[],
  professional_help_sought BOOLEAN DEFAULT false,
  status VARCHAR(50), -- unaddressed, in_treatment, improving, resolved, chronic
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Training History
CREATE TABLE training_history (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  house_trained BOOLEAN DEFAULT false,
  house_trained_age_months INTEGER,
  crate_trained BOOLEAN DEFAULT false,
  leash_trained BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Commands Known
CREATE TABLE commands_known (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  command_name VARCHAR(100) NOT NULL,
  proficiency VARCHAR(50), -- novice, intermediate, advanced, expert
  learned_age_months INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Training Classes
CREATE TABLE training_classes (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  class_name VARCHAR(200) NOT NULL,
  training_type VARCHAR(100),
  start_date DATE,
  end_date DATE,
  completed BOOLEAN DEFAULT false,
  trainer VARCHAR(200),
  certification_earned VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exercise & Activity
CREATE TABLE exercise_routines (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  daily_exercise_minutes INTEGER,
  exercise_types TEXT[],
  exercise_frequency_per_week INTEGER,
  outdoor_access VARCHAR(50),
  exercise_restrictions TEXT[],
  activity_level VARCHAR(50), -- very_low, low, moderate, high, very_high
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Living Environment
CREATE TABLE living_environments (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  home_type VARCHAR(50),
  indoor_outdoor_status VARCHAR(50),
  children_in_home BOOLEAN,
  children_ages INTEGER[],
  household_size INTEGER,
  primary_caregiver VARCHAR(200),
  noise_level VARCHAR(50),
  climate_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Diet Profile
CREATE TABLE diet_profiles (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  diet_type VARCHAR(100),
  feeding_schedule VARCHAR(50),
  food_brand VARCHAR(200),
  food_quality VARCHAR(50),
  daily_calories INTEGER,
  meals_per_day INTEGER,
  treats_per_day INTEGER,
  dietary_restrictions TEXT[],
  food_allergies TEXT[],
  preferred_foods TEXT[],
  weight_management_diet BOOLEAN DEFAULT false,
  prescription_diet BOOLEAN DEFAULT false,
  prescription_diet_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Supplements
CREATE TABLE supplements (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  supplement_name VARCHAR(200) NOT NULL,
  purpose TEXT,
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  started_date DATE,
  discontinued_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 1.3 Breed & Genetics Tables

```sql
-- Breed-Specific Data
CREATE TABLE breed_specific_data (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  breed_name VARCHAR(200) NOT NULL,
  breed_group VARCHAR(100),
  breed_size VARCHAR(50),
  breed_lifespan_min_years INTEGER,
  breed_lifespan_max_years INTEGER,
  breed_weight_min_kg DECIMAL(6,2),
  breed_weight_max_kg DECIMAL(6,2),
  breed_height_min_cm DECIMAL(5,2),
  breed_height_max_cm DECIMAL(5,2),
  working_purpose VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Breed Predispositions
CREATE TABLE breed_predispositions (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  condition_name VARCHAR(200) NOT NULL,
  risk_level VARCHAR(20), -- low, medium, high, critical
  onset_age_typical_years INTEGER,
  prevalence_percentage DECIMAL(5,2),
  preventive_measures TEXT[],
  screening_recommended TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Genetic Tests
CREATE TABLE genetic_tests (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  test_name VARCHAR(200) NOT NULL,
  test_type VARCHAR(100),
  test_date DATE,
  laboratory VARCHAR(200),
  purpose TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Genetic Test Results
CREATE TABLE genetic_test_results (
  id UUID PRIMARY KEY,
  genetic_test_id UUID REFERENCES genetic_tests(id) ON DELETE CASCADE,
  gene_marker VARCHAR(100),
  condition_tested VARCHAR(200) NOT NULL,
  result VARCHAR(50),
  carrier_status VARCHAR(50),
  interpretation TEXT,
  clinical_significance VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pedigree Information
CREATE TABLE pedigrees (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  registration_number VARCHAR(100),
  registry VARCHAR(100),
  sire_name VARCHAR(200),
  sire_registration VARCHAR(100),
  dam_name VARCHAR(200),
  dam_registration VARCHAR(100),
  grand_sires TEXT[],
  grand_dams TEXT[],
  champions_in_lineage INTEGER,
  titles_earned TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 1.4 International Travel Tables

```sql
-- Travel Passports
CREATE TABLE travel_passports (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  passport_number VARCHAR(100) UNIQUE,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  origin_country VARCHAR(3), -- ISO 3166-1 alpha-3
  destination_country VARCHAR(3),
  travel_date DATE,
  
  -- Compliance
  microchip_compliant BOOLEAN DEFAULT false,
  rabies_vaccination_current BOOLEAN DEFAULT false,
  rabies_vaccination_date DATE,
  rabies_certificate_number VARCHAR(100),
  compliance_status VARCHAR(50),
  missing_requirements TEXT[],
  
  -- Health Certificate
  health_certificate_issued BOOLEAN DEFAULT false,
  health_certificate_date DATE,
  health_certificate_number VARCHAR(100),
  examining_veterinarian VARCHAR(200),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Country Requirements
CREATE TABLE country_requirements (
  id UUID PRIMARY KEY,
  travel_passport_id UUID REFERENCES travel_passports(id) ON DELETE CASCADE,
  requirement_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  compliance_met BOOLEAN DEFAULT false,
  evidence TEXT,
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Import/Export Permits
CREATE TABLE travel_permits (
  id UUID PRIMARY KEY,
  travel_passport_id UUID REFERENCES travel_passports(id) ON DELETE CASCADE,
  permit_type VARCHAR(20), -- import, export
  permit_number VARCHAR(100),
  issue_date DATE,
  expiry_date DATE,
  issuing_authority VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quarantine Requirements
CREATE TABLE quarantine_requirements (
  id UUID PRIMARY KEY,
  travel_passport_id UUID REFERENCES travel_passports(id) ON DELETE CASCADE,
  required BOOLEAN DEFAULT false,
  duration_days INTEGER,
  facility VARCHAR(200),
  cost_estimate DECIMAL(10,2),
  currency VARCHAR(3),
  exemption_possible BOOLEAN,
  exemption_criteria TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 1.5 Partner Integration Tables

```sql
-- Insurance Policies
CREATE TABLE insurance_policies (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  provider_name VARCHAR(200) NOT NULL,
  policy_number VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE,
  policy_type VARCHAR(100),
  coverage_type VARCHAR(100),
  annual_limit DECIMAL(10,2),
  deductible DECIMAL(10,2),
  reimbursement_rate INTEGER,
  monthly_premium DECIMAL(10,2),
  annual_premium DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Health Partner Data Exports
CREATE TABLE health_partner_exports (
  id UUID PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  export_date TIMESTAMP NOT NULL,
  export_type VARCHAR(100),
  partner_id VARCHAR(100),
  partner_type VARCHAR(100),
  data_completeness_score INTEGER,
  export_payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Snapshots
CREATE TABLE analytics_snapshots (
  id UUID PRIMARY KEY,
  snapshot_date TIMESTAMP NOT NULL,
  population_size INTEGER,
  filters_applied JSONB,
  analytics_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 2. API ENDPOINTS DESIGN

### 2.1 Health Score & Metrics APIs

```typescript
// POST /api/v1/health/calculate-score
interface CalculateHealthScoreRequest {
  pet_id: string;
  force_recalculation?: boolean;
}

interface CalculateHealthScoreResponse {
  pet_id: string;
  overall_score: number;
  score_category: string;
  component_scores: {
    preventive_care: number;
    medical_history: number;
    lifestyle: number;
    genetic_risk: number;
    age_adjusted: number;
  };
  risks: HealthRisk[];
  red_flags: HealthRedFlag[];
  recommendations: Recommendation[];
  calculated_at: string;
}

// GET /api/v1/health/score/:pet_id
// Returns latest health score

// GET /api/v1/health/score-history/:pet_id
interface HealthScoreHistoryResponse {
  pet_id: string;
  scores: HealthScoreRecord[];
  trend: 'improving' | 'stable' | 'declining';
}

// POST /api/v1/health/risk-assessment/:pet_id
interface RiskAssessmentResponse {
  pet_id: string;
  overall_risk_level: string;
  top_risks: HealthRisk[];
  breed_risks: BreedPredisposition[];
  age_risk_multiplier: number;
  lifestyle_risk_factors: string[];
  environmental_risk_factors: string[];
}
```

### 2.2 Physical Measurements APIs

```typescript
// POST /api/v1/measurements/weight
interface RecordWeightRequest {
  pet_id: string;
  weight_kg: number;
  measured_date: string;
  measured_by?: string;
  measurement_method?: string;
  is_pregnant?: boolean;
  is_post_surgery?: boolean;
}

// POST /api/v1/measurements/body-condition
interface RecordBCSRequest {
  pet_id: string;
  score: number; // 1-9
  assessed_date: string;
  assessed_by?: string;
  ribs_palpable: boolean;
  waist_visible: boolean;
  abdominal_tuck: boolean;
  body_fat_percentage?: number;
  muscle_condition_score?: number;
  notes?: string;
}

// GET /api/v1/measurements/trends/:pet_id
interface MeasurementTrendsResponse {
  pet_id: string;
  weight_trend: TrendData;
  bcs_trend: TrendData;
  ideal_weight_range: {min: number, max: number};
  current_status: string;
  recommendations: string[];
}

// POST /api/v1/measurements/vitals
interface RecordVitalsRequest {
  pet_id: string;
  measured_date: string;
  heart_rate_bpm?: number;
  blood_pressure?: {systolic: number, diastolic: number};
  respiratory_rate?: number;
  temperature_celsius?: number;
  measurement_context?: string;
  notes?: string;
}
```

### 2.3 Medical Records APIs

```typescript
// POST /api/v1/medical/conditions
interface AddChronicConditionRequest {
  pet_id: string;
  condition_name: string;
  icd10_code?: string;
  diagnosed_date: string;
  severity: string;
  treatment_plan?: string;
  diagnosed_by?: string;
}

// POST /api/v1/medical/incidents
interface RecordMedicalIncidentRequest {
  pet_id: string;
  incident_type: string;
  incident_date: string;
  description: string;
  diagnosis?: string;
  treatment_received?: string;
  cost?: number;
  veterinarian?: string;
  clinic?: string;
}

// POST /api/v1/medical/surgeries
interface RecordSurgeryRequest {
  pet_id: string;
  surgery_type: string;
  surgery_name: string;
  surgery_date: string;
  surgeon?: string;
  reason: string;
  outcome?: string;
  cost?: number;
}

// POST /api/v1/medical/lab-results
interface RecordLabResultRequest {
  pet_id: string;
  test_date: string;
  test_type: string;
  test_name: string;
  ordered_by?: string;
  lab_name?: string;
  parameters: LabParameter[];
  overall_interpretation?: string;
  abnormal_findings: boolean;
}

interface LabParameter {
  parameter_name: string;
  value_numeric?: number;
  value_text?: string;
  unit: string;
  reference_range_min?: number;
  reference_range_max?: number;
  is_abnormal: boolean;
}
```

### 2.4 Vaccinations APIs

```typescript
// POST /api/v1/vaccinations
interface RecordVaccinationRequest {
  pet_id: string;
  vaccine_name: string;
  vaccine_type: string;
  administered_date: string;
  administered_by?: string;
  clinic?: string;
  lot_number?: string;
  next_due_date?: string;
  certificate_number?: string;
}

// GET /api/v1/vaccinations/schedule/:pet_id
interface VaccinationScheduleResponse {
  pet_id: string;
  species: string;
  compliance_percentage: number;
  overdue_vaccines: string[];
  upcoming_vaccines: UpcomingVaccine[];
  last_updated: string;
}

// POST /api/v1/vaccinations/schedule/:pet_id/generate
// Generates personalized vaccination schedule based on species, age, lifestyle
```

### 2.5 Medications APIs

```typescript
// POST /api/v1/medications
interface AddMedicationRequest {
  pet_id: string;
  medication_name: string;
  generic_name?: string;
  dosage: string;
  frequency: string;
  route: string;
  start_date: string;
  end_date?: string;
  indication: string;
  prescribed_by?: string;
  special_instructions?: string;
}

// PATCH /api/v1/medications/:medication_id/status
interface UpdateMedicationStatusRequest {
  status: 'active' | 'completed' | 'discontinued' | 'on_hold';
  reason?: string;
}

// GET /api/v1/medications/active/:pet_id
// Returns all active medications

// POST /api/v1/medications/:medication_id/side-effect
interface RecordSideEffectRequest {
  side_effect: string;
  severity: string;
  first_observed: string;
  action_taken?: string;
}
```

### 2.6 Behavioral & Lifestyle APIs

```typescript
// POST /api/v1/behavior/temperament
interface RecordTemperamentRequest {
  pet_id: string;
  assessed_date: string;
  energy_level: number; // 1-10
  friendliness_humans: number;
  friendliness_dogs: number;
  playfulness: number;
  trainability: number;
  // ... other traits
}

// POST /api/v1/behavior/issues
interface RecordBehavioralIssueRequest {
  pet_id: string;
  issue_type: string;
  severity: string;
  first_observed: string;
  frequency: string;
  triggers?: string[];
  management_strategies?: string[];
}

// POST /api/v1/lifestyle/diet
interface UpdateDietProfileRequest {
  pet_id: string;
  diet_type: string;
  food_brand?: string;
  meals_per_day: number;
  daily_calories?: number;
  dietary_restrictions?: string[];
}

// POST /api/v1/lifestyle/exercise
interface UpdateExerciseRoutineRequest {
  pet_id: string;
  daily_exercise_minutes: number;
  exercise_types: string[];
  exercise_frequency_per_week: number;
  activity_level: string;
}
```

### 2.7 Partner Integration APIs

```typescript
// POST /api/v1/partners/insurance/quote
interface InsuranceQuoteRequest {
  pet_id: string;
  coverage_type: string;
  deductible_preference?: number;
  annual_limit_preference?: number;
}

interface InsuranceQuoteResponse {
  pet_id: string;
  quotes: InsuranceQuote[];
  risk_assessment: RiskAssessment;
  recommended_coverage: string;
}

// POST /api/v1/partners/export
interface ExportHealthDataRequest {
  pet_id: string;
  partner_type: string;
  partner_id: string;
  export_type: string;
  fields_to_include?: string[];
}

interface ExportHealthDataResponse {
  export_id: string;
  pet_summary: PetSummary;
  health_metrics: HealthMetrics;
  risk_assessment: RiskAssessment;
  data_completeness_score: number;
}

// GET /api/v1/partners/analytics/population
interface PopulationAnalyticsRequest {
  filters?: {
    species?: string[];
    breed?: string[];
    age_range?: {min: number, max: number};
    location?: string[];
  };
}

interface PopulationAnalyticsResponse {
  population_size: number;
  species_distribution: Distribution[];
  breed_distribution: Distribution[];
  common_conditions: ConditionPrevalence[];
  avg_health_score: number;
  obesity_prevalence: number;
}
```

### 2.8 International Travel APIs

```typescript
// POST /api/v1/travel/passport
interface CreateTravelPassportRequest {
  pet_id: string;
  origin_country: string;
  destination_country: string;
  travel_date?: string;
}

interface CreateTravelPassportResponse {
  passport_id: string;
  requirements: CountryRequirement[];
  compliance_status: string;
  missing_requirements: string[];
  estimated_cost: number;
  steps_to_complete: Step[];
}

// GET /api/v1/travel/requirements
interface TravelRequirementsRequest {
  origin_country: string;
  destination_country: string;
  species: string;
}

interface TravelRequirementsResponse {
  requirements: CountryRequirement[];
  quarantine_required: boolean;
  quarantine_duration_days?: number;
  estimated_total_cost: number;
  processing_time_days: number;
}

// POST /api/v1/travel/passport/:passport_id/check-compliance
interface CheckComplianceResponse {
  passport_id: string;
  compliance_status: string;
  completed_requirements: string[];
  pending_requirements: PendingRequirement[];
  ready_to_travel: boolean;
  next_steps: string[];
}
```

---

## 3. UI/UX IMPLEMENTATION

### 3.1 Enhanced Pet Profile Dashboard

**New Sections to Add**:

1. **Health Score Card** (Top Priority)
```
┌─────────────────────────────────────────────┐
│ Health Score: 87/100  ●●●●●●●●○○  GOOD     │
├─────────────────────────────────────────────┤
│ Preventive Care      ████████░░ 85          │
│ Medical History      ████████░░ 82          │
│ Lifestyle           ███████████ 95          │
│ Genetic Risk        ██████░░░░░ 75          │
│ Age-Adjusted        ████████░░ 88          │
├─────────────────────────────────────────────┤
│ [View Full Report] [Update Data]           │
└─────────────────────────────────────────────┘
```

2. **Risk Assessment Panel**
```
┌─────────────────────────────────────────────┐
│ ⚠️ Health Risks (2 Active)                  │
├─────────────────────────────────────────────┤
│ 🟡 MEDIUM  Dental Disease                   │
│    Last dental cleaning: 18 months ago      │
│    [Schedule Cleaning]                      │
├─────────────────────────────────────────────┤
│ 🟢 LOW     Obesity Risk                     │
│    Current BCS: 6/9 (Slightly overweight)   │
│    [View Weight Plan]                       │
└─────────────────────────────────────────────┘
```

3. **Red Flags & Alerts**
```
┌─────────────────────────────────────────────┐
│ 🚨 Action Required (1)                      │
├─────────────────────────────────────────────┤
│ Rabies Vaccination Overdue                  │
│ Due date: Dec 15, 2025 (18 days ago)       │
│ [Schedule Appointment] [Dismiss]           │
└─────────────────────────────────────────────┘
```

4. **Smart Recommendations**
```
┌─────────────────────────────────────────────┐
│ 💡 Recommended Actions                      │
├─────────────────────────────────────────────┤
│ URGENT  Annual Checkup Due                  │
│         Last visit: 13 months ago           │
│         [Book Now]                          │
├─────────────────────────────────────────────┤
│ HIGH    Dental Cleaning                     │
│         Plaque score: 3/4                   │
│         Est. cost: $200-$350                │
│         [Learn More]                        │
└─────────────────────────────────────────────┘
```

### 3.2 Body Condition Scoring Interface

**Interactive BCS Assessment Tool**:

```
┌─────────────────────────────────────────────┐
│ Body Condition Score Assessment             │
├─────────────────────────────────────────────┤
│ Select score: ○──○──○──●──○──○──○──○──○    │
│               1  2  3  4  5  6  7  8  9     │
│                        ↑                     │
│               Current: 4 (IDEAL)            │
├─────────────────────────────────────────────┤
│ ✓ Ribs easily palpable                      │
│ ✓ Waist visible from above                  │
│ ✓ Abdominal tuck present                    │
├─────────────────────────────────────────────┤
│ [View Visual Guide] [Save Assessment]      │
└─────────────────────────────────────────────┘
```

**Weight Trend Chart**:
```
Weight (kg)
30 ┤         ╭─●
   │       ╭─╯
25 ┤     ╭─╯    Ideal Range
   │   ╭─╯      ▓▓▓▓▓▓▓▓▓▓
20 ┤ ●─╯
   └─────────────────────────
     Jan  Apr  Jul  Oct  Jan
```

### 3.3 Vaccination Management UI

**Vaccination Card**:
```
┌─────────────────────────────────────────────┐
│ 💉 Vaccinations                             │
├─────────────────────────────────────────────┤
│ ✅ Rabies              Next: Dec 15, 2026   │
│ ✅ DHPP                Next: Mar 10, 2026   │
│ ⚠️  Bordetella         OVERDUE (30 days)    │
│ ○  Lyme Disease        Not administered     │
├─────────────────────────────────────────────┤
│ Compliance: 75% ████████░░                  │
│ [View Schedule] [Add Vaccination]          │
└─────────────────────────────────────────────┘
```

**Vaccination Timeline**:
```
2026 ─●────○────●────────────○────●──────
      │    │    │            │    │
    Jan   Mar  Jun          Sep  Dec
  Rabies DHPP  (none)    Bordetella Annual
  (done)                  (due)     Checkup
```

### 3.4 Medical Records Interface

**Medical History Timeline**:
```
┌─────────────────────────────────────────────┐
│ 📋 Medical History                          │
├─────────────────────────────────────────────┤
│ Jan 2026  ● Routine Checkup                │
│             Dr. Smith - Healthy Paws Clinic │
│             [$85] [View Notes]             │
├─────────────────────────────────────────────┤
│ Nov 2025  ● Dental Cleaning                │
│             Procedure completed            │
│             [$280] [View Before/After]     │
├─────────────────────────────────────────────┤
│ Sep 2025  ● Lab Work (CBC, Chemistry)      │
│             ⚠️ Slight elevation in ALT      │
│             [View Results]                 │
└─────────────────────────────────────────────┘
```

**Lab Results Display**:
```
┌─────────────────────────────────────────────┐
│ Complete Blood Count - Sep 15, 2025        │
├─────────────────────────────────────────────┤
│ Parameter    Value   Unit   Range   Status │
│ ────────────────────────────────────────── │
│ WBC          8.2     10^9/L 6-17    ✓      │
│ RBC          6.5     10^12/L 5.5-8.5 ✓     │
│ Hemoglobin   15.2    g/dL   12-18   ✓      │
│ Platelets    245     10^9/L 200-500 ✓      │
│ ────────────────────────────────────────── │
│ Overall: Normal ✓                          │
│ [Download PDF] [Share with Vet]           │
└─────────────────────────────────────────────┘
```

### 3.5 Medication Tracker

**Active Medications List**:
```
┌─────────────────────────────────────────────┐
│ 💊 Current Medications (2)                  │
├─────────────────────────────────────────────┤
│ Apoquel 16mg                                │
│ 1 tablet twice daily with food             │
│ For: Allergies (itching)                    │
│ Refills: 2 remaining                        │
│ Next refill: Feb 10, 2026                   │
│ [Mark as Taken] [Refill]                   │
├─────────────────────────────────────────────┤
│ Heartgard Plus                              │
│ 1 chewable monthly                          │
│ For: Heartworm prevention                   │
│ Next dose: Jan 15, 2026                     │
│ [Mark as Given] [Order More]               │
└─────────────────────────────────────────────┘
```

**Medication Reminder**:
```
┌─────────────────────────────────────────────┐
│ 🔔 Medication Due Now                       │
├─────────────────────────────────────────────┤
│ Apoquel 16mg - Morning dose                 │
│ Give 1 tablet with food                     │
│                                             │
│ [Given] [Snooze 1hr] [Dismiss]            │
└─────────────────────────────────────────────┘
```

### 3.6 Behavioral & Temperament Assessment

**Temperament Radar Chart**:
```
       Energy
          10│
           │  ●
           │ ╱ ╲
Friendly 5 ●   ● Playful
           │╲ ╱│
           │ ●  │
           └────┘
        Trainable
```

**Behavioral Issue Tracker**:
```
┌─────────────────────────────────────────────┐
│ 🐕 Behavior Profile                         │
├─────────────────────────────────────────────┤
│ Overall Temperament: FRIENDLY ✓             │
│                                             │
│ Active Issues:                              │
│ 🟡 Separation Anxiety (Moderate)            │
│    Frequency: Occasionally                  │
│    Management: Crate training, puzzle toys  │
│    Status: Improving ↗                      │
│                                             │
│ Training:                                   │
│ ✅ House trained (6 months)                 │
│ ✅ Basic commands (8/10 proficiency)        │
│ ○  Agility training (not started)          │
└─────────────────────────────────────────────┘
```

### 3.7 Travel Passport Interface

**Travel Readiness Dashboard**:
```
┌─────────────────────────────────────────────┐
│ ✈️ Travel to United Kingdom                 │
├─────────────────────────────────────────────┤
│ Compliance: 60% ██████░░░░                  │
│ Ready to Travel: NO ❌                      │
├─────────────────────────────────────────────┤
│ ✅ Microchip (ISO compliant)                │
│ ✅ Rabies Vaccination                       │
│ ⏳ Rabies Titer Test (In Progress)          │
│ ❌ Tapeworm Treatment (Not done)            │
│ ❌ Health Certificate (Not issued)          │
├─────────────────────────────────────────────┤
│ Est. Time to Complete: 35 days              │
│ Est. Total Cost: $450-$650                  │
│                                             │
│ [View Full Requirements] [Start Checklist] │
└─────────────────────────────────────────────┘
```

---

(Document continues... Should I continue with sections 4-9: Health Scoring Algorithm, Implementation Phases, Partner Integration Strategy, Premium Feature Gating, Testing & Validation Plan, and ROI Analysis?)

## 4. HEALTH SCORING ALGORITHM

### 4.1 Overall Health Score Calculation (0-100)

```typescript
function calculateHealthScore(pet: Pet, data: HealthData): HealthScore {
  // Component Scores (each 0-100)
  const preventiveCare = calculatePreventiveCareScore(data);
  const medicalHistory = calculateMedicalHistoryScore(data);
  const lifestyle = calculateLifestyleScore(data);
  const geneticRisk = calculateGeneticRiskScore(pet, data);
  const ageAdjusted = calculateAgeAdjustedScore(pet, data);
  
  // Weighted Average
  const overall = Math.round(
    (preventiveCare * 0.25) +
    (medicalHistory * 0.25) +
    (lifestyle * 0.20) +
    (geneticRisk * 0.15) +
    (ageAdjusted * 0.15)
  );
  
  return {
    overall_score: overall,
    score_category: getScoreCategory(overall),
    component_scores: {
      preventive_care: preventiveCare,
      medical_history: medicalHistory,
      lifestyle: lifestyle,
      genetic_risk: geneticRisk,
      age_adjusted: ageAdjusted
    }
  };
}

function getScoreCategory(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  if (score >= 40) return 'poor';
  return 'critical';
}

// Sub-score calculations
function calculatePreventiveCareScore(data: HealthData): number {
  let score = 100;
  
  // Vaccination compliance (40 points)
  score -= (100 - data.vaccination_compliance) * 0.4;
  
  // Wellness visit compliance (30 points)
  if (data.days_since_last_checkup > 365) score -= 30;
  else if (data.days_since_last_checkup > 180) score -= 15;
  
  // Dental health (15 points)
  if (data.months_since_dental_cleaning > 24) score -= 15;
  else if (data.months_since_dental_cleaning > 12) score -= 7;
  
  // Parasite prevention (15 points)
  if (!data.current_flea_tick_prevention) score -= 7;
  if (!data.current_heartworm_prevention) score -= 8;
  
  return Math.max(0, Math.min(100, score));
}

function calculateMedicalHistoryScore(data: HealthData): number {
  let score = 100;
  
  // Chronic conditions (-10 per condition, max -40)
  score -= Math.min(data.chronic_conditions_count * 10, 40);
  
  // Emergency visits in last year (-15 per visit, max -30)
  score -= Math.min(data.emergency_visits_last_year * 15, 30);
  
  // Surgeries in last year (-10 per surgery, max -20)
  score -= Math.min(data.surgeries_last_year * 10, 20);
  
  // Unmanaged chronic conditions (-10 per condition)
  score -= data.unmanaged_chronic_conditions_count * 10;
  
  return Math.max(0, Math.min(100, score));
}

function calculateLifestyleScore(data: HealthData): number {
  let score = 100;
  
  // Weight management (30 points)
  if (data.bcs_category === 'obese') score -= 30;
  else if (data.bcs_category === 'overweight') score -= 15;
  else if (data.bcs_category === 'underweight') score -= 20;
  
  // Exercise (25 points)
  const idealExercise = getIdealExerciseMinutes(data.breed, data.age_years);
  const exerciseRatio = data.daily_exercise_minutes / idealExercise;
  if (exerciseRatio < 0.5) score -= 25;
  else if (exerciseRatio < 0.75) score -= 12;
  
  // Diet quality (25 points)
  if (data.food_quality === 'economy') score -= 25;
  else if (data.food_quality === 'standard') score -= 10;
  
  // Behavioral issues (20 points)
  if (data.severe_behavioral_issues_count > 0) score -= 20;
  else if (data.moderate_behavioral_issues_count > 0) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function calculateGeneticRiskScore(pet: Pet, data: HealthData): number {
  let score = 100;
  
  // Breed predispositions
  const breedRisks = getBreedPredispositions(pet.breed);
  breedRisks.forEach(risk => {
    if (risk.risk_level === 'critical') score -= 15;
    else if (risk.risk_level === 'high') score -= 10;
    else if (risk.risk_level === 'medium') score -= 5;
  });
  
  // Genetic test results
  data.pathogenic_genetic_variants?.forEach(variant => {
    score -= 20;
  });
  
  // Family history (if available)
  if (data.family_history_of_disease) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function calculateAgeAdjustedScore(pet: Pet, data: HealthData): number {
  // Compare pet to age-appropriate benchmarks
  const ageBenchmark = getAgeBenchmark(pet.species, pet.age_years);
  
  let score = 100;
  
  // Age-appropriate health checks
  if (!hasAgeAppropriateScreenings(pet, data)) score -= 20;
  
  // Condition onset timing
  data.chronic_conditions.forEach(condition => {
    const typicalOnsetAge = getTypicalOnsetAge(condition.name, pet.breed);
    if (pet.age_years < typicalOnsetAge) score -= 15; // Early onset
  });
  
  // Vitals compared to age norms
  if (data.latest_vitals) {
    if (!areVitalsNormalForAge(data.latest_vitals, pet.age_years)) {
      score -= 10;
    }
  }
  
  return Math.max(0, Math.min(100, score));
}
```

---

## 5. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-4) - $40K-50K

**Goal**: Database schema & core API infrastructure

**Tasks**:
- [ ] Database migration scripts for 40+ new tables
- [ ] Supabase Edge Functions setup for health APIs
- [ ] Basic health score calculation algorithm
- [ ] Data import/export utilities
- [ ] Unit tests for scoring algorithms

**Deliverables**:
- Complete database schema deployed
- Core health scoring API functional
- API documentation (Swagger/OpenAPI)
- Migration scripts tested

**Team**: 2 backend developers, 1 database specialist

---

### Phase 2: UI/UX Enhancement (Weeks 5-10) - $50K-65K

**Goal**: Enhanced pet profile interface

**Tasks**:
- [ ] Health Score Dashboard component
- [ ] Body Condition Scoring interface
- [ ] Enhanced vaccination management UI
- [ ] Medication tracker interface
- [ ] Medical history timeline
- [ ] Risk assessment panel
- [ ] Recommendations widget
- [ ] Red flags & alerts system

**Deliverables**:
- Complete UI mockups (Figma)
- React Native components
- Mobile & web responsive layouts
- User testing with 50 beta users

**Team**: 2 frontend developers, 1 UI/UX designer

---

### Phase 3: Advanced Features (Weeks 11-16) - $45K-60K

**Goal**: Behavioral, genetic, and partner integrations

**Tasks**:
- [ ] Behavioral assessment tools
- [ ] Genetic risk profiling
- [ ] Lab results display & interpretation
- [ ] Vital signs tracking
- [ ] International travel compliance checker
- [ ] Insurance partner API integration
- [ ] Veterinary record export formats

**Deliverables**:
- Behavioral assessment UI
- Genetic risk dashboard
- Travel passport feature
- Partner integration APIs (2-3 insurance providers)

**Team**: 2 full-stack developers, 1 integration specialist

---

### Phase 4: Intelligence & Analytics (Weeks 17-20) - $30K-40K

**Goal**: AI-powered recommendations and analytics

**Tasks**:
- [ ] Health recommendation engine
- [ ] Predictive analytics (claims prediction)
- [ ] Population health analytics
- [ ] Automated red flag detection
- [ ] Smart vaccination scheduling
- [ ] Personalized health plans

**Deliverables**:
- AI recommendation system
- Analytics dashboard (admin)
- Population insights reports
- Partner analytics APIs

**Team**: 1 ML engineer, 1 data scientist, 1 backend developer

---

### Phase 5: Testing & Launch (Weeks 21-24) - $15K-35K

**Goal**: Comprehensive testing and production launch

**Tasks**:
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Accessibility compliance (WCAG 2.1)
- [ ] Load testing
- [ ] Beta launch (1,000 users)
- [ ] Bug fixes and refinements
- [ ] Documentation finalization
- [ ] Marketing materials
- [ ] Production deployment

**Deliverables**:
- Production-ready platform
- Test coverage >80%
- Performance benchmarks met
- Security audit passed
- User documentation
- Marketing launch plan

**Team**: Full team + QA specialist

---

## 6. PREMIUM FEATURE GATING

### Free Tier
- Basic health records (weight, vaccinations, vet visits)
- Simple vaccination reminders
- Basic pet profile
- Limited to 3 pets
- Basic health score (overall only)

### Pro Tier ($4.99/month)
- ✨ Comprehensive Health Score with breakdown
- ✨ Body Condition Scoring tools
- ✨ Advanced medication tracking
- ✨ Behavioral assessments
- ✨ Digital passport PDF export
- ✨ Unlimited pets
- ✨ Priority support
- Basic risk assessment
- Emergency vet report export

### Premium Tier ($9.99/month)
- ✨ **ALL Pro features** PLUS:
- ✨ AI-powered health recommendations
- ✨ Predictive analytics
- ✨ Insurance comparison tool
- ✨ Genetic risk profiling
- ✨ International travel compliance checker
- ✨ Veterinary record exchange
- ✨ Advanced analytics dashboard
- ✨ Population health insights
- ✨ 24/7 AI health assistant
- ✨ Priority vet consultations
- ✨ Unlimited cloud storage

---

## 7. PARTNER INTEGRATION STRATEGY

### Insurance Providers

**Phase 1 Partners** (Months 1-3):
1. **Trupanion** - Market leader, API available
2. **Healthy Paws** - High ratings, CPL model ($35/lead)
3. **Embrace** - $36 per lead, no sale required

**Integration Approach**:
```typescript
// Pawzly → Insurance Provider API
POST /api/insurance/quote
{
  pet_health_summary: {
    health_score: 87,
    pre_existing_conditions: ['none'],
    chronic_medications: 0,
    recent_emergencies: false,
    bcs_category: 'ideal',
    age_years: 3,
    breed: 'Golden Retriever',
    weight_kg: 28
  },
  risk_assessment: {
    overall_risk: 'low',
    breed_risks: ['hip_dysplasia', 'cancer'],
    predicted_annual_claims: 2,
    expected_claim_range: {min: 200, max: 800}
  }
}
```

**Revenue Model**:
- CPL (Cost Per Lead): $35/lead
- CPS (Cost Per Sale): $75-125/policy
- Renewal commission: 5-10% of annual premium

**Year 1 Target**: 1,000 quote requests → 300 policies = $30K-40K revenue

---

### Veterinary Networks

**Target Partners**:
- **VCA Animal Hospitals** (800+ locations)
- **Banfield Pet Hospital** (1,000+ locations)
- **BluePearl Specialty** (100+ emergency hospitals)

**Integration Features**:
- Secure record exchange (HL7 FHIR format)
- Appointment scheduling
- Lab results import
- Prescription management
- Direct vet messaging

**Revenue Model**:
- Referral fees: $10-15 per appointment booked
- Year 1 Target: 5,000 appointments = $50K-75K revenue

---

## 8. DATA SECURITY & COMPLIANCE

### HIPAA Compliance (for Veterinary Data)
- Encrypted data at rest (AES-256)
- Encrypted data in transit (TLS 1.3)
- Access logging and audit trails
- BAA (Business Associate Agreement) with partners
- Regular security audits

### GDPR/PDPL Compliance
- Data export functionality (✓ already planned)
- Right to deletion (account deletion)
- Consent management
- Data portability
- Privacy policy updates

### Supabase RLS Policies

```sql
-- Health scores - owners only
CREATE POLICY "Users can view own pet health scores"
  ON health_scores FOR SELECT
  USING (
    pet_id IN (
      SELECT id FROM pets WHERE owner_id = auth.uid()
    )
  );

-- Medical records - owners + authorized vets
CREATE POLICY "Owners and authorized vets can view medical records"
  ON medical_incidents FOR SELECT
  USING (
    pet_id IN (
      SELECT id FROM pets WHERE owner_id = auth.uid()
    )
    OR
    auth.uid() IN (
      SELECT vet_id FROM authorized_vets WHERE pet_id = medical_incidents.pet_id
    )
  );

-- Partner exports - logged and tracked
CREATE POLICY "Controlled partner data exports"
  ON health_partner_exports FOR INSERT
  WITH CHECK (
    pet_id IN (SELECT id FROM pets WHERE owner_id = auth.uid())
    AND user_consented = true
  );
```

---

## 9. SUCCESS METRICS & KPIs

### User Engagement Metrics

| Metric | Baseline | Month 3 | Month 6 | Month 12 |
|--------|----------|---------|---------|----------|
| Health Score Views/User | 0 | 2.5 | 4.0 | 6.0 |
| Data Completeness Avg | 45% | 60% | 75% | 85% |
| Weekly Active Users | 10K | 15K | 25K | 40K |
| Premium Conversion Rate | 2% | 5% | 8% | 12% |

### Health Impact Metrics

| Metric | Baseline | Target (Year 1) |
|--------|----------|-----------------|
| Vaccination Compliance | 60% | 85% |
| Overweight/Obese Pets | 45% | 35% |
| Annual Checkup Rate | 40% | 70% |
| Medication Adherence | 65% | 85% |

### Revenue Metrics

| Revenue Stream | Q1 | Q2 | Q3 | Q4 | Year 1 Total |
|----------------|----|----|----|----|--------------|
| Premium Subscriptions | $15K | $40K | $75K | $120K | **$250K** |
| Insurance Referrals | $5K | $15K | $30K | $50K | **$100K** |
| Vet Network Referrals | $3K | $10K | $20K | $35K | **$68K** |
| **Total** | **$23K** | **$65K** | **$125K** | **$205K** | **$418K** |

**Year 2 Projection**: $1.2M (3x growth)  
**Year 3 Projection**: $2.8M (2.3x growth)

---

## 10. ROI ANALYSIS

### Investment Breakdown

| Phase | Duration | Cost | Cumulative |
|-------|----------|------|------------|
| Phase 1: Foundation | 4 weeks | $45K | $45K |
| Phase 2: UI/UX | 6 weeks | $57K | $102K |
| Phase 3: Advanced Features | 6 weeks | $52K | $154K |
| Phase 4: Intelligence | 4 weeks | $35K | $189K |
| Phase 5: Testing & Launch | 4 weeks | $25K | **$214K** |

**Additional Costs**:
- Infrastructure (Year 1): $15K
- Marketing (Year 1): $30K
- Legal/Compliance: $10K
- **Total Year 1 Investment**: **$269K**

### Returns

**Year 1**:
- Revenue: $418K
- Investment: $269K
- **Net Profit**: $149K
- **ROI**: 55%

**Year 2**:
- Revenue: $1.2M
- Additional Investment: $50K (maintenance, scaling)
- **Net Profit**: $1.15M
- **Cumulative ROI**: 260%

**Year 3**:
- Revenue: $2.8M
- Additional Investment: $75K
- **Net Profit**: $2.725M
- **Cumulative ROI**: 590%

---

## 11. RISK MITIGATION

### Technical Risks

**Risk**: Data migration complexity  
**Mitigation**: Phased rollout, extensive testing, rollback procedures

**Risk**: Performance degradation with complex queries  
**Mitigation**: Database indexing strategy, caching layer (Redis), query optimization

**Risk**: Partner API downtime  
**Mitigation**: Fallback providers, cached data, graceful degradation

### Business Risks

**Risk**: Low user adoption of premium features  
**Mitigation**: Free trial periods, compelling value prop, user education

**Risk**: Partner integration delays  
**Mitigation**: Start with 2-3 key partners, phased approach

**Risk**: Regulatory compliance issues  
**Mitigation**: Legal review, compliance consultants, regular audits

---

## CONCLUSION

This comprehensive implementation solution provides a complete roadmap for transforming Pawzly into the most advanced digital pet health platform, with:

✅ **200+ Data Points** captured across 40+ new tables  
✅ **Intelligent Health Scoring** (0-100 with AI-powered insights)  
✅ **Premium Monetization** (Pro $4.99, Premium $9.99/month)  
✅ **Partner Integrations** (Insurance, Veterinary, Research)  
✅ **International Travel Ready** (EU/UK/US compliance)  
✅ **24-Week Implementation** (6 months to production)  
✅ **$214K Development Cost** with **260% ROI in Year 2**  
✅ **$2.8M Revenue Potential** by Year 3

**Next Steps**:
1. Review and approve implementation plan
2. Assemble development team
3. Begin Phase 1 (Database Foundation)
4. Identify initial insurance partners
5. Create marketing strategy for Pro/Premium tiers

🐾 **Transform Pet Care. One Health Score at a Time.** 🐾

