# WAGGLI SOCIAL NETWORK: Technical Specifications & API Reference

**Version:** 1.0  
**Status:** Implementation Guide  
**Date:** January 3, 2026  

---

## API ARCHITECTURE OVERVIEW

**Base URL:** `https://api.waggli.com/v1`  
**Authentication:** JWT Bearer Token  
**Content-Type:** `application/json`  
**Rate Limit:** 1000 requests/hour per user

---

## CORE API ENDPOINTS

### Authentication Endpoints

**Login/Signup**
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "secure_password"
}

Response 200:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

---

### Pet Profile Endpoints

**Get Pet Profile**
```
GET /pets/{pet_id}

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "owner_id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Max",
  "breed": "Golden Retriever",
  "birth_date": "2022-01-15",
  "bio": "Living my best golden life!",
  "hero_image_url": "https://cdn.waggli.com/pets/550e8400.jpg",
  "location": {
    "latitude": 52.5200,
    "longitude": 13.4050,
    "city": "Berlin",
    "country": "Germany"
  },
  "verified": true,
  "followers_count": 2345,
  "following_count": 456,
  "posts_count": 89,
  "is_following": false,
  "is_friend": false,
  "verification_badge": "verified_pet",
  "created_at": "2025-06-01T12:00:00Z"
}
```

**Create/Update Pet Profile**
```
POST /pets
PATCH /pets/{pet_id}

{
  "name": "Max",
  "breed": "Golden Retriever",
  "birth_date": "2022-01-15",
  "bio": "Living my best golden life!",
  "location": {
    "city": "Berlin",
    "country": "Germany"
  },
  "privacy_setting": "public"
}

Response 200/201: [Pet object as above]
```

**Follow/Unfollow Pet**
```
POST /pets/{pet_id}/follow
DELETE /pets/{pet_id}/follow

Response 200:
{
  "following": true,
  "followers_count": 2346
}
```

**Get Pet Followers**
```
GET /pets/{pet_id}/followers?limit=20&offset=0

Response 200:
{
  "data": [
    {
      "id": "user_uuid",
      "pet_id": "pet_uuid",
      "name": "Luna",
      "profile_image": "url",
      "verified": true
    }
  ],
  "pagination": {
    "total": 2345,
    "limit": 20,
    "offset": 0
  }
}
```

---

### Post Endpoints

**Create Post**
```
POST /posts

{
  "pet_id": "550e8400-e29b-41d4-a716-446655440000",
  "caption": "Just had an amazing hike! 🥾",
  "media_urls": [
    "https://cdn.waggli.com/posts/image1.jpg",
    "https://cdn.waggli.com/posts/image2.jpg"
  ],
  "hashtags": ["hiking", "goldensofinstagram", "adventure"],
  "geolocation": {
    "latitude": 52.5200,
    "longitude": 13.4050,
    "location_name": "Grunewald Forest, Berlin"
  },
  "visibility": "public",
  "allow_comments": true,
  "allow_shares": true
}

Response 201:
{
  "id": "post_uuid",
  "pet_id": "pet_uuid",
  "caption": "Just had an amazing hike! 🥾",
  "media_urls": [...],
  "hashtags": ["hiking", "goldensofinstagram", "adventure"],
  "likes_count": 0,
  "comments_count": 0,
  "shares_count": 0,
  "liked_by_me": false,
  "saved_by_me": false,
  "created_at": "2026-01-03T12:30:00Z"
}
```

**Get Feed**
```
GET /feed?limit=10&offset=0

Response 200:
{
  "data": [
    {
      "id": "post_uuid",
      "pet": {
        "id": "pet_uuid",
        "name": "Max",
        "profile_image": "url",
        "verified": true
      },
      "caption": "Just had an amazing hike!",
      "media": [
        {
          "type": "image",
          "url": "https://cdn.waggli.com/posts/image.jpg",
          "width": 1080,
          "height": 1080
        }
      ],
      "hashtags": ["hiking", "goldensofinstagram"],
      "geolocation": {
        "city": "Berlin",
        "location_name": "Grunewald Forest"
      },
      "likes_count": 234,
      "comments_count": 45,
      "shares_count": 12,
      "liked_by_me": false,
      "saved_by_me": false,
      "engagement_rate": 0.056,
      "created_at": "2026-01-03T12:30:00Z",
      "time_ago": "2h ago"
    }
  ],
  "pagination": {
    "total": 50000,
    "limit": 10,
    "offset": 0,
    "has_next": true
  },
  "algorithm_metadata": {
    "ranking_score": 0.89,
    "reason": "Popular in your interests"
  }
}
```

