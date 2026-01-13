# Groups & Communities - Product Requirements Document

## Overview

Groups enable community building around shared interests, breeds, locations, and topics.

---

## Group Types

### A. Public Groups
- Anyone can join
- Searchable and discoverable
- Posts visible to all (even non-members when shared)
- Examples: "Golden Retriever Owners", "NYC Dog Parks"

### B. Private Groups
- Request to join (admin approval required)
- Not searchable, invite-only discovery
- Posts only visible to members
- Examples: "Lab Rescue Alumni", "Professional Trainers Network"

### C. Secret Groups
- Completely hidden from search
- Invitation-only
- Ultra-private discussions
- Examples: "Breed-Specific Health Support"

---

## Group Categories

| Category | Description |
|----------|-------------|
| Breed | Breed-specific communities |
| Location | City/neighborhood groups |
| Topic | Training, health, etc. |
| Organization | Rescues, shelters, clubs |

---

## Group Features

### Core Functionality
| Feature | Description |
|---------|-------------|
| Group Feed | Dedicated feed for group posts |
| Member List | View/search all members |
| Rules | Pinned rules post |
| Announcements | Admin-only pinned posts |
| Files | Share documents (PDFs, guides) |
| Events | Create events for members |

### Admin Tools
| Tool | Permission |
|------|------------|
| Approve/reject requests | Admin, Moderator |
| Remove members | Admin, Moderator |
| Delete posts | Admin, Moderator |
| Pin posts | Admin, Moderator |
| Mute members | Admin, Moderator |
| Assign moderators | Admin only |
| Edit settings | Admin only |

---

## Breed-Specific Communities

### Auto-Generated Communities
- Created for all major breeds
- Verified information from vets/breeders
- Health topic threads
- Breeder directory (vetted)
- Breed rescue listings

### Example: Golden Retriever Community
```
┌─────────────────────────────────────────┐
│ 🦮 Golden Retriever Owners              │
│ 🔓 Public · 45.2K members               │
├─────────────────────────────────────────┤
│ [About] [Discussion] [Health] [Breeders]│
├─────────────────────────────────────────┤
│ 📌 Breed Health Information             │
│ Common conditions, screening, care...   │
├─────────────────────────────────────────┤
│ [Posts Feed...]                         │
└─────────────────────────────────────────┘
```

---

## Group Discovery

### Finding Groups
- Browse by category (breed, location, topic)
- Suggested groups based on interests
- See groups your friends are in
- Trending groups
- Search by name/keyword

---

## UI Components

### Group Card (Discovery)

```
┌─────────────────────────────────────────┐
│        [Cover Photo]                    │
│                                         │
│ Golden Retriever Lovers NYC             │
│ 🔓 Public Group · 1.2K members          │
│                                         │
│ A community for Golden Retriever        │
│ owners in New York City...              │
│                                         │
│ ┌───┐┌───┐┌───┐ +98 members you follow  │
│ │ 🐕││ 🐕││ 🐕│                          │
│ └───┘└───┘└───┘                         │
│                                         │
│ [Join Group]                            │
└─────────────────────────────────────────┘
```

### Group Feed Header

```
┌─────────────────────────────────────────┐
│        [Group Cover Photo]              │
│                                         │
│ Golden Retriever Lovers NYC             │
│ 🔓 Public · 1.2K members · 15 new today │
│                                         │
│ [+Joined ✓] [Invite] [⋮ More]           │
├─────────────────────────────────────────┤
│ [📝 Create Post]                        │
├─────────────────────────────────────────┤
│ 📌 PINNED POST                          │
│ Group Rules: Please read before...      │
├─────────────────────────────────────────┤
│ [Feed Posts...]                         │
└─────────────────────────────────────────┘
```

---

## Database Schema

```sql
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

CREATE INDEX idx_groups_category ON social_groups(category);
CREATE INDEX idx_groups_breed ON social_groups USING GIN(breed_tags);
CREATE INDEX idx_groups_location ON social_groups(location_city, location_country);
CREATE INDEX idx_group_members_user ON group_members(user_id, status);
```

---

## API Specification

### Create Group
```typescript
POST /functions/v1/create-group
{
  name: 'Golden Retriever Lovers NYC',
  slug: 'golden-retriever-lovers-nyc',
  description: 'A community for Golden Retriever owners in NYC',
  rules: '1. Be respectful\n2. Only post Golden Retriever content',
  cover_photo_url: 'https://...',
  group_type: 'public',
  category: 'breed',
  breed_tags: ['golden_retriever'],
  location_city: 'New York',
  location_country: 'US',
  require_approval: true,
  allow_member_posts: true
}
```

### Join Group
```typescript
POST /api/v1/groups/:groupId/join

Response:
{
  status: 'active' | 'pending',
  member: GroupMember
}
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Groups created | 1,000+ in first month |
| Users in groups | 60% |
| Posts in groups | 40% of all posts |
| Groups per user | 3 average |
