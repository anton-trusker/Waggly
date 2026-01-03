-- Additional RLS Policies Migration
-- Covers remaining tables not included in core migration

-- ==============================================
-- BEHAVIOR_TAGS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on behavior_tags table
ALTER TABLE public.behavior_tags ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS on medical_history table
ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS on food table
ALTER TABLE public.food ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS on care_notes table
ALTER TABLE public.care_notes ENABLE ROW LEVEL SECURITY;

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
-- TREATMENTS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on treatments table
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS on weight_entries table
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;

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
-- PUBLIC_SHARES TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on public_shares table
ALTER TABLE public.public_shares ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS on pet_photos table
ALTER TABLE public.pet_photos ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS on health_metrics table
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS on activity_logs table
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS on favorites table
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

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
-- EVENTS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow users to read events for pets they own or co-own, or their own events
CREATE POLICY "Users can read accessible events" ON public.events
  FOR SELECT USING (
    user_id = auth.uid() OR 
    (pet_id IS NOT NULL AND public.has_pet_access(pet_id))
  );

-- Allow users to insert their own events
CREATE POLICY "Users can insert own events" ON public.events
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow users to update their own events
CREATE POLICY "Users can update own events" ON public.events
  FOR UPDATE USING (user_id = auth.uid());

-- Allow users to delete their own events
CREATE POLICY "Users can delete own events" ON public.events
  FOR DELETE USING (user_id = auth.uid());

-- ==============================================
-- SHARED_LINKS TABLE RLS POLICIES
-- ==============================================

-- Enable RLS on shared_links table
ALTER TABLE public.shared_links ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own shared links
CREATE POLICY "Users can read own shared links" ON public.shared_links
  FOR SELECT USING (profile_id = auth.uid());

-- Allow users to insert their own shared links
CREATE POLICY "Users can insert own shared links" ON public.shared_links
  FOR INSERT WITH CHECK (profile_id = auth.uid());

-- Allow users to update their own shared links
CREATE POLICY "Users can update own shared links" ON public.shared_links
  FOR UPDATE USING (profile_id = auth.uid());

-- Allow users to delete their own shared links
CREATE POLICY "Users can delete own shared links" ON public.shared_links
  FOR DELETE USING (profile_id = auth.uid());

-- ==============================================
-- GRANT PERMISSIONS FOR ADDITIONAL TABLES
-- ==============================================

-- Grant permissions for additional tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.behavior_tags TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.medical_history TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.food TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.care_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.treatments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weight_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.public_shares TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pet_photos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.health_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shared_links TO authenticated;