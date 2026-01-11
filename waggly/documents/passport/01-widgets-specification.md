# Pet Passport Tab - Complete Widget Specifications

**Document Version:** 1.0  
**Created:** January 10, 2026  
**Purpose:** Detailed specifications for all widgets in the Pet Passport tab

---

## TABLE OF CONTENTS

1. [Passport Header Widget](#passport-header-widget)
2. [Pet Identification Widget](#pet-identification-widget)
3. [Physical Characteristics Widget](#physical-characteristics-widget)
4. [Health Dashboard Widget](#health-dashboard-widget)
5. [Vaccination Table Widget](#vaccination-table-widget)
6. [Treatments & Medications Widget](#treatments--medications-widget)
7. [Medical History Timeline Widget](#medical-history-timeline-widget)
8. [Important Notes & Allergies Widget](#important-notes--allergies-widget)
9. [Emergency Information Widget](#emergency-information-widget)
10. [Travel Readiness Widget](#travel-readiness-widget)

---

## PASSPORT HEADER WIDGET

### Purpose
Provides passport identification, export actions, and generation timestamp.

### Visual Layout
```
┌──────────────────────────────────────────────────────────┐
│  🛂 DIGITAL PET PASSPORT                                │
│                                                          │
│  Passport ID: PP-12345678                               │
│  Generated: January 10, 2026                            │
│  Last Updated: January 10, 2026, 09:00 AM               │
│                                                          │
│  ┌──────────┐ ┌─────────┐ ┌────────────┐ ┌─────────┐  │
│  │Download  │ │ Print   │ │Generate QR │ │ Share   │  │
│  │   PDF    │ │         │ │    Code    │ │         │  │
│  └──────────┘ └─────────┘ └────────────┘ └─────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Data Fields

**Passport ID**
- Format: `PP-{8-digit-random-number}`
- Example: `PP-12345678`
- Generation: Random on first passport creation
- Storage: `pets` table, new column `passport_id`
- Uniqueness: Unique per pet
- Font: 16px, semibold, monospace (#2d3748)

**Timestamps**
- Generated date: First creation timestamp
- Last updated: Latest data modification
- Format: "MMMM DD, YYYY" or "MMMM DD, YYYY, HH:MM AM/PM"
- Font: 14px, normal, gray (#718096)

### Action Buttons

**1. Download PDF**
- **Icon:** Download icon (↓)
- **Label:** "Download PDF"
- **Style:** Primary button
  - Background: #14b8a6 (teal)
  - Text: #ffffff (white)
  - Padding: 12px 24px
  - Border radius: 8px
- **Action:** Generate PDF and trigger download
- **Loading State:** Show spinner + "Generating..." text
- **File Name:** `{pet_name}_passport_{date}.pdf`

**2. Print**
- **Icon:** Printer icon (🖨)
- **Label:** "Print"
- **Style:** Secondary button
  - Background: transparent
  - Border: 2px solid #14b8a6
  - Text: #14b8a6
  - Padding: 12px 24px
- **Action:** `window.print()` with print-optimized CSS
- **Print Layout:** Single-column, all sections visible

**3. Generate QR Code**
- **Icon:** QR code icon
- **Label:** "Generate QR"
- **Style:** Secondary button
- **Action:** Generate QR code modal
- **QR Content:** `https://waggli.app/passport/{passport_id}`
- **Modal:** 400x400px QR code, downloadable PNG

**4. Share**
- **Icon:** Share icon (↗)
- **Label:** "Share"
- **Style:** Secondary button
- **Action:** Open share modal
- **Share Options:**
  - Copy link
  - Email
  - WhatsApp
  - SMS

### Responsive Behavior

| Breakpoint | Layout | Button Style |
|------------|--------|--------------|
| Desktop (>1024px) | 4 buttons in row | Full labels |
| Tablet (640-1024px) | 2x2 grid | Full labels |
| Mobile (<640px) | 2x2 grid | Icon + short labels |

### Database Requirements
```sql
-- Add to pets table
ALTER TABLE pets ADD COLUMN passport_id VARCHAR(16) UNIQUE;
ALTER TABLE pets ADD COLUMN passport_generated_at TIMESTAMP;
ALTER TABLE pets ADD COLUMN passport_updated_at TIMESTAMP;
```

---

## PET IDENTIFICATION WIDGET

### Purpose
Core pet identification information including photo, demographics, and official IDs.

### Visual Layout
```
┌──────────────────────────────────────────────────────────┐
│  PET IDENTIFICATION                                      │
│  ─────────────────────────────────────────────────────── │
│                                                          │
│  ┌─────────────┐  Name:         Max                     │
│  │             │  Species:      Dog                      │
│  │   [Photo]   │  Breed:        Golden Retriever         │
│  │   200x200   │  Gender:       Male ♂                   │
│  │             │  Date of Birth: March 15, 2020 (5 yrs)  │
│  └─────────────┘  Spayed/Neutered: Yes                  │
│                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                          │
│  Microchip:         982000123456789                     │
│  Microchip Date:    April 1, 2020                       │
│  Registration ID:   AKC-123456                          │
│  Pet Status:        Active                              │
└──────────────────────────────────────────────────────────┘
```

### Data Fields

**Pet Photo**
- **Size:** 200px × 200px (desktop), 150px × 150px (mobile)
- **Shape:** Square with rounded corners (12px border-radius)
- **Border:** 3px solid, color based on health status
  - Excellent: #22c55e (green)
  - Good: #14b8a6 (teal)
  - Fair: #f97316 (orange)
  - Poor/Critical: #ef4444 (red)
- **Fallback:** Species icon + pet name initial
- **Interaction:** Click to enlarge in modal
- **Source:** `pets.photo_url`

**Core Demographics (Left Side)**
- **Name:** `pets.name` - 20px, bold, #1a202c
- **Species:** `pets.species` - 14px, normal, #4a5568
- **Breed:** `pets.breed` - 14px, normal, #4a5568
- **Gender:** `pets.gender` + symbol (♂ male, ♀ female)
- **Date of Birth:** `pets.date_of_birth` + calculated age
  - Format: "March 15, 2020 (5 yrs)"
  - Age calculation: Display years if ≥1, else months

**Reproductive Status (Right Side)**
- **Spayed/Neutered:** `pets.is_spayed_neutered`
  - Display: "Yes" or "No"
  - Optional: Include date if available

**Official Identification (Full Width)**
- **Microchip Number:** `pets.microchip_number`
  - Format: 15-digit, monospace font
  - Example: 982000123456789
- **Microchip Date:** New field - implantation date
- **Registration ID:** `pets.registration_id`
  - Example: AKC-123456, CFA-789012
- **Pet Status:** "Active", "Deceased", "Lost", "Transferred"

### Styling

**Container**
- Background: #ffffff (light mode), #1a202c (dark mode)
- Padding: 24px
- Border: 1px solid #e2e8f0
- Border radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Margin bottom: 20px

**Section Title**
- Text: "PET IDENTIFICATION"
- Font: 18px, bold, uppercase, #1a202c
- Border bottom: 2px solid #14b8a6
- Margin bottom: 16px
- Padding bottom: 8px

**Data Labels**
- Font: 13px, semibold, #718096
- Display: inline
- After label: colon + 8px spacing

**Data Values**
- Font: 14px, normal, #1a202c
- Margin left: 8px from label

### Database Requirements
```sql
-- Existing fields
pets.name
pets.species
pets.breed
pets.gender
pets.date_of_birth
pets.is_spayed_neutered
pets.microchip_number
pets.registration_id
pets.photo_url

-- New fields needed
ALTER TABLE pets ADD COLUMN microchip_date DATE;
ALTER TABLE pets ADD COLUMN pet_status VARCHAR(20) DEFAULT 'active';
ALTER TABLE pets ADD COLUMN spayed_neutered_date DATE;
ALTER TABLE pets ADD COLUMN tattoo_id VARCHAR(50);
```

---

## PHYSICAL CHARACTERISTICS WIDGET

### Purpose
Display physical measurements, appearance, and weight tracking.

### Visual Layout
```
┌──────────────────────────────────────────────────────────┐
│  PHYSICAL CHARACTERISTICS                                │
│  ─────────────────────────────────────────────────────── │
│                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │   Weight     │ │     BCS      │ │     Size     │    │
│  │              │ │              │ │              │    │
│  │   28 kg      │ │   4/9 IDEAL  │ │    Large     │    │
│  │   (62 lbs)   │ │      ✓       │ │              │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
│                                                          │
│  Color:               Golden                            │
│  Coat Type:           Long, Double Coat                 │
│  Eye Color:           Brown                             │
│  Distinguishing Marks: White patch on chest            │
│                                                          │
│  ━━━━━━━━━━━━ WEIGHT HISTORY (Last 6 months) ━━━━━━━━  │
│                                                          │
│  [Line Chart: Weight Trend]                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Metric Cards (3-column layout)

**Card 1: Weight**
- **Current Weight:** Latest from `weight_entries` table
- **Primary Unit:** User's preferred unit (kg or lbs)
- **Secondary Unit:** Converted value in parentheses
- **Trend Indicator:**
  - ↑ Red: Weight increasing rapidly (>5% per month)
  - → Green: Stable (<2% change)
  - ↓ Orange: Weight decreasing
- **Font:** 24px bold for weight, 14px for unit

**Card 2: Body Condition Score (BCS)**
- **Score:** Format: X/9
- **Category:** UNDERWEIGHT, IDEAL, OVERWEIGHT, OBESE
- **Visual:** Checkmark ✓ if ideal (score 4-5)
- **Color Coding:**
  - Score 1-3: #f97316 (orange) - Underweight
  - Score 4-5: #22c55e (green) - Ideal ✓
  - Score 6-7: #f97316 (orange) - Overweight
  - Score 8-9: #ef4444 (red) - Obese
- **Font:** 24px bold for score, 12px for category

**Card 3: Size**
- **Value:** Small, Medium, Large
- **Source:** `pets.size`
- **Optional:** Breed standard comparison
- **Font:** 24px bold

### Appearance Details

**Data Fields (2-column layout on desktop)**
- **Color:** `pets.color` - Primary coat color
- **Coat Type:** New field - Long, Short, Wire, Curly, etc.
- **Eye Color:** New field - Brown, Blue, Green, Hazel
- **Distinguishing Marks:** Text area for unique features

### Weight History Chart

**Chart Specifications**
- **Type:** Line chart (use recharts or similar library)
- **Data Source:** `weight_entries` table
- **Time Range:** Last 6 months by default
- **Height:** 200px
- **Responsive:** Full width of container

**Chart Features**
- **Data Points:** Circle markers at each weight entry
- **Line Color:**
  - #14b8a6 (teal) if in healthy range
  - #f97316 (orange) if trending concerning
- **Grid:** Light gray horizontal lines
- **Hover:** Tooltip showing exact weight and date
- **Ideal Range:** Shaded band if ideal weight range defined
- **Current Weight:** Highlighted with larger marker

**Chart Styling**
```typescript
{
  line: {
    stroke: '#14b8a6',
    strokeWidth: 2,
  },
  dot: {
    fill: '#14b8a6',
    r: 4,
  },
  grid: {
    stroke: '#e2e8f0',
    strokeDasharray: '3 3',
  },
  tooltip: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  }
}
```

### Database Requirements
```sql
-- Existing
pets.weight
pets.size
pets.color
weight_entries.weight
weight_entries.date

-- New fields needed
ALTER TABLE pets ADD COLUMN coat_type VARCHAR(50);
ALTER TABLE pets ADD COLUMN eye_color VARCHAR(50);
ALTER TABLE pets ADD COLUMN distinguishing_marks TEXT;
ALTER TABLE pets ADD COLUMN ideal_weight_min DECIMAL(5,2);
ALTER TABLE pets ADD COLUMN ideal_weight_max DECIMAL(5,2);

-- Create BCS tracking table
CREATE TABLE body_condition_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 9),
  assessed_date DATE NOT NULL,
  assessed_by VARCHAR(200),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## HEALTH DASHBOARD WIDGET

### Purpose
Comprehensive health scoring, risk assessment, and recommendations.

### Visual Layout
```
┌──────────────────────────────────────────────────────────┐
│  HEALTH DASHBOARD                                        │
│  ─────────────────────────────────────────────────────── │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │         OVERALL HEALTH SCORE                      │  │
│  │                                                   │  │
│  │            87/100                                 │  │
│  │     ████████████░░░░ GOOD                     │  │
│  │                                                   │  │
│  │  Data Completeness: 85%  │  Last Updated: Today │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │Preventive    │ │Vaccination   │ │Weight        │    │
│  │Care          │ │Status        │ │Management    │    │
│  │              │ │              │ │              │    │
│  │  90/100      │ │  75/100      │ │  80/100      │    │
│  │  EXCELLENT   │ │  GOOD        │ │  GOOD        │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
│                                                          │
│  ━━━━━━━━━━━━━━━━ HEALTH RISKS ━━━━━━━━━━━━━━━━━━━━   │
│                                                          │
│  🟡 MEDIUM RISK - Overweight (8% above ideal)           │
│     → Diet and exercise adjustment recommended          │
│                                                          │
│  🟢 LOW RISK - Senior Pet (6 years)                     │
│     → Bi-annual checkups recommended                    │
│                                                          │
│  ━━━━━━━━━━━━━━ RECOMMENDATIONS ━━━━━━━━━━━━━━━━━━━   │
│                                                          │
│  🔴 URGENT - Bordetella vaccine overdue (30 days)       │
│     [Schedule Vaccination]                              │
│                                                          │
│  🟠 HIGH - Annual dental cleaning recommended           │
│     Last cleaning: 18 months ago                        │
│     [Book Appointment]                                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Overall Health Score Card

**Main Score Display**
- **Score:** 0-100 integer
- **Font:** 48px, bold, color-coded
- **Colors:**
  - 90-100: #22c55e (Excellent - Green)
  - 75-89: #14b8a6 (Good - Teal)
  - 60-74: #f97316 (Fair - Orange)
  - 40-59: #ef4444 (Poor - Red)
  - 0-39: #dc2626 (Critical - Dark Red)

**Progress Bar**
- **Height:** 12px
- **Border radius:** 6px
- **Background:** #e2e8f0 (light gray)
- **Fill:** Health status color
- **Width:** 80% of container
- **Animation:** Smooth fill on load

**Category Label**
- **Text:** "EXCELLENT", "GOOD", "FAIR", "POOR", "CRITICAL"
- **Font:** 18px, bold, same color as score
- **Position:** Below progress bar

**Metadata Row**
- **Data Completeness:** Percentage of filled passport fields
  - Formula: (filled_fields / total_fields) * 100
- **Last Updated:** Timestamp of last calculation
- **Font:** 12px, #718096 (gray)

### Component Health Scores (3 cards)

**1. Preventive Care Score (0-100)**
Factors:
- Annual checkup (30 points max)
  - Within 12 months: 30 points
  - 12-18 months: 15 points
  - >18 months: 0 points
- Vaccination compliance (30 points max)
  - 100% current: 30 points
  - 75-99%: 20 points
  - <75%: 10 points
- Parasite prevention (25 points max)
  - Active flea/tick: 12 points
  - Active heartworm: 13 points
- Dental care (15 points max)
  - Within 12 months: 15 points
  - >24 months: 0 points

**2. Vaccination Status Score (0-100)**
- % of required vaccines up-to-date
- Calculation: (current_vaccines / required_vaccines) * 100
- Required vaccines based on species and age

**3. Weight Management Score (0-100)**
Factors:
- Within ideal range: 40 points
- BCS ideal (4-5): 30 points
- Stable trend (<3% monthly change): 20 points
- Regular tracking (entry in last 3 months): 10 points

### Health Risks Section

**Risk Display Format**
```
[ICON] RISK_LEVEL - Risk Name
  → Mitigation recommendation
```

**Risk Levels & Colors**
- 🔴 **HIGH/CRITICAL:** Red background (#fef2f2)
- 🟡 **MEDIUM:** Orange background (#fef3c7)
- 🟢 **LOW:** Green background (#f0fdf4)

**Risk Examples**
- Obesity (weight >20% above ideal)
- Chronic condition unmanaged
- Senior pet (age-based)
- Breed-specific predispositions
- Medication interactions
- Overdue vaccinations

### Recommendations Section

**Priority Levels**
- 🔴 **URGENT:** Action within 1 week
- 🟠 **HIGH:** Action within 1 month
- 🟡 **MEDIUM:** Action within 3 months
- 🔵 **LOW:** Action within 6-12 months

**Recommendation Format**
- Icon + Priority + Title
- Context/details (smaller text)
- Action button (optional)

**Action Buttons**
- "Schedule Vaccination"
- "Book Appointment"
- "Update Record"
- "View Details"

### Database Requirements
```sql
-- Create health scores table
CREATE TABLE health_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  calculated_date TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Overall score
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  score_category VARCHAR(20), -- excellent, good, fair, poor, critical
  
  -- Component scores
  preventive_care_score INTEGER,
  vaccination_score INTEGER,
  weight_management_score INTEGER,
  
  -- Metadata
  data_completeness_percentage INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create health risks table
CREATE TABLE health_risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  risk_type VARCHAR(100) NOT NULL,
  risk_level VARCHAR(20), -- low, medium, high, critical
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  description TEXT,
  mitigation TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create recommendations table
CREATE TABLE health_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(100) NOT NULL,
  priority VARCHAR(20) NOT NULL, -- urgent, high, medium, low
  title VARCHAR(200) NOT NULL,
  description TEXT,
  action_button_text VARCHAR(100),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## VACCINATION TABLE WIDGET

### Purpose
Complete vaccination history with compliance tracking and scheduling.

### Visual Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│  VACCINATION HISTORY                                              📊     │
│  ────────────────────────────────────────────────────────────────────   │
│                                                                          │
│  Compliance: 75% (3/4 current)  │  2 Overdue  │  1 Due Soon           │
│                                                                          │
│  [Filter: All] [Filter: Core] [Filter: Non-Core] [Search...]           │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │Vaccine    │Date Given │Next Due  │Status    │Vet       │Actions│  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │Rabies     │Mar 15,'23 │Mar 15,'26│✓ Current │Dr. Smith │[View] │  │
│  │(Core)     │           │(2 mo)    │          │          │       │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │DHPP       │Apr 10,'24 │Apr 10,'25│⚠️ OVERDUE│Dr. Jones │[Book] │  │
│  │(Core)     │           │(30 days) │          │          │       │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │Bordetella │Jan 5,'25  │Jan 5,'26 │⏱ Due Soon│Dr. Smith │[Book] │  │
│  │(Non-Core) │           │(14 days) │          │          │       │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  [+ Add Vaccination Record]                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

### Compliance Summary (Header Cards)

**Card 1: Compliance Percentage**
- **Calculation:** (current_vaccines / required_vaccines) * 100
- **Color Coding:**
  - >90%: #22c55e (green)
  - 70-89%: #f97316 (orange)
  - <70%: #ef4444 (red)
- **Display:** "75% (3/4 current)"

**Card 2: Overdue Count**
- **Count:** Number of vaccines past next_due_date
- **Color:** #ef4444 (red) if >0
- **Display:** "2 Overdue"

**Card 3: Due Soon**
- **Count:** Vaccines due within 30 days
- **Color:** #f97316 (orange)
- **Display:** "1 Due Soon"

### Filters & Search

**Filter Buttons**
- All (default)
- Core vaccines only
- Non-core vaccines only

**Search Bar**
- Search by vaccine name
- Real-time filtering

### Table Columns

**Column 1: Vaccine Name**
- **Primary:** Vaccine name (e.g., "Rabies")
- **Secondary:** Category in parentheses - "(Core)" or "(Non-Core)"
- **Font:** 14px bold for name, 12px normal for category
- **Width:** 20%

**Column 2: Date Given**
- **Format:** "MMM DD, 'YY" (e.g., "Mar 15, '23")
- **Source:** `vaccinations.date_given`
- **Width:** 15%

**Column 3: Next Due**
- **Format:** Date + relative time
  - "Mar 15, '26 (2 mo)"
  - "(30 days)" if overdue
- **Source:** `vaccinations.next_due_date`
- **Width:** 20%

**Column 4: Status**
- **Values:**
  - ✓ Current (green)
  - ⚠️ OVERDUE (red)
  - ⏱ Due Soon (orange)
- **Logic:**
  - Current: next_due_date > today
  - Overdue: next_due_date < today
  - Due Soon: next_due_date within 30 days
- **Width:** 15%

**Column 5: Veterinarian**
- **Source:** `vaccinations.administering_vet`
- **Format:** "Dr. {last_name}"
- **Width:** 20%

**Column 6: Actions**
- **Buttons:**
  - [View] - View details modal
  - [Book] - Schedule appointment (if overdue/due soon)
- **Width:** 10%

### Row Styling

**Hover State**
- Background: #f7fafc
- Cursor: pointer

**Status Colors (left border)**
- Current: 3px left border, #22c55e
- Overdue: 3px left border, #ef4444
- Due Soon: 3px left border, #f97316

### Add Vaccination Button

- **Style:** Primary button
- **Icon:** Plus icon
- **Label:** "Add Vaccination Record"
- **Action:** Open vaccination form modal

### Database Requirements
```sql
-- Existing table
vaccinations (
  id,
  pet_id,
  vaccine_name,
  category, -- core, non-core
  date_given,
  next_due_date,
  dose_number,
  administering_vet,
  notes
)

-- Enhancements needed
ALTER TABLE vaccinations ADD COLUMN manufacturer VARCHAR(200);
ALTER TABLE vaccinations ADD COLUMN lot_number VARCHAR(100);
ALTER TABLE vaccinations ADD COLUMN clinic VARCHAR(200);
ALTER TABLE vaccinations ADD COLUMN route VARCHAR(50); -- subcutaneous, intramuscular, etc.
ALTER TABLE vaccinations ADD COLUMN certificate_number VARCHAR(100);
```

Continue with remaining widgets in next sections...
