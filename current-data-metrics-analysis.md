# Current Data Metrics & Scoring Analysis

**Document Version**: 1.0  
**Created**: January 3, 2026  
**Purpose**: Analysis of existing Waggli data to identify implementable metrics and scoring logic  
**Based On**: Current database schema analysis

---

## 📊 EXECUTIVE SUMMARY

This document analyzes Waggli's existing database structure and identifies **30+ metrics and scores** that can be immediately implemented using current data, without requiring new data collection.

**Current Data Available (V2 Schema)**:
- ✅ Pet demographics (species, breed, age, size, weight)
- ✅ Weight history (`weight_logs` table)
- ✅ Vaccinations with validity dates (`vaccinations`)
- ✅ Active medications (`medications`)
- ✅ Allergies with severity (`allergies`)
- ✅ Medical visits & diagnoses (`medical_visits`)
- ✅ Providers & Insurance (`providers`)
- ✅ Documents & Passports (`documents`, `travel_records`)

**Implementable Metrics**:
1. **Vaccination Compliance Score** (0-100)
2. **Weight Management Score** (0-100)
3. **Preventive Care Score** (0-100)
4. **Health Risk Indicators** (Low/Medium/High)
5. **Data Completeness Score** (0-100)
6. **Pet Age-Adjusted Benchmarks**
7. **Alerts & Red Flags System**

---

## 1. VACCINATION COMPLIANCE SCORE

### Data Available
```sql
SELECT 
  pet_id,
  vaccine_name,
  date_given,
  next_due_date,
  category  -- core vs non-core
FROM vaccinations
WHERE pet_id = ?
```

### Scoring Logic

```typescript
function calculateVaccinationCompliance(pet: Pet, vaccinations: Vaccination[]): VaccinationScore {
  const today = new Date();
  
  // Get required vaccines based on species
  const requiredVaccines = getRequiredVaccines(pet.species, pet.age_years);
  
  let score = 100;
  let details = {
    total_required: requiredVaccines.length,
    up_to_date: 0,
    overdue: 0,
    never_given: 0,
    overdue_vaccines: [] as string[]
  };
  
  // Check each required vaccine
  requiredVaccines.forEach(required => {
    const vaxRecords = vaccinations.filter(v => 
      v.vaccine_name.toLowerCase().includes(required.name.toLowerCase())
    );
    
    if (vaxRecords.length === 0) {
      // Never given  
      details.never_given++;
      score -= 25; // Heavy penalty
    } else {
      // Find most recent
      const latest = vaxRecords.sort((a, b) => 
        new Date(b.date_given).getTime() - new Date(a.date_given).getTime()
      )[0];
      
      if (latest.next_due_date) {
        const dueDate = new Date(latest.next_due_date);
        const daysOverdue = Math.floor(
          (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysOverdue > 0) {
          details.overdue++;
          details.overdue_vaccines.push(latest.vaccine_name);
          
          // Progressive penalty based on how overdue
          if (daysOverdue > 365) score -= 20;      // >1 year
          else if (daysOverdue > 90) score -= 15;  // >3 months
          else if (daysOverdue > 30) score -= 10;  // >1 month
          else score -= 5;                         // <1 month
        } else {
          details.up_to_date++;
        }
      } else {
        // Vaccine given but no next due date set
        details.up_to_date++;
      }
    }
  });
  
  return {
    score: Math.max(0, score),
    compliance_percentage: Math.round((details.up_to_date / details.total_required) * 100),
    category: getComplianceCategory(score),
    details: details
  };
}

function getComplianceCategory(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 50) return 'fair';
  if (score >= 25) return 'poor';
  return 'critical';
}

// Required vaccines by species
function getRequiredVaccines(species: string, ageYears: number): Required Vaccine[] {
  const vaccines = {
    dog: [
      { name: 'Rabies', category: 'core', first_age_months: 4 },
      { name: 'DHPP', category: 'core', first_age_months: 2 },
      { name: 'Bordetella', category: 'non-core', first_age_months: 3 }
    ],
    cat: [
      { name: 'Rabies', category: 'core', first_age_months: 4 },
      { name: 'FVRCP', category: 'core', first_age_months: 2 },
      { name: 'FeLV', category: 'non-core', first_age_months: 2 }
    ]
  };
  
  return vaccines[species] || [];
}
```

