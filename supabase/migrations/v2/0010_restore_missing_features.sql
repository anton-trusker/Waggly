-- 0010_restore_missing_features.sql

-- 1. Ref Vaccines Table
CREATE TABLE IF NOT EXISTS public.ref_vaccines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    species species_type NOT NULL,
    vaccine_name TEXT NOT NULL,
    vaccine_type TEXT NOT NULL CHECK (vaccine_type IN ('core', 'non-core')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for ref_vaccines
CREATE INDEX idx_ref_vaccines_species ON public.ref_vaccines(species);
CREATE INDEX idx_ref_vaccines_name ON public.ref_vaccines(vaccine_name);

-- RLS for ref_vaccines
ALTER TABLE public.ref_vaccines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ref vaccines"
    ON public.ref_vaccines FOR SELECT
    USING (true);

-- Seed Data for Ref Vaccines
INSERT INTO public.ref_vaccines (species, vaccine_name, vaccine_type, description) VALUES
    ('dog', 'Rabies', 'core', 'Fatal viral disease affecting the central nervous system'),
    ('dog', 'Distemper (DHP/DHPP)', 'core', 'Prevents Distemper, Hepatitis, Parvovirus, and Parainfluenza'),
    ('dog', 'Parvovirus', 'core', 'Highly contagious viral illness affecting dogs'),
    ('dog', 'Adenovirus', 'core', 'Infectious hepatitis'),
    ('dog', 'Bordetella', 'non-core', 'Kennel cough prevention'),
    ('dog', 'Leptospirosis', 'non-core', 'Bacterial infection protection'),
    ('cat', 'Rabies', 'core', 'Fatal viral disease'),
    ('cat', 'FVRCP', 'core', 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia'),
    ('cat', 'FeLV', 'non-core', 'Feline Leukemia Virus');


-- 2. Pet Share Tokens Table
CREATE TABLE IF NOT EXISTS public.pet_share_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
    token TEXT NOT NULL UNIQUE,
    permission_level TEXT NOT NULL CHECK (permission_level IN ('basic', 'advanced')) DEFAULT 'basic',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    accessed_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for pet_share_tokens
CREATE INDEX idx_pet_share_tokens_pet_id ON public.pet_share_tokens(pet_id);
CREATE INDEX idx_pet_share_tokens_token ON public.pet_share_tokens(token);

-- RLS for pet_share_tokens
ALTER TABLE public.pet_share_tokens ENABLE ROW LEVEL SECURITY;

-- Owner policies using new owner_id column on pets
CREATE POLICY "Owners can view share tokens"
    ON public.pet_share_tokens FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pets WHERE pets.id = pet_share_tokens.pet_id AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can create share tokens"
    ON public.pet_share_tokens FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pets WHERE pets.id = pet_share_tokens.pet_id AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can update share tokens"
    ON public.pet_share_tokens FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.pets WHERE pets.id = pet_share_tokens.pet_id AND pets.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can delete share tokens"
    ON public.pet_share_tokens FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.pets WHERE pets.id = pet_share_tokens.pet_id AND pets.owner_id = auth.uid()
        )
    );

-- Public access policy for validation
CREATE POLICY "Anyone can validate active share tokens"
    ON public.pet_share_tokens FOR SELECT
    USING (is_active = TRUE);

-- Allow public to update access stats (limited)
CREATE POLICY "Anyone can increment access stats"
    ON public.pet_share_tokens FOR UPDATE
    USING (is_active = TRUE); -- AND only updating stats ideally, but row level is coarse


-- 3. Public Pet Details RPC
-- Used by usePublicShare.ts
CREATE OR REPLACE FUNCTION get_public_pet_details(share_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    token_record RECORD;
    pet_record RECORD;
    result JSONB;
BEGIN
    -- Validate token
    SELECT * INTO token_record
    FROM public.pet_share_tokens
    WHERE token = share_token AND is_active = TRUE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'Invalid or expired token');
    END IF;

    -- Update stats
    UPDATE public.pet_share_tokens
    SET accessed_count = accessed_count + 1,
        last_accessed_at = NOW()
    WHERE id = token_record.id;

    -- Fetch Pet Basic Info
    SELECT * INTO pet_record
    FROM public.pets
    WHERE id = token_record.pet_id;

    -- Construct Response
    result := jsonb_build_object(
        'pet', jsonb_build_object(
            'name', pet_record.name,
            'species', pet_record.species,
            'breed', pet_record.breed,
            'date_of_birth', pet_record.date_of_birth,
            'gender', pet_record.gender,
            'weight', pet_record.weight_current,
            'avatar_url', pet_record.avatar_url,
            'microchip_number', CASE WHEN token_record.permission_level = 'advanced' THEN pet_record.microchip_number ELSE NULL END
        ),
        'owner', jsonb_build_object(
            'name', 'Pet Owner' -- Placeholder as we might not want to expose owner details publicly
        ),
        'settings', jsonb_build_object(
            'preset', CASE WHEN token_record.permission_level = 'advanced' THEN 'FULL' ELSE 'BASIC' END
        ),
        'details', jsonb_build_object(
            'vaccinations', '[]'::jsonb, -- Populate real data if needed
            'medications', '[]'::jsonb,
            'visits', '[]'::jsonb
        )
    );

    RETURN result;
END;
$$;
