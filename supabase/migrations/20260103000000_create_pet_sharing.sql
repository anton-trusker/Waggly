-- Migration: Create pet sharing system
-- Description: Add pet_share_tokens table for secure pet profile sharing
-- Date: 2026-01-03

-- Create pet_share_tokens table
CREATE TABLE IF NOT EXISTS pet_share_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
    token TEXT UNIQUE NOT NULL,
    permission_level TEXT NOT NULL CHECK (permission_level IN ('basic', 'advanced')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    accessed_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pet_share_tokens_pet_id ON pet_share_tokens(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_share_tokens_token ON pet_share_tokens(token) WHERE is_active = TRUE;

-- Enable RLS
ALTER TABLE pet_share_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Owners can view their pet's share tokens
CREATE POLICY "Owners can view share tokens" ON pet_share_tokens
    FOR SELECT 
    USING (
        pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid())
    );

-- Owners can create share tokens for their pets
CREATE POLICY "Owners can create share tokens" ON pet_share_tokens
    FOR INSERT 
    WITH CHECK (
        pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid())
    );

-- Owners can update/revoke their pet's share tokens
CREATE POLICY "Owners can update share tokens" ON pet_share_tokens
    FOR UPDATE 
    USING (
        pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid())
    );

-- Public can validate active tokens (needed for the public share route)
-- This policy allows anyone to check if a token exists and is active
CREATE POLICY "Anyone can validate active tokens" ON pet_share_tokens
    FOR SELECT 
    USING (is_active = TRUE);

-- Function to auto-generate basic share token on pet creation
CREATE OR REPLACE FUNCTION generate_basic_share_token()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate a basic share token for the newly created pet
    INSERT INTO pet_share_tokens (pet_id, token, permission_level)
    VALUES (
        NEW.id,
        encode(gen_random_bytes(32), 'hex'),
        'basic'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-generate basic share token on pet creation
DROP TRIGGER IF EXISTS trigger_generate_basic_share_token ON pets;
CREATE TRIGGER trigger_generate_basic_share_token
    AFTER INSERT ON pets
    FOR EACH ROW
    EXECUTE FUNCTION generate_basic_share_token();

-- Comment on table
COMMENT ON TABLE pet_share_tokens IS 'Secure tokens for sharing pet profiles with different permission levels';