### Display Example
```
┌──────────────────────────────────────┐
│ Vaccination Compliance: 75/100 GOOD  │
├──────────────────────────────────────┤
│ ✅ Up to date: 3/4 (75%)             │
│ ⚠️  Overdue: 1                       │
│    - Bordetella (30 days overdue)    │
│                                      │
│ [View Schedule] [Book Appointment]  │
└──────────────────────────────────────┘
```

---

## 2. WEIGHT MANAGEMENT SCORE

### Data Available
```sql
-- Weight history
SELECT weight, recorded_date as date FROM weight_logs 
WHERE pet_id = ? 
ORDER BY recorded_date DESC;

-- Current weight from pets table
SELECT weight, size, breed FROM pets WHERE id = ?;

-- Health metrics (BCS if available)
SELECT 
  weight, 
  body_condition_score, 
  date 
FROM health_metrics 
WHERE pet_id = ? 
ORDER BY date DESC LIMIT 1;
```

### Scoring Logic

```typescript
function calculateWeightManagementScore(
  pet: Pet,
  weightHistory: WeightEntry[],
  latestHealthMetric?: HealthMetric
): WeightScore {
  let score = 100;
  let issues = [];
  
  // 1. Check ideal weight range for breed/size
  const idealRange = getIdealWeightRange(pet.breed, pet.size);
  const currentWeight = weightHistory[0]?.weight || pet.weight;
  
  if (currentWeight < idealRange.min) {
    const percentBelow = ((idealRange.min - currentWeight) / idealRange.min) * 100;
    issues.push(`Underweight by ${percentBelow.toFixed(1)}%`);
    score -= Math.min(30, percentBelow * 2);
  } else if (currentWeight > idealRange.max) {
    const percentAbove = ((currentWeight - idealRange.max) / idealRange.max) * 100;
    issues.push(`Overweight by ${percentAbove.toFixed(1)}%`);
    score -= Math.min(30, percentAbove * 2);
  }
  
  // 2. Weight trend analysis (last 6 months)
  if (weightHistory.length >= 2) {
    const recent = weightHistory.slice(0, Math.min(6, weightHistory.length));
    const oldestInRange = recent[recent.length - 1];
    const newest = recent[0];
    
    const weightChange = newest.weight - oldestInRange.weight;
    const percentChange = (weightChange / oldestInRange.weight) * 100;
    const timeSpanMonths = Math.abs(
      (new Date(newest.date).getTime() - new Date(oldestInRange.date).getTime()) 
      / (1000 * 60 * 60 * 24 * 30)
    );
    
    const monthlyChange = percentChange / timeSpanMonths;
    
    // Rapid weight gain/loss is concerning
    if (Math.abs(monthlyChange) > 5) {
      issues.push(`Rapid weight ${weightChange > 0 ? 'gain' : 'loss'} (${Math.abs(monthlyChange).toFixed(1)}%/month)`);
      score -= 20;
    } else if (Math.abs(monthlyChange) > 3) {
      issues.push(`Moderate weight ${weightChange > 0 ? 'gain' : 'loss'}`);
      score -= 10;
    }
  }
  
  // 3. Body Condition Score (if available)
  if (latestHealthMetric?.body_condition_score) {
    const bcs = latestHealthMetric.body_condition_score;
    
    if (bcs <= 3) {
      issues.push('BCS indicates underweight');
      score -= 20;
    } else if (bcs >= 7) {
      issues.push('BCS indicates overweight/obese');
      score -= 20;
    } else if (bcs === 4 || bcs === 6) {
      issues.push('BCS slightly off ideal');
      score -= 5;
    }
  }
  
  // 4. Tracking consistency
  if (weightHistory.length < 2) {
    issues.push('Insufficient weight tracking');
    score -= 15;
  } else {
    // Check for regular tracking (at least every 6 months)
    const lastRecorded = new Date(weightHistory[0].date);
    const monthsSinceLastRecord = Math.abs(
      (new Date().getTime() - lastRecorded.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    if (monthsSinceLastRecord > 6) {
      issues.push('Weight not tracked recently');
      score -= 10;
    }
  }
  
  return {
    score: Math.max(0, score),
    category: getWeightCategory(score),
    current_weight: currentWeight,
    ideal_range: idealRange,
    weight_status: getWeightStatus(currentWeight, idealRange),
    issues: issues,
    trend: calculateTrend(weightHistory)
  };
}

function getIdealWeightRange(breed: string, size: string): {min: number, max: number} {
  // Breed-specific ranges (would need comprehensive database)
  const breedRanges = {
    'golden retriever': { min: 25, max: 34 },
    'labrador retriever': { min: 25, max: 36 },
    'german shepherd': { min: 22, max: 40 },
    // ... more breeds
  };
  
  if (breed && breedRanges[breed.toLowerCase()]) {
    return breedRanges[breed.toLowerCase()];
  }
  
  // Fall back to size-based ranges
  const sizeRanges = {
    'small': { min: 2, max: 10 },
    'medium': { min: 10, max: 25 },
    'large': { min: 25, max: 45 }
  };
  
  return sizeRanges[size] || { min: 5, max: 30 };
}

function getWeightStatus(weight: number, idealRange: {min: number, max: number}): string {
  if (weight < idealRange.min * 0.85) return 'severely_underweight';
  if (weight < idealRange.min) return 'underweight';
  if (weight > idealRange.max * 1.20) return 'obese';
  if (weight > idealRange.max) return 'overweight';
  return 'ideal';
}
```

