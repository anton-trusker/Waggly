# 🐾 PAWZLY PET CARD COMPONENT SPECIFICATION

**Document Version:** 1.0  
**Created:** January 10, 2026  
**Purpose:** Complete Pet Card design specification for dashboard, list views, and quick access  
**Status:** Production-Ready Specification

---

## 📋 EXECUTIVE SUMMARY

The **Pet Card Component** is the primary way users view their pets on the Pawzly dashboard and pet list pages. It displays the most critical health information at a glance, enabling users to quickly assess pet status and take action.

### Key Objectives:
✅ **Quick Information Access** - 3-5 seconds to understand pet's status  
✅ **Visual Health Indicators** - Color-coded status for immediate clarity  
✅ **Actionable Insights** - Clear call-to-action buttons  
✅ **Responsive Design** - Works on mobile (1 column) to desktop (4 columns)  
✅ **Information Hierarchy** - Most important info prominent  

---

## 🎨 SECTION 1: CARD LAYOUT & VARIATIONS

### 1.1 Three Card Variations

The Pet Card appears in three formats depending on context:

**Format 1: COMPACT GRID VIEW** (Dashboard, 2-4 columns)
- **Size:** 280px × 340px (mobile: full width)
- **Use Case:** Dashboard overview, quick scan multiple pets
- **Information Density:** High (9-10 fields visible)
- **Interaction:** Tap card to go to pet detail

**Format 2: DETAILED LIST VIEW** (Pet Registry, wider screen)
- **Size:** Full width, ~120px height, horizontal layout
- **Use Case:** Pet management, pet selection
- **Information Density:** Medium (7 fields visible + actions)
- **Interaction:** Tap to view, buttons for quick actions

**Format 3: COMPACT ROW VIEW** (Mobile pet list)
- **Size:** Full width, ~100px height
- **Use Case:** Mobile pet management
- **Information Density:** Medium (5 fields visible)
- **Interaction:** Tap to view, slide for actions

---

## 🎯 SECTION 2: COMPACT GRID VIEW (PRIMARY)

This is the main card design used on dashboard and pet list in grid mode.

### 2.1 Visual Layout

```
┌──────────────────────────────────────────┐
│ ┌────────────────────────────────────┐   │
│ │                                    │   │
│ │    [Pet Photo 120x120]             │   │
│ │    (Square, rounded corners)       │   │
│ │                                    │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Name:  Max                               │
│ ──────────────────────────────────────  │
│ Breed: Golden Retriever • Male • 5 yrs  │
│                                          │
│ Weight: 28 kg  │  BCS: 4/9 (IDEAL ✓)   │
│                                          │
│ Health Score: 87/100 ┃████████░░┃ GOOD │
│                                          │
│ 💉 Vaccines: 2 OVERDUE (critical!)      │
│ 📋 Next Checkup: 2 months overdue       │
│                                          │
│ ┌──────────────┬──────────────────────┐ │
│ │ [View]       │ [Add Record]         │ │
│ └──────────────┴──────────────────────┘ │
└──────────────────────────────────────────┘

Health Status Colors:
🟢 Excellent (90-100) - Green
🔵 Good (75-89) - Teal
🟡 Fair (60-74) - Orange
🔴 Poor (40-59) - Red
🔴 Critical (0-39) - Dark Red
```

### 2.2 Detailed Component Layout

#### **SECTION A: Pet Photo**
- **Size:** 120px × 120px
- **Border Radius:** 12px
- **Border:** 2px solid based on health status (see color table below)
- **Fallback:** Pet species icon + initial letter
- **Styling:**
  - Background: `var(--color-bg-2)` (light background)
  - Border color: Health status color
  - Shadow: `var(--shadow-sm)`

#### **SECTION B: Pet Identification (Name & Breed)**
- **Row 1 - Pet Name:**
  - Font: `var(--font-weight-semibold)` 18px
  - Color: `var(--color-text)`
  - Truncate if >20 chars with ellipsis
  
