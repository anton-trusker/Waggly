-- Migration: Enhance health_metrics table
-- Description: Add comprehensive health tracking and vital signs
-- Date: 2025-12-25

-- Measurement context
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS measured_by VARCHAR(255);
COMMENT ON COLUMN health_metrics.measured_by IS 'Person who took measurements';

ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS measurement_location VARCHAR(100);
COMMENT ON COLUMN health_metrics.measurement_location IS 'home, veterinary_clinic, grooming, pet_store, other';

-- Physical measurements
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS length_value DECIMAL(6, 2);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS length_unit VARCHAR(10);
COMMENT ON COLUMN health_metrics.length_value IS 'Nose to tail base measurement';

ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS height_at_shoulder DECIMAL(6, 2);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS height_unit VARCHAR(10);

ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS girth_circumference DECIMAL(6, 2);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS girth_unit VARCHAR(10);
COMMENT ON COLUMN health_metrics.girth_circumference IS 'Chest circumference behind front legs';

-- Additional vital signs
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS blood_pressure_systolic INTEGER;
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS blood_pressure_diastolic INTEGER;

ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS pain_score INTEGER CHECK (pain_score BETWEEN 1 AND 10);
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS pain_observations TEXT;

-- Body condition assessments
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS coat_condition VARCHAR(50);
COMMENT ON COLUMN health_metrics.coat_condition IS 'excellent, good, fair, poor';

ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS coat_notes TEXT;

ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS appetite_level VARCHAR(50);
COMMENT ON COLUMN health_metrics.appetite_level IS 'excellent, good, fair, poor, not_eating';

ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS appetite_notes TEXT;

ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS hydration_status VARCHAR(50);
COMMENT ON COLUMN health_metrics.hydration_status IS 'well_hydrated, slight, moderate, severe dehydration';

ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS activity_level VARCHAR(50);
COMMENT ON COLUMN health_metrics.activity_level IS 'low, low_moderate, moderate, high, very_high';

ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS activity_observations TEXT;

-- Lab results
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS lab_results JSONB;
COMMENT ON COLUMN health_metrics.lab_results IS 'Array of lab test results with values, units, reference ranges, status';

-- Weight analysis
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS weight_change_percent DECIMAL(5, 2);
COMMENT ON COLUMN health_metrics.weight_change_percent IS 'Percentage change from previous weight measurement';

ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS weight_trend VARCHAR(20);
COMMENT ON COLUMN health_metrics.weight_trend IS 'increasing, decreasing, stable';

-- Veterinary consultation flagging
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS veterinary_consultation_needed BOOLEAN DEFAULT FALSE;
ALTER TABLE health_metrics ADD COLUMN IF NOT EXISTS consultation_reasons JSONB;
COMMENT ON COLUMN health_metrics.consultation_reasons IS 'Array of concern flags';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_health_metrics_pet_date ON health_metrics(pet_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_health_metrics_weight ON health_metrics(pet_id, weight) WHERE weight IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_health_metrics_consultation_needed ON health_metrics(pet_id, veterinary_consultation_needed) WHERE veterinary_consultation_needed = TRUE;