### Display Example
```
┌──────────────────────────────────────┐
│ Weight Management: 65/100 FAIR       │
├──────────────────────────────────────┤
│ Current: 32.5 kg                     │
│ Ideal Range: 25-34 kg                │
│ Status: SLIGHTLY OVERWEIGHT ⚠️       │
│                                      │
│ Issues:                              │
│ • Overweight by 8.3%                 │
│ • Weight increasing trend            │
│                                      │
│ [View Weight Chart] [Diet Plan]     │
└──────────────────────────────────────┘
```

---

## 3. PREVENTIVE CARE SCORE

### Data Available
```sql
-- Recent vet visits from medical_visits table
SELECT * FROM medical_visits 
WHERE pet_id = ? 
ORDER BY visit_date DESC;

-- Active medications (preventative)
SELECT * FROM medications 
WHERE pet_id = ? 
AND is_ongoing = TRUE;

-- Vaccinations
SELECT * FROM vaccinations WHERE pet_id = ?;
```

### Scoring Logic

```typescript
function calculatePreventiveCareScore(
  pet: Pet,
  vaccinations: Vaccination[],
  treatments: Treatment[],
  medicalVisits: MedicalVisit[]
): PreventiveCareScore {
  let score = 100;
  const issues = [];
  
  // 1. Annual Wellness Visit (30 points)
  const lastCheckup = medicalVisits
    .filter(v => v.visit_type === 'checkup' || v.visit_type === 'wellness')
    .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())[0];
  
  if (lastCheckup) {
    const monthsSinceCheckup = Math.abs(
      (new Date().getTime() - new Date(lastCheckup.visit_date).getTime()) 
      / (1000 * 60 * 60 * 24 * 30)
    );
    
    if (monthsSinceCheckup > 18) {
      score -= 30;
      issues.push(`Annual checkup overdue (${Math.floor(monthsSinceCheckup)} months ago)`);
    } else if (monthsSinceCheckup > 12) {
      score -= 15;
      issues.push('Annual checkup due soon');
    }
  } else {
    score -= 30;
    issues.push('No wellness visit recorded');
  }
  
  // 2. Vaccination Status (30 points) - use vaccination compliance
  const vaxCompliance = calculateVaccinationCompliance(pet, vaccinations);
  const vaxScore = vaxCompliance.score * 0.3;
  score = score - 30 + vaxScore;
  
  if (vaxCompliance.details.overdue > 0) {
    issues.push(`${vaxCompliance.details.overdue} vaccine(s) overdue`);
  }
  
  // 3. Parasite Prevention (25 points)
  const parasitePrevention = treatments.filter(t => 
    t.category === 'preventive' &&
    (t.treatment_name.toLowerCase().includes('flea') ||
     t.treatment_name.toLowerCase().includes('tick') ||
     t.treatment_name.toLowerCase().includes('heartworm') ||
     t.treatment_name.toLowerCase().includes('deworming'))
  );
  
  const hasActiveFleaTick = parasitePrevention.some(t => 
    t.is_active && (
      t.treatment_name.toLowerCase().includes('flea') ||
      t.treatment_name.toLowerCase().includes('tick')
    )
  );
  
  const hasActiveHeartworm = parasitePrevention.some(t =>
    t.is_active && t.treatment_name.toLowerCase().includes('heartworm')
  );
  
  if (!hasActiveFleaTick) {
    score -= 12;
    issues.push('No active flea/tick prevention');
  }
  
  if (!hasActiveHeartworm && pet.species === 'dog') {
    score -= 13;
    issues.push('No active heartworm prevention');
  }
  
  // 4. Dental Care (15 points)
  const dentalVisits = medicalVisits.filter(v =>
    v.visit_type?.toLowerCase().includes('dental') ||
    v.notes?.toLowerCase().includes('dental')
  );
  
  if (dentalVisits.length === 0) {
    score -= 10;
    issues.push('No dental care recorded');
  } else {
    const lastDental = dentalVisits[0];
    const monthsSinceDental = Math.abs(
      (new Date().getTime() - new Date(lastDental.visit_date).getTime()) 
      / (1000 * 60 * 60 * 24 * 30)
    );
    
    if (monthsSinceDental > 24) { // Should be yearly ideally
      score -= 10;
      issues.push('Dental cleaning overdue');
    }
  }
  
  return {
    score: Math.max(0, score),
    category: getPreventiveCareCategory(score),
    issues: issues,
    breakdown: {
      annual_checkup: lastCheckup ? 'current' : 'overdue',
      vaccination_status: vaxCompliance.category,
      parasite_prevention: (hasActiveFleaTick && hasActiveHeartworm) ? 'current' : 'incomplete',
      dental_care: dentalVisits.length > 0 ? 'current' : 'overdue'
    }
  };
}

function getPreventiveCareCategory(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  if (score >= 40) return 'poor';
  return 'critical';
}
```

