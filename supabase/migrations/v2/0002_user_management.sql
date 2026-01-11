-- User Profiles (extends auth.users)
-- We strictly separate auth (Supabase managed) from profile data (our domain)

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL, -- Copied from auth.users for easier queries, strictly managed by triggers usually
    full_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    
    -- Preferences / Settings could be JSONB, or separate columns
    preferences JSONB DEFAULT '{}'::jsonb,
    
    -- Standard timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to keep updated_at fresh
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Secure RLS defaults (will be refined in 0007_security_policies, but good to lock down immediately)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
