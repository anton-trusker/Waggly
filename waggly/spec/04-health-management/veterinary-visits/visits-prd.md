# Veterinary Visits - Product Requirements Document

## Overview

This PRD defines the veterinary visit tracking feature, enabling pet owners to document all vet consultations.

---

## User Stories

```gherkin
Feature: Veterinary Visit Tracking

Scenario: Log routine checkup
  As a pet owner
  I want to log my pet's annual checkup
  So that I have a record of the visit

Scenario: Log emergency visit
  As a pet owner
  I want to quickly log an emergency vet visit
  So that critical information is captured

Scenario: Attach documents
  As a pet owner
  I want to attach invoices and reports to my visit record
  So that all information is in one place

Scenario: View visit history
  As a pet owner
  I want to see all past vet visits
  So that I can track my pet's care history

Scenario: Share with vet
  As a pet owner
  I want to share visit history with a new vet
  So that they have complete context
```

---

## Visit Types

| Type | Icon | Description | Fields |
|------|------|-------------|--------|
| Routine Checkup | 🏥 | Annual/wellness exam | Standard |
| Vaccination | 💉 | Vaccine administration | + Vaccine details |
| Sick Visit | 🤒 | Illness consultation | + Symptoms, diagnosis |
| Emergency | 🚨 | Urgent care | + Emergency details |
| Surgery | 🔪 | Surgical procedure | + Surgery details |
| Specialist | 👨‍⚕️ | Specialist consultation | + Specialist type |
| Follow-up | 🔄 | Post-treatment check | + Reference to original |
| Dental | 🦷 | Dental procedure | + Dental details |
| Lab Work | 🧪 | Tests/bloodwork | + Test types |

---

## Form Fields

### Required Fields

| Field | Type | Validation |
|-------|------|------------|
| Visit Date | Date | Past or today |
| Visit Type | Select | From type list |
| Clinic/Hospital | Autocomplete | Google Places |
| Veterinarian | Text | Optional name |
| Reason for Visit | Text | 10+ characters |

### Optional Fields

| Field | Type | Notes |
|-------|------|-------|
| Diagnosis | Text | What was found |
| Treatment Given | Text | Procedures/medications |
| Prescriptions | Related records | Link to treatments |
| Follow-up Date | Date | If needed |
| Follow-up Notes | Text | Instructions |
| Cost | Number | With currency |
| Documents | Files | Invoices, reports |
| Notes | Text | Additional notes |

### Conditional Fields

| Condition | Shows Fields |
|-----------|--------------|
| Type = Emergency | Severity, symptoms |
| Type = Surgery | Surgery type, anesthesia |
| Type = Specialist | Specialty, referral source |
| Type = Lab Work | Test types, results |

---

## UI Specification

### Add Visit Modal

```
┌─────────────────────────────────────────┐
│ ← Add Vet Visit                    [X]  │
├─────────────────────────────────────────┤
│ Pet: [Max ▼]                            │
├─────────────────────────────────────────┤
│ Visit Date: [Jan 15, 2024]              │
│ Visit Type: [Routine Checkup ▼]         │
├─────────────────────────────────────────┤
│ Clinic *                                │
│ [Search vet clinics...]      [📍]       │
│ └ AniCura Amsterdam                     │
│   Koninginneweg 12, Amsterdam           │
├─────────────────────────────────────────┤
│ Veterinarian (optional)                 │
│ [Dr. van den Berg]                      │
├─────────────────────────────────────────┤
│ Reason for Visit *                      │
│ [Annual wellness checkup and vaccines   │
│  Blood work and health screening...]    │
├─────────────────────────────────────────┤
│ ┌─ Diagnosis ─────────────────────────┐ │
│ │ [All clear, healthy weight...]      │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ ┌─ Documents ─────────────────────────┐ │
│ │ [+ Add Invoice] [+ Add Report]      │ │
│ │ 📄 Invoice_Jan2024.pdf     [X]      │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Total Cost (optional)                   │
│ [€] [125.00]                            │
├─────────────────────────────────────────┤
│        [Cancel]  [Save Visit]           │
└─────────────────────────────────────────┘
```

### Visit Detail View

- Header with type icon and date
- Clinic information with map link
- Diagnosis and treatment summary
- Linked prescriptions
- Attached documents (downloadable)
- Edit and delete actions

---

## API Specification

### Create Visit
```
POST /api/v1/pets/:petId/visits
Content-Type: application/json

{
  "visit_date": "2024-01-15T10:00:00Z",
  "visit_type": "routine_checkup",
  "clinic": {
    "place_id": "ChIJ...",
    "name": "AniCura Amsterdam",
    "address": "Koninginneweg 12"
  },
  "veterinarian": "Dr. van den Berg",
  "reason": "Annual wellness checkup",
  "diagnosis": "Healthy, no concerns",
  "treatment": "Vaccinations administered",
  "cost": 125.00,
  "cost_currency": "EUR",
  "follow_up_date": "2025-01-15",
  "notes": "Schedule dental cleaning next visit"
}

Response: 201 Created
{
  "id": "visit-uuid",
  "pet_id": "pet-uuid",
  ...
}
```

### Get Visits
```
GET /api/v1/pets/:petId/visits
?limit=20
&offset=0
&type=routine_checkup
&from=2023-01-01
&to=2024-01-15

Response:
{
  "visits": [...],
  "total": 8,
  "has_more": false
}
```

---

## Acceptance Criteria

- [ ] All visit types are available
- [ ] Clinic search shows Google Places results
- [ ] Documents can be attached
- [ ] Visit appears in timeline
- [ ] Notifications created for follow-up dates
- [ ] Visit can be edited and deleted
- [ ] Linked to vaccinations when applicable
