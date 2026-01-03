-- System Tables and Performance Indexes Migration
-- Covers system tables and creates performance indexes

-- ==============================================
-- SYSTEM TABLES (ADMIN ONLY)
-- ==============================================

-- Users table - only admin access
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read users" ON public.users
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update users" ON public.users
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Roles table - only admin access
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read roles" ON public.roles
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update roles" ON public.roles
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Settings table - only admin access
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read settings" ON public.settings
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update settings" ON public.settings
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Content table - admin access for all, creators for their own
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published content" ON public.content
  FOR SELECT USING (status = 'published');

CREATE POLICY "Creators can read own content" ON public.content
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Creators can insert own content" ON public.content
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Creators can update own content" ON public.content
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Only admins can review content" ON public.content
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Audit logs - admin only
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read audit logs" ON public.audit_logs
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- User sessions - users can only access their own
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sessions" ON public.user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions" ON public.user_sessions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions" ON public.user_sessions
  FOR DELETE USING (user_id = auth.uid());

-- Mail queue - admin only
ALTER TABLE public.mail_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read mail queue" ON public.mail_queue
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update mail queue" ON public.mail_queue
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Ref_vaccines - enable RLS (policies already exist)
ALTER TABLE public.ref_vaccines ENABLE ROW LEVEL SECURITY;

-- Ref_medications - enable RLS (policies already exist)
ALTER TABLE public.ref_medications ENABLE ROW LEVEL SECURITY;

-- Ref_symptoms - enable RLS (policies already exist)
ALTER TABLE public.ref_symptoms ENABLE ROW LEVEL SECURITY;

-- Ref_allergens - enable RLS (policies already exist)
ALTER TABLE public.ref_allergens ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- PERFORMANCE INDEXES
-- ==============================================

-- Create indexes to improve RLS policy performance
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON public.pets(user_id);
CREATE INDEX IF NOT EXISTS idx_co_owners_co_owner_id ON public.co_owners(co_owner_id);
CREATE INDEX IF NOT EXISTS idx_co_owners_main_owner_id ON public.co_owners(main_owner_id);
CREATE INDEX IF NOT EXISTS idx_co_owners_pet_id ON public.co_owners(pet_id);
CREATE INDEX IF NOT EXISTS idx_co_owners_status ON public.co_owners(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor_id ON public.activity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_owner_id ON public.activity_logs(owner_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_pet_id ON public.activity_logs(pet_id);

-- Composite indexes for better performance
CREATE INDEX IF NOT EXISTS idx_co_owners_composite ON public.co_owners(co_owner_id, pet_id, status);
CREATE INDEX IF NOT EXISTS idx_pets_composite ON public.pets(user_id, id);

-- Grant permissions for system tables
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.roles TO authenticated;
GRANT SELECT ON public.settings TO authenticated;
GRANT SELECT ON public.content TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_sessions TO authenticated;
GRANT SELECT ON public.mail_queue TO authenticated;
GRANT SELECT ON public.ref_vaccines TO authenticated;
GRANT SELECT ON public.ref_medications TO authenticated;
GRANT SELECT ON public.ref_symptoms TO authenticated;
GRANT SELECT ON public.ref_allergens TO authenticated;

-- Grant permissions for anon role on reference tables
GRANT SELECT ON public.ref_vaccines TO anon;
GRANT SELECT ON public.ref_medications TO anon;
GRANT SELECT ON public.ref_symptoms TO anon;
GRANT SELECT ON public.ref_allergens TO anon;