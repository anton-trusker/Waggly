-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('passport', 'certificate', 'prescription', 'lab_result', 'invoice', 'insurance', 'microchip_registration', 'other')),
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view documents for their pets" ON public.documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE public.pets.id = public.documents.pet_id
            AND public.pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert documents for their pets" ON public.documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE public.pets.id = public.documents.pet_id
            AND public.pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update documents for their pets" ON public.documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE public.pets.id = public.documents.pet_id
            AND public.pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete documents for their pets" ON public.documents
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.pets
            WHERE public.pets.id = public.documents.pet_id
            AND public.pets.user_id = auth.uid()
        )
    );

-- Create index
CREATE INDEX idx_documents_pet_id ON public.documents(pet_id);
CREATE INDEX idx_documents_type ON public.documents(type);
