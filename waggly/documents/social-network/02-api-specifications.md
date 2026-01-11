# Social Network API Specifications

**Document Version**: 1.0  
**Last Updated**: January 3, 2026  
**Architecture**: Supabase + Edge Functions + Real-time

---

## 📡 API Overview

The Waggli Social Network API is built on Supabase's PostgreSQL database with Row-Level Security (RLS), Edge Functions for complex operations, and Supabase Realtime for live updates.

### Technology Stack
- **Database**: Supabase PostgreSQL with RLS policies
- **Backend Logic**: Supabase Edge Functions (Deno runtime)
- **Real-time**: Supabase Realtime Subscriptions
- **File Storage**: Supabase Storage with CDN
- **Client SDK**: `@supabase/supabase-js` for React Native
- **Authentication**: Supabase Auth (JWT)

---

## 🔐 Authentication & Authorization

### Authentication Pattern
All API requests require authentication via Supabase JWT token:

```typescript
import { supabase } from '@/lib/supabase';

// Initialize authenticated client
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

### Row-Level Security (RLS) Policies

#### Posts Table RLS
```sql
-- Users can view public posts
CREATE POLICY "Public posts viewable by all"
  ON social_posts FOR SELECT
  USING (
    visibility = 'public'
    AND status = 'active'
    AND deleted_at IS NULL
  );

-- Users can view posts from followed accounts
CREATE POLICY "View posts from followed accounts"
  ON social_posts FOR SELECT
  USING (
    visibility = 'followers'
    AND author_user_id IN (
      SELECT followed_user_id FROM social_follows
      WHERE follower_user_id = auth.uid()
      AND status = 'active'
    )
  );

-- Users can manage their own posts
CREATE POLICY "Users manage own posts"
  ON social_posts FOR ALL
  USING (author_user_id = auth.uid());

-- Users can view group posts if they're members
CREATE POLICY "View group posts if member"
  ON social_posts FOR SELECT
  USING (
    visibility = 'group'
    AND group_id IN (
      SELECT group_id FROM group_members
      WHERE user_id = auth.uid()
      AND status = 'active'
    )
  );
