
# Waggli - Setup Instructions

Welcome to Waggli! This guide will help you set up the app with Supabase backend.

## Prerequisites

- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- A Supabase account (free tier works great!)
- iOS Simulator (for Mac) or Android Emulator

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Project Name**: Waggli
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
4. Wait for the project to be created (takes ~2 minutes)

### 1.2 Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

### 1.3 Create Environment Variables

Create a `.env` file in the root of your project:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual Supabase URL and anon key.

## Step 2: Database Schema Setup

### 2.1 Run SQL Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pets table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'other')),
  breed TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),
  date_of_birth DATE,
  age_approximate TEXT,
  size TEXT CHECK (size IN ('small', 'medium', 'large')),
  weight DECIMAL(5,2),
  color TEXT,
  photo_url TEXT,
  photo_gallery TEXT[],
  microchip_number TEXT,
  registration_id TEXT,
  is_spayed_neutered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create veterinarians table
CREATE TABLE veterinarians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  clinic_name TEXT NOT NULL,
  vet_name TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create allergies table
CREATE TABLE allergies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('food', 'environment', 'medication')),
  allergen TEXT NOT NULL,
  reaction_description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create behavior_tags table
CREATE TABLE behavior_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_history table
CREATE TABLE medical_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food table
CREATE TABLE food (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  brand_or_product TEXT,
  food_type TEXT CHECK (food_type IN ('dry', 'wet', 'raw', 'other')),
  amount_per_meal TEXT,
  meals_per_day INTEGER,
  feeding_times TEXT[],
  diet_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create care_notes table
CREATE TABLE care_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  walk_routine TEXT,
  grooming_frequency TEXT,
  handling_tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vaccinations table
CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  vaccine_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('core', 'non-core')),
  date_given DATE NOT NULL,
  next_due_date DATE,
  dose_number INTEGER,
  administering_vet TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatments table
CREATE TABLE treatments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  treatment_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('preventive', 'acute', 'chronic')),
  start_date DATE NOT NULL,
  end_date DATE,
  dosage TEXT,
  frequency TEXT,
  time_of_day TEXT,
  vet TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weight_entries table
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vaccination', 'treatment', 'vet_visit')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_veterinarians_pet_id ON veterinarians(pet_id);
CREATE INDEX idx_allergies_pet_id ON allergies(pet_id);
CREATE INDEX idx_behavior_tags_pet_id ON behavior_tags(pet_id);
CREATE INDEX idx_medical_history_pet_id ON medical_history(pet_id);
CREATE INDEX idx_food_pet_id ON food(pet_id);
CREATE INDEX idx_care_notes_pet_id ON care_notes(pet_id);
CREATE INDEX idx_vaccinations_pet_id ON vaccinations(pet_id);
CREATE INDEX idx_treatments_pet_id ON treatments(pet_id);
CREATE INDEX idx_weight_entries_pet_id ON weight_entries(pet_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_pet_id ON notifications(pet_id);

-- Enable Row Level Security (RLS)
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE food ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pets
CREATE POLICY "Users can view their own pets"
  ON pets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pets"
  ON pets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets"
  ON pets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets"
  ON pets FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for veterinarians
CREATE POLICY "Users can view veterinarians for their pets"
  ON veterinarians FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = veterinarians.pet_id AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert veterinarians for their pets"
  ON veterinarians FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = veterinarians.pet_id AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Users can update veterinarians for their pets"
  ON veterinarians FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = veterinarians.pet_id AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete veterinarians for their pets"
  ON veterinarians FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = veterinarians.pet_id AND pets.user_id = auth.uid()
  ));

-- Create similar RLS policies for other tables
-- (Repeat the pattern above for: allergies, behavior_tags, medical_history, food, care_notes, vaccinations, treatments, weight_entries)

