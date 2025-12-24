-- Ensure all tables exist and are correct
-- This script is idempotent (can be run multiple times)

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

--------------------------------------------------------------------------------
-- 1. Profiles (Users)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  country_code TEXT,
  language_code TEXT,
  date_of_birth DATE,
  photo_url TEXT,
  notification_prefs JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 2. Pets
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'other')),
  breed TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  date_of_birth DATE,
  age_approximate TEXT,
  size TEXT CHECK (size IN ('small', 'medium', 'large')),
  weight DECIMAL(5,2),
  color TEXT,
  photo_url TEXT,
  photo_gallery TEXT[],
  microchip_number TEXT,
  registration_id TEXT,
  is_spayed_neutered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own pets" ON public.pets;
CREATE POLICY "Users can view their own pets" ON public.pets FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own pets" ON public.pets;
CREATE POLICY "Users can insert their own pets" ON public.pets FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own pets" ON public.pets;
CREATE POLICY "Users can update their own pets" ON public.pets FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own pets" ON public.pets;
CREATE POLICY "Users can delete their own pets" ON public.pets FOR DELETE USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 3. Breeds (Lookup Table)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.breeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species TEXT NOT NULL CHECK (species IN ('dog','cat')),
  name TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS breeds_species_idx ON public.breeds (species);
DROP INDEX IF EXISTS public.breeds_species_name_idx;
CREATE UNIQUE INDEX IF NOT EXISTS breeds_species_name_unique_idx ON public.breeds (species, name);

-- RLS (Public Read)
ALTER TABLE public.breeds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read breeds" ON public.breeds;
CREATE POLICY "Public can read breeds" ON public.breeds FOR SELECT USING (true);

--------------------------------------------------------------------------------
-- 4. Veterinarians
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.veterinarians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  clinic_name TEXT NOT NULL,
  vet_name TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.veterinarians ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view vets linked to their pets" ON public.veterinarians;
CREATE POLICY "Users can view vets linked to their pets" ON public.veterinarians FOR SELECT USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = veterinarians.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can insert vets linked to their pets" ON public.veterinarians;
CREATE POLICY "Users can insert vets linked to their pets" ON public.veterinarians FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can update vets linked to their pets" ON public.veterinarians;
CREATE POLICY "Users can update vets linked to their pets" ON public.veterinarians FOR UPDATE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = veterinarians.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can delete vets linked to their pets" ON public.veterinarians;
CREATE POLICY "Users can delete vets linked to their pets" ON public.veterinarians FOR DELETE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = veterinarians.pet_id AND pets.user_id = auth.uid()));


--------------------------------------------------------------------------------
-- 5. Allergies
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.allergies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('food', 'environment', 'medication')),
  allergen TEXT NOT NULL,
  reaction_description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.allergies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view allergies linked to their pets" ON public.allergies;
CREATE POLICY "Users can view allergies linked to their pets" ON public.allergies FOR SELECT USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = allergies.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can insert allergies linked to their pets" ON public.allergies;
CREATE POLICY "Users can insert allergies linked to their pets" ON public.allergies FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can update allergies linked to their pets" ON public.allergies;
CREATE POLICY "Users can update allergies linked to their pets" ON public.allergies FOR UPDATE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = allergies.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can delete allergies linked to their pets" ON public.allergies;
CREATE POLICY "Users can delete allergies linked to their pets" ON public.allergies FOR DELETE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = allergies.pet_id AND pets.user_id = auth.uid()));

--------------------------------------------------------------------------------
-- 6. Behavior Tags
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.behavior_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.behavior_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view behavior_tags linked to their pets" ON public.behavior_tags;
CREATE POLICY "Users can view behavior_tags linked to their pets" ON public.behavior_tags FOR SELECT USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = behavior_tags.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can insert behavior_tags linked to their pets" ON public.behavior_tags;
CREATE POLICY "Users can insert behavior_tags linked to their pets" ON public.behavior_tags FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can update behavior_tags linked to their pets" ON public.behavior_tags;
CREATE POLICY "Users can update behavior_tags linked to their pets" ON public.behavior_tags FOR UPDATE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = behavior_tags.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can delete behavior_tags linked to their pets" ON public.behavior_tags;
CREATE POLICY "Users can delete behavior_tags linked to their pets" ON public.behavior_tags FOR DELETE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = behavior_tags.pet_id AND pets.user_id = auth.uid()));


--------------------------------------------------------------------------------
-- 7. Medical History
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.medical_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view medical_history linked to their pets" ON public.medical_history;
CREATE POLICY "Users can view medical_history linked to their pets" ON public.medical_history FOR SELECT USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = medical_history.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can insert medical_history linked to their pets" ON public.medical_history;
CREATE POLICY "Users can insert medical_history linked to their pets" ON public.medical_history FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can update medical_history linked to their pets" ON public.medical_history;
CREATE POLICY "Users can update medical_history linked to their pets" ON public.medical_history FOR UPDATE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = medical_history.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can delete medical_history linked to their pets" ON public.medical_history;
CREATE POLICY "Users can delete medical_history linked to their pets" ON public.medical_history FOR DELETE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = medical_history.pet_id AND pets.user_id = auth.uid()));