```

---

## 📝 Posts API

### Create Post

**Endpoint**: Supabase Edge Function  
**Function**: `create-social-post`  
**Method**: POST

**Request Body**:
```typescript
interface CreatePostRequest {
  author_pet_id?: string; // Optional, if posting as specific pet
  post_type: 'photo' | 'video' | 'text' | 'poll' | 'location_checkin';
  content_text?: string; // Caption
  media?: Array<{
    type: 'photo' | 'video';
    url: string;
    thumbnail?: string;
    width?: number;
    height?: number;
    duration?: number; // For videos
  }>;
  tagged_pet_ids?: string[];
  mentioned_user_ids?: string[];
  hashtags?: string[];
  location_place_id?: string;
  location_name?: string;
  location_lat?: number;
  location_lng?: number;
  poll_question?: string;
  poll_options?: Array<{option: string}>;
  poll_ends_at?: string; // ISO timestamp
  visibility: 'public' | 'followers' | 'friends' | 'private' | 'group';
  group_id?: string; // Required if visibility = 'group'
  allow_comments?: boolean;
}
```

**Response**:
```typescript
interface CreatePostResponse {
  success: boolean;
  post: {
    id: string;
    author_user_id: string;
    author_pet_id?: string;
    post_type: string;
    content_text?: string;
    media: Media[];
    created_at: string;
    engagement_score: number;
    // ... full post object
  };
}
```

**Example**:
```typescript
const { data, error } = await supabase.functions.invoke('create-social-post', {
  body: {
    author_pet_id: 'pet-uuid',
    post_type: 'photo',
    content_text: 'First day at the dog park! 🐕 #puppylove #dogpark',
    media: [{
      type: 'photo',
      url: 'https://storage.supabase.co/...',
      width: 1080,
      height: 1350
    }],
    hashtags: ['puppylove', 'dogpark'],
    location_place_id: 'place-uuid',
    visibility: 'public',
    allow_comments: true
  }
});
```

### Get Feed

**Query**: Direct Supabase query with RLS  
**Type**: Paginated

**Parameters**:
- `feed_type`: 'home' | 'following' | 'explore'
- `limit`: number (default 20, max 50)
- `offset`: number
- `last_post_id`: string (for cursor-based pagination)

**Query Example (Home Feed)**:
```typescript
// This would call Edge Function for complex algorithm
const { data: posts, error } = await supabase.functions.invoke('get-home-feed', {
  body: {
    user_id: session.user.id,
    limit: 20,
    offset: 0
  }
});
```

**Edge Function Logic** (`get-home-feed`):
```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const { user_id, limit = 20, offset = 0 } = await req.json();
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Get followed user IDs
  const { data: follows } = await supabase
    .from('social_follows')
    .select('followed_user_id, followed_pet_id')
    .eq('follower_user_id', user_id)
    .eq('status', 'active')
    .eq('show_in_feed', true);

  const followedUserIds = follows?.map(f => f.followed_user_id).filter(Boolean) || [];
  const followedPetIds = follows?.map(f => f.followed_pet_id).filter(Boolean) || [];

  // Get user's group memberships
  const { data: groupMemberships } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', user_id)
    .eq('status', 'active');

  const groupIds = groupMemberships?.map(g => g.group_id) || [];

  // Fetch posts with complex scoring
  const { data: posts } = await supabase.rpc('get_personalized_feed', {
    p_user_id: user_id,
    p_followed_user_ids: followedUserIds,
    p_followed_pet_ids: followedPetIds,
    p_group_ids: groupIds,
    p_limit: limit,
    p_offset: offset
  });

  return new Response(JSON.stringify({ posts }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

**Database Function** (`get_personalized_feed`):
```sql
CREATE OR REPLACE FUNCTION get_personalized_feed(
  p_user_id UUID,
  p_followed_user_ids UUID[],
  p_followed_pet_ids UUID[],
  p_group_ids UUID[],
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  post_id UUID,
  score DECIMAL,
  post_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS post_id,
    -- Scoring algorithm
    (
      -- Recency weight (40%)
      (0.4 * (1.0 / (1 + EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 86400)^1.5)) +
      
      -- Engagement weight (30%)
      (0.3 * (p.reaction_count + 2 * p.comment_count + 3 * p.share_count) / GREATEST(1, EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600)) +
      
      -- Source weight (20%)
      (CASE
        WHEN p.author_user_id = ANY(p_followed_user_ids) THEN 0.2
        WHEN p.author_pet_id = ANY(p_followed_pet_ids) THEN 0.2
        WHEN p.group_id = ANY(p_group_ids) THEN 0.15
        ELSE 0.05
      END) +
      
      -- Content type diversity bonus (10%)
      (CASE p.post_type
        WHEN 'video' THEN 0.12
        WHEN 'photo' THEN 0.10
        WHEN 'poll' THEN 0.08
        ELSE 0.05
      END)
    ) AS score,
    
    -- Return full post as JSONB
    row_to_json(p.*)::JSONB AS post_data
    
  FROM social_posts p
  WHERE
    p.deleted_at IS NULL
    AND p.status = 'active'
    AND (
      (p.visibility = 'public')
      OR (p.visibility = 'followers' AND p.author_user_id = ANY(p_followed_user_ids))
      OR (p.visibility = 'group' AND p.group_id = ANY(p_group_ids))
    )
    AND p.created_at > NOW() - INTERVAL '7 days' -- Only last 7 days
  ORDER BY score DESC, p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Like/React to Post

**Direct Query** (simple operation, no Edge Function needed):
```typescript
// Add reaction
const { data, error} = await supabase
  .from('post_reactions')
  .upsert({
    post_id: postId,
    user_id: session.user.id,
    reaction_type: 'love', // love, paws, hilarious, adorable, care, celebrate
  }, {
    onConflict: 'post_id,user_id'
  });

// Update post reaction count (via database trigger)
// Trigger automatically updates social_posts.reaction_count
```

**Database Trigger**:
```sql
CREATE OR REPLACE FUNCTION update_post_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE social_posts
    SET reaction_count = reaction_count + 1,
        engagement_score = calculate_engagement_score(id)
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE social_posts
    SET reaction_count = reaction_count - 1,
        engagement_score = calculate_engagement_score(id)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_reaction_count
AFTER INSERT OR DELETE ON post_reactions
FOR EACH ROW EXECUTE FUNCTION update_post_reaction_count();
```

### Comment on Post

**Request**:
```typescript
const { data, error } = await supabase
  .from('post_comments')
  .insert({
    post_id: postId,
    parent_comment_id: parentCommentId, // null for top-level comments
    content: 'So adorable! 🥰',
    mentioned_user_ids: ['@user-uuid'],
    media_urls: [] // optional photo attachments
  })
  .select()
  .single();
```

**Database Trigger for Comment Count**:
```sql
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.deleted_at IS NULL THEN
    UPDATE social_posts
    SET comment_count = comment_count + 1,
        engagement_score = calculate_engagement_score(id)
    WHERE id = NEW.post_id;
    
    -- Update reply count for parent comment
    IF NEW.parent_comment_id IS NOT NULL THEN
      UPDATE post_comments
      SET reply_count = reply_count + 1
      WHERE id = NEW.parent_comment_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' AND OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
    UPDATE social_posts
    SET comment_count = comment_count - 1,
        engagement_score = calculate_engagement_score(id)
    WHERE id = NEW.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

---

## 👥 Social Relationships API

### Follow User/Pet

**Request**:
```typescript
const { data, error } = await supabase
  .from('social_follows')
  .insert({
    follower_user_id: session.user.id,
    followed_user_id: targetUserId, // or followed_pet_id for pets
    status: isPrivateAccount ? 'pending' : 'active',
    show_in_feed: true,
    enable_notifications: true
  })
  .select()
  .single();
```

**Check if Following**:
```typescript
const { data: isFollowing } = await supabase
  .from('social_follows')
  .select('id')
  .eq('follower_user_id', session.user.id)
  .eq('followed_user_id', targetUserId)
  .eq('status', 'active')
  .maybeSingle();

const following = !!isFollowing;
```

### Get Followers/Following

**Followers**:
```typescript
const { data: followers, count } = await supabase
  .from('social_follows')
  .select(`
    follower:follower_user_id (
      id,
      email,
      profiles (full_name, avatar_url)
    )
  `, { count: 'exact' })
  .eq('followed_user_id', userId)
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .range(offset, offset + limit - 1);
```

**Following**:
```typescript
const { data: following } = await supabase
  .from('social_follows')
  .select(`
    followed_user:followed_user_id (
      id,
      profiles (full_name, avatar_url)
    ),
    followed_pet:followed_pet_id (
      id,
      name,
      species,
      primary_photo_url
    )
  `)
  .eq('follower_user_id', userId)
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

---

## 📖 Stories API

### Create Story

**Edge Function**: `create-story`

**Request**:
```typescript
const { data, error } = await supabase.functions.invoke('create-story', {
  body: {
    author_pet_id: 'pet-uuid',
    story_type: 'photo', // photo, video, boomerang, text
    media_url: 'https://storage.supabase.co/...',
    duration_seconds: 5,
    text_overlays: [{
      text: 'Morning walk 🌅',
      x: 0.5,
      y: 0.2,
      fontSize: 32,
      color: '#ffffff'
    }],
    stickers: [{
      type: 'emoji',
      value: '🐕',
      x: 0.7,
      y: 0.8
    }],
    visibility: 'followers', // followers, close_friends, custom, public
    allow_replies: true
  }
});
```

### Get Active Stories

**Query**:
```typescript
// Get stories from followed accounts
const { data: stories } = await supabase
  .from('stories')
  .select(`
    *,
    author:author_user_id (
      profiles (full_name, avatar_url)
    ),
    pet:author_pet_id (
      name,
      primary_photo_url
    )
  `)
  .in('author_user_id', followedUserIds)
  .eq('is_active', true)
  .gt('expires_at', new Date().toISOString())
  .order('created_at', { ascending: false });

// Group by author for stories ring UI
const grouped = stories.reduce((acc, story) => {
  const key = story.author_user_id;
  if (!acc[key]) acc[key] = [];
  acc[key].push(story);
  return acc;
}, {});
```

### Mark Story as Viewed

**Request**:
```typescript
const { data, error } = await supabase
  .from('story_views')
  .upsert({
    story_id: storyId,
    viewer_user_id: session.user.id,
    view_duration_seconds: viewDuration
  }, {
    onConflict: 'story_id,viewer_user_id'
  });
```

---

## 👥 Groups API

### Create Group

**Edge Function**: `create-group`

**Request**:
```typescript
const { data, error } = await supabase.functions.invoke('create-group', {
  body: {
    name: 'Golden Retriever Lovers NYC',
    slug: 'golden-retriever-lovers-nyc', // auto-generated if not provided
    description: 'A community for Golden Retriever owners in New York City',
    rules: '1. Be respectful\n2. Only post Golden Retriever content\n3. No spam',
    cover_photo_url: 'https://...',
    group_type: 'public', // public, private, secret
    category: 'breed', // breed, location, topic, organization
    breed_tags: ['golden_retriever'],
    location_city: 'New York',
    location_country: 'US',
    require_approval: true,
    allow_member_posts: true
  }
});
```

### Join Group

**Request**:
```typescript
const { data, error } = await supabase
  .from('group_members')
  .insert({
    group_id: groupId,
    user_id: session.user.id,
    role: 'member',
    status: group.require_approval ? 'pending' : 'active'
  })
  .select()
  .single();
```

### Get Group Feed

**Query**:
```typescript
const { data: posts } = await supabase
  .from('social_posts')
  .select(`
    *,
    author:author_user_id (
      profiles (full_name, avatar_url)
    ),
    pet:author_pet_id (
      name,
      primary_photo_url
    ),
    reactions:post_reactions (reaction_type, count),
    user_reaction:post_reactions!inner (reaction_type)
  `)
  .eq('group_id', groupId)
  .eq('visibility', 'group')
  .eq('status', 'active')
  .is('deleted_at', null)
  .eq('user_reaction.user_id', session.user.id) // Check if current user reacted
  .order('created_at', { ascending: false })
  .range(offset, offset + limit - 1);
```

---

## 🎉 Events API

### Create Event

**Edge Function**: `create-event`

**Request**:
```typescript
const { data, error } = await supabase.functions.invoke('create-event', {
  body: {
    title: 'Weekend Dog Park Playdate',
    slug: 'weekend-dog-park-playdate-2026-01-10',
    description: 'Bring your pups for a fun playdate!',
    event_type: 'playdate',
    start_datetime: '2026-01-10T10:00:00Z',
    end_datetime: '2026-01-10T12:00:00Z',
    timezone: 'America/New_York',
    location_name: 'Central Park Dog Run',
    location_address: '85th St Transverse, New York, NY 10024',
    location_city: 'New York',
    location_country: 'US',
    location_lat: 40.7829,
    location_lng: -73.9654,
    cover_photo_url: 'https://...',
    max_attendees: 20,
    pet_species_allowed: ['dog'],
    pet_size_restrictions: ['small', 'medium', 'large'],
    vaccination_required: true,
    is_free: true,
    requires_approval: false
  }
});
```

### RSVP to Event

**Request**:
```typescript
const { data, error } = await supabase
  .from('event_attendees')
  .upsert({
    event_id: eventId,
    user_id: session.user.id,
    rsvp_status: 'going', // going, maybe, interested, not_going, waitlist
    num_guests: 0,
    pet_ids: [myPetId],
    special_requests: 'My dog is very friendly but shy around large dogs'
  }, {
    onConflict: 'event_id,user_id'
  })
  .select()
  .single();
```

---

## 🔔 Real-time Subscriptions

### Subscribe to New Posts in Feed

```typescript
const feedSubscription = supabase
  .channel('feed-updates')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'social_posts',
      filter: `author_user_id=in.(${followedUserIds.join(',')})`
    },
    (payload) => {
      console.log('New post from followed user:', payload.new);
      // Update feed UI
    }
  )
  .subscribe();
