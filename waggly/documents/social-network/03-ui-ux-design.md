# Social Network UI/UX Design Specification

**Document Version**: 1.0  
**Last Updated**: January 3, 2026
**Platform**: React Native (iOS, Android, Web)  
**Design System**: Tamagui + Custom Components

---

## 🎨 Design Philosophy

### Core Principles
1. **Pet-First**: Every design decision prioritizes showcasing pets beautifully
2. **Clean & Modern**: Minimal clutter, generous whitespace, clear hierarchy
3. **Engaging**: Delightful micro-interactions and smooth animations
4. **Accessible**: WCAG 2.1 AA compliant, readable, easy to navigate
5. **Familiar**: Leveraging established social media patterns users already know

### Design Inspiration
- **Instagram**: Visual-first content display, stories UI
- **Facebook**: Groups, events, community features
- **Twitter**: Real-time feed, engagement patterns
- **Pet-specific touch**: Playful colors, rounded corners, paw-themed icons

---

## 🎨 Color Palette & Branding

### Primary Colors (Pet-Friendly Palette)
```typescript
const colors = {
  // Primary - Warm & Approachable
  primary: {
    50: '#FFF7ED',   // Lightest orange
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',  // Main brand orange
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',  // Darkest
  },
  
  // Secondary - Calm & Trust
  secondary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',  // Blue
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Success - Health & Growth
  success: {
    500: '#10B981',  // Green
    600: '#059669',
  },
  
  // Warning - Attention
  warning: {
    500: '#F59E0B',  // Amber
  },
  
  // Error - Alert
  error: {
    500: '#EF4444',  // Red
  },
  
  // Neutral - Text & Backgrounds
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',   // Body text
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',   // Headings
    900: '#111827',   // Dark mode text
  },
};
```

### Gradients
```typescript
const gradients = {
  sunset: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)', // Warm posts
  ocean: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',  // Cool groups
  forest: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)', // Success states
  twilight: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', // Premium features
};
```

---

## 📱 Component Library

### Navigation Components

#### Bottom Tab Navigation (Mobile)
```tsx
<TabBar>
  <Tab icon="home" label="Home" active />
  <Tab icon="search" label="Explore" />
  <Tab icon="plus-circle" label="" /> {/* Floating create button */}
  <Tab icon="bell" label="Activity" badge={3} />
  <Tab icon="user" label="Profile" />
</TabBar>
```

