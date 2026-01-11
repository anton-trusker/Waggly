# 🎨 PET CARD - QUICK REFERENCE VISUAL GUIDE

**A visual summary of all Pet Card layouts, colors, and states**

---

## 📱 COMPACT GRID VIEW (PRIMARY FORMAT)
**Used on: Dashboard, Pet List Grid View**
**Dimensions: 280px × 340px (mobile: full width)**
**Information Density: HIGH (9-10 fields)**

```
┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │    EXCELLENT (90-100)            │ │
│ │    🟢 Green border               │ │
│ │    Green background (light)      │ │
│ │    [Pet Photo 120x120]           │ │
│ │    Square, rounded 12px          │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Max                                  │  ← Pet name (18px, bold)
│ ──────────────────────────────────── │
│ Golden Retriever • Male • 5 yrs     │  ← Breed, gender, age (12px, secondary)
│                                      │
│ Weight: 28 kg  │  BCS: 4/9 (IDEAL ✓)│  ← Physical metrics (13px, medium)
│                                      │
│ Health Score: 87/100 ┃████████░░┃  │  ← Health score with bar
│ GOOD                                │  ← Status (12px, bold, colored)
│                                      │
│ (No alerts section)                  │  ← If healthy
│                                      │
│ ┌──────────────┬──────────────────┐ │
│ │ [View]       │ [Add Record]     │ │
│ └──────────────┴──────────────────┘ │
└──────────────────────────────────────┘

────────────────────────────────────────

┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │    GOOD (75-89)                  │ │
│ │    🔵 Teal border                │ │
│ │    Teal background (light)       │ │
│ │    [Pet Photo 120x120]           │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Luna                                 │
│ ──────────────────────────────────── │
│ Labrador Retriever • Female • 2 yrs │
│                                      │
│ Weight: 35 kg  │  BCS: 5/9 (IDEAL ✓)│
│                                      │
│ Health Score: 82/100 ┃████████░░┃  │
│ GOOD                                │
│                                      │
│ 💉 Vaccines: 1 due (upcoming)        │
│ [Next due in 7 days]                │
│                                      │
│ ┌──────────────┬──────────────────┐ │
│ │ [View]       │ [Add Record]     │ │
│ └──────────────┴──────────────────┘ │
└──────────────────────────────────────┘

────────────────────────────────────────

┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │    FAIR (60-74)                  │ │
│ │    🟡 Orange border              │ │
│ │    Orange background (light)     │ │
│ │    [Pet Photo 120x120]           │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Whiskers                             │
│ ──────────────────────────────────── │
│ Persian Cat • Female • 8 yrs        │
│                                      │
│ Weight: 5.2 kg  │  BCS: 6/9 (OVER) │
│                                      │
│ Health Score: 71/100 ┃███████░░┃   │
│ FAIR                                │
│                                      │
│ ⚠️  Medication Compliance Issue      │
│ 2 of last 5 doses missed            │
│                                      │
│ ┌──────────────┬──────────────────┐ │
│ │ [View]       │ [Add Record]     │ │
│ └──────────────┴──────────────────┘ │
└──────────────────────────────────────┘

────────────────────────────────────────

┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │    POOR (40-59)                  │ │
│ │    🔴 Red border                 │ │
│ │    Red background (light)        │ │
│ │    [Pet Photo 120x120]           │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Charlie                              │
│ ──────────────────────────────────── │
│ Beagle • Male • 12 yrs              │
│                                      │
│ Weight: 16 kg  │  BCS: 7/9 (OVER)  │
│                                      │
│ Health Score: 52/100 ┃████░░░░░░┃  │
│ POOR                                │
│                                      │
│ 🔴 CRITICAL: Rabies Vaccination     │
│ Overdue 45 days - URGENT!           │
│                                      │
│ ┌──────────────┬──────────────────┐ │
│ │ [View]       │ [Add Record]     │ │
│ └──────────────┴──────────────────┘ │
└──────────────────────────────────────┘

────────────────────────────────────────

┌──────────────────────────────────────┐
│ ┌──────────────────────────────────┐ │
│ │    CRITICAL (0-39)               │ │
│ │    🔴 Dark Red border            │ │
│ │    Dark Red background (light)   │ │
│ │    [Pet Photo 120x120]           │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Max                                  │
│ ──────────────────────────────────── │
│ German Shepherd • Male • 14 yrs     │
│                                      │
│ Weight: 32 kg  │  BCS: 8/9 (OBESE) │
│                                      │
│ Health Score: 35/100 ┃███░░░░░░░░┃ │
│ CRITICAL                            │
│                                      │
│ 🔴 MULTIPLE CRITICAL ISSUES:        │
│ • 3 vaccinations overdue            │
│ • Overdue for annual checkup        │
│ • Untreated chronic condition       │
│                                      │
│ ┌──────────────┬──────────────────┐ │
│ │ [View]       │ [Add Record]     │ │
│ └──────────────┴──────────────────┘ │
└──────────────────────────────────────┘
```

