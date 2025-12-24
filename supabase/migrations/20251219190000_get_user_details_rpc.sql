-- Function to get user details (email + profile) for a list of IDs
-- This is useful for displaying inviter information where we need the email as fallback
CREATE OR REPLACE FUNCTION get_user_details(user_ids uuid[])
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email::text,
    p.first_name,
    p.last_name
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.user_id = au.id
  WHERE au.id = ANY(user_ids);
END;
$$;
