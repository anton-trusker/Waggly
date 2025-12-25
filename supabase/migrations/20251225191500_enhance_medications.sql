-- Migration: Enhance medications table
-- Description: Add comprehensive medication and treatment tracking
-- Date: 2025-12-25

-- Treatment type classification
ALTER TABLE medications ADD COLUMN IF NOT EXISTS treatment_type VARCHAR(50);
COMMENT ON COLUMN medications.treatment_type IS 'medication, injection, supplement, topical, physical_therapy, procedure, other';

-- Administration details
ALTER TABLE medications ADD COLUMN IF NOT EXISTS administration_times JSONB;
COMMENT ON COLUMN medications.administration_times IS 'Array of daily administration times: ["09:00", "21:00"]';

ALTER TABLE medications ADD COLUMN IF NOT EXISTS administration_instructions TEXT;
COMMENT ON COLUMN medications.administration_instructions IS 'Detailed instructions for giving medication';

ALTER TABLE medications ADD COLUMN IF NOT EXISTS best_time_to_give JSONB;
COMMENT ON COLUMN medications.best_time_to_give IS 'Array of timing preferences: ["with_food", "morning", "evening"]';

-- Duration tracking
ALTER TABLE medications ADD COLUMN IF NOT EXISTS duration_value INTEGER;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS duration_unit VARCHAR(20);
COMMENT ON COLUMN medications.duration_unit IS 'days, weeks, months, years';

ALTER TABLE medications ADD COLUMN IF NOT EXISTS is_ongoing BOOLEAN DEFAULT FALSE;
COMMENT ON COLUMN medications.is_ongoing IS 'True for chronic/long-term medications';

-- Medication details
ALTER TABLE medications ADD COLUMN IF NOT EXISTS strength VARCHAR(50);
COMMENT ON COLUMN medications.strength IS 'Medication strength (e.g., 250mg, 5ml/5mg)';

ALTER TABLE medications ADD COLUMN IF NOT EXISTS form VARCHAR(50);
COMMENT ON COLUMN medications.form IS 'tablet, capsule, liquid, injection, cream, spray, patch, etc';

-- Provider information
ALTER TABLE medications ADD COLUMN IF NOT EXISTS prescribed_by VARCHAR(255);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS pharmacy_name VARCHAR(255);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS pharmacy_place_id VARCHAR(255);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS prescription_number VARCHAR(100);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS prescription_document_id UUID REFERENCES documents(id);

-- Refill management
ALTER TABLE medications ADD COLUMN IF NOT EXISTS refill_schedule JSONB;
COMMENT ON COLUMN medications.refill_schedule IS '{every: 30, unit: "days", quantity: 60, pharmacyName: ""}';

ALTER TABLE medications ADD COLUMN IF NOT EXISTS auto_refill BOOLEAN DEFAULT FALSE;

-- Cost details
ALTER TABLE medications ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10, 2);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS quantity INTEGER;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS total_cost DECIMAL(10, 2);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS insurance_coverage_percent INTEGER;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS out_of_pocket_cost DECIMAL(10, 2);

-- Side effects and safety
ALTER TABLE medications ADD COLUMN IF NOT EXISTS side_effects JSONB;
COMMENT ON COLUMN medications.side_effects IS 'Array of observed side effects';

ALTER TABLE medications ADD COLUMN IF NOT EXISTS severity_rating VARCHAR(20);
COMMENT ON COLUMN medications.severity_rating IS 'mild, moderate, severe';

ALTER TABLE medications ADD COLUMN IF NOT EXISTS contraindications TEXT;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS interactions JSONB;
COMMENT ON COLUMN medications.interactions IS 'Array of medication names that interact';

ALTER TABLE medications ADD COLUMN IF NOT EXISTS storage_instructions VARCHAR(255);

-- Medical context
ALTER TABLE medications ADD COLUMN IF NOT EXISTS reason_for_treatment TEXT;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS condition_being_treated VARCHAR(255);
ALTER TABLE medications ADD COLUMN IF NOT EXISTS monitor_for JSONB;
COMMENT ON COLUMN medications.monitor_for IS 'Array of symptoms to watch for';

-- Reminder enhancements
ALTER TABLE medications ADD COLUMN IF NOT EXISTS reminder_notify_caregivers JSONB;
COMMENT ON COLUMN medications.reminder_notify_caregivers IS 'Array of user IDs to notify';

ALTER TABLE medications ADD COLUMN IF NOT EXISTS reminder_before_minutes INTEGER DEFAULT 30;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS reminder_calendar_event BOOLEAN DEFAULT FALSE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_medications_active ON medications(pet_id, start_date) WHERE end_date IS NULL OR end_date > NOW();
CREATE INDEX IF NOT EXISTS idx_medications_pet_dates ON medications(pet_id, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_medications_treatment_type ON medications(treatment_type);