**Get Post Detail**
```
GET /posts/{post_id}

Response 200:
{
  "id": "post_uuid",
  "pet": {
    "id": "pet_uuid",
    "name": "Max",
    "profile_image": "url"
  },
  "caption": "Just had an amazing hike!",
  "media": [...],
  "hashtags": ["hiking"],
  "likes_count": 234,
  "comments_count": 45,
  "liked_by_me": false,
  "saved_by_me": false,
  "created_at": "2026-01-03T12:30:00Z",
  "comments": [
    {
      "id": "comment_uuid",
      "user": {
        "id": "user_uuid",
        "name": "Luna",
        "profile_image": "url"
      },
      "text": "This looks amazing!",
      "likes_count": 5,
      "created_at": "2026-01-03T13:00:00Z",
      "replies": [
        {
          "id": "reply_uuid",
          "user": {...},
          "text": "Thanks!",
          "likes_count": 1,
          "created_at": "2026-01-03T13:15:00Z"
        }
      ]
    }
  ]
}
```

**Like Post**
```
POST /posts/{post_id}/like
DELETE /posts/{post_id}/like

Response 200:
{
  "liked": true,
  "likes_count": 235
}
```

**Delete Post**
```
DELETE /posts/{post_id}

Response 204: No Content
```

---

### Comment Endpoints

**Add Comment**
```
POST /posts/{post_id}/comments

{
  "text": "This looks amazing!",
  "parent_comment_id": null // for replies, set to parent comment ID
}

Response 201:
{
  "id": "comment_uuid",
  "post_id": "post_uuid",
  "user": {
    "id": "user_uuid",
    "name": "Sarah",
    "profile_image": "url"
  },
  "text": "This looks amazing!",
  "likes_count": 0,
  "liked_by_me": false,
  "created_at": "2026-01-03T13:00:00Z"
}
```

**Get Comments (Paginated)**
```
GET /posts/{post_id}/comments?limit=20&offset=0

Response 200:
{
  "data": [
    {
      "id": "comment_uuid",
      "user": {...},
      "text": "This looks amazing!",
      "likes_count": 5,
      "created_at": "2026-01-03T13:00:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0
  }
}
```

**Like Comment**
```
POST /comments/{comment_id}/like
DELETE /comments/{comment_id}/like

Response 200:
{
  "liked": true,
  "likes_count": 6
}
```

---

### Hashtag Endpoints

**Get Hashtag**
```
GET /hashtags/{hashtag_name}

Response 200:
{
  "name": "hiking",
  "post_count": 5234,
  "follower_count": 1234,
  "is_following": false,
  "trending_rank": 3,
  "trending_position": "up",
  "created_at": "2025-01-01T00:00:00Z"
}
```

**Get Posts by Hashtag**
```
GET /hashtags/{hashtag_name}/posts?limit=10&offset=0

Response 200:
{
  "data": [
    {
      "id": "post_uuid",
      "pet": {...},
      "caption": "...",
      "likes_count": 234,
      "created_at": "2026-01-03T12:30:00Z"
    }
  ],
  "pagination": {...}
}
```

**Follow Hashtag**
```
POST /hashtags/{hashtag_name}/follow
DELETE /hashtags/{hashtag_name}/follow

Response 200:
{
  "following": true,
  "follower_count": 1235
}
```

**Get Trending Hashtags**
```
GET /trending/hashtags?limit=10

Response 200:
{
  "data": [
    {
      "rank": 1,
      "name": "puppytraining",
      "post_count": 8934,
      "trending_velocity": 1.45,
      "trending_position": "up"
    },
    {
      "rank": 2,
      "name": "recoveryjourney",
      "post_count": 7231,
      "trending_velocity": 1.23,
      "trending_position": "down"
    }
  ]
}
```

---

### Engagement Endpoints