**Visual Specs**:
- Height: 64px (with safe area insets)
- Background: White (light), #1F2937 (dark)
- Active tab color: Primary orange (#F97316)
- Inactive tab color: Gray 400
- Badge: Red circle with white text

#### Top Navigation (Web Desktop)
```tsx
<TopNav>
  <Logo />
  <SearchBar placeholder="Search pets, places, people..." />
  <NavIcons>
    <IconButton icon="home" active />
    <IconButton icon="users" /> {/* Groups */}
    <IconButton icon="calendar" /> {/* Events */}
    <IconButton icon="bell" badge={5} />
    <ProfileAvatar />
  </NavIcons>
</TopNav>
```

---

### Post Components

#### Feed Post Card

**Layout**:
```
┌─────────────────────────────────────────┐
│ [Avatar] Max the Golden Retriever    ⋮ │ ← Header
│          2 hours ago · 📍 Central Park  │
├─────────────────────────────────────────┤
│                                         │
│         [Photo/Video Content]           │ ← Media (Full width)
│            (Swipeable carousel)         │
│                                         │
├─────────────────────────────────────────┤
│ ❤️ 245  💬 18  📤 5               🔖   │ ← Engagement bar
├─────────────────────────────────────────┤
│ ❤️ Loved by Lucy, Buddy and 243 others │ ← Liked by
├─────────────────────────────────────────┤
│ Max's First day at the dog park! 🐕     │ ← Caption
│ Had so much fun playing with new        │
│ friends! #puppylove #dogpark            │
│ View all 18 comments                    │
│                                         │
│ [Buddy] So cute! 🥰                     │ ← Top comment
│ 2 hours ago                             │
└─────────────────────────────────────────┘
```

**Component Props**:
```typescript
interface PostCardProps {
  post: {
    id: string;
    author: {
      id: string;
      name: string;
      avatar: string;
      isVerified: boolean;
    };
    content: {
      text: string;
      media: Media[];
      location?: { lat: number; lng: number; name: string };
    };
    engagement: {
      reactions: { type: ReactionType; count: number }[];
      comments: number;
      shares: number;
      bookmarks: number;
    };
    timestamp: Date;
  };
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onBookmark: () => void;
}
```

**Variants**:
1. **Photo Post**: Single or carousel (1-10 images)
2. **Video Post**: Video player with controls
3. **Text Post**: Large typography, different background
4. **Poll Post**: Interactive poll UI with results
5. **Location Check-in**: Map preview + place card

---

#### Create Post Interface

**Modal/Screen Layout**:
```
┌─────────────────────────────────────────┐
│  Create Post                        [X] │
├─────────────────────────────────────────┤
│  ┌───┐                                  │
│  │ 🐕│ Max ▼                            │ ← Pet selector
│  └───┘                                  │
├─────────────────────────────────────────┤
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃ What's on Max's mind?            ┃  │ ← Text input
│  ┃                                  ┃  │
│  ┃                                  ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
├─────────────────────────────────────────┤
│  [📷 Photos]  [🎥 Video]  [📍 Location] │ ← Media options
│  [🏷️ Tag Pets]  [😊 Feeling]            │
├─────────────────────────────────────────┤
│  [Selected Image Thumbnails]            │ ← Media preview
├─────────────────────────────────────────┤
│  Visibility: Public ▼                   │ ← Privacy selector
│  Comments: Everyone ▼                   │
├─────────────────────────────────────────┤
│  [Cancel]              [Post ✓]         │ ← Actions
└─────────────────────────────────────────┘
```

**States**:
- Empty: Placeholder text, all options enabled
- With Media: Show thumbnails, enable photo editing
- With Location: Show map pin, display place name
- With Poll: Show poll options builder
- Loading: Spinner overlay during upload/post creation

---

### Story Components

#### Stories Bar (Top of Feed)

**Layout**:
```
┌──────────────────────────────────────────────────────────┐
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ─→    │
│ │ + │ │🐕 │ │🐈 │ │🐕 │ │🐇 │ │🐕 │ │🐈 │         │
│ │Your│ │Max │ │Luna│ │Spot│ │Hop │ │Bella│ │Milo│       │
│ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘       │
└──────────────────────────────────────────────────────────┘
```

**Visual Specs**:
- Item width: 80px
- Item height: 100px
- Avatar size: 64px
- Story ring: 3px gradient border (unread)
- Gray ring: Viewed stories
- Horizontal scroll
- "Your Story" has + icon, dashed border

#### Story Viewer

**Full-Screen Layout**:
```
┌─────────────────────────────────────────┐
│ ━━━━━━━╺╺╺╺╺╺╺━━━━━━━                 │ ← Progress bars
│                                         │
│  [Avatar] Max · 2h ago             [X] │ ← Header
│                                         │
│                                         │
│                                         │
│        [Story Content]                  │ ← Photo/Video
│                                         │
│                                         │
│                                         │
│                                         │
│  Max is at Central Park!  🌳            │ ← Text overlay/sticker
│                                         │
│                                         │
│  ❤️ 45     💬 Reply...                 │ ← Reactions/Reply
└─────────────────────────────────────────┘
```

**Interactions**:
- Tap right: Next story
- Tap left: Previous story
- Hold: Pause
- Swipe up: View story details/responses
- Swipe down: Close viewer

**Creation Tools**:
```
Draw    Text    Sticker    Music    Timer
  ✏️      Aa       😊        🎵       ⏱️
```

---

### Group Components

#### Group Card (Discovery)

**Layout**:
```
┌─────────────────────────────────────────┐
│        [Cover Photo]                    │
│                                         │
│  Golden Retriever Lovers NYC            │
│  🔓 Public Group · 1.2K members         │
│                                         │
│  A community for Golden Retriever       │
│  owners in New York City...             │
│                                         │
│  ┌───┐┌───┐┌───┐ +98 members you       │ ← Member avatars
│  │ 🐕││ 🐕││ 🐕│   follow                │
│  └───┘└───┘└───┘                        │
│                                         │
│  [Join Group]                           │
└─────────────────────────────────────────┘
```

#### Group Feed Header

**Layout**:
```
┌─────────────────────────────────────────┐
│        [Group Cover Photo]              │
│                                         │
│  Golden Retriever Lovers NYC            │
│  🔓 Public · 1.2K members · 15 new today│
│                                         │
│  [+Joined ✓] [Invite] [⋮ More]         │ ← Action buttons
├─────────────────────────────────────────┤
│  [📝 Create Post]                       │ ← Post composer
├─────────────────────────────────────────┤
│  📌 PINNED POST                         │ ← Announcements
│  Group Rules: Please read before...    │
├─────────────────────────────────────────┤
│  [Feed Posts...]                        │
└─────────────────────────────────────────┘
```

---

### Event Components

#### Event Card

**Layout**:
```
┌─────────────────────────────────────────┐
│        [Event Cover Photo]              │
│                                         │
│  Weekend Dog Park Playdate              │
│  📅 Sat, Jan 10 · 10:00 AM              │
│  📍 Central Park Dog Run                │
│                                         │
│  🐕 25 going · 🐕 12 interested         │
│                                         │
│  Hosted by Max the Golden Retriever     │
│                                         │
│  [Going ✓] [Maybe] [Interested]         │
└─────────────────────────────────────────┘
```

#### Event Details Screen

**Sections**:
1. **Header**: Cover photo, title, date/time, location
2. **Details**: Description, requirements, capacity
3. **Attendees**: Grid of going/interested users
4. **Discussion**: Comments/questions
5. **Similar Events**: Recommendations

---

## 🎭 Interaction Patterns

### Like/Reaction Animation

**Double-Tap to Like**:
1. User double-taps post image
2. Large heart emoji bounces in center (scale 0 → 1.2 → 1)
3. Heart fades out after 800ms
4. Like button fills with color
5. Like count increments with bounce

**Long-Press for Reactions**:
1. User long-presses like button
2. Reaction picker appears above button
3. User drags to select reaction
4. Selected reaction scales up
5. Reaction recorded, button shows selected type

### Pull-to-Refresh

**Visual States**:
1. Pull down: Spinner appears
2. Release: Spinner spins
3. Loading: Fetch new posts
4. Complete: Spinner disappears, new posts slide in from top

### Infinite Scroll

**Behavior**:
- Load 20 posts initially
- When user scrolls to 5 posts from bottom, load next 20
- Show loading spinner at bottom
- Handle scroll position restoration

---

## 📐 Layout & Spacing

### Grid System

**Breakpoints**:
- Mobile: < 640px (1 column)
- Tablet: 640-1024px (2 columns)
- Desktop: > 1024px (3 columns for feed, 2 for sidebar)

**Spacing Scale** (based on 8px):
```typescript
const spacing = {
  xs: 4,    // 0.5 unit
  sm: 8,    // 1 unit
  md: 16,   // 2 units
  lg: 24,   // 3 units
  xl: 32,   // 4 units
  xxl: 48,  // 6 units
};
```

### Typography

**Font Family**: 
- Sans: `Inter, system-ui, -apple-system, sans-serif`
- Mono: `'SF Mono', Menlo, monospace`

**Type Scale**:
```typescript
const typography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 1.2 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 1.3 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 1.4 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 1.5 },
  caption: { fontSize: 14, fontWeight: '400', lineHeight: 1.4 },
  small: { fontSize: 12, fontWeight: '400', lineHeight: 1.3 },
};
```

---

## ♿ Accessibility

### Screen Reader Support

**Labels for All Interactive Elements**:
```tsx
<TouchableOpacity
  accessibilityLabel="Like this post"
  accessibilityHint="Double tap to like Max's post"
  onPress={handleLike}
>
  <HeartIcon filled={isLiked} />
</TouchableOpacity>
```

### Color Contrast

- **Text on White**: Minimum 4.5:1 contrast
- **Interactive Elements**: 3:1 contrast
- **Dark Mode**: All colors adjusted for WCAG compliance

### Focus Indicators

- Keyboard navigation: Visible focus ring (2px primary color)
- Tab order: Logical, follows visual layout

### Text Scaling

- Support iOS Dynamic Type
- Support Android font scaling
- Minimum touch target: 44x44px

---

## 🌓 Dark Mode

### Color Adjustments

```typescript
const darkColors = {
  background: '#000000',      // Pure black
  surface: '#1F2937',         // Card backgrounds
  surfaceHover: '#374151',    // Hover states
  border: '#4B5563',          // Borders
  text: {
    primary: '#F9FAFB',       // Headings
    secondary: '#D1D5DB',     // Body text
    tertiary: '#9CA3AF',      // Captions
  },
};
```

### Dark Mode Rules
- Reduce image brightness by 10% for comfort
- Use darker overlays on media
- Slightly de-saturate vibrant colors
- Lighter shadows (harder to see on dark)

---

## 🎬 Animations & Micro-interactions

### Timing Functions
```typescript
const easing = {
  easeOut: [0.0, 0.0, 0.2, 1],        // Fast start, slow end
  easeIn: [0.4, 0.0, 1, 1],           // Slow start, fast end
  easeInOut: [0.4, 0.0, 0.2, 1],      // Smooth both ends
  spring: { stiffness: 300, damping: 25 }, // Bouncy
};
```

### Common Animations
- **Button Press**: Scale 1 → 0.95 (100ms)
- **Modal Enter**: Slide up + fade in (300ms easeOut)
- **Toast Notification**: Slide down (200ms) + auto-dismiss after 3s
- **Like Animation**: Scale + color change (400ms spring)
- **Image Load**: Blur-up (progressive image loading)

---

## 📱 Mobile-Specific Patterns

### Gestures
- **Swipe**: Navigate between tabs, close modals
- **Pinch to Zoom**: On post images
- **Long Press**: Context menu (save, report, etc.)
- **Pull to Refresh**: Reload feed

### Native Features
- **Share Sheet**: iOS/Android native share
- **Camera Integration**: Direct photo/video capture
- **Haptic Feedback**: On like, successful post, etc.
- **Push Notifications**: Native notification UI

---

## 🖥️ Web-Specific Patterns

### Desktop Enhancements
- **Hover States**: All interactive elements
- **Tooltips**: On icon-only buttons
- **Keyboard Shortcuts**:
  - `N`: New post
  - `L`: Like selected post
  - `C`: Comment on selected post
  - `→`/`←`: Navigate stories
  - `/`: Focus search
  - `Esc`: Close modals

### Responsive Behavior
- **Sidebar**: Always visible on desktop (1024px+)
- **Multi-Column Feed**: 2-3 columns on wide screens
- **Hover Information**: Show full captions without scrolling

---

## 🎨 Component States

### Button States
```tsx
const ButtonStates = {
  default: { bg: 'primary', text: 'white' },
  hover: { bg: 'primary-600', text: 'white', scale: 1.02 },
  active: { bg: 'primary-700', text: 'white', scale: 0.98 },
  disabled: { bg: 'gray-300', text: 'gray-500', opacity: 0.6 },
  loading: { /* spinner, disabled */ },
};
```

### Input States
```tsx
const InputStates = {
  default: { border: 'gray-300' },
  focus: { border: 'primary', ring: '2px primary-200' },
  error: { border: 'error', ring: '2px error-200' },
  disabled: { bg: 'gray-100', border: 'gray-200' },
};
```

---

This UI/UX specification provides comprehensive guidelines for implementing a beautiful, accessible, and engaging social network interface in Pawzly.
