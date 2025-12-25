-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own pets" ON pets;
DROP POLICY IF EXISTS "Users can insert their own pets" ON pets;
DROP POLICY IF EXISTS "Users can update their own pets" ON pets;
DROP POLICY IF EXISTS "Users can delete their own pets" ON pets;

DROP POLICY IF EXISTS "Users can view events for their pets" ON events;
DROP POLICY IF EXISTS "Users can insert events for their pets" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

DROP POLICY IF EXISTS "Users can view photos for their pets" ON pet_photos;
DROP POLICY IF EXISTS "Users can insert photos for their pets" ON pet_photos;
DROP POLICY IF EXISTS "Users can update their own photos" ON pet_photos;
DROP POLICY IF EXISTS "Users can delete their own photos" ON pet_photos;

DROP POLICY IF EXISTS "Users can view vaccinations for their pets" ON vaccinations;
DROP POLICY IF EXISTS "Users can manage vaccinations for their pets" ON vaccinations;

DROP POLICY IF EXISTS "Users can view treatments for their pets" ON treatments;
DROP POLICY IF EXISTS "Users can manage treatments for their pets" ON treatments;

DROP POLICY IF EXISTS "Users can view medical visits for their pets" ON medical_visits;
DROP POLICY IF EXISTS "Users can manage medical visits for their pets" ON medical_visits;

DROP POLICY IF EXISTS "Users can view documents for their pets" ON documents;
DROP POLICY IF EXISTS "Users can manage documents for their pets" ON documents;

DROP POLICY IF EXISTS "Users can view weight entries for their pets" ON weight_entries;
DROP POLICY IF EXISTS "Users can manage weight entries for their pets" ON weight_entries;

DROP POLICY IF EXISTS "Users can view conditions for their pets" ON conditions;
DROP POLICY IF EXISTS "Users can manage conditions for their pets" ON conditions;

DROP POLICY IF EXISTS "Users can view allergies for their pets" ON allergies;
DROP POLICY IF EXISTS "Users can manage allergies for their pets" ON allergies;

DROP POLICY IF EXISTS "Users can view food for their pets" ON food;
DROP POLICY IF EXISTS "Users can manage food for their pets" ON food;

DROP POLICY IF EXISTS "Users can view care notes for their pets" ON care_notes;
DROP POLICY IF EXISTS "Users can manage care notes for their pets" ON care_notes;

DROP POLICY IF EXISTS "Users can view behavior tags for their pets" ON behavior_tags;
DROP POLICY IF EXISTS "Users can manage behavior tags for their pets" ON behavior_tags;

DROP POLICY IF EXISTS "Users can view medical history for their pets" ON medical_history;
DROP POLICY IF EXISTS "Users can manage medical history for their pets" ON medical_history;

DROP POLICY IF EXISTS "Users can view veterinarians for their pets" ON veterinarians;
DROP POLICY IF EXISTS "Users can manage veterinarians for their pets" ON veterinarians;

DROP POLICY IF EXISTS "Users can view their co-ownerships" ON co_owners;
DROP POLICY IF EXISTS "Users can manage co-ownerships for their pets" ON co_owners;

DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
DROP POLICY IF EXISTS "Users can manage their notifications" ON notifications;

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

DROP POLICY IF EXISTS "Authenticated users can view breeds" ON breeds;
DROP POLICY IF EXISTS "Authenticated users can view reference vaccinations" ON reference_vaccinations;
DROP POLICY IF EXISTS "Authenticated users can view reference treatments" ON reference_treatments;
DROP POLICY IF EXISTS "Authenticated users can view reference breeds" ON reference_breeds;
DROP POLICY IF EXISTS "Authenticated users can view translations" ON translations;
DROP POLICY IF EXISTS "Authenticated users can view settings" ON settings;

-- Grant basic permissions to anon and authenticated roles
GRANT SELECT ON pets TO anon;
GRANT SELECT ON pets TO authenticated;
GRANT INSERT, UPDATE, DELETE ON pets TO authenticated;

GRANT SELECT ON events TO anon;
GRANT SELECT ON events TO authenticated;
GRANT INSERT, UPDATE, DELETE ON events TO authenticated;

GRANT SELECT ON pet_photos TO anon;
GRANT SELECT ON pet_photos TO authenticated;
GRANT INSERT, UPDATE, DELETE ON pet_photos TO authenticated;

GRANT SELECT ON vaccinations TO anon;
GRANT SELECT ON vaccinations TO authenticated;
GRANT INSERT, UPDATE, DELETE ON vaccinations TO authenticated;

GRANT SELECT ON treatments TO anon;
GRANT SELECT ON treatments TO authenticated;
GRANT INSERT, UPDATE, DELETE ON treatments TO authenticated;

GRANT SELECT ON medical_visits TO anon;
GRANT SELECT ON medical_visits TO authenticated;
GRANT INSERT, UPDATE, DELETE ON medical_visits TO authenticated;

GRANT SELECT ON documents TO anon;
GRANT SELECT ON documents TO authenticated;
GRANT INSERT, UPDATE, DELETE ON documents TO authenticated;

GRANT SELECT ON weight_entries TO anon;
GRANT SELECT ON weight_entries TO authenticated;
GRANT INSERT, UPDATE, DELETE ON weight_entries TO authenticated;

GRANT SELECT ON conditions TO anon;
GRANT SELECT ON conditions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON conditions TO authenticated;

GRANT SELECT ON allergies TO anon;
GRANT SELECT ON allergies TO authenticated;
GRANT INSERT, UPDATE, DELETE ON allergies TO authenticated;

GRANT SELECT ON food TO anon;
GRANT SELECT ON food TO authenticated;
GRANT INSERT, UPDATE, DELETE ON food TO authenticated;

GRANT SELECT ON care_notes TO anon;
GRANT SELECT ON care_notes TO authenticated;
GRANT INSERT, UPDATE, DELETE ON care_notes TO authenticated;

GRANT SELECT ON behavior_tags TO anon;
GRANT SELECT ON behavior_tags TO authenticated;
GRANT INSERT, UPDATE, DELETE ON behavior_tags TO authenticated;

GRANT SELECT ON medical_history TO anon;
GRANT SELECT ON medical_history TO authenticated;
GRANT INSERT, UPDATE, DELETE ON medical_history TO authenticated;

GRANT SELECT ON veterinarians TO anon;
GRANT SELECT ON veterinarians TO authenticated;
GRANT INSERT, UPDATE, DELETE ON veterinarians TO authenticated;

GRANT SELECT ON co_owners TO anon;
GRANT SELECT ON co_owners TO authenticated;
GRANT INSERT, UPDATE, DELETE ON co_owners TO authenticated;

GRANT SELECT ON notifications TO anon;
GRANT SELECT ON notifications TO authenticated;
GRANT INSERT, UPDATE, DELETE ON notifications TO authenticated;

GRANT SELECT ON profiles TO anon;
GRANT SELECT ON profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON profiles TO authenticated;

GRANT SELECT ON breeds TO anon;
GRANT SELECT ON breeds TO authenticated;

GRANT SELECT ON reference_vaccinations TO anon;
GRANT SELECT ON reference_vaccinations TO authenticated;

GRANT SELECT ON reference_treatments TO anon;
GRANT SELECT ON reference_treatments TO authenticated;

GRANT SELECT ON reference_breeds TO anon;
GRANT SELECT ON reference_breeds TO authenticated;

GRANT SELECT ON translations TO anon;
GRANT SELECT ON translations TO authenticated;

GRANT SELECT ON settings TO anon;
GRANT SELECT ON settings TO authenticated;