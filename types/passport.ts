// Pet Passport TypeScript Interfaces and Types
// Complete type system for passport feature

import { z } from 'zod';

// ========================================
// ENUMS
// ========================================

export enum Species {
    DOG = 'dog',
    CAT = 'cat',
    BIRD = 'bird',
    RABBIT = 'rabbit',
    OTHER = 'other',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    UNKNOWN = 'unknown',
}

export enum PetStatus {
    ACTIVE = 'active',
    DECEASED = 'deceased',
    LOST = 'lost',
    TRANSFERRED = 'transferred',
}

export enum WeightTrend {
    INCREASING = 'increasing',
    STABLE = 'stable',
    DECREASING = 'decreasing',
}

export enum Size {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
}

export enum BCSCategory {
    SEVERELY_UNDERWEIGHT = 'severely_underweight',
    UNDERWEIGHT = 'underweight',
    IDEAL = 'ideal',
    OVERWEIGHT = 'overweight',
    OBESE = 'obese',
}

export enum HealthCategory {
    EXCELLENT = 'excellent',   // 90-100
    GOOD = 'good',             // 75-89
    FAIR = 'fair',             // 60-74
    POOR = 'poor',             // 40-59
    CRITICAL = 'critical',     // 0-39
}

export enum RiskLevel {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export enum Priority {
    URGENT = 'urgent',   // Within 1 week
    HIGH = 'high',       // Within 1 month
    MEDIUM = 'medium',   // Within 3 months
    LOW = 'low',         // Within 6-12 months
}

export enum RecommendationType {
    PREVENTIVE = 'preventive',
    VACCINATION = 'vaccination',
    TREATMENT = 'treatment',
    DIET = 'diet',
    LIFESTYLE = 'lifestyle',
    OTHER = 'other',
}

export enum VaccineCategory {
    CORE = 'core',
    NON_CORE = 'non-core',
}

export enum AdministrationRoute {
    SUBCUTANEOUS = 'subcutaneous',
    INTRAMUSCULAR = 'intramuscular',
    INTRANASAL = 'intranasal',
    ORAL = 'oral',
}

export enum TreatmentCategory {
    PREVENTIVE = 'preventive',
    ACUTE = 'acute',
    CHRONIC = 'chronic',
}

export enum AllergySeverity {
    MILD = 'mild',
    MODERATE = 'moderate',
    SEVERE = 'severe',
}

export enum AllergyType {
    FOOD = 'food',
    ENVIRONMENT = 'environment',
    MEDICATION = 'medication',
}

export enum EmergencyContactType {
    OWNER = 'owner',
    ALTERNATE = 'alternate',
    VETERINARIAN = 'veterinarian',
    EMERGENCY_VET = 'emergency_vet',
}

// ========================================
// CORE PASSPORT INTERFACE
// ========================================

export interface PetPassport {
    // Passport Metadata
    passportId: string;
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
    conditions: MedicalCondition[];

    // Important Information
    allergies: Allergy[];
    behavioralNotes: string[];
    specialCare: string[];

    // Emergency
    emergencyContacts: EmergencyContact[];
}

// ========================================
// PET IDENTIFICATION
// ========================================

export interface PetIdentification {
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
    ownerId?: string;
}

// ========================================
// PHYSICAL CHARACTERISTICS
// ========================================

export interface PhysicalCharacteristics {
    // Measurements
    weight: WeightData;
    size: Size;
    bodyConditionScore?: BodyConditionScore;

    // Appearance
    color: string;
    coatType?: string;
    eyeColor?: string;
    tailLength?: string;
    furDescription?: string;
    distinguishingMarks?: string;

    // Ideal Ranges
    idealWeightMin?: number;
    idealWeightMax?: number;