**Save Post to Collection**
```
POST /collections/{collection_id}/posts/{post_id}

Response 201:
{
  "collection_id": "collection_uuid",
  "post_id": "post_uuid",
  "added_at": "2026-01-03T12:30:00Z"
}
```

**Get Saved Posts/Collections**
```
GET /me/collections

Response 200:
{
  "data": [
    {
      "id": "collection_uuid",
      "name": "Training Tips",
      "description": "Useful training techniques",
      "is_public": false,
      "post_count": 23,
      "created_at": "2025-12-01T00:00:00Z"
    }
  ]
}
```

---

### Messaging Endpoints

**Send Message**
```
POST /messages

{
  "recipient_id": "user_uuid",
  "text": "Hey! Love your hiking posts!",
  "media_urls": [] // optional
}

Response 201:
{
  "id": "message_uuid",
  "sender_id": "my_user_id",
  "recipient_id": "user_uuid",
  "text": "Hey! Love your hiking posts!",
  "read": false,
  "created_at": "2026-01-03T12:30:00Z"
}
```

**Get Conversations**
```
GET /messages/conversations?limit=20

Response 200:
{
  "data": [
    {
      "user_id": "user_uuid",
      "name": "Sarah",
      "profile_image": "url",
      "last_message": "That's awesome!",
      "last_message_at": "2026-01-03T12:30:00Z",
      "unread_count": 2
    }
  ]
}
```

**Get Conversation Thread**
```
GET /messages/conversations/{user_id}?limit=50&offset=0

Response 200:
{
  "data": [
    {
      "id": "message_uuid",
      "sender_id": "my_user_id",
      "text": "Hey! Love your hiking posts!",
      "read": true,
      "created_at": "2026-01-03T12:30:00Z"
    }
  ]
}
```

---

### Notification Endpoints

**Get Notifications**
```
GET /notifications?limit=20

Response 200:
{
  "data": [
    {
      "id": "notification_uuid",
      "type": "like", // like, comment, follow, mention
      "actor": {
        "id": "user_uuid",
        "name": "Sarah",
        "profile_image": "url"
      },
      "object": {
        "type": "post",
        "id": "post_uuid"
      },
      "message": "Sarah liked your post",
      "read": false,
      "created_at": "2026-01-03T12:30:00Z"
    }
  ],
  "pagination": {...}
}
```

**Mark Notification as Read**
```
PATCH /notifications/{notification_id}

{
  "read": true
}

Response 200:
{
  "id": "notification_uuid",
  "read": true
}
```

**Mark All as Read**
```
POST /notifications/mark-all-read

Response 200:
{
  "marked_count": 12
}
```

---

### Creator Analytics Endpoints

**Get Creator Dashboard**
```
GET /me/analytics/dashboard

Response 200:
{
  "summary": {
    "total_followers": 2345,
    "total_posts": 89,
    "total_engagement": 5678,
    "avg_engagement_rate": 0.045,
    "total_reach": 89000,
    "total_impressions": 234000
  },
  "followers_growth": {
    "this_week": 125,
    "this_month": 450,
    "growth_rate": 0.23
  },
  "top_posts": [
    {
      "id": "post_uuid",
      "caption": "...",
      "likes": 234,
      "comments": 45,
      "shares": 12,
      "reach": 8900,
      "engagement_rate": 0.089
    }
  ],
  "posting_times": {
    "best_time": "2pm UTC",
    "best_day": "Saturday"
  }
}
```

**Get Post Analytics**
```
GET /posts/{post_id}/analytics

Response 200:
{
  "post_id": "post_uuid",
  "likes": 234,
  "comments": 45,
  "shares": 12,
  "reach": 8900,
  "impressions": 15000,
  "engagement_rate": 0.089,
  "save_rate": 0.012,
  "share_rate": 0.008,
  "top_likers": [
    {
      "user_id": "user_uuid",
      "name": "Sarah",
      "profile_image": "url"
    }
  ]
}
```

---

### Discovery Endpoints

**Get Trending**
```
GET /discover/trending?type=posts&limit=20

Response 200:
{
  "data": [
    {
      "id": "post_uuid",
      "pet": {...},
      "caption": "...",
      "trending_rank": 1,
      "trending_score": 0.95,
      "engagement_velocity": 1.45,
      "likes": 234
    }
  ]
}
```

