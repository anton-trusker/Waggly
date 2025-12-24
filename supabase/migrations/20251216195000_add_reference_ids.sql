-- Add reference linking fields to vaccinations and treatments
ALTER TABLE public.vaccinations
ADD COLUMN IF NOT EXISTS reference_vaccination_id UUID NULL REFERENCES public.reference_vaccinations(id);

ALTER TABLE public.treatments
ADD COLUMN IF NOT EXISTS reference_treatment_id UUID NULL REFERENCES public.reference_treatments(id);

-- Optional indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_vaccinations_reference_id ON public.vaccinations(reference_vaccination_id);
CREATE INDEX IF NOT EXISTS idx_treatments_reference_id ON public.treatments(reference_treatment_id);

