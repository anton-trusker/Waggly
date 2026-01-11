-- Add missing columns to pets table
-- This fixes the bug where pet creation fails due to missing microchip_implantation_date column
-- and the activity feed error due to missing photo_url column

-- Add microchip_implantation_date column
ALTER TABLE public.pets 
ADD COLUMN IF NOT EXISTS microchip_implantation_date DATE;

-- Add photo_url column (alias for avatar_url if needed)
-- Note: We already have avatar_url, but the activity feed query references photo_url
ALTER TABLE public.pets 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create a trigger to sync photo_url with avatar_url for backward compatibility
CREATE OR REPLACE FUNCTION sync_pet_photo_url()
RETURNS TRIGGER AS $$
BEGIN
  -- If photo_url is updated, sync to avatar_url
  IF NEW.photo_url IS DISTINCT FROM OLD.photo_url THEN
    NEW.avatar_url := NEW.photo_url;
  END IF;
  
  -- If avatar_url is updated, sync to photo_url
  IF NEW.avatar_url IS DISTINCT FROM OLD.avatar_url THEN
    NEW.photo_url := NEW.avatar_url;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS sync_pet_photo_url_trigger ON public.pets;
CREATE TRIGGER sync_pet_photo_url_trigger
  BEFORE UPDATE ON public.pets
  FOR EACH ROW
  EXECUTE FUNCTION sync_pet_photo_url();

-- Sync existing data
UPDATE public.pets SET photo_url = avatar_url WHERE photo_url IS NULL AND avatar_url IS NOT NULL;
UPDATE public.pets SET avatar_url = photo_url WHERE avatar_url IS NULL AND photo_url IS NOT NULL;
