-- Expand profiles table with additional user details
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'non_binary', 'prefer_not_to_say')),
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS country_code TEXT,
ADD COLUMN IF NOT EXISTS language_code TEXT;

-- Update existing columns to match the new naming convention
-- Note: country and country_code are different - country is the full name, country_code is the ISO code
-- language_code is the ISO language code

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_country_code ON profiles(country_code);
CREATE INDEX IF NOT EXISTS idx_profiles_language_code ON profiles(language_code);
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON profiles(gender);

-- Update RLS policies to ensure users can update all their profile fields
-- The existing policies should already cover these new columns since they use *