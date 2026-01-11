# WAGGLI SOCIAL NETWORK: Complete Platform & Features Specification

**Version:** 1.0  
**Status:** Complete Feature Specification  
**Date:** January 3, 2026  
**Scope:** Full-featured pet social network built on Event Feed foundation  

---

## 🎯 VISION: "Instagram for Pets, Built by Vets"

Transform Waggli into the **world's leading pet social network** where:
- **Pet owners** build personal profiles for their pets, share daily moments, connect with other owners
- **Content creators** turn pet photos/videos into income (€500-€22K per post)
- **Pet professionals** discover, verify, and grow their clientele
- **Brands** access health-aware influencer marketing (unique to pet tech)
- **Health data** creates unprecedented insights (for insurers, researchers, pet tech companies)

**Competitive Positioning:**
- **vs Instagram/Facebook:** Generic pet content, no health context, no monetization for owners
- **vs TikTok:** Viral reach but no service discovery, no professional marketplace
- **vs Existing Pet Apps:** Fragmented (vet app, training app, social app) → Waggli unified
- **vs Waggli Today:** Static passport → Dynamic, profitable social ecosystem

**Market Opportunity:**
- 1.5B+ Instagram users; 300% growth in pet social apps (2024)
- Top pet accounts earn €10K-€22K per sponsored post
- Pet influencers: 5K-50K follower accounts get 3-5% engagement (vs 1% average)
- €285K-€1.3M revenue potential Year 1 (monetization alone)

---

## PART 1: CORE SOCIAL FEATURES

### Feature 1: Pet Profiles (Public Identity)

**Purpose:** Each pet gets a public profile page, like Instagram for that pet

**Pet Profile Structure:**
```
┌─────────────────────────────────────┐
│ [Hero Image]                        │  (Tap to edit: crop, filter, replace)
├─────────────────────────────────────┤
│ Max                                 │  (Pet name)
│ Golden Retriever • 4 years old      │  (Breed & age)
│ ★★★★★ 2.3K Followers              │  (Follower count with star rating)
├─────────────────────────────────────┤
│ 🏆 Verified Pet (QR Tag)            │  (Badge if QR tag registered)
│ 📍 Berlin, Germany                  │  (Location)
│ 💬 "Living my best golden life!"   │  (Bio - max 150 chars)
├─────────────────────────────────────┤
│ [Follow] [Message] [Share] [⋮]     │  (Action buttons)
├─────────────────────────────────────┤
│ Tabs: Posts | Photos | Videos |     │
│       Health | Achievements | Friends│
├─────────────────────────────────────┤
│ [Grid of recent posts]              │  (Infinite scroll)
└─────────────────────────────────────┘
```

**Profile Fields (Editable by Pet Owner):**
- **Name** (required): Pet's name
- **Breed** (required): Dropdown + custom entry
- **Birth Date** (optional): Auto-calculates age
- **Bio** (optional): 150-char description
- **Location** (optional): City, region
- **Hero Image** (optional): Main profile photo
- **Pronouns** (optional): He/She/They for fun
- **Personality Tags** (optional): Multi-select (Playful, Lazy, Adventurous, Shy, etc.)
- **Interests** (optional): Checkboxes (Fetch, Swimming, Training, Socializing, etc.)
- **Website/Social** (optional): Links to Instagram, TikTok, blog, etc.
- **Contact Preference** (optional): Public email, hidden, DM only

**Profile Tabs:**

**1. Posts Tab**
- Chronological feed of all user-generated posts
- Filter by type (photo, video, story)
- Infinite scroll with "Load More"

**2. Photos Tab**
- Grid view (3 columns on mobile, 4 on web)
- Tap to expand lightbox
- Photo stats (likes, comments, shares)

**3. Videos Tab**
- Video thumbnails with play icon
- Duration badge (00:15)
- Tap to open full-screen player

**4. Health Tab** (Private until shared)
- Digital passport summary (if enabled)
- Recent health updates (recovery posts, vet visits logged)
- Visible only to: Owner, Friends, or Public (configurable)
- Links to health journal entries

**5. Achievements Tab**
- Badges earned (Blood Hero, SOS Helper, Event Organizer, etc.)
- Milestones reached (1 year on Waggli, 100 followers, etc.)
- Awards/recognitions

**6. Friends Tab**
- List of pet friends (mutual follows)
- Grid view of friend pets (clickable)
- "Add Friend" suggestions (other pets in area, same breed, etc.)

**Profile Engagement Metrics:**
```
Displayed on profile:
- Followers count
- Following count
- Total posts
- Total likes received (all-time)
- Average engagement rate (calculated)
- Member since date
```

**Privacy Settings:**
- Profile visibility: Public | Friends Only | Private
- Allow messages: From anyone | Followers only | Friends only
- Show location: Full address | City only | Hidden
- Show health info: Visible | Friends only | Hidden
- Allow comments: On/Off

---

### Feature 2: Pet Feed (Timeline)

**Purpose:** Personalized, addictive feed showing posts from pets owner follows + recommendations

**Feed Algorithm (Pet-Centric Personalization):**

