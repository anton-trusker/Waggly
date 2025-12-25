-- Schema Discovery Script
-- Run this first to check actual column names in your database

SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name IN ('medical_visits', 'vaccinations', 'health_metrics')
  AND column_name LIKE '%date%'
ORDER BY table_name, ordinal_position;