---

## 📊 DETAILED LIST VIEW
**Used on: Pet Registry (Table View), Desktop**
**Dimensions: Full width, ~120px height**
**Information Density: MEDIUM (7 fields visible)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Photo] Name         Breed          Weight  BCS      Health    Vaccines  ...│
│         (80×80)      (auto-expand)  (80px)  (100px)  (120px)   (100px)  ...│
├─────────────────────────────────────────────────────────────────────────────┤
│         │ Max         Golden         28 kg   4/9      87/100    ✓ Current  │
│ [🟢]    │             Retriever            (IDEAL)   GOOD      Status     │
│ 80×80   │ 5 years old                                          ───────    │
│         │                                                      Actions    │
│         │                                                      [View]     │
│         │                                                      [Add]      │
│         │                                                      [More ▼]   │
├─────────────────────────────────────────────────────────────────────────────┤
│         │ Luna        Labrador       35 kg   5/9      82/100    ⚠️ 1 Due   │
│ [🔵]    │             Retriever            (IDEAL)   GOOD      In 7 days  │
│ 80×80   │ 2 years old                                          ───────    │
│         │                                                      [View]     │
│         │                                                      [Add]      │
│         │                                                      [More ▼]   │
├─────────────────────────────────────────────────────────────────────────────┤
│         │ Whiskers    Persian        5.2kg   6/9      71/100    ⚠️ Alert   │
│ [🟡]    │             Cat                  (OVER)    FAIR      Med Issue  │
│ 80×80   │ 8 years old                                          ───────    │
│         │                                                      [View]     │
│         │                                                      [Add]      │
│         │                                                      [More ▼]   │
├─────────────────────────────────────────────────────────────────────────────┤
│         │ Charlie     Beagle         16 kg   7/9      52/100    🔴 2 Overdue│
│ [🔴]    │             Mix                  (OVER)    POOR      URGENT!   │
│ 80×80   │ 12 years old                                         ───────    │
│         │                                                      [View]     │
│         │                                                      [Add]      │
│         │                                                      [More ▼]   │
└─────────────────────────────────────────────────────────────────────────────┘

Color Coding by Health Status:
🟢 Excellent (90-100) - Green border
🔵 Good (75-89) - Teal border
🟡 Fair (60-74) - Orange border
🔴 Poor (40-59) - Red border
🔴 Critical (0-39) - Dark red border
```

---

## 📱 MOBILE ROW VIEW
**Used on: Pet Registry (Mobile), Mobile Dashboard**
**Dimensions: Full width, ~110px height**
**Information Density: MEDIUM (5 fields visible)**

```
Mobile (< 640px)
───────────────────────────────────────

┌───────────────────────────────────┐
│ [Photo] Max              87/100 GOOD
│ 80×80  Golden Retriever  28kg | 4/9 ✓
│        
│ 💉 Vaccines: Current Status ✓
│                           
│ [View]  [+]              
│ (40px)  (40px)           
└───────────────────────────────────┘

────────────────────────────────────

┌───────────────────────────────────┐
│ [Photo] Luna              82/100 GOOD
│ 80×80  Labrador Mix       35kg | 5/9 ✓
│        
│ ⚠️ Vaccine due in 7 days (upcoming)
│                           
│ [View]  [+]              
│ (40px)  (40px)           
└───────────────────────────────────┘

────────────────────────────────────

┌───────────────────────────────────┐
│ [Photo] Whiskers          71/100 FAIR
│ 80×80  Persian Cat        5.2kg | 6/9
│        
│ ⚠️ Medication Compliance Issue
│                           
│ [View]  [+]              
│ (40px)  (40px)           
└───────────────────────────────────┘

────────────────────────────────────