```

### Subscribe to Post Comments

```typescript
const commentSubscription = supabase
  .channel(`post-${postId}-comments`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'post_comments',
      filter: `post_id=eq.${postId}`
    },
    (payload) => {
      if (payload.eventType === 'INSERT') {
        console.log('New comment:', payload.new);
      } else if (payload.eventType === 'DELETE') {
        console.log('Comment deleted:', payload.old);
      }
    }
  )
  .subscribe();
```

### Subscribe to Notifications

```typescript
const notificationSubscription = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'social_notifications',
      filter: `recipient_user_id=eq.${session.user.id}`
    },
    (payload) => {
      console.log('New notification:', payload.new);
      // Show toast notification
    }
  )
  .subscribe();
```

---

## 📊 Analytics & Metrics API

### Get Post Analytics

**Edge Function**: `get-post-analytics`

**Request**:
```typescript
const { data: analytics } = await supabase.functions.invoke('get-post-analytics', {
  body: {
    post_id: postId
  }
});

// Response
{
  post_id: 'uuid',
  view_count: 1250,
  reach: 980, // Unique viewers
  engagement_rate: 8.5, // (reactions + comments + shares) / reach * 100
  reactions_breakdown: {
    love: 45,
    paws: 20,
    adorable: 15,
    hilarious: 8
  },
  comments_count: 12,
  shares_count: 5,
  bookmarks_count: 18,
  top_locations: ['New York', 'Los Angeles', 'Chicago'],
  peak_engagement_hour: 18, // 6 PM
  viewer_demographics: {
    by_species: { dog: 70, cat: 25, other: 5 }
  }
}
```

### Get Profile Analytics

**Request**:
```typescript
const { data } = await supabase.functions.invoke('get-profile-analytics', {
  body: {
    user_id: userId,
    period: 'week' // day, week, month, year
  }
});

