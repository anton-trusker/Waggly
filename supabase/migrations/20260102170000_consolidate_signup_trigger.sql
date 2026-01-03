-- Consolidate signup logic into handle_new_user and remove fragile triggers

-- 1. Drop the trigger on profiles that links invites (if it exists)
DROP TRIGGER IF EXISTS on_profile_created_link_invites ON public.profiles;

-- 2. Drop the function used by that trigger (optional, but good for cleanup)
DROP FUNCTION IF EXISTS public.link_pending_co_owner_invites();

-- 3. Update handle_new_user to include the link invite logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- A. Insert Profile
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

  -- B. Link Pending Invites
  -- Update pending co_owner records where email matches
  UPDATE public.co_owners
  SET co_owner_id = NEW.id
  WHERE co_owner_email = NEW.email
  AND co_owner_id IS NULL;

  -- Create notifications for these linked invites
  -- We select from co_owners where we just updated (co_owner_id = NEW.id)
  INSERT INTO public.notifications (user_id, type, title, message, related_id, related_type)
  SELECT 
    NEW.id,
    'co_owner_invite',
    'New Co-Owner Invite',
    'You have a pending invite to co-manage pets.',
    id,
    'co_owners'
  FROM public.co_owners
  WHERE co_owner_email = NEW.email
  AND status = 'pending'
  AND co_owner_id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
