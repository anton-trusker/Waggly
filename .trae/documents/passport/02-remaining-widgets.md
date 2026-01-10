# Pet Passport Tab - Remaining Widgets Specification

**Document Version:** 1.0  
**Created:** January 10, 2026  
**Purpose:** Specifications for remaining passport widgets

---

## TREATMENTS & MEDICATIONS WIDGET

### Purpose
Track active and historical medications, dosages, and schedules.

### Visual Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│  TREATMENTS & MEDICATIONS                                         💊     │
│  ────────────────────────────────────────────────────────────────────   │
│                                                                          │
│  Active: 2  │  Historical: 5  │  Total: 7                              │
│                                                                          │
│  [Active] [All] [Search...]                                             │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │Medication │Start Date│Dosage   │Frequency │Status  │Actions   │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │Carprofen  │Jan 1,'25 │50mg     │2x daily  │●Active │[View]    │  │
│  │(Pain Mgmt)│          │         │Morning/  │        │[Edit]    │  │
│  │           │          │         │Evening   │        │          │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │Apoquel    │Dec15,'24 │16mg     │1x daily  │●Active │[View]    │  │
│  │(Allergy)  │          │         │Morning   │        │[Edit]    │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  [+ Add Medication]                                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Summary Cards
- **Active:** Count of `is_active = true`
- **Historical:** Count of completed/discontinued
- **Total:** All medications

### Table Columns
1. **Medication Name** + Category
2. **Start Date** + End Date (if completed)
3. **Dosage** (amount + unit)
4. **Frequency** (times per day + timing)
5. **Status** (● Active or ○ Completed)
6. **Actions** ([View] [Edit] [Discontinue])

### Database (Uses existing `treatments` table)
```sql
-- Existing fields
treatments.treatment_name
treatments.category -- preventive, acute, chronic
treatments.start_date
treatments.end_date
treatments.dosage
treatments.frequency
treatments.time_of_day
treatments.is_active

-- Enhancements
ALTER TABLE treatments ADD COLUMN prescribed_by VARCHAR(200);
ALTER TABLE treatments ADD COLUMN pharmacy VARCHAR(200);
ALTER TABLE treatments ADD COLUMN refills_remaining INTEGER;
ALTER TABLE treatments ADD COLUMN side_effects TEXT[];
```

---

## MEDICAL HISTORY TIMELINE WIDGET

### Purpose
Chronological view of all medical events.

### Visual Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│  MEDICAL HISTORY TIMELINE                                         📋     │
│  ────────────────────────────────────────────────────────────────────   │
│                                                                          │
│  [All Events] [Visits] [Surgeries] [Incidents] [Last 12 months ▼]      │
│                                                                          │
│  ●─── December 2025 ───────────────────────────────────────────────    │
│  │                                                                       │
│  │  Dec 15, 2025  │  Annual Checkup                                    │
│  │  ✓ Complete    │  Dr. Smith • Happy Tails Vet Clinic                │
│  │                │  Weight: 28kg, All vitals normal                   │
│  │                │  [View Details]                                    │
│  │                                                                       │
│  ●─── September 2025 ──────────────────────────────────────────────    │
│  │                                                                       │
│  │  Sep 10, 2025  │  Ear Infection Treatment                           │
│  │  ✓ Resolved    │  Dr. Jones • Emergency Vet Center                  │
│  │                │  Prescribed: Otomax ear drops                       │
│  │                │  [View Details]                                    │
│  │                                                                       │
│  ●─── March 2025 ──────────────────────────────────────────────────   │
│  │                                                                       │
│  │  Mar 20, 2025  │  Rabies Vaccination                                │
│  │  ✓ Complete    │  Dr. Smith                                         │
│  │                │  Next due: Mar 2026                                │
│  │                │  [View Details]                                    │
│  │                                                                       │
│  ●──────────────────────────────────────────────────────────────────   │
│                                                                          │
│  [Load More]                                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

### Event Types
- Veterinary visits
- Vaccinations
- Surgeries/procedures
- Medical incidents
- Hospitalizations
- Lab tests

### Timeline Features
- **Chronological Order:** Most recent first
- **Grouping:** By month/year
- **Status Indicators:** ✓ Complete, ⚠ Ongoing, ● Scheduled
- **Details:** Expandable/collapsible
- **Filtering:** By event type, date range
- **Pagination:** Load more (10-20 events at a time)

