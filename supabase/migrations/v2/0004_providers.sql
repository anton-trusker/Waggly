-- Providers Table (Normalized: Vets, Groomers, Insurance, etc.)
CREATE TABLE IF NOT EXISTS public.providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- User who added this provider
    
    category provider_category_enum NOT NULL, -- Enum: veterinarian, groomer, insurance, etc.
    name TEXT NOT NULL,
    clinic_name TEXT, -- Optional, if specific to a clinic
    
    -- Contact Info
    phone TEXT,
    email TEXT,
    website TEXT,
    address TEXT,
    
    -- For Insurance specifically
    policy_number TEXT,
    group_number TEXT,
    
    -- Metadata
    notes TEXT,
    is_primary BOOLEAN DEFAULT FALSE, -- e.g. Primary Vet
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link Pets to Providers (Many-to-Many usually, or just loose association? 
-- A pet might have specific providers. Let's create a junction table for clarity "pet_providers" 
-- or just keep it simple. Usually providers are User-level, but sometimes Pet-level.
-- For V2, let's allow a User to have providers, and link them to pets if needed, 
-- or just keep providers as a directory for the user.
-- If insurance is a provider, it's definitely linked to a pet.

-- Pet Providers Junction Table (associates a pet with a provider)
CREATE TABLE IF NOT EXISTS public.pet_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
    
    -- Specific details for this association
    description TEXT, -- e.g. "Primary Vet for vaccinations"
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(pet_id, provider_id)
);

-- Indexes
CREATE INDEX idx_providers_owner_id ON public.providers(owner_id);
CREATE INDEX idx_providers_category ON public.providers(category);
CREATE INDEX idx_pet_providers_pet_id ON public.pet_providers(pet_id);

-- Trigger
CREATE TRIGGER update_providers_updated_at
    BEFORE UPDATE ON public.providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_providers ENABLE ROW LEVEL SECURITY;