┌───────────────────────────────────┐
│ [Photo] Charlie           52/100 POOR
│ 80×80  Beagle Mix         16kg | 7/9
│        
│ 🔴 CRITICAL: 2 Vaccines Overdue
│                           
│ [View]  [+]              
│ (40px)  (40px)           
└───────────────────────────────────┘
```

---

## 🎨 COLOR PALETTE FOR PET CARDS

```
HEALTH STATUS COLORS:

Excellent (90-100)
├─ Primary Color: #22c55e (Green-500)
├─ Background: #f0fdf4 (Light Green)
├─ Text: #166534 (Green-900)
└─ Use: Borders, text, progress bars

Good (75-89)
├─ Primary Color: #14b8a6 (Teal-500)
├─ Background: #f0fdfa (Light Teal)
├─ Text: #134e4a (Teal-900)
└─ Use: Borders, text, progress bars

Fair (60-74)
├─ Primary Color: #f97316 (Orange-500)
├─ Background: #fef3c7 (Light Orange)
├─ Text: #b45309 (Orange-900)
└─ Use: Borders, text, progress bars

Poor (40-59)
├─ Primary Color: #ef4444 (Red-500)
├─ Background: #fef2f2 (Light Red)
├─ Text: #7f1d1d (Red-900)
└─ Use: Borders, text, progress bars

Critical (0-39)
├─ Primary Color: #dc2626 (Red-600)
├─ Background: #fef2f2 (Light Red, darker)
├─ Text: #7f1d1d (Red-900, darker)
└─ Use: Borders, text, progress bars

ALERT COLORS:

