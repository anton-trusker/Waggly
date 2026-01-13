# Stories - Product Requirements Document

## Overview

Stories are 24-hour ephemeral content pieces that drive daily engagement and casual sharing.

---

## Story Features

### Content Types

| Type | Description |
|------|-------------|
| Photo | Upload photos with overlays |
| Video | Up to 15 seconds per clip |
| Boomerang | Auto-looping short videos |
| Text | Text on colored background |
| Poll | Quick yes/no or multiple choice |
| Question | Followers can respond |

---

## Creation Tools

### Text Overlay
- Multiple fonts
- Colors (full palette)
- Sizes (small, medium, large)
- Alignment (left, center, right)
- Background colors

### Stickers
- Emojis
- GIFs (via GIPHY)
- Location tags
- Pet tags
- Polls
- Questions
- Countdowns
- Music

### Drawing Tools
- Freehand brush
- Highlighter
- Eraser
- Color picker

### Filters
- Pet-themed AR filters (dog ears, cat whiskers)
- Color filters (warm, cool, vintage)
- Blur effects
- Time/date stamp

### Music
- Royalty-free library
- Add background music
- Music clips (15s)

---

## Privacy Settings

| Setting | Options |
|---------|---------|
| Post to | All Followers, Close Friends, Custom list |
| Hide from | Select specific followers |
| Allow replies | Everyone, Followers, Off |
| Allow shares | Yes/No |

---

## Story Viewing

### Viewer Experience

```
┌─────────────────────────────────────────┐
│ ━━━━━━━╸╸╸╸╸╸╸━━━━━━━━                  │ ← Progress bars
│                                         │
│ [Avatar] Max · 2h ago              [X]  │ ← Header
│                                         │
│                                         │
│                                         │
│        [Story Content]                  │
│                                         │
│                                         │
│                                         │
│ Max is at Central Park! 🌳              │ ← Overlays
│                                         │
│ ❤️ 45    💬 Reply...                    │ ← Reactions
└─────────────────────────────────────────┘
```

### Interactions
- **Tap right**: Next story
- **Tap left**: Previous story
- **Hold**: Pause
- **Swipe up**: View details/responses
- **Swipe down**: Close viewer
- **Swipe left**: Next person's stories
- **Swipe right**: Previous person's stories

---

## Story Highlights

| Feature | Description |
|---------|-------------|
| Permanent collections | Save stories to profile |
| Cover image | Custom cover for each highlight |
| Naming | Name each collection |
| Reorder | Drag to reorder highlights |
| Edit | Add/remove stories |

---

## Stories Bar UI

```
┌──────────────────────────────────────────────────────┐
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ────→     │
│ │ + │ │🐕 │ │🐈 │ │🐕 │ │🐇 │ │🐕 │               │
│ │Your│ │Max │ │Luna│ │Spot│ │Hop │ │Bella│ (scroll)  │
│ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘           │
└──────────────────────────────────────────────────────┘
```

### Visual Specs
- Item size: 80x100px
- Avatar: 64px
- Story ring: 3px gradient (unread), gray (viewed)
- "Your Story": + icon, dashed border

---

## Database Schema

```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  
  story_type VARCHAR(20) NOT NULL,
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
  
  visibility VARCHAR(20) DEFAULT 'followers',
  visible_to_user_ids UUID[],
  hidden_from_user_ids UUID[],
  allow_replies BOOLEAN DEFAULT TRUE,
  allow_shares BOOLEAN DEFAULT TRUE,
  
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
```

---

## API Specification

### Create Story
```typescript
POST /functions/v1/create-story
{
  author_pet_id: string,
  story_type: 'photo' | 'video' | 'boomerang' | 'text',
  media_url: string,
  duration_seconds: 5,
  text_overlays: [
    { text: 'Morning walk 🌅', x: 0.5, y: 0.2, fontSize: 32, color: '#ffffff' }
  ],
  stickers: [
    { type: 'emoji', value: '🐕', x: 0.7, y: 0.8 }
  ],
  visibility: 'followers',
  allow_replies: true
}
```

### Get Active Stories
```typescript
GET /api/v1/stories/active
?followed_user_ids=uuid1,uuid2

Response:
{
  stories: Story[],
  grouped_by_user: {
    [user_id]: Story[]
  }
}
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Users posting stories | 40% weekly |
| Stories viewed per session | 5+ |
| Story to post conversion | 30% |
| Session increase from stories | 15% |
