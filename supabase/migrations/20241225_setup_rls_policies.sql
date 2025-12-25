-- Set up comprehensive RLS policies for all tables to allow authenticated users to access their data

-- Pets table - users can access their own pets and pets they co-own
CREATE POLICY "Users can view their own pets" ON pets
    FOR SELECT
    USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = pets.user_id 
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can insert their own pets" ON pets
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own pets" ON pets
    FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own pets" ON pets
    FOR DELETE
    USING (user_id = auth.uid());

-- Events table - users can access events for their pets
CREATE POLICY "Users can view events for their pets" ON events
    FOR SELECT
    USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = events.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = events.user_id 
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can insert events for their pets" ON events
    FOR INSERT
    WITH CHECK (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = events.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own events" ON events
    FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own events" ON events
    FOR DELETE
    USING (user_id = auth.uid());

-- Pet photos table - users can access photos for their pets
CREATE POLICY "Users can view photos for their pets" ON pet_photos
    FOR SELECT
    USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = pet_photos.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = pet_photos.user_id 
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can insert photos for their pets" ON pet_photos
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own photos" ON pet_photos
    FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own photos" ON pet_photos
    FOR DELETE
    USING (user_id = auth.uid());

-- Vaccinations table - users can access vaccinations for their pets
CREATE POLICY "Users can view vaccinations for their pets" ON vaccinations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = vaccinations.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = (
                SELECT user_id FROM pets WHERE pets.id = vaccinations.pet_id
            )
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can manage vaccinations for their pets" ON vaccinations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = vaccinations.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

-- Treatments table - users can access treatments for their pets
CREATE POLICY "Users can view treatments for their pets" ON treatments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = treatments.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = (
                SELECT user_id FROM pets WHERE pets.id = treatments.pet_id
            )
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can manage treatments for their pets" ON treatments
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = treatments.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

-- Medical visits table - users can access medical visits for their pets
CREATE POLICY "Users can view medical visits for their pets" ON medical_visits
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = medical_visits.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = (
                SELECT user_id FROM pets WHERE pets.id = medical_visits.pet_id
            )
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can manage medical visits for their pets" ON medical_visits
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = medical_visits.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

-- Documents table - users can access documents for their pets
CREATE POLICY "Users can view documents for their pets" ON documents
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = documents.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = (
                SELECT user_id FROM pets WHERE pets.id = documents.pet_id
            )
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can manage documents for their pets" ON documents
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = documents.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

-- Weight entries table - users can access weight entries for their pets
CREATE POLICY "Users can view weight entries for their pets" ON weight_entries
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = weight_entries.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = (
                SELECT user_id FROM pets WHERE pets.id = weight_entries.pet_id
            )
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can manage weight entries for their pets" ON weight_entries
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = weight_entries.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

-- Conditions table - users can access conditions for their pets
CREATE POLICY "Users can view conditions for their pets" ON conditions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = conditions.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = (
                SELECT user_id FROM pets WHERE pets.id = conditions.pet_id
            )
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can manage conditions for their pets" ON conditions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = conditions.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

-- Allergies table - users can access allergies for their pets
CREATE POLICY "Users can view allergies for their pets" ON allergies
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = allergies.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = (
                SELECT user_id FROM pets WHERE pets.id = allergies.pet_id
            )
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can manage allergies for their pets" ON allergies
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = allergies.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

-- Food table - users can access food information for their pets
CREATE POLICY "Users can view food for their pets" ON food
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = food.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = (
                SELECT user_id FROM pets WHERE pets.id = food.pet_id
            )
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can manage food for their pets" ON food
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = food.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

-- Care notes table - users can access care notes for their pets
CREATE POLICY "Users can view care notes for their pets" ON care_notes
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = care_notes.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = (
                SELECT user_id FROM pets WHERE pets.id = care_notes.pet_id
            )
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can manage care notes for their pets" ON care_notes
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = care_notes.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

-- Behavior tags table - users can access behavior tags for their pets
CREATE POLICY "Users can view behavior tags for their pets" ON behavior_tags
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = behavior_tags.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = (
                SELECT user_id FROM pets WHERE pets.id = behavior_tags.pet_id
            )
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can manage behavior tags for their pets" ON behavior_tags
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = behavior_tags.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

-- Medical history table - users can access medical history for their pets
CREATE POLICY "Users can view medical history for their pets" ON medical_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = medical_history.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = (
                SELECT user_id FROM pets WHERE pets.id = medical_history.pet_id
            )
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can manage medical history for their pets" ON medical_history
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = medical_history.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

-- Veterinarians table - users can access veterinarians for their pets
CREATE POLICY "Users can view veterinarians for their pets" ON veterinarians
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = veterinarians.pet_id 
            AND pets.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM co_owners 
            WHERE co_owner_id = auth.uid() 
            AND main_owner_id = (
                SELECT user_id FROM pets WHERE pets.id = veterinarians.pet_id
            )
            AND status = 'accepted'
        )
    );

CREATE POLICY "Users can manage veterinarians for their pets" ON veterinarians
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM pets 
            WHERE pets.id = veterinarians.pet_id 
            AND pets.user_id = auth.uid()
        )
    );

-- Co-owners table - users can manage co-ownership for their pets
CREATE POLICY "Users can view their co-ownerships" ON co_owners
    FOR SELECT
    USING (
        main_owner_id = auth.uid() OR 
        co_owner_id = auth.uid() OR
        created_by = auth.uid()
    );

CREATE POLICY "Users can manage co-ownerships for their pets" ON co_owners
    FOR ALL
    USING (
        main_owner_id = auth.uid() OR 
        created_by = auth.uid()
    );

-- Notifications table - users can access their own notifications
CREATE POLICY "Users can view their notifications" ON notifications
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can manage their notifications" ON notifications
    FOR ALL
    USING (user_id = auth.uid());

-- Profiles table - users can access their own profile
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT
    USING (
        user_id = auth.uid() OR 
        id = auth.uid()
    );

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE
    USING (
        user_id = auth.uid() OR 
        id = auth.uid()
    );

-- Reference tables - allow read access to authenticated users
CREATE POLICY "Authenticated users can view breeds" ON breeds
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view reference vaccinations" ON reference_vaccinations
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view reference treatments" ON reference_treatments
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view reference breeds" ON reference_breeds
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view translations" ON translations
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Settings table - allow read access to authenticated users
CREATE POLICY "Authenticated users can view settings" ON settings
    FOR SELECT
    USING (auth.uid() IS NOT NULL);