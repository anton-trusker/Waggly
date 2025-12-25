-- Migration: Enhance documents table
-- Description: Add advanced document management with OCR and organization features
-- Date: 2025-12-25

-- Add document source and metadata
ALTER TABLE documents ADD COLUMN IF NOT EXISTS document_source VARCHAR(100);
COMMENT ON COLUMN documents.document_source IS 'veterinary_clinic, specialist, emergency_clinic, surgical_center, pharmacy, laboratory, grooming, home_care, other';

ALTER TABLE documents ADD COLUMN IF NOT EXISTS document_date DATE;
COMMENT ON COLUMN documents.document_date IS 'Date the document was created (may differ from upload date)';

ALTER TABLE documents ADD COLUMN IF NOT EXISTS title VARCHAR(255);
COMMENT ON COLUMN documents.title IS 'User-friendly document title';

-- OCR and data extraction
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ocr_data JSONB;
COMMENT ON COLUMN documents.ocr_data IS 'Structured data extracted from document via OCR';

ALTER TABLE documents ADD COLUMN IF NOT EXISTS ocr_confidence_score INTEGER CHECK (ocr_confidence_score BETWEEN 0 AND 100);
COMMENT ON COLUMN documents.ocr_confidence_score IS 'Confidence percentage of OCR extraction';

ALTER TABLE documents ADD COLUMN IF NOT EXISTS manual_details JSONB;
COMMENT ON COLUMN documents.manual_details IS 'User-entered data when OCR is unavailable or incorrect';

-- Linking to other records
ALTER TABLE documents ADD COLUMN IF NOT EXISTS linked_records JSONB;
COMMENT ON COLUMN documents.linked_records IS 'References to related records: {visit_id, medication_id, vaccination_id, etc}';

-- Organization features
ALTER TABLE documents ADD COLUMN IF NOT EXISTS tags JSONB;
COMMENT ON COLUMN documents.tags IS 'Array of tag strings for searching/filtering';

-- Sharing and visibility
ALTER TABLE documents ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'private';
COMMENT ON COLUMN documents.visibility IS 'private, family, vet, public';

ALTER TABLE documents ADD COLUMN IF NOT EXISTS shared_with_users JSONB;
COMMENT ON COLUMN documents.shared_with_users IS 'Array of user IDs who have access';

ALTER TABLE documents ADD COLUMN IF NOT EXISTS shared_with_vets JSONB;
COMMENT ON COLUMN documents.shared_with_vets IS 'Array of vet IDs who have access';

ALTER TABLE documents ADD COLUMN IF NOT EXISTS notify_recipients BOOLEAN DEFAULT FALSE;
COMMENT ON COLUMN documents.notify_recipients IS 'Send notification when shared';

-- Security and confidentiality
ALTER TABLE documents ADD COLUMN IF NOT EXISTS confidentiality_level VARCHAR(20) DEFAULT 'normal';
COMMENT ON COLUMN documents.confidentiality_level IS 'normal, sensitive, confidential';

-- Archive management
ALTER TABLE documents ADD COLUMN IF NOT EXISTS auto_archive_date DATE;
COMMENT ON COLUMN documents.auto_archive_date IS 'Date to automatically move to archive';

ALTER TABLE documents ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;

ALTER TABLE documents ADD COLUMN IF NOT EXISTS document_range_start DATE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS document_range_end DATE;
COMMENT ON COLUMN documents.document_range_start IS 'For multi-page documents spanning time periods';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documents_pet_type ON documents(pet_id, type);
CREATE INDEX IF NOT EXISTS idx_documents_date ON documents(document_date) WHERE document_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_archived ON documents(pet_id, archived);
CREATE INDEX IF NOT EXISTS idx_documents_visibility ON documents(visibility);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN (tags);
