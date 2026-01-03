-- Comprehensive RLS Policies Migration - Version 2
-- This migration applies Row Level Security policies to all tables
-- Drops existing policies first to avoid conflicts

-- ==============================================
-- DROP EXISTING POLICIES
-- ==============================================

-- Profiles table policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Pets table policies
DROP POLICY IF EXISTS "Owners can read own pets" ON public.pets;
DROP POLICY IF EXISTS "Owners can insert pets" ON public.pets;
DROP POLICY IF EXISTS "Owners can update own pets" ON public.pets;
DROP POLICY IF EXISTS "Owners can delete own pets" ON public.pets;
DROP POLICY IF EXISTS "Co-owners can read accessible pets" ON public.pets;
DROP POLICY IF EXISTS "Co-owners can update accessible pets" ON public.pets;

-- Veterinarians table policies
DROP POLICY IF EXISTS "Users can read veterinarians for accessible pets" ON public.veterinarians;
DROP POLICY IF EXISTS "Owners can insert veterinarians for own pets" ON public.veterinarians;
DROP POLICY IF EXISTS "Owners can update veterinarians for own pets" ON public.veterinarians;
DROP POLICY IF EXISTS "Owners can delete veterinarians for own pets" ON public.veterinarians;

-- Allergies table policies
DROP POLICY IF EXISTS "Users can read allergies for accessible pets" ON public.allergies;
DROP POLICY IF EXISTS "Owners can insert allergies for own pets" ON public.allergies;
DROP POLICY IF EXISTS "Owners can update allergies for own pets" ON public.allergies;
DROP POLICY IF EXISTS "Owners can delete allergies for own pets" ON public.allergies;

-- Behavior tags table policies
DROP POLICY IF EXISTS "Users can read behavior tags for accessible pets" ON public.behavior_tags;
DROP POLICY IF EXISTS "Owners can insert behavior tags for own pets" ON public.behavior_tags;
DROP POLICY IF EXISTS "Owners can update behavior tags for own pets" ON public.behavior_tags;
DROP POLICY IF EXISTS "Owners can delete behavior tags for own pets" ON public.behavior_tags;

-- Medical history table policies
DROP POLICY IF EXISTS "Users can read medical history for accessible pets" ON public.medical_history;
DROP POLICY IF EXISTS "Owners can insert medical history for own pets" ON public.medical_history;
DROP POLICY IF EXISTS "Owners can update medical history for own pets" ON public.medical_history;
DROP POLICY IF EXISTS "Owners can delete medical history for own pets" ON public.medical_history;

-- Food table policies
DROP POLICY IF EXISTS "Users can read food for accessible pets" ON public.food;
DROP POLICY IF EXISTS "Owners can insert food for own pets" ON public.food;
DROP POLICY IF EXISTS "Owners can update food for own pets" ON public.food;
DROP POLICY IF EXISTS "Owners can delete food for own pets" ON public.food;

-- Care notes table policies
DROP POLICY IF EXISTS "Users can read care notes for accessible pets" ON public.care_notes;
DROP POLICY IF EXISTS "Owners can insert care notes for own pets" ON public.care_notes;
DROP POLICY IF EXISTS "Owners can update care notes for own pets" ON public.care_notes;
DROP POLICY IF EXISTS "Owners can delete care notes for own pets" ON public.care_notes;

-- Vaccinations table policies
DROP POLICY IF EXISTS "Users can read vaccinations for accessible pets" ON public.vaccinations;
DROP POLICY IF EXISTS "Owners can insert vaccinations for own pets" ON public.vaccinations;
DROP POLICY IF EXISTS "Owners can update vaccinations for own pets" ON public.vaccinations;
DROP POLICY IF EXISTS "Owners can delete vaccinations for own pets" ON public.vaccinations;

-- Treatments table policies
DROP POLICY IF EXISTS "Users can read treatments for accessible pets" ON public.treatments;
DROP POLICY IF EXISTS "Owners can insert treatments for own pets" ON public.treatments;
DROP POLICY IF EXISTS "Owners can update treatments for own pets" ON public.treatments;
DROP POLICY IF EXISTS "Owners can delete treatments for own pets" ON public.treatments;

-- Weight entries table policies
DROP POLICY IF EXISTS "Users can read weight entries for accessible pets" ON public.weight_entries;
DROP POLICY IF EXISTS "Owners can insert weight entries for own pets" ON public.weight_entries;
DROP POLICY IF EXISTS "Owners can update weight entries for own pets" ON public.weight_entries;
DROP POLICY IF EXISTS "Owners can delete weight entries for own pets" ON public.weight_entries;

