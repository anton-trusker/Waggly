-- Core RLS Policies Migration
-- Simplified version focusing on essential tables and security

-- ==============================================
-- HELPER FUNCTIONS
-- ==============================================

-- Function to check if user owns a pet
CREATE OR REPLACE FUNCTION public.is_pet_owner(pet_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.pets 
    WHERE id = pet_uuid 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is a co-owner of a pet
CREATE OR REPLACE FUNCTION public.is_pet_coowner(pet_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.co_owners 
    WHERE co_owner_id = auth.uid()
    AND pet_id = pet_uuid
    AND status = 'accepted'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has access to a pet (owner or co-owner)
CREATE OR REPLACE FUNCTION public.has_pet_access(pet_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN public.is_pet_owner(pet_uuid) OR public.is_pet_coowner(pet_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- PROFILES TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ==============================================
-- PETS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on pets table
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Allow owners to read their own pets
CREATE POLICY "Owners can read own pets" ON public.pets
  FOR SELECT USING (user_id = auth.uid());

-- Allow owners to insert pets
CREATE POLICY "Owners can insert pets" ON public.pets
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow owners to update their own pets
CREATE POLICY "Owners can update own pets" ON public.pets
  FOR UPDATE USING (user_id = auth.uid());

-- Allow owners to delete their own pets
CREATE POLICY "Owners can delete own pets" ON public.pets
  FOR DELETE USING (user_id = auth.uid());

-- Allow co-owners to read pets they have access to
CREATE POLICY "Co-owners can read accessible pets" ON public.pets
  FOR SELECT USING (public.has_pet_access(id));

-- Allow co-owners to update pets they have access to
CREATE POLICY "Co-owners can update accessible pets" ON public.pets
  FOR UPDATE USING (public.has_pet_access(id));

-- ==============================================
-- VETERINARIANS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on veterinarians table
ALTER TABLE public.veterinarians ENABLE ROW LEVEL SECURITY;

-- Allow users to read veterinarians for pets they own or co-own
CREATE POLICY "Users can read veterinarians for accessible pets" ON public.veterinarians
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert veterinarians for their pets
CREATE POLICY "Owners can insert veterinarians for own pets" ON public.veterinarians
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update veterinarians for their pets
CREATE POLICY "Owners can update veterinarians for own pets" ON public.veterinarians
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete veterinarians for their pets
CREATE POLICY "Owners can delete veterinarians for own pets" ON public.veterinarians
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- ALLERGIES TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on allergies table
ALTER TABLE public.allergies ENABLE ROW LEVEL SECURITY;

-- Allow users to read allergies for pets they own or co-own
CREATE POLICY "Users can read allergies for accessible pets" ON public.allergies
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert allergies for their pets
CREATE POLICY "Owners can insert allergies for own pets" ON public.allergies
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update allergies for their pets
CREATE POLICY "Owners can update allergies for own pets" ON public.allergies
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete allergies for their pets
CREATE POLICY "Owners can delete allergies for own pets" ON public.allergies
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- VACCINATIONS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on vaccinations table
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;

-- Allow users to read vaccinations for pets they own or co-own
CREATE POLICY "Users can read vaccinations for accessible pets" ON public.vaccinations
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert vaccinations for their pets
CREATE POLICY "Owners can insert vaccinations for own pets" ON public.vaccinations
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update vaccinations for their pets
CREATE POLICY "Owners can update vaccinations for own pets" ON public.vaccinations
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete vaccinations for their pets
CREATE POLICY "Owners can delete vaccinations for own pets" ON public.vaccinations
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- MEDICATIONS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on medications table
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- Allow users to read medications for pets they own or co-own
CREATE POLICY "Users can read medications for accessible pets" ON public.medications
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert medications for their pets
CREATE POLICY "Owners can insert medications for own pets" ON public.medications
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update medications for their pets
CREATE POLICY "Owners can update medications for own pets" ON public.medications
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete medications for their pets
CREATE POLICY "Owners can delete medications for own pets" ON public.medications
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- DOCUMENTS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Allow users to read documents for pets they own or co-own
CREATE POLICY "Users can read documents for accessible pets" ON public.documents
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert documents for their pets
CREATE POLICY "Owners can insert documents for own pets" ON public.documents
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update documents for their pets
CREATE POLICY "Owners can update documents for own pets" ON public.documents
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete documents for their pets
CREATE POLICY "Owners can delete documents for own pets" ON public.documents
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- MEDICAL_VISITS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on medical_visits table
ALTER TABLE public.medical_visits ENABLE ROW LEVEL SECURITY;

-- Allow users to read medical visits for pets they own or co-own
CREATE POLICY "Users can read medical visits for accessible pets" ON public.medical_visits
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert medical visits for their pets
CREATE POLICY "Owners can insert medical visits for own pets" ON public.medical_visits
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update medical visits for their pets
CREATE POLICY "Owners can update medical visits for own pets" ON public.medical_visits
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete medical visits for their pets
CREATE POLICY "Owners can delete medical visits for own pets" ON public.medical_visits
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- CONDITIONS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on conditions table
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;

-- Allow users to read conditions for pets they own or co-own
CREATE POLICY "Users can read conditions for accessible pets" ON public.conditions
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert conditions for their pets
CREATE POLICY "Owners can insert conditions for own pets" ON public.conditions
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update conditions for their pets
CREATE POLICY "Owners can update conditions for own pets" ON public.conditions
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete conditions for their pets
CREATE POLICY "Owners can delete conditions for own pets" ON public.conditions
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- NOTIFICATIONS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own notifications
CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

-- Allow users to update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Allow users to insert notifications for themselves
CREATE POLICY "Users can insert own notifications" ON public.notifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow users to delete their own notifications
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());

-- ==============================================
-- CO_OWNERS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on co_owners table
ALTER TABLE public.co_owners ENABLE ROW LEVEL SECURITY;

-- Allow users to read co-ownership records where they are involved
CREATE POLICY "Users can read co-ownership records" ON public.co_owners
  FOR SELECT USING (main_owner_id = auth.uid() OR co_owner_id = auth.uid() OR created_by = auth.uid());

-- Allow main owners to insert co-ownership records for their pets
CREATE POLICY "Main owners can insert co-ownership records" ON public.co_owners
  FOR INSERT WITH CHECK (main_owner_id = auth.uid());

-- Allow main owners to update co-ownership records for their pets
CREATE POLICY "Main owners can update co-ownership records" ON public.co_owners
  FOR UPDATE USING (main_owner_id = auth.uid());

-- Allow main owners to delete co-ownership records for their pets
CREATE POLICY "Main owners can delete co-ownership records" ON public.co_owners
  FOR DELETE USING (main_owner_id = auth.uid());

-- ==============================================
-- REFERENCE TABLES (READ-ONLY ACCESS)
-- ==============================================

-- Reference tables that should be publicly readable
CREATE POLICY "Anyone can read breeds" ON public.breeds
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read reference vaccinations" ON public.reference_vaccinations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read reference treatments" ON public.reference_treatments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read reference breeds" ON public.reference_breeds
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read ref vaccines" ON public.ref_vaccines
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read ref medications" ON public.ref_medications
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read ref symptoms" ON public.ref_symptoms
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read ref allergens" ON public.ref_allergens
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read translations" ON public.translations
  FOR SELECT USING (true);

-- ==============================================
-- GRANT PERMISSIONS TO ROLES
-- ==============================================

-- Grant SELECT permissions to anon role for public data
GRANT SELECT ON public.breeds TO anon;
GRANT SELECT ON public.reference_vaccinations TO anon;
GRANT SELECT ON public.reference_treatments TO anon;
GRANT SELECT ON public.reference_breeds TO anon;
GRANT SELECT ON public.ref_vaccines TO anon;
GRANT SELECT ON public.ref_medications TO anon;
GRANT SELECT ON public.ref_symptoms TO anon;
GRANT SELECT ON public.ref_allergens TO anon;
GRANT SELECT ON public.translations TO anon;

-- Grant basic permissions to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.veterinarians TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.allergies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vaccinations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.medications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.medical_visits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conditions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.co_owners TO authenticated;

-- Grant permissions for reference tables
GRANT SELECT ON public.breeds TO authenticated;
GRANT SELECT ON public.reference_vaccinations TO authenticated;
GRANT SELECT ON public.reference_treatments TO authenticated;
GRANT SELECT ON public.reference_breeds TO authenticated;
GRANT SELECT ON public.ref_vaccines TO authenticated;
GRANT SELECT ON public.ref_medications TO authenticated;
GRANT SELECT ON public.ref_symptoms TO authenticated;
GRANT SELECT ON public.ref_allergens TO authenticated;
GRANT SELECT ON public.translations TO authenticated;