    // History
    weightHistory: WeightEntry[];
}

export interface WeightData {
    currentKg: number;
    currentLbs: number;
    lastMeasuredDate: Date;
    trend: WeightTrend;
}

export interface BodyConditionScore {
    score: number; // 1-9
    scaleType: '5-point' | '9-point';
    assessedDate: Date;
    assessedBy?: string;
    category: BCSCategory;
    ribsPalpable?: boolean;
    waistVisible?: boolean;
    abdominalTuck?: boolean;
    notes?: string;
}

export interface WeightEntry {
    id: string;
    weight: number; // in kg
    date: Date;
    notes?: string;
}

// ========================================
// HEALTH DASHBOARD
// ========================================

export interface HealthDashboard {
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

export interface HealthScore {
    score: number; // 0-100
    category: HealthCategory;
}

export interface ComponentScore {
    score: number; // 0-100
    category: HealthCategory;
    label: string;
}

export interface HealthRisk {
    id: string;
    riskType: string;
    riskLevel: RiskLevel;
    riskScore: number; // 0-100
    description: string;
    mitigation: string;
    contributingFactors?: string[];
    status: 'active' | 'monitoring' | 'resolved';
    firstIdentified?: Date;
    lastAssessed?: Date;
}

export interface HealthRecommendation {
    id: string;
    recommendationType: string;
    priority: Priority;
    title: string;
    description: string;
    actionItems: string[];
    actionButtonText?: string;
    expectedBenefit?: string;
    estimatedCostMin?: number;
    estimatedCostMax?: number;
    currency?: string;
    dueDate?: Date;
    completed: boolean;
    completedDate?: Date;
    dismissed: boolean;
}

// ========================================
// VACCINATION
// ========================================

export interface Vaccination {
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

export interface VaccinationStatus {
    isCurrent: boolean;
    isOverdue: boolean;
    daysUntilDue?: number;
    daysOverdue?: number;
}

export interface VaccinationCompliance {
    compliancePercentage: number;
    totalVaccinations: number;
    currentVaccinations: number;
    overdueCount: number;
    dueSoonCount: number;
}

// ========================================
// TREATMENT & MEDICATION
// ========================================

export interface Treatment {
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

// ========================================
// MEDICAL HISTORY
// ========================================

export enum MedicalEventType {
    CHECKUP = 'checkup',
    EMERGENCY = 'emergency',
    SURGERY = 'surgery',
    INCIDENT = 'incident',
    VACCINATION = 'vaccination',
    LAB_TEST = 'lab_test',
    HOSPITALIZATION = 'hospitalization',
}

export enum EventStatus {
    COMPLETED = 'completed',
    ONGOING = 'ongoing',
    SCHEDULED = 'scheduled',
    CANCELLED = 'cancelled',
}

export interface MedicalEvent {
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

export interface MedicalVisit extends MedicalEvent {
    visitType: 'checkup' | 'emergency' | 'follow_up';
    diagnosis?: string;
    treatmentProvided?: string;
    followUpRequired: boolean;
    followUpDate?: Date;
}

export interface Surgery extends MedicalEvent {
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

// ========================================
// ALLERGIES
// ========================================

export interface Allergy {
    id: string;
    type: AllergyType;
    allergen: string;
    reactionDescription: string;
    severity: AllergySeverity;
    notes?: string;
}

export interface MedicalCondition {
    id: string;
    petId: string;
    conditionName: string;
    diagnosedDate?: Date;
    status: 'Active' | 'Chronic' | 'Resolved' | 'Watch';
    notes?: string;
}

// ========================================
// EMERGENCY INFORMATION
// ========================================

export interface EmergencyContact {
    id: string;
    contactType: EmergencyContactType;
    name: string;
    relationship?: string;
    phone: string;
    email?: string;
    address?: string;
    isPrimary: boolean;
}

export interface CriticalMedicalAlert {
    type: 'allergy' | 'medication' | 'condition' | 'anesthesia';
    message: string;
    severity: 'critical' | 'high' | 'medium';
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface GetPassportResponse {
    success: boolean;
    data?: PetPassport;
    error?: string;
}

export interface MutationResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}

export interface CalculateHealthScoreResponse {
    success: boolean;
    data?: {
        overallScore: number;
        scoreCategory: HealthCategory;
        preventiveCareScore: number;
        vaccinationScore: number;
        weightManagementScore: number;
        dataCompleteness: number;
    };
    error?: string;
}

// ========================================
// FORM INPUT TYPES
// ========================================

export interface VaccinationFormData {
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
    certificateNumber?: string;
    requiredForTravel?: boolean;
    notes?: string;
}

export interface TreatmentFormData {
    treatmentName: string;
    category: TreatmentCategory;
    startDate: Date;
    endDate?: Date;
    dosage: string;
    frequency: string;
    timeOfDay?: string;
    prescribedBy?: string;
    pharmacy?: string;
    withFood?: boolean;
    notes?: string;
}

export interface BCSFormData {
    score: number; // 1-9
    assessedDate: Date;
    assessedBy?: string;
    ribsPalpable?: boolean;
    waistVisible?: boolean;
    abdominalTuck?: boolean;
    notes?: string;
}

export interface AllergyFormData {
    type: AllergyType;
    allergen: string;
    reactionDescription: string;
    severity: AllergySeverity;
    notes?: string;
}

export interface EmergencyContactFormData {
    contactType: EmergencyContactType;
    name: string;
    relationship?: string;
    phone: string;
    email?: string;
    address?: string;
    isPrimary: boolean;
}

// ========================================
// HOOK RETURN TYPES
// ========================================

export interface UsePassportReturn {
    passport: PetPassport | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export interface UseHealthScoreReturn {
    healthScore: HealthDashboard | null;
    loading: boolean;
    error: Error | null;
    recalculate: () => Promise<void>;
}

export interface UseVaccinationsReturn {
    vaccinations: Vaccination[];
    compliance: VaccinationCompliance;
    loading: boolean;
    error: Error | null;
    addVaccination: (data: VaccinationFormData) => Promise<void>;
    updateVaccination: (id: string, data: Partial<VaccinationFormData>) => Promise<void>;
    deleteVaccination: (id: string) => Promise<void>;
}

export interface UseTreatmentsReturn {
    treatments: Treatment[];
    activeTreatments: Treatment[];
    loading: boolean;
    error: Error | null;
    addTreatment: (data: TreatmentFormData) => Promise<void>;
    updateTreatment: (id: string, data: Partial<TreatmentFormData>) => Promise<void>;
    deleteTreatment: (id: string) => Promise<void>;
}

// ========================================
// VALIDATION SCHEMAS (Zod)
// ========================================

export const VaccinationSchema = z.object({
    vaccineName: z.string().min(1, 'Vaccine name is required'),
    category: z.enum(['core', 'non-core']),
    dateGiven: z.date(),
    nextDueDate: z.date().optional(),
    doseNumber: z.number().int().positive().optional(),
    administeringVet: z.string().optional(),
    clinic: z.string().optional(),
    manufacturer: z.string().optional(),
    lotNumber: z.string().optional(),
    route: z.enum(['subcutaneous', 'intramuscular', 'intranasal', 'oral']).optional(),
    certificateNumber: z.string().optional(),
    requiredForTravel: z.boolean().optional(),
    notes: z.string().optional(),
});

export const TreatmentSchema = z.object({
    treatmentName: z.string().min(1, 'Treatment name is required'),
    category: z.enum(['preventive', 'acute', 'chronic']),
    startDate: z.date(),
    endDate: z.date().optional(),
    dosage: z.string().min(1, 'Dosage is required'),
    frequency: z.string().min(1, 'Frequency is required'),
    timeOfDay: z.string().optional(),
    prescribedBy: z.string().optional(),
    pharmacy: z.string().optional(),
    withFood: z.boolean().optional(),
    notes: z.string().optional(),
});

export const BCSSchema = z.object({
    score: z.number().int().min(1).max(9),
    assessedDate: z.date(),
    assessedBy: z.string().optional(),
    ribsPalpable: z.boolean().optional(),
    waistVisible: z.boolean().optional(),
    abdominalTuck: z.boolean().optional(),
    notes: z.string().optional(),
});

export const AllergySchema = z.object({
    type: z.enum(['food', 'environment', 'medication']),
    allergen: z.string().min(1, 'Allergen is required'),
    reactionDescription: z.string().optional(),
    severity: z.enum(['mild', 'moderate', 'severe']),
    notes: z.string().optional(),
});

export const ConditionSchema = z.object({
    conditionName: z.string().min(1, 'Condition name is required'),
    diagnosedDate: z.date().optional(),
    status: z.enum(['Active', 'Chronic', 'Resolved', 'Watch']),
    notes: z.string().optional(),
});

export type ConditionFormData = z.infer<typeof ConditionSchema>;

export const HealthRecordSchema = z.object({
    date: z.date(),
    weight: z.number().positive().optional(),
    weightUnit: z.enum(['kg', 'lb']).default('kg'),
    temperature: z.number().optional(),
    temperatureUnit: z.enum(['C', 'F']).default('C'),
    heartRate: z.number().int().positive().optional(),
    respiratoryRate: z.number().int().positive().optional(),
    bodyConditionScore: z.number().int().min(1).max(9).optional(),
    activityLevel: z.string().optional(),
    energyLevel: z.string().optional(),
    appetiteLevel: z.string().optional(),
    coatCondition: z.string().optional(),
    stoolQuality: z.string().optional(),
    notes: z.string().optional(),
});

export type HealthRecordFormData = z.infer<typeof HealthRecordSchema>;

export const EmergencyContactSchema = z.object({
    contactType: z.enum(['owner', 'alternate', 'veterinarian', 'emergency_vet']),
    name: z.string().min(1, 'Name is required'),
    relationship: z.string().optional(),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email').optional(),
    address: z.string().optional(),
    isPrimary: z.boolean().default(false),
});

// ========================================
// TYPE GUARDS
// ========================================

export function isVaccination(event: any): event is Vaccination {
    return event.eventType === MedicalEventType.VACCINATION && event.vaccineName;
}

export function isSurgery(event: any): event is Surgery {
    return event.eventType === MedicalEventType.SURGERY && event.surgeryType;
}

export function isCriticalRisk(risk: HealthRisk): boolean {
    return risk.riskLevel === RiskLevel.CRITICAL || risk.riskLevel === RiskLevel.HIGH;
}

export function isOverdue(vaccination: Vaccination): boolean {
    if (!vaccination.nextDueDate) return false;
    return new Date(vaccination.nextDueDate) < new Date();
}

export function isDueSoon(vaccination: Vaccination, daysThreshold: number = 30): boolean {
    if (!vaccination.nextDueDate) return false;
    const daysDiff = Math.ceil((new Date(vaccination.nextDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 0 && daysDiff <= daysThreshold;
}

// ========================================
// CONSTANTS
// ========================================

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

// Health score color mapping
export const HEALTH_SCORE_COLORS = {
    excellent: '#22c55e',  // Green
    good: '#14b8a6',       // Teal
    fair: '#f97316',       // Orange
    poor: '#ef4444',       // Red
    critical: '#dc2626',   // Dark Red
} as const;

// Risk level color mapping
export const RISK_LEVEL_COLORS = {
    low: '#22c55e',        // Green
    medium: '#f97316',     // Orange
    high: '#ef4444',       // Red
    critical: '#dc2626',   // Dark Red
} as const;

// Priority color mapping
export const PRIORITY_COLORS = {
    urgent: '#ef4444',     // Red
    high: '#f97316',       // Orange
    medium: '#eab308',     // Yellow
    low: '#3b82f6',        // Blue
} as const;
export interface WeightRecord {
    id: string;
    petId: string;
    weight: number;
    unit: 'kg' | 'lbs';
    date: string;
    notes?: string;
    createdAt?: string;
}