-- Notifications table policies
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

-- Co-owners table policies
DROP POLICY IF EXISTS "Users can read co-ownership records" ON public.co_owners;
DROP POLICY IF EXISTS "Main owners can insert co-ownership records" ON public.co_owners;
DROP POLICY IF EXISTS "Main owners can update co-ownership records" ON public.co_owners;
DROP POLICY IF EXISTS "Main owners can delete co-ownership records" ON public.co_owners;

-- Documents table policies
DROP POLICY IF EXISTS "Users can read documents for accessible pets" ON public.documents;
DROP POLICY IF EXISTS "Owners can insert documents for own pets" ON public.documents;
DROP POLICY IF EXISTS "Owners can update documents for own pets" ON public.documents;
DROP POLICY IF EXISTS "Owners can delete documents for own pets" ON public.documents;

-- Medical visits table policies
DROP POLICY IF EXISTS "Users can read medical visits for accessible pets" ON public.medical_visits;
DROP POLICY IF EXISTS "Owners can insert medical visits for own pets" ON public.medical_visits;
DROP POLICY IF EXISTS "Owners can update medical visits for own pets" ON public.medical_visits;
DROP POLICY IF EXISTS "Owners can delete medical visits for own pets" ON public.medical_visits;

-- Conditions table policies
DROP POLICY IF EXISTS "Users can read conditions for accessible pets" ON public.conditions;
DROP POLICY IF EXISTS "Owners can insert conditions for own pets" ON public.conditions;
DROP POLICY IF EXISTS "Owners can update conditions for own pets" ON public.conditions;
DROP POLICY IF EXISTS "Owners can delete conditions for own pets" ON public.conditions;

-- Medications table policies
DROP POLICY IF EXISTS "Users can read medications for accessible pets" ON public.medications;
DROP POLICY IF EXISTS "Owners can insert medications for own pets" ON public.medications;
DROP POLICY IF EXISTS "Owners can update medications for own pets" ON public.medications;
DROP POLICY IF EXISTS "Owners can delete medications for own pets" ON public.medications;

-- Public shares table policies
DROP POLICY IF EXISTS "Anyone can read public shares" ON public.public_shares;
DROP POLICY IF EXISTS "Owners can insert public shares for own pets" ON public.public_shares;
DROP POLICY IF EXISTS "Owners can update public shares for own pets" ON public.public_shares;
DROP POLICY IF EXISTS "Owners can delete public shares for own pets" ON public.public_shares;

-- Pet photos table policies
DROP POLICY IF EXISTS "Users can read pet photos for accessible pets" ON public.pet_photos;
DROP POLICY IF EXISTS "Owners can insert pet photos for own pets" ON public.pet_photos;
DROP POLICY IF EXISTS "Owners can update pet photos for own pets" ON public.pet_photos;
DROP POLICY IF EXISTS "Owners can delete pet photos for own pets" ON public.pet_photos;

-- Health metrics table policies
DROP POLICY IF EXISTS "Users can read health metrics for accessible pets" ON public.health_metrics;
DROP POLICY IF EXISTS "Owners can insert health metrics for own pets" ON public.health_metrics;
DROP POLICY IF EXISTS "Owners can update health metrics for own pets" ON public.health_metrics;
DROP POLICY IF EXISTS "Owners can delete health metrics for own pets" ON public.health_metrics;

-- Activity logs table policies
DROP POLICY IF EXISTS "Users can read activity logs for accessible pets" ON public.activity_logs;
DROP POLICY IF EXISTS "Owners can insert activity logs for own pets" ON public.activity_logs;
DROP POLICY IF EXISTS "Owners can update activity logs for own pets" ON public.activity_logs;
DROP POLICY IF EXISTS "Owners can delete activity logs for own pets" ON public.activity_logs;

-- Favorites table policies
DROP POLICY IF EXISTS "Users can read own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can update own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;

