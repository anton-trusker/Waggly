# WAGGLI EVENT FEED: Detailed Feature Specifications

---

## 📋 FEATURE SPECIFICATION MATRIX

### Feature 1: Event Creation Form (MVP)

**Component:** Multi-step form (mobile & web)  
**Goal:** Enable any user to create an event in <2 minutes  

**Step 1: Event Type Selection**
```
Radio buttons:
○ Health & Wellness (recovery journey, training win, nutrition update)
○ SOS & Emergency (lost pet, injured, urgent funds)
○ Blood Donation (register as donor, clinic requests)
○ Local Event (dog park, training class, adoption event)
```

**Step 2: Pets Selection**
```
- Multi-select checkboxes of user's existing pets
- If creating for another pet (friend's pet): "Add guest pet" → name, species, breed
- Required: At least 1 pet selected
```

**Step 3: Content Creation**
```
- Rich text editor (links, @mentions, hashtags)
- Photo uploader (up to 10 photos, drag-to-reorder)
- Video upload (up to 60 seconds, auto-compress)
- Voice note option (up to 2 minutes)
- Character limit: 2,000 max
```

**Step 4: Event-Specific Fields (conditional)**

For **SOS:**
- Urgency level: ⚫ Immediate | 🟠 Within 24h | 🟡 Open
- Situation: Lost | Injured | Urgent Funds | Other
- Location: Map pin required
- Contact: Phone (optional), Email (hidden by default)

For **Health & Wellness:**
- Health topic: Training | Recovery | Nutrition | Fitness | Behavior | Mental Health | Other
- Visibility: Public | Followers | Friends | Private
- Allow recommendations: Yes/No (toggle to allow affiliate links)

For **Blood Donation:**
- Donor or Clinic: "I'm registering as a donor" vs "I'm requesting blood"
- Blood type: A | B | AB | Other (with auto-suggest from vet records)
- Availability: Weekly, Bi-weekly, Monthly (frequency picker)

For **Local Event:**
- Event name (required)
- Date & time (required)
- Location: Address + map pin (required)
- Max attendees: Number or "Unlimited" toggle
- RSVP deadline: Same day, 24h before, 3 days before
- Cost: Free | Paid (if paid → enter amount in EUR)
- Event category: Dog Park | Training | Adoption | Social | Competition | Other

**Step 5: Review & Post**
```
Preview how event looks in feed
- Read ToS checkbox
- "Post Now" button
- "Save Draft" option (auto-saves to local storage)
```

**Accessibility:**
- Mobile-first responsive design
- Large touch targets (44px minimum)
- Clear error messages (not just red X)
- Keyboard navigation fully supported
- Screen reader compatible (ARIA labels)

**Mobile UX Considerations:**
- Stepper progress indicator (Step 1/5 at top)
- Back button to previous step
- Auto-save draft as you type
- Scrolling to error fields

---

### Feature 2: Event Feed

**Component:** Infinite scroll feed (home page)

**Feed Algorithm (Weighted Ranking)**

```typescript
eventScore = 
  0.15 * recencyScore +
  0.20 * engagementScore +
  0.25 * socialGraphScore +
  0.15 * userBehaviorScore +
  0.15 * locationScore +
  0.10 * trustScore;

// Recency: exponential decay over 7 days
recencyScore = exp(-age_hours / 168);

// Engagement: (likes + comments*3 + saves*2 + shares*5) / impressions
engagementScore = min(engagement_rate, 0.20) / 0.20;

// Social graph: if from followed, friend, or similar user
socialGraphScore = is_followed(0.8) + is_friend(0.5) + is_similar(0.3);

// User behavior: if topic matches user's interests
userBehaviorScore = topic_affinity[user_id][event_type];

// Location: distance penalty
locationScore = max(0, 1 - (distance_km / user_radius_km));

// Trust: verification status
trustScore = is_verified_profile(0.3) + account_age_months(0.2);
```

**Feed Diversity Rules**
```
Ensure user sees:
- At least 1 SOS per session (if any unresolved nearby)
- Mix of event types (40% health, 30% events, 20% SOS, 10% blood donor)
- Mix of creators (60% friends/followers, 40% discovery)
```

