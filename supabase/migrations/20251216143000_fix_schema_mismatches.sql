-- Fix schema mismatches to align with code and types
-- This script handles renaming columns and adding missing columns if they don't exist.

--------------------------------------------------------------------------------
-- 1. Treatments
--------------------------------------------------------------------------------
-- Rename 'type' to 'treatment_name' if it exists and 'treatment_name' does not
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='treatments' AND column_name='type') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='treatments' AND column_name='treatment_name') THEN
    ALTER TABLE public.treatments RENAME COLUMN type TO treatment_name;
  END IF;
END $$;

-- Add 'category' if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='treatments' AND column_name='category') THEN
    ALTER TABLE public.treatments ADD COLUMN category TEXT NOT NULL DEFAULT 'preventive';
  END IF;
END $$;

--------------------------------------------------------------------------------
-- 2. Vaccinations
--------------------------------------------------------------------------------
-- Rename 'vaccine' to 'vaccine_name' if it exists and 'vaccine_name' does not
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vaccinations' AND column_name='vaccine') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vaccinations' AND column_name='vaccine_name') THEN
    ALTER TABLE public.vaccinations RENAME COLUMN vaccine TO vaccine_name;
  END IF;
END $$;

-- Add 'category' if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vaccinations' AND column_name='category') THEN
    ALTER TABLE public.vaccinations ADD COLUMN category TEXT NOT NULL DEFAULT 'core';
  END IF;
END $$;

--------------------------------------------------------------------------------
-- 3. Food
--------------------------------------------------------------------------------
-- Rename 'type' to 'food_type' if it exists and 'food_type' does not
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='food' AND column_name='type') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='food' AND column_name='food_type') THEN
    ALTER TABLE public.food RENAME COLUMN type TO food_type;
  END IF;
END $$;

-- Ensure 'brand' exists (if 'brand_or_product' exists, rename it)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='food' AND column_name='brand_or_product') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='food' AND column_name='brand') THEN
    ALTER TABLE public.food RENAME COLUMN brand_or_product TO brand;
  END IF;
END $$;

-- Ensure 'feeding_schedule' exists (if 'feeding_times' exists, rename/cast?)
-- The old schema had 'feeding_times TEXT[]', new has 'feeding_schedule TEXT'.
-- If 'feeding_times' exists, we might want to keep it or add 'feeding_schedule'.
-- Let's just add 'feeding_schedule' if missing.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='food' AND column_name='feeding_schedule') THEN
    ALTER TABLE public.food ADD COLUMN feeding_schedule TEXT;
  END IF;
END $$;

-- Ensure 'amount' exists (old schema had 'amount_per_meal')
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='food' AND column_name='amount_per_meal') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='food' AND column_name='amount') THEN
    ALTER TABLE public.food RENAME COLUMN amount_per_meal TO amount;
  END IF;
END $$;
