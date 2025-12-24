-- 1. Update co_owners table for Granular Permissions & Expiration & QR Support
ALTER TABLE co_owners 
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"scope": "all", "access_level": "editor", "pet_ids": []}'::jsonb,
ADD COLUMN IF NOT EXISTS valid_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS invite_token TEXT UNIQUE;

-- 2. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES auth.users(id) NOT NULL, -- Who did the action
  owner_id UUID REFERENCES auth.users(id) NOT NULL, -- Who owns the resource (usually main_owner)
  pet_id UUID REFERENCES pets(id), -- Optional, if specific to a pet
  action_type TEXT NOT NULL, -- e.g., 'added_vaccination', 'updated_profile'
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster querying logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_owner_id ON activity_logs(owner_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_pet_id ON activity_logs(pet_id);

-- 3. RLS for Activity Logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Owner can view logs for their pets/account
CREATE POLICY "Owners can view logs" ON activity_logs
  FOR SELECT USING (auth.uid() = owner_id);

-- Co-owners can view logs if they have access (simplified for now, refined later)
CREATE POLICY "Co-owners can view logs" ON activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM co_owners 
      WHERE main_owner_id = activity_logs.owner_id 
      AND co_owner_id = auth.uid()
      AND status = 'accepted'
    )
  );

-- System/Triggers will insert logs, but allow authenticated users to insert (e.g. from client actions if needed, though mostly server-side preferred)
-- For now, let's allow insert if actor_id matches auth.uid()
CREATE POLICY "Users can insert logs" ON activity_logs
  FOR INSERT WITH CHECK (auth.uid() = actor_id);

-- 4. Helper Function to Check Access (Crucial for RLS)
-- Checks if a user has access to a specific pet
CREATE OR REPLACE FUNCTION has_pet_access(target_pet_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  pet_owner_id uuid;
  caller_id uuid;
BEGIN
  caller_id := auth.uid();
  
  -- 1. Get Pet Owner
  SELECT owner_id INTO pet_owner_id FROM pets WHERE id = target_pet_id;
  
  -- If pet doesn't exist, return false (or true to let RLS handle "not found"?)
  IF pet_owner_id IS NULL THEN RETURN false; END IF;

  -- 2. If caller is owner, YES
  IF pet_owner_id = caller_id THEN RETURN true; END IF;

  -- 3. Check Co-Owner Permissions
  -- Needs to be:
  -- a) Accepted status
  -- b) Not expired (valid_until is null OR > now)
  -- c) Scope is 'all' OR pet_id is in permissions->pet_ids
  RETURN EXISTS (
    SELECT 1 FROM co_owners
    WHERE main_owner_id = pet_owner_id
    AND co_owner_id = caller_id
    AND status = 'accepted'
    AND (valid_until IS NULL OR valid_until > NOW())
    AND (
      (permissions->>'scope' = 'all')
      OR
      (permissions->'pet_ids' @> to_jsonb(target_pet_id::text))
    )
  );
END;
$$;
