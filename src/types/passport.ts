/**
 * Pet Passport TypeScript Types
 * Auto-generated from database schema
 * Last updated: 2026-01-10
 */

// ============================================================================
// ENUMS
// ============================================================================

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

export enum VaccineCategory {
    CORE = 'core',
    NON_CORE = 'non-core',
}

export enum TreatmentCategory {
    PREVENTIVE = 'preventive',
    ACUTE = 'acute',
    CHRONIC = 'chronic',
}

export enum HealthCategory {
    EXCELLENT = 'excellent',
    GOOD = 'good',
    FAIR = 'fair',
    POOR = 'poor',
    CRITICAL = 'critical',
}

export enum RiskLevel {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export enum Priority {
    URGENT = 'urgent',
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
}

export enum BCSCategory {
    SEVERELY_UNDERWEIGHT = 'severely_underweight',
    UNDERWEIGHT = 'underweight',
    IDEAL = 'ideal',
    OVERWEIGHT = 'overweight',
    OBESE = 'obese',
}

// ============================================================================
// DATABASE TABLES
// ============================================================================

export interface Pet {
    id: string;
    user_id: string;
    name: string;
    species: Species;
    breed: string | null;
    date_of_birth: Date | null;
    gender: Gender | null;
    weight: number | null;
    color: string | null;
    microchip_number: string | null;
    spayed_neutered: boolean | null;
    photo_url: string | null;

    // Passport fields
    passport_id: string | null;
    passport_generated_at: Date | null;
    passport_updated_at: Date | null;
    microchip_date: Date | null;
    pet_status: PetStatus;
    spayed_neutered_date: Date | null;
    tattoo_id: string | null;
    coat_type: string | null;
    eye_color: string | null;
    distinguishing_marks: string | null;
    ideal_weight_min: number | null;
    ideal_weight_max: number | null;

    created_at: Date;
    updated_at: Date;
}

export interface Vaccination {
    id: string;
    pet_id: string;
    vaccine_name: string;
    category: VaccineCategory;
    date_given: Date;
    next_due_date: Date | null;
    dose_number: number | null;
    administering_vet: string | null;
    notes: string | null;

    // Enhanced fields
    manufacturer: string | null;
    lot_number: string | null;
    clinic: string | null;
    route: string | null;
    injection_site: string | null;
    certificate_number: string | null;
    required_for_travel: boolean;

    created_at: Date;
    updated_at: Date;
}

export interface Treatment {
    id: string;
    pet_id: string;
    treatment_name: string;
    category: TreatmentCategory;
    start_date: Date;
    end_date: Date | null;
    dosage: string | null;
    frequency: string | null;
    time_of_day: string | null;
    vet: string | null;
    is_active: boolean;
    notes: string | null;

    // Enhanced fields
    prescribed_by: string | null;
    prescription_number: string | null;
    pharmacy: string | null;
    refills_remaining: number | null;
    side_effects: string[] | null;
    with_food: boolean | null;
    special_instructions: string | null;