**Feed Items (Card Design)**
```
┌─────────────────────────────────────────┐
│ [Profile] Creator Name     [Follow]     │  Height: 40px
├─────────────────────────────────────────┤
│ "Luna recovering from surgery—2 weeks  │
│  post-op and already 30-min walks!"    │  Height: 60px
├─────────────────────────────────────────┤
│ [Image carousel] ◀ [5 photos] ▶         │  Height: 300px
├─────────────────────────────────────────┤
│ ❤️ 123  💬 45  🔖 89  📤 12            │  Height: 40px
│ #Recovery #HealthWin #GoldenRetriever │
├─────────────────────────────────────────┤
│ [1 min ago] [Share] [Save] [More]      │  Height: 40px
└─────────────────────────────────────────┘
```

**Lazy Loading & Performance**
```
- Load 10 events on initial page load
- Infinite scroll: load 5 more every time user scrolls to 70% of page
- Cache: Redis caching of hot events (>100 engagements)
- Image optimization: WebP format, compression to 50KB max
- Video: lazy-load, play on tap
```

**Mobile Interactions**
- Swipe left/right to toggle reactions
- Long-press event card for share options
- Tap event card to open detail view
- Pull-to-refresh
- Bottom navigation: Home | Search | Messages | Notifications | Profile

---

### Feature 3: Event Detail Page

**Layout:**
```
[Hero image carousel - full width 300px]
[Creator info - 60px]
[Event title - 40px]
[Key details - 60px: date, location, attendees count]
[Description text - 100px]
[Action buttons - 80px: RSVP/Like/Comment/Share]
[Comments section - infinite scroll]
```

**Key Sections:**

**1. Event Header**
- High-quality image carousel
- Creator profile picture, name, "follow" button
- Creation time ("2 hours ago")
- Verification badge (if vet, shelter, etc.)

**2. Event Details**
```
For SOS:
- 🚨 URGENT - Last seen location
- 📍 [Address/Map pin]
- 🕐 Posted [time ago]
- 👤 [Creator phone contact method - hidden until RSVP]

For Blood Donor:
- 🩸 Blood type needed: [AB Negative]
- 📍 Location: [Vet clinic name]
- ⏰ Appointment: [Date/time]
- 👥 12 matched donors nearby

For Health Journal:
- 🏥 Topic: Recovery
- 🐕 Pet: Max (Golden Retriever, 4 yrs)
- 📅 Posted 2 hours ago

For Local Event:
- 📅 Sun, Jan 12, 10am-12pm
- 📍 Central Park, Berlin
- 👥 8/15 attendees (RSVP)
- 🏷️ Free
```

**3. Description Section**
- Full event description (rich text)
- Hashtags parsed as clickable links
- @mentions highlighted

**4. Action Bar**
```
[❤️ 234] [💬 45] [🔖 89] [📤 12] [⋮ More]
```

**5. Comments Section**
- Threaded comments (replies indented)
- Rich text + emoji support
- Tag mentions with @
- Sort by "Newest" or "Most Liked"
- Comment input at bottom

**6. Related Events**
```
Bottom of page: "Similar events nearby"
[Carousel of 3 related event cards]
- Same pet type
- Same location
- Same topic
```

---

### Feature 4: SOS-Specific Features

**SOS Creation Fast Path (20-second flow)**
```
Step 1: Photo + location (drag photo + tap map)
Step 2: Pet info (auto-fill from existing pets or quick-add)
Step 3: What happened? (Lost | Injured | Urgent Funds)
Step 4: Urgency (⚫ Immediate | 🟠 24h | 🟡 Open)
Step 5: Publish
```

**SOS Badge & Highlighting**
```
- Red banner: "🆘 SOS - [Urgency Level]"
- Notification priority: P0 (always send, regardless of user settings)
- Notification radius: Configurable (default 10km)
- Notification copy: "Max (Golden Retriever) is lost near Central Park! Can you help?"
```

**SOS Resolution Flow**
```
1. Creator marks "Status: Helping" when someone offers help
2. Helper and creator message privately (in-app chat)
3. After resolution: Creator posts update
   - "Found!" post with thank-you
   - Tags helpers who assisted
   - Marks SOS as "Resolved"
4. Resolved SOS stays visible (archive option)
5. Community can comment with suggestions even after resolved
```

**QR Tag Integration**
```
When SOS created:
- If pet has QR tag registered, auto-fetch: species, breed, age, medical conditions
- Pre-fill pet info
- Show QR tag code in post: "Tap pet's QR code to learn more"
```

