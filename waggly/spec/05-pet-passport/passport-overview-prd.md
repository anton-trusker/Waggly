# Digital Pet Passport - Product Requirements Document

## Vision

Transform scattered pet health records into a comprehensive, portable digital passport that travels with pets everywhere.

---

## User Stories

```gherkin
Feature: Digital Pet Passport

Scenario: View complete health profile
  As a pet owner
  I want to see all my pet's information in one place
  So that I have a complete picture of their health

Scenario: Share with new vet
  As a pet owner
  I want to share my pet's complete history with a new vet
  So that they can provide informed care

Scenario: Travel compliance check
  As a pet owner
  I want to verify my pet meets travel requirements
  So that I can plan international trips

Scenario: Emergency access
  As a finder of a lost pet
  I want to quickly access critical health information
  So that I can help the pet safely

Scenario: Export passport PDF
  As a pet owner
  I want to export my pet's passport as a PDF
  So that I have a printable record
```

---

## Passport Structure

### 1. Identity Section

| Field | Source | Required |
|-------|--------|----------|
| Name | Pet profile | Yes |
| Species | Pet profile | Yes |
| Breed | Pet profile | Yes |
| Date of Birth | Pet profile | Yes |
| Gender | Pet profile | Yes |
| Color/Markings | Pet profile | No |
| Microchip Number | Identification | Recommended |
| Microchip Date | Identification | No |
| Tattoo ID | Identification | No |
| Registration Number | Registration | No |
| EU Passport Number | Travel docs | For travel |

### 2. Physical Section

| Field | Source | Updated |
|-------|--------|---------|
| Current Weight | Measurements | Latest |
| Ideal Weight Range | Breed data | Auto |
| Height | Measurements | Latest |
| Body Condition Score | Assessments | Latest |
| Coat Type | Pet profile | Manual |
| Eye Color | Pet profile | Manual |
| Distinctive Features | Pet profile | Manual |
| Photos | Pet photos | Multiple |

### 3. Health Summary Section

| Field | Calculation | Display |
|-------|-------------|---------|
| Health Score | Algorithm | 0-100 badge |
| Vaccination Status | Due dates | Up to date/Overdue |
| Active Conditions | Conditions table | List |
| Current Medications | Active treatments | List |
| Known Allergies | Allergies table | Warning list |
| Last Vet Visit | Visits table | Date |
| Next Due | Reminders | Date + type |

### 4. Vaccination Record

| Field | Display |
|-------|---------|
| Vaccine name | With type icon |
| Date given | Formatted |
| Next due | With countdown |
| Administering vet | Name + clinic |
| Lot number | For traceability |
| Certificate link | Downloadable |

### 5. Medical History

| Category | Records |
|----------|---------|
| Vet Visits | All with summaries |
| Surgeries | Detailed records |
| Treatments | Past and current |
| Lab Results | Attached documents |
| Dental Records | Cleaning, extractions |
| Hospitalizations | Stays, treatments |

### 6. Behavior & Temperament

| Field | Input Type |
|-------|------------|
| Temperament tags | Multi-select |
| Good with children | Yes/No/Unknown |
| Good with dogs | Yes/No/Unknown |
| Good with cats | Yes/No/Unknown |
| Training level | Scale |
| Commands known | List |
| Behavioral notes | Text |
| Triggers/fears | Text |

### 7. Lifestyle Information

| Field | Type |
|-------|------|
| Primary diet | Text |
| Diet brand | Text |
| Feeding schedule | Times |
| Exercise needs | Level |
| Daily exercise | Minutes |
| Living environment | Indoor/Outdoor |
| Sleep location | Text |
| Special needs | Text |

### 8. Genetic Information

| Field | Source |
|-------|--------|
| Breed health risks | Breed database |
| DNA test results | Optional upload |
| Genetic markers | From DNA test |
| Pedigree | Optional |
| Lineage | Optional |

### 9. Travel Documents

| Field | Purpose |
|-------|---------|
| EU Passport number | Official ID |
| Passport issue date | Validity |
| Issuing country | Origin |
| Rabies titer test | Some destinations |
| Health certificate | Recent travel |
| Import permits | Country-specific |

### 10. Emergency Information

| Field | Display |
|-------|---------|
| Owner contact | Primary + backup |
| Emergency vet | Clinic + phone |
| Regular vet | Clinic + phone |
| Insurance info | Policy details |
| Critical allergies | RED ALERTS |
| Critical conditions | RED ALERTS |
| Emergency notes | Special instructions |

---

## Health Score Algorithm

### Component Weights

| Component | Weight | Factors |
|-----------|--------|---------|
| Vaccination Status | 25% | Core vaccines up to date |
| Body Condition | 20% | BCS 4-6 ideal |
| Vet Visits | 15% | Regular checkups |
| Dental Health | 10% | Recent dental care |
| Medication Adherence | 10% | Active meds tracked |
| Activity Level | 10% | Age-appropriate |
| Age Factor | 10% | Life stage adjustment |

### Score Calculation

```typescript
function calculateHealthScore(passport: Passport): HealthScore {
  const components = {
    vaccination: calculateVaccinationScore(passport.vaccinations),
    bodyCondition: calculateBCSScore(passport.measurements),
    vetVisits: calculateVetVisitScore(passport.visits),
    dental: calculateDentalScore(passport.dental),
    medication: calculateMedicationScore(passport.treatments),
    activity: calculateActivityScore(passport.activity),
    ageFactor: calculateAgeFactorScore(passport.pet.age)
  };
  
  const weightedScore = 
    components.vaccination * 0.25 +
    components.bodyCondition * 0.20 +
    components.vetVisits * 0.15 +
    components.dental * 0.10 +
    components.medication * 0.10 +
    components.activity * 0.10 +
    components.ageFactor * 0.10;
    
  return {
    score: Math.round(weightedScore),
    components,
    recommendations: generateRecommendations(components),
    trend: calculateTrend(passport.scoreHistory)
  };
}
```

---

## UI Design

### Passport View Layout

```
┌─────────────────────────────────────────┐
│ 🐕 MAX                                  │
│ Golden Retriever • 3y 8m • Male         │
│ ─────────────────────────────────────── │
│          ╭───────────────╮              │
│          │      📷       │              │
│          │   Pet Photo   │              │
│          ╰───────────────╯              │
│                                         │
│   ┌─────────┐  ┌─────────┐             │
│   │   92    │  │   ✓     │             │
│   │ Health  │  │ Vaccines│             │
│   │ Score   │  │ Current │             │
│   └─────────┘  └─────────┘             │
│                                         │
├─────────────────────────────────────────┤
│ 📋 Quick Info                           │
│ Microchip: 123456789012345              │
│ Weight: 28.5 kg (healthy)               │
│ Last Vet: 2 months ago                  │
│ Next Due: Rabies in 45 days             │
├─────────────────────────────────────────┤
│ [Identity] [Health] [Medical] [More ▼]  │
└─────────────────────────────────────────┘
```

### Section Navigation

- Horizontal tabs for main sections
- Vertical scroll within sections
- Floating "Share" and "Export" buttons
- Pull-to-refresh for updates

---

## Export Options

### PDF Export
- Professional formatted document
- All sections or selected
- QR code included

### Data Export (GDPR)
- JSON format
- All data included
- Media files in ZIP
- Download link via email