```typescript
// Score = Weighted combination of signals
petFeedScore = 
  0.20 * recencyScore +           // Fresh content prioritized
  0.25 * engagementScore +        // Likes, comments, saves
  0.20 * relationshipScore +      // From followed pets
  0.15 * petAffinity +            // Similar breed, age, interests
  0.10 * contentTypeAffinity +    // Video vs photo preference
  0.10 * hashtagAffinity;         // Tags user follows

// Recency: exponential decay (7-day half-life)
recencyScore = exp(-age_hours / 168);

// Engagement: (likes + comments*3 + saves*2 + shares*5) / impressions
engagementScore = min(engagement_rate, 0.25) / 0.25;

// Relationship: if followed, friend, or mutually followed
relationshipScore = 
  is_followed(0.8) + 
  is_friend(0.6) + 
  is_follower(0.3) + 
  is_mutual_friend(0.4);

// Pet Affinity: breed match, age proximity, interest overlap
petAffinity = 
  breed_match(0.3) + 
  age_proximity(0.2) + 
  interest_overlap(0.2) +
  location_proximity(0.2);

// Content Type: user's historical preference
contentTypeAffinity = 
  is_video(0.5) * user.video_preference +
  is_carousel(0.3) * user.carousel_preference +
  is_reel(0.4) * user.reel_preference;

// Hashtag: if user follows #Training, #Recovery, etc.
hashtagAffinity = user.followed_hashtags.includes(post.hashtags) ? 0.4 : 0;
```

**Feed Diversity Rules:**
```
Ensure feed contains:
- 50% from followed pets
- 20% from recommended pets (high engagement)
- 15% from pet friends
- 15% from discovery (new creators, trending)

Mix content types:
- 50% photos
- 30% short videos/reels
- 15% carousels
- 5% stories

Never show:
- Same creator twice in top 10 posts
- Old posts (>30 days) unless exceptionally high engagement
```

**Feed Cards (Post Display):**

```
┌─────────────────────────────────────┐
│ Max  @maxthegolden  ⭐ Verified    │ (Profile, handle, badge)
│ 2h ago • Berlin  [⋮ Menu]          │ (Time, location, options)
├─────────────────────────────────────┤
│ "Just finished 1-hour hike! Paws    │ (Post caption)
│ are tired but spirit is soaring 🥾" │
├─────────────────────────────────────┤
│ [Image carousel - 3/5 images] ◀ ▶  │ (Swipeable images)
│ ▪︎ ▪︎ ⚪︎ ▪︎ ▪︎                    │ (Pagination dots)
├─────────────────────────────────────┤
│ ❤️ 234  💬 45  📤 12  🔖 89        │ (Engagement buttons)
│ #Adventure #Trail #HikingDog        │ (Hashtags - clickable)
├─────────────────────────────────────┤
│ [Like] [Comment] [Share] [Save]    │ (Action buttons)
└─────────────────────────────────────┘
```

**Feed Interaction Mechanics:**

**Swipe Reactions** (Mobile):
- Swipe left: ❤️ Like
- Swipe right: 💬 Reply
- Swipe down: 🔖 Save to collection
- Swipe up: 📤 Share

**Desktop Interactions:**
- Click heart: Like/Unlike
- Click comment icon: Scroll to comments section
- Click bookmark: Save
- Click share icon: Share options

**Comments System:**
```
Sorted by: Newest | Most Liked | Most Relevant (ML-weighted)

Features:
- Threaded replies (click "Reply" on comment)
- @mentions trigger notifications
- Emoji reactions on comments
- "Mark as helpful" (boosts visibility)
- Creator can "pin" favorite comments
- Moderation: Report, hide, delete own

Comment limits:
- Max 5,000 characters
- Max 10 @mentions
- Auto-detect links (preview expansion)
```

**Story Features** (Top of feed, 24h auto-delete):
```
[Photo Stories]
- Full-screen view
- 24h auto-deletes
- Swipe to next story
- Tap left/right to navigate
- Tap bottom to open poster's profile

[Story Reactions]
- Emoji reactions (visible to poster only)
- Direct replies (sent as DM)

[Story Analytics]
- Views count
- Completion rate
- Top emoji reactions
- Replies summary
```

---

### Feature 3: Content Creation (Posts & Stories)

**Post Creation Flow:**

**Step 1: Choose Content Type**
```
┌──────────────────────────┐
│ Select Content Type      │
├──────────────────────────┤
│ ○ Photo/Carousel        │
│ ○ Short Video (Reel)    │
│ ○ Story (24h)           │
│ ○ Event/Announcement    │
│ ○ Link Share            │
└──────────────────────────┘
```

**Step 2: Add Media**

**Photo/Carousel:**
- Upload up to 10 photos (5MB each)
- Drag to reorder
- Crop/rotate each image
- Add captions per image (optional)
- Filter options (B&W, Sepia, Enhance, etc.)
- Collage option (auto-arrange multiple photos)

**Short Video (Reel):**
- Record or upload video (60 seconds max)
- Trim to length
- Auto-subtitle from speech
- Add music from Waggli library
- Text overlay (title, captions)
- Speed adjust (0.5x to 2x)
- Transition effects (optional)

