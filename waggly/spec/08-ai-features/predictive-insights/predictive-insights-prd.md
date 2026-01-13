# Predictive Health Insights - Product Requirements Document

## Overview

Predictive health insights leverage pet health data to identify potential issues before they become serious, providing proactive health recommendations.

---

## User Stories

```gherkin
Feature: Predictive Health Insights

Scenario: Weight trend prediction
  As a pet owner
  I want to be alerted if my pet's weight will reach unhealthy levels
  So that I can take preventive action

Scenario: Breed risk awareness
  As a pet owner
  I want to know about genetic health risks for my pet's breed
  So that I can watch for early signs

Scenario: Vaccination prediction
  As a pet owner
  I want to know when future vaccines are needed
  So that I can plan ahead

Scenario: Aging health guidance
  As a pet owner
  I want health recommendations as my pet ages
  So that I provide appropriate senior care
```

---

## Prediction Categories

### 1. Weight & Body Condition Predictions

```typescript
interface WeightPrediction {
  current_weight: number;
  ideal_weight_range: { min: number; max: number };
  
  predictions: {
    days_30: {
      predicted_weight: number;
      confidence: number;
      trend: 'gain' | 'loss' | 'stable';
      status: 'healthy' | 'concerning' | 'critical';
    };
    days_90: {...};
    days_180: {...};
  };
  
  risk_factors: string[];
  recommendations: Recommendation[];
}

// Prediction model
function predictWeight(pet: Pet, history: WeightMeasurement[]): WeightPrediction {
  // Use weighted moving average with trend analysis
  const trend = calculateTrend(history);
  const seasonality = detectSeasonality(history, pet.species);
  const ageAdjustment = getAgeWeightAdjustment(pet);
  
  return {
    predictions: {
      days_30: extrapolate(trend, 30, seasonality, ageAdjustment),
      days_90: extrapolate(trend, 90, seasonality, ageAdjustment),
      days_180: extrapolate(trend, 180, seasonality, ageAdjustment)
    },
    ...
  };
}
```

### 2. Breed-Specific Risk Predictions

| Breed | Condition | Typical Onset | Risk Level | Screening |
|-------|-----------|---------------|------------|-----------|
| German Shepherd | Hip Dysplasia | 6-12 months | High | X-rays at 12 months |
| Cavalier King Charles | Mitral Valve Disease | 5+ years | Very High | Annual heart exam |
| French Bulldog | BOAS | Birth | Very High | Lifestyle monitoring |
| Golden Retriever | Cancer | 8+ years | High | Biannual checkups |
| Dachshund | IVDD | 3-7 years | High | Weight management |
| Labrador Retriever | Obesity | Adult | High | Weight monitoring |

```typescript
interface BreedRiskAssessment {
  breed: string;
  age_months: number;
  
  active_risks: Array<{
    condition: string;
    risk_level: 'low' | 'moderate' | 'high' | 'very_high';
    typical_onset_age: number;
    current_proximity: 'not_applicable' | 'approaching' | 'in_window' | 'past_typical';
    screening_due: boolean;
    last_screening?: Date;
    next_screening?: Date;
    symptoms_to_watch: string[];
    preventive_measures: string[];
  }>;
  
  upcoming_risks: Array<{
    condition: string;
    expected_window: { start_age: number; end_age: number };
    prepare_by: Date;
    actions: string[];
  }>;
}
```

### 3. Life Stage Predictions

```typescript
interface LifeStageAssessment {
  current_stage: 'puppy' | 'adolescent' | 'adult' | 'mature' | 'senior' | 'geriatric';
  remaining_in_stage: number; // months
  
  upcoming_transitions: Array<{
    to_stage: string;
    estimated_date: Date;
    changes_expected: string[];
    care_adjustments: string[];
  }>;
  
  age_appropriate_checks: Array<{
    check_type: string;
    recommended_frequency: string;
    last_performed?: Date;
    next_due: Date;
    priority: 'routine' | 'important' | 'critical';
  }>;
}

// Life stage thresholds (in years)
const DOG_LIFE_STAGES = {
  small: {  // <10kg
    puppy: 0, adolescent: 0.5, adult: 1, mature: 7, senior: 10, geriatric: 13
  },
  medium: {  // 10-25kg
    puppy: 0, adolescent: 0.5, adult: 1, mature: 6, senior: 8, geriatric: 11
  },
  large: {  // 25-40kg
    puppy: 0, adolescent: 0.5, adult: 1.5, mature: 5, senior: 7, geriatric: 9
  },
  giant: {  // >40kg
    puppy: 0, adolescent: 0.75, adult: 2, mature: 4, senior: 6, geriatric: 8
  }
};
```

