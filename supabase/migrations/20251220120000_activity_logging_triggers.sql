-- Implement Activity Logging Triggers

-- 1. Function to Log Activities
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_pet_id uuid;
  pet_owner_id uuid;
  action_name text;
  actor uuid;
  details jsonb;
BEGIN
  actor := auth.uid();
  -- If system action or no auth user, skip or use a system ID? 
  -- For now, if no auth.uid(), we skip logging (or it's a system event handled elsewhere).
  IF actor IS NULL THEN RETURN NEW; END IF;

  -- Determine Table and ID
  IF TG_TABLE_NAME = 'pets' THEN
     target_pet_id := NEW.id;
     IF TG_OP = 'DELETE' THEN target_pet_id := OLD.id; END IF;
  ELSE
     -- For related tables, assume pet_id column exists
     IF TG_OP = 'DELETE' THEN
        target_pet_id := OLD.pet_id;
     ELSE
        target_pet_id := NEW.pet_id;
     END IF;
  END IF;

  -- Get Owner ID
  SELECT user_id INTO pet_owner_id FROM pets WHERE id = target_pet_id;
  
  -- If pet deleted, owner might not be found easily if we don't have it.
  -- But for DELETE on child tables, pet should still exist.
  -- For DELETE on pets, we use OLD.user_id.
  IF TG_TABLE_NAME = 'pets' AND TG_OP = 'DELETE' THEN
     pet_owner_id := OLD.user_id;
  END IF;

  IF pet_owner_id IS NULL THEN RETURN NEW; END IF;

  -- Construct Action Name
  action_name := TG_OP || '_' || TG_TABLE_NAME; -- e.g., INSERT_vaccinations
  
  -- Construct Details
  IF TG_OP = 'INSERT' THEN
     details := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
     details := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
  ELSE
     details := to_jsonb(OLD);
  END IF;

  -- Insert Log
  INSERT INTO activity_logs (actor_id, owner_id, pet_id, action_type, details)
  VALUES (actor, pet_owner_id, target_pet_id, lower(action_name), details);

  RETURN NEW;
END;
$$;

-- 2. Apply Triggers to relevant tables
-- Pets
DROP TRIGGER IF EXISTS log_pets_activity ON pets;
CREATE TRIGGER log_pets_activity
  AFTER INSERT OR UPDATE OR DELETE ON pets
  FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Vaccinations
DROP TRIGGER IF EXISTS log_vaccinations_activity ON vaccinations;
CREATE TRIGGER log_vaccinations_activity
  AFTER INSERT OR UPDATE OR DELETE ON vaccinations
  FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Treatments
DROP TRIGGER IF EXISTS log_treatments_activity ON treatments;
CREATE TRIGGER log_treatments_activity
  AFTER INSERT OR UPDATE OR DELETE ON treatments
  FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Medical Visits
DROP TRIGGER IF EXISTS log_medical_visits_activity ON medical_visits;
CREATE TRIGGER log_medical_visits_activity
  AFTER INSERT OR UPDATE OR DELETE ON medical_visits
  FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Events
DROP TRIGGER IF EXISTS log_events_activity ON events;
CREATE TRIGGER log_events_activity
  AFTER INSERT OR UPDATE OR DELETE ON events
  FOR EACH ROW EXECUTE FUNCTION log_activity();