### Display Example
```
┌──────────────────────────────────────┐
│ Preventive Care: 70/100 FAIR         │
├──────────────────────────────────────┤
│ ✅ Annual checkup: Current           │
│ ⚠️  Vaccinations: 1 overdue          │
│ ❌ Parasite prevention: Incomplete   │
│ ⚠️  Dental care: Overdue             │
│                                      │
│ Priority Actions:                    │
│ 1. Schedule dental cleaning          │
│ 2. Update Bordetella vaccine         │
│ 3. Start flea/tick prevention        │
│                                      │
│ [View Details] [Schedule Visit]     │
└──────────────────────────────────────┘
```

---

## 4. HEALTH RISK INDICATORS

### Data Available
```sql
-- Medical conditions
SELECT * FROM conditions 
WHERE pet_id = ? AND status = 'active';

-- Allergies by severity
SELECT severity, COUNT(*) as count 
FROM allergies 
WHERE pet_id = ? 
GROUP BY severity;

-- Active chronic treatments
SELECT * FROM treatments 
WHERE pet_id = ? 
AND category = 'chronic' 
AND is_active = TRUE;
```

### Risk Calculation Logic

```typescript
function calculateHealthRisks(
  pet: Pet,
  conditions: Condition[],
  allergies: Allergy[],
  treatments: Treatment[],
  weightScore: WeightScore
): HealthRiskAssessment {
  const risks = [];
  let overallRiskLevel = 'low';
  
  // 1. Chronic Conditions Risk
  const activeConditions = conditions.filter(c => c.status === 'active');
  if (activeConditions.length > 0) {
    activeConditions.forEach(condition => {
      const risk = {
        type: 'chronic_condition',
        name: condition.name,
        severity: condition.severity,
        risk_level: mapSeverityToRisk(condition.severity),
        first_identified: condition.diagnosed_date,
        details: condition.notes
      };
      risks.push(risk);
      
      if (risk.risk_level === 'high' || risk.risk_level === 'critical') {
        overallRiskLevel = 'high';
      } else if (risk.risk_level === 'medium' && overallRiskLevel === 'low') {
        overallRiskLevel = 'medium';
      }
    });
  }
  
  // 2. Allergy Risk
  const severeAllergies = allergies.filter(a => a.severity === 'severe');
  if (severeAllergies.length > 0) {
    risks.push({
      type: 'severe_allergies',
      name: `${severeAllergies.length} severe allergy/allergies`,
      risk_level: 'high',
      allergens: severeAllergies.map(a => a.allergen),
      mitigation: 'Strict allergen avoidance required'
    });
    overallRiskLevel = 'high';
  }
  
  // 3. Weight-Related Risk
  if (weightScore.weight_status === 'obese') {
    risks.push({
      type: 'obesity',
      name: 'Obesity',
      risk_level: 'high',
      details: `${((weightScore.current_weight - weightScore.ideal_range.max) / weightScore.ideal_range.max * 100).toFixed(1)}% over ideal weight`,
      associated_risks: [
        'Diabetes',
        'Joint problems',
        'Heart disease',
        'Reduced lifespan'
      ],
      mitigation: 'Weight loss plan recommended'
    });
    overallRiskLevel = 'high';
  } else if (weightScore.weight_status === 'overweight') {
    risks.push({
      type: 'overweight',
      name: 'Overweight',
      risk_level: 'medium',
      details: weightScore.issues.join(', '),
      mitigation: 'Diet and exercise adjustment'
    });
    if (overallRiskLevel === 'low') overallRiskLevel = 'medium';
  }
  
  // 4. Medication Burden
  const activeChronicMeds = treatments.filter(t => 
    t.category === 'chronic' && t.is_active
  );
  
  if (activeChronicMeds.length >= 3) {
    risks.push({
      type: 'polypharmacy',
      name: 'Multiple Medications',
      risk_level: 'medium',
      details: `${activeChronicMeds.length} active chronic medications`,
      associated_risks: [
        'Drug interactions',
        'Side effects',
        'Compliance challenges'
      ],
      mitigation: 'Regular medication review with vet'
    });
    if (overallRiskLevel === 'low') overallRiskLevel = 'medium';
  }
  
  // 5. Age-Related Risks
  if (pet.date_of_birth) {
    const ageYears = calculateAge(pet.date_of_birth);
    const seniorAge = getSeniorAge(pet.species, pet.size);
    
    if (ageYears >= seniorAge) {
      risks.push({
        type: 'senior_pet',
        name: 'Age-Related Risk',
        risk_level: 'medium',
        details: `Senior pet (${ageYears} years old)`,
        associated_risks: [
          'Arthritis',
          'Cognitive decline',
          'Organ function decline',
          'Cancer risk'
        ],
        mitigation: 'Increased monitoring, bi-annual checkups'
      });
      if (overallRiskLevel === 'low') overallRiskLevel = 'medium';
    }
  }
  
  return {
    overall_risk_level: overallRiskLevel,
    risk_count: risks.length,
    risks: risks,
    recommendations: generateRiskRecommendations(risks)
  };
}

function getSeniorAge(species: string, size: string): number {
  if (species === 'dog') {
    if (size === 'small') return 10;
    if (size === 'medium') return 8;
    if (size === 'large') return 6;
  }
  if (species === 'cat') return 10;
  return 8;
}
```