-- Reference tables policies
DROP POLICY IF EXISTS "Anyone can read breeds" ON public.breeds;
DROP POLICY IF EXISTS "Anyone can read reference vaccinations" ON public.reference_vaccinations;
DROP POLICY IF EXISTS "Anyone can read reference treatments" ON public.reference_treatments;
DROP POLICY IF EXISTS "Anyone can read reference breeds" ON public.reference_breeds;
DROP POLICY IF EXISTS "Anyone can read ref vaccines" ON public.ref_vaccines;
DROP POLICY IF EXISTS "Anyone can read ref medications" ON public.ref_medications;
DROP POLICY IF EXISTS "Anyone can read ref symptoms" ON public.ref_symptoms;
DROP POLICY IF EXISTS "Anyone can read ref allergens" ON public.ref_allergens;
DROP POLICY IF EXISTS "Anyone can read translations" ON public.translations;

-- System tables policies
DROP POLICY IF EXISTS "Only admins can read users" ON public.users;
DROP POLICY IF EXISTS "Only admins can update users" ON public.users;
DROP POLICY IF EXISTS "Only admins can read roles" ON public.roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.roles;
DROP POLICY IF EXISTS "Only admins can read settings" ON public.settings;
DROP POLICY IF EXISTS "Only admins can update settings" ON public.settings;
DROP POLICY IF EXISTS "Anyone can read published content" ON public.content;
DROP POLICY IF EXISTS "Creators can read own content" ON public.content;
DROP POLICY IF EXISTS "Creators can insert own content" ON public.content;
DROP POLICY IF EXISTS "Creators can update own content" ON public.content;
DROP POLICY IF EXISTS "Only admins can review content" ON public.content;
DROP POLICY IF EXISTS "Only admins can read audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can read own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Only admins can read mail queue" ON public.mail_queue;
DROP POLICY IF EXISTS "Only admins can update mail queue" ON public.mail_queue;
DROP POLICY IF EXISTS "Users can read own shared links" ON public.shared_links;
DROP POLICY IF EXISTS "Anyone can read public shared links" ON public.shared_links;
DROP POLICY IF EXISTS "Users can insert own shared links" ON public.shared_links;
DROP POLICY IF EXISTS "Users can update own shared links" ON public.shared_links;
DROP POLICY IF EXISTS "Users can delete own shared links" ON public.shared_links;

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
-- BEHAVIOR_TAGS TABLE RLS POLICIES
-- ==============================================

-- Allow users to read behavior tags for pets they own or co-own
CREATE POLICY "Users can read behavior tags for accessible pets" ON public.behavior_tags
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert behavior tags for their pets
CREATE POLICY "Owners can insert behavior tags for own pets" ON public.behavior_tags
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update behavior tags for their pets
CREATE POLICY "Owners can update behavior tags for own pets" ON public.behavior_tags
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete behavior tags for their pets
CREATE POLICY "Owners can delete behavior tags for own pets" ON public.behavior_tags
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- MEDICAL_HISTORY TABLE RLS POLICIES
-- ==============================================

-- Allow users to read medical history for pets they own or co-own
CREATE POLICY "Users can read medical history for accessible pets" ON public.medical_history
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert medical history for their pets
CREATE POLICY "Owners can insert medical history for own pets" ON public.medical_history
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update medical history for their pets
CREATE POLICY "Owners can update medical history for own pets" ON public.medical_history
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete medical history for their pets
CREATE POLICY "Owners can delete medical history for own pets" ON public.medical_history
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- FOOD TABLE RLS POLICIES
-- ==============================================

-- Allow users to read food information for pets they own or co-own
CREATE POLICY "Users can read food for accessible pets" ON public.food
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert food information for their pets
CREATE POLICY "Owners can insert food for own pets" ON public.food
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update food information for their pets
CREATE POLICY "Owners can update food for own pets" ON public.food
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete food information for their pets
CREATE POLICY "Owners can delete food for own pets" ON public.food
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- CARE_NOTES TABLE RLS POLICIES
-- ==============================================

-- Allow users to read care notes for pets they own or co-own
CREATE POLICY "Users can read care notes for accessible pets" ON public.care_notes
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert care notes for their pets
CREATE POLICY "Owners can insert care notes for own pets" ON public.care_notes
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update care notes for their pets
CREATE POLICY "Owners can update care notes for own pets" ON public.care_notes
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete care notes for their pets
CREATE POLICY "Owners can delete care notes for own pets" ON public.care_notes
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- VACCINATIONS TABLE RLS POLICIES
-- ==============================================

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
-- TREATMENTS TABLE RLS POLICIES
-- ==============================================