-- RLS policies for allergies
CREATE POLICY "Users can view allergies for their pets" ON allergies FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = allergies.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert allergies for their pets" ON allergies FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = allergies.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update allergies for their pets" ON allergies FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = allergies.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete allergies for their pets" ON allergies FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = allergies.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for behavior_tags
CREATE POLICY "Users can view behavior_tags for their pets" ON behavior_tags FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = behavior_tags.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert behavior_tags for their pets" ON behavior_tags FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = behavior_tags.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update behavior_tags for their pets" ON behavior_tags FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = behavior_tags.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete behavior_tags for their pets" ON behavior_tags FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = behavior_tags.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for medical_history
CREATE POLICY "Users can view medical_history for their pets" ON medical_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_history.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert medical_history for their pets" ON medical_history FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_history.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update medical_history for their pets" ON medical_history FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_history.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete medical_history for their pets" ON medical_history FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_history.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for food
CREATE POLICY "Users can view food for their pets" ON food FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = food.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert food for their pets" ON food FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = food.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update food for their pets" ON food FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = food.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete food for their pets" ON food FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = food.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for care_notes
CREATE POLICY "Users can view care_notes for their pets" ON care_notes FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = care_notes.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert care_notes for their pets" ON care_notes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = care_notes.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update care_notes for their pets" ON care_notes FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = care_notes.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete care_notes for their pets" ON care_notes FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = care_notes.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for vaccinations
CREATE POLICY "Users can view vaccinations for their pets" ON vaccinations FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = vaccinations.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert vaccinations for their pets" ON vaccinations FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = vaccinations.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update vaccinations for their pets" ON vaccinations FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = vaccinations.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete vaccinations for their pets" ON vaccinations FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = vaccinations.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for treatments
CREATE POLICY "Users can view treatments for their pets" ON treatments FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = treatments.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert treatments for their pets" ON treatments FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = treatments.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update treatments for their pets" ON treatments FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = treatments.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete treatments for their pets" ON treatments FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = treatments.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for weight_entries
CREATE POLICY "Users can view weight_entries for their pets" ON weight_entries FOR SELECT
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = weight_entries.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can insert weight_entries for their pets" ON weight_entries FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM pets WHERE pets.id = weight_entries.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can update weight_entries for their pets" ON weight_entries FOR UPDATE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = weight_entries.pet_id AND pets.user_id = auth.uid()));
CREATE POLICY "Users can delete weight_entries for their pets" ON weight_entries FOR DELETE
  USING (EXISTS (SELECT 1 FROM pets WHERE pets.id = weight_entries.pet_id AND pets.user_id = auth.uid()));

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_veterinarians_updated_at BEFORE UPDATE ON veterinarians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_allergies_updated_at BEFORE UPDATE ON allergies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_history_updated_at BEFORE UPDATE ON medical_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_updated_at BEFORE UPDATE ON food
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_care_notes_updated_at BEFORE UPDATE ON care_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vaccinations_updated_at BEFORE UPDATE ON vaccinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON treatments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Click **Run** to execute the SQL

### 2.2 Set Up Storage (Optional - for pet photos)

1. In Supabase dashboard, go to **Storage**
2. Click **New Bucket**
3. Name it `pet-photos`
4. Set it to **Public** (so users can view their pet photos)
5. Click **Create Bucket**

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run the App

### For iOS (Mac only):
```bash
npm run ios
```

### For Android:
```bash
npm run android
```

### For Web:
```bash
npm run web
```

## Step 5: Test the App

1. **Sign Up**: Create a new account with email and password
2. **Add a Pet**: Click "Add Pet" and fill in the details
3. **Add Vaccinations**: Go to pet details and add vaccination records
4. **Add Treatments**: Add medication or treatment schedules
5. **Track Weight**: Add weight entries to track your pet's health

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file has the correct Supabase URL and anon key
- Make sure there are no extra spaces or quotes
- Restart the Expo dev server after changing `.env`

### "Permission denied" errors
- Make sure you ran all the RLS policy SQL commands
- Check that you're logged in with a valid user account

### Database connection issues
- Verify your Supabase project is active (not paused)
- Check your internet connection
- Try restarting the Supabase project from the dashboard

## Optional: Google Sign-In Setup

To enable Google Sign-In (prepared for future):

1. Go to **Authentication** > **Providers** in Supabase
2. Enable **Google** provider
3. Follow the instructions to set up Google OAuth credentials
4. Add the credentials to your Supabase project

## Optional: Apple Sign-In Setup

To enable Apple Sign-In (prepared for future):

1. Go to **Authentication** > **Providers** in Supabase
2. Enable **Apple** provider
3. Follow the instructions to set up Apple Sign-In
4. Add the credentials to your Supabase project

## Need Help?

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Expo Documentation](https://docs.expo.dev)
- Review the code comments in the project files

## Next Steps

Now that your app is set up, you can:

- Customize the color scheme in `styles/commonStyles.ts`
- Add more features like photo uploads
- Implement push notifications for reminders
- Add charts for weight tracking
- Enable social login (Google/Apple)

Happy coding! 🐾