**Story:**
- Single photo or short video (15s max)
- Text overlay (tap to add text, drag to position)
- Stickers: Location, Time, Poll, Q&A, Countdown
- Draw mode (freehand + shapes)
- Emoji brush
- Mention stickers (@friend's pet)

**Step 3: Add Caption & Details**

```
┌──────────────────────────┐
│ [Pet selector] Max       │ (Which pet is this about?)
│                          │
│ Caption (max 2,000 chars)│
│ "Just had the BEST day  │
│  at the dog park! 🎾"   │
│                          │
│ ✓ Tag locations/people  │ (Geotag + @mention)
│ ✓ Add hashtags (#)      │ (Auto-suggest trending)
│ ✓ Add alt text (a11y)   │ (For screen readers)
│                          │
│ Visibility: ○ Public    │
│            ○ Followers  │
│            ○ Friends    │
│            ○ Private    │
│                          │
│ Allow comments: ☑ On    │
│ Allow sharing: ☑ On     │
│                          │
│ [Post Now] [Save Draft] │
└──────────────────────────┘
```

**Hashtag System:**
- Auto-suggest trending hashtags (based on pet type, season, content)
- Search hashtags to see related posts
- Follow hashtags (e.g., #TrainingJourney sends you updates)
- Hashtag collections: "Training Tips", "Recovery Stories", "Hike Reels"

**Geotag System:**
- Add location to post (optional)
- Shows on post card: "🌍 Central Dog Park, Berlin"
- Click location to see other posts from that spot
- Location privacy: Show map pin only (not full address)

**Pet Mention System:**
- @mention other pet accounts
- Auto-suggests pets you follow
- Creates notification for mentioned pet owner
- Shows "Mentioned by [Pet Name]" on their profile

**Step 4: Post to Feed**
- Preview how post appears
- Schedule post (post now or schedule for later)
- Add to saved collection (optional)

**Drafts Management:**
- Auto-save every 30 seconds
- Access saved drafts from profile
- Edit drafted posts before publishing
- Delete drafts

---

### Feature 4: Hashtags & Discoverability

**Hashtag Features:**

**Following Hashtags:**
```
- Click any hashtag → Hashtag detail page
- Shows posts using hashtag (sorted by algorithm)
- Follower count on hashtag
- [Follow] button to add to your feed
- If following, posts with hashtag appear in your timeline
```

**Trending Hashtags:**
```
Daily updated trending:
1. #GoldenRetrieverLife (234K posts, 45K engagement)
2. #PuppyTraining (189K posts, 32K engagement)
3. #RecoveryWarrior (156K posts, 28K engagement)
4. #DogPark (142K posts, 25K engagement)
5. #ServiceDogLife (128K posts, 22K engagement)

Trending filtered by:
- User's pet type
- User's location (regional/country trends)
- User's interests
```

**Hashtag Challenges:**
```
Monthly challenges (created by Waggli or brands):
- #TrainingChallenge2026 (Jan 1-31)
  Instructions: "Teach your dog a new trick in 30 days, post weekly updates!"
  Rewards: Top 10 posts featured + €50 credit
  
- #HealthJourney (Ongoing)
  Instructions: "Share your pet's health recovery, wellness, or achievement journey"
  Rewards: Completion badge + discounts from partners
  
- #LocalPawsDay (Monthly)
  Instructions: "Feature local pet spots, dog parks, pet-friendly cafes"
  Rewards: Featured on Waggli homepage
```

**Hashtag Collections:**
```
Personalized collections based on pet & interests:
- Recovery Stories: #Recovery, #Healing, #PhysicalTherapy
- Training Tips: #Training, #Obedience, #Behavior
- Fitness & Adventure: #Hiking, #Swimming, #Agility
- Mental Health: #Anxiety, #Confidence, #DogFriends
- Special Needs: #SeniorDogs, #DisabledPets, #ThreeLeggedDog
```

---

### Feature 5: Discovery & Recommendation Engine

**Explore/Discovery Page:**

```
┌─────────────────────────────────────┐
│ Explore Waggli                      │
├─────────────────────────────────────┤
│ Search Pets, Creators, Hashtags     │ (Search bar)
├─────────────────────────────────────┤
│ TRENDING NOW                        │
│ [Carousel of trending pets/content] │
├─────────────────────────────────────┤
│ Recommended for You                 │
│ [Grid of recommended pet posts]     │
├─────────────────────────────────────┤
│ Based on Your Follows               │
│ [Pets similar to ones you follow]   │
├─────────────────────────────────────┤
│ Nearby Pets in Berlin               │
│ [Local pet accounts nearby]         │
├─────────────────────────────────────┤
│ Popular This Week                   │
│ [High-engagement posts]             │
├─────────────────────────────────────┤
│ Your Pet Type (Golden Retrievers)   │
│ [Breed-specific content]            │
└─────────────────────────────────────┘
```

**Recommendation Algorithm:**

**Pet Recommendations:**
```
Suggest pets to follow based on:
1. Breed match (same breed as user's pet): 40% weight
2. Age proximity (±2 years of user's pet): 20% weight
3. Location (same city/region): 15% weight
4. Interest overlap (same activity tags): 15% weight
5. Engagement patterns (they like what user likes): 10% weight

Show "Why recommended" tooltips:
- "Like Max? You might like Luna (also a Golden Retriever in Berlin)"
```

**Content Recommendations:**
```
Show posts from:
1. Accounts user recently engaged with
2. Trending posts in followed hashtags
3. High-engagement posts from similar pets
4. New creators in user's region
5. Posts similar to ones user saved

Personalization examples:
- If user saves recovery posts → Show more recovery content
- If user engages with training videos → Promote training creators
- If user follows #Adventure → Show hiking/outdoor posts
```

**Trending Calculation (Real-time):**
```
For each post, calculate:
- Engagement velocity: (likes + comments*3 + saves*2 + shares*5) / hours_posted
- Engagement per impression: Total engagements / total impressions
- Virality coefficient: (shares + saves) / likes (higher = more viral)
- Sentiment: Positive/negative comment ratio (AI-analyzed)

Score = (velocity * 0.4) + (per_impression * 0.3) + (virality * 0.2) + (sentiment * 0.1)

Trending posts:
- Updated hourly
- Filtered by region, pet type, hashtag
- Shows top 50 posts
```

---

### Feature 6: Notifications & Real-Time Engagement

**Notification Types:**

| Trigger | Copy | User Control | Channel |
|---------|------|--------------|---------|
| New follower | "Sarah followed Max!" | Toggle on/off | In-app + Email |
| Like on post | "Sarah liked your post" | Toggle on/off | In-app + Push |
| Comment on post | "Sarah: That's so cute!" | Toggle on/off | In-app + Push |
| Reply to your comment | "Sarah replied: 'Mine too!'" | Toggle on/off | In-app + Push |
| Mention (@Max) | "Sarah mentioned Max in a post" | Toggle on/off | In-app + Push |
| Post liked milestone | "Your post hit 100 likes! 🎉" | Toggle on/off | In-app + Email |
| Friend request | "Sarah wants to be friends with Max" | Toggle on/off | In-app + Push |
| Pet birthday | "Today is Max's 5th birthday!" | Toggle on/off | In-app + Email |
| Event reminder | "Dog park starts in 24 hours" | Toggle on/off | In-app + Push |
| Challenge reminder | "TrainingChallenge2026 ends in 7 days!" | Toggle on/off | In-app + Email |
| Follower milestone | "Max reached 1,000 followers! 🎉" | Toggle on/off | In-app + Email |
| Hashtag post | "New post in #GoldenRetrieverLife" | Toggle on/off | In-app + Push |

**Notification Management:**
```
Settings:
- Toggle each notification type on/off
- Quiet hours: 10pm-8am (no notifications except urgent)
- Digest option: Get notifications in 1 daily email
- Choose channels: In-app only, Email only, Push only, or All
- Notification frequency cap: Max 5/hour (except urgent)
```

**Real-Time Features:**
```
Live notifications (using WebSockets):
- See like counts update in real-time
- Comment count updates as people comment
- View count updates on videos
- Story views show who watched (instantly)
- "Now typing..." indicator in comments
```

---

### Feature 7: Messaging & Direct Connection

**Direct Messaging (DMs):**

```
┌─────────────────────────────────────┐
│ Messages                            │
├─────────────────────────────────────┤
│ [Search conversations]              │
├─────────────────────────────────────┤
│ Unread:                             │
│ Sarah & Buddy  "Haha, Max is..."   │ 2 hours ago
│ Mike & Spike  "Training tips?"     │ Yesterday
│                                     │
│ All:                                │
│ [List of conversations...]          │
└─────────────────────────────────────┘

Conversation View:
- Thread of messages (chronological)
- Message reactions (emoji)
- Read receipts (double check mark = read)
- Typing indicator ("Sarah is typing...")
- Shared media (photos, links)
- Call/video call options (upcoming feature)
```

**Message Features:**
- Rich text (bold, italic, link)
- Emoji support
- Photo/video sharing
- Link previews
- Message reactions
- Delete own messages
- Block/report users
- Notification sounds (configurable)

**Message Safety:**
- Age verification for minors
- Keyword filtering (prevent inappropriate contact)
- Option to disable DMs
- Report inappropriate messages
- Block users (prevents messaging)

**Group Chats (Upcoming):**
- Create group with multiple pet friends
- Group name, icon, description
- Admin controls (add/remove members, permissions)
- Shared albums
- Group notifications

---

## PART 2: ENGAGEMENT MECHANICS & VIRALITY LOOPS

### Feature 8: Collections & Saved Posts

**User Collections:**

```
Create custom collections to organize saved posts:

My Collections:
- Training Tips (23 posts)
- Recovery Journey (45 posts)
- Dog Park Recommendations (18 posts)
- Nutrition Ideas (12 posts)
- Funny Moments (67 posts)
- Fitness Inspiration (34 posts)

Features:
- Create unlimited collections (private by default)
- Make collection public (share with followers)
- Add caption to collection
- Save posts with 1 tap
- Reorder posts within collection
- Export collection as slideshow (for Instagram Stories, etc.)
- Share collection link with friends
```

**Smart Collections (Auto-generated):**
```
Waggli auto-creates collections based on saved posts:
- Posts you liked (all-time)
- Recent saves (last 30 days)
- Posts from following (timeline archive)
- Posts by pet type (all Golden Retrievers you saved)
- Posts by location (dog parks you bookmarked)
```

**Collection Stats:**
```
Creator can see on their collection:
- Total views
- Avg time spent viewing
- Saves by other users
- Shares of collection
- Comments on collection
```

---

### Feature 9: Leaderboards & Achievements

**Creator Leaderboards (Monthly Updated):**

```
By Region (e.g., Berlin):
1. Max (@maxthegolden) - 234K followers
2. Luna (@luna_adventures) - 189K followers
3. Buddy (@buddyspotlight) - 167K followers

By Engagement (Top performers):
1. Charlie (245% engagement rate)
2. Daisy (234% engagement rate)
3. Rocky (201% engagement rate)

By Pet Type:
- Golden Retrievers: [Leaderboard]
- German Shepherds: [Leaderboard]
- Cats: [Leaderboard]
- Mixed Breeds: [Leaderboard]

By Content Type:
- Training Videos: [Leaderboard]
- Recovery Stories: [Leaderboard]
- Adventure Reels: [Leaderboard]

By Growth (Fastest growing accounts):
1. Zoe (gained 50K followers this month)
2. Max Jr (gained 43K followers this month)
3. Bella (gained 41K followers this month)
```

**Achievements & Badges:**

```
First Post 🎯
- Post your first photo/video
- Reward: "New Creator" badge

Follower Milestones 📈
- 100 followers: Badge unlocked
- 1K followers: Special badge
- 10K followers: Verified badge (special treatment)
- 100K followers: Platinum badge (special page)
- 1M followers: Legend status

Engagement Milestones 💬
- 100 likes on a post
- 50 comments on a post
- 1K total likes
- 10K total likes

Content Creator 🎥
- Upload 10 photos
- Upload 10 videos/reels
- Create 10 stories

Social Butterfly 🦋
- Follow 50 other pets
- Comment on 50 posts
- Like 100 posts
- Share 20 posts

Community Helper 🤝
- Comment on 100 posts
- Mark 50 comments as "helpful"
- Help solve 10 questions
- Feature in 5 "best comment" threads

Pet Parent Pro 👑
- Add 5 posts to collections
- Create 3 personal collections
- Share collection 10 times

Trending Creator 🔥
- Get 1 post to trending
- Get 5 posts to trending
- Get 1 post to #1 trending

Health Hero 💪
- Share 5 health update posts
- Reach 50K views on health posts
- Get featured in health collection

SOS Guardian 🆘
- Help resolve 3 SOS posts
- Get thanked in 5 SOS resolution posts

Event Organizer 🎉
- Create 1 event
- Create 5 events
- Get 50+ RSVPs on event

Brand Collaborator 🤝
- Do 1 sponsored post
- Get featured by brand
- Earn €1K in sponsorships

Verified Creator ✅
- 10K followers + high engagement
- Apply for verification
- Blue checkmark badge

Showcase badges on profile:
- Display all earned badges
- New badges notify followers
- Badge gives social proof
```

---

### Feature 10: Gamification & Rewards

**Point System:**

```
Users earn Waggli Points for:

Content Creation:
- Post photo: +5 points
- Post video/reel: +10 points
- Post story: +2 points
- Create collection: +3 points
- Post reaches 100 likes: +15 points bonus
- Post reaches 1K likes: +50 points bonus

Engagement:
- Like a post: +1 point
- Comment on post: +2 points
- Share a post: +3 points
- Save a post: +1 point
- Follow a pet: +1 point

Community:
- Comment marked "helpful": +5 points
- Help answer question: +10 points
- Attend event: +10 points
- RSVP to event: +5 points
- Organize event: +25 points

Consistency:
- Daily login streak (7 days): +50 bonus
- Weekly posting (3+ posts): +25 bonus
- Monthly milestone (50+ posts): +100 bonus

Referral:
- Invite friend: +50 points each
- Friend signs up: +100 points
```

**Point Redemption:**

```
Points redeemable for:
- 50 points: €2.50 Waggli credit (products, services)
- 100 points: €5 credit
- 250 points: €15 credit
- 500 points: €30 credit
- 1000 points: €60 credit + special badge

Or exchange for:
- Featured post placement (50 points)
- Hashtag promotion (100 points)
- Collection promotion (75 points)
- Story feature (50 points)

Premium features (one-time):
- Custom pet profile theme (200 points)
- Special badge color (150 points)
- Animated profile picture (100 points)
```

**Streak System:**

```
Track daily engagement streaks:
- Daily login streak (shows in profile)
- Posting streak (if posting daily)
- Engagement streak (if engaging daily)

Rewards for streaks:
- 7-day streak: +50 points
- 30-day streak: +200 points + special badge
- 100-day streak: +500 points + "Dedicated Creator" badge
- 365-day streak: +1000 points + "Legendary" status

Visible on profile:
- Current streak counter
- Longest streak achieved
- Motivational messages to maintain streak
```

---

### Feature 11: Viral Mechanics & Growth Loops

**Viral Mechanics:**

**1. Share Loops**
```
User creates post:
1. Post appears in their followers' feed
2. Follower likes + shares to their network
3. Shared post shown to friends of follower
4. New people click through to original poster's profile
5. Some new people follow original poster
6. Loop continues exponentially
```

**2. Comment Engagement**
```
1. User comments on popular post
2. Their comment appears visible in post thread
3. Other users see their name/profile in comments
4. Click through to their profile
5. Follow them if content appeals
6. See their future posts in feed
```

**3. Hashtag Virality**
```
1. User posts with trending hashtag
2. Post appears in hashtag feed
3. Users browsing hashtag see post
4. High engagement on post (likes, comments)
5. Post bubbles to trending feeds
6. Reaches users who don't follow hashtag
7. Exponential visibility
```

**4. Referral Loop**
```
1. User invites 3 friends
2. Friends sign up (get €5 credit)
3. Original user gets €5 credit + 50 points
4. Friends create profiles, post content
5. Original user sees activity, engages
6. Friends' followers discover original user
7. Network effects multiply
```

**5. Trending Post Loop**
```
1. Post gets 50+ likes in first 30 min
2. Algorithm boosts visibility (shows more people)
3. Post reaches 200 likes by 2 hours
4. Trending post visible on Explore page
5. Thousands of new people see it
6. Engagement snowballs (1K+ likes possible)
7. Creator gets "Trending Creator" badge
8. Profile gains 100+ new followers
```

**6. Collections Loop**
```
1. User creates public collection ("Recovery Stories")
2. Collection shared in discover page
3. People save collection
4. Collection gets thousands of views
5. Posts in collection get discovered
6. Original creators of posts get followers
7. Creators thank collector in comments
8. Cross-promotion loop benefits all
```

---

## PART 3: MONETIZATION STRATEGIES

### Feature 12: Creator Monetization

**Tier 1: Micro-Influencers (1K-10K followers)**

```
Revenue Sources:
1. Affiliate Links
   - Share links to pet products in bio/posts
   - Earn 8-15% commission on sales
   - Easy setup: Waggli affiliate program
   - Potential: €50-500/month

2. Sponsored Posts
   - Local pet brands pay €50-200 per post
   - Global brands pay €200-1000 per post
   - Requirements: Public profile, engagement history
   - Potential: €500-5K/month

3. Tip Jar
   - Followers can tip 1-10 euros per post
   - Waggli takes 30% (70% to creator)
   - Requires <30 followers to start
   - Potential: €50-300/month
```

**Tier 2: Established Creators (10K-100K followers)**

```
Revenue Sources:
1. Sponsored Posts (Higher Pay)
   - Pet brands: €500-2K per post
   - Pet food companies: €1-5K per post
   - Pet tech companies: €2-8K per post
   - Average engagement rate: 3-5%
   - Potential: €3K-15K/month

2. Brand Partnerships
   - 3-month deals with brands
   - €2-10K per month retainer
   - Exclusive content + sponsored posts
   - Potential: €5K-20K/month

3. Merchandise
   - Sell branded products (t-shirts, toys, accessories)
   - Waggli marketplace integration
   - 30-40% margin
   - Potential: €1K-5K/month

4. Consulting
   - Offer training/behavior advice
   - €50-200 per hour consultation
   - Via Waggli paid messaging feature
   - Potential: €1K-5K/month

5. Digital Products
   - Sell training guides, e-books
   - Meal plans, fitness routines
   - Waggli digital store
   - Potential: €500-3K/month
```

**Tier 3: Mega-Influencers (100K-1M+ followers)**

```
Revenue Sources:
1. Premium Sponsorships
   - €5K-50K per sponsored post
   - Exclusive brand deals
   - License content for brand use
   - Potential: €20K-100K/month

2. Long-term Partnerships
   - Brand ambassador roles (€10K-100K/month)
   - Exclusive content agreements
   - Product collaborations
   - Potential: €20K-200K/month

3. Audience Monetization
   - Waggli shares advertising revenue
   - Per-view payments (€0.01-0.05 per view)
   - Engagement bonuses
   - Potential: €10K-50K/month

4. Premium Courses
   - Sell training courses (€29-99)
   - Behavioral guides, nutrition plans
   - Digital marketplace
   - Potential: €10K-50K/month

5. Speaking/Events
   - Paid appearances at pet events
   - Conference talks
   - Sponsored meet-and-greets
   - Potential: €5K-30K per event

6. Enterprise Deals
   - Partnerships with insurance companies
   - Veterinary clinic collaborations
   - Pet tech integrations
   - Potential: €50K-500K/year
```

**Creator Revenue Share Model:**

```
Waggli takes commission from sponsored content:
- Micro creators (< 10K): Waggli takes 20%
- Established (10K-100K): Waggli takes 15%
- Mega creators (100K+): Waggli takes 10%

Waggli handles:
- Brand outreach and deals
- Contract negotiation
- Payment processing (Stripe)
- Tax documentation
- Performance analytics

Creator Payouts:
- Monthly via bank transfer
- Minimum €10 payout
- Instant payout option (+2% fee)
```

---

### Feature 13: Advertising & Sponsorships

**Brand Sponsorship Opportunities:**

**Tier 1: Static Ads (CPM Model)**
```
Cost per 1000 impressions: €2-5
Placement: Sidebar, story ads, sponsored posts
Brands: Pet food, toys, supplements, pet tech
Budget: €500-5000/month per brand
```

**Tier 2: Sponsored Creator Content**
```
Brands pay creators directly:
- €100-500: Micro-influencer (micro reach)
- €500-5000: Established creator (local reach)
- €5000-50000: Mega creator (national reach)

Disclosure required: "Ad" label on post

Best for: Product launches, new pet food flavors, training courses
```

**Tier 3: Category Sponsorships**
```
Brands sponsor entire hashtags/categories:
- #TrainingChallenge sponsored by PetSmart
- #HealthJourney sponsored by VCA Hospitals
- Dog Park category sponsored by GoPro

Benefits:
- Brand logo on category page
- Promoted posts in that category
- Monthly cost: €2K-20K per brand

Waggli takes 40% commission
```

**Tier 4: Marketplace Sponsorships**
```
Pet brands pay for featured placement:
- Homepage hero spot: €5K/week
- Category hero: €2K/week
- Trending section: €1K/week
- Creator spotlight: €500/week

Rotating weekly sponsors
```

---

### Feature 14: Premium Features & Subscriptions

**Premium Pet Profile (€9.99/month)**

```
Unlock:
- Remove ads from profile
- Custom profile theme
- Animated header image
- Exclusive profile badges (gold crown)
- Priority in recommendations
- Advanced analytics
- Schedule posts (post later)
- Bulk upload (up to 100 photos at once)
- Custom landing page link
```

**Waggli Creator Pro (€19.99/month)**

```
For content creators:
- All Premium features
- Creator dashboard (analytics)
- Sponsorship opportunities direct access
- Tax documentation generation
- Built-in affiliate tool
- Video hosting (unlimited)
- Story scheduling
- Advanced filters & editing
- Early access to new features
```

**Waggli Max (€49.99/month)**

```
For professional creators/services:
- All Creator Pro features
- Team management (up to 5 team members)
- Custom branding
- White-label analytics
- Advanced scheduling
- Verified creator badge
- Priority monetization opportunities
- Personal manager for >50K followers
- API access for integrations
```

**Subscription Strategy:**
```
- Free users: 85% of user base, support with light ads
- Premium (10%): Cover infrastructure costs
- Creator Pro/Max (5%): High-value revenue

Target: 20% of engaged creators subscribe
Average creator LTV: €300-5000/year
```

---

### Feature 15: B2B Data & Insights

**Anonymized Health Data for Insurance Partners**

```
Data Waggli provides (fully anonymized):
- Health trends by breed
  e.g., "Golden Retrievers: 23% post hip dysplasia at age 4-6"
- Preventive care patterns
  e.g., "Dogs with yearly wellness exams: 40% fewer emergency visits"
- Seasonal health patterns
  e.g., "Allergies peak in spring (March-May)"
- Treatment effectiveness
  e.g., "Physical therapy recovery rates: 87% success within 8 weeks"
- Behavioral patterns
  e.g., "Dogs in dog parks: 30% lower anxiety scores"

Revenue Model:
- Annual licensing: €50K-500K per data stream
- Per-report: €2K-10K
- Custom analysis: €5K-50K per project

Insurance use cases:
- Premium pricing optimization
- Claim prediction models
- Preventive care incentives
- Risk assessment
```

**Anonymized Behavior Data for Pet Tech Companies**

```
Data Waggli provides:
- Most popular activities by season
- Trending training methods
- Product recommendation patterns
- Pet food trends
- Health concern patterns
- Content engagement patterns

Revenue:
- Annual licensing: €50K-250K
- Aggregated trend reports: €5K-20K
- Custom segment analysis: €2K-10K
```

**Market Research**

```
Waggli can sell anonymized survey data:
- Pet owner demographics
- Pet ownership patterns
- Pet spending habits
- Healthcare decision factors
- Product preferences

Clients: Pet brands, VC firms, insurance companies
Revenue: €5K-20K per report
```

---

## PART 4: TECHNICAL ARCHITECTURE

### Feature 16: Scalable Feed Architecture

**Real-Time Feed System:**

```
Feed Generation (Per User):
1. Personalization Service (ML)
   - User profile features (pet type, interests, engagement history)
   - Content features (creator, engagement rate, recency, topic)
   - Calculate relevance score for each post
   - Return top 100 candidate posts

2. Ranking Service
   - Apply weighted algorithm (shown earlier)
   - Filter for diversity (no creator twice in top 10)
   - Apply diversity rules (40% health, 30% events, etc.)
   - Sort by final score
   - Cache top 100 posts in Redis

3. Feed Delivery
   - Pagination: 10 posts on initial load
   - Infinite scroll: +5 posts per load
   - Cache expiry: 5 minutes (then recalculate)
   - Stale cache fallback: Use previous if service down

4. Real-Time Updates
   - WebSocket connection per user
   - Real-time like/comment counts
   - New post notifications
   - Story updates
   - Latency: <500ms
```

**Database Schema (Simplified):**

```sql
-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  pet_id UUID REFERENCES pets(id),
  caption TEXT,
  visibility VARCHAR(20), -- public, followers, friends, private
  media_urls JSON, -- array of CDN URLs
  hashtags TEXT[], -- array of hashtags
  geolocation POINT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  engagement_count INT, -- denormalized for performance
  INDEX created_at, -- for feed sorting
  FULLTEXT INDEX caption, hashtags -- for search
);

-- Engagements table
CREATE TABLE engagements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  post_id UUID REFERENCES posts(id),
  type VARCHAR(20), -- like, comment, save, share
  created_at TIMESTAMP,
  INDEX user_id, post_id, type, created_at
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  user_id UUID REFERENCES users(id),
  text TEXT,
  parent_comment_id UUID, -- for threaded replies
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  engagement_count INT,
  INDEX post_id, parent_comment_id, created_at
);

-- Follows table
CREATE TABLE follows (
  id UUID PRIMARY KEY,
  follower_id UUID REFERENCES users(id),
  following_pet_id UUID REFERENCES pets(id),
  created_at TIMESTAMP,
  UNIQUE(follower_id, following_pet_id),
  INDEX follower_id, following_pet_id
);

-- Feed ranking signals
CREATE TABLE engagement_signals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  post_id UUID REFERENCES posts(id),
  signal_type VARCHAR(50), -- content_type_affinity, topic_affinity, etc.
  signal_value FLOAT,
  created_at TIMESTAMP,
  INDEX user_id, post_id
);
```

**Caching Strategy (Redis):**

```
Cache layers:
1. User Feed Cache
   Key: feed:user:{user_id}:{offset}
   Value: JSON array of post IDs
   TTL: 5 minutes
   
2. Post Detail Cache
   Key: post:{post_id}
   Value: Post JSON with engagement counts
   TTL: 1 minute
   
3. Hot Post Cache
   Key: trending:posts
   Value: Top 100 posts (real-time updated)
   TTL: 30 seconds
   
4. Creator Profile Cache
   Key: creator:{pet_id}
   Value: Profile JSON with follower count
   TTL: 5 minutes
   
5. Hashtag Cache
   Key: hashtag:{hashtag_name}
   Value: Trending posts for hashtag
   TTL: 1 hour
```

**Microservices Architecture:**

```
Services:
1. Feed Service
   - Generate personalized feeds
   - Rank posts
   - Real-time updates (WebSocket)

2. Post Service
   - Create, update, delete posts
   - Media upload/processing
   - Post metadata

3. Engagement Service
   - Like, comment, save posts
   - Engagement counting
   - Real-time engagement updates

4. User Service
   - Pet profiles
   - Follow/unfollow
   - User preferences

5. Recommendation Service (ML)
   - Content recommendations
   - Creator recommendations
   - Hashtag recommendations

6. Moderation Service
   - Content moderation
   - Spam detection
   - Safety checks

7. Analytics Service
   - Creator analytics
   - Engagement metrics
   - Trending calculations

8. Monetization Service
   - Sponsorship deals
   - Payment processing
   - Creator payouts
```

---

## PART 5: CREATOR SUPPORT & TOOLS

### Feature 17: Creator Dashboard

**Analytics Dashboard:**

```
Overview Tab:
- Follower growth (chart)
- Total engagement (sum of all likes/comments)
- Reach (unique people who saw posts)
- Impressions (total post views)
- Engagement rate (%)
- Top 5 posts (highest engagement)

Posts Tab:
- All posts with stats (engagement, reach, impressions)
- Sort by: Date, Engagement, Reach, Impressions
- Detailed view: Who liked, who commented, shares

Followers Tab:
- Follower growth chart
- New followers this week
- Top followers (most engaged)
- Where followers are from (map)
- What content followers engage with most

Audience Tab:
- Follower demographics
- Pet types of followers
- Locations of followers
- Activity times (when followers are most active)
- Top interests of followers

Monetization Tab:
- Earnings this month
- Sponsored posts completed
- Affiliate clicks/revenue
- Pending payouts
- Payment history

Trends Tab:
- Trending hashtags for your pet type
- Best posting times (when to maximize engagement)
- Content type performance (photos vs videos)
- Recommended content (what's trending in your niche)
```

**Creator Tools:**

```
1. Batch Upload
   - Upload 100+ photos at once
   - AI auto-organizes
   - Add captions in bulk
   
2. Scheduling
   - Schedule posts (up to 30 days in advance)
   - Optimal posting time suggestions
   - Auto-post to linked Instagram (Pro feature)

3. Hashtag Manager
   - Save favorite hashtag sets
   - Track hashtag performance
   - Get hashtag suggestions
   - Monitor trending hashtags in your niche

4. Collaboration Tools
   - Share profile access with manager/team
   - Approve photos before posting
   - Schedule approval workflow

5. Content Calendar
   - Visual calendar of past/scheduled posts
   - Content planning
   - Collaboration notes

6. Story Templates
   - Pre-made story layouts
   - Drag-and-drop customization
   - Reusable templates saved

7. Video Editor
   - Trim, crop, speed-adjust videos
   - Add music, stickers, text
   - Auto-subtitle generation
   - AI background removal (premium)
```

---

### Feature 18: Verification & Trust Badges

**Verification Tiers:**

```
✅ Verified Creator
Requirements:
- 10K followers
- 3+ months active
- High engagement (3%+ average)
- Clean moderation record
- Complete profile
Benefits: Blue checkmark badge

⭐ Featured Creator
Requirements:
- 50K followers
- 6+ months active
- Exceptional content quality
- Engaged community
- Monetization active
Benefits: Special badge + featured on Waggli

🏆 Top Creator
Requirements:
- 100K+ followers
- 12+ months active
- Consistent high engagement
- Industry influence
- Partnerships with brands
Benefits: Premium badge + featured page + priority support

🔒 Verified Professional
Requirements (for trainers, vets, shelters):
- Professional license/certification
- Business registration
- Insurance
- Background check
- References
Benefits: Professional badge + directory listing + client booking tools
```

---

## PART 6: IMPLEMENTATION ROADMAP

### Phase 1 (Months 1-2): MVP - Core Social Features

**Sprint 1: Pet Profiles & Discovery**
- [ ] Pet profile pages (hero image, bio, follower count)
- [ ] Follow/unfollow system
- [ ] Basic pet discovery (search, nearby, by breed)
- [ ] Profile edit interface
- [ ] Profile settings (visibility, privacy)

**Sprint 2: Posts & Feed**
- [ ] Post creation (photo, carousel, caption)
- [ ] Feed view (infinite scroll)
- [ ] Basic feed algorithm (recency + engagement)
- [ ] Like/comment system
- [ ] Post detail page

**Sprint 3: Engagement**
- [ ] Notifications (follow, like, comment)
- [ ] Real-time updates (like counts)
- [ ] Collections/save posts
- [ ] Comments (threaded)
- [ ] @mentions system

**Success Metrics (End of Month 2):**
- [ ] 500 posts created
- [ ] 10K daily active users
- [ ] 5% engagement rate
- [ ] Feed loads in <2 seconds

---

### Phase 2 (Months 3-4): Advanced Features & Monetization Start

**Sprint 4: Video & Stories**
- [ ] Video upload & playback
- [ ] Stories (24h auto-delete)
- [ ] Reels/short video recording
- [ ] Story stickers & reactions

**Sprint 5: Hashtags & Discovery**
- [ ] Hashtag system
- [ ] Hashtag feed
- [ ] Trending hashtags
- [ ] Explore page recommendations

**Sprint 6: Creator Tools MVP**
- [ ] Creator dashboard (basic analytics)
- [ ] Post scheduling
- [ ] Affiliate links
- [ ] Tip jar feature
- [ ] Creator badge system

**Success Metrics (End of Month 4):**
- [ ] 5K posts/week
- [ ] 100K active users
- [ ] 1K creators monetizing
- [ ] €5K/month revenue

---

### Phase 3 (Months 5-6): Monetization & Scale

**Sprint 7: Sponsorships & Partnerships**
- [ ] Sponsor deal marketplace
- [ ] Brand outreach tools
- [ ] Media kit generator
- [ ] Contract management

**Sprint 8: Analytics & Personalization**
- [ ] Advanced analytics dashboard
- [ ] ML recommendation engine
- [ ] A/B testing for algorithm
- [ ] Content recommendations

**Sprint 9: Premium Features**
- [ ] Premium pet profile (€9.99/month)
- [ ] Creator Pro (€19.99/month)
- [ ] Subscription billing
- [ ] Payment integration

**Success Metrics (End of Month 6):**
- [ ] 20K posts/week
- [ ] 500K active users
- [ ] €50K/month revenue
- [ ] 10% creators with paid subscriptions
- [ ] 50+ brand partnerships

---

## PART 7: COMPETITIVE ADVANTAGES

**Why Waggli Beats Competitors:**

| Aspect | Instagram/Facebook | TikTok | Existing Pet Apps | Waggli |
|--------|-------|--------|-------|--------|
| **Health Awareness** | ❌ Generic | ❌ Generic | ✅ Fragmented | ✅ Integrated |
| **Service Discovery** | ❌ None | ❌ None | ✅ Limited | ✅ Full marketplace |
| **Monetization for Creators** | ✅ Some | ✅ Creator Fund | ❌ None | ✅ Complete suite |
| **Vet Verification** | ❌ None | ❌ None | ✅ Limited | ✅ Full integration |
| **Emergency/SOS Features** | ❌ None | ❌ None | ❌ None | ✅ Core feature |
| **Blood Donor Network** | ❌ None | ❌ None | ❌ None | ✅ Exclusive |
| **Insurance Partnership** | ❌ None | ❌ None | ❌ None | ✅ Revenue stream |
| **Data for B2B** | ❌ None | ❌ None | ❌ None | ✅ €50K-500K/year |

---

**Document Version:** 1.0 (Complete)  
**Specification Status:** Ready for Implementation  
**Next Step:** Detailed UI/UX mockups (separate document)