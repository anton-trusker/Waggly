-- Add location fields to vaccinations table
ALTER TABLE vaccinations
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS location_lat double precision,
ADD COLUMN IF NOT EXISTS location_lng double precision,
ADD COLUMN IF NOT EXISTS place_id text;
