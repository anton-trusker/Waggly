-- ===========================================
-- WAGGLY SOCIAL NETWORK DATABASE SCHEMA
-- ===========================================
-- Version: 1.0
-- Date: January 2026
-- Tables: 17

-- ===========================================
-- POSTS & CONTENT
-- ===========================================

CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  
  post_type VARCHAR(50) NOT NULL CHECK (
    post_type IN ('photo', 'video', 'text', 'poll', 'location_checkin')
  ),
  content_text TEXT,
  
  media JSONB DEFAULT '[]'::jsonb,
  media_count INTEGER DEFAULT 0,
  
  tagged_pet_ids UUID[],
  mentioned_user_ids UUID[],
  hashtags TEXT[],
  
  location_place_id UUID,
  location_name TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  
  poll_question TEXT,
  poll_options JSONB,
  poll_ends_at TIMESTAMP WITH TIME ZONE,
  poll_allow_multiple BOOLEAN DEFAULT FALSE,
  
  reaction_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  engagement_score DECIMAL(10,2) DEFAULT 0,
  
  visibility VARCHAR(20) DEFAULT 'public' CHECK (
    visibility IN ('public', 'followers', 'friends', 'private', 'group')
  ),
  group_id UUID REFERENCES social_groups(id),
  allow_comments BOOLEAN DEFAULT TRUE,
  
  is_flagged BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  flagged_reason TEXT,
  moderated_at TIMESTAMP WITH TIME ZONE,
  moderated_by UUID,
  
  is_pinned BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active' CHECK (
    status IN ('active', 'deleted', 'archived')
  ),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_posts_author ON social_posts(author_user_id, created_at DESC) 
  WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_pet ON social_posts(author_pet_id, created_at DESC) 
  WHERE author_pet_id IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_posts_visibility ON social_posts(visibility, created_at DESC) 
  WHERE deleted_at IS NULL AND status = 'active';
CREATE INDEX idx_posts_engagement ON social_posts(engagement_score DESC, created_at DESC) 
  WHERE deleted_at IS NULL AND status = 'active';
CREATE INDEX idx_posts_hashtags ON social_posts USING GIN(hashtags) 
  WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_group ON social_posts(group_id, created_at DESC) 
  WHERE group_id IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_posts_location ON social_posts(location_lat, location_lng) 
  WHERE location_lat IS NOT NULL AND deleted_at IS NULL;

-- ===========================================
-- REACTIONS
-- ===========================================

CREATE TABLE post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reaction_type VARCHAR(20) NOT NULL CHECK (
    reaction_type IN ('love', 'paws', 'hilarious', 'adorable', 'care', 'celebrate')
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_reactions_post ON post_reactions(post_id, reaction_type);
CREATE INDEX idx_reactions_user ON post_reactions(user_id, created_at DESC);

-- ===========================================
-- COMMENTS
-- ===========================================

CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parent_comment_id UUID REFERENCES post_comments(id),
  
  content TEXT NOT NULL,
  media_urls TEXT[],
  mentioned_user_ids UUID[],
  
  reaction_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  
  is_pinned BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_comments_post ON post_comments(post_id, created_at DESC) 
  WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_user ON post_comments(user_id, created_at DESC) 
  WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_parent ON post_comments(parent_comment_id, created_at) 
  WHERE parent_comment_id IS NOT NULL AND deleted_at IS NULL;

CREATE TABLE comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reaction_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- ===========================================
-- SHARES & BOOKMARKS
-- ===========================================

CREATE TABLE post_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  sharer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  share_type VARCHAR(20) NOT NULL CHECK (
    share_type IN ('story_reshare', 'feed_repost', 'message', 'external')
  ),
  added_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE post_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  collection_name VARCHAR(100) DEFAULT 'Saved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id, collection_name)
);

CREATE INDEX idx_bookmarks_user ON post_bookmarks(user_id, collection_name, created_at DESC);

-- ===========================================
-- FOLLOWING SYSTEM
-- ===========================================

CREATE TABLE social_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  followed_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  followed_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  
  status VARCHAR(20) DEFAULT 'active' CHECK (
    status IN ('active', 'pending', 'blocked')
  ),
  
  show_in_feed BOOLEAN DEFAULT TRUE,
  enable_notifications BOOLEAN DEFAULT TRUE,
  is_close_friend BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT follow_target CHECK (
    (followed_user_id IS NOT NULL AND followed_pet_id IS NULL) OR
    (followed_user_id IS NULL AND followed_pet_id IS NOT NULL)
  ),
  UNIQUE(follower_user_id, followed_user_id),
  UNIQUE(follower_user_id, followed_pet_id)
);

CREATE INDEX idx_follows_follower ON social_follows(follower_user_id, status);
CREATE INDEX idx_follows_user ON social_follows(followed_user_id, status) 
  WHERE followed_user_id IS NOT NULL;
CREATE INDEX idx_follows_pet ON social_follows(followed_pet_id, status) 
  WHERE followed_pet_id IS NOT NULL;

-- ===========================================
-- STORIES
-- ===========================================

CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  
  story_type VARCHAR(20) NOT NULL CHECK (
    story_type IN ('photo', 'video', 'boomerang', 'text')
  ),
  media_url TEXT,
  media_thumbnail_url TEXT,
  duration_seconds INTEGER DEFAULT 5,
  
  text_overlays JSONB,
  stickers JSONB,
  
  poll_question TEXT,
  poll_options JSONB,
  question_prompt TEXT,
  
  music_title TEXT,
  music_artist TEXT,
  music_start_time INTEGER,
  
  visibility VARCHAR(20) DEFAULT 'followers' CHECK (
    visibility IN ('followers', 'close_friends', 'custom', 'public')
  ),
  visible_to_user_ids UUID[],
  hidden_from_user_ids UUID[],
  allow_replies BOOLEAN DEFAULT TRUE,
  allow_shares BOOLEAN DEFAULT TRUE,
  
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stories_author ON stories(author_user_id, created_at DESC);
CREATE INDEX idx_stories_active ON stories(is_active, expires_at) 
  WHERE is_active = TRUE;

