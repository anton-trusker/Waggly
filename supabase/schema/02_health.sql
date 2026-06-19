-- ============================================================================
-- Waggli canonical schema — 02 · Health Records domain
-- All tables are pet-scoped; access derived via pet ownership/co-ownership.
-- ============================================================================

CREATE TABLE public.medical_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  date text NOT NULL,
  visit_time text,
  duration_minutes numeric,
  provider_type text DEFAULT 'veterinary',
  provider_name text,
  business_name text,
  business_phone text,
  business_email text,
  business_website text,
  business_place_id text,
  business_lat numeric,
  business_lng numeric,
  distance_km numeric,
  clinic_name text,
  vet_name text,
  reason text NOT NULL,
  service_category text,
  diagnosis text,
  recommendations jsonb,
  special_instructions text,
  current_medications jsonb,
  notes text,
  cost numeric,
  currency text DEFAULT 'EUR',
  cost_breakdown jsonb,
  payment_method text,
  insurance_provider text,
  insurance_claim_status text CHECK (insurance_claim_status IN ('not_filed','pending','approved','denied')),
  invoice_document_id uuid,
  attachments jsonb,
  reminder_enabled boolean DEFAULT false,
  reminder_date date,
  reminder_type text,
  shared_with jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_medical_visits_pet_id ON public.medical_visits(pet_id);
CREATE INDEX idx_medical_visits_date ON public.medical_visits(date DESC);
CREATE TRIGGER trg_medical_visits_updated BEFORE UPDATE ON public.medical_visits
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.vaccinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  vaccination_type text,
  category text NOT NULL DEFAULT 'core',
  batch_number text,
  manufacturer text,
  date_given text NOT NULL,
  administered_time text,
  administered_by uuid,
  administering_vet text,
  provider text,
  clinic_place_id text,
  location text,
  location_lat numeric,
  location_lng numeric,
  place_id text,
  next_due_date date,
  schedule_interval text,
  dose_number numeric,
  route_of_administration text,
  status text DEFAULT 'valid' CHECK (status IN ('valid','expired','upcoming','overdue')),
  reactions jsonb,
  reaction_severity text,
  cost numeric,
  currency text,
  payment_method text,
  insurance_provider text,
  certificate_document_id uuid,
  reminder_enabled boolean DEFAULT false,
  reminder_days_before numeric,
  reminder_methods jsonb,
  reminder_recipients jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_vaccinations_pet_id ON public.vaccinations(pet_id);
CREATE INDEX idx_vaccinations_next_due ON public.vaccinations(next_due_date);
CREATE INDEX idx_vaccinations_status ON public.vaccinations(status);
CREATE TRIGGER trg_vaccinations_updated BEFORE UPDATE ON public.vaccinations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-maintain vaccination status from next_due_date
CREATE OR REPLACE FUNCTION public.update_vaccination_status()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.next_due_date IS NULL THEN
    NEW.status := COALESCE(NEW.status, 'valid');
  ELSIF NEW.next_due_date < CURRENT_DATE THEN
    NEW.status := 'overdue';
  ELSIF NEW.next_due_date < CURRENT_DATE + INTERVAL '30 days' THEN
    NEW.status := 'upcoming';
  ELSE
    NEW.status := 'valid';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_vaccination_status BEFORE INSERT OR UPDATE ON public.vaccinations
  FOR EACH ROW EXECUTE FUNCTION public.update_vaccination_status();

CREATE TABLE public.medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  name text NOT NULL,
  treatment_type text,
  strength text,
  form text,
  dosage_value numeric,
  dosage_unit text,
  frequency text,
  administration_times jsonb,
  administration_instructions text,
  best_time_to_give jsonb,
  start_date date,
  end_date date,
  duration_value numeric,
  duration_unit text,
  is_ongoing boolean DEFAULT false,
  prescribed_by uuid,
  pharmacy_name text,
  pharmacy_place_id text,
  prescription_number text,
  prescription_document_id uuid,
  refill_schedule jsonb,
  auto_refill boolean DEFAULT false,
  unit_price numeric,
  quantity numeric,
  total_cost numeric,
  cost numeric,
  currency text,
  insurance_coverage_percent numeric,
  out_of_pocket_cost numeric,
  side_effects jsonb,
  severity_rating text,
  contraindications text,
  interactions jsonb,
  storage_instructions text,
  reason_for_treatment text,
  condition_being_treated text,
  monitor_for jsonb,
  reminders_enabled boolean DEFAULT false,
  reminder_notify_caregivers jsonb,
  reminder_before_minutes numeric,
  reminder_calendar_event boolean DEFAULT false,
  attachments text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_medications_pet_id ON public.medications(pet_id);
CREATE INDEX idx_medications_ongoing ON public.medications(pet_id) WHERE is_ongoing = true;
CREATE TRIGGER trg_medications_updated BEFORE UPDATE ON public.medications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  treatment_name text NOT NULL,
  category text NOT NULL,
  dosage text,
  dosage_value numeric,
  dosage_unit text,
  frequency text,
  time_of_day text,
  start_date date NOT NULL,
  end_date date,
  next_due_date date,
  is_active boolean DEFAULT true,
  provider text,
  vet text,
  cost numeric,
  currency text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_treatments_pet_id ON public.treatments(pet_id);