-- Allow users to read treatments for pets they own or co-own
CREATE POLICY "Users can read treatments for accessible pets" ON public.treatments
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert treatments for their pets
CREATE POLICY "Owners can insert treatments for own pets" ON public.treatments
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update treatments for their pets
CREATE POLICY "Owners can update treatments for own pets" ON public.treatments
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete treatments for their pets
CREATE POLICY "Owners can delete treatments for own pets" ON public.treatments
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- WEIGHT_ENTRIES TABLE RLS POLICIES
-- ==============================================

-- Allow users to read weight entries for pets they own or co-own
CREATE POLICY "Users can read weight entries for accessible pets" ON public.weight_entries
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert weight entries for their pets
CREATE POLICY "Owners can insert weight entries for own pets" ON public.weight_entries
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update weight entries for their pets
CREATE POLICY "Owners can update weight entries for own pets" ON public.weight_entries
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete weight entries for their pets
CREATE POLICY "Owners can delete weight entries for own pets" ON public.weight_entries
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- NOTIFICATIONS TABLE RLS POLICIES
-- ==============================================

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
-- DOCUMENTS TABLE RLS POLICIES
-- ==============================================

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
-- MEDICATIONS TABLE RLS POLICIES
-- ==============================================

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
-- PUBLIC_SHARES TABLE RLS POLICIES
-- ==============================================

