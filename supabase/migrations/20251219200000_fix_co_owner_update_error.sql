-- 1. Redefine handle_co_owner_events with search_path = public for security and robustness
CREATE OR REPLACE FUNCTION handle_co_owner_events()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recipient_id uuid;
BEGIN
  -- Handle INSERT
  IF (TG_OP = 'INSERT') THEN
    
    -- Case 1: Invite (Owner invites User)
    IF NEW.status = 'pending' THEN
       -- Check if user exists to notify via app
       recipient_id := get_user_id_by_email(NEW.co_owner_email);
       
       IF recipient_id IS NOT NULL THEN
         INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
         VALUES (recipient_id, 'co_owner_invite', 'New Co-Owner Invite', 'You have been invited to co-manage pets.', NEW.id, 'co_owners');
       END IF;
       
       -- Queue Email
       INSERT INTO mail_queue (to_email, subject, body)
       VALUES (NEW.co_owner_email, 'You have been invited!', 'You have been invited to co-manage pets on MyPawzly. Please open the app to accept.');
       
    -- Case 2: Request (User requests Owner)
    ELSIF NEW.status = 'requested' THEN
       -- Notify Main Owner
       INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
       VALUES (NEW.main_owner_id, 'co_owner_request', 'Co-Owner Request', 'Someone requested to co-manage your pets.', NEW.id, 'co_owners');
    END IF;

  -- Handle UPDATE
  ELSIF (TG_OP = 'UPDATE') THEN
    
    -- Case 3: Accepted
    IF OLD.status != 'accepted' AND NEW.status = 'accepted' THEN
      
      -- If it was an Invite (created by main_owner), notify main_owner that co_owner accepted
      -- Use IS NOT DISTINCT FROM to handle NULLs safely, or simple checks
      IF (NEW.created_by IS NULL OR NEW.created_by = NEW.main_owner_id) THEN
         INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
         VALUES (NEW.main_owner_id, 'co_owner_accepted', 'Invite Accepted', 'Your co-owner invite was accepted.', NEW.id, 'co_owners');
      
      -- If it was a Request (created by co_owner), notify co_owner that main_owner accepted
      ELSE
         -- If created_by is the co_owner, notify them. 
         -- Note: NEW.co_owner_id should be set by now.
         IF NEW.co_owner_id IS NOT NULL THEN
             INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
             VALUES (NEW.co_owner_id, 'co_owner_accepted', 'Request Accepted', 'Your co-owner request was accepted.', NEW.id, 'co_owners');
         END IF;
      END IF;

    END IF;
    
  END IF;

  RETURN NEW;
END;
$$;

-- 2. Update co_owners RLS policies to be case-insensitive and robust
DROP POLICY IF EXISTS "Co-owners can view their status" ON co_owners;
CREATE POLICY "Co-owners can view their status" ON co_owners
  FOR SELECT USING (
    auth.uid() = co_owner_id 
    OR lower(auth.jwt() ->> 'email') = lower(co_owner_email)
  );

DROP POLICY IF EXISTS "Co-owners can update status" ON co_owners;
CREATE POLICY "Co-owners can update status" ON co_owners
  FOR UPDATE USING (
    auth.uid() = co_owner_id 
    OR lower(auth.jwt() ->> 'email') = lower(co_owner_email)
  )
  WITH CHECK (
    auth.uid() = co_owner_id 
    OR lower(auth.jwt() ->> 'email') = lower(co_owner_email)
  );

-- 3. Ensure notifications type check is correct (re-apply to be safe)
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
  CHECK (type IN ('vaccination', 'treatment', 'vet_visit', 'co_owner_invite', 'co_owner_request', 'co_owner_accepted', 'co_owner_declined'));

-- 4. Grant permissions just in case (standard public access)
GRANT ALL ON co_owners TO authenticated;
GRANT ALL ON notifications TO authenticated;