CREATE TRIGGER trg_treatments_updated BEFORE UPDATE ON public.treatments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.allergies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('food','environment','medication')),
  allergy_type text,
  allergen text NOT NULL,
  severity_level text CHECK (severity_level IN ('mild','moderate','severe','anaphylaxis')),
  quality_of_life_impact numeric,
  symptoms jsonb,
  symptom_onset text,
  reaction_description text,
  reaction_timeline text,
  triggers jsonb,
  seasonal_pattern jsonb,
  peak_months text,
  avoidance_measures jsonb,
  safe_alternatives jsonb,
  current_treatment jsonb,
  emergency_medications jsonb,
  treatment_effectiveness text,
  diagnosed_by uuid,
  diagnosed_date date,
  diagnostic_test text,
  test_results_document_id uuid,
  emergency_contact_plan jsonb,
  allergy_alert_enabled boolean DEFAULT true,
  vaccination_considerations text,
  vet_aware boolean DEFAULT false,
  shared_with_vets jsonb,
  reminder_enabled boolean DEFAULT false,
  reminder_type text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_allergies_pet_id ON public.allergies(pet_id);
CREATE TRIGGER trg_allergies_updated BEFORE UPDATE ON public.allergies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active','resolved','recurring','managed','unknown')),
  severity text CHECK (severity IN ('mild','moderate','severe')),
  diagnosed_date date,
  resolved_date date,
  treatment_plan text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_conditions_pet_id ON public.conditions(pet_id);
CREATE TRIGGER trg_conditions_updated BEFORE UPDATE ON public.conditions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.medical_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  summary text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_medical_history_pet_id ON public.medical_history(pet_id);

-- Health metrics + vital signs (gap analysis #5)
CREATE TABLE public.health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  measured_at timestamptz,
  measured_by uuid,
  measurement_location text,
  weight numeric,
  weight_trend text,
  weight_change_percent numeric,
  height_at_shoulder numeric,
  height_unit text,
  length_value numeric,
  length_unit text,
  girth_circumference numeric,
  girth_unit text,
  heart_rate_bpm int,
  temperature_celsius numeric,
  respiratory_rate int,
  blood_pressure_systolic numeric,
  blood_pressure_diastolic numeric,
  hydration_status text,
  coat_condition text,
  coat_notes text,
  appetite_level text,
  appetite_notes text,
  activity_level text,
  activity_observations text,
  pain_score numeric,
  pain_observations text,
  lab_results jsonb,
  consultation_reasons jsonb,
  veterinary_consultation_needed boolean,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_health_metrics_pet_id ON public.health_metrics(pet_id);

CREATE TABLE public.weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  weight numeric NOT NULL,
  weight_unit text DEFAULT 'kg',
  recorded_date date NOT NULL DEFAULT CURRENT_DATE,
  date date,                 -- legacy alias used by usePetHealthData; reconcile to recorded_date
  body_condition_score numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_weight_logs_pet_id ON public.weight_logs(pet_id);
CREATE INDEX idx_weight_logs_date ON public.weight_logs(pet_id, recorded_date DESC);

CREATE TABLE public.body_condition_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  score numeric NOT NULL,
  assessed_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_bcs_pet_id ON public.body_condition_scores(pet_id);

CREATE TABLE public.dental_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  last_cleaning_date date,
  dental_condition_score int CHECK (dental_condition_score BETWEEN 1 AND 5),
  extractions text,
  procedure_history jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_dental_records_pet_id ON public.dental_records(pet_id);
CREATE TRIGGER trg_dental_records_updated BEFORE UPDATE ON public.dental_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.wellness_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  logged_date date NOT NULL DEFAULT CURRENT_DATE,
  appetite_level text,
  activity_level text,
  mood text,
  notes text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_wellness_logs_pet_id ON public.wellness_logs(pet_id, logged_date DESC);

-- Health score: current snapshot + history (gap analysis #7)
CREATE TABLE public.health_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  calculated_date timestamptz NOT NULL DEFAULT now(),
  overall_score int CHECK (overall_score BETWEEN 0 AND 100),
  score_category text,
  preventive_care_score int,
  vaccination_score int,
  weight_management_score int,
  data_completeness_percentage int,
  recent_wellness_score int,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_health_scores_pet_id ON public.health_scores(pet_id, calculated_date DESC);

CREATE TABLE public.health_risks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  risk_name text NOT NULL,
  risk_level text CHECK (risk_level IN ('low','moderate','high')),
  source text,
  description text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_health_risks_pet_id ON public.health_risks(pet_id);

CREATE TABLE public.health_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  priority text CHECK (priority IN ('low','medium','high')),
  category text,
  is_dismissed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_health_recommendations_pet_id ON public.health_recommendations(pet_id);

CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES public.pets(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_data jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_activity_logs_pet_id ON public.activity_logs(pet_id);
CREATE INDEX idx_activity_logs_profile_id ON public.activity_logs(profile_id);