### Database (Uses existing `medical_history` table + needs expansion)
```sql
-- Create comprehensive medical_visits table
CREATE TABLE medical_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  visit_type VARCHAR(50), -- checkup, emergency, surgery, follow-up
  veterinarian VARCHAR(200),
  clinic VARCHAR(200),
  reason TEXT,
  diagnosis TEXT,
  treatment_provided TEXT,
  cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create surgeries table
CREATE TABLE surgeries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  surgery_date DATE NOT NULL,
  surgery_name VARCHAR(200) NOT NULL,
  surgeon VARCHAR(200),
  clinic VARCHAR(200),
  reason TEXT,
  outcome TEXT,
  recovery_period_days INTEGER,
  cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## IMPORTANT NOTES & ALLERGIES WIDGET

### Purpose
Critical information about allergies, behavioral notes, and special care.

### Visual Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│  IMPORTANT NOTES & ALLERGIES                                      ⚠️     │
│  ────────────────────────────────────────────────────────────────────   │
│                                                                          │
│  🔴 ALLERGIES (3)                                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                          │
│  🔴 SEVERE - Food: Chicken                                              │
│     Reaction: Severe itching, hives                                     │
│     Avoid: All chicken products, chicken meal                           │
│                                                                          │
│  🟡 MODERATE - Environment: Pollen                                      │
│     Reaction: Sneezing, watery eyes                                     │
│     Management: Anti-histamine during spring                            │
│                                                                          │
│  🟢 MILD - Medication: Penicillin                                       │
│     Reaction: Mild stomach upset                                        │
│     Note: Use alternative antibiotics                                   │
│                                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                          │
│  📋 BEHAVIORAL NOTES                                                    │
│  • Anxious around loud noises (fireworks, thunder)                      │
│  • Friendly with other dogs but prefers slow introductions              │
│  • Food motivated, excellent for training                               │
│                                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                          │
│  🏥 SPECIAL CARE REQUIREMENTS                                           │
│  • Needs glucosamine supplement daily for joint health                  │
│  • Sensitive stomach - feed small meals 3x daily                        │
│  • Regular grooming every 6 weeks                                       │
│                                                                          │
│  [+ Add Allergy] [+ Add Note]                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Allergies Section

**Severity Levels & Colors**
- 🔴 **SEVERE:** Red background (#fef2f2)
- 🟡 **MODERATE:** Orange background (#fef3c7)
- 🟢 **MILD:** Green background (#f0fdf4)

**Allergy Card** Format
- **Severity + Type:** e.g., "SEVERE - Food: Chicken"
- **Reaction:** Description of allergic reaction
- **Management:** Avoidance strategies or treatment

### Behavioral Notes
- Bullet list format
- Free-text entries
- Categories: Temperament, Social behavior, Training notes

### Special Care
- Medical requirements
- Dietary restrictions
- Grooming needs
- Exercise limitations

### Database (Uses existing `allergies`, `behavior_tags`, `care_notes`)
```sql
-- Existing allergies table (already good)
allergies (
  id, pet_id, type, allergen, reaction_description, severity, notes
)

-- Existing behavior_tags (already good)
behavior_tags (
  id, pet_id, tag, notes
)

-- Existing care_notes (already good)
care_notes (
  id, pet_id, walk_routine, grooming_frequency, handling_tips
)
```

---

## EMERGENCY INFORMATION WIDGET

### Purpose
Quick access to emergency contacts and critical medical information.

### Visual Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│  EMERGENCY INFORMATION                                            🚨     │
│  ────────────────────────────────────────────────────────────────────   │
│                                                                          │
│  📞 OWNER CONTACT                                                       │
│  Name:  Anton Khrabrov                                                  │
│  Phone: +1 (555) 123-4567                                              │
│  Email: owner@example.com                                              │
│                                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                          │
│  🏥 PRIMARY VETERINARIAN                                                │
│  Dr. Sarah Smith                                                        │
│  Happy Tails Veterinary Clinic                                          │
│  Phone: +1 (555) 234-5678                                              │
│  Address: 123 Main St, City, ST 12345                                  │
│  Hours: Mon-Fri 8AM-6PM, Sat 9AM-2PM                                   │
│                                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                          │
│  🆘 EMERGENCY VET                                                       │
│  24/7 Emergency Animal Hospital                                         │
│  Phone: +1 (555) 999-9999                                              │
│  Address: 456 Emergency Rd, City, ST 12345                             │
│  Open: 24/7                                                             │
│                                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                          │
│  👤 EMERGENCY CONTACT (Alternate)                                       │
│  Name:  Jane Doe                                                        │
│  Relationship: Friend                                                   │
│  Phone: +1 (555) 345-6789                                              │
│                                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                          │
│  ⚠️  CRITICAL MEDICAL ALERTS                                            │
│  • Severe chicken allergy - avoid all poultry products                  │
│  • On daily heart medication (Carprofen 50mg, 2x daily)                │
│  • Sensitive to anesthesia - requires careful monitoring                │
│                                                                          │
│  [Edit Emergency Info]                                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Sections

**Owner Contact**
- From user profile
- Name, phone, email
- Link to user settings

**Primary Veterinarian**
- From `veterinarians` table where `is_primary = true`
- Name, clinic name, phone, address, hours

**Emergency Vet**
- Secondary veterinarian or dedicated emergency clinic
- 24/7 contact information

**Emergency Contact**
- Alternate person to contact
- Name, relationship, phone

**Critical Medical Alerts**
- Auto-generated from:
  - Severe allergies
  - Active chronic medications
  - Special conditions
  - Anesthesia sensitivity

### Database
```sql
-- Uses existing veterinarians table
veterinarians (
  is_primary -- for primary vet
)

