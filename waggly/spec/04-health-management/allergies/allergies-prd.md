# Allergies - Product Requirements Document

## Overview

Allergy documentation is critical for pet safety, especially when sharing profile with vets, pet sitters, and caregivers.

---

## User Stories

```gherkin
Feature: Allergy Management

Scenario: Document allergy
  As a pet owner
  I want to record my pet's allergies
  So that caregivers are aware of them

Scenario: Categorize allergies
  As a pet owner
  I want to categorize allergies by type
  So that they're easier to understand

Scenario: Share allergy warnings
  As a pet owner
  I want allergy alerts prominent on shared profiles
  So that they're not missed

Scenario: Document reactions
  As a pet owner
  I want to record allergy reaction details
  So that severity is documented
```

---

## Allergy Types

| Type | Icon | Examples |
|------|------|----------|
| Food | 🍖 | Chicken, beef, wheat, dairy |
| Environmental | 🌿 | Pollen, dust mites, mold |
| Medication | 💊 | Penicillin, NSAIDs |
| Insect | 🐝 | Flea bites, bee stings |
| Contact | 🧴 | Shampoos, fabrics |
| Other | ⚠️ | Unclassified |

---

## Severity Levels

| Level | Description | Visual |
|-------|-------------|--------|
| Mild | Minor symptoms, self-resolving | Yellow badge |
| Moderate | Requires treatment | Orange badge |
| Severe | Life-threatening | Red badge |
| Unknown | Not yet determined | Gray badge |

---

## Form Fields

### Required Fields

| Field | Type | Validation |
|-------|------|------------|
| Pet | Select | User's pets |
| Allergen | Autocomplete + Custom | From database or custom |
| Type | Select | Allergy type |
| Severity | Select | Mild/Moderate/Severe/Unknown |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| First Noticed | Date | When discovered |
| Symptoms | Multi-select | How it manifests |
| Treatment | Text | How it's managed |
| Diagnosed By | Text | Vet who diagnosed |
| Test Results | File | Allergy test documents |
| Notes | Text | Additional information |

---

## Common Allergens

### Food Allergens

```typescript
const foodAllergens = [
  'Chicken', 'Beef', 'Pork', 'Lamb', 'Fish', 'Salmon',
  'Dairy', 'Eggs', 'Wheat', 'Corn', 'Soy', 'Rice',
  'Potato', 'Peas', 'Lentils', 'Artificial preservatives',
  'Food coloring', 'Other (specify)'
];
```

### Environmental Allergens

```typescript
const environmentalAllergens = [
  'Pollen (general)', 'Grass pollen', 'Tree pollen', 'Weed pollen',
  'Dust mites', 'Mold spores', 'Cigarette smoke',
  'Feathers', 'Wool', 'Rubber', 'Plastic',
  'Cleaning products', 'Perfumes', 'Other (specify)'
];
```

### Medication Allergens

```typescript
const medicationAllergens = [
  'Penicillin', 'Amoxicillin', 'Cephalosporins', 'Sulfonamides',
  'NSAIDs (Rimadyl, etc)', 'Aspirin', 'Ivermectin',
  'Anesthesia', 'Contrast dye', 'Vaccines', 'Other (specify)'
];
```

---

## Symptoms Options

```typescript
const allergySymptoms = [
  // Skin
  'Itching', 'Hives', 'Rash', 'Hot spots', 'Hair loss',
  'Ear infections', 'Chronic ear inflammation',
  // Digestive
  'Vomiting', 'Diarrhea', 'Gas', 'Bloating',
  // Respiratory
  'Sneezing', 'Coughing', 'Wheezing', 'Difficulty breathing',
  // Eyes
  'Watery eyes', 'Red eyes', 'Eye discharge',
  // Severe
  'Swelling (face/throat)', 'Anaphylaxis', 'Collapse',
  // Other
  'Behavioral changes', 'Paw licking', 'Other (specify)'
];
```

---

## UI Components

### Allergy List Display

```
┌─────────────────────────────────────────┐
│ ⚠️ Allergies & Sensitivities            │
├─────────────────────────────────────────┤
│ 🍖 Chicken                      SEVERE  │
│    Symptoms: Hives, vomiting            │
│    Avoid all chicken products           │
├─────────────────────────────────────────┤
│ 🌿 Grass pollen               MODERATE  │
│    Symptoms: Itching, paw licking       │
│    Seasonal - spring/summer            │
├─────────────────────────────────────────┤
│ 💊 NSAIDs                       SEVERE  │
│    Do not give Rimadyl or similar       │
│    Use Gabapentin for pain              │
└─────────────────────────────────────────┘
```

### Add Allergy Modal

```
┌─────────────────────────────────────────┐
│ ← Add Allergy                      [X]  │
├─────────────────────────────────────────┤
│ Pet: [Max ▼]                            │
├─────────────────────────────────────────┤
│ Allergen *                              │
│ [Search or type allergen...]            │
│ ┌─ Common Food Allergens ─────────────┐ │
│ │ 🍖 Chicken                          │ │
│ │ 🍖 Beef                             │ │
│ │ 🍖 Wheat                            │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Type *                                  │
│ [Food ▼]                                │
├─────────────────────────────────────────┤
│ Severity *                              │
│ ○ Mild  ○ Moderate  ● Severe  ○ Unknown │
├─────────────────────────────────────────┤
│ Symptoms (select all that apply)        │
│ ☑ Hives    ☑ Vomiting    ☐ Itching     │
│ ☐ Diarrhea  ☐ Swelling   ☐ Other       │
├─────────────────────────────────────────┤
│ First Noticed (optional)                │
│ [December 2023]                         │
├─────────────────────────────────────────┤
│ Notes (optional)                        │
│ [Discovered after eating chicken treats │
│  at dog park. Required vet visit...]    │
├─────────────────────────────────────────┤
│        [Cancel]  [Save Allergy]         │
└─────────────────────────────────────────┘
```

---

## Emergency Alert Display

On shared profiles and QR scans, allergies display prominently:

```
┌─────────────────────────────────────────┐
│ ⚠️ ALLERGY ALERT                        │
│ ─────────────────────────────────────── │
│ 🚨 SEVERE: Chicken (food)               │
│    Causes hives and vomiting            │
│                                         │
│ 🚨 SEVERE: NSAIDs (medication)          │
│    Do not administer                    │
│                                         │
│ ⚠️ MODERATE: Grass pollen               │
└─────────────────────────────────────────┘
```

---

## Database Schema

```sql
CREATE TABLE allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  allergen VARCHAR(200) NOT NULL,
  allergen_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe', 'unknown')),
  symptoms TEXT[],
  first_noticed DATE,
  treatment TEXT,
  diagnosed_by VARCHAR(200),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_allergies_pet ON allergies(pet_id);
```

---

## API Specification

### Create Allergy
```
POST /api/v1/pets/:petId/allergies
{
  "allergen": "Chicken",
  "allergen_type": "food",
  "severity": "severe",
  "symptoms": ["hives", "vomiting"],
  "first_noticed": "2023-12-01",
  "treatment": "Avoid all chicken products, antihistamines if exposed",
  "diagnosed_by": "Dr. van den Berg",
  "notes": "Discovered after eating chicken treats at dog park"
}
```

### Get Allergies
```
GET /api/v1/pets/:petId/allergies
```