// Response
{
  follower_growth: +15, // Net new followers this period
  post_count: 8,
  total_reach: 5420,
  total_engagements: 340,
  avg_engagement_rate: 6.3,
  top_performing_post: { id: '...', engagement_rate: 12.5 },
  profile_views: 125
}
```

---

## 🔍 Search API

### Search Posts

**Edge Function**: `search-posts`

**Request**:
```typescript
const { data } = await supabase.functions.invoke('search-posts', {
  body: {
    query: 'golden retriever puppy',
    filters: {
      post_type: ['photo', 'video'],
      date_range: {
        start: '2026-01-01',
        end: '2026-01-31'
      },
      location: {
        city: 'New York',
        radius_km: 50
      },
      hashtags: ['puppy', 'goldenretriever'],
      has_media: true
    },
    sort_by: 'relevance', // relevance, recent, popular
    limit: 20,
    offset: 0
  }
});
```

**Database Full-Text Search Function**:
```sql
-- Add full-text search columns
ALTER TABLE social_posts ADD COLUMN search_vector tsvector;

-- Create trigger to update search vector
CREATE OR REPLACE FUNCTION update_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.content_text, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.hashtags, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_search_vector
BEFORE INSERT OR UPDATE ON social_posts
FOR EACH ROW EXECUTE FUNCTION update_post_search_vector();