- **Row 2 - Quick Identification:**
  - Format: "Breed • Gender • Age"
  - Font: 12px, `var(--color-text-secondary)`
  - Example: "Golden Retriever • Male • 5 yrs"
  - Breed: 2 most relevant words max
  - Gender: Single letter (M/F) or symbol (♂/♀)
  - Age: Years (5 yrs) or Months if <1 year (8 mo)

#### **SECTION C: Physical Metrics (2 columns)**

**Left Column: Weight**
- Label: "Weight:"
- Value: "28 kg" (or "62 lbs" based on user preference)
- Font: 13px, bold
- Format: `${weight} ${unit}`

**Right Column: BCS Score**
- Label: "BCS:"
- Value: "4/9 (IDEAL ✓)" with color indicator
- Font: 13px, bold
- Categories with colors:
  - 1-2: UNDERWEIGHT (orange-400)
  - 3: UNDERWEIGHT (orange-400)
  - 4-5: IDEAL (green-400) with ✓
  - 6-7: OVERWEIGHT (orange-500)
  - 8-9: OBESE (red-500)

#### **SECTION D: Health Score**
- **Visual:** Progress bar + percentage
- **Format:**
  ```
  Health Score: 87/100 ┃████████░░┃ GOOD
  ```
- **Breakdown by category:**
  - 90-100: Excellent (green-500, light green bg)
  - 75-89: Good (teal-500, light teal bg)
  - 60-74: Fair (orange-500, light orange bg)
  - 40-59: Poor (red-500, light red bg)
  - 0-39: Critical (red-600, light red bg with warning)
- **Progress Bar:**
  - Height: 8px
  - Background: Light gray (`var(--color-secondary)`)
  - Fill: Health status color
  - Border radius: 4px
- **Text:** Font-size 12px, color matches health status

#### **SECTION E: Alert Indicators (Red Flag Section)**
- **Styling:**
  - Background: Light red/orange tint (`var(--color-bg-4)` or similar)
  - Border: Left border 3px red
  - Padding: 10px
  - Border-radius: 6px
  - Margin: 12px 0

**Alert Priority Levels:**
1. **Critical (🔴 Red)** - Display first:
   - Overdue vaccinations (>30 days)
   - Missed annual checkup (>365 days)
   - Unmanaged chronic condition
   - Recent emergency visit
   
2. **High (🟠 Orange)** - Display second:
   - Vaccination due soon (<30 days)
   - Rapid weight change
   - Medication compliance issue

3. **Medium (🟡 Yellow)** - Display if space:
   - Dental cleaning overdue
   - Next visit approaching

**Display Logic:**
- Show TOP ALERT ONLY on card (space-constrained)
- If multiple alerts exist:
  ```
  💉 Vaccines: 2 OVERDUE (critical!)
  ```
  Or:
  ```
  📋 Next Checkup: 2 months overdue ⚠️
  ```

#### **SECTION F: Quick Action Buttons**
- **Layout:** 2 buttons, equal width, full width container
- **Button 1: [View Profile]**
  - Action: Navigate to pet detail page
  - Style: Secondary (outline)
  - Icon: Eye icon (optional)
  
- **Button 2: [Add Record]**
  - Action: Open "Add Medical Record" dialog
  - Style: Primary (filled)
  - Icon: Plus icon (optional)
  - Alternatively: [Quick Actions ▼] dropdown

### 2.3 Card States & Interactions

#### **Default State:**
- Standard layout as described above
- No hover effects

#### **Hover State (Desktop):**
- Background: Subtle shade (opacity 0.05)
- Shadow: `var(--shadow-md)` (slightly elevated)
- Cursor: pointer
- Z-index: increases for stacking

#### **Pressed/Active State:**
- Background: `var(--color-secondary)`
- Shadow: `var(--shadow-lg)`

#### **Tap State (Mobile):**
- Similar to pressed state
- Slight scale animation (scale 0.98)

### 2.4 Card Color Coding by Health Status

