# Pet Passport Tab - Data Models & TypeScript Interfaces

**Document Version:** 1.0  
**Created:** January 10, 2026  
**Purpose:** Complete TypeScript type definitions and data models

---

## CORE PET PASSPORT INTERFACE

```typescript
interface PetPassport {
  // Passport Metadata
  passportId: string; // e.g., "PP-12345678"
  generatedAt: Date;
  lastUpdated: Date;
  
  // Pet Identification
  identification: PetIdentification;
  
  // Physical Characteristics
  physical: PhysicalCharacteristics;
  
  // Health Dashboard
  health: HealthDashboard;
  
  // Medical Records
  vaccinations: Vaccination[];
  treatments: Treatment[];
  medicalHistory: MedicalEvent[];
  
  // Important Information
  allergies: Allergy[];
  behavioralNotes: string[];
  specialCare: string[];
  
  // Emergency
  emergencyContacts: EmergencyContact[];
  
  // Travel
  travelReadiness: TravelReadiness;
}
```

---

## PET IDENTIFICATION

```typescript
interface PetIdentification {
  // Basic Info
  name: string;
  species: Species;
  breed: string;
  breedSecondary?: string;
  gender: Gender;
  dateOfBirth: Date;
  ageYears: number;
  ageMonths?: number;
  
  // Reproductive
  isSpayedNeutered: boolean;
  spayedNeuteredDate?: Date;
  
  // Official IDs
  microchipNumber?: string;
  microchipDate?: Date;
  registrationId?: string;
  tattooId?: string;
  
  // Status
  petStatus: PetStatus;
  
  // Photo
  photoUrl?: string;
}

enum Species {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  RABBIT = 'rabbit',
  OTHER = 'other',
}

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

enum PetStatus {
  ACTIVE = 'active',
  DECEASED = 'deceased',
  LOST = 'lost',
  TRANSFERRED = 'transferred',
}
```

---

## PHYSICAL CHARACTERISTICS

```typescript
interface PhysicalCharacteristics {
  // Measurements
  weight: WeightData;
  size: Size;
  bodyConditionScore: BodyConditionScore;
  
  // Appearance
  color: string;
  coatType?: string;
  eyeColor?: string;
  distinguishingMarks?: string;
  
  // Ideal Ranges
  idealWeightMin?: number;
  idealWeightMax?: number;
  
  // History
  weightHistory: WeightEntry[];
}

interface WeightData {
  currentKg: number;
  currentLbs: number;
  lastMeasuredDate: Date;
  trend: WeightTrend;
}

enum WeightTrend {
  INCREASING = 'increasing',
  STABLE = 'stable',
  DECREASING = 'decreasing',
}

enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

interface BodyConditionScore {
  score: number; // 1-9
  scaleType: '5-point' | '9-point';
  assessedDate: Date;
  assessedBy?: string;
  category: BCSCategory;
}

enum BCSCategory {
  SEVERELY_UNDERWEIGHT = 'severely_underweight',
  UNDERWEIGHT = 'underweight',
  IDEAL = 'ideal',
  OVERWEIGHT = 'overweight',
  OBESE = 'obese',
}

interface WeightEntry {
  weight: number; // in kg
  date: Date;
  notes?: string;
}
```

---

## HEALTH DASHBOARD

```typescript
interface HealthDashboard {
  // Overall Score
  overallScore: HealthScore;
  
  // Component Scores
  preventiveCareScore: ComponentScore;
  vaccinationScore: ComponentScore;
  weightManagementScore: ComponentScore;
  
  // Risks & Recommendations
  healthRisks: HealthRisk[];
  recommendations: HealthRecommendation[];
  
  // Metadata
  dataCompleteness: number; // 0-100
  lastCalculated: Date;
}

interface HealthScore {
  score: number; // 0-100
  category: HealthCategory;
}

enum HealthCategory {
  EXCELLENT = 'excellent',   // 90-100
  GOOD = 'good',             // 75-89
  FAIR = 'fair',             // 60-74
  POOR = 'poor',             // 40-59
  CRITICAL = 'critical',     // 0-39
}

interface ComponentScore {
  score: number; // 0-100
  category: HealthCategory;
  label: string;
}

interface HealthRisk {
  riskType: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  description: string;
  mitigation: string;
  status: 'active' | 'monitoring' | 'resolved';
}

enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

interface HealthRecommendation {
  recommendationType: string;
  priority: Priority;
  title: string;
  description: string;
  actionItems: string[];
  actionButtonText?: string;
  dueDate?: Date;
  completed: boolean;
}

enum Priority {
  URGENT = 'urgent',   // Within 1 week
  HIGH = 'high',       // Within 1 month
  MEDIUM = 'medium',   // Within 3 months
  LOW = 'low',         // Within 6-12 months
}
```