-- Create GIN index for fast full-text search
CREATE INDEX idx_social_posts_search ON social_posts USING GIN(search_vector);
```

### Search Users/Pets

**Query**:
```typescript
// Search users
const { data: users } = await supabase
  .from('profiles')
  .select('*')
  .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
  .limit(20);

// Search pets
const { data: pets } = await supabase
  .from('pets')
  .select('*, owner:owner_user_id(profiles(full_name))')
  .ilike('name', `%${query}%`)
  .limit(20);
```

---

## 📤 Media Upload API

### Upload Photo/Video

**Process**:
1. Client uploads to Supabase Storage
2. Get public URL
3. Create post with media URL

**Example**:
```typescript
// 1. Upload file
const file = {
  uri: imageUri,
  name: `post-${Date.now()}.jpg`,
  type: 'image/jpeg'
};

const { data: uploadData, error: uploadError } = await supabase.storage
  .from('post-media')
  .upload(`${session.user.id}/${file.name}`, file);

if (uploadError) throw uploadError;

// 2. Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('post-media')
  .getPublicUrl(uploadData.path);

// 3. Create post with media
const { data: post } = await supabase.functions.invoke('create-social-post', {
  body: {
    post_type: 'photo',
    content_text: 'Check this out!',
    media: [{
      type: 'photo',
      url: publicUrl,
      width: 1080,
      height: 1350
    }],
    visibility: 'public'
  }
});
```

### Video Processing (Edge Function)

**Function**: `process-video`
- Generates thumbnail
- Compresses video for mobile
- Extracts metadata (duration, dimensions)

```typescript
// This would be triggered automatically after video upload
// Uses FFmpeg in Edge Function
```

---

## 🚀 Performance Optimization

### Feed Caching Strategy

1. **Pre-compute feeds** for active users (daily batch job)
2. **Cache in `feed_cache` table**
3. **Real-time updates** via Supabase Realtime for new posts
4. **Invalidate cache** when user follows/unfollows

### Database Indexing

All critical queries have compound indexes:
- `idx_social_posts_author_user` (author_user_id, created_at DESC)
- `idx_social_posts_engagement` (engagement_score DESC, created_at DESC)
- `idx_social_follows_follower` (follower_user_id, status)
- `idx_post_comments_post` (post_id, created_at DESC)

### CDN & Image Optimization

- All media served through Supabase Storage CDN
- Auto-generated thumbnails for faster loading
- Lazy loading for images in feed
- Progressive JPEG encoding

---

This API specification provides the foundation for implementing all social network features in Waggli. All endpoints are designed to work with Supabase's security model and Row-Level Security policies.