CREATE TABLE story_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  viewer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  view_duration_seconds INTEGER,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, viewer_user_id)
);

CREATE TABLE story_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(50) NOT NULL,
  cover_url TEXT,
  story_ids UUID[] NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- GROUPS & COMMUNITIES
-- ===========================================

CREATE TABLE social_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  rules TEXT,
  
  cover_photo_url TEXT,
  icon_url TEXT,
  
  group_type VARCHAR(20) NOT NULL CHECK (
    group_type IN ('public', 'private', 'secret')
  ),
  category VARCHAR(50),
  breed_tags TEXT[],
  
  location_city VARCHAR(100),
  location_country VARCHAR(2),
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  
  require_approval BOOLEAN DEFAULT FALSE,
  allow_member_posts BOOLEAN DEFAULT TRUE,
  
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_groups_type ON social_groups(group_type);
CREATE INDEX idx_groups_category ON social_groups(category);
CREATE INDEX idx_groups_breed ON social_groups USING GIN(breed_tags);

CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES social_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  role VARCHAR(20) DEFAULT 'member' CHECK (
    role IN ('admin', 'moderator', 'member')
  ),
  status VARCHAR(20) DEFAULT 'active' CHECK (
    status IN ('active', 'pending', 'muted', 'banned')
  ),
  
  invited_by UUID REFERENCES auth.users(id),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_members_group ON group_members(group_id, status);
CREATE INDEX idx_group_members_user ON group_members(user_id, status);

-- ===========================================
-- EVENTS
-- ===========================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL,
  
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE,
  timezone VARCHAR(50) DEFAULT 'UTC',
  is_all_day BOOLEAN DEFAULT FALSE,
  
  location_name VARCHAR(200),
  location_address TEXT,
  location_city VARCHAR(100),
  location_country VARCHAR(2),
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  
  cover_photo_url TEXT,
  
  host_user_id UUID REFERENCES auth.users(id) NOT NULL,
  host_pet_id UUID REFERENCES pets(id),
  group_id UUID REFERENCES social_groups(id),
  
  max_attendees INTEGER,
  pet_species_allowed TEXT[],
  pet_size_restrictions TEXT[],
  vaccination_required BOOLEAN DEFAULT FALSE,
  
  is_free BOOLEAN DEFAULT TRUE,
  ticket_price_cents INTEGER,
  ticket_currency CHAR(3) DEFAULT 'EUR',
  
  requires_approval BOOLEAN DEFAULT FALSE,
  is_private BOOLEAN DEFAULT FALSE,
  is_cancelled BOOLEAN DEFAULT FALSE,
  cancellation_reason TEXT,
  
  going_count INTEGER DEFAULT 0,
  maybe_count INTEGER DEFAULT 0,
  interested_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(start_datetime) WHERE NOT is_cancelled;
CREATE INDEX idx_events_location ON events(location_lat, location_lng) WHERE NOT is_cancelled;
CREATE INDEX idx_events_type ON events(event_type) WHERE NOT is_cancelled;

CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  rsvp_status VARCHAR(20) NOT NULL CHECK (
    rsvp_status IN ('going', 'maybe', 'interested', 'not_going', 'waitlist')
  ),
  
  num_guests INTEGER DEFAULT 0,
  pet_ids UUID[],
  special_requests TEXT,
  
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_attendees_event ON event_attendees(event_id, rsvp_status);
CREATE INDEX idx_attendees_user ON event_attendees(user_id);

-- ===========================================
-- NOTIFICATIONS
-- ===========================================

CREATE TABLE social_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  notification_type VARCHAR(50) NOT NULL,
  
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  group_id UUID REFERENCES social_groups(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  
  title TEXT,
  body TEXT,
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON social_notifications(recipient_user_id, is_read, created_at DESC);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_notifications ENABLE ROW LEVEL SECURITY;

-- Public posts viewable by all
CREATE POLICY "Public posts viewable"
  ON social_posts FOR SELECT
  USING (
    visibility = 'public'
    AND status = 'active'
    AND deleted_at IS NULL
  );

-- Users manage own posts
CREATE POLICY "Users manage own posts"
  ON social_posts FOR ALL
  USING (author_user_id = auth.uid());

-- Users manage own reactions
CREATE POLICY "Users manage own reactions"
  ON post_reactions FOR ALL
  USING (user_id = auth.uid());

-- Users view own notifications
CREATE POLICY "Users view own notifications"
  ON social_notifications FOR SELECT
  USING (recipient_user_id = auth.uid());

-- ===========================================
-- TRIGGERS
-- ===========================================

CREATE OR REPLACE FUNCTION update_post_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE social_posts
    SET reaction_count = reaction_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE social_posts
    SET reaction_count = reaction_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_post_reaction_count
AFTER INSERT OR DELETE ON post_reactions
FOR EACH ROW EXECUTE FUNCTION update_post_reaction_count();

CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.deleted_at IS NULL THEN
    UPDATE social_posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
    UPDATE social_posts
    SET comment_count = comment_count - 1
    WHERE id = NEW.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_post_comment_count
AFTER INSERT OR UPDATE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();