| Health Status | Background | Border | Text | Bar Color |
|---------------|-----------|--------|------|-----------|
| **Excellent (90-100)** | Tinted green (#f0fdf4) | Green-500 (#22c55e) | Green-900 | Green-500 |
| **Good (75-89)** | Tinted teal (#f0fdfa) | Teal-500 (#14b8a6) | Teal-900 | Teal-500 |
| **Fair (60-74)** | Tinted orange (#fef3c7) | Orange-500 (#f97316) | Orange-900 | Orange-500 |
| **Poor (40-59)** | Tinted red (#fef2f2) | Red-500 (#ef4444) | Red-900 | Red-500 |
| **Critical (0-39)** | Tinted red (#fef2f2) | Red-600 (#dc2626) | Red-900 | Red-600 |

---

## 📊 SECTION 3: DETAILED LIST VIEW

Used in "My Pets" table view on tablets and desktop.

### 3.1 Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [Photo] Name         Breed       Weight  BCS   Health  Vaccines  Checkup │
│ [120px] Max          Golden      28 kg   4/9   87/100  ⚠️ 2due   2mo ago│
│         Retriever    (IDEAL)     GOOD           (Overdue)               │
│                                                                          │
│ Actions: [View] [Add Record] [More ▼]                                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Column Specifications

**Column 1: Pet Photo**
- Size: 80px × 80px
- Same styling as grid view
- Includes health status border

**Column 2: Pet Information**
- Row 1: Pet name (bold)
- Row 2: Breed (secondary color)
- Width: 150px (auto-expand)

**Column 3: Weight**
- Format: "28 kg" or "62 lbs"
- Width: 80px
- Alignment: Center

**Column 4: BCS Score**
- Format: "4/9 (IDEAL)" with color
- Width: 100px
- Alignment: Center
- Shows category in secondary color

**Column 5: Health Score**
- Format: "87/100 GOOD" with mini bar
- Width: 120px
- Mini bar: 40px width
- Alignment: Center

**Column 6: Vaccination Status**
- Format: "⚠️ 2 due" (if overdue) or "✓ Current"
- Icon + count + status
- Width: 100px
- Alignment: Center
- Color: Red if overdue, green if current

**Column 7: Next Checkup**
- Format: "2 mo ago" (if overdue) or "Next: Mar 15"
- Secondary color
- Width: 100px
- Alignment: Center
- Red text if overdue

**Column 8: Actions**
- [View] button
- [Add Record] button (optional, depends on space)
- [More ▼] dropdown for additional actions

### 3.3 Responsive Behavior

**Desktop (>1024px):**
- All 8 columns visible
- Photo left, actions right
- Full information density

**Tablet (640-1024px):**
- Collapse to 6 columns (remove pet photo, reduce breed)
- Compact format
- Actions visible

**Mobile (<640px):**
- Switch to "Compact Row View" (Section 4)

---

## 📱 SECTION 4: COMPACT ROW VIEW (MOBILE)

Used on mobile pet list when space is limited.

### 4.1 Layout

```
┌────────────────────────────────────────┐
│ [Photo] Max             87/100 GOOD    │
│ 80×80  Golden Retriever 28kg | 4/9 ✓  │
│        ⚠️ 2 vaccines overdue           │
│                                        │
│ [View] [+]                            │
└────────────────────────────────────────┘
```

### 4.2 Component Breakdown

**Line 1: Name + Health Score**
- Photo (80px × 80px) on left
- Pet name (bold, 16px)
- Health score on right (right-aligned)
- Status color background subtle

**Line 2: Breed + Weight + BCS**
- Breed text (12px, secondary color)
- Weight (12px, gray)
- BCS with category (12px, colored)

**Line 3: Top Alert**
- Single line alert text
- Icon + description
- Red/orange text if alert exists

**Line 4: Actions**
- [View] button (secondary)
- [+] button (primary, compact)

### 4.3 Spacing & Dimensions

- Padding: 12px
- Height: ~110px total
- Photo: 80px × 80px, square
- Gap between sections: 8px
- Buttons: 40px height, equal width

---

## 🎨 SECTION 5: DESIGN SYSTEM INTEGRATION

### 5.1 Colors

**Health Status Colors:**
```css
--color-excellent: #22c55e (green-500)
--color-good: #14b8a6 (teal-500)
--color-fair: #f97316 (orange-500)
--color-poor: #ef4444 (red-500)
--color-critical: #dc2626 (red-600)
```

**Text Colors:**
```css
--color-text: var(--color-text-primary)
--color-text-secondary: var(--color-text-secondary)
--color-alert: #dc2626 (red-600)
--color-warning: #f97316 (orange-500)
```

**Background Colors:**
```css
--color-card-bg: var(--color-surface)
--color-alert-bg: rgba(220, 38, 38, 0.08) // Light red
--color-excellent-bg: rgba(34, 197, 86, 0.08) // Light green
--color-good-bg: rgba(20, 184, 166, 0.08) // Light teal
--color-fair-bg: rgba(249, 115, 22, 0.08) // Light orange
--color-poor-bg: rgba(239, 68, 68, 0.08) // Light red
```

### 5.2 Typography

**Pet Name:**
- Font: `var(--font-weight-semibold)`
- Size: 18px (grid), 16px (list), 16px (mobile)
- Line-height: 1.3
- Color: `var(--color-text)`

**Secondary Info (Breed, Age):**
- Font: `var(--font-weight-normal)`
- Size: 12px
- Line-height: 1.4
- Color: `var(--color-text-secondary)`

**Metrics (Weight, BCS):**
- Font: `var(--font-weight-medium)`
- Size: 13px
- Line-height: 1.4
- Color: `var(--color-text)`

**Health Score:**
- Font: `var(--font-weight-bold)`
- Size: 12px
- Color: Health status color
- Label: 11px, secondary color

**Alert Text:**
- Font: `var(--font-weight-medium)`
- Size: 12px
- Color: `var(--color-alert)` or `var(--color-warning)`

### 5.3 Spacing & Layout

**Card Padding (Grid View):**
- Top: 16px
- Left/Right: 16px
- Bottom: 16px

**Card Padding (List View):**
- Top/Bottom: 12px
- Left/Right: 16px

**Internal Gaps:**
- Between sections: 12px
- Between rows: 8px
- Between inline elements: 8px

**Border Radius:**
- Card: 12px (`var(--radius-lg)`)
- Photo: 12px
- Buttons: 8px (`var(--radius-base)`)
- Alert box: 6px (`var(--radius-sm)`)

### 5.4 Shadows

**Card Shadow (Default):**
- `var(--shadow-sm)` (subtle)

**Card Shadow (Hover):**
- `var(--shadow-md)` (elevated)

**Card Shadow (Active):**
- `var(--shadow-lg)` (pressed)

---

## 🔄 SECTION 6: DATA STRUCTURE & CALCULATIONS

### 6.1 Pet Card Data Model

```typescript
interface PetCardData {
  // Identification
  pet_id: string;
  pet_name: string;
  species: string;
  breed: string;
  breed_secondary?: string;
  gender: "M" | "F" | "Unknown";
  date_of_birth: Date;
  
  // Physical
  weight_kg: number;
  weight_lbs?: number;
  bcs_score: number; // 1-9
  bcs_category: string; // "ideal", "overweight", etc.
  
  // Health
  health_score: number; // 0-100
  health_category: string; // "excellent", "good", "fair", "poor", "critical"
  
  // Photo
  photo_url?: string;
  photo_fallback_icon?: string;
  
  // Alerts
  top_alert?: {
    icon: string;
    text: string;
    severity: "critical" | "high" | "medium";
  };
  
  // Metadata
  vaccination_compliance_percent: number;
  last_checkup_date?: Date;
  next_checkup_date?: Date;
}
```

### 6.2 Alert Display Priority

```typescript
// Determine which alert to show (display top 1 only)
function getTopAlert(pet: Pet): Alert | null {
  const alerts = [
    // Critical - Always show first
    checkVaccinationOverdue(pet),     // >30 days
    checkMissedCheckup(pet),          // >365 days
    checkUnmanagedCondition(pet),
    checkRecentEmergency(pet),
    
    // High - Show if no critical
    checkVaccinationDueSoon(pet),     // <30 days
    checkRapidWeightChange(pet),
    checkMedicationCompliance(pet),
    
    // Medium - Show if space available
    checkDentalOverdue(pet),
    checkUpcomingCheckup(pet),
  ].filter(Boolean);
  
  return alerts[0] || null;
}

// Format alert for display
function formatAlert(alert: Alert): {icon: string, text: string} {
  if (alert.type === 'overdue_vaccination') {
    return {
      icon: '💉',
      text: `Vaccines: ${alert.count} OVERDUE (critical!)`
    };
  }
  // ... other alert types
}
```

### 6.3 Health Score Calculation

Card shows calculated health score from backend:

```typescript
// SIMPLIFIED for display (actual calculation in backend)
function getHealthCategory(score: number): {
  category: string;
  color: string;
  backgroundColor: string;
} {
  if (score >= 90) return {
    category: "Excellent",
    color: "#22c55e",
    backgroundColor: "#f0fdf4"
  };
  if (score >= 75) return {
    category: "Good",
    color: "#14b8a6",
    backgroundColor: "#f0fdfa"
  };
  if (score >= 60) return {
    category: "Fair",
    color: "#f97316",
    backgroundColor: "#fef3c7"
  };
  if (score >= 40) return {
    category: "Poor",
    color: "#ef4444",
    backgroundColor: "#fef2f2"
  };
  return {
    category: "Critical",
    color: "#dc2626",
    backgroundColor: "#fef2f2"
  };
}
```

---

## 📋 SECTION 7: ACCESSIBILITY & WCAG COMPLIANCE

### 7.1 Keyboard Navigation

- **Tab order:** Photo → Name → Health score → Alert → Buttons
- **Focus indicators:** 2px solid outline (health status color)
- **Focus outline offset:** 2px
- **Keyboard actions:**
  - Enter on card: Navigate to pet detail
  - Tab to [View]: Navigate to pet detail
  - Tab to [Add Record]: Open add record dialog

### 7.2 Screen Reader Support

```html
<article 
  role="region"
  aria-label="Pet card for Max, Golden Retriever"
  class="pet-card"
>
  <!-- Photo with alt text -->
  <img 
    src="max.jpg"
    alt="Max, Golden Retriever, health status excellent"
    aria-hidden="false"
  />
  
  <!-- Pet name as heading -->
  <h3 aria-level="3">Max</h3>
  
  <!-- Identification -->
  <p aria-label="Breed and demographics">
    Golden Retriever, Male, 5 years old
  </p>
  
  <!-- Metrics -->
  <dl>
    <dt>Weight</dt>
    <dd>28 kilograms</dd>
    <dt>Body Condition Score</dt>
    <dd>4 out of 9, ideal</dd>
  </dl>
  
  <!-- Health score with ARIA live region -->
  <div aria-live="polite" aria-label="Health status">
    <p>Health Score: 87 out of 100, Good</p>
  </div>
  
  <!-- Alerts -->
  <div role="alert" aria-live="assertive">
    <p>Vaccines: 2 overdue, critical attention needed</p>
  </div>
  
  <!-- Actions -->
  <button aria-label="View Max's full profile">View</button>
  <button aria-label="Add a new medical record for Max">Add Record</button>
</article>
```

### 7.3 Color Contrast

- **Text on background:** 4.5:1 minimum (WCAG AA)
- **Health status color + white text:** Verified for all colors
- **Alert text on alert background:** 7:1+ (high contrast)

### 7.4 Mobile Accessibility

- **Touch target size:** Minimum 44px × 44px for buttons
- **Spacing:** 8px minimum between touch targets
- **Text size:** Minimum 14px for body text, 18px for interactive elements

---

## 🔌 SECTION 8: INTEGRATION WITH SYSTEMS

### 8.1 Data Sources

**From Pawzly Core Database:**
- Pet identification (name, breed, DOB, gender)
- Pet photo URL
- Weight tracking (latest entry)
- BCS score (latest entry)

**From Pet Passport Tab (via API):**
- Health score (calculated, 0-100)
- Health score category (calculated)
- Red flag status (boolean, top alert only)
- Top alert text (pre-formatted)
- Vaccination compliance %
- Last/next checkup dates

### 8.2 API Endpoint

```typescript
// GET /api/v1/pets/{pet_id}/card-summary
interface PetCardSummaryResponse {
  pet_id: string;
  pet_name: string;
  species: string;
  breed: string;
  gender: string;
  date_of_birth: Date;
  
  // Latest measurements
  weight_kg: number;
  bcs_score: number;
  
  // Health metrics
  health_score: number; // 0-100
  health_category: "excellent" | "good" | "fair" | "poor" | "critical";
  
  // Alert
  has_critical_alert: boolean;
  top_alert: {
    icon: string;
    text: string;
    type: string;
    severity: "critical" | "high" | "medium";
  } | null;
  
  // Metadata
  photo_url: string | null;
  vaccination_compliance: number; // 0-100%
  last_checkup_date: Date | null;
  next_checkup_date: Date | null;
  
  // Cache
  cached_at: Date;
  cache_ttl_seconds: number;
}
```

### 8.3 Real-time Updates

- Cards update when health records change
- Alert status updates immediately when vaccination added/removed
- Health score recalculated when underlying data changes
- Use Supabase Realtime for live updates (subscribe to pet changes)

---

## 📐 SECTION 9: RESPONSIVE BREAKPOINTS

### Grid Layout

```
Desktop (>1200px): 4 columns per row
Tablet (768-1200px): 3 columns per row
Small Tablet (640-768px): 2 columns per row
Mobile (<640px): 1 column (switch to row view)
```

### Width Specifications

```css
/* Grid View */
@media (min-width: 1200px) {
  .pet-card {
    width: calc(25% - 12px);
    max-width: 300px;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .pet-card {
    width: calc(33.333% - 12px);
    max-width: none;
  }
}

@media (min-width: 640px) and (max-width: 767px) {
  .pet-card {
    width: calc(50% - 12px);
    max-width: none;
  }
}

/* Mobile: Switch to row view */
@media (max-width: 639px) {
  .pet-card {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
  }
}
```

---

## 🎯 SECTION 10: IMPLEMENTATION CHECKLIST

### Frontend Components

- [ ] `<PetCard>` - Main grid/card view component
- [ ] `<PetCardRow>` - List/row view variant
- [ ] `<PetCardMobile>` - Mobile row variant
- [ ] `<HealthScoreIndicator>` - Reusable health score component
- [ ] `<BCSIndicator>` - Body condition score component
- [ ] `<AlertBadge>` - Alert display component
- [ ] `<PetPhoto>` - Photo with fallback icon

### Business Logic

- [ ] Pet card data fetching hook (useGetPetCardSummary)
- [ ] Health score calculation/formatting
- [ ] Alert priority/selection logic
- [ ] Age calculation (DOB → years/months)
- [ ] Health category determination
- [ ] Responsive view selection logic

### Styling

- [ ] CSS/Tailwind classes for all card states
- [ ] Color variables integration
- [ ] Shadow/elevation effects
- [ ] Responsive spacing
- [ ] Accessibility classes (focus indicators, etc.)

### Data & API

- [ ] Backend endpoint for card summary
- [ ] Real-time subscription (Supabase)
- [ ] Caching strategy
- [ ] Error states and fallbacks
- [ ] Loading states (skeleton)

### Testing

- [ ] Unit tests for calculations
- [ ] Visual regression tests
- [ ] Responsive design tests
- [ ] Accessibility audit (axe, WAVE)
- [ ] E2E tests for interactions

### Documentation

- [ ] Component prop documentation
- [ ] Design system integration guide
- [ ] API documentation
- [ ] Usage examples
- [ ] Accessibility guide

---

## 💡 SECTION 11: DESIGN VARIATIONS & STATES

### 11.1 Loading State

```
┌──────────────────────────────────────────┐
│ ┌────────────────────────────────────┐   │
│ │ [Skeleton Photo, gray shimmer]     │   │
│ │                                    │   │
│ └────────────────────────────────────┘   │
│                                          │
│ [Skeleton text line, gray shimmer]       │
│ [Skeleton text line, 60% width]          │
│                                          │
│ [Skeleton metric bar]                    │
│                                          │
│ [Skeleton health bar]                    │
│                                          │
│ [Skeleton alert line]                    │
│                                          │
│ [Skeleton buttons]                       │
└──────────────────────────────────────────┘
```

**Animation:** Gentle shimmer effect, 2 second cycle

### 11.2 Error State

```
┌──────────────────────────────────────────┐
│ ⚠️ Failed to load pet information         │
│                                          │
│ [Retry]                                  │
└──────────────────────────────────────────┘
```

### 11.3 Empty Pet Photo State

```
┌────────────────────────────────────┐
│ [Pet species icon, light gray]     │
│ Large icon, centered               │
│ Background: light secondary color  │
└────────────────────────────────────┘

Species Icons:
🐕 Dog
🐈 Cat
🐦 Bird
🐰 Rabbit
🦜 Bird (parrot)
🐹 Small mammal (hamster, guinea pig)
❓ Unknown
```

### 11.4 Editing State

When in "edit mode," cards show:
- Checkbox for multi-select
- Outline style (vs filled background)
- Selected state: checkbox checked, highlight background

---

## 🚀 SECTION 12: PERFORMANCE OPTIMIZATION

### 12.1 Image Optimization

- **Photo size:** 
  - Grid: 120px × 120px actual display, load 240px × 240px (2x)
  - List: 80px × 80px actual display, load 160px × 160px (2x)
  - Mobile: 80px × 80px actual display, load 160px × 160px (2x)

- **Image format:** WebP primary, JPEG fallback
- **Lazy loading:** Use intersection observer for off-screen cards
- **Cache:** 30-day browser cache, CDN cache 7 days

### 12.2 Data Caching

**API Response Cache:**
- In-memory cache with SWR (stale-while-revalidate)
- Revalidate every 5 minutes
- Stale data served immediately, fresh data in background
- Real-time updates via Supabase for urgent changes

**Local Storage:**
- Cache last 20 viewed pet cards
- TTL: 1 hour
- Fallback when offline

### 12.3 Rendering Performance

- **Virtual scrolling** for lists with 50+ pets
- **React.memo** for PetCard component
- **useMemo** for expensive calculations
- **Lazy load** alert expansion below fold

---

## 📝 SECTION 13: EXAMPLE SCENARIOS

### Scenario 1: Healthy Puppy

```
┌──────────────────────────────────────────┐
│ ┌────────────────────────────────────┐   │
│ │ [Puppy photo]                      │   │
│ │ Green border (excellent)           │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Name: Luna                               │
│ Breed: Labrador Retriever • Female • 4mo│
│                                          │
│ Weight: 12 kg  │  BCS: 4/9 (IDEAL ✓)   │
│                                          │
│ Health Score: 95/100 ┃██████████┃ EXC  │
│                                          │
│ (No alerts - perfectly healthy)          │
│                                          │
│ ┌──────────────┬──────────────────────┐ │
│ │ [View]       │ [Add Record]         │ │
│ └──────────────┴──────────────────────┘ │
└──────────────────────────────────────────┘
```

### Scenario 2: Senior Dog Needing Attention

```
┌──────────────────────────────────────────┐
│ ┌────────────────────────────────────┐   │
│ │ [Senior dog photo]                 │   │
│ │ Red border (critical)              │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Name: Charlie                            │
│ Breed: Beagle • Male • 12 yrs           │
│                                          │
│ Weight: 16 kg  │  BCS: 6/9 (OVERWEIGHT)│
│                                          │
│ Health Score: 52/100 ┃███░░░░░░┃ POOR  │
│                                          │
│ 🔴 Multiple Alerts:                      │
│ • Rabies vaccination 45 days overdue    │
│ • Annual checkup: 8 months ago          │
│ • Dental cleaning overdue (22 months)   │
│                                          │
│ ┌──────────────┬──────────────────────┐ │
│ │ [View]       │ [Add Record]         │ │
│ └──────────────┴──────────────────────┘ │
└──────────────────────────────────────────┘
```

### Scenario 3: Cat with Chronic Condition

```
┌──────────────────────────────────────────┐
│ ┌────────────────────────────────────┐   │
│ │ [Cat photo]                        │   │
│ │ Orange border (fair)               │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Name: Whiskers                           │
│ Breed: Persian • Female • 8 yrs         │
│                                          │
│ Weight: 5.2 kg  │  BCS: 5/9 (IDEAL ✓)  │
│                                          │
│ Health Score: 71/100 ┃███████░░┃ FAIR  │
│                                          │
│ 🟠 Medication Compliance Issue           │
│ Insulin doses missed 2 of last 5 days   │
│                                          │
│ ┌──────────────┬──────────────────────┐ │
│ │ [View]       │ [Add Record]         │ │
│ └──────────────┴──────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## 🎓 SECTION 14: DESIGN TOKENS & VARIABLES

### Color Tokens

```css
/* Health Status */
--color-health-excellent: #22c55e;
--color-health-good: #14b8a6;
--color-health-fair: #f97316;
--color-health-poor: #ef4444;
--color-health-critical: #dc2626;

/* Background variants */
--color-health-excellent-bg: rgba(34, 197, 86, 0.08);
--color-health-good-bg: rgba(20, 184, 166, 0.08);
--color-health-fair-bg: rgba(249, 115, 22, 0.08);
--color-health-poor-bg: rgba(239, 68, 68, 0.08);
--color-health-critical-bg: rgba(220, 38, 38, 0.08);

/* Alert colors */
--color-alert-critical: #dc2626;
--color-alert-high: #f97316;
--color-alert-medium: #eab308;

/* Base colors */
--color-text: #133431;
--color-text-secondary: #627c81;
--color-surface: #ffffff;
--color-border: rgba(94, 82, 64, 0.2);
```

### Spacing Tokens

```css
--pet-card-padding: 16px;
--pet-card-gap: 12px;
--pet-card-inner-gap: 8px;
--pet-card-section-gap: 12px;
--pet-photo-size: 120px;
--pet-photo-size-list: 80px;
--pet-photo-size-mobile: 80px;
--pet-card-border-radius: 12px;
```

### Typography Tokens

```css
--pet-card-name-size: 18px;
--pet-card-name-weight: 600;
--pet-card-secondary-size: 12px;
--pet-card-secondary-weight: 400;
--pet-card-metric-size: 13px;
--pet-card-metric-weight: 500;
--pet-card-health-size: 12px;
--pet-card-health-weight: 700;
```

---

## ✅ FINAL CHECKLIST

Before launching Pet Card component:

- [ ] All three view formats implemented (grid, list, mobile)
- [ ] Color coding matches Pawzly design system
- [ ] Alert priority logic tested
- [ ] Health score calculation verified
- [ ] Responsive design tested on 5+ devices
- [ ] Accessibility audit completed (WCAG AA)
- [ ] Touch targets minimum 44px × 44px
- [ ] Images optimized (WebP, 2x resolution)
- [ ] Real-time updates working (Supabase)
- [ ] Error states handled gracefully
- [ ] Loading states show skeleton
- [ ] Empty states clear
- [ ] Performance metrics: <100ms render, <2MB total
- [ ] Cross-browser testing (Safari, Chrome, Firefox, Edge)
- [ ] Mobile performance tested (4G throttling)
- [ ] Keyboard navigation working
- [ ] Screen reader testing with NVDA/JAWS
- [ ] Documentation complete
- [ ] Component tests >80% coverage
- [ ] E2E tests for critical paths
- [ ] Ready for production deployment

---

## 🎉 PRODUCTION READY

This comprehensive Pet Card specification is complete and ready for development.

**Status:** ✅ PRODUCTION-READY  
**Version:** 1.0  
**Last Updated:** January 10, 2026

---

🐾 **Perfect pet information at a glance. Every time.** 🐾
