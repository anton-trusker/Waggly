-- Create cat_breeds table
CREATE TABLE IF NOT EXISTS public.cat_breeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    registry_groups TEXT,
    origin_country TEXT,
    size_category TEXT,
    average_height_cm TEXT,
    average_weight_kg TEXT,
    life_expectancy_years TEXT,
    temperament TEXT,
    coat_type TEXT,
    color_varieties TEXT,
    coat_length TEXT,
    training_difficulty TEXT,
    activity_level TEXT,
    grooming_needs TEXT,
    good_with_families TEXT,
    good_with_children TEXT,
    shedding_level TEXT,
    health_concerns TEXT,
    unique_traits TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for cat_breeds
ALTER TABLE public.cat_breeds ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'cat_breeds'
        AND policyname = 'Allow public read access on cat_breeds'
    ) THEN
        CREATE POLICY "Allow public read access on cat_breeds" ON public.cat_breeds
            FOR SELECT USING (true);
    END IF;
END
$$;


-- Create reference_medications table
CREATE TABLE IF NOT EXISTS public.reference_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL,
    generic_name TEXT,
    type TEXT,
    pet_type TEXT,
    disease_treatment TEXT,
    dosage TEXT,
    dosage_unit TEXT,
    administration_route TEXT,
    duration_frequency TEXT,
    description TEXT,
    manufacturer TEXT,
    common_side_effects TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for reference_medications
ALTER TABLE public.reference_medications ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'reference_medications'
        AND policyname = 'Allow public read access on reference_medications'
    ) THEN
        CREATE POLICY "Allow public read access on reference_medications" ON public.reference_medications
            FOR SELECT USING (true);
    END IF;
END
$$;


-- Create reference_vaccinations table
CREATE TABLE IF NOT EXISTS public.reference_vaccinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL,
    type TEXT,
    protects_against TEXT,
    generic_name TEXT,
    pet_type TEXT,
    duration TEXT,
    description TEXT,
    vaccine_category TEXT,
    administration_route TEXT,
    core_non_core TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for reference_vaccinations
ALTER TABLE public.reference_vaccinations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'reference_vaccinations'
        AND policyname = 'Allow public read access on reference_vaccinations'
    ) THEN
        CREATE POLICY "Allow public read access on reference_vaccinations" ON public.reference_vaccinations
            FOR SELECT USING (true);
    END IF;
END
$$;
