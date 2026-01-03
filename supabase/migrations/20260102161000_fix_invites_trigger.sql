-- Fix link_pending_co_owner_invites trigger function which was referencing the deleted user_id column
CREATE OR REPLACE FUNCTION link_pending_co_owner_invites()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email text;
BEGIN
  -- Use email from profile if available (since we added it), otherwise lookup from auth.users using NEW.id
  -- Note: NEW.id in profiles table corresponds to auth.users.id
  IF (to_jsonb(NEW) ? 'email') AND NEW.email IS NOT NULL THEN
    user_email := NEW.email;
  ELSE
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  END IF;

  IF user_email IS NOT NULL THEN
      -- 1. Update pending co_owner records
      UPDATE co_owners
      SET co_owner_id = NEW.id
      WHERE co_owner_email = user_email
      AND co_owner_id IS NULL;

      -- 2. Create notifications
      INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
      SELECT 
        NEW.id,
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