Critical Alert 🔴
├─ Icon: Red-600 (#dc2626)
├─ Text: Red-900 (#7f1d1d)
├─ Background: Light red (#fef2f2)
└─ Usage: Overdue vaccinations, emergency

Warning Alert 🟠
├─ Icon: Orange-500 (#f97316)
├─ Text: Orange-900 (#b45309)
├─ Background: Light orange (#fef3c7)
└─ Usage: Upcoming due dates, compliance issues

Info Alert 🔵
├─ Icon: Teal-500 (#14b8a6)
├─ Text: Teal-900 (#134e4a)
├─ Background: Light teal (#f0fdfa)
└─ Usage: Neutral information

TEXT COLORS:

Primary Text (Names, labels)
└─ Color: #133431 (Slate-900) on light / #f5f5f5 on dark

Secondary Text (Breed, metadata)
└─ Color: #627c81 (Slate-500)

Muted Text (Hints, timestamps)
└─ Color: #a7a9a9 (Gray-400)

SUCCESS / IDEAL INDICATOR
└─ Color: #22c55e (Green-500) with ✓ checkmark

```

---

## 📐 SPACING & LAYOUT REFERENCE

```
GRID VIEW CARD (280×340px):

Top to Photo:        16px padding
Photo dimensions:    120×120px
Photo to Name:       12px gap
Name to Breed:       8px gap
Breed to Metrics:    12px gap
Between metrics:     8px gap (50/50 split)
Metrics to Health:   12px gap
Health to Alert:     12px gap
Alert to Buttons:    12px gap
Buttons:             8px gap between them
Bottom padding:      12px

Total spacing: 60px (header + padding)
Used for content: 280px total height

MOBILE ROW VIEW:

Left photo:        12px padding
Photo size:        80×80px
Photo to content:  8px gap
Content padding:   12px
Right padding:     12px
Total height:      ~110px

LIST VIEW:

Padding:           12px vertical, 16px horizontal
Photo size:        80×80px
Column gaps:       16px
Row height:        ~120px
```

---

## 🎭 INTERACTIVE STATES

```
DEFAULT STATE:
└─ Background: Solid white / surface color
└─ Shadow: var(--shadow-sm) (subtle)
└─ Cursor: pointer
└─ Opacity: 1.0

HOVER STATE (Desktop):
└─ Background: Subtle shade (opacity 0.05)
└─ Shadow: var(--shadow-md) (elevated)
└─ Cursor: pointer
└─ Border: Slightly darker

FOCUS STATE (Keyboard):
└─ Outline: 2px solid (health status color)
└─ Outline offset: 2px
└─ Shadow: Maintained
└─ Accessible for keyboard navigation

ACTIVE/PRESSED STATE:
└─ Background: var(--color-secondary)
└─ Shadow: var(--shadow-lg)
└─ Scale: 0.98 (slight compression)
└─ Used on: Mobile tap

LOADING STATE:
└─ Skeleton placeholder: Gray shimmer effect
└─ Animation: 2-second cycle
└─ All elements shimmer together
└─ Maintains card dimensions

ERROR STATE:
└─ Background: Light red
└─ Message: "Failed to load pet information"
└─ Button: [Retry]
└─ Icon: ⚠️ Warning symbol
```

---

## 📏 RESPONSIVE GRID LAYOUTS

```
Desktop (>1200px):
├─ Grid: 4 columns
├─ Gap: 16px between cards
├─ Card width: calc(25% - 12px)
├─ Max width: 300px
└─ Example: 4 pets across

Tablet Large (768-1200px):
├─ Grid: 3 columns
├─ Gap: 16px between cards
├─ Card width: calc(33.333% - 11px)
├─ Max width: none
└─ Example: 3 pets across

Tablet Small (640-768px):
├─ Grid: 2 columns
├─ Gap: 12px between cards
├─ Card width: calc(50% - 6px)
├─ Max width: none
└─ Example: 2 pets across

Mobile (<640px):
├─ Switch to: List/Row view
├─ Grid: 1 column (full width)
├─ Gap: 12px between items
├─ Height: ~110px per row
└─ Example: 5-10 pets per screen
```

---

## ✨ VISUAL INDICATORS & ICONS

```
HEALTH STATUS INDICATORS:

Excellent: ✅ or 🟢 Green circle + checkmark
Good:      ✓ or 🔵 Teal circle + checkmark
Fair:      ⚠️ or 🟡 Orange diamond warning
Poor:      ❌ or 🔴 Red circle with exclamation
Critical:  🚨 or 🔴 Red alert with ! + flashing

METRIC INDICATORS:

BCS Ideal:           ✓ Green checkmark
BCS Overweight:      ⚠️ Orange warning
BCS Underweight:     ⚠️ Orange warning
BCS Obese:          🔴 Red alert

Vaccination Current: ✓ Green checkmark
Vaccination Overdue: 🔴 Red alert
Vaccination Due:     ⚠️ Yellow warning

Weight Status:       
├─ Normal: No icon
├─ Rapid change: ⚠️ Orange warning
└─ Critical: 🔴 Red alert

MEDICATION STATUS:

Active Medications:  💊 Pill icon + count
Current Meds:       ✓ Green indicator
Missed Doses:       🔴 Red alert
Compliance Issue:    ⚠️ Orange warning

CHECKUP STATUS:

Checkup Current:    ✓ Green circle
Overdue Checkup:    🔴 Red alert
Upcoming:           📅 Calendar icon
```

---

## 🎯 QUICK REFERENCE: What Information Shows

### ALWAYS VISIBLE:
- Pet photo (with border color indicating health)
- Pet name (large, prominent)
- Breed + gender + age
- Weight (current)
- BCS score (with category)
- Health score (0-100 with category + bar)
- TOP ALERT ONLY (if exists)
- Action buttons

### HIDDEN/DETAILS:
- Complete medical history
- All alerts (only top 1 shown on card)
- Detailed health components (shown in full profile)
- Medication list (shown in full profile)
- Vaccination history (shown in full profile)

### COLOR INDICATES:
- Border color = Overall health status
- Health bar color = Same as status
- Alert color = Severity level
- BCS color = Weight category

---

## 📋 SUMMARY TABLE

| Aspect | Grid View | List View | Mobile View |
|--------|-----------|-----------|-------------|
| **Size** | 280×340px | Full width ×120px | Full width ×110px |
| **Photo** | 120×120px | 80×80px | 80×80px |
| **Fields Visible** | 9-10 | 7 | 5 |
| **Info Density** | HIGH | MEDIUM | MEDIUM |
| **Use Case** | Dashboard | Pet registry | Mobile list |
| **Layout** | Vertical card | Horizontal row | Horizontal row |
| **Best for** | Quick overview | Detailed view | Mobile management |
| **Interactions** | Tap → details | Buttons visible | Tap → details |

---

**🐾 Pet Card Component Specification - Complete Visual Reference 🐾**

This quick reference guide contains all visual specifications, colors, layouts, and interactive states for implementing the Pet Card component across all Waggli platforms.

**Ready for Design & Development!**
