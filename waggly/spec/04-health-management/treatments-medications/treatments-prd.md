# Treatments & Medications - Product Requirements Document

## Overview

This PRD defines tracking for all treatments, medications, therapies, and medical interventions for pets.

---

## User Stories

```gherkin
Feature: Treatment & Medication Tracking

Scenario: Add medication
  As a pet owner
  I want to add my pet's new prescription
  So that I can track their medication schedule

Scenario: Set medication reminders
  As a pet owner
  I want reminders when it's time to give medication
  So that I don't miss doses

Scenario: Track treatment course
  As a pet owner
  I want to see progress through a treatment
  So that I know when it's complete

Scenario: Document side effects
  As a pet owner
  I want to record any side effects
  So that my vet knows what happened

Scenario: End medication
  As a pet owner
  I want to mark a medication as completed
  So that my records stay current
```

---

## Treatment Types

| Type | Icon | Description |
|------|------|-------------|
| Medication | 💊 | Oral, topical, injectable meds |
| Parasite Prevention | 🦟 | Flea, tick, heartworm |
| Supplement | 🌿 | Vitamins, joint supplements |
| Therapy | 🏥 | Physical therapy, laser |
| Procedure | 🔧 | Non-surgical medical procedure |
| Surgery | 🔪 | Surgical intervention |
| Alternative | 🧘 | Acupuncture, chiropractic |

---

## Form Fields

### Required Fields

| Field | Type | Validation |
|-------|------|------------|
| Pet | Select | User's pets |
| Treatment Name | Autocomplete | From drug database |
| Type | Select | Treatment type |
| Start Date | Date | Required |

### Medication-Specific Fields

| Field | Type | Options |
|-------|------|---------|
| Dosage Amount | Number | 0.01 - 10000 |
| Dosage Unit | Select | mg, ml, tablets, drops, etc |
| Frequency | Select | Once daily, Twice daily, etc |
| Administration Route | Select | Oral, Topical, Injection, etc |
| Duration | Select | Ongoing, X days/weeks/months |
| End Date | Date | Auto-calculated or manual |
| Time(s) | Time picker | When to give |
| With Food | Checkbox | Take with food |
| Prescribing Vet | Text | Vet name |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| Reason/Diagnosis | Text | Why prescribed |
| Instructions | Text | Special instructions |
| Prescription File | File | Upload prescription |
| Cost | Currency | Price paid |
| Notes | Text | Additional notes |

---

## Frequency Options

| Option | Description | Reminder Times |
|--------|-------------|----------------|
| Once daily | 1x per day | User-set time |
| Twice daily | Every 12 hours | 2 times |
| Three times daily | Every 8 hours | 3 times |
| Every other day | Every 48 hours | Alternating days |
| Weekly | Once per week | Day of week |
| Monthly | Once per month | Day of month |
| As needed | PRN | No reminders |
| Custom | User-defined | Custom schedule |

---

## Medication Database

### Common Pet Medications

```sql
CREATE TABLE medications (
  id UUID PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  brand_names TEXT[],
  drug_class VARCHAR(100),
  species TEXT[] CHECK (species <@ ARRAY['dog', 'cat', 'rabbit', 'bird', 'other']),
  forms TEXT[], -- 'tablet', 'liquid', 'injectable', 'topical', 'chewable'
  common_dosages JSONB,
  side_effects TEXT[],
  contraindications TEXT[],
  interactions TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Sample Medications

| Name | Class | Species | Forms |
|------|-------|---------|-------|
| Apoquel (Oclacitinib) | Antipruritic | Dog | Tablet |
| Rimadyl (Carprofen) | NSAID | Dog | Tablet, Chewable |
| Clavamox (Amoxicillin-Clavulanate) | Antibiotic | Dog, Cat | Tablet, Liquid |
| MetroNidazole | Antibiotic | Dog, Cat | Tablet, Liquid |
| Prednisone | Corticosteroid | Dog, Cat | Tablet |
| Gabapentin | Anticonvulsant/Pain | Dog, Cat | Capsule |
| Simparica Trio | Parasite Prevention | Dog | Chewable |
| NexGard | Flea/Tick | Dog | Chewable |
| Revolution Plus | Parasite Prevention | Cat | Topical |

---

## Treatment Status

| Status | Description | Visual |
|--------|-------------|--------|
| Active | Currently taking | Green pill icon |
| Scheduled | Future start | Blue clock icon |
| Completed | Course finished | Gray checkmark |
| Discontinued | Stopped early | Red X icon |
| Paused | Temporarily stopped | Yellow pause icon |

---

## Medication Reminders

### Reminder Settings

```typescript
interface MedicationReminder {
  medication_id: string;
  times: string[]; // ["08:00", "20:00"]
  smart_snooze: boolean; // Learn from user patterns
  sound: string; // Notification sound
  repeat_if_missed: boolean;
  caregiver_notify: boolean; // Alert co-owners
}
```

### Reminder Flow

1. Notification appears at scheduled time
2. User actions:
   - ✓ Given - Logs dose
   - ⏰ Snooze - Remind in 15/30/60 min
   - ❌ Skip - Logs skipped dose with reason
3. If no response in 30 min, repeat notification
4. If 3+ missed doses, escalate to email

---

## UI Components

### Active Medications List

```
┌─────────────────────────────────────────┐
│ 💊 Active Medications (3)               │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 💊 Apoquel                          │ │
│ │ 16mg • Once daily • Morning        │ │
│ │ Started: Jan 10 • Ongoing          │ │
│ │ Next: Today 8:00 AM        [Given] │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 💊 Simparica Trio                   │ │
│ │ 1 tablet • Monthly                  │ │
│ │ Next: Feb 1 (17 days)              │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 💊 Gabapentin                       │ │
│ │ 100mg • Twice daily                 │ │
│ │ Day 5 of 14 ████████░░░░░░         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Add Medication Modal

```
┌─────────────────────────────────────────┐
│ ← Add Medication                   [X]  │
├─────────────────────────────────────────┤
│ Pet: [Max ▼]                            │
├─────────────────────────────────────────┤
│ Medication *                            │
│ [Search medications...]                 │
│ Or [+ Add Custom Medication]            │
├─────────────────────────────────────────┤
│ Dosage                                  │
│ [16] [mg ▼]            per dose         │
├─────────────────────────────────────────┤
│ Frequency                               │
│ [Once daily ▼]                          │
│ ┌─ When to give ─────────────────────┐ │
│ │ Morning: [8:00 AM]                 │ │
│ │ [+ Add another time]               │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Duration                                │
│ ○ Ongoing (no end date)                 │
│ ● For [14] [days ▼]                     │
│   End date: Jan 24, 2024                │
├─────────────────────────────────────────┤
│ ☑ Set reminders for this medication     │
│ ☑ Give with food                        │
├─────────────────────────────────────────┤
│ Reason/Diagnosis (optional)             │
│ [Skin allergies / itching]              │
├─────────────────────────────────────────┤
│        [Cancel]  [Save Medication]      │
└─────────────────────────────────────────┘
```

---

## API Specification

### Create Treatment
```
POST /api/v1/pets/:petId/treatments
{
  "name": "Apoquel",
  "medication_id": "uuid",
  "type": "medication",
  "dosage_amount": 16,
  "dosage_unit": "mg",
  "frequency": "once_daily",
  "times": ["08:00"],
  "route": "oral",
  "start_date": "2024-01-10",
  "duration_type": "ongoing",
  "with_food": true,
  "reason": "Skin allergies",
  "reminders_enabled": true,
  "prescribing_vet": "Dr. van den Berg"
}
```

### Log Dose
```
POST /api/v1/treatments/:treatmentId/doses
{
  "given_at": "2024-01-15T08:15:00Z",
  "status": "given", // 'given', 'skipped', 'late'
  "notes": "Given with breakfast"
}
```
