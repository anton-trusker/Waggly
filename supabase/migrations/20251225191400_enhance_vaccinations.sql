-- Migration: Enhance vaccinations table
-- Description: Add comprehensive vaccination tracking fields
-- Date: 2025-12-25

-- Add time field for more precise scheduling
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS administered_time TIME;
COMMENT ON COLUMN vaccinations.administered_time IS 'Time vaccine was administered';

-- Add vaccine details
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(255);
COMMENT ON COLUMN vaccinations.manufacturer IS 'Vaccine manufacturer (e.g., Zoetis, Merial)';

ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS route_of_administration VARCHAR(100);
COMMENT ON COLUMN vaccinations.route_of_administration IS 'How vaccine was given: subcutaneous, intramuscular, intranasal, oral';

ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS administered_by VARCHAR(255);
COMMENT ON COLUMN vaccinations.administered_by IS 'Name of person who administered vaccine';

-- Add location reference
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS clinic_place_id VARCHAR(255);
COMMENT ON COLUMN vaccinations.clinic_place_id IS 'Google Places ID for clinic location';

-- Add vaccination type classification
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS vaccination_type VARCHAR(50);
COMMENT ON COLUMN vaccinations.vaccination_type IS 'core or non-core vaccine classification';

ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS schedule_interval VARCHAR(50);
COMMENT ON COLUMN vaccinations.schedule_interval IS 'Typical interval for boosters: 1 year, 3 years, etc';

-- Payment information
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS insurance_provider VARCHAR(255);

-- Certificate document reference
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS certificate_document_id UUID REFERENCES documents(id);
COMMENT ON COLUMN vaccinations.certificate_document_id IS 'Reference to uploaded vaccination certificate';

-- Reaction tracking
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS reaction_severity VARCHAR(50);
COMMENT ON COLUMN vaccinations.reaction_severity IS 'none, mild, moderate, severe, anaphylaxis';

ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS reactions JSONB;
COMMENT ON COLUMN vaccinations.reactions IS 'Array of reaction symptoms';

-- Reminder configuration
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS reminder_days_before INTEGER DEFAULT 14;
COMMENT ON COLUMN vaccinations.reminder_days_before IS 'Days before next_due_date to send reminder';

ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS reminder_methods JSONB;
COMMENT ON COLUMN vaccinations.reminder_methods IS 'Array of notification methods: ["app", "email", "sms"]';

ALTER TABLE vaccinations ADD COLUMN IF NOT EXISTS reminder_recipients JSONB;
COMMENT ON COLUMN vaccinations.reminder_recipients IS 'Array of user IDs to notify';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vaccinations_next_due ON vaccinations(next_due_date) WHERE next_due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vaccinations_pet_date ON vaccinations(pet_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_vaccinations_type ON vaccinations(vaccination_type);
