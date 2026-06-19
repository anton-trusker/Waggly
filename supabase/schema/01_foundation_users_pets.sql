-- ============================================================================
-- Waggli canonical schema — 01 · Foundation + User & Pet domains
-- Ownership root: pets.user_id = auth.uid(); child access derived via pet_id.
-- Source of truth for the new Supabase project (fbeldieclcltyuqvomjx).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Reusable: keep updated_at fresh
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ----------------------------------------------------------------------------
-- USER & AUTH DOMAIN
-- ----------------------------------------------------------------------------

CREATE TABLE public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id       uuid GENERATED ALWAYS AS (id) STORED,   -- compat alias for code querying by user_id
  email         text,
  first_name    text,
  last_name     text,
  country_code  text,
  language_code text DEFAULT 'en',
  date_of_birth date,
  gender        text CHECK (gender IN ('male','female','non_binary','prefer_not_to_say')),
  phone         text,
  address       text,
  location_lat  double precision,
  location_lng  double precision,
  place_id      text,
  photo_url     text,
  bio           text,
  website       text,
  notification_prefs jsonb DEFAULT '{"email":true,"push":true,"sms":false,"marketing":false}'::jsonb,
  onboarding_completed boolean DEFAULT false,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
CREATE INDEX idx_profiles_country_code ON public.profiles(country_code);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text UNIQUE NOT NULL,
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE public.user_roles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       text NOT NULL DEFAULT 'pet_owner',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- ----------------------------------------------------------------------------
-- PET MANAGEMENT DOMAIN
-- ----------------------------------------------------------------------------

CREATE TABLE public.pets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Basic
  name          text NOT NULL,
  species       text NOT NULL CHECK (species IN ('dog','cat','bird','rabbit','reptile','other')),
  breed         text,
  gender        text CHECK (gender IN ('male','female')),
  date_of_birth text,                 -- kept text: app sends ISO strings / approximate
  age_approximate text,
  -- Physical
  size          text CHECK (size IN ('small','medium','large','giant')),
  weight        numeric,
  weight_unit   text DEFAULT 'kg',
  height        numeric,
  color         text,
  coat_type     text,
  eye_color     text,
  distinguishing_marks text,
  blood_type    text,
  ideal_weight_min numeric,
  ideal_weight_max numeric,
  -- Photos
  photo_url     text,
  photo_gallery text[],
  -- Identification
  microchip_number text,
  microchip_implantation_date date,
  tattoo_id     text,
  registration_id text,
  -- Health status
  is_spayed_neutered boolean DEFAULT false,
  spayed_neutered_date date,
  -- EU Passport
  passport_id   text UNIQUE,
  passport_issuer text,
  passport_issue_date date,
  passport_generated_at timestamptz,
  passport_updated_at timestamptz,
  -- Address (if different from owner)
  address_json  jsonb,
  -- Status
  pet_status    text DEFAULT 'active' CHECK (pet_status IN ('active','deceased','adopted','lost')),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
CREATE INDEX idx_pets_user_id ON public.pets(user_id);
CREATE INDEX idx_pets_species ON public.pets(species);
CREATE INDEX idx_pets_status ON public.pets(pet_status);
CREATE UNIQUE INDEX idx_pets_microchip ON public.pets(microchip_number) WHERE microchip_number IS NOT NULL;
CREATE INDEX idx_pets_search ON public.pets USING gin (to_tsvector('simple', name || ' ' || coalesce(breed,'')));
CREATE TRIGGER trg_pets_updated BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.pet_photos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id      uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url         text NOT NULL,
  caption     text,
  is_favorite boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX idx_pet_photos_pet_id ON public.pet_photos(pet_id);

-- Passport extension tables (gap analysis: behavior / lifestyle / genetics)
CREATE TABLE public.pet_behavior (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id      uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  temperament_tags text[],
  good_with_children text CHECK (good_with_children IN ('yes','no','unknown')),
  good_with_dogs     text CHECK (good_with_dogs IN ('yes','no','unknown')),
  good_with_cats     text CHECK (good_with_cats IN ('yes','no','unknown')),
  training_level int CHECK (training_level BETWEEN 1 AND 5),
  commands_known text[],
  behavioral_notes text,
  triggers_fears text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(pet_id)
);
CREATE TRIGGER trg_pet_behavior_updated BEFORE UPDATE ON public.pet_behavior
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.pet_lifestyle (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id      uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  primary_diet text,
  diet_brand   text,
  feeding_schedule jsonb,
  exercise_needs text CHECK (exercise_needs IN ('low','moderate','high','very_high')),
  daily_exercise_minutes int,
  living_environment text CHECK (living_environment IN ('indoor','outdoor','both')),
  sleep_location text,
  special_needs  text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(pet_id)
);
CREATE TRIGGER trg_pet_lifestyle_updated BEFORE UPDATE ON public.pet_lifestyle
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.pet_genetics (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id      uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  dna_test_provider text,
  dna_results jsonb,
  genetic_markers jsonb,
  pedigree    jsonb,
  lineage     text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
CREATE TRIGGER trg_pet_genetics_updated BEFORE UPDATE ON public.pet_genetics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.behavior_tags (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id     uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  tag        text NOT NULL,
  notes      text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_behavior_tags_pet_id ON public.behavior_tags(pet_id);

CREATE TABLE public.care_notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id      uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  walk_routine text,
  grooming_frequency text,
  handling_tips text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
CREATE TRIGGER trg_care_notes_updated BEFORE UPDATE ON public.care_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.food (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id      uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  brand       text,
  food_type   text,
  amount      text,
  meals_per_day numeric,
  feeding_schedule text,
  feeding_times text,
  diet_notes  text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
CREATE INDEX idx_food_pet_id ON public.food(pet_id);
CREATE TRIGGER trg_food_updated BEFORE UPDATE ON public.food
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.emergency_contacts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id       uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  contact_type text DEFAULT 'alternate',
  name         text NOT NULL,
  relationship text,
  phone        text,
  email        text,
  is_primary   boolean DEFAULT false,
  notes        text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
CREATE INDEX idx_emergency_contacts_pet_id ON public.emergency_contacts(pet_id);
CREATE TRIGGER trg_emergency_contacts_updated BEFORE UPDATE ON public.emergency_contacts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
