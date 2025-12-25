-- Migration: Enhance visits table for multi-provider support
-- Description: Add support for veterinary, grooming, training, boarding, and other service appointments
-- Date: 2025-12-25

-- Add provider type classification
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS provider_type VARCHAR(50) DEFAULT 'veterinary';
COMMENT ON COLUMN medical_visits.provider_type IS 'Type of service provider: veterinary, groomer, trainer, boarder, daycare, walker, sitter, behaviorist, nutritionist, other';

-- Add service-specific category field
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS service_category VARCHAR(100);
COMMENT ON COLUMN medical_visits.service_category IS 'Specific service type, varies by provider_type';

-- Add time and duration fields
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS visit_time TIME;
COMMENT ON COLUMN medical_visits.visit_time IS 'Time of appointment';

ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;
COMMENT ON COLUMN medical_visits.duration_minutes IS 'Expected duration of appointment in minutes';

-- Add provider/business information fields
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS provider_name VARCHAR(255);
COMMENT ON COLUMN medical_visits.provider_name IS 'Name of individual providing service (vet, groomer, trainer)';

ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
COMMENT ON COLUMN medical_visits.business_name IS 'Name of business/facility (clinic, salon, training center)';

ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_phone VARCHAR(20);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_email VARCHAR(255);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_website VARCHAR(500);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_place_id VARCHAR(255);
COMMENT ON COLUMN medical_visits.business_place_id IS 'Google Places API place ID for location lookup';

ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_lat DECIMAL(10, 8);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS business_lng DECIMAL(11, 8);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS distance_km DECIMAL(6, 2);
COMMENT ON COLUMN medical_visits.distance_km IS 'Distance from user to business location';

-- Add medical-specific fields (optional for vet visits only)
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS current_medications JSONB;
COMMENT ON COLUMN medical_visits.current_medications IS 'Array of current medications: [{name, dosage, frequency}]';

ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS special_instructions TEXT;
COMMENT ON COLUMN medical_visits.special_instructions IS 'Special instructions for provider';

ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS recommendations JSONB;
COMMENT ON COLUMN medical_visits.recommendations IS 'Provider recommendations: {items: [], notes: ""}';

-- Universal fields (applicable to all provider types)
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS cost_breakdown JSONB;
COMMENT ON COLUMN medical_visits.cost_breakdown IS 'Array of cost line items: [{service, amount}]';

ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS insurance_provider VARCHAR(255);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS insurance_claim_status VARCHAR(50);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS invoice_document_id UUID REFERENCES documents(id);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS attachments JSONB;
COMMENT ON COLUMN medical_visits.attachments IS 'Array of document IDs';

-- Reminder and sharing fields
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS reminder_date TIMESTAMP;
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS reminder_type VARCHAR(50);
ALTER TABLE medical_visits ADD COLUMN IF NOT EXISTS shared_with JSONB;
COMMENT ON COLUMN medical_visits.shared_with IS 'Array of provider emails to share with';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_medical_visits_date ON medical_visits(date);
CREATE INDEX IF NOT EXISTS idx_medical_visits_pet_date ON medical_visits(pet_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_medical_visits_provider_type ON medical_visits(provider_type);
CREATE INDEX IF NOT EXISTS idx_medical_visits_business_place_id ON medical_visits(business_place_id);

-- Update existing data to have default provider_type
UPDATE medical_visits SET provider_type = 'veterinary' WHERE provider_type IS NULL;
