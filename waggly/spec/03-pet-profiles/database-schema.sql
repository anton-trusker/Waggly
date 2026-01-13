-- Pet Profiles Database Schema
-- Waggly Platform Specification
-- Version: 1.0

-- ============================================
-- PETS TABLE
-- Core pet profile information
-- ============================================
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  name VARCHAR(50) NOT NULL CHECK (char_length(name) >= 1),
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'rabbit', 'bird', 'other')),
  breed_id UUID REFERENCES breeds(id),
  breed_name VARCHAR(100) NOT NULL,
  secondary_breed_id UUID REFERENCES breeds(id),
  is_mixed_breed BOOLEAN DEFAULT false,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  
  -- Dates
  date_of_birth DATE NOT NULL,
  date_of_birth_approximate BOOLEAN DEFAULT false,
  
  -- Status
  is_neutered BOOLEAN,
  neutered_date DATE,
  is_deceased BOOLEAN DEFAULT false,
  deceased_date DATE,
  deceased_cause TEXT,
  is_archived BOOLEAN DEFAULT false,
  
  -- Appearance
  photo_url TEXT,
  cover_photo_url TEXT,
  color_primary VARCHAR(50),
  color_secondary VARCHAR(50),
  color_pattern VARCHAR(50),
  coat_type VARCHAR(50),
  distinctive_markings TEXT[],
  
  -- Identification
  microchip_number VARCHAR(15),
  microchip_date DATE,
  microchip_location VARCHAR(100),
  microchip_brand VARCHAR(100),
  tattoo_id VARCHAR(50),
  registration_number VARCHAR(100),
  registration_type VARCHAR(50),
  passport_number VARCHAR(50),
  
  -- Acquisition
  acquisition_date DATE,
  acquisition_type VARCHAR(50),
  acquisition_location VARCHAR(200),
  breeder_name VARCHAR(200),
  shelter_name VARCHAR(200),
  
  -- Computed/Cached
  health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
  vaccination_status VARCHAR(20) CHECK (vaccination_status IN ('up_to_date', 'due_soon', 'overdue', 'none')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_microchip ON pets(microchip_number);

CREATE TRIGGER pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- BREEDS TABLE
-- Breed database for all species
-- ============================================
CREATE TABLE breeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'rabbit', 'bird', 'other')),
  name VARCHAR(100) NOT NULL,
  name_local JSONB,
  alternate_names TEXT[],
  group_name VARCHAR(100),
  origin_country VARCHAR(100),
  size_category VARCHAR(20) CHECK (size_category IN ('toy', 'small', 'medium', 'large', 'giant')),
  weight_min_kg DECIMAL(5,2),
  weight_max_kg DECIMAL(5,2),
  height_min_cm DECIMAL(5,2),
  height_max_cm DECIMAL(5,2),
  life_expectancy_min INTEGER,
  life_expectancy_max INTEGER,
  temperament TEXT[],
  coat_types TEXT[],
  colors TEXT[],
  description TEXT,
  image_url TEXT,
  fci_number INTEGER,
  popularity_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_breeds_species ON breeds(species);
CREATE INDEX idx_breeds_name ON breeds(name);

-- ============================================
-- BREED HEALTH RISKS TABLE
-- Known health conditions by breed
-- ============================================
CREATE TABLE breed_health_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  breed_id UUID REFERENCES breeds(id) ON DELETE CASCADE,
  condition_name VARCHAR(200) NOT NULL,
  risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'moderate', 'high', 'very_high')),
  prevalence_percentage DECIMAL(5,2),
  typical_onset_months INTEGER,
  description TEXT,
  prevention_notes TEXT,
  screening_recommended BOOLEAN DEFAULT false,
  sources TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_breed_risks_breed ON breed_health_risks(breed_id);

-- ============================================
-- PHYSICAL MEASUREMENTS TABLE
-- Weight, dimensions, body condition
-- ============================================
CREATE TABLE physical_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  measured_date TIMESTAMP WITH TIME ZONE NOT NULL,
  measured_by VARCHAR(200),
  measurement_method VARCHAR(50),
  
  -- Weight
  weight_kg DECIMAL(6,2) CHECK (weight_kg > 0 AND weight_kg < 500),
  
  -- Body Condition
  body_condition_score INTEGER CHECK (body_condition_score BETWEEN 1 AND 9),
  
  -- Dimensions
  height_shoulder_cm DECIMAL(5,2),
  length_body_cm DECIMAL(6,2),
  chest_girth_cm DECIMAL(5,2),
  neck_girth_cm DECIMAL(5,2),
  
  -- Context
  is_pregnant BOOLEAN DEFAULT false,
  is_post_surgery BOOLEAN DEFAULT false,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_measurements_pet ON physical_measurements(pet_id);
CREATE INDEX idx_measurements_date ON physical_measurements(measured_date);

-- ============================================
-- PET PHOTOS TABLE
-- Additional pet photos beyond profile
-- ============================================
CREATE TABLE pet_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  taken_date DATE,
  is_cover BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pet_photos_pet ON pet_photos(pet_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE physical_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_photos ENABLE ROW LEVEL SECURITY;

-- Pet owners have full access
CREATE POLICY "Owners can manage their pets"
  ON pets FOR ALL
  USING (auth.uid() = user_id);

-- Co-owners can view and edit based on permissions
CREATE POLICY "Co-owners can view pets"
  ON pets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM co_owners
      WHERE co_owners.pet_id = pets.id
      AND co_owners.user_id = auth.uid()
      AND co_owners.status = 'accepted'
    )
  );

-- Measurements follow pet access
CREATE POLICY "Users can manage pet measurements"
  ON physical_measurements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = physical_measurements.pet_id
      AND (pets.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM co_owners
        WHERE co_owners.pet_id = pets.id
        AND co_owners.user_id = auth.uid()
        AND co_owners.permission_level IN ('edit', 'full')
      ))
    )
  );

-- Photos follow pet access
CREATE POLICY "Users can manage pet photos"
  ON pet_photos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_photos.pet_id
      AND pets.user_id = auth.uid()
    )
  );
