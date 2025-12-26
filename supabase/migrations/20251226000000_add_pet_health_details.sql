-- Add height and microchip implantation date to pets table
ALTER TABLE pets ADD COLUMN IF NOT EXISTS height DECIMAL(5,2);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS microchip_implantation_date DATE;
