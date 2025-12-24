-- Fix missing related_type column in notifications
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS related_type TEXT;

-- Update notification type check constraint (ensure all types are covered)
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
  CHECK (type IN ('vaccination', 'treatment', 'vet_visit', 'co_owner_invite', 'co_owner_request', 'co_owner_accepted', 'co_owner_declined'));

-- Trigger to link pending invites when a new user signs up
CREATE OR REPLACE FUNCTION link_pending_co_owner_invites()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Update pending co_owner records where email matches the new user
  UPDATE co_owners
  SET co_owner_id = NEW.id
  WHERE co_owner_email = NEW.email
  AND co_owner_id IS NULL;

  -- 2. Create notifications for these linked invites
  INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
  SELECT 
    NEW.id,
    'co_owner_invite',
    'New Co-Owner Invite',
    'You have a pending invite to co-manage pets.',
    id,
    'co_owners'
  FROM co_owners
  WHERE co_owner_email = NEW.email
  AND status = 'pending';

  RETURN NEW;
END;
$$;

-- Apply Trigger on auth.users (creation)
-- Note: In Supabase/Postgres, we can't always trigger directly on auth.users from client migrations easily depending on permissions,
-- but usually it is allowed if running as postgres/service_role.
-- However, standard practice often uses public.profiles insertion if auth.users is locked down, 
-- but public.profiles is created via trigger from auth.users usually.
-- Let's try to attach it to public.profiles insertion since that is where we usually hook into "user created".
-- Or better, if we have a handle_new_user trigger already, we can append to it.
-- Let's stick to a separate trigger on public.profiles for safety and simplicity in this context.

DROP TRIGGER IF EXISTS on_profile_created_link_invites ON profiles;
CREATE TRIGGER on_profile_created_link_invites
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION link_pending_co_owner_invites();

-- Update the link_pending_co_owner_invites function to use NEW.user_id instead of NEW.id if triggered from profiles
CREATE OR REPLACE FUNCTION link_pending_co_owner_invites()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email text;
BEGIN
  -- Get email from auth.users since profiles might not have it or it might be different
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;

  IF user_email IS NOT NULL THEN
      -- 1. Update pending co_owner records
      UPDATE co_owners
      SET co_owner_id = NEW.user_id
      WHERE co_owner_email = user_email
      AND co_owner_id IS NULL;

      -- 2. Create notifications
      INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
      SELECT 
        NEW.user_id,
        'co_owner_invite',
        'New Co-Owner Invite',
        'You have a pending invite to co-manage pets.',
        id,
        'co_owners'
      FROM co_owners
      WHERE co_owner_email = user_email
      AND status = 'pending';
  END IF;

  RETURN NEW;
END;
$$;