    created_at: Date;
    updated_at: Date;
}

export interface BodyConditionScore {
    id: string;
    pet_id: string;
    score: number; // 1-9
    scale_type: string;
    assessed_date: Date;
    assessed_by: string | null;
    ribs_palpable: boolean | null;
    waist_visible: boolean | null;
    abdominal_tuck: boolean | null;
    category: string | null;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface HealthScore {
    id: string;
    pet_id: string;
    calculated_date: Date;
    overall_score: number; // 0-100
    score_category: HealthCategory;
    preventive_care_score: number;
    vaccination_score: number;
    weight_management_score: number;
    data_completeness_percentage: number;
    created_at: Date;
    updated_at: Date;
}

export interface HealthRisk {
    id: string;
    pet_id: string;
    risk_type: string;
    risk_level: RiskLevel;
    risk_score: number; // 0-100
    description: string;
    mitigation: string | null;
    contributing_factors: string[] | null;
    first_identified: Date | null;
    last_assessed: Date | null;
    status: 'active' | 'monitoring' | 'resolved';
    created_at: Date;
    updated_at: Date;
}

export interface HealthRecommendation {
    id: string;
    pet_id: string;
    recommendation_type: string;
    priority: Priority;
    title: string;
    description: string | null;
    action_items: string[] | null;
    action_button_text: string | null;
    expected_benefit: string | null;
    estimated_cost_min: number | null;
    estimated_cost_max: number | null;
    currency: string;
    due_date: Date | null;
    completed: boolean;
    completed_date: Date | null;
    dismissed: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface MedicalVisit {
    id: string;
    pet_id: string;
    visit_date: Date;
    visit_type: string | null;
    veterinarian: string | null;
    clinic: string | null;
    reason: string | null;
    diagnosis: string | null;
    treatment_provided: string | null;
    follow_up_required: boolean;
    follow_up_date: Date | null;
    cost: number | null;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface Surgery {
    id: string;
    pet_id: string;
    surgery_date: Date;
    surgery_type: string | null;
    surgery_name: string;
    surgeon: string | null;
    clinic: string | null;
    anesthesia_type: string | null;
    duration_minutes: number | null;
    reason: string;
    outcome: string | null;
    complications: string[] | null;
    recovery_period_days: number | null;
    cost: number | null;
    pre_op_notes: string | null;
    post_op_notes: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface EmergencyContact {
    id: string;
    pet_id: string;
    contact_type: string | null;
    name: string;
    relationship: string | null;
    phone: string;
    email: string | null;
    address: string | null;
    is_primary: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface TravelPlan {
    id: string;
    pet_id: string;
    destination_country: string;
    travel_date: Date | null;
    return_date: Date | null;
    compliance_percentage: number | null;
    status: 'ready' | 'partially_ready' | 'not_ready' | null;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface TravelRequirement {
    id: string;
    travel_plan_id: string;
    requirement_type: string | null;
    requirement_name: string;
    is_completed: boolean;
    due_date: Date | null;
    completed_date: Date | null;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface Allergy {
    id: string;
    pet_id: string;
    type: 'food' | 'environment' | 'medication';
    allergen: string;
    reaction_description: string | null;
    severity: 'mild' | 'moderate' | 'severe';
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface WeightEntry {
    id: string;
    pet_id: string;
    weight: number;
    unit: string;
    date: Date;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}

// ============================================================================
// COMPOSITE TYPES
// ============================================================================

export interface PetPassport {
    // Passport metadata
    passportId: string;
    generatedAt: Date;
    lastUpdated: Date;

    // Pet identification
    identification: PetIdentification;

    // Physical characteristics
    physical: PhysicalCharacteristics;

    // Health dashboard
    health: HealthDashboard;

    // Medical records
    vaccinations: Vaccination[];
    treatments: Treatment[];
    medicalHistory: MedicalEvent[];

    // Important information
    allergies: Allergy[];
    behavioralNotes: string[];
    specialCare: string[];

    // Emergency
    emergencyContacts: EmergencyContact[];

    // Travel
    travelReadiness: TravelReadiness | null;
}

export interface PetIdentification {
    name: string;
    species: Species;
    breed: string | null;
    breedSecondary?: string | null;
    gender: Gender | null;
    dateOfBirth: Date | null;
    ageYears: number;
    ageMonths?: number;
    isSpayedNeutered: boolean | null;
    spayedNeuteredDate?: Date | null;
    microchipNumber?: string | null;
    microchipDate?: Date | null;
    registrationId?: string | null;
    tattooId?: string | null;
    petStatus: PetStatus;
    photoUrl?: string | null;
}

export interface PhysicalCharacteristics {
    weight: WeightData;
    size: 'small' | 'medium' | 'large' | null;
    bodyConditionScore: BodyConditionScore | null;
    color: string | null;
    coatType?: string | null;
    eyeColor?: string | null;
    distinguishingMarks?: string | null;
    idealWeightMin?: number | null;
    idealWeightMax?: number | null;
    weightHistory: WeightEntry[];
}

export interface WeightData {
    currentKg: number;
    currentLbs: number;
    lastMeasuredDate: Date;
    trend: 'increasing' | 'stable' | 'decreasing';
}

export interface HealthDashboard {
    overallScore: HealthScoreData;
    preventiveCareScore: ComponentScore;
    vaccinationScore: ComponentScore;
    weightManagementScore: ComponentScore;
    healthRisks: HealthRisk[];
    recommendations: HealthRecommendation[];
    dataCompleteness: number;
    lastCalculated: Date;
}

export interface HealthScoreData {
    score: number; // 0-100
    category: HealthCategory;
}

export interface ComponentScore {
    score: number; // 0-100
    category: HealthCategory;
    label: string;
}

export interface MedicalEvent {
    id: string;
    eventType: 'checkup' | 'emergency' | 'surgery' | 'incident' | 'vaccination' | 'lab_test' | 'hospitalization';
    eventDate: Date;
    title: string;
    description: string;
    veterinarian?: string;
    clinic?: string;
    cost?: number;
    notes?: string;
    status: 'completed' | 'ongoing' | 'scheduled' | 'cancelled';
}

export interface TravelReadiness {
    status: 'ready' | 'partially_ready' | 'not_ready';
    compliancePercentage: number; // 0-100
    destinationCountry?: string;
    travelDate?: Date;
    requirements: TravelRequirement[];
}

export interface VaccinationStatus {
    isCurrent: boolean;
    isOverdue: boolean;
    daysUntilDue?: number;
    daysOverdue?: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface GetPassportResponse {
    success: boolean;
    data: PetPassport | null;
    error?: string;
}

export interface MutationResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface CalculateHealthScoreResponse {
    success: boolean;
    data: {
        overall_score: number;
        score_category: HealthCategory;
        preventive_care: number;
        vaccination: number;
        weight_management: number;
        data_completeness: number;
    } | null;
    error?: string;
}

export interface VaccinationComplianceResponse {
    total_vaccines: number;
    current_vaccines: number;
    overdue_vaccines: number;
    due_soon_vaccines: number;
    compliance_percentage: number;
}

// ============================================================================
// FORM TYPES
// ============================================================================

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
    route?: string;
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
    vet?: string;
    notes?: string;
}

export interface BCSFormData {
    score: number; // 1-9
    assessedDate: Date;
    assessedBy?: string;
    notes?: string;
}

export interface MedicalVisitFormData {
    visitDate: Date;
    visitType?: string;
    veterinarian?: string;
    clinic?: string;
    reason?: string;
    diagnosis?: string;
    treatmentProvided?: string;
    cost?: number;
    notes?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

export interface FilterOptions {
    species?: Species[];
    status?: VaccinationStatus[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    searchQuery?: string;
}

export interface SortOptions {
    field: string;
    direction: 'asc' | 'desc';
}

//============================================================================
// PDF EXPORT TYPES
// ============================================================================

export interface PDFExportOptions {
    includePhoto: boolean;
    includeVaccinations: boolean;
    includeTreatments: boolean;
    includeMedicalHistory: boolean;
    includeAllergies: boolean;
    includeQRCode: boolean;
    format: 'A4' | 'Letter';
    orientation: 'portrait' | 'landscape';
}

export interface PDFGenerationResponse {
    success: boolean;
    pdfUrl?: string;
    error?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

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