### 4. Dental Health Predictions

```typescript
interface DentalPrediction {
  last_cleaning: Date | null;
  dental_score: number; // 1-5
  
  prediction: {
    next_cleaning_recommended: Date;
    periodontal_risk: 'low' | 'moderate' | 'high';
    tooth_loss_risk: 'low' | 'moderate' | 'high';
  };
  
  risk_factors: string[];
  daily_care_score: number;
  recommendations: Recommendation[];
}
```

### 5. Vaccination & Prevention Schedule

```typescript
interface PreventionSchedule {
  pet_id: string;
  
  vaccinations: Array<{
    vaccine: string;
    type: 'core' | 'non_core';
    last_given: Date;
    next_due: Date;
    days_until_due: number;
    status: 'current' | 'due_soon' | 'overdue';
    compliance_history: number; // percentage
  }>;
  
  parasite_prevention: {
    flea_tick: {
      product?: string;
      last_applied: Date;
      next_due: Date;
      seasonal_recommendation: boolean;
    };
    heartworm: {
      product?: string;
      last_given: Date;
      next_due: Date;
      regional_risk: 'low' | 'moderate' | 'high';
    };
  };
  
  twelve_month_forecast: Array<{
    date: Date;
    item: string;
    type: 'vaccine' | 'prevention' | 'checkup';
    estimated_cost?: number;
  }>;
}
```

---

## Insight Notification Types

### Proactive Alerts

| Alert Type | Trigger | Timing | Priority |
|------------|---------|--------|----------|
| Weight trend alert | Projected overweight in 30 days | Immediate | High |
| Breed risk window | Entering high-risk age for condition | 3 months before | Medium |
| Senior transition | Approaching senior life stage | 6 months before | Medium |
| Screening due | Breed-specific test overdue | When overdue | High |
| Dental cleaning | Predicted dental issues | 1 month before | Medium |

### Insight Cards

```
┌─────────────────────────────────────────┐
│ 🔮 Health Insights for Max              │
├─────────────────────────────────────────┤
│ ┌─ Weight Forecast ─────────────────┐   │
│ │ 📈 Current: 28.5 kg (Healthy)     │   │
│ │                                   │   │
│ │ At current trend:                 │   │
│ │ • 30 days: 29.2 kg (+2.5%)        │   │
│ │ • 90 days: 30.1 kg (+5.6%) ⚠️     │   │
│ │                                   │   │
│ │ Max may become overweight by      │   │
│ │ April if current trend continues. │   │
│ │                                   │   │
│ │ [View Diet Tips]  [Set Goal]      │   │
│ └───────────────────────────────────┘   │
│                                         │
│ ┌─ Breed Health Watch ──────────────┐   │
│ │ 🧬 Golden Retriever Risks         │   │
│ │                                   │   │
│ │ At Max's age (3y 8m):             │   │
│ │                                   │   │
│ │ ✅ Hip Dysplasia window passed    │   │
│ │ ⚠️ Cancer screening - start at 8y │   │
│ │ 👁️ Eye exams - annual recommended │   │
│ │                                   │   │
│ │ [View Full Breed Report]          │   │
│ └───────────────────────────────────┘   │
│                                         │
│ ┌─ Upcoming Care ───────────────────┐   │
│ │ 📅 Your 12-month forecast         │   │
│ │                                   │   │
│ │ Feb: Rabies booster (€35)         │   │
│ │ Mar: Dental checkup               │   │
│ │ Jun: Annual bloodwork (€120)      │   │
│ │ Aug: Heartworm test               │   │
│ │ Oct: Flu vaccine (€45)            │   │
│ │                                   │   │
│ │ Estimated annual: €450-550        │   │
│ │ [Add to Calendar]                 │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Machine Learning Models

### Weight Prediction Model

```python
# Simplified representation
class WeightPredictionModel:
    """
    Features:
    - Historical weight measurements (normalized)
    - Age in months
    - Breed expected weight range
    - Gender
    - Neutered status
    - Season (some pets gain winter weight)
    - Activity level (if tracked)
    
    Model: ARIMA for time series + XGBoost for factors
    """
    
    def predict(self, pet_data, horizon_days=90):
        # Time series component
        ts_prediction = self.arima.forecast(horizon_days)
        
        # Factor adjustment
        factors = self.extract_factors(pet_data)
        adjustment = self.xgboost.predict(factors)
        
        return ts_prediction * adjustment
