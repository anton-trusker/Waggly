-- Security Policies (Row Level Security)

-- Helper Functions (best practice for cleaner policies)
-- -------------------------------------------------------------------------

-- Check if user owns the pet
CREATE OR REPLACE FUNCTION public.is_pet_owner(pet_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.pets
    WHERE id = pet_id
    AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user owns the profile (conceptually simple, but good for consistency)
-- (Direct comparison `id = auth.uid()` is usually efficient enough for profiles)


-- -------------------------------------------------------------------------
-- 1. Profiles
-- -------------------------------------------------------------------------
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid());

-- Users can insert their own profile (usually handled by auth trigger, but allow explicit creation if needed)
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (id = auth.uid());


-- -------------------------------------------------------------------------
-- 2. Pets
-- -------------------------------------------------------------------------
-- View own pets
CREATE POLICY "Users can view own pets"
    ON public.pets FOR SELECT
    USING (owner_id = auth.uid());

-- Create own pets
CREATE POLICY "Users can create pets"
    ON public.pets FOR INSERT
    WITH CHECK (owner_id = auth.uid());

-- Update own pets
CREATE POLICY "Users can update own pets"
    ON public.pets FOR UPDATE
    USING (owner_id = auth.uid());

-- Delete own pets
CREATE POLICY "Users can delete own pets"
    ON public.pets FOR DELETE
    USING (owner_id = auth.uid());


-- -------------------------------------------------------------------------
-- 3. Providers
-- -------------------------------------------------------------------------
-- View own providers
CREATE POLICY "Users can view own providers"
    ON public.providers FOR SELECT
    USING (owner_id = auth.uid());

CREATE POLICY "Users can manage own providers"
    ON public.providers FOR ALL
    USING (owner_id = auth.uid());


-- -------------------------------------------------------------------------
-- 4. Health Records (Vaccinations, Visits, Medications, etc.)
--    Optimized to use the is_pet_owner function or direct join
-- -------------------------------------------------------------------------

-- Vaccinations
CREATE POLICY "Users can view vaccinations for their pets"
    ON public.vaccinations FOR SELECT
    USING (public.is_pet_owner(pet_id));

CREATE POLICY "Users can manage vaccinations for their pets"
    ON public.vaccinations FOR ALL
    USING (public.is_pet_owner(pet_id));

-- Medical Visits
CREATE POLICY "Users can view medical visits for their pets"
    ON public.medical_visits FOR SELECT
    USING (public.is_pet_owner(pet_id));

CREATE POLICY "Users can manage medical visits for their pets"
    ON public.medical_visits FOR ALL
    USING (public.is_pet_owner(pet_id));

-- Medications
CREATE POLICY "Users can view medications for their pets"
    ON public.medications FOR SELECT
    USING (public.is_pet_owner(pet_id));

CREATE POLICY "Users can manage medications for their pets"
    ON public.medications FOR ALL
    USING (public.is_pet_owner(pet_id));

-- Allergies
CREATE POLICY "Users can view allergies for their pets"
    ON public.allergies FOR SELECT
    USING (public.is_pet_owner(pet_id));

CREATE POLICY "Users can manage allergies for their pets"
    ON public.allergies FOR ALL
    USING (public.is_pet_owner(pet_id));

-- Weight Logs
CREATE POLICY "Users can view weight logs for their pets"
    ON public.weight_logs FOR SELECT
    USING (public.is_pet_owner(pet_id));

CREATE POLICY "Users can manage weight logs for their pets"
    ON public.weight_logs FOR ALL
    USING (public.is_pet_owner(pet_id));


-- -------------------------------------------------------------------------
-- 5. Documents & Travel
-- -------------------------------------------------------------------------

-- Documents (Check owner_id OR pet_id ownership)
CREATE POLICY "Users can view own documents"
    ON public.documents FOR SELECT
    USING (
        owner_id = auth.uid() 
        OR 
        (pet_id IS NOT NULL AND public.is_pet_owner(pet_id))
    );

CREATE POLICY "Users can manage own documents"
    ON public.documents FOR ALL
    USING (owner_id = auth.uid());

-- Travel Records
CREATE POLICY "Users can manage travel records"
    ON public.travel_records FOR ALL
    USING (public.is_pet_owner(pet_id));


-- -------------------------------------------------------------------------
-- 6. Storage Buckets (Storage RLS)
--    Note: SQL can configure storage.buckets and storage.objects policies too
-- -------------------------------------------------------------------------

-- Ensure bucket exists (idempotent insert)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pet_photos', 'pet_photos', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false) -- Private docs
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Pet Photos - Public Read, Owner Write)
CREATE POLICY "Public Access to Pet Photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pet_photos' );

CREATE POLICY "Owners can upload Pet Photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'pet_photos' 
    AND auth.uid() = (storage.foldername(name))[1]::uuid -- Assuming folder structure user_id/filename
);
-- Note: Storage policies are complex to perfect in SQL without exact folder structure knowledge.
-- For V2, we assume a "user_id/..." prefix convention for security.
