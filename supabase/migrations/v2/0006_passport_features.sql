-- Passport & Document Features

-- 1. Documents (Centralized file storage references)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL, -- Can be general owner doc or pet specific
    
    name TEXT NOT NULL,
    category document_category_enum DEFAULT 'other',
    
    file_path TEXT NOT NULL, -- Supabase Storage path
    file_type TEXT, -- mime type
    file_size INTEGER, -- bytes
    
    is_favorite BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Passport / Travel Certificates (Optional metadata wrapper around documents or specific entries)
-- Some countries require specific "Passport Number" or travel groupings.
-- This table can group vaccinations/documents into a "Trip" or "Certificate".

CREATE TABLE IF NOT EXISTS public.travel_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
    
    destination_country TEXT,
    travel_date DATE,
    return_date DATE,
    
    notes TEXT,
    status TEXT DEFAULT 'planning', -- planning, active, completed
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_documents_owner_id ON public.documents(owner_id);
CREATE INDEX idx_documents_pet_id ON public.documents(pet_id);
CREATE INDEX idx_travel_records_pet_id ON public.travel_records(pet_id);

-- Triggers
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_travel_records_updated_at BEFORE UPDATE ON public.travel_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_records ENABLE ROW LEVEL SECURITY;
