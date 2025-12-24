-- Add address and location fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS location_lat double precision,
ADD COLUMN IF NOT EXISTS location_lng double precision,
ADD COLUMN IF NOT EXISTS place_id text;

-- Add location details to events table
ALTER TABLE events
ADD COLUMN IF NOT EXISTS location_lat double precision,
ADD COLUMN IF NOT EXISTS location_lng double precision,
ADD COLUMN IF NOT EXISTS place_id text;
