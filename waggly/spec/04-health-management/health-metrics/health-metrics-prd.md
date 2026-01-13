# Health Metrics - Product Requirements Document

## Overview

This document specifies comprehensive health metrics tracking including weight, vital signs, body condition scoring, and health trends.

---

## User Stories

```gherkin
Feature: Health Metrics Tracking

Scenario: Log weight
  As a pet owner
  I want to record my pet's weight regularly
  So that I can track healthy weight management

Scenario: Track vital signs
  As a pet owner
  I want to log vital signs after a vet visit
  So that I can monitor changes over time

Scenario: Assess body condition
  As a pet owner
  I want to use the BCS guide to assess my pet's condition
  So that I can catch weight issues early

Scenario: View health trends
  As a pet owner
  I want to see charts of my pet's health metrics
  So that I can visualize their health journey
```

---

## Metrics Categories

### 1. Weight Tracking

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| Weight value | Decimal | 0.01-200 | Required |
| Weight unit | Enum | kg, lbs | User preference |
| Measured date | DateTime | Past or today | Required |
| Measurement method | Enum | scale, vet, estimate | Optional |
| Measured by | Text | Person's name | Optional |
| Notes | Text | Any notes | Optional |

### Ideal Weight Calculation

```typescript
interface IdealWeightRange {
  breed_id: string;
  min_weight_kg: number;
  max_weight_kg: number;
  factors: {
    age_adjustment: number; // Puppies lighter
    sex_adjustment: number; // Males typically heavier
    neutered_adjustment: number; // May affect weight
  };
}

function calculateIdealWeight(pet: Pet): WeightRange {
  const breedRange = getBreedWeightRange(pet.breed_id);
  let { min, max } = breedRange;
  
  // Adjust for sex (males ~10-15% heavier)
  if (pet.gender === 'male') {
    min *= 1.05;
    max *= 1.10;
  }
  
  // Adjust for age (puppies/kittens)
  if (pet.ageMonths < 12) {
    const ageFactor = pet.ageMonths / 12;
    min *= ageFactor;
    max *= ageFactor;
  }
  
  return { min, max };
}
```

### Weight Status

| Status | Condition | Alert |
|--------|-----------|-------|
| Underweight | < ideal_min × 0.85 | Warning |
| Slightly Under | 85-95% of ideal_min | Info |
| Ideal | Within range | None |
| Slightly Over | 105-115% of ideal_max | Info |
| Overweight | > ideal_max × 1.15 | Warning |
| Obese | > ideal_max × 1.30 | Alert |

---

### 2. Body Condition Score (BCS)

#### 9-Point Scale (WSAVA)

| Score | Category | Rib Check | Waist Check | Profile |
|:-----:|----------|-----------|-------------|---------|
| 1 | Emaciated | Visible from distance | Deep tuck | Bones prominent |
| 2 | Very Thin | Easily visible | Obvious tuck | Spine visible |
| 3 | Thin | Visible, minimal fat | Marked tuck | Hipbones visible |
| 4 | Underweight | Easily felt, little fat | Obvious waist | Slight rib visibility |
| 5 | **Ideal** | Felt without pressure | Visible waist | Smooth profile |
| 6 | Overweight | Felt with slight pressure | Less defined waist | Slight fat deposits |
| 7 | Heavy | Hard to feel ribs | Waist barely visible | Fat deposits obvious |
| 8 | Obese | Cannot feel ribs | No waist | Large fat deposits |
| 9 | Morbidly Obese | Ribs buried | Abdomen distended | Massive deposits |

#### Interactive BCS Assessment

```typescript
interface BCSAssessment {
  pet_id: string;
  assessed_date: Date;
  assessed_by: 'owner' | 'vet' | 'other';
  
  // Assessment steps
  rib_check: {
    visibility: 'visible' | 'felt_easily' | 'felt_with_pressure' | 'cannot_feel';
    fat_cover: 'none' | 'minimal' | 'moderate' | 'heavy';
  };
  waist_check: {
    from_above: 'obvious' | 'visible' | 'barely_visible' | 'not_visible';
    from_side: 'deep_tuck' | 'slight_tuck' | 'level' | 'sagging';
  };
  overall_appearance: {
    muscle_mass: 'wasted' | 'thin' | 'normal' | 'overweight';
    fat_deposits: 'none' | 'minimal' | 'moderate' | 'excessive';
  };
  
  // Calculated
  suggested_score: number; // 1-9
  confirmed_score: number; // User confirms/adjusts
  notes: string;
}
```

---

### 3. Vital Signs

| Metric | Dog Normal | Cat Normal | Unit | When to Record |
|--------|------------|------------|------|----------------|
| Heart Rate | 60-140 | 140-220 | bpm | Vet visits, concern |
| Respiratory Rate | 10-30 | 20-30 | breaths/min | Vet visits, concern |
| Temperature | 38.0-39.2 | 38.0-39.2 | °C | Vet visits, illness |
| Blood Pressure | 110-160 / 60-90 | 120-170 / 80-100 | mmHg | Vet checkups |
| Capillary Refill | <2 seconds | <2 seconds | seconds | Emergency check |

#### Vital Signs Form