-- Create emergency contacts table
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  contact_type VARCHAR(50), -- owner, alternate, veterinarian
  name VARCHAR(200) NOT NULL,
  relationship VARCHAR(100),
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(200),
  address TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## TRAVEL READINESS WIDGET

### Purpose
International travel compliance and documentation checklist.

### Visual Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│  TRAVEL READINESS                                                 ✈️     │
│  ────────────────────────────────────────────────────────────────────   │
│                                                                          │
│  Travel Status: 🟡 PARTIALLY READY                                      │
│  Compliance: 70% (7/10 requirements met)                                │
│                                                                          │
│  [Select Destination: None ▼]                                           │
│                                                                          │
│  ━━━━━━━━━━━━ GENERAL TRAVEL REQUIREMENTS ━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                          │
│  ✅ Microchip (ISO compliant)                                           │
│      Number: 982000123456789                                            │
│                                                                          │
│  ✅ Rabies Vaccination (Current)                                        │
│      Date: Mar 15, 2023                                                 │
│      Next Due: Mar 15, 2026                                             │
│                                                                          │
│  ✅ Health Certificate (Within 10 days of travel)                       │
│      Issued: Not yet - [Get Certificate]                               │
│                                                                          │
│  ⚠️  Import Permit (Required for some countries)                        │
│      Status: Not obtained - [Learn More]                               │
│                                                                          │
│  ⚠️  Parasite Treatment (Required within 24-120 hours)                  │
│      Last Treatment: 6 months ago - [Schedule]                          │
│                                                                          │
│  ━━━━━━━━━━━━ DESTINATION SPECIFIC (Select destination) ━━━━━━━━━━━   │
│                                                                          │
│  Select a destination country to see specific requirements               │
│                                                                          │
│  [Download Travel Checklist PDF]                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Travel Status Levels
- 🟢 **READY:** All requirements met (100%)
- 🟡 **PARTIALLY READY:** Some requirements met (50-99%)
- 🔴 **NOT READY:** Major requirements missing (<50%)

### General Requirements
- Microchip (ISO 11784/11785 compliant)
- Current rabies vaccination
- Health certificate (timing varies by destination)
- Parasite treatment documentation
- Import permit (country-dependent)

### Destination-Specific
When destination selected, show:
- Country-specific vaccine requirements
- Quarantine rules
- Breed restrictions
- Entry documentation
- Timeline (when to get each document)

### Database
```sql
-- Create travel_plans table
CREATE TABLE travel_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  destination_country VARCHAR(100) NOT NULL,
  travel_date DATE,
  return_date DATE,
  compliance_percentage INTEGER,
  status VARCHAR(20), -- ready, partially_ready, not_ready
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create travel_requirements table
CREATE TABLE travel_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  travel_plan_id UUID REFERENCES travel_plans(id) ON DELETE CASCADE,
  requirement_type VARCHAR(100),
  requirement_name VARCHAR(200),
  is_completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## WIDGET STYLING SYSTEM

### Container Styling (All Widgets)
```css
.passport-widget {
  background: var(--color-surface);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  margin-bottom: 20px;
}
```

### Section Title
```css
.widget-title {
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 8px;
  margin-bottom: 16px;
}
```

### Data Labels
```css
.data-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
}
```

### Data Values
```css
.data-value {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-primary);
  margin-left: 8px;
}
```

### Status Indicators
```css
.status-current {
  color: #22c55e; /* green */
}
.status-overdue {
  color: #ef4444; /* red */
}
.status-due-soon {
  color: #f97316; /* orange */
}
```

### Responsive Breakpoints
- Desktop: >1024px (3-column layouts)
- Tablet: 640-1024px (2-column layouts)
- Mobile: <640px (1-column, stacked)
