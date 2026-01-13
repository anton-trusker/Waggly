# Vaccinations - Product Requirements Document

## Overview

Vaccination tracking is critical for pet health compliance and travel requirements. This PRD defines the complete vaccination management system.

---

## User Stories

```gherkin
Feature: Vaccination Tracking

Scenario: Record vaccination
  As a pet owner
  I want to record my pet's vaccination with date and next due date
  So that I have complete immunization records

Scenario: Receive reminders
  As a pet owner
  I want to be reminded when vaccinations are due
  So that I never miss a booster

Scenario: View vaccination certificate
  As a pet owner
  I want to generate a vaccination certificate
  So that I can use it for travel or boarding

Scenario: Track multi-dose vaccines
  As a pet owner
  I want to track puppy vaccination series
  So that I know which doses are complete

Scenario: Document reactions
  As a pet owner
  I want to record any vaccine reactions
  So that my vet knows my pet's history
```

---

## Vaccine Database

### Core Vaccines - Dogs

| Vaccine | Abbreviation | Type | Initial | Booster |
|---------|--------------|------|---------|---------|
| Rabies | RAB | Core | 12-16 weeks | 1 year, then 3 years |
| Distemper | CDV | Core | 6-8 weeks (series) | 1-3 years |
| Parvovirus | CPV | Core | 6-8 weeks (series) | 1-3 years |
| Adenovirus (Hepatitis) | CAV-2 | Core | 6-8 weeks (series) | 1-3 years |
| Leptospirosis | LEPTO | Risk-based | 12 weeks | Annual |
| Bordetella (Kennel Cough) | KC | Risk-based | 8 weeks | 6-12 months |
| Lyme Disease | LYME | Risk-based | 12 weeks | Annual |
| Canine Influenza | CIV | Risk-based | 6-8 weeks | Annual |

### Core Vaccines - Cats

| Vaccine | Abbreviation | Type | Initial | Booster |
|---------|--------------|------|---------|---------|
| Rabies | RAB | Core | 12-16 weeks | 1-3 years |
| Feline Panleukopenia | FPV | Core | 6-8 weeks (series) | 3 years |
| Feline Herpesvirus | FHV-1 | Core | 6-8 weeks (series) | 3 years |
| Feline Calicivirus | FCV | Core | 6-8 weeks (series) | 3 years |
| Feline Leukemia | FeLV | Risk-based | 8-9 weeks | 1 year |
| Chlamydophila | CHL | Risk-based | 9 weeks | Annual |

---

## Form Fields

### Required Fields

| Field | Type | Options |
|-------|------|---------|
| Pet | Select | User's pets |
| Vaccine | Autocomplete | From database |
| Date Given | Date | Past or today |
| Veterinarian/Clinic | Autocomplete | Google Places |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| Batch/Lot Number | Text | For traceability |
| Manufacturer | Select | Vaccine brands |
| Next Due Date | Date | Auto-calculated if not set |
| Site of Injection | Select | Location on body |
| Vaccine Certificate | File | Upload certificate |
| Notes | Text | Additional notes |
| Reaction | Yes/No | If reaction occurred |
| Reaction Details | Text | Description of reaction |

---

## Auto-Calculate Due Dates

```typescript
function calculateNextDueDate(
  vaccine: Vaccine,
  petAge: number, // in months
  doseNumber: number
): Date {
  // Get vaccine schedule
  const schedule = getVaccineSchedule(vaccine.id);
  
  // Puppy/kitten series
  if (petAge < 16 && doseNumber < schedule.initialDoses) {
    return addWeeks(new Date(), 3-4); // 3-4 weeks between puppy doses
  }
  
  // Adult booster
  return addMonths(new Date(), schedule.boosterIntervalMonths);
}
```

---

## Vaccination Status

| Status | Condition | Badge Color |
|--------|-----------|-------------|
| Up to Date | All core vaccines current | Green |
| Due Soon | Vaccine due within 30 days | Yellow |
| Overdue | Past due date | Red |
| Never Vaccinated | No records | Gray |
| Exempt | Medical exemption documented | Blue |

---

## UI Components

### Vaccination Card

```
┌─────────────────────────────────────────┐
│ 💉 Rabies (RAB)                    ✓    │
│ Given: Jan 15, 2024                     │
│ Clinic: AniCura Amsterdam               │
│ Next Due: Jan 15, 2027 (3 years)        │
│ Lot #: ABC123456                        │
│                                         │
│ [View Certificate] [Edit]               │
└─────────────────────────────────────────┘
```

### Add Vaccination Modal

```
┌─────────────────────────────────────────┐
│ ← Add Vaccination                  [X]  │
├─────────────────────────────────────────┤
│ Pet: [Max ▼]                            │
├─────────────────────────────────────────┤
│ Vaccine *                               │
│ [Search vaccines...]                    │
│ ┌─ Popular ───────────────────────────┐ │
│ │ 💉 Rabies (RAB)                     │ │
│ │ 💉 DHPP (Distemper combo)           │ │
│ │ 💉 Bordetella (Kennel Cough)        │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Date Given *                            │
│ [Jan 15, 2024]                 [📅]     │
├─────────────────────────────────────────┤
│ Clinic/Vet *                            │
│ [Search clinics...]            [📍]     │
├─────────────────────────────────────────┤
│ Next Due Date                           │
│ [Jan 15, 2027] (auto-calculated)        │
├─────────────────────────────────────────┤
│ ┌─ Additional Details ────────────────┐ │
│ │ Lot Number: [ABC123456]             │ │
│ │ Manufacturer: [Nobivac ▼]           │ │
│ │ [+ Upload Certificate]              │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Did your pet have any reaction? [No ▼]  │
├─────────────────────────────────────────┤
│        [Cancel]  [Save Vaccination]     │
└─────────────────────────────────────────┘
```

---

## Reminders

### Reminder Schedule

| Timing | Channel | Message |
|--------|---------|---------|
| 2 weeks before | Push + Email | "[Pet] is due for [Vaccine] in 2 weeks" |
| 1 week before | Push | "Reminder: [Pet]'s [Vaccine] is due next week" |
| 1 day before | Push | "[Pet]'s [Vaccine] is due tomorrow" |
| Day of | Push | "[Pet]'s [Vaccine] is due today!" |
| 1 day overdue | Push + Email | "[Pet]'s [Vaccine] is overdue" |
| 1 week overdue | Email | "Important: [Pet]'s [Vaccine] is 1 week overdue" |

---

## API Specification

### Create Vaccination
```
POST /api/v1/pets/:petId/vaccinations
{
  "vaccine_id": "uuid",
  "vaccine_name": "Rabies",
  "date_given": "2024-01-15",
  "next_due_date": "2027-01-15",
  "clinic_name": "AniCura Amsterdam",
  "clinic_place_id": "ChIJ...",
  "veterinarian": "Dr. van den Berg",
  "batch_number": "ABC123456",
  "manufacturer": "Nobivac",
  "had_reaction": false
}
```

### Get Vaccination History
```
GET /api/v1/pets/:petId/vaccinations
```

### Get Upcoming Vaccinations
```
GET /api/v1/pets/:petId/vaccinations/upcoming
```
