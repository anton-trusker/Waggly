-- Add sterilization_date to pets table
ALTER TABLE pets ADD COLUMN IF NOT EXISTS sterilization_date DATE;