**Get Recommendations**
```
GET /discover/recommendations?type=creators&limit=10

Response 200:
{
  "data": [
    {
      "pet_id": "pet_uuid",
      "name": "Luna",
      "profile_image": "url",
      "breed": "Golden Retriever",
      "location": "Berlin, Germany",
      "followers": 1234,
      "recommendation_reason": "Similar breed to pets you follow",
      "preview_posts": [...]
    }
  ]
}
```

**Search**
```
GET /search?q=training&type=all&limit=20

Response 200:
{
  "posts": [
    {
      "id": "post_uuid",
      "caption": "Training tips for puppies",
      "likes": 234
    }
  ],
  "creators": [
    {
      "pet_id": "pet_uuid",
      "name": "TrainingPro",
      "followers": 5000
    }
  ],
  "hashtags": [
    {
      "name": "puppytraining",
      "post_count": 8934
    }
  ]
}
```

---

## WEBSOCKET REAL-TIME EVENTS

**Connection**
```
wss://api.waggli.com/v1/realtime
Headers: Authorization: Bearer {token}
```

**Subscribe to Post Updates**
```
{
  "action": "subscribe",
  "type": "post_engagement",
  "post_id": "post_uuid"
}

Event received (when someone likes):
{
  "type": "post_engagement",
  "event": "like",
  "post_id": "post_uuid",
  "user_id": "user_uuid",
  "likes_count": 235
}
```

**Subscribe to Feed Updates**
```
{
  "action": "subscribe",
  "type": "feed",
  "user_id": "my_user_id"
}

Event received (when followed pet posts):
{
  "type": "new_post",
  "post_id": "post_uuid",
  "pet_id": "pet_uuid",
  "action": "insert_at_top"
}
```

---

## ERROR RESPONSES

**400 Bad Request**
```
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Caption must be less than 2000 characters",
    "field": "caption"
  }
}
```

**401 Unauthorized**
```
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

**403 Forbidden**
```
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to delete this post"
  }
}
```

**404 Not Found**
```
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Post not found"
  }
}
```

**429 Rate Limited**
```
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Try again in 60 seconds"
  }
}
```

**500 Server Error**
```
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong. Our team has been notified."
  }
}
```

---

## PAGINATION

**Standard Pagination**
```
GET /resource?limit=20&offset=0

Response:
{
  "data": [...],
  "pagination": {
    "total": 1000,
    "limit": 20,
    "offset": 0,
    "has_next": true,
    "has_previous": false,
    "next_url": "https://api.waggli.com/v1/resource?limit=20&offset=20",
    "previous_url": null
  }
}
```

---

## DATA STRUCTURES

**Pet Object**
```json
{
  "id": "uuid",
  "owner_id": "uuid",
  "name": "Max",
  "breed": "Golden Retriever",
  "birth_date": "2022-01-15",
  "bio": "Living my best golden life!",
  "hero_image_url": "https://cdn.waggli.com/pets/550e8400.jpg",
  "location": {
    "latitude": 52.5200,
    "longitude": 13.4050,
    "city": "Berlin",
    "country": "Germany"
  },
  "verified": true,
  "followers_count": 2345,
  "following_count": 456,
  "posts_count": 89,
  "is_following": false,
  "created_at": "2025-06-01T12:00:00Z"
}
```

**Post Object**
```json
{
  "id": "uuid",
  "pet_id": "uuid",
  "caption": "Just had an amazing hike!",
  "media_urls": ["https://cdn.waggli.com/posts/image.jpg"],
  "hashtags": ["hiking", "goldensofinstagram"],
  "geolocation": {
    "latitude": 52.5200,
    "longitude": 13.4050,
    "location_name": "Grunewald Forest"
  },
  "visibility": "public",
  "likes_count": 234,
  "comments_count": 45,
  "shares_count": 12,
  "liked_by_me": false,
  "saved_by_me": false,
  "created_at": "2026-01-03T12:30:00Z"
}
```

---

**Document Status:** Ready for Implementation  
**Next Step:** Implement endpoints in order of priority (Profiles → Posts → Feed → Engagement)