-- Auto-generated from types/db.ts on 2026-06-19T00:35:57.276Z
-- Reconstructs the app schema for the new Supabase project.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============ TABLES ============
CREATE TABLE IF NOT EXISTS public.activity_logs (
  activity_data jsonb,
  activity_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid,
  profile_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.allergies (
  allergen text NOT NULL,
  allergy_alert_enabled boolean,
  allergy_type text,
  avoidance_measures jsonb,
  created_at timestamptz DEFAULT now(),
  current_treatment jsonb,
  diagnosed_by uuid,
  diagnosed_date date,
  diagnostic_test text,
  emergency_contact_plan jsonb,
  emergency_medications jsonb,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notes text,
  peak_months text,
  pet_id uuid NOT NULL,
  quality_of_life_impact numeric,
  reaction_description text,
  reaction_timeline text,
  reminder_enabled boolean,
  reminder_type text,
  safe_alternatives jsonb,
  seasonal_pattern jsonb,
  severity_level text,
  shared_with_vets jsonb,
  symptom_onset text,
  symptoms jsonb,
  test_results_document_id uuid,
  treatment_effectiveness text,
  triggers jsonb,
  type text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  vaccination_considerations text,
  vet_aware boolean
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  action text NOT NULL,
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  new_values jsonb,
  old_values jsonb,
  resource_id uuid,
  resource_type text NOT NULL,
  user_id uuid
);

CREATE TABLE IF NOT EXISTS public.behavior_tags (
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notes text,
  pet_id uuid NOT NULL,
  tag text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.breeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.care_notes (
  created_at timestamptz DEFAULT now(),
  grooming_frequency text,
  handling_tips text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL,
  updated_at timestamptz DEFAULT now(),
  walk_routine text
);

CREATE TABLE IF NOT EXISTS public.co_owners (
  co_owner_email text NOT NULL,
  co_owner_id uuid,
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_token text,
  main_owner_id uuid NOT NULL,
  permissions jsonb,
  role text,
  status text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  valid_until text
);

CREATE TABLE IF NOT EXISTS public.conditions (
  created_at timestamptz DEFAULT now(),
  diagnosed_date date,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  notes text,
  pet_id uuid NOT NULL,
  resolved_date date,
  severity text,
  status text,
  treatment_plan text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content (
  created_at timestamptz DEFAULT now(),
  created_by uuid,
  description text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metadata jsonb,
  reviewed_at timestamptz,
  reviewed_by uuid,
  status text,
  title text NOT NULL,
  type text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.documents (
  archived boolean,
  auto_archive_date date,
  confidentiality_level text,
  created_at timestamptz DEFAULT now(),
  document_date date,
  document_range_end text,
  document_range_start text,
  document_source text,
  file_name text NOT NULL,
  file_url text NOT NULL,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  linked_records jsonb,
  manual_details jsonb,
  metadata jsonb,
  notify_recipients boolean,
  ocr_confidence_score numeric,
  ocr_data jsonb,
  pet_id uuid NOT NULL,
  shared_with_users jsonb,
  shared_with_vets jsonb,
  tags jsonb,
  title text,
  type text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  visibility text
);

CREATE TABLE IF NOT EXISTS public.events (
  cost numeric,
  created_at timestamptz DEFAULT now(),
  currency text,
  description text,
  end_time text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text,
  location_lat numeric,
  location_lng numeric,
  location_place_id uuid,
  pet_id uuid,
  place_id uuid,
  start_time text NOT NULL,
  title text NOT NULL,
  type text,
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.food (
  amount text,
  brand text,
  created_at timestamptz DEFAULT now(),
  diet_notes text,
  feeding_schedule text,
  feeding_times text,
  food_type text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meals_per_day numeric,
  pet_id uuid NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.health_metrics (
  activity_level text,
  activity_observations text,
  appetite_level text,
  appetite_notes text,
  blood_pressure_diastolic numeric,
  blood_pressure_systolic numeric,
  coat_condition text,
  coat_notes text,
  consultation_reasons jsonb,
  girth_circumference numeric,
  girth_unit text,
  height_at_shoulder numeric,
  height_unit text,
  hydration_status text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_results jsonb,
  length_unit text,
  length_value numeric,
  measured_at timestamptz,
  measured_by uuid,
  measurement_location text,
  pain_observations text,
  pain_score numeric,
  pet_id uuid NOT NULL,
  veterinary_consultation_needed boolean,
  weight numeric,
  weight_change_percent numeric,
  weight_trend text
);

CREATE TABLE IF NOT EXISTS public.mail_queue (
  body text NOT NULL,
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text,
  subject text NOT NULL,
  to_email text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.medical_history (
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL,
  summary text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.medical_visits (
  attachments jsonb,
  business_email text,
  business_lat numeric,
  business_lng numeric,
  business_name text,
  business_phone text,
  business_place_id uuid,
  business_website text,
  clinic_name text,
  cost numeric,
  cost_breakdown jsonb,
  created_at timestamptz DEFAULT now(),
  currency text,
  current_medications jsonb,
  date text NOT NULL,
  diagnosis text,
  distance_km numeric,
  duration_minutes numeric,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insurance_claim_status text,
  insurance_provider text,
  invoice_document_id uuid,
  notes text,
  payment_method text,
  pet_id uuid NOT NULL,
  provider_name text,
  provider_type text,
  reason text NOT NULL,
  recommendations jsonb,
  reminder_date date,
  reminder_enabled boolean,
  reminder_type text,
  service_category text,
  shared_with jsonb,
  special_instructions text,
  updated_at timestamptz DEFAULT now(),
  vet_name text,
  visit_time text
);

CREATE TABLE IF NOT EXISTS public.medications (
  administration_instructions text,
  administration_times jsonb,
  attachments text,
  auto_refill boolean,
  best_time_to_give jsonb,
  condition_being_treated text,
  contraindications text,
  cost numeric,
  created_at timestamptz DEFAULT now(),
  currency text,
  dosage_unit text,
  dosage_value numeric,
  duration_unit text,
  duration_value numeric,
  end_date date,
  form text,
  frequency text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insurance_coverage_percent numeric,
  interactions jsonb,
  is_ongoing boolean,
  monitor_for jsonb,
  name text NOT NULL,
  notes text,
  out_of_pocket_cost numeric,
  pet_id uuid NOT NULL,
  pharmacy_name text,
  pharmacy_place_id uuid,
  prescribed_by uuid,
  prescription_document_id uuid,
  prescription_number text,
  quantity numeric,
  reason_for_treatment text,
  refill_schedule jsonb,
  reminder_before_minutes numeric,
  reminder_calendar_event boolean,
  reminder_notify_caregivers jsonb,
  reminders_enabled boolean,
  severity_rating text,
  side_effects jsonb,
  start_date date,
  storage_instructions text,
  strength text,
  total_cost numeric,
  treatment_type text,
  unit_price numeric,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  created_at timestamptz DEFAULT now(),
  due_date date,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_read boolean,
  message text NOT NULL,
  pet_id uuid,
  related_id uuid,
  related_type text,
  title text NOT NULL,
  type text NOT NULL,
  user_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pet_photos (
  caption text,
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_favorite boolean,
  pet_id uuid NOT NULL,
  url text NOT NULL,
  user_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pets (
  address_json jsonb,
  age_approximate text,
  blood_type text,
  breed text,
  color text,
  created_at timestamptz DEFAULT now(),
  date_of_birth text,
  gender text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_spayed_neutered boolean,
  microchip_number text,
  name text NOT NULL,
  photo_gallery text,
  photo_url text,
  registration_id uuid,
  size text,
  species text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL,
  weight numeric
);

CREATE TABLE IF NOT EXISTS public.profiles (
  address text,
  bio text,
  country_code text,
  created_at timestamptz DEFAULT now(),
  date_of_birth text,
  first_name text,
  gender text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code text,
  last_name text,
  location_lat numeric,
  location_lng numeric,
  notification_prefs jsonb,
  phone text,
  photo_url text,
  place_id uuid,
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL,
  website text
);

CREATE TABLE IF NOT EXISTS public.public_shares (
  created_at timestamptz DEFAULT now(),
  created_by uuid NOT NULL,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL,
  settings jsonb,
  token text NOT NULL,
  valid_until text,
  views numeric
);

CREATE TABLE IF NOT EXISTS public.ref_allergens (
  allergen_name text NOT NULL,
  allergen_type text,
  common_reactions jsonb,
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE IF NOT EXISTS public.ref_medications (
  active_ingredient text,
  brand_names jsonb,
  category text,
  common_uses text,
  contraindications text,
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_name text NOT NULL,
  side_effects jsonb,
  typical_dosage_range text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ref_symptoms (
  category text,
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  severity_indicator boolean,
  symptom_name text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ref_vaccines (
  abbreviation text,
  booster_interval text,
  created_at timestamptz DEFAULT now(),
  description text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  species text NOT NULL,
  typical_schedule text,
  updated_at timestamptz DEFAULT now(),
  vaccine_name text NOT NULL,
  vaccine_type text
);

CREATE TABLE IF NOT EXISTS public.reference_breeds (
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metadata jsonb,
  name text NOT NULL,
  species text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reference_treatments (
  category text NOT NULL,
  default_frequency text,
  description text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  validity_days numeric
);

CREATE TABLE IF NOT EXISTS public.reference_vaccinations (
  category text NOT NULL,
  description text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text NOT NULL,
  validity_months numeric
);

CREATE TABLE IF NOT EXISTS public.roles (
  created_at timestamptz DEFAULT now(),
  description text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  permissions jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS public.settings (
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  description text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  value jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS public.shared_links (
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active boolean,
  pet_id uuid NOT NULL,
  profile_id uuid NOT NULL,
  token text NOT NULL,
  view_count numeric
);

CREATE TABLE IF NOT EXISTS public.translations (
  created_at timestamptz DEFAULT now(),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  language_code text NOT NULL,
  namespace text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  value text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.treatments (
  category text NOT NULL,
  cost numeric,
  created_at timestamptz DEFAULT now(),
  currency text,
  dosage text,
  dosage_unit text,
  dosage_value numeric,
  end_date date,
  frequency text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active boolean,
  next_due_date date,
  notes text,
  pet_id uuid NOT NULL,
  provider text,
  start_date date NOT NULL,
  time_of_day text,
  treatment_name text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  vet text
);

CREATE TABLE IF NOT EXISTS public.user_sessions (
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  refresh_token text NOT NULL,
  user_agent text,
  user_id uuid
);

CREATE TABLE IF NOT EXISTS public.users (
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  last_login_at timestamptz,
  metadata jsonb,
  name text NOT NULL,
  password_hash text NOT NULL,
  role_id uuid,
  status text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vaccinations (
  administered_by uuid,
  administered_time text,
  administering_vet text,
  batch_number text,
  category text NOT NULL,
  certificate_document_id uuid,
  clinic_place_id uuid,
  cost numeric,
  created_at timestamptz DEFAULT now(),
  currency text,
  date_given text NOT NULL,
  dose_number numeric,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insurance_provider text,
  location text,
  location_lat numeric,
  location_lng numeric,
  manufacturer text,
  next_due_date date,
  notes text,
  payment_method text,
  pet_id uuid NOT NULL,
  place_id uuid,
  provider text,
  reaction_severity text,
  reactions jsonb,
  reminder_days_before numeric,
  reminder_enabled boolean,
  reminder_methods jsonb,
  reminder_recipients jsonb,
  route_of_administration text,
  schedule_interval text,
  updated_at timestamptz DEFAULT now(),
  vaccination_type text,
  vaccine_name text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.veterinarians (
  address text,
  city text,
  clinic_name text NOT NULL,
  country text,
  created_at timestamptz DEFAULT now(),
  email text,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_primary boolean,
  location_lat numeric,
  location_lng numeric,
  pet_id uuid NOT NULL,
  phone text,
  place_id uuid,
  type text,
  updated_at timestamptz DEFAULT now(),
  vet_name text,
  website text,
  zip_code text
);

CREATE TABLE IF NOT EXISTS public.weight_entries (
  created_at timestamptz DEFAULT now(),
  date text NOT NULL,
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notes text,
  pet_id uuid NOT NULL,
  weight numeric NOT NULL
);


-- ============ FOREIGN KEYS ============
DO $$ BEGIN
  ALTER TABLE public.activity_logs ADD CONSTRAINT fk_activity_logs_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.activity_logs ADD CONSTRAINT fk_activity_logs_profile_id FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.allergies ADD CONSTRAINT fk_allergies_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.allergies ADD CONSTRAINT fk_allergies_test_results_document_id FOREIGN KEY (test_results_document_id) REFERENCES public.documents(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.audit_logs ADD CONSTRAINT fk_audit_logs_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.behavior_tags ADD CONSTRAINT fk_behavior_tags_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.care_notes ADD CONSTRAINT fk_care_notes_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.conditions ADD CONSTRAINT fk_conditions_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.content ADD CONSTRAINT fk_content_created_by FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.content ADD CONSTRAINT fk_content_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.documents ADD CONSTRAINT fk_documents_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.events ADD CONSTRAINT fk_events_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.food ADD CONSTRAINT fk_food_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.health_metrics ADD CONSTRAINT fk_health_metrics_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.medical_history ADD CONSTRAINT fk_medical_history_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.medical_visits ADD CONSTRAINT fk_medical_visits_invoice_document_id FOREIGN KEY (invoice_document_id) REFERENCES public.documents(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.medical_visits ADD CONSTRAINT fk_medical_visits_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.medications ADD CONSTRAINT fk_medications_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.medications ADD CONSTRAINT fk_medications_prescription_document_id FOREIGN KEY (prescription_document_id) REFERENCES public.documents(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.notifications ADD CONSTRAINT fk_notifications_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.pet_photos ADD CONSTRAINT fk_pet_photos_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.public_shares ADD CONSTRAINT fk_public_shares_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.shared_links ADD CONSTRAINT fk_shared_links_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.shared_links ADD CONSTRAINT fk_shared_links_profile_id FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.treatments ADD CONSTRAINT fk_treatments_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.user_sessions ADD CONSTRAINT fk_user_sessions_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.users ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.vaccinations ADD CONSTRAINT fk_vaccinations_certificate_document_id FOREIGN KEY (certificate_document_id) REFERENCES public.documents(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.vaccinations ADD CONSTRAINT fk_vaccinations_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.veterinarians ADD CONSTRAINT fk_veterinarians_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.weight_entries ADD CONSTRAINT fk_weight_entries_pet_id FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN others THEN NULL; END $$;

-- ============ ROW LEVEL SECURITY ============
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_logs_profile_all" ON public.activity_logs FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());
ALTER TABLE public.allergies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allergies_pet_owner_all" ON public.allergies FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = allergies.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = allergies.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_logs_user_all" ON public.audit_logs FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
ALTER TABLE public.behavior_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "behavior_tags_pet_owner_all" ON public.behavior_tags FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = behavior_tags.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = behavior_tags.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.breeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "breeds_read_all" ON public.breeds FOR SELECT USING (true);
ALTER TABLE public.care_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "care_notes_pet_owner_all" ON public.care_notes FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = care_notes.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = care_notes.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.co_owners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "co_owners_auth_read" ON public.co_owners FOR SELECT USING (auth.uid() IS NOT NULL);
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conditions_pet_owner_all" ON public.conditions FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = conditions.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = conditions.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_read_all" ON public.content FOR SELECT USING (true);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "documents_pet_owner_all" ON public.documents FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = documents.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = documents.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_user_all" ON public.events FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
ALTER TABLE public.food ENABLE ROW LEVEL SECURITY;
CREATE POLICY "food_pet_owner_all" ON public.food FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = food.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = food.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "health_metrics_pet_owner_all" ON public.health_metrics FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = health_metrics.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = health_metrics.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.mail_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mail_queue_auth_read" ON public.mail_queue FOR SELECT USING (auth.uid() IS NOT NULL);
ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "medical_history_pet_owner_all" ON public.medical_history FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = medical_history.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = medical_history.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.medical_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "medical_visits_pet_owner_all" ON public.medical_visits FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = medical_visits.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = medical_visits.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "medications_pet_owner_all" ON public.medications FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = medications.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = medications.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_user_all" ON public.notifications FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
ALTER TABLE public.pet_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pet_photos_user_all" ON public.pet_photos FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pets_user_all" ON public.pets FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_user_all" ON public.profiles FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
ALTER TABLE public.public_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_shares_pet_owner_all" ON public.public_shares FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = public_shares.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = public_shares.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.ref_allergens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ref_allergens_read_all" ON public.ref_allergens FOR SELECT USING (true);
ALTER TABLE public.ref_medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ref_medications_read_all" ON public.ref_medications FOR SELECT USING (true);
ALTER TABLE public.ref_symptoms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ref_symptoms_read_all" ON public.ref_symptoms FOR SELECT USING (true);
ALTER TABLE public.ref_vaccines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ref_vaccines_read_all" ON public.ref_vaccines FOR SELECT USING (true);
ALTER TABLE public.reference_breeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reference_breeds_read_all" ON public.reference_breeds FOR SELECT USING (true);
ALTER TABLE public.reference_treatments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reference_treatments_read_all" ON public.reference_treatments FOR SELECT USING (true);
ALTER TABLE public.reference_vaccinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reference_vaccinations_read_all" ON public.reference_vaccinations FOR SELECT USING (true);
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles_read_all" ON public.roles FOR SELECT USING (true);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_auth_read" ON public.settings FOR SELECT USING (auth.uid() IS NOT NULL);
ALTER TABLE public.shared_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shared_links_profile_all" ON public.shared_links FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "translations_read_all" ON public.translations FOR SELECT USING (true);
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "treatments_pet_owner_all" ON public.treatments FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = treatments.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = treatments.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_sessions_user_all" ON public.user_sessions FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_self_all" ON public.users FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vaccinations_pet_owner_all" ON public.vaccinations FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = vaccinations.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = vaccinations.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.veterinarians ENABLE ROW LEVEL SECURITY;
CREATE POLICY "veterinarians_pet_owner_all" ON public.veterinarians FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = veterinarians.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = veterinarians.pet_id AND p.user_id = auth.uid()));
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weight_entries_pet_owner_all" ON public.weight_entries FOR ALL USING (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = weight_entries.pet_id AND p.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.pets p WHERE p.id = weight_entries.pet_id AND p.user_id = auth.uid()));
