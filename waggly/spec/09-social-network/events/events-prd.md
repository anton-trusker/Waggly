# Events & Meetups - Product Requirements Document

## Overview

Events enable pet owners to organize and discover real-world meetups, playdates, training classes, and community gatherings.

---

## Event Categories

| Category | Description |
|----------|-------------|
| Playdates | Informal meetups at parks |
| Group Walks | Organized walking groups |
| Training Classes | Obedience, agility, tricks |
| Adoption Events | Shelter/rescue adoption days |
| Fundraisers | Charity events for animal welfare |
| Competitions | Dog shows, agility trials |
| Social Gatherings | Pet-friendly happy hours |
| Educational | Seminars, workshops, vet Q&A |

---

## Event Creation

### Event Details

| Field | Required | Description |
|-------|----------|-------------|
| Title | Yes | Event name |
| Description | Yes | Full details |
| Date & Time | Yes | With timezone |
| Location | Yes | Map integration |
| Host | Yes | User, pet, or org |
| Cover Photo | No | Event image |
| Capacity | No | Max attendees |
| Ticket Price | No | Free or paid (Stripe) |
| Requirements | No | e.g., "Vaccination required" |
| Restrictions | No | Size, age, species |

### Event Form

```
┌─────────────────────────────────────────┐
│ Create Event                        [X] │
├─────────────────────────────────────────┤
│ Event Title *                           │
│ [Weekend Dog Park Playdate           ]  │
├─────────────────────────────────────────┤
│ Date & Time *                           │
│ [Jan 10, 2026] [10:00 AM] - [12:00 PM]  │
├─────────────────────────────────────────┤
│ Location *                              │
│ [Central Park Dog Run       ] [📍 Map]  │
├─────────────────────────────────────────┤
│ Event Type                              │
│ [Playdate ▼]                            │
├─────────────────────────────────────────┤
│ Description                             │
│ [Bring your pups for a fun playdate!]   │
│ [                                    ]  │
├─────────────────────────────────────────┤
│ ☐ Limit capacity: [20] attendees        │
│ ☑ Vaccination required                  │
│ ☐ Paid event: [$ Amount]                │
├─────────────────────────────────────────┤
│ Pet restrictions                        │
│ Species: [Dogs ▼]                       │
│ Size: [☑ Small] [☑ Medium] [☑ Large]    │
├─────────────────────────────────────────┤
│       [Cancel]        [Create Event]    │
└─────────────────────────────────────────┘
```

---

## RSVP System

| Status | Description |
|--------|-------------|
| Going | Confirmed attendance |
| Maybe | Tentative attendance |
| Interested | Following the event |
| Not Going | Declined |
| Waitlist | Capacity reached |

### RSVP Details
- Number of guests
- Pets attending (link to pet profiles)
- Special requests/notes
- Contact permission

---

## Event Discovery

### Finding Events
- **Map View**: See events on map by location
- **List View**: Chronological or by popularity
- **Filters**: Date, distance, type, free/paid, species
- **Recommendations**: Based on location, pet type, history

### Event Detail Screen

```
┌─────────────────────────────────────────┐
│ [Event Cover Photo]                     │
├─────────────────────────────────────────┤
│ Weekend Dog Park Playdate               │
│ 📅 Saturday, January 10, 2026           │
│ 🕙 10:00 AM - 12:00 PM EST              │
│ 📍 Central Park Dog Run                 │
│    85th St Transverse, New York, NY     │
├─────────────────────────────────────────┤
│ 🐕 25 going · 12 interested             │
├─────────────────────────────────────────┤
│ Hosted by Max the Golden Retriever      │
│ [🐕 Avatar] @max_golden                 │
├─────────────────────────────────────────┤
│ [Going ✓] [Maybe] [Interested]          │
├─────────────────────────────────────────┤
│ About                                   │
│ Bring your pups for a fun playdate at   │
│ the Central Park dog run! All friendly  │
│ dogs welcome.                           │
│                                         │
│ ⚠️ Requirements: Proof of vaccination    │
├─────────────────────────────────────────┤
│ Attendees                               │
│ [Avatar Grid: 25 going, 12 interested]  │
├─────────────────────────────────────────┤
│ Discussion (18 comments)                │
│ [Comments...]                           │
├─────────────────────────────────────────┤
│ Similar Events                          │
│ [Event cards...]                        │
└─────────────────────────────────────────┘
```

---

## Event Updates

| Feature | Description |
|---------|-------------|
| Post updates | Notify all attendees |
| Change notifications | Date/time/location changes |
| Weather alerts | Cancellation notifications |
| Photo album | Crowdsourced event photos |
| Check-in | Attendee arrival tracking |

---

## Calendar Integration

- Add to device calendar (iOS Calendar, Google)
- In-app calendar view
- Reminders before event (1 day, 1 hour)
- Recurring events support

---

## Database Schema

```sql
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
  location_place_id UUID REFERENCES pet_places(id),
  
  cover_photo_url TEXT,
  
  host_user_id UUID REFERENCES auth.users(id) NOT NULL,
  host_pet_id UUID REFERENCES pets(id),
  host_org_id UUID,
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

CREATE INDEX idx_events_date ON events(start_datetime) WHERE NOT is_cancelled;
CREATE INDEX idx_events_location ON events(location_lat, location_lng) WHERE NOT is_cancelled;
CREATE INDEX idx_events_type ON events(event_type) WHERE NOT is_cancelled;
CREATE INDEX idx_event_attendees_event ON event_attendees(event_id, rsvp_status);
CREATE INDEX idx_event_attendees_user ON event_attendees(user_id);
```

---

## API Specification

### Create Event
```typescript
POST /functions/v1/create-event
{
  title: 'Weekend Dog Park Playdate',
  description: 'Bring your pups for a fun playdate!',
  event_type: 'playdate',
  start_datetime: '2026-01-10T10:00:00Z',
  end_datetime: '2026-01-10T12:00:00Z',
  timezone: 'America/New_York',
  location_name: 'Central Park Dog Run',
  location_address: '85th St Transverse, New York, NY',
  location_lat: 40.7829,
  location_lng: -73.9654,
  max_attendees: 20,
  pet_species_allowed: ['dog'],
  vaccination_required: true,
  is_free: true
}
```

### RSVP to Event
```typescript
POST /api/v1/events/:eventId/rsvp
{
  rsvp_status: 'going',
  num_guests: 0,
  pet_ids: ['pet-uuid'],
  special_requests: 'My dog is shy around large dogs'
}
```

### Get Nearby Events
```typescript
GET /api/v1/events/nearby
?lat=40.7829
&lng=-73.9654
&radius_km=10
&start_date=2026-01-01
&end_date=2026-02-01
&event_type=playdate
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Events created | 500+ per month |
| Users attending events | 30% |
| RSVPs per user | 2 average |
| Check-in rate | 70% |