### Display Example
```
┌──────────────────────────────────────┐
│ Health Risks: MEDIUM ⚠️             │
├──────────────────────────────────────┤
│ 3 Active Risks:                      │
│                                      │
│ 🟡 MEDIUM - Overweight               │
│    8.3% over ideal weight            │
│    → Weight loss plan needed         │
│                                      │
│ 🟡 MEDIUM - Senior Pet (9 years)     │
│    Increased monitoring required     │
│    → Bi-annual checkups              │
│                                      │
│ 🟡 MEDIUM - Chronic Arthritis        │
│    Managed with medication           │
│    → Continue treatment plan         │
│                                      │
│ [View Full Risk Assessment]         │
└──────────────────────────────────────┘
```

---

## 5. DATA COMPLETENESS SCORE

### Scoring Logic

```typescript
function calculateDataCompletenessScore(pet: Pet, allData: AllPetData): CompletenessScore {
  const categories = {
    basic_info: {
      weight: 15,
      fields: ['name', 'species', 'breed', 'date_of_birth', 'gender', 'weight'],
      score: 0
    },
    health_records: {
      weight: 30,
      fields: {
        has_vaccinations: 10,
        has_vet_visits: 10,
        has_weight_history: 5,
        has_health_metrics: 5
      },
      score: 0
    },
    medical_info: {
      weight: 25,
      fields: {
        has_allergies: 5,
        has_conditions: 10,
        has_treatments: 10
      },
      score: 0
    },
    lifestyle: {
      weight: 20,
      fields: {
        has_food_info: 10,
        has_care_notes: 5,
        has_behavior_tags: 5
      },
      score: 0
    },
    contact_info: {
      weight: 10,
      fields: {
        has_primary_vet: 10
      },
      score: 0
    }
  };
  
  // Calculate basic info score
  const basicFields = categories.basic_info.fields;
  const completedBasic = basicFields.filter(field => pet[field] != null).length;
  categories.basic_info.score = (completedBasic / basicFields.length) * 100;
  
  // Calculate health records score
  categories.health_records.score = 
    (allData.vaccinations.length > 0 ? 10 : 0) +
    (allData.medicalVisits?.length > 0 ? 10 : 0) +
    (allData.weightHistory.length >= 2 ? 5 : 0) +
    (allData.healthMetrics?.length > 0 ? 5 : 0);
  
  // Calculate medical info score
  categories.medical_info.score =
    (allData.allergies.length > 0 ? 5 : 0) +
    (allData.conditions?.length > 0 ? 10 : 0) +
    (allData.treatments.length > 0 ? 10 : 0);
  
  // Calculate lifestyle score
  categories.lifestyle.score =
    (allData.food ? 10 : 0) +
    (allData.careNotes ? 5 : 0) +
    (allData.behaviorTags.length > 0 ? 5 : 0);
  
  // Calculate contact info score
  categories.contact_info.score =
    (allData.veterinarians.some(v => v.is_primary) ? 10 : 0);
  
  // Calculate weighted overall score
  const overallScore = Math.round(
    Object.entries(categories).reduce((total, [key, cat]) => {
      return total + (cat.score * cat.weight / 100);
    }, 0)
  );
  
  return {
    overall_score: overallScore,
    category: getCompletenessCategory(overallScore),
    breakdown: categories,
    missing_critical: getMissingCriticalFields(pet, allData)
  };
}

function getCompletenessCategory(score: number): string {
  if (score >= 90) return 'comprehensive';
  if (score >= 75) return 'good';
  if (score >= 50) return 'basic';
  if (score >= 25) return 'minimal';
  return 'incomplete';
}
```

### Display Example
```
┌──────────────────────────────────────┐
│ Profile Completeness: 72% GOOD       │
├──────────────────────────────────────┤
│ Basic Info        ████████░░ 85%     │
│ Health Records    ███████░░░ 70%     │
│ Medical Info      ██████░░░░ 60%     │
│ Lifestyle         ███████████ 100%   │
│ Contact Info      ███████████ 100%   │
│                                      │
│ Missing:                             │
│ • Weight history (last 6 months)     │
│ • Annual wellness visit              │
│                                      │
│ [Complete Profile]                  │
└──────────────────────────────────────┘
```

---

## 6. AGE-ADJUSTED BENCHMARKS

### Logic

```typescript
function getAgeBenchmarks(pet: Pet): AgeBenchmarks {
  const ageYears = calculateAge(pet.date_of_birth);
  const lifeStage = getLifeStage(pet.species, pet.size, ageYears);
  
  return {
    stage: lifeStage,
    human_age_equivalent: calculateHumanAge(pet.species, ageYears),
    expected_weight_range: getIdealWeightRange(pet.breed, pet.size),
    recommended_checks: getLifeStageRecommendations(lifeStage)
  };
}
```

---

## 7. TRAVEL READINESS SCORE (PASSPORT)

### Data Available
```sql
SELECT 
  p.microchip_number,
  v.vaccine_name,
  v.valid_until,
  d.category as doc_category
FROM pets p
LEFT JOIN vaccinations v ON p.id = v.pet_id
LEFT JOIN documents d ON p.id = d.pet_id
WHERE p.id = ?;
```

### Scoring Logic
- **Microchip**: Required (+25)
- **Rabies Vaccination**: Must be valid (valid_until > return_date) (+25)
- **Core Vaccinations**: Up to date (+20)
- **Passport Document**: 'passport' category document exists (+20)
- **Recent Health Check**: Visit within 30 days (+10)

---

## 8. PROVIDER NETWORK STRENGTH

### Data Available
```sql
SELECT category, name FROM providers WHERE owner_id = ?;
```

### Scoring Logic
- **Primary Vet**: Linked (+40)
- **Emergency Vet**: Linked (+30)
- **Insurance**: Linked (+20)
- **Other Providers**: Groomer/Sitter (+10)

Displays as: "Network Strength: Strong" to encourage users to add emergency contacts.
    life_stage: lifeStage,
    age_years: ageYears,
    age_category: getAgeCategory(lifeStage),
    expected_lifespan: getExpectedLifespan(pet.species, pet.breed, pet.size),
    health_priorities: getHealthPriorities(lifeStage, pet.species),
    recommended_checkup_frequency: getCheckupFrequency(lifeStage),
    diet_recommendations: getDietRecommendations(lifeStage, pet.size),
    exercise_recommendations: getExerciseRecommendations(lifeStage, pet.breed)
  };
}

function getLifeStage(species: string, size: string, ageYears: number): string {
  if (species === 'dog') {
    if (ageYears < 1) return 'puppy';
    if (size === 'small' && ageYears < 10) return 'adult';
    if (size === 'medium' && ageYears < 8) return 'adult';
    if (size === 'large' && ageYears < 6) return 'adult';
    return 'senior';
  }
  
  if (species === 'cat') {
    if (ageYears < 1) return 'kitten';
    if (ageYears < 10) return 'adult';
    return 'senior';
  }
  
  return 'adult';
}

