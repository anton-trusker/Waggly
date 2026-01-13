# Feed Algorithm Specification

## Overview

The news feed algorithm determines which posts users see and in what order, balancing recency, engagement, and relevance.

---

## Feed Types

### A. Home Feed (Primary)
Algorithmic feed mixing followed accounts, groups, and suggestions.

### B. Following Feed
Pure chronological feed from followed accounts only.

### C. Explore Feed
Discovery-focused feed with trending content and recommendations.

---

## Home Feed Algorithm

### Scoring Formula

```sql
Score = 
  (Recency Weight × Time Decay) 
  + (Engagement Weight × Engagement Score)
  + (Relevance Weight × Interest Match)
  + (Diversity Bonus)
```

### Component Weights

| Component | Weight | Description |
|-----------|--------|-------------|
| Recency | 40% | Newer content prioritized |
| Engagement | 30% | Likes, comments, shares from connections |
| Relevance | 20% | Based on interests, breeds, location |
| Content Type | 10% | Maintain variety (photos, videos, text) |

### Time Decay Function

```typescript
function timeDecay(createdAt: Date): number {
  const hoursSincePost = (Date.now() - createdAt.getTime()) / 3600000;
  return 1 / Math.pow(1 + hoursSincePost / 24, 1.5);
}
```

### Engagement Score

```typescript
function engagementScore(post: Post): number {
  return (
    post.reaction_count * 1 +
    post.comment_count * 2 +
    post.share_count * 3 +
    post.bookmark_count * 2
  );
}
```

---

## Content Mix

| Source | Percentage |
|--------|------------|
| Followed pets/users | 60% |
| Groups joined | 25% |
| Suggested content | 10% |
| Promoted content | 5% |

---

## Database Function

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
    (
      -- Recency (40%)
      (0.4 * (1.0 / (1 + EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 86400)^1.5)) +
      
      -- Engagement (30%)
      (0.3 * (p.reaction_count + 2 * p.comment_count + 3 * p.share_count) / 
        GREATEST(1, EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600)) +
      
      -- Source relevance (20%)
      (CASE
        WHEN p.author_user_id = ANY(p_followed_user_ids) THEN 0.2
        WHEN p.author_pet_id = ANY(p_followed_pet_ids) THEN 0.2
        WHEN p.group_id = ANY(p_group_ids) THEN 0.15
        ELSE 0.05
      END) +
      
      -- Content type diversity (10%)
      (CASE p.post_type
        WHEN 'video' THEN 0.12
        WHEN 'photo' THEN 0.10
        WHEN 'poll' THEN 0.08
        ELSE 0.05
      END)
    ) AS score,
    
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
    AND p.created_at > NOW() - INTERVAL '7 days'
  ORDER BY score DESC, p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Feed Optimization

### Caching Strategy
- **Feed cache**: Pre-compute top 100 posts per user, refresh hourly
- **Engagement cache**: Update counts every 5 minutes
- **Invalidation**: On new post from followed account

### Performance Targets
- Feed load time: < 2 seconds for 20 posts
- Infinite scroll: Load next batch in < 500ms
- Real-time updates: < 500ms latency