```

### Risk Scoring Model

```python
class BreedRiskModel:
    """
    Calculates personalized risk scores based on:
    - Breed-specific condition prevalence
    - Current age vs typical onset age
    - Existing health conditions
    - Weight status
    - Lifestyle factors
    - Family history (if known)
    """
    
    def calculate_risk(self, pet, condition):
        base_risk = self.breed_prevalence[pet.breed][condition]
        
        # Age proximity factor
        age_factor = self.age_curve(pet.age, condition.typical_onset)
        
        # Modifying factors
        weight_factor = 1.0 + (pet.bmi_offset * 0.05)  # Overweight increases risk
        lifestyle_factor = self.assess_lifestyle(pet)
        
        return base_risk * age_factor * weight_factor * lifestyle_factor
```

---

## Database Schema

```sql
CREATE TABLE health_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  prediction_type VARCHAR(50) NOT NULL,
  prediction_date DATE NOT NULL,
  
  -- Prediction data
  predicted_value DECIMAL,
  confidence_score DECIMAL(3,2),
  prediction_horizon_days INTEGER,
  
  -- Model info
  model_version VARCHAR(20),
  features_used JSONB,
  
  -- Outcomes (for model improvement)
  actual_value DECIMAL,
  accuracy_score DECIMAL(3,2),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE breed_risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  assessment_date DATE NOT NULL,
  
  risks JSONB NOT NULL,
  recommendations JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Specification

### Get Health Insights
```
GET /api/v1/pets/:petId/insights

Response:
{
  "pet_id": "uuid",
  "generated_at": "2024-01-15T10:00:00Z",
  
  "weight_prediction": {
    "current": 28.5,
    "30_day": { "value": 29.2, "trend": "gain", "status": "healthy" },
    "90_day": { "value": 30.1, "trend": "gain", "status": "concerning" }
  },
  
  "breed_risks": {
    "active": [],
    "upcoming": [
      { "condition": "Cancer screening", "recommended_age": 8, "years_away": 4.3 }
    ]
  },
  
  "life_stage": {
    "current": "adult",
    "next_transition": { "to": "mature", "in_months": 28 }
  },
  
  "upcoming_care": [
    { "type": "vaccine", "item": "Rabies", "due": "2024-02-15" }
  ],
  
  "recommendations": [
    {
      "priority": "medium",
      "title": "Monitor weight trend",
      "description": "Max has gained 3% in the last month..."
    }
  ]
}
```

---

## Privacy & Transparency

### User Controls
- Opt-in/opt-out for predictive features
- Clear explanation of how predictions work
- Ability to dismiss/hide predictions
- No sharing of prediction data with third parties

### Disclaimers
> 🔮 **AI Prediction**
> This insight is generated based on Max's health data and breed statistics. It is not a medical diagnosis. Always consult your veterinarian for health concerns.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Prediction accuracy (weight) | 85% within 10% margin |
| User engagement with insights | 50% view weekly |
| Preventive action taken | 30% follow recommendations |
| Vet visit scheduling from insights | 15% of insights |
| User satisfaction score | 4.2/5 |
