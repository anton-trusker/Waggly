-- Check current permissions for events and related tables
SELECT 
    grantee,
    table_name,
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
    AND grantee IN ('anon', 'authenticated')
    AND table_name IN ('events', 'vaccinations', 'treatments', 'medical_visits')
ORDER BY table_name, grantee;