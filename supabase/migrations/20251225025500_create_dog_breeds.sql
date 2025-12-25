CREATE TABLE IF NOT EXISTS dog_breeds (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  fci_group text,
  akc_group text,
  origin_country text,
  size_category text,
  average_height_cm text,
  average_weight_kg text,
  life_expectancy_years text,
  temperament text,
  primary_purpose text,
  coat_type text,
  color_varieties text,
  training_difficulty text,
  exercise_needs text,
  grooming_needs text,
  good_with_families text,
  good_with_children text,
  shedding_level text,
  health_concerns text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dog_breeds ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'dog_breeds'
        AND policyname = 'Allow public read access'
    ) THEN
        CREATE POLICY "Allow public read access" ON dog_breeds
        FOR SELECT USING (true);
    END IF;
END
$$;
