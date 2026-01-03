-- Fix handle_new_user trigger to remove dependence on redundant user_id column

-- 1. Drop user_id column from profiles if it exists (it's redundant as id is the FK to auth.users)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_id;

-- 2. Update the trigger function to insert without user_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1), ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', split_part(NEW.raw_user_meta_data->>'full_name', ' ', 2), ''),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), profiles.first_name),
    last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), profiles.last_name),
    email = EXCLUDED.email;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