function getHealthPriorities(lifeStage: string, species: string): string[] {
  const priorities = {
    puppy: [
      'Core vaccinations series',
      'Socialization',
      'Spay/neuter planning',
      'Parasite prevention',
      'Dental care establishment'
    ],
    adult: [
      'Annual wellness exams',
      'Dental cleanings',
      'Weight management',
      'Parasite prevention',
      'Vaccination boosters'
    ],
    senior: [
      'Bi-annual wellness exams',
      'Arthritis screening',
      'Organ function tests (bloodwork)',
      'Dental care',
      'Cancer screening',
      'Cognitive health monitoring'
    ]
  };
  
  return priorities[lifeStage] || priorities.adult;
}
```

---

## 7. ALERTS & RED FLAGS SYSTEM

### Data-Driven Alert Logic

```typescript
function generateHealthAlerts(
  pet: Pet,
  allData: AllPetData,
  scores: AllScores
): HealthAlert[] {
  const alerts = [];
  
  // CRITICAL ALERTS
  
  // 1. Overdue Rabies Vaccination (Legal requirement)
  const rabiesVax = allData.vaccinations.find(v => 
    v.vaccine_name.toLowerCase().includes('rabies')
  );
  
  if (rabiesVax && rabiesVax.next_due_date) {
    const daysOverdue = Math.floor(
      (new Date().getTime() - new Date(rabiesVax.next_due_date).getTime()) 
      / (1000 * 60 * 60 * 24)
    );
    
    if (daysOverdue > 0) {
      alerts.push({
        severity: 'critical',
        type: 'vaccination_overdue',
        title: 'Rabies Vaccination Overdue',
        message: `Rabies vaccine is ${daysOverdue} days overdue. This is a legal requirement.`,
        action_required: 'Schedule vaccination immediately',
        priority: 1
      });
    }
  }
  
  // 2. Rapid Weight Change
  if (allData.weightHistory.length >= 2) {
    const latest = allData.weightHistory[0];
    const previous = allData.weightHistory[1];
    const daysBetween = Math.abs(
      (new Date(latest.date).getTime() - new Date(previous.date).getTime())
      / (1000 * 60 * 60 * 24)
    );
    
    const percentChange = Math.abs(
      (latest.weight - previous.weight) / previous.weight * 100
    );
    
    // >10% change in less than 30 days is concerning
    if (daysBetween < 30 && percentChange > 10) {
      alerts.push({
        severity: 'critical',
        type: 'rapid_weight_change',
        title: 'Rapid Weight Change Detected',
        message: `${percentChange.toFixed(1)}% ${latest.weight > previous.weight ? 'gain' : 'loss'} in ${Math.floor(daysBetween)} days`,
        action_required: 'Consult veterinarian immediately',
        priority: 2
      });
    }
  }
  
  // HIGH PRIORITY ALERTS
  
  // 3. Multiple Active Severe Allergies
  const severeAllergies = allData.allergies.filter(a => a.severity === 'severe');
  if (severeAllergies.length >= 2) {
    alerts.push({
      severity: 'high',
      type: 'multiple_severe_allergies',
      title: `${severeAllergies.length} Severe Allergies`,
      message: `Allergens: ${severeAllergies.map(a => a.allergen).join(', ')}`,
      action_required: 'Ensure emergency plan is in place',
      priority: 3
    });
  }
  
  // 4. No Vet Visit in >18 Months
  if (allData.medicalVisits?.length > 0) {
    const lastVisit = allData.medicalVisits.sort((a, b) => 
      new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
    )[0];
    
    const monthsSinceVisit = Math.abs(
      (new Date().getTime() - new Date(lastVisit.visit_date).getTime())
      / (1000 * 60 * 60 * 24 * 30)
    );
    
    if (monthsSinceVisit > 18) {
      alerts.push({
        severity: 'high',
        type: 'overdue_checkup',
        title: 'Annual Checkup Overdue',
        message: `Last vet visit was ${Math.floor(monthsSinceVisit)} months ago`,
        action_required: 'Schedule wellness exam',
        priority: 4
      });
    }
  }
  
  // MEDIUM PRIORITY ALERTS
  
  // 5. Low Vaccination Compliance
  if (scores.vaccination.score < 50) {
    alerts.push({
      severity: 'medium',
      type: 'low_vaccination_compliance',
      title: 'Vaccinations Behind Schedule',
      message: `${scores.vaccination.details.overdue} vaccine(s) overdue`,
      action_required: 'Review vaccination schedule',
      priority: 5
    });
  }
  
  // 6. Senior Pet Without Recent Checkup
  const ageYears = calculateAge(pet.date_of_birth);
  const seniorAge = getSeniorAge(pet.species, pet.size);
  
  if (ageYears >= seniorAge) {
    const lastCheckup = allData.medicalVisits?.find(v => 
      v.visit_type === 'checkup' || v.visit_type === 'wellness'
    );
    
    if (lastCheckup) {
      const monthsSinceCheckup = Math.abs(
        (new Date().getTime() - new Date(lastCheckup.visit_date).getTime())
        / (1000 * 60 * 60 * 24 * 30)
      );
      
      // Seniors should have bi-annual checkups
      if (monthsSinceCheckup > 6) {
        alerts.push({
          severity: 'medium',
          type: 'senior_checkup_due',
          title: 'Senior Pet Checkup Due',
          message: `Senior pets should have checkups every 6 months. Last checkup: ${Math.floor(monthsSinceCheckup)} months ago`,
          action_required: 'Schedule wellness exam',
          priority: 6
        });
      }
    }
  }
  
  // Sort by priority
  return alerts.sort((a, b) => a.priority - b.priority);
}
```

### Display Example
```
┌──────────────────────────────────────┐
│ 🚨 Health Alerts (3)                 │
├──────────────────────────────────────┤
│ CRITICAL                             │
│ Rabies Vaccination Overdue           │
│ 45 days overdue - Legal requirement  │
│ → [Schedule Now]                     │
├──────────────────────────────────────┤
│ HIGH                                 │
│ Annual Checkup Overdue               │
│ Last visit: 19 months ago            │
│ → [Book Appointment]                 │
├──────────────────────────────────────┤
│ MEDIUM                               │
│ Senior Pet Checkup Due               │
│ Bi-annual checkup recommended        │
│ → [Schedule Visit]                   │
└──────────────────────────────────────┘
```

---

## 8. SUMMARY DASHBOARD METRICS

### Implementable With Current Data

```typescript
interface PetHealthDashboard {
  // Quick Health Score
  quick_health_score: {
    score: number;                      // 0-100
    category: string;                   // excellent, good, fair, poor
    trend: 'improving' | 'stable' | 'declining';
  };
  
