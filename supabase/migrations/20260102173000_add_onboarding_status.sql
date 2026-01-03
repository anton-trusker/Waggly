-- Add onboarding_completed column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Update handle_new_user to set default if needed (though DEFAULT FALSE handles it)
-- No change needed to trigger unless we want to change logic.