**Escalation Logic**
```
If SOS unresolved after 2 hours:
1. Notify nearby shelters (automated)
2. Notify local vet clinics (automated)
3. Bump post in feed (re-surface to top)
4. Send reminder notification to volunteers

If SOS unresolved after 24h:
1. Suggest posting on social media (Facebook groups, Instagram)
2. Contact local news outlets (optional)
3. Archive post (can still reactivate)
```

---

### Feature 5: Blood Donor Network

**Donor Registration**
```
Step 1: Health screening form
- Last blood donation date: [picker]
- Current health condition: Healthy | Currently treating | Not sure
- Medications: Text list or skip
- Recent travel: Location + dates
- Vaccination status: Dropdown (Fully vaccinated / Partial / Not)

Step 2: Verify vaccinations
- Auto-pull from digital passport (if available)
- Or upload vaccination certificate photo
- System auto-recognizes vaccine names via OCR

Step 3: Set availability
- Frequency: Weekly | Bi-weekly | Monthly
- Best times: Morning | Afternoon | Evening
- Preferred days: Mon-Sun checkboxes

Step 4: Consent & review
- Clinic can contact me: Yes/No
- Use my data for research: Yes/No
- Show me on leaderboard: Yes/No
- Review & confirm
```

**Clinic Donor Request**
```
[Clinic Dashboard]
1. Click "Request Blood Donor"
2. Fill form:
   - Animal species: Dog | Cat | Other
   - Blood type needed: [Dropdown with DEA types]
   - Quantity: [mL]
   - Urgency: Immediate | Within 24h | Flexible
   - Preferred location: Clinic address | Mobile (bring pet to clinic)
3. System auto-matches nearby verified donors
4. Send in-app + email notification
```

**Donor Matching & Appointment**
```
Clinic view: List of matched donors nearby
- Donor name (profile badge)
- Distance
- Availability
- One-click "Send Request" → appears in donor's notifications

Donor receives notification:
- "Dr. Mueller clinic needs [AB Negative] blood donor for Max (4-yr German Shepherd)"
- Accept/Decline buttons
- Calendar picks appointment slot

After confirm:
- Clinic gets appointment confirmation
- Calendar sync (Google/Outlook)
- Both parties get reminder 24h before
```

**Post-Donation Recognition**
```
After donation complete:
1. Donor health check performed by clinic
2. Clinic marks "Donation complete" in system
3. Automatic post generated on recipient's profile:
   "Luna received blood from Max today—recovering well! 🩸 Big thanks to Max's owner [Name] for being a blood hero!"
4. Donor receives:
   - Badge: "Blood Hero [x donations]"
   - Leaderboard placement
   - Insurance health points (partner-dependent)
   - Thank you message
5. Both parties can like/comment on the post
```

---

### Feature 6: Health Journal Features

**Post Types (Templates)**

**Recovery Journey:**
- Before/after photos
- Progress metrics (weight, pain level, mobility)
- Vet recommendations
- Milestones (1 week post-op, 2 weeks, etc.)
- Recommended products (affiliate links)

**Training Achievement:**
- Before/after video (trick learned)
- Training method used (positive reinforcement, etc.)
- Trainer info (if applicable)
- Recommended courses/services
- Follower suggestions in comments

**Nutrition Update:**
- Current diet
- Health impact (weight, energy, digestion)
- Product recommendations
- Vet endorsement (if available)
- Follower recipes/suggestions

**Fitness Milestone:**
- Activity type (walk, swim, agility)
- Distance/duration
- Pet energy level
- Related product recommendations
- Challenge/encouragement from community

---

### Feature 7: Local Events Features

**Event Discovery Map**
```
[Google Map view - full width]
[Event pins color-coded by type]
🔴 SOS | 🟢 Events | 🔵 Blood Donor | 🟡 Health

[Filter sidebar - left side, collapsible on mobile]
- Event type: checkboxes
- Date range: picker
- Pet type: checkboxes
- Distance radius: slider (5-50km)
- Cost: Free | Paid | All
- Difficulty: Beginner | Intermediate | Advanced | All
- Organizer: Verified only / All

[List view - below map on mobile]
- Event cards (compact)
- Tap to expand detail
- RSVP button
```

**Event Organizer Dashboard**
```
For event creators:
- All my events (list)
- Upcoming events with RSVP count
- Quick actions: Edit | Cancel | View attendees
- Analytics: Views, RSVPs, engagement

For recurrence (paid feature):
- Create recurring event (weekly/monthly)
- Auto-post next event
- Price adjustments by month
- Block dates (for breaks/vacations)
```

