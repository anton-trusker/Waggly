# Posts - Product Requirements Document

## Overview

Posts are the core content unit of the social network, allowing pet owners to share moments, experiences, and information.

---

## Post Types

### A. Photo Posts
| Feature | Specification |
|---------|---------------|
| Multiple photos | 1-10 per post, swipeable carousel |
| Filters & Editing | Built-in photo editor with pet-focused filters |
| Pet Tagging | Tag which pets are in the photo |
| Location Tagging | Tag pet-friendly places |
| Caption | Up to 2,200 characters |
| Hashtags | Up to 30 hashtags |
| Mentions | Tag other pets/users |

### B. Video Posts
| Feature | Specification |
|---------|---------------|
| Duration | Up to 3 minutes (MVP), 10 minutes (future) |
| Editing | Trim, filters, captions |
| Thumbnails | Auto-generated or custom |
| Sound | Original audio or royalty-free music |
| Captions | Auto-generated for accessibility |

### C. Text Posts
| Feature | Specification |
|---------|---------------|
| Length | Up to 5,000 characters |
| Formatting | Bold, italic, lists, links |
| Embedded media | Images within text |
| Questions | Mark as question for community help |
| Topics | Select from predefined or create new |

### D. Poll Posts
| Feature | Specification |
|---------|---------------|
| Question | Required |
| Options | 2-4 answer options |
| Duration | 24 hours to 7 days |
| Voting | Anonymous option available |
| Results | After voting or after poll ends |

### E. Location Check-ins
| Feature | Specification |
|---------|---------------|
| Photo/Video | Required |
| Place | Auto-linked from Google Places |
| Rating | Optional 1-5 stars |
| Review | Describe experience |
| Tips | Share helpful info |

---

## Post Composition UI

```
┌─────────────────────────────────────────┐
│ Create Post                         [X] │
├─────────────────────────────────────────┤
│ [Pet Avatar + Name Selector ▼]          │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ What's on Max's mind?               │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ [📷 Photo] [🎥 Video] [📍 Location]     │
│ [😊 Feeling] [🏷️ Tag Pets]              │
├─────────────────────────────────────────┤
│ Visibility: [Public ▼]                  │
│ Comments: [Everyone ▼]                  │
├─────────────────────────────────────────┤
│       [Cancel]           [Post ✓]       │
└─────────────────────────────────────────┘
```

---

## Visibility Options

| Option | Description |
|--------|-------------|
| Public | Anyone can see |
| Followers | Only followers |
| Friends | Mutual follows only |
| Private | Only owner |
| Group | Group members only |

---

## Engagement Features

### Comments
- **Nested replies**: Up to 3 levels deep
- **Mentions**: @ mention users/pets
- **Emojis**: Full emoji support
- **Media**: Add photos to comments
- **Reactions**: React to comments
- **Pin**: Post owner can pin comments
- **Sort**: Newest, Oldest, Top

### Bookmarks/Saves
- Save posts to private collections
- Create custom collections ("Training Tips", "Recipes")
- Quick-save or choose collection
- Search within saved posts

### Sharing
| Share Type | Description |
|------------|-------------|
| Share to Story | Reshare to 24h story |
| Share to Message | Send directly in DM |
| Copy Link | Get shareable URL |
| External | Instagram, Facebook, Twitter, WhatsApp |

---

## Post Scoring (for Feed Ranking)

| Action | Points |
|--------|--------|
| Like | +1 |
| Comment | +3 |
| Share | +5 |
| Bookmark | +2 |
| Profile visit | +1 |
| Time spent | +0.1/second (max 30s) |

### Time Decay Formula
```
Score multiplier = 1 / (1 + hours_since_post / 24)^1.5
```

---

## Draft System

- **Auto-save**: Save drafts automatically
- **Scheduled Posts**: Schedule for future (Pro feature)
- **Draft Management**: View, edit, delete drafts

---

## API Specification

### Create Post
```typescript
POST /functions/v1/create-social-post
{
  author_pet_id: string,
  post_type: 'photo' | 'video' | 'text' | 'poll' | 'location_checkin',
  content_text: string,
  media: Array<{
    type: 'photo' | 'video',
    url: string,
    thumbnail?: string,
    width?: number,
    height?: number,
    duration?: number
  }>,
  tagged_pet_ids: string[],
  mentioned_user_ids: string[],
  hashtags: string[],
  location_place_id?: string,
  visibility: 'public' | 'followers' | 'friends' | 'private' | 'group',
  group_id?: string,
  allow_comments: boolean
}
```

### Response
```typescript
{
  success: true,
  post: {
    id: string,
    author_user_id: string,
    author_pet_id: string,
    post_type: string,
    content_text: string,
    media: Media[],
    created_at: string,
    engagement_score: number
  }
}
```
