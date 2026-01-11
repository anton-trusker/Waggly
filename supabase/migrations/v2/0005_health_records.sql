-- Health Records Schema

-- 1. Vaccinations
CREATE TABLE IF NOT EXISTS public.vaccinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
    
    vaccine_name TEXT NOT NULL,
    manufacturer TEXT,
    batch_number TEXT,
    
    administered_date DATE NOT NULL,
    valid_until DATE, -- Usage: Passport expiry for this vaccine
    next_due_date DATE, -- Usage: Reminder system
    
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL, -- Who administered it
    
    status vaccination_status_enum DEFAULT 'completed',
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Medical Visits / Checkups
CREATE TABLE IF NOT EXISTS public.medical_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
    
    visit_date DATE NOT NULL,
    visit_type visit_type_enum NOT NULL, -- checkup, surgery, etc.
    
    reason TEXT,
    diagnosis TEXT,
    treatment_summary TEXT, -- Quick summary for the list view
    
    cost DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Medications
CREATE TABLE IF NOT EXISTS public.medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
    
    name TEXT NOT NULL,
    dosage TEXT, -- e.g. "10mg"
    frequency TEXT, -- e.g. "Twice daily"
    instructions TEXT, -- e.g. "With food"
    
    start_date DATE NOT NULL,
    end_date DATE,
    is_ongoing BOOLEAN DEFAULT FALSE,
    
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Allergies / Conditions
CREATE TABLE IF NOT EXISTS public.allergies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
    
    name TEXT NOT NULL,
    type TEXT, -- e.g. 'food', 'medication', 'environment'
    severity severity_level_enum DEFAULT 'medium',
    reaction TEXT,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Weight Logs (For charts)
CREATE TABLE IF NOT EXISTS public.weight_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
    
    weight DECIMAL(5,2) NOT NULL,
    unit TEXT DEFAULT 'kg',
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -- No updated_at usually needed for logs, but can add if edits allowed
);

-- Indexes
CREATE INDEX idx_vaccinations_pet_id ON public.vaccinations(pet_id);
CREATE INDEX idx_medical_visits_pet_id ON public.medical_visits(pet_id);
CREATE INDEX idx_medications_pet_id ON public.medications(pet_id);
CREATE INDEX idx_weight_logs_pet_id ON public.weight_logs(pet_id);
CREATE INDEX idx_weight_logs_date ON public.weight_logs(recorded_date);

-- Triggers for Updated At
CREATE TRIGGER update_vaccinations_updated_at BEFORE UPDATE ON public.vaccinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_visits_updated_at BEFORE UPDATE ON public.medical_visits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON public.medications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_allergies_updated_at BEFORE UPDATE ON public.allergies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