-- Allow anyone to read public shares (they're public!)
CREATE POLICY "Anyone can read public shares" ON public.public_shares
  FOR SELECT USING (true);

-- Allow owners to insert public shares for their pets
CREATE POLICY "Owners can insert public shares for own pets" ON public.public_shares
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update public shares for their pets
CREATE POLICY "Owners can update public shares for own pets" ON public.public_shares
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete public shares for their pets
CREATE POLICY "Owners can delete public shares for own pets" ON public.public_shares
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- PET_PHOTOS TABLE RLS POLICIES
-- ==============================================

-- Allow users to read pet photos for pets they own or co-own
CREATE POLICY "Users can read pet photos for accessible pets" ON public.pet_photos
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert pet photos for their pets
CREATE POLICY "Owners can insert pet photos for own pets" ON public.pet_photos
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update pet photos for their pets
CREATE POLICY "Owners can update pet photos for own pets" ON public.pet_photos
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete pet photos for their pets
CREATE POLICY "Owners can delete pet photos for own pets" ON public.pet_photos
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- HEALTH_METRICS TABLE RLS POLICIES
-- ==============================================

-- Allow users to read health metrics for pets they own or co-own
CREATE POLICY "Users can read health metrics for accessible pets" ON public.health_metrics
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert health metrics for their pets
CREATE POLICY "Owners can insert health metrics for own pets" ON public.health_metrics
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update health metrics for their pets
CREATE POLICY "Owners can update health metrics for own pets" ON public.health_metrics
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete health metrics for their pets
CREATE POLICY "Owners can delete health metrics for own pets" ON public.health_metrics
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- ACTIVITY_LOGS TABLE RLS POLICIES
-- ==============================================

-- Allow users to read activity logs for pets they own or co-own
CREATE POLICY "Users can read activity logs for accessible pets" ON public.activity_logs
  FOR SELECT USING (public.has_pet_access(pet_id));

-- Allow owners to insert activity logs for their pets
CREATE POLICY "Owners can insert activity logs for own pets" ON public.activity_logs
  FOR INSERT WITH CHECK (public.is_pet_owner(pet_id));

-- Allow owners to update activity logs for their pets
CREATE POLICY "Owners can update activity logs for own pets" ON public.activity_logs
  FOR UPDATE USING (public.is_pet_owner(pet_id));

-- Allow owners to delete activity logs for their pets
CREATE POLICY "Owners can delete activity logs for own pets" ON public.activity_logs
  FOR DELETE USING (public.is_pet_owner(pet_id));

-- ==============================================
-- FAVORITES TABLE RLS POLICIES
-- ==============================================

-- Allow users to read their own favorites
CREATE POLICY "Users can read own favorites" ON public.favorites
  FOR SELECT USING (user_id = auth.uid());

-- Allow users to insert their own favorites
CREATE POLICY "Users can insert own favorites" ON public.favorites
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow users to update their own favorites
CREATE POLICY "Users can update own favorites" ON public.favorites
  FOR UPDATE USING (user_id = auth.uid());

-- Allow users to delete their own favorites
CREATE POLICY "Users can delete own favorites" ON public.favorites
  FOR DELETE USING (user_id = auth.uid());

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
-- SYSTEM TABLES (ADMIN ONLY)
-- ==============================================

-- Users table - only admin access
CREATE POLICY "Only admins can read users" ON public.users
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update users" ON public.users
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Roles table - only admin access
CREATE POLICY "Only admins can read roles" ON public.roles
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update roles" ON public.roles
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Settings table - only admin access
CREATE POLICY "Only admins can read settings" ON public.settings
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update settings" ON public.settings
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Content table - admin access for all, creators for their own
CREATE POLICY "Anyone can read published content" ON public.content
  FOR SELECT USING (status = 'published');

CREATE POLICY "Creators can read own content" ON public.content
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Creators can insert own content" ON public.content
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Creators can update own content" ON public.content
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Only admins can review content" ON public.content
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Audit logs - admin only
CREATE POLICY "Only admins can read audit logs" ON public.audit_logs
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- User sessions - users can only access their own
CREATE POLICY "Users can read own sessions" ON public.user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions" ON public.user_sessions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions" ON public.user_sessions
  FOR DELETE USING (user_id = auth.uid());

-- Mail queue - admin only
CREATE POLICY "Only admins can read mail queue" ON public.mail_queue
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update mail queue" ON public.mail_queue
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Shared links - users can read their own, anyone can read public shares
CREATE POLICY "Users can read own shared links" ON public.shared_links
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Anyone can read public shared links" ON public.shared_links
  FOR SELECT USING (is_active = true AND expires_at > now());

CREATE POLICY "Users can insert own shared links" ON public.shared_links
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update own shared links" ON public.shared_links
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Users can delete own shared links" ON public.shared_links
  FOR DELETE USING (profile_id = auth.uid());

-- ==============================================
-- PERFORMANCE INDEXES
-- ==============================================

-- Create indexes to improve RLS policy performance
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON public.pets(user_id);
CREATE INDEX IF NOT EXISTS idx_co_owners_co_owner_id ON public.co_owners(co_owner_id);
CREATE INDEX IF NOT EXISTS idx_co_owners_main_owner_id ON public.co_owners(main_owner_id);
CREATE INDEX IF NOT EXISTS idx_co_owners_pet_id ON public.co_owners(pet_id);
CREATE INDEX IF NOT EXISTS idx_co_owners_status ON public.co_owners(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor_id ON public.activity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_owner_id ON public.activity_logs(owner_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_pet_id ON public.activity_logs(pet_id);

-- Composite indexes for better performance
CREATE INDEX IF NOT EXISTS idx_co_owners_composite ON public.co_owners(co_owner_id, pet_id, status);
CREATE INDEX IF NOT EXISTS idx_pets_composite ON public.pets(user_id, id);

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

-- Grant SELECT permissions to authenticated role for their data
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.pets TO authenticated;
GRANT SELECT ON public.veterinarians TO authenticated;
GRANT SELECT ON public.allergies TO authenticated;
GRANT SELECT ON public.behavior_tags TO authenticated;
GRANT SELECT ON public.medical_history TO authenticated;
GRANT SELECT ON public.food TO authenticated;
GRANT SELECT ON public.care_notes TO authenticated;
GRANT SELECT ON public.vaccinations TO authenticated;
GRANT SELECT ON public.treatments TO authenticated;
GRANT SELECT ON public.weight_entries TO authenticated;
GRANT SELECT ON public.notifications TO authenticated;
GRANT SELECT ON public.co_owners TO authenticated;
GRANT SELECT ON public.documents TO authenticated;
GRANT SELECT ON public.medical_visits TO authenticated;
GRANT SELECT ON public.conditions TO authenticated;
GRANT SELECT ON public.medications TO authenticated;
GRANT SELECT ON public.public_shares TO authenticated;
GRANT SELECT ON public.pet_photos TO authenticated;
GRANT SELECT ON public.health_metrics TO authenticated;
GRANT SELECT ON public.activity_logs TO authenticated;
GRANT SELECT ON public.favorites TO authenticated;
GRANT SELECT ON public.user_sessions TO authenticated;
GRANT SELECT ON public.shared_links TO authenticated;

-- Grant INSERT permissions to authenticated role
GRANT INSERT ON public.profiles TO authenticated;
GRANT INSERT ON public.pets TO authenticated;
GRANT INSERT ON public.veterinarians TO authenticated;
GRANT INSERT ON public.allergies TO authenticated;
GRANT INSERT ON public.behavior_tags TO authenticated;
GRANT INSERT ON public.medical_history TO authenticated;
GRANT INSERT ON public.food TO authenticated;
GRANT INSERT ON public.care_notes TO authenticated;
GRANT INSERT ON public.vaccinations TO authenticated;
GRANT INSERT ON public.treatments TO authenticated;
GRANT INSERT ON public.weight_entries TO authenticated;
GRANT INSERT ON public.notifications TO authenticated;
GRANT INSERT ON public.co_owners TO authenticated;
GRANT INSERT ON public.documents TO authenticated;
GRANT INSERT ON public.medical_visits TO authenticated;
GRANT INSERT ON public.conditions TO authenticated;
GRANT INSERT ON public.medications TO authenticated;
GRANT INSERT ON public.public_shares TO authenticated;
GRANT INSERT ON public.pet_photos TO authenticated;
GRANT INSERT ON public.health_metrics TO authenticated;
GRANT INSERT ON public.activity_logs TO authenticated;
GRANT INSERT ON public.favorites TO authenticated;
GRANT INSERT ON public.user_sessions TO authenticated;
GRANT INSERT ON public.shared_links TO authenticated;

-- Grant UPDATE permissions to authenticated role
GRANT UPDATE ON public.profiles TO authenticated;
GRANT UPDATE ON public.pets TO authenticated;
GRANT UPDATE ON public.veterinarians TO authenticated;
GRANT UPDATE ON public.allergies TO authenticated;
GRANT UPDATE ON public.behavior_tags TO authenticated;
GRANT UPDATE ON public.medical_history TO authenticated;
GRANT UPDATE ON public.food TO authenticated;
GRANT UPDATE ON public.care_notes TO authenticated;
GRANT UPDATE ON public.vaccinations TO authenticated;
GRANT UPDATE ON public.treatments TO authenticated;
GRANT UPDATE ON public.weight_entries TO authenticated;
GRANT UPDATE ON public.notifications TO authenticated;
GRANT UPDATE ON public.co_owners TO authenticated;
GRANT UPDATE ON public.documents TO authenticated;
GRANT UPDATE ON public.medical_visits TO authenticated;
GRANT UPDATE ON public.conditions TO authenticated;
GRANT UPDATE ON public.medications TO authenticated;
GRANT UPDATE ON public.public_shares TO authenticated;
GRANT UPDATE ON public.pet_photos TO authenticated;
GRANT UPDATE ON public.health_metrics TO authenticated;
GRANT UPDATE ON public.activity_logs TO authenticated;
GRANT UPDATE ON public.favorites TO authenticated;
GRANT UPDATE ON public.user_sessions TO authenticated;
GRANT UPDATE ON public.shared_links TO authenticated;

-- Grant DELETE permissions to authenticated role
GRANT DELETE ON public.profiles TO authenticated;
GRANT DELETE ON public.pets TO authenticated;
GRANT DELETE ON public.veterinarians TO authenticated;
GRANT DELETE ON public.allergies TO authenticated;
GRANT DELETE ON public.behavior_tags TO authenticated;
GRANT DELETE ON public.medical_history TO authenticated;
GRANT DELETE ON public.food TO authenticated;
GRANT DELETE ON public.care_notes TO authenticated;
GRANT DELETE ON public.vaccinations TO authenticated;
GRANT DELETE ON public.treatments TO authenticated;
GRANT DELETE ON public.weight_entries TO authenticated;
GRANT DELETE ON public.notifications TO authenticated;
GRANT DELETE ON public.co_owners TO authenticated;
GRANT DELETE ON public.documents TO authenticated;
GRANT DELETE ON public.medical_visits TO authenticated;
GRANT DELETE ON public.conditions TO authenticated;
GRANT DELETE ON public.medications TO authenticated;
GRANT DELETE ON public.public_shares TO authenticated;
GRANT DELETE ON public.pet_photos TO authenticated;
GRANT DELETE ON public.health_metrics TO authenticated;
GRANT DELETE ON public.activity_logs TO authenticated;
GRANT DELETE ON public.favorites TO authenticated;
GRANT DELETE ON public.user_sessions TO authenticated;
GRANT DELETE ON public.shared_links TO authenticated;

-- Grant admin permissions (admin role only)
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.roles TO authenticated;
GRANT ALL ON public.settings TO authenticated;
GRANT ALL ON public.content TO authenticated;
GRANT ALL ON public.audit_logs TO authenticated;
GRANT ALL ON public.mail_queue TO authenticated;

-- Revoke public permissions to ensure RLS is enforced
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;

-- Re-grant necessary permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;