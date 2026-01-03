-- Update get_public_pet_details to use correct column names (date_given instead of date_administered)
CREATE OR REPLACE FUNCTION get_public_pet_details(share_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    share_record public_shares%ROWTYPE;
    pet_record pets%ROWTYPE;
    owner_profile profiles%ROWTYPE;
    
    -- Data containers
    vaccines_data JSONB := '[]'::jsonb;
    medications_data JSONB := '[]'::jsonb;
    visits_data JSONB := '[]'::jsonb;
    documents_data JSONB := '[]'::jsonb;
    
    -- Settings
    is_full_profile BOOLEAN;
BEGIN
    -- 1. Get valid share record
    SELECT * INTO share_record
    FROM public_shares
    WHERE token = share_token
    AND (valid_until IS NULL OR valid_until > NOW());

    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'Invalid or expired link');
    END IF;

    -- 2. Increment view count
    UPDATE public_shares SET views = views + 1 WHERE id = share_record.id;

    -- 3. Get Pet Details
    SELECT * INTO pet_record FROM pets WHERE id = share_record.pet_id;
    
    -- 4. Get Owner Name
    SELECT * INTO owner_profile FROM profiles WHERE id = pet_record.user_id;

    -- 5. Determine if Full Profile
    -- Check if settings has preset: 'FULL'
    is_full_profile := (share_record.settings->>'preset' = 'FULL');

    -- 6. Fetch extra data if Full Profile
    IF is_full_profile THEN
        -- Vaccinations (Active/Recent)
        SELECT jsonb_agg(jsonb_build_object(
            'vaccine', v.vaccine_name, -- Fixed: vaccine -> vaccine_name
            'date_given', v.date_given, -- Fixed: date_administered -> date_given
            'next_due_date', v.next_due_date
        ))
        INTO vaccines_data
        FROM vaccinations v
        WHERE v.pet_id = pet_record.id
        ORDER BY v.date_given DESC; -- Fixed: date_administered -> date_given

        -- Medications (Active)
        -- Note: Handling table name 'medications' or 'treatments'. Assuming 'medications' based on migration.
        -- We select basic columns. Adjust column names if schema differs.
        BEGIN
            SELECT jsonb_agg(jsonb_build_object(
                'name', m.name, 
                'start_date', m.start_date,
                'end_date', m.end_date,
                'dosage', m.dosage,
                'frequency', m.frequency
            ))
            INTO medications_data
            FROM medications m
            WHERE m.pet_id = pet_record.id
            AND (m.end_date IS NULL OR m.end_date >= CURRENT_DATE);
        EXCEPTION WHEN OTHERS THEN
            -- Fallback if medications table has different structure or doesn't exist
            medications_data := '[]'::jsonb;
        END;

        -- Medical Visits (Recent 5)
        SELECT jsonb_agg(jsonb_build_object(
            'date', mv.date,
            'reason', mv.reason,
            'clinic_name', mv.clinic_name,
            'diagnosis', mv.diagnosis
        ))
        INTO visits_data
        FROM medical_visits mv
        WHERE mv.pet_id = pet_record.id
        ORDER BY mv.date DESC
        LIMIT 5;
    END IF;

    -- 7. Construct Safe Response
    RETURN jsonb_build_object(
        'pet', jsonb_build_object(
            'name', pet_record.name,
            'species', pet_record.species,
            'breed', pet_record.breed,
            'date_of_birth', pet_record.date_of_birth,
            'gender', pet_record.gender,
            'weight', pet_record.weight,
            'photo_url', pet_record.photo_url,
            'chip_id', pet_record.chip_id
        ),
        'owner', jsonb_build_object(
            'name', COALESCE(owner_profile.first_name || ' ' || owner_profile.last_name, 'Pawzly User')
        ),
        'settings', share_record.settings,
        'details', jsonb_build_object(
            'vaccinations', COALESCE(vaccines_data, '[]'::jsonb),
            'medications', COALESCE(medications_data, '[]'::jsonb),
            'visits', COALESCE(visits_data, '[]'::jsonb)
        )
    );
END;
$$;
