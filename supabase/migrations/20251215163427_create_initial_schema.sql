-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pets table
CREATE TABLE pets (
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

-- Create veterinarians table
CREATE TABLE veterinarians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
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

-- Create allergies table
CREATE TABLE allergies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('food', 'environment', 'medication')),
  allergen TEXT NOT NULL,
  reaction_description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create behavior_tags table
CREATE TABLE behavior_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_history table
CREATE TABLE medical_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food table
CREATE TABLE food (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  brand_or_product TEXT,
  food_type TEXT CHECK (food_type IN ('dry', 'wet', 'raw', 'other')),
  amount_per_meal TEXT,
  meals_per_day INTEGER,
  feeding_times TEXT[],
  diet_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create care_notes table
CREATE TABLE care_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  walk_routine TEXT,
  grooming_frequency TEXT,
  handling_tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vaccinations table
CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  vaccine_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('core', 'non-core')),
  date_given DATE NOT NULL,
  next_due_date DATE,
  dose_number INTEGER,
  administering_vet TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatments table
CREATE TABLE treatments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  treatment_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('preventive', 'acute', 'chronic')),
  start_date DATE NOT NULL,
  end_date DATE,
  dosage TEXT,
  frequency TEXT,
  time_of_day TEXT,
  vet TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weight_entries table
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vaccination', 'treatment', 'vet_visit')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_veterinarians_pet_id ON veterinarians(pet_id);
CREATE INDEX idx_allergies_pet_id ON allergies(pet_id);
CREATE INDEX idx_behavior_tags_pet_id ON behavior_tags(pet_id);
CREATE INDEX idx_medical_history_pet_id ON medical_history(pet_id);
CREATE INDEX idx_food_pet_id ON food(pet_id);
CREATE INDEX idx_care_notes_pet_id ON care_notes(pet_id);
CREATE INDEX idx_vaccinations_pet_id ON vaccinations(pet_id);
CREATE INDEX idx_treatments_pet_id ON treatments(pet_id);
CREATE INDEX idx_weight_entries_pet_id ON weight_entries(pet_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_pet_id ON notifications(pet_id);;