--------------------------------------------------------------------------------
-- 8. Food
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.food (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  brand TEXT,
  type TEXT,
  amount TEXT,
  feeding_schedule TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Note: schema might have varied in original file (brand_or_product vs brand). Standardizing on 'brand' as per types.

-- RLS
ALTER TABLE public.food ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view food linked to their pets" ON public.food;
CREATE POLICY "Users can view food linked to their pets" ON public.food FOR SELECT USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = food.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can insert food linked to their pets" ON public.food;
CREATE POLICY "Users can insert food linked to their pets" ON public.food FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can update food linked to their pets" ON public.food;
CREATE POLICY "Users can update food linked to their pets" ON public.food FOR UPDATE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = food.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can delete food linked to their pets" ON public.food;
CREATE POLICY "Users can delete food linked to their pets" ON public.food FOR DELETE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = food.pet_id AND pets.user_id = auth.uid()));


--------------------------------------------------------------------------------
-- 9. Care Notes
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.care_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  walk_routine TEXT,
  grooming_frequency TEXT,
  handling_tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.care_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view care_notes linked to their pets" ON public.care_notes;
CREATE POLICY "Users can view care_notes linked to their pets" ON public.care_notes FOR SELECT USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = care_notes.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can insert care_notes linked to their pets" ON public.care_notes;
CREATE POLICY "Users can insert care_notes linked to their pets" ON public.care_notes FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can update care_notes linked to their pets" ON public.care_notes;
CREATE POLICY "Users can update care_notes linked to their pets" ON public.care_notes FOR UPDATE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = care_notes.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can delete care_notes linked to their pets" ON public.care_notes;
CREATE POLICY "Users can delete care_notes linked to their pets" ON public.care_notes FOR DELETE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = care_notes.pet_id AND pets.user_id = auth.uid()));


--------------------------------------------------------------------------------
-- 10. Vaccinations
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  vaccine TEXT NOT NULL,
  date_administered DATE NOT NULL,
  next_due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view vaccinations linked to their pets" ON public.vaccinations;
CREATE POLICY "Users can view vaccinations linked to their pets" ON public.vaccinations FOR SELECT USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = vaccinations.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can insert vaccinations linked to their pets" ON public.vaccinations;
CREATE POLICY "Users can insert vaccinations linked to their pets" ON public.vaccinations FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can update vaccinations linked to their pets" ON public.vaccinations;
CREATE POLICY "Users can update vaccinations linked to their pets" ON public.vaccinations FOR UPDATE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = vaccinations.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can delete vaccinations linked to their pets" ON public.vaccinations;
CREATE POLICY "Users can delete vaccinations linked to their pets" ON public.vaccinations FOR DELETE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = vaccinations.pet_id AND pets.user_id = auth.uid()));


--------------------------------------------------------------------------------
-- 11. Treatments
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.treatments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  medication TEXT,
  dosage TEXT,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view treatments linked to their pets" ON public.treatments;
CREATE POLICY "Users can view treatments linked to their pets" ON public.treatments FOR SELECT USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = treatments.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can insert treatments linked to their pets" ON public.treatments;
CREATE POLICY "Users can insert treatments linked to their pets" ON public.treatments FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can update treatments linked to their pets" ON public.treatments;
CREATE POLICY "Users can update treatments linked to their pets" ON public.treatments FOR UPDATE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = treatments.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can delete treatments linked to their pets" ON public.treatments;
CREATE POLICY "Users can delete treatments linked to their pets" ON public.treatments FOR DELETE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = treatments.pet_id AND pets.user_id = auth.uid()));


--------------------------------------------------------------------------------
-- 12. Weight Entries
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weight_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view weight_entries linked to their pets" ON public.weight_entries;
CREATE POLICY "Users can view weight_entries linked to their pets" ON public.weight_entries FOR SELECT USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = weight_entries.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can insert weight_entries linked to their pets" ON public.weight_entries;
CREATE POLICY "Users can insert weight_entries linked to their pets" ON public.weight_entries FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can update weight_entries linked to their pets" ON public.weight_entries;
CREATE POLICY "Users can update weight_entries linked to their pets" ON public.weight_entries FOR UPDATE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = weight_entries.pet_id AND pets.user_id = auth.uid()));
DROP POLICY IF EXISTS "Users can delete weight_entries linked to their pets" ON public.weight_entries;
CREATE POLICY "Users can delete weight_entries linked to their pets" ON public.weight_entries FOR DELETE USING (EXISTS (SELECT 1 FROM public.pets WHERE pets.id = weight_entries.pet_id AND pets.user_id = auth.uid()));


--------------------------------------------------------------------------------
-- 13. Events (Calendar)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  type TEXT CHECK (type IN ('vet', 'grooming', 'walking', 'other')),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own events" ON public.events;
CREATE POLICY "Users can view their own events" ON public.events FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own events" ON public.events;
CREATE POLICY "Users can insert their own events" ON public.events FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
CREATE POLICY "Users can update their own events" ON public.events FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own events" ON public.events;
CREATE POLICY "Users can delete their own events" ON public.events FOR DELETE USING (auth.uid() = user_id);


--------------------------------------------------------------------------------
-- 14. Notifications
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  related_id UUID,
  related_type TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
-- Usually system inserts notifications, but user might need to for testing or manual reminders
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
CREATE POLICY "Users can insert their own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