**RSVP & Attendance Tracking**
```
RSVP Flow:
1. User clicks "RSVP"
2. Modal appears:
   - Add your pets (checkboxes of owned pets)
   - How many humans attending
   - Dietary restrictions / pet restrictions form
   - "Confirm RSVP"
3. Calendar event created (auto-sync)
4. Reminder: 24h before event

Event Day Check-In:
- Organizer opens event detail page
- Check-in tab: List of attendees
- Tap attendee name → Confirm attendance
- Organizer notes (behavior observed, etc.)
```

**Post-Event Recap**
```
Organizer posts recap:
- Thank you message
- Event photos (curator selects best 5-10)
- Attendee count / highlights
- "See you next week?" call-to-action
- Tag attendees for recognition

Attendees receive notification:
- "Thank you for attending Dog Park Meetup!"
- Link to photos
- Rate experience (1-5 stars + comment)
- "Invite friends to next week's event" button
```

---

### Feature 8: Notifications & Engagement Mechanics

**Notification Types**

| Trigger | Copy | User Control |
|---------|------|--------------|
| New follower | "[Name] started following you" | Toggle on/off |
| New comment | "[Name] commented on your post" | Toggle on/off |
| Liked post | "[Count] people liked your post" | Toggle on/off |
| SOS nearby | "🆘 Max lost near Central Park (2km away). Can you help?" | Always on (high priority) |
| Event reminder | "Dog park starts in 24 hours" | Toggle on/off |
| Event RSVP | "[Name] also RSVP'd to your event" | Toggle on/off |
| Blood donor match | "🩸 Clinic needs your pet's blood type" | Toggle on/off |
| Achievement | "🎉 You unlocked 'Health Advocate' badge" | Toggle on/off |
| Creator milestone | "[Pet] has recovered! See the final update" | Toggle on/off |

**Notification Frequency Caps**
```
- Max 3 notifications per hour (unless SOS)
- Quiet hours: 10pm-8am (no non-urgent notifications)
- Digest option: Get all notifications in 1 daily email
```

---

### Feature 9: Moderation & Safety

**Auto-Moderation Rules**

```
Flag for human review if:
- Post contains medical diagnosis (requires vet endorsement)
- Requesting money (SOS only, not personal fundraising)
- Contains violence/harm language
- Coordinates meet with unknown users (safety warning)
- Spam keywords (casino, crypto, weight loss)

Auto-delete if:
- Sexual content
- Hate speech
- Coordinated harassment
- Verified spam account
```

**Verification Badges**
```
✅ Veterinarian: Licensed vet verified via professional license
✅ Shelter/Rescue: Official nonprofit status verified
✅ Trainer: Professional dog trainer (certification verified)
✅ Established: Account active 6+ months, 100+ followers, clean record
✅ Verified QR: Pet registered with Waggli QR tag
```

**Reporting & Appeal**
```
User reports post:
1. Tap "⋮ More" → "Report"
2. Reason: Spam | Misinformation | Unsafe | Other
3. Additional details (optional)
4. Submit

Reported post reviewed within 24h:
- If valid: Post removed, user notified
- If invalid: Dismissed, reporter notified
- Appeal option for removed posts (30-day window)
```

---

## 🎯 Summary: MVP Feature List (Month 1)

**Must Have:**
- [ ] Event creation form (all 4 types)
- [ ] Event feed with basic ranking
- [ ] Commenting system
- [ ] Push notifications
- [ ] RSVP system for events
- [ ] Basic moderation (flag inappropriate content)

**Should Have:**
- [ ] Event detail page with images
- [ ] Verification badges
- [ ] Simple analytics (creator dashboard)
- [ ] Location-based filtering

**Nice to Have:**
- [ ] SOS geofencing
- [ ] Blood donor matching algorithm
- [ ] Recurring events
- [ ] Advanced analytics
- [ ] Creator leaderboards

**Post-MVP (Months 2-6):**
- [ ] Affiliate links & monetization
- [ ] Insurance data pipeline
- [ ] A/B testing framework
- [ ] Advanced personalization
- [ ] Organizer subscriptions

---

**Document Version:** 1.0  
**Last Updated:** January 2, 2026  
**Specification Owner:** Product Lead