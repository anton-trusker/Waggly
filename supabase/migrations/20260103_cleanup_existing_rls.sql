-- Cleanup existing RLS policies and functions
-- This migration removes all existing RLS policies and helper functions

-- Drop all existing policies from all tables
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Loop through all policies in the public schema
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      policy_record.policyname, 
                      policy_record.schemaname, 
                      policy_record.tablename);
    END LOOP;
END $$;

-- Drop existing helper functions
DROP FUNCTION IF EXISTS public.is_pet_owner(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_pet_coowner(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.has_pet_access(uuid) CASCADE;

-- Reset RLS on all tables to disabled state (we'll re-enable in the main migration)
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', table_record.table_name);
    END LOOP;
END $$;

-- Grant basic permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;