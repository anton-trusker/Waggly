# Physical Measurements Specification

## Overview

This document specifies all physical measurement tracking features including weight, dimensions, and body condition scoring.

---

## Weight Tracking

### Data Fields

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| `weight_value` | Decimal | 0.01 - 500 | Yes |
| `weight_unit` | Enum | kg, lbs | Yes |
| `measured_date` | DateTime | Past dates only | Yes |
| `measured_by` | String | Who measured | No |
| `measurement_method` | Enum | scale, vet, estimate | No |
| `notes` | Text | Additional notes | No |

### Unit Conversion

```typescript
const conversions = {
  kgToLbs: (kg: number) => kg * 2.20462,
  lbsToKg: (lbs: number) => lbs / 2.20462,
};
```

### Weight Chart Display

```typescript
interface WeightChartData {
  data: Array<{
    date: Date;
    weight: number; // Always stored in kg
    source: 'manual' | 'vet' | 'device';
  }>;
  trend: 'increasing' | 'stable' | 'decreasing';
  idealRange: {
    min: number;
    max: number;
  };
  currentPercentile: number;
}
```

### Ideal Weight Ranges (By Breed)

| Breed | Min (kg) | Max (kg) | Notes |
|-------|----------|----------|-------|
| Chihuahua | 1.5 | 3 | Adult |
| French Bulldog | 8 | 14 | Adult |
| Labrador Retriever | 25 | 36 | Adult male |
| German Shepherd | 30 | 40 | Adult male |
| Great Dane | 50 | 90 | Adult male |

---

## Body Condition Score (BCS)

### 9-Point Scale (WSAVA Standard)

| Score | Category | Description |
|-------|----------|-------------|
| 1 | Emaciated | Ribs, spine, bones visible from distance |
| 2 | Very Thin | Ribs, spine easily visible |
| 3 | Thin | Ribs visible, minimal fat |
| 4 | Underweight | Ribs easily palpable, waist visible |
| 5 | Ideal | Ribs palpable, waist visible from above |
| 6 | Overweight | Ribs palpable with slight fat cover |
| 7 | Heavy | Ribs difficult to feel, fat deposits |
| 8 | Obese | Ribs buried in fat, no waist |
| 9 | Severely Obese | Massive fat deposits |

### Visual Guide Integration

```typescript
interface BCSGuide {
  score: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  category: string;
  description: string;
  ribCheckDescription: string;
  waistCheckDescription: string;
  sideViewImage: string;
  topViewImage: string;
}
```

---

## Body Measurements

### Measurement Fields

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `height_shoulder` | Decimal | cm | Height at withers |
| `length_body` | Decimal | cm | Nose to tail base |
| `chest_girth` | Decimal | cm | Around chest behind forelegs |
| `neck_girth` | Decimal | cm | Around neck |
| `head_circumference` | Decimal | cm | Around head |

### Use Cases
- Harness/collar sizing
- Tracking puppy growth
- Breed standard comparison
- Health assessment

---

## Growth Charts

### Puppy Growth Tracking

```typescript
interface GrowthChart {
  breed_id: string;
  sex: 'male' | 'female';
  curves: {
    percentile_5: WeeklyWeight[];
    percentile_25: WeeklyWeight[];
    percentile_50: WeeklyWeight[];
    percentile_75: WeeklyWeight[];
    percentile_95: WeeklyWeight[];
  };
  expected_adult_weight: {
    min: number;
    max: number;
  };
}

interface WeeklyWeight {
  week: number; // Age in weeks
  weight_kg: number;
}
```

### Growth Milestones

| Age | Milestone | Expected |
|-----|-----------|----------|
| 8 weeks | Weaning weight | 10-15% of adult |
| 4 months | Rapid growth phase | 40-50% of adult |
| 6 months | Slowing growth | 60-75% of adult |
| 12 months | Near adult (large) | 90% of adult |
| 18 months | Full grown (giant) | 100% of adult |

---

## Database Schema

```sql
CREATE TABLE physical_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  measured_date TIMESTAMP WITH TIME ZONE NOT NULL,
  measured_by VARCHAR(200),
  
  -- Weight
  weight_kg DECIMAL(6,2),
  weight_lbs DECIMAL(6,2) GENERATED ALWAYS AS (weight_kg * 2.20462) STORED,
  measurement_method VARCHAR(50), -- 'scale', 'vet', 'estimate'
  
  -- Body Condition
  body_condition_score INTEGER CHECK (body_condition_score BETWEEN 1 AND 9),
  bcs_assessed_by VARCHAR(200),
  
  -- Body Measurements
  height_shoulder_cm DECIMAL(5,2),
  length_body_cm DECIMAL(6,2),
  chest_girth_cm DECIMAL(5,2),
  neck_girth_cm DECIMAL(5,2),
  
  -- Context
  is_pregnant BOOLEAN DEFAULT false,
  is_post_surgery BOOLEAN DEFAULT false,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT valid_weight CHECK (weight_kg > 0 AND weight_kg <= 200)
);

CREATE INDEX idx_measurements_pet_id ON physical_measurements(pet_id);
CREATE INDEX idx_measurements_date ON physical_measurements(measured_date);
```

---

## API Endpoints

### Log Weight
```
POST /api/v1/pets/:petId/measurements/weight
{
  "weight": 28.5,
  "unit": "kg",
  "measured_date": "2024-01-15T10:30:00Z",
  "method": "scale",
  "notes": "After morning walk"
}
```

### Get Weight History
```
GET /api/v1/pets/:petId/measurements/weight
?from=2023-01-01
&to=2024-01-15
&limit=100

Response:
{
  "measurements": [...],
  "stats": {
    "current": 28.5,
    "min": 26.0,
    "max": 30.2,
    "average": 28.1,
    "trend": "stable"
  }
}
```

### Log BCS
```
POST /api/v1/pets/:petId/measurements/bcs
{
  "score": 5,
  "assessed_date": "2024-01-15",
  "assessed_by": "Dr. van den Berg"
}
```