  // Key Metrics
  vaccination_status: {
    compliance: number;                 // 0-100
    overdue_count: number;
    next_due: { vaccine: string, date: Date };
  };
  
  weight_status: {
    current: number;
    ideal_range: {min: number, max: number};
    status: string;                     // ideal, overweight, underweight
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  
  preventive_care: {
    score: number;
    last_checkup: Date;
    days_until_next: number;
  };
  
  // Alerts
  critical_alerts: number;
  high_priority_alerts: number;
  total_active_alerts: number;
  
  // Data Quality
  profile_completeness: number;         // 0-100
  
  // Medical Summary
  active_conditions: number;
  active_medications: number;
  severe_allergies: number;
}
```

---

## IMPLEMENTATION PRIORITY

### Phase 1: Quick Wins (Week 1-2)
1. ✅ **Vaccination Compliance Score** - Simple, high value
2. ✅ **Data Completeness Score** - Encourages data entry
3. ✅ **Weight Status Indicator** - Visual, actionable

### Phase 2: Core Health Metrics (Week 3-4)
4. ✅ **Preventive Care Score** - Comprehensive
5. ✅ **Health Alerts System** - Critical for engagement
6. ✅ **Weight Management Score** - Detailed analysis

### Phase 3: Advanced Analytics (Week 5-6)
7. ✅ **Health Risk Assessment** - Predictive value
8. ✅ **Age-Adjusted Benchmarks** - Personalized guidance
9. ✅ **Trend Analysis & Predictions** - AI/ML ready

---

## CONCLUSION

With **current data**, Waggli can immediately implement:

✅ **8 Comprehensive Scores/Metrics**  
✅ **30+ Specific Health Indicators**  
✅ **Intelligent Alert System**  
✅ **Trend Analysis**  
✅ **Risk Assessment**  
✅ **Actionable Recommendations**

**No new data collection required** - all metrics calculable from existing database schema!

**Next Steps**:
1. Prioritize Phase 1 metrics (vaccination, weight, completeness)
2. Build calculation functions as Supabase Edge Functions
3. Create UI components for score display
4. Implement real-time alerts
5. Add trend visualizations

🐾 **Transform Data Into Insights. One Score at a Time.** 🐾
