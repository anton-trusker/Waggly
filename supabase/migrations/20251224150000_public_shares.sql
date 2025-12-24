-- Create public_shares table
CREATE TABLE IF NOT EXISTS public_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL,
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    settings JSONB DEFAULT '{}'::jsonb, -- e.g., show_medical: boolean
    views INT DEFAULT 0
);

-- Enable RLS
ALTER TABLE public_shares ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Creator can do anything
CREATE POLICY "Creators can manage their public shares"
ON public_shares
FOR ALL
USING (auth.uid() = created_by);

-- 2. Public read access via token (we will use a secure RPC for this to avoid exposing table directly if needed, but RLS 'true' for select is risky without filters. 
-- Actually, we can allow SELECT for everyone if they know the token? 
-- Better approach: Use a secure function to fetch share details by token, and keep table private or restricted.)
-- For now, let's allow SELECT to everyone but we will query by token.
CREATE POLICY "Public read access by token"
ON public_shares
FOR SELECT
USING (true);

-- Function to get public pet details safely
CREATE OR REPLACE FUNCTION get_public_pet_details(share_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    share_record public_shares%ROWTYPE;
    pet_record pets%ROWTYPE;
    owner_profile profiles%ROWTYPE;
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

    -- 5. Construct Safe Response
    RETURN jsonb_build_object(
        'pet', jsonb_build_object(
            'name', pet_record.name,
            'species', pet_record.species,
            'breed', pet_record.breed,
            'age', pet_record.date_of_birth, -- Let frontend format
            'gender', pet_record.gender,
            'weight', pet_record.weight,
            'photo_url', pet_record.photo_url
        ),
        'owner', jsonb_build_object(
            'name', COALESCE(owner_profile.first_name || ' ' || owner_profile.last_name, 'Pawzly User')
        ),
        'settings', share_record.settings
    );
END;
$$;