---

## VACCINATION

```typescript
interface Vaccination {
  id: string;
  vaccineName: string;
  category: VaccineCategory;
  dateGiven: Date;
  nextDueDate?: Date;
  doseNumber?: number;
  administeringVet?: string;
  clinic?: string;
  manufacturer?: string;
  lotNumber?: string;
  route?: AdministrationRoute;
  injectionSite?: string;
  certificateNumber?: string;
  requiredForTravel: boolean;
  notes?: string;
  status: VaccinationStatus;
}

enum VaccineCategory {
  CORE = 'core',
  NON_CORE = 'non-core',
}

enum AdministrationRoute {
  SUBCUTANEOUS = 'subcutaneous',
  INTRAMUSCULAR = 'intramuscular',
  INTRANASAL = 'intranasal',
  ORAL = 'oral',
}

interface VaccinationStatus {
  isCurrent: boolean;
  isOverdue: boolean;
  daysUntilDue?: number;
  daysOverdue?: number;
}
```

---

## TREATMENT & MEDICATION

```typescript
interface Treatment {
  id: string;
  treatmentName: string;
  category: TreatmentCategory;
  startDate: Date;
  endDate?: Date;
  dosage: string;
  frequency: string;
  timeOfDay?: string;
  vet?: string;
  prescribedBy?: string;
  prescriptionNumber?: string;
  pharmacy?: string;
  refillsRemaining?: number;
  isActive: boolean;
  withFood?: boolean;
  sideEffects?: string[];
  specialInstructions?: string;
  notes?: string;
}

enum TreatmentCategory {
  PREVENTIVE = 'preventive',
  ACUTE = 'acute',
  CHRONIC = 'chronic',
}
```

---

## MEDICAL HISTORY

```typescript
interface MedicalEvent {
  id: string;
  eventType: MedicalEventType;
  eventDate: Date;
  title: string;
  description: string;
  veterinarian?: string;
  clinic?: string;
  cost?: number;
  notes?: string;
  status: EventStatus;
}

enum MedicalEventType {
  CHECKUP = 'checkup',
  EMERGENCY = 'emergency',
  SURGERY = 'surgery',
  INCIDENT = 'incident',
  VACCINATION = 'vaccination',
  LAB_TEST = 'lab_test',
  HOSPITALIZATION = 'hospitalization',
}

enum EventStatus {
  COMPLETED = 'completed',
  ONGOING = 'ongoing',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
}

interface MedicalVisit extends MedicalEvent {
  visitType: 'checkup' | 'emergency' | 'follow_up';
  diagnosis?: string;
  treatmentProvided?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
}

interface Surgery extends MedicalEvent {
  surgeryType: 'elective' | 'emergency' | 'diagnostic' | 'therapeutic';
  surgeon?: string;
  anesthesiaType?: string;
  durationMinutes?: number;
  outcome?: string;
  complications?: string[];
  recoveryPeriodDays?: number;
  preOpNotes?: string;
  postOpNotes?: string;
}
```

---

## ALLERGIES

```typescript
interface Allergy {
  id: string;
  type: AllergyType;
  allergen: string;
  reactionDescription: string;
  severity: AllergySeverity;
  notes?: string;
}

enum AllergyType {
  FOOD = 'food',
  ENVIRONMENT = 'environment',
  MEDICATION = 'medication',
}

enum AllergySeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
}
```

---

## EMERGENCY INFORMATION

```typescript
interface EmergencyContact {
  id: string;
  contactType: EmergencyContactType;
  name: string;
  relationship?: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
}

enum EmergencyContactType {
  OWNER = 'owner',
  ALTERNATE = 'alternate',
  VETERINARIAN = 'veterinarian',
  EMERGENCY_VET = 'emergency_vet',
}

interface CriticalMedicalAlert {
  type: 'allergy' | 'medication' | 'condition' | 'anesthesia';
  message: string;
  severity: 'critical' | 'high' | 'medium';
}
```

---

## TRAVEL READINESS

```typescript
interface TravelReadiness {
  status: TravelStatus;
  compliancePercentage: number; // 0-100
  destinationCountry?: string;
  travelDate?: Date;
  requirements: TravelRequirement[];
}

enum TravelStatus {
  READY = 'ready',
  PARTIALLY_READY = 'partially_ready',
  NOT_READY = 'not_ready',
}

interface TravelRequirement {
  requirementType: string;
  requirementName: string;
  isCompleted: boolean;
  dueDate?: Date;
  completedDate?: Date;
  notes?: string;
}
```

---

## API RESPONSE TYPES

### GET Passport
```typescript
interface GetPassportResponse {
  success: boolean;
  data: PetPassport;
  error?: string;
}
```

### POST/PUT Responses
```typescript
interface MutationResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}
```

