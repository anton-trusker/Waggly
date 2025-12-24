-- Create and seed reference tables for vaccinations and treatments

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------------------------------
-- 1. Reference Vaccinations
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reference_vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat')),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('core', 'non-core')),
  validity_months INTEGER DEFAULT 12,
  description TEXT,
  UNIQUE(species, name)
);

-- Enable RLS (Public Read)
ALTER TABLE public.reference_vaccinations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read reference_vaccinations" ON public.reference_vaccinations;
CREATE POLICY "Public can read reference_vaccinations" ON public.reference_vaccinations FOR SELECT USING (true);

-- Seed Data
INSERT INTO public.reference_vaccinations (species, name, category, validity_months, description) VALUES
-- Dogs - Core
('dog', 'Rabies (1-Year)', 'core', 12, 'Mandatory core vaccine against rabies virus.'),
('dog', 'Rabies (3-Year)', 'core', 36, 'Booster rabies vaccine valid for 3 years.'),
('dog', 'DHPP / DAPP (1-Year)', 'core', 12, 'Distemper, Hepatitis, Parvovirus, Parainfluenza.'),
('dog', 'DHPP / DAPP (3-Year)', 'core', 36, 'Booster DHPP vaccine valid for 3 years.'),
-- Dogs - Non-Core
('dog', 'Bordetella (Kennel Cough)', 'non-core', 6, 'Recommended for social dogs (boarding, daycare). Often 6-12 months.'),
('dog', 'Leptospirosis', 'non-core', 12, 'Protects against bacteria found in soil and water.'),
('dog', 'Lyme Disease', 'non-core', 12, 'Recommended in tick-endemic areas.'),
('dog', 'Canine Influenza (H3N2/H3N8)', 'non-core', 12, 'Flu vaccine for at-risk dogs.'),
('dog', 'Rattlesnake Vaccine', 'non-core', 12, 'Reduces severity of bites, regional availability.'),

-- Cats - Core
('cat', 'Rabies (1-Year)', 'core', 12, 'Mandatory core vaccine against rabies virus.'),
('cat', 'Rabies (3-Year)', 'core', 36, 'Booster rabies vaccine valid for 3 years.'),
('cat', 'FVRCP (1-Year)', 'core', 12, 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia.'),
('cat', 'FVRCP (3-Year)', 'core', 36, 'Booster FVRCP vaccine valid for 3 years.'),
-- Cats - Non-Core
('cat', 'FeLV (Feline Leukemia)', 'non-core', 12, 'Highly recommended for outdoor cats.'),
('cat', 'FIV (Feline Immunodeficiency)', 'non-core', 12, 'Less common, discuss with vet.'),
('cat', 'Bordetella', 'non-core', 12, 'For cats in high-density environments.'),
('cat', 'Chlamydia', 'non-core', 12, 'Part of some combo vaccines, for upper respiratory issues.')
ON CONFLICT (species, name) DO UPDATE SET 
validity_months = EXCLUDED.validity_months,
category = EXCLUDED.category,
description = EXCLUDED.description;

--------------------------------------------------------------------------------
-- 2. Reference Treatments
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reference_treatments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('preventive', 'acute', 'chronic')),
  default_frequency TEXT,
  validity_days INTEGER, -- helper for calculating next due
  description TEXT
);

-- Enable RLS (Public Read)
ALTER TABLE public.reference_treatments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read reference_treatments" ON public.reference_treatments;
CREATE POLICY "Public can read reference_treatments" ON public.reference_treatments FOR SELECT USING (true);

-- Seed Data
INSERT INTO public.reference_treatments (name, category, default_frequency, validity_days, description) VALUES
-- Preventive - Flea/Tick
('NexGard', 'preventive', 'Monthly', 30, 'Oral flea and tick prevention for dogs.'),
('Bravecto (1 Month)', 'preventive', 'Monthly', 30, 'Oral flea and tick prevention.'),
('Bravecto (3 Months)', 'preventive', 'Every 3 Months', 90, 'Long-lasting oral flea and tick prevention.'),
('Simparica', 'preventive', 'Monthly', 30, 'Oral flea and tick prevention.'),
('Simparica Trio', 'preventive', 'Monthly', 30, 'Flea, tick, and heartworm prevention.'),
('Frontline Plus', 'preventive', 'Monthly', 30, 'Topical flea and tick prevention.'),
('K9 Advantix II', 'preventive', 'Monthly', 30, 'Topical flea, tick, and mosquito prevention.'),
('Seresto Collar', 'preventive', 'Every 8 Months', 240, 'Collar for flea and tick prevention.'),
('Credelio', 'preventive', 'Monthly', 30, 'Oral flea and tick prevention.'),
('Revolution', 'preventive', 'Monthly', 30, 'Topical heartworm and flea prevention.'),
('Revolution Plus', 'preventive', 'Monthly', 30, 'Broad spectrum topical for cats.'),

-- Preventive - Heartworm
('Heartgard Plus', 'preventive', 'Monthly', 30, 'Heartworm and intestinal parasite prevention.'),
('Interceptor Plus', 'preventive', 'Monthly', 30, 'Heartworm and broad intestinal parasite prevention.'),
('Sentinel', 'preventive', 'Monthly', 30, 'Heartworm and flea egg prevention.'),
('Tri-Heart Plus', 'preventive', 'Monthly', 30, 'Generic heartworm prevention.'),
('Advantage Multi', 'preventive', 'Monthly', 30, 'Topical heartworm and flea prevention.'),

-- Common Chronic/Acute (Examples)
('Apoquel', 'chronic', 'Daily', 1, 'Itch relief for allergic dermatitis.'),
('Cytopoint', 'chronic', 'Every 4-8 Weeks', 30, 'Injectable itch relief.'),
('Carprofen (Rimadyl)', 'chronic', 'Daily', 1, 'NSAID for pain and inflammation.'),
('Gabapentin', 'acute', 'As Needed', 0, 'Pain relief and sedative.'),
('Metronidazole', 'acute', 'Daily', 0, 'Antibiotic for diarrhea.'),
('Amoxicillin', 'acute', 'Daily', 0, 'Broad spectrum antibiotic.')
ON CONFLICT (name) DO UPDATE SET 
category = EXCLUDED.category,
default_frequency = EXCLUDED.default_frequency,
validity_days = EXCLUDED.validity_days,
description = EXCLUDED.description;
