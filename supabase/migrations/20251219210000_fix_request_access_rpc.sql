-- Fix RPC Function to Request Co-ownership
-- Ensure we handle case sensitivity and permissions correctly
CREATE OR REPLACE FUNCTION request_co_ownership(owner_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_owner_id uuid;
  requester_id uuid;
  requester_email text;
BEGIN
  requester_id := auth.uid();
  requester_email := auth.jwt() ->> 'email';
  
  -- Find the owner (Case Insensitive)
  -- Note: We can't use get_user_id_by_email directly if it expects exact match. 
  -- Let's do a direct query here to be safe with lower().
  SELECT id INTO target_owner_id 
  FROM auth.users 
  WHERE lower(email) = lower(owner_email);
  
  IF target_owner_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'User not found');
  END IF;
  
  IF target_owner_id = requester_id THEN
    RETURN json_build_object('success', false, 'message', 'You cannot request co-ownership from yourself');
  END IF;

  -- Check if already exists (Case Insensitive for email)
  IF EXISTS (
      SELECT 1 FROM co_owners 
      WHERE main_owner_id = target_owner_id 
      AND (co_owner_id = requester_id OR lower(co_owner_email) = lower(requester_email))
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Co-ownership relation already exists');
  END IF;

  -- Insert Request
  -- Explicitly set co_owner_id and co_owner_email
  INSERT INTO co_owners (main_owner_id, co_owner_id, co_owner_email, status, created_by)
  VALUES (target_owner_id, requester_id, requester_email, 'requested', requester_id);
  
  RETURN json_build_object('success', true);
END;
$$;