```
┌─────────────────────────────────────────┐
│ ← Log Vital Signs                  [?]  │
├─────────────────────────────────────────┤
│ Date: [January 15, 2024]                │
│ Recorded by: [Vet / Self ▼]             │
├─────────────────────────────────────────┤
│ Heart Rate                              │
│ [72] bpm                                │
│ Normal: 60-140 bpm ✓                    │
├─────────────────────────────────────────┤
│ Respiratory Rate                        │
│ [18] breaths/min                        │
│ Normal: 10-30 ✓                         │
├─────────────────────────────────────────┤
│ Temperature                             │
│ [38.5] °C                               │
│ Normal: 38.0-39.2°C ✓                   │
├─────────────────────────────────────────┤
│ Blood Pressure (optional)               │
│ [___] / [___] mmHg                      │
├─────────────────────────────────────────┤
│ Notes                                   │
│ [Annual checkup, all normal...]         │
├─────────────────────────────────────────┤
│        [Cancel]     [Save Vitals]       │
└─────────────────────────────────────────┘
```

---

### 4. Activity Tracking

| Metric | Source | Frequency |
|--------|--------|-----------|
| Daily steps | Wearable device | Automatic |
| Exercise minutes | Manual / device | Daily |
| Activity level | AI assessment | Weekly |
| Sleep hours | Wearable device | Automatic |
| Rest quality | Manual / device | Daily |

#### Wearable Integration (Phase 4)

```typescript
interface WearableData {
  device_id: string;
  device_type: 'fitbark' | 'whistle' | 'fi' | 'link_akc';
  
  daily_metrics: {
    date: Date;
    steps: number;
    active_minutes: number;
    rest_minutes: number;
    distance_km: number;
    calories_burned: number;
    sleep_hours: number;
    sleep_quality: number; // 1-100
  };
  
  real_time?: {
    heart_rate: number;
    location: { lat: number; lng: number };
    activity_state: 'resting' | 'walking' | 'playing' | 'running';
  };
}
```

---

## Health Trends & Charts

### Weight Chart

```typescript
interface WeightChartData {
  data_points: Array<{
    date: Date;
    weight_kg: number;
    source: 'manual' | 'vet';
  }>;
  ideal_range: {
    min: number;
    max: number;
  };
  trend: {
    direction: 'up' | 'down' | 'stable';
    change_percent: number;
    period_days: number;
  };
  milestones: Array<{
    date: Date;
    label: string; // "Reached ideal weight"
  }>;
}
```

### Trend Analysis

```typescript
function analyzeTrend(measurements: Measurement[]): Trend {
  if (measurements.length < 3) return { direction: 'insufficient_data' };
  
  const recent = measurements.slice(-3);
  const older = measurements.slice(-6, -3);
  
  const recentAvg = average(recent.map(m => m.value));
  const olderAvg = average(older.map(m => m.value));
  
  const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  return {
    direction: changePercent > 3 ? 'up' : changePercent < -3 ? 'down' : 'stable',
    change_percent: changePercent,
    period_days: daysBetween(older[0].date, recent[recent.length - 1].date),
    significance: Math.abs(changePercent) > 10 ? 'significant' : 'minor'
  };
}
```

---

## Alerts & Recommendations

### Weight Alerts

| Alert | Trigger | Action |
|-------|---------|--------|
| Rapid weight loss | >5% in 2 weeks | Recommend vet visit |
| Gradual weight gain | >10% in 3 months | Diet review suggestion |
| Below ideal | 2+ weeks underweight | Nutrition guidance |
| Obesity risk | BCS 7+ | Weight management plan |

### Automated Insights

```typescript
const insights = [
  {
    condition: (pet) => pet.weightTrend === 'down' && pet.age < 12,
    message: "Max's weight is decreasing. Puppies should gain weight steadily.",
    severity: 'warning',
    action: 'recommend_vet'
  },
  {
    condition: (pet) => pet.bcs >= 7,
    message: "Max is overweight. Consider portion control and more exercise.",
    severity: 'info',
    action: 'show_diet_tips'
  }
];
```

---

## Database Schema

```sql
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  recorded_date TIMESTAMP WITH TIME ZONE NOT NULL,
  recorded_by VARCHAR(200),
  source VARCHAR(50) CHECK (source IN ('manual', 'vet', 'device')),
  
  -- Weight
  weight_kg DECIMAL(6,2),
  weight_status VARCHAR(20), -- calculated
  
  -- Body Condition
  body_condition_score INTEGER CHECK (body_condition_score BETWEEN 1 AND 9),
  bcs_assessment_data JSONB,
  
  -- Vital Signs
  heart_rate INTEGER,
  respiratory_rate INTEGER,
  temperature_celsius DECIMAL(4,1),
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  capillary_refill_seconds DECIMAL(3,1),
  
  -- Activity (from device or manual)
  activity_minutes INTEGER,
  steps INTEGER,
  distance_km DECIMAL(6,2),
  
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_health_metrics_pet_date ON health_metrics(pet_id, recorded_date DESC);
```

---

## API Endpoints

### Log Metric
```
POST /api/v1/pets/:petId/metrics
{
  "type": "weight",
  "weight_kg": 28.5,
  "recorded_date": "2024-01-15T10:00:00Z",
  "source": "scale",
  "notes": "Morning weight after walk"
}
```

### Get Metrics History
```
GET /api/v1/pets/:petId/metrics
?type=weight
&from=2023-01-01
&to=2024-01-15

Response:
{
  "metrics": [...],
  "summary": {
    "current": 28.5,
    "ideal_range": { "min": 27, "max": 32 },
    "status": "healthy",
    "trend": "stable"
  }
}
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Users tracking weight | 60% |
| Measurements per pet/month | 2+ |
| BCS assessments per pet/year | 4+ |
| Trend alerts accuracy | 90% |
