-- Breeds Table (Optional Normalization for future use, can be seeded)
CREATE TABLE IF NOT EXISTS public.breeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    species species_type NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    temperament TEXT[],
    life_expectancy_years INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CREATE INDEX idx_breeds_species ON public.breeds(species);
-- CREATE INDEX idx_breeds_name ON public.breeds USING gin(name gin_trgm_ops);

-- Pets Table
CREATE TABLE IF NOT EXISTS public.pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Basic Info
    name TEXT NOT NULL,
    species species_type NOT NULL, -- Enum
    breed TEXT, -- Keeping as text for flexibility, can link to breeds table later or via app logic
    gender gender_type, -- Enum
    size pet_size_type, -- Enum
    
    -- Dates (Date only is usually sufficient for DOB)
    date_of_birth DATE,
    date_of_adoption DATE,
    
    -- Physical
    weight_current DECIMAL(5,2), -- in kg or lbs (app convention implied)
    weight_unit TEXT DEFAULT 'kg', -- explicit unit
    blood_type TEXT,
    color TEXT,
    
    -- Identification
    microchip_number TEXT,
    registration_id TEXT,
    
    -- Metadata
    avatar_url TEXT,
    description TEXT,
    
    -- Status
    is_spayed_neutered BOOLEAN DEFAULT FALSE,
    is_deceased BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_pets_owner_id ON public.pets(owner_id);
CREATE INDEX idx_pets_name ON public.pets USING gin(name gin_trgm_ops); -- Fast search

-- Trigger for Updated At
CREATE TRIGGER update_pets_updated_at
    BEFORE UPDATE ON public.pets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
