-- Create medical_visits table
CREATE TABLE IF NOT EXISTS public.medical_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    clinic_name TEXT,
    vet_name TEXT,
    reason TEXT NOT NULL,
    diagnosis TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.medical_visits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view medical visits for their pets" ON public.medical_visits
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE public.pets.id = public.medical_visits.pet_id
            AND public.pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert medical visits for their pets" ON public.medical_visits
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE public.pets.id = public.medical_visits.pet_id
            AND public.pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update medical visits for their pets" ON public.medical_visits
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE public.pets.id = public.medical_visits.pet_id
            AND public.pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete medical visits for their pets" ON public.medical_visits
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE public.pets.id = public.medical_visits.pet_id
            AND public.pets.user_id = auth.uid()
        )
    );

-- Create index
CREATE INDEX idx_medical_visits_pet_id ON public.medical_visits(pet_id);
CREATE INDEX idx_medical_visits_date ON public.medical_visits(date);
