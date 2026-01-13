-- User Management Database Schema
-- Waggly Platform Specification
-- Version: 1.0

-- ============================================
-- USERS TABLE
-- Core user account information
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL CHECK (char_length(full_name) >= 2),
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  country TEXT,
  city TEXT,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- USER PREFERENCES TABLE
-- User settings and preferences
-- ============================================
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Appearance
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  date_format TEXT DEFAULT 'DD/MM/YYYY',
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
  temperature_unit TEXT DEFAULT 'celsius' CHECK (temperature_unit IN ('celsius', 'fahrenheit')),
  
  -- Notifications
  push_notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  vaccination_reminders BOOLEAN DEFAULT true,
  treatment_reminders BOOLEAN DEFAULT true,
  appointment_reminders BOOLEAN DEFAULT true,
  social_activity BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  
  -- Privacy
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private')),
  show_location BOOLEAN DEFAULT false,
  allow_discovery BOOLEAN DEFAULT true,
  share_activity BOOLEAN DEFAULT true,
  data_analytics BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SUBSCRIPTIONS TABLE
-- User subscription status
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'premium', 'family', 'lifetime')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CO-OWNERS TABLE
-- Shared pet access between users
-- ============================================
CREATE TABLE co_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL, -- References pets(id), defined in pet schema
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invited_by UUID REFERENCES users(id),
  invited_email TEXT NOT NULL,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('view', 'edit', 'full')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'revoked')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique pending/accepted invitations per pet/email
  UNIQUE (pet_id, invited_email, status)
);

CREATE INDEX idx_co_owners_pet_id ON co_owners(pet_id);
CREATE INDEX idx_co_owners_user_id ON co_owners(user_id);
CREATE INDEX idx_co_owners_invited_email ON co_owners(invited_email);

CREATE TRIGGER co_owners_updated_at
  BEFORE UPDATE ON co_owners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SHARING LINKS TABLE
-- Temporary shareable links for pet profiles
-- ============================================
CREATE TABLE sharing_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL, -- References pets(id)
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  template_type TEXT CHECK (template_type IN ('full', 'minimal', 'vet', 'sitter', 'custom')),
  
  -- Permissions
  permissions JSONB DEFAULT '{"view_profile": true, "view_health": true}',
  
  -- Access control
  password_hash TEXT,
  max_uses INTEGER,
  use_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked', 'expired')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sharing_links_token ON sharing_links(token);
CREATE INDEX idx_sharing_links_pet_id ON sharing_links(pet_id);

CREATE TRIGGER sharing_links_updated_at
  BEFORE UPDATE ON sharing_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SHARING TEMPLATES TABLE
-- Predefined and custom sharing templates
-- ============================================
CREATE TABLE sharing_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  permissions JSONB NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system templates
INSERT INTO sharing_templates (name, description, is_system, permissions) VALUES
  ('Full Access', 'Complete access to all pet information', true, 
   '{"view_profile": true, "view_health": true, "view_documents": true, "add_photos": true, "edit_health": true}'),
  ('Minimal Info', 'Basic profile and emergency contacts only', true,
   '{"view_profile": true, "view_health": false, "view_documents": false}'),
  ('Vet Emergency', 'Complete health history for veterinary care', true,
   '{"view_profile": true, "view_health": true, "view_documents": true, "view_allergies": true}'),
  ('Pet Sitter', 'Care instructions and emergency contacts', true,
   '{"view_profile": true, "view_health": true, "view_allergies": true, "add_photos": true, "add_notes": true}');

-- ============================================
-- AUTH AUDIT LOGS TABLE
-- Security and authentication audit trail
-- ============================================
CREATE TABLE auth_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_auth_audit_logs_user_id ON auth_audit_logs(user_id);
CREATE INDEX idx_auth_audit_logs_event_type ON auth_audit_logs(event_type);
CREATE INDEX idx_auth_audit_logs_created_at ON auth_audit_logs(created_at);

-- ============================================
-- DATA EXPORT REQUESTS TABLE
-- GDPR data export tracking
-- ============================================
CREATE TABLE data_export_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'expired')),
  download_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE sharing_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE sharing_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Preferences access
CREATE POLICY "Users can manage own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);

-- Subscription access
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Co-owners access
CREATE POLICY "Users can view co-owner relationships"
  ON co_owners FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.uid() = invited_by
    OR invited_email = (SELECT email FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Pet owners can manage co-owners"
  ON co_owners FOR ALL
  USING (auth.uid() = invited_by);

-- Sharing links access
CREATE POLICY "Users can manage own sharing links"
  ON sharing_links FOR ALL
  USING (auth.uid() = created_by);

-- Templates access
CREATE POLICY "Users can view system and own templates"
  ON sharing_templates FOR SELECT
  USING (is_system = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own templates"
  ON sharing_templates FOR ALL
  USING (auth.uid() = user_id AND is_system = false);

-- Audit logs - users can view own logs
CREATE POLICY "Users can view own audit logs"
  ON auth_audit_logs FOR SELECT
  USING (auth.uid() = user_id);
