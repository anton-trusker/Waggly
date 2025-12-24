-- 1. Update notifications table to be more flexible
ALTER TABLE notifications ALTER COLUMN pet_id DROP NOT NULL;

-- Update notification type check constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
  CHECK (type IN ('vaccination', 'treatment', 'vet_visit', 'co_owner_invite', 'co_owner_request', 'co_owner_accepted', 'co_owner_declined'));

-- 2. Update co_owners table
ALTER TABLE co_owners ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Update status check constraint
ALTER TABLE co_owners DROP CONSTRAINT IF EXISTS co_owners_status_check;
ALTER TABLE co_owners ADD CONSTRAINT co_owners_status_check 
  CHECK (status IN ('pending', 'accepted', 'requested', 'declined'));

-- 3. Create Mail Queue Table (for email simulation)
CREATE TABLE IF NOT EXISTS mail_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, sent, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Secure Function to lookup user ID by email
CREATE OR REPLACE FUNCTION get_user_id_by_email(email_addr text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_id uuid;
BEGIN
  SELECT id INTO target_id FROM auth.users WHERE email = email_addr;
  RETURN target_id;
END;
$$;

-- 5. Function to Request Co-ownership
CREATE OR REPLACE FUNCTION request_co_ownership(owner_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_owner_id uuid;
  requester_id uuid;
  requester_email text;
BEGIN
  requester_id := auth.uid();
  requester_email := auth.jwt() ->> 'email';
  
  -- Find the owner
  target_owner_id := get_user_id_by_email(owner_email);
  
  IF target_owner_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'User not found');
  END IF;
  
  IF target_owner_id = requester_id THEN
    RETURN json_build_object('success', false, 'message', 'You cannot request co-ownership from yourself');
  END IF;

  -- Check if already exists
  IF EXISTS (SELECT 1 FROM co_owners WHERE main_owner_id = target_owner_id AND co_owner_email = requester_email) THEN
    RETURN json_build_object('success', false, 'message', 'Co-ownership relation already exists');
  END IF;

  -- Insert Request
  INSERT INTO co_owners (main_owner_id, co_owner_id, co_owner_email, status, created_by)
  VALUES (target_owner_id, requester_id, requester_email, 'requested', requester_id);
  
  RETURN json_build_object('success', true);
END;
$$;

-- 6. Trigger Function to Handle Notifications and Emails
CREATE OR REPLACE FUNCTION handle_co_owner_events()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sender_name text;
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
       
       -- Queue Email (We need owner's email, but we don't have it easily here without lookup, let's skip email or do complex lookup)
       -- Skipping owner email for now to keep it simple, notification is enough.
    END IF;

  -- Handle UPDATE
  ELSIF (TG_OP = 'UPDATE') THEN
    
    -- Case 3: Accepted
    IF OLD.status != 'accepted' AND NEW.status = 'accepted' THEN
      
      -- If it was an Invite (created by main_owner), notify main_owner that co_owner accepted
      IF NEW.created_by = NEW.main_owner_id OR NEW.created_by IS NULL THEN
         INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
         VALUES (NEW.main_owner_id, 'co_owner_accepted', 'Invite Accepted', 'Your co-owner invite was accepted.', NEW.id, 'co_owners');
      
      -- If it was a Request (created by co_owner), notify co_owner that main_owner accepted
      ELSE
         INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
         VALUES (NEW.co_owner_id, 'co_owner_accepted', 'Request Accepted', 'Your co-owner request was accepted.', NEW.id, 'co_owners');
      END IF;

    END IF;
    
  END IF;

  RETURN NEW;
END;
$$;

-- 7. Apply Trigger
DROP TRIGGER IF EXISTS on_co_owner_change ON co_owners;
CREATE TRIGGER on_co_owner_change
  AFTER INSERT OR UPDATE ON co_owners
  FOR EACH ROW EXECUTE FUNCTION handle_co_owner_events();

-- 8. Update Policies for "requested" status
DROP POLICY IF EXISTS "Users can manage their co-owners" ON co_owners;
CREATE POLICY "Users can manage their co-owners" ON co_owners
  FOR ALL USING (auth.uid() = main_owner_id);

DROP POLICY IF EXISTS "Co-owners can view their status" ON co_owners;
CREATE POLICY "Co-owners can view their status" ON co_owners
  FOR SELECT USING (auth.uid() = co_owner_id OR (auth.jwt() ->> 'email') = co_owner_email);

DROP POLICY IF EXISTS "Co-owners can update status" ON co_owners;
CREATE POLICY "Co-owners can update status" ON co_owners
  FOR UPDATE USING (auth.uid() = co_owner_id OR (auth.jwt() ->> 'email') = co_owner_email);

-- Allow authenticated users to create a request (insert where they are the co-owner)
DROP POLICY IF EXISTS "Users can request co-ownership" ON co_owners;
CREATE POLICY "Users can request co-ownership" ON co_owners
  FOR INSERT WITH CHECK (auth.uid() = co_owner_id);