### Health Score Calculation
```typescript
interface CalculateHealthScoreResponse {
  success: boolean;
  data: {
    overallScore: number;
    scoreCategory: HealthCategory;
    preventiveCareScore: number;
    vaccinationScore: number;
    weightManagementScore: number;
    dataCompleteness: number;
  };
}
```

---

## FORM INPUT TYPES

### Vaccination Form
```typescript
interface VaccinationFormData {
  vaccineName: string;
  category: VaccineCategory;
  dateGiven: Date;
  nextDueDate?: Date;
  doseNumber?: number;
  administeringVet?: string;
  clinic?: string;
  manufacturer?: string;
  lotNumber?: string;
  route?: AdministrationRoute;
  notes?: string;
}
```

### Treatment Form
```typescript
interface TreatmentFormData {
  treatmentName: string;
  category: TreatmentCategory;
  startDate: Date;
  endDate?: Date;
  dosage: string;
  frequency: string;
  timeOfDay?: string;
  vet?: string;
  notes?: string;
}
```

### BCS Form
```typescript
interface BCSFormData {
  score: number; // 1-9
  assessedDate: Date;
  assessedBy?: string;
  notes?: string;
}
```

---

## UTILITY TYPES

### Pagination
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

### Filter Options
```typescript
interface FilterOptions {
  species?: Species[];
  status?: VaccinationStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}
```

### Sort Options
```typescript
interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}
```

---

## HOOK RETURN TYPES

### usePassport Hook
```typescript
interface UsePassportReturn {
  passport: PetPassport | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

### useVaccinations Hook
```typescript
interface UseVaccinationsReturn {
  vaccinations: Vaccination[];
  loading: boolean;
  error: Error | null;
  addVaccination: (data: VaccinationFormData) => Promise<void>;
  updateVaccination: (id: string, data: Partial<VaccinationFormData>) => Promise<void>;
  deleteVaccination: (id: string) => Promise<void>;
}
```

### useHealthScore Hook
```typescript
interface UseHealthScoreReturn {
  healthScore: HealthDashboard | null;
  loading: boolean;
  error: Error | null;
  recalculate: () => Promise<void>;
}
```

---

## PDF EXPORT TYPES

```typescript
interface PDFExportOptions {
  includePhoto: boolean;
  includeVaccinations: boolean;
  includeTreatments: boolean;
  includeMedicalHistory: boolean;
  includeAllergies: boolean;
  includeQRCode: boolean;
  format: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
}

interface PDFGenerationResponse {
  success: boolean;
  pdfUrl?: string;
  error?: string;
}
```

---

## VALIDATION SCHEMAS (Zod)

```typescript
import { z } from 'zod';

export const VaccinationSchema = z.object({
  vaccineName: z.string().min(1, 'Vaccine name is required'),
  category: z.enum(['core', 'non-core']),
  dateGiven: z.date(),
  nextDueDate: z.date().optional(),
  doseNumber: z.number().int().positive().optional(),
  administeringVet: z.string().optional(),
  clinic: z.string().optional(),
  notes: z.string().optional(),
});

export const TreatmentSchema = z.object({
  treatmentName: z.string().min(1, 'Treatment name is required'),
  category: z.enum(['preventive', 'acute', 'chronic']),
  startDate: z.date(),
  endDate: z.date().optional(),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  notes: z.string().optional(),
});

export const BCSSchema = z.object({
  score: z.number().int().min(1).max(9),
  assessedDate: z.date(),
  assessedBy: z.string().optional(),
  notes: z.string().optional(),
});
```

---

## TYPE GUARDS

```typescript
export function isVaccination(event: MedicalEvent): event is Vaccination {
  return event.eventType === MedicalEventType.VACCINATION;
}

export function isSurgery(event: MedicalEvent): event is Surgery {
  return event.eventType === MedicalEventType.SURGERY;
}

export function isCriticalRisk(risk: HealthRisk): boolean {
  return risk.riskLevel === RiskLevel.CRITICAL || risk.riskLevel === RiskLevel.HIGH;
}

export function isOverdue(vaccination: Vaccination): boolean {
  if (!vaccination.nextDueDate) return false;
  return new Date(vaccination.nextDueDate) < new Date();
}
```

---

## CONSTANTS

```typescript
export const HEALTH_SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  FAIR: 60,
  POOR: 40,
} as const;

export const BCS_RANGES = {
  IDEAL: { min: 4, max: 5 },
  UNDERWEIGHT: { min: 1, max: 3 },
  OVERWEIGHT: { min: 6, max: 7 },
  OBESE: { min: 8, max: 9 },
} as const;

export const VACCINE_DUE_SOON_DAYS = 30;
export const VACCINE_OVERDUE_CRITICAL_DAYS = 90;
```
