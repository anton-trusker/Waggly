# Comprehensive Pet Passport Data Specification

**Document Version**: 1.0  
**Created**: January 3, 2026  
**Purpose**: Complete data structure for digital pet passports with health analytics  
**Use Case**: Health partner integrations, insurance providers, veterinary analytics, research

---

## 📊 EXECUTIVE SUMMARY

This document defines the complete data specification for Pawzly's Digital Pet Passport, including all pet details, health metrics, scoring systems, medical records, and analytics aggregation formats. This specification is designed for:

- **Health Partner Integrations**: Insurance companies, veterinary networks
- **Analytics & Research**: Population health studies, breed analytics
- **AI/ML Applications**: Health prediction, risk assessment
- **Regulatory Compliance**: International pet travel requirements

**Key Components**:
1. **Core Pet Demographics** - Basic identification and ownership
2. **Physical Characteristics** - Measurements, appearance, breed-specific traits
3. **Health Metrics & Scoring** - BCS, BFI, health scores, risk assessments
4. **Medical Records** - Complete health history structure
5. **Behavioral Data** - Temperament, training, socialization
6. **Vaccination Schedules** - Protocol tracking and compliance
7. **Analytics Aggregation** - Partner data exchange formats

---

## 1. CORE PET DEMOGRAPHICS

### 1.1 Basic Identification

```typescript
interface PetIdentification {
  // Primary Identifiers
  pet_id: string;                    // UUID, unique system ID
  name: string;                      // Pet's name
  microchip_number?: string;         // 15-digit ISO microchip (11784/11785)
  microchip_date?: Date;             // Implantation date
  microchip_location?: string;       // Body location (e.g., "left shoulder")
  tattoo_id?: string;                // Alternative identification
  registration_number?: string;      // Kennel club/breed registry
  
  // Species & Breed
  species: SpeciesType;              // Dog, Cat, Bird, Rabbit, etc.
  breed: string;                     // Primary breed
  breed_secondary?: string;          // For mixed breeds
  breed_percentage?: number;         // % of primary breed (for mixes)
  purebred: boolean;                 // True if purebred
  breed_registry?: string;           // AKC, CFA, etc.
  breed_standards_met?: boolean;     // Meets breed standards
  
  // Basic Demographics
  date_of_birth?: Date;              // Exact or estimated
  birth_date_estimated: boolean;     // True if DOB is estimated
  age_years?: number;                // Calculated age
  age_months?: number;               // Age in months (for young pets)
  sex: SexType;                      // Male, Female
  reproductive_status: ReproductiveStatus; // Intact, Neutered, Spayed
  reproductive_status_date?: Date;   // Date of neutering/spaying
  reproductive_status_age?: number;  // Age at time of procedure
  
  // Origin
  acquisition_date?: Date;           // When owner acquired pet
  acquisition_type?: AcquisitionType; // Breeder, Rescue, Shelter, Found, etc.
  acquisition_location?: string;     // City/Country
  breeder_name?: string;             // If from breeder
  shelter_name?: string;             // If from shelter
  previous_owner_count?: number;     // Number of previous owners
  
  // Status
  status: PetStatus;                 // Active, Deceased, Transferred, Lost
  deceased_date?: Date;              // Date of death
  deceased_cause?: string;           // Cause of death
  lost_date?: Date;                  // Date reported lost
  found_date?: Date;                 // Date found (if was lost)
}

enum SpeciesType {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  RABBIT = 'rabbit',
  FERRET = 'ferret',
  GUINEA_PIG = 'guinea_pig',
  HAMSTER = 'hamster',
  REPTILE = 'reptile',
  FISH = 'fish',
  HORSE = 'horse',
  OTHER = 'other'
}

enum SexType {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown'
}

enum ReproductiveStatus {
  INTACT = 'intact',
  NEUTERED = 'neutered',      // Male castration
  SPAYED = 'spayed',          // Female sterilization
  UNKNOWN = 'unknown'
}

enum AcquisitionType {
  BREEDER = 'breeder',
  RESCUE = 'rescue',
  SHELTER = 'shelter',
  FOUND = 'found',
  GIFT = 'gift',
  INHERITED = 'inherited',
  BORN_TO_OWNED_PET = 'born_to_owned',
  OTHER = 'other'
}

enum PetStatus {
  ACTIVE = 'active',
  DECEASED = 'deceased',
  TRANSFERRED = 'transferred',  // Ownership transferred
  LOST = 'lost',
  STOLEN = 'stolen'
}
```

---

## 2. PHYSICAL CHARACTERISTICS

### 2.1 Measurements & Morphology

```typescript
interface PhysicalCharacteristics {
  // Weight Tracking
  weight_current: WeightRecord;
  weight_history: WeightRecord[];
  weight_ideal_min?: number;        // kg - breed-specific ideal range
  weight_ideal_max?: number;        // kg
  weight_birth?: number;            // kg - birth weight if known
  
  // Body Measurements
  height_shoulder?: number;         // cm - height at withers (dogs/horses)
  length_nose_tail?: number;        // cm - total body length
  chest_girth?: number;             // cm - chest circumference
  neck_girth?: number;              // cm
  
  // Body Condition Scoring
  body_condition_score: BodyConditionScore; // Current BCS
  body_condition_history: BodyConditionScore[];
  body_fat_index?: number;          // % - estimated body fat
  muscle_condition_score?: MuscleConditionScore;
  
  // Appearance
  color_primary: string;            // Primary coat/fur/feather color
  color_secondary?: string;         // Secondary color
  color_pattern?: ColorPattern;     // Solid, Tabby, Spotted, etc.
  coat_type?: CoatType;             // Short, Long, Wire, Curly, etc.
  coat_texture?: string;            // Soft, Coarse, Silky, etc.
  eye_color?: string;               // Eye color
  distinctive_markings?: string[];  // Unique marks, scars, patches
  
  // Dental
  dental_formula?: string;          // Adult dental formula
  missing_teeth?: number[];         // Tooth numbers missing
  dental_condition?: DentalCondition;
  
  // Other Physical Traits
  tail_type?: TailType;             // Docked, Natural, Bobbed
  ear_type?: EarType;               // Cropped, Natural, Floppy, Erect
  claw_status?: ClawStatus;         // Declawed, Intact
}

interface WeightRecord {
  weight_kg: number;
  weight_lbs: number;
  measured_date: Date;
  measured_by?: string;             // Vet, Owner, Clinic
  measurement_method?: string;      // Scale type, condition
  body_condition_at_time?: number;  // BCS when measured
  is_pregnant?: boolean;            // If female and pregnant
  is_post_surgery?: boolean;        // Recent surgery affecting weight
}

interface BodyConditionScore {
  score: number;                    // 1-9 scale (9-point system)
  scale_type: BCSScaleType;         // 5-point or 9-point
  assessed_date: Date;
  assessed_by?: string;             // Veterinarian, Trained staff
  assessment_method?: string;       // Visual, Palpation, Both
  ribs_palpable: boolean;
  waist_visible: boolean;
  abdominal_tuck: boolean;
  category: BCSCategory;            // Underweight, Ideal, Overweight, Obese
  notes?: string;
}

enum BCSScaleType {
  FIVE_POINT = '5-point',          // 1-5 scale
  NINE_POINT = '9-point'           // 1-9 scale (most common)
}

enum BCSCategory {
  SEVERELY_UNDERWEIGHT = 'severely_underweight',  // BCS 1
  UNDERWEIGHT = 'underweight',                    // BCS 2-3
  IDEAL = 'ideal',                                // BCS 4-5
  OVERWEIGHT = 'overweight',                      // BCS 6-7
  OBESE = 'obese'                                 // BCS 8-9
}

interface MuscleConditionScore {
  score: number;                    // 0-3 scale
  assessed_date: Date;
  muscle_mass: MuscleMassCategory;
  muscle_tone: MuscleTone;
}

enum MuscleMassCategory {
  SEVERE_LOSS = 'severe_loss',      // MCS 0
  MODERATE_LOSS = 'moderate_loss',  // MCS 1
  MILD_LOSS = 'mild_loss',          // MCS 2
  NORMAL = 'normal'                 // MCS 3
}

enum MuscleTone {
  POOR = 'poor',
  FAIR = 'fair',
  GOOD = 'good',
  EXCELLENT = 'excellent'
}

enum ColorPattern {
  SOLID = 'solid',
  BICOLOR = 'bicolor',
  TRICOLOR = 'tricolor',
  TABBY = 'tabby',
  SPOTTED = 'spotted',
  BRINDLE = 'brindle',
  MERLE = 'merle',
  POINTED = 'pointed',
  TUXEDO = 'tuxedo',
  CALICO = 'calico',
  TORTOISESHELL = 'tortoiseshell'
}

enum CoatType {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
  WIRE = 'wire',
  CURLY = 'curly',
  HAIRLESS = 'hairless',
  DOUBLE_COAT = 'double_coat'
}

interface DentalCondition {
  last_cleaning_date?: Date;
  plaque_score?: number;            // 0-4 scale
  gingivitis_score?: number;        // 0-4 scale
  periodontal_disease?: boolean;
  broken_teeth?: number[];
  notes?: string;
}

enum TailType {
  NATURAL_FULL = 'natural_full',
  NATURAL_BOBBED = 'natural_bobbed',
  DOCKED = 'docked',
  AMPUTATED = 'amputated'
}

enum EarType {
  NATURAL_ERECT = 'natural_erect',
  NATURAL_FLOPPY = 'natural_floppy',
  NATURAL_SEMI_ERECT = 'natural_semi_erect',
  CROPPED = 'cropped'
}

enum ClawStatus {
  INTACT = 'intact',
  DECLAWED_FRONT = 'declawed_front',
  DECLAWED_ALL = 'declawed_all'
}
```

---

## 3. HEALTH METRICS & SCORING SYSTEMS

### 3.1 Comprehensive Health Score

```typescript
interface HealthScore {
  // Overall Health Score
  overall_score: number;            // 0-100 composite score
  score_category: HealthScoreCategory;
  last_calculated: Date;
  
  // Component Scores (each 0-100)
  preventive_care_score: number;    // Vaccinations, checkups
  medical_history_score: number;    // Chronic conditions, incidents
  lifestyle_score: number;          // Diet, exercise, environment
  genetic_risk_score: number;       // Breed-specific risks
  age_adjusted_score: number;       // Age-appropriate health
  
  // Detailed Breakdowns
  vaccination_compliance: number;    // % of required vaccines up-to-date
  wellness_visit_compliance: number; // Annual checkups
  dental_health_score: number;      // Dental condition
  weight_management_score: number;   // BCS/weight tracking
  parasite_prevention_score: number; // Flea/tick/heartworm prevention
  
  // Risk Indicators
  health_risks: HealthRisk[];
  red_flags: HealthRedFlag[];
  recommendations: HealthRecommendation[];
}

enum HealthScoreCategory {
  CRITICAL = 'critical',            // 0-39 - Immediate vet attention needed
  POOR = 'poor',                    // 40-59 - Health concerns present
  FAIR = 'fair',                    // 60-74 - Some improvements needed
  GOOD = 'good',                    // 75-89 - Generally healthy
  EXCELLENT = 'excellent'           // 90-100 - Optimal health
}

interface HealthRisk {
  risk_type: HealthRiskType;
  risk_level: RiskLevel;            // Low, Medium, High, Critical
  risk_score: number;               // 0-100
  contributing_factors: string[];
  mitigation_steps?: string[];
  first_identified: Date;
  last_assessed: Date;
}

enum HealthRiskType {
  OBESITY = 'obesity',
  DENTAL_DISEASE = 'dental_disease',
  HEART_DISEASE = 'heart_disease',
  KIDNEY_DISEASE = 'kidney_disease',
  DIABETES = 'diabetes',
  ARTHRITIS = 'arthritis',
  CANCER = 'cancer',
  ALLERGIES = 'allergies',
  PARASITES = 'parasites',
  BEHAVIORAL = 'behavioral',
  GENETIC_PREDISPOSITION = 'genetic_predisposition'
}

enum RiskLevel {
  LOW = 'low',                      // 0-25
  MEDIUM = 'medium',                // 26-50
  HIGH = 'high',                    // 51-75
  CRITICAL = 'critical'             // 76-100
}

interface HealthRedFlag {
  flag_type: RedFlagType;
  severity: Severity;
  identified_date: Date;
  status: FlagStatus;               // Active, Resolved, Monitoring
  description: string;
  action_required?: string;
}

enum RedFlagType {
  OVERDUE_VACCINATION = 'overdue_vaccination',
  MISSED_CHECKUP = 'missed_checkup',
  RAPID_WEIGHT_CHANGE = 'rapid_weight_change',
  CHRONIC_CONDITION_UNMANAGED = 'chronic_condition_unmanaged',
  HIGH_RISK_BEHAVIOR = 'high_risk_behavior',
  MEDICATION_NON_COMPLIANCE = 'medication_non_compliance',
  EMERGENCY_VISIT = 'emergency_visit',
  MULTIPLE_SAME_DIAGNOSES = 'multiple_same_diagnoses'
}

enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

enum FlagStatus {
  ACTIVE = 'active',
  MONITORING = 'monitoring',
  RESOLVED = 'resolved',
  ACKNOWLEDGED = 'acknowledged'
}

interface HealthRecommendation {
  recommendation_type: RecommendationType;
  priority: Priority;
  title: string;
  description: string;
  action_items: string[];
  expected_benefit?: string;
  estimated_cost?: CostEstimate;
  due_date?: Date;
}

enum RecommendationType {
  VACCINATION = 'vaccination',
  CHECKUP = 'checkup',
  DENTAL_CLEANING = 'dental_cleaning',
  WEIGHT_MANAGEMENT = 'weight_management',
  EXERCISE = 'exercise',
  DIET_CHANGE = 'diet_change',
  BEHAVIOR_TRAINING = 'behavior_training',
  PREVENTIVE_SCREENING = 'preventive_screening',
  MEDICATION_REVIEW = 'medication_review'
}

enum Priority {
  URGENT = 'urgent',                // Within 1 week
  HIGH = 'high',                    // Within 1 month
  MEDIUM = 'medium',                // Within 3 months
  LOW = 'low'                       // Within 6-12 months
}

interface CostEstimate {
  min_cost: number;
  max_cost: number;
  currency: string;
  covered_by_insurance?: boolean;
}
```

---

### 3.2 Vital Signs & Clinical Measurements

```typescript
interface VitalSigns {
  // Cardiovascular
  heart_rate: VitalRecord[];        // BPM
  heart_rate_normal_range: {min: number, max: number};
  blood_pressure?: VitalRecord[];   // mmHg (systolic/diastolic)
  pulse_quality?: PulseQuality;
  
  // Respiratory
  respiratory_rate: VitalRecord[];  // Breaths per minute
  respiratory_rate_normal_range: {min: number, max: number};
  respiratory_pattern?: RespiratoryPattern;
  
  // Temperature
  temperature: VitalRecord[];       // Celsius/Fahrenheit
  temperature_normal_range: {min: number, max: number};
  temperature_measurement_site?: TempMeasurementSite;
  
  // Other Vitals
  mucous_membrane_color?: MucousMembraneColor;
  capillary_refill_time?: number;   // Seconds
  hydration_status?: HydrationStatus;
}

interface VitalRecord {
  value: number;
  unit: string;
  measured_date: Date;
  measured_by?: string;
  measurement_context?: string;     // Resting, Post-exercise, etc.
  is_abnormal: boolean;
  notes?: string;
}

enum PulseQuality {
  STRONG = 'strong',
  NORMAL = 'normal',
  WEAK = 'weak',
  THREADY = 'thready',
  BOUNDING = 'bounding'
}

enum RespiratoryPattern {
  NORMAL = 'normal',
  LABORED = 'labored',
  SHALLOW = 'shallow',
  RAPID = 'rapid',
  IRREGULAR = 'irregular'
}

enum TempMeasurementSite {
  RECTAL = 'rectal',               // Most accurate
  EAR = 'ear',
  AXILLARY = 'axillary',           // Armpit
  TEMPORAL = 'temporal'
}

enum MucousMembraneColor {
  PINK = 'pink',                   // Normal
  PALE = 'pale',                   // Anemia, shock
  RED = 'red',                     // Inflammation
  BLUE = 'blue',                   // Cyanosis
  YELLOW = 'yellow'                // Jaundice
}

enum HydrationStatus {
  WELL_HYDRATED = 'well_hydrated',
  MILDLY_DEHYDRATED = 'mildly_dehydrated',
  MODERATELY_DEHYDRATED = 'moderately_dehydrated',
  SEVERELY_DEHYDRATED = 'severely_dehydrated'
}
```

---

## 4. MEDICAL RECORDS STRUCTURE

### 4.1 Comprehensive Medical History

```typescript
interface MedicalHistory {
  // Chronic Conditions
  chronic_conditions: ChronicCondition[];
  
  // Acute Incidents
  medical_incidents: MedicalIncident[];
  
  // Surgeries & Procedures
  surgeries: Surgery[];
  procedures: MedicalProcedure[];
  
  // Hospitalizations
  hospitalizations: Hospitalization[];
  
  // Diagnostic Tests
  lab_results: LabResult[];
  imaging_studies: ImagingStudy[];
  
  // Allergies & Sensitivities
  allergies: Allergy[];
  
  // Current Medications
  medications_current: Medication[];
  medications_history: Medication[];
  
  // Vaccinations
  vaccinations: Vaccination[];
  vaccination_schedule: VaccinationSchedule;
  
  // Parasite Prevention
  parasite_prevention: ParasitePrevention[];
  
  // Veterinary Visits
  vet_visits: VeterinaryVisit[];
  primary_veterinarian?: VeterinarianInfo;
  
  // Health Insurance
  insurance_policies: InsurancePolicy[];
}

interface ChronicCondition {
  condition_id: string;
  condition_name: string;
  icd10_code?: string;              // International disease coding
  diagnosed_date: Date;
  diagnosed_by?: string;            // Veterinarian
  severity: Severity;
  status: ConditionStatus;
  treatment_plan?: string;
  management_notes?: string;
  affects_quality_of_life: boolean;
  requires_ongoing_medication: boolean;
  prognosis?: Prognosis;
  related_conditions?: string[];    // IDs of related conditions
  last_flare_up?: Date;
  remission_periods?: DateRange[];
}

enum ConditionStatus {
  ACTIVE = 'active',
  CONTROLLED = 'controlled',
  IN_REMISSION = 'in_remission',
  CURED = 'cured',
  TERMINAL = 'terminal'
}

enum Prognosis {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  GUARDED = 'guarded',
  POOR = 'poor',
  GRAVE = 'grave'
}

interface DateRange {
  start_date: Date;
  end_date?: Date;
}

interface MedicalIncident {
  incident_id: string;
  incident_type: IncidentType;
  incident_date: Date;
  description: string;
  diagnosis?: string;
  icd10_code?: string;
  severity: Severity;
  treatment_received?: string;
  outcome: IncidentOutcome;
  cost?: number;
  covered_by_insurance?: boolean;
  veterinarian?: string;
  clinic?: string;
  follow_up_required: boolean;
  follow_up_completed?: Date;
  notes?: string;
}

enum IncidentType {
  ILLNESS = 'illness',
  INJURY = 'injury',
  POISONING = 'poisoning',
  ALLERGIC_REACTION = 'allergic_reaction',
  BEHAVIORAL = 'behavioral',
  EMERGENCY = 'emergency',
  ROUTINE_FINDING = 'routine_finding'
}

enum IncidentOutcome {
  FULL_RECOVERY = 'full_recovery',
  PARTIAL_RECOVERY = 'partial_recovery',
  CHRONIC_CONDITION = 'chronic_condition',
  ONGOING_TREATMENT = 'ongoing_treatment',
  DEATH = 'death'
}

interface Surgery {
  surgery_id: string;
  surgery_type: SurgeryType;
  surgery_name: string;
  surgery_date: Date;
  surgeon?: string;
  clinic?: string;
  anesthesia_type?: string;
  duration_minutes?: number;
  reason: string;
  outcome: SurgeryOutcome;
  complications?: string[];
  recovery_period_days?: number;
  cost?: number;
  pre_op_notes?: string;
  post_op_notes?: string;
  pathology_findings?: string;
}

enum SurgeryType {
  ELECTIVE = 'elective',
  EMERGENCY = 'emergency',
  DIAGNOSTIC = 'diagnostic',
  THERAPEUTIC = 'therapeutic'
}

enum SurgeryOutcome {
  SUCCESSFUL = 'successful',
  SUCCESSFUL_WITH_COMPLICATIONS = 'successful_with_complications',
  UNSUCCESSFUL = 'unsuccessful',
  ONGOING = 'ongoing'
}

interface MedicalProcedure {
  procedure_id: string;
  procedure_name: string;
  procedure_type: ProcedureType;
  procedure_date: Date;
  performed_by?: string;
  reason: string;
  results?: string;
  follow_up_required: boolean;
  cost?: number;
}

enum ProcedureType {
  DENTAL_CLEANING = 'dental_cleaning',
  BLOOD_DRAW = 'blood_draw',
  XRAY = 'xray',
  ULTRASOUND = 'ultrasound',
  BIOPSY = 'biopsy',
  CYTOLOGY = 'cytology',
  ENDOSCOPY = 'endoscopy',
  ECG = 'ecg',
  GROOMING = 'grooming',
  NAIL_TRIM = 'nail_trim',
  OTHER = 'other'
}

interface Hospitalization {
  hospitalization_id: string;
  admission_date: Date;
  discharge_date?: Date;
  reason: string;
  facility: string;
  attending_veterinarian?: string;
  diagnosis?: string;
  treatments_received: string[];
  daily_notes?: HospitalizationNote[];
  discharge_status: DischargeStatus;
  discharge_instructions?: string;
  total_cost?: number;
}

interface HospitalizationNote {
  date: Date;
  time?: string;
  note: string;
  vital_signs?: VitalSigns;
  treatments_administered?: string[];
}

enum DischargeStatus {
  RECOVERED = 'recovered',
  IMPROVED = 'improved',
  STABLE = 'stable',
  TRANSFERRED = 'transferred',
  AGAINST_MEDICAL_ADVICE = 'against_medical_advice',
  DECEASED = 'deceased'
}
```

(Document continues... would you like me to continue with the remaining sections including Lab Results, Vaccinations, Medications, Behavioral Data, Breed-Specific Parameters, and Analytics Aggregation formats?)

### 4.2 Laboratory Results

```typescript
interface LabResult {
  test_id: string;
  test_date: Date;
  test_type: LabTestType;
  test_name: string;
  ordered_by?: string;                // Veterinarian
  lab_name?: string;
  results: LabTestResult[];
  overall_interpretation?: string;
  abnormal_findings: boolean;
  critical_values: boolean;
  veterinarian_notes?: string;
  follow_up_required: boolean;
}

enum LabTestType {
  COMPLETE_BLOOD_COUNT = 'cbc',
  CHEMISTRY_PANEL = 'chemistry_panel',
  URINALYSIS = 'urinal ysis',
  FECAL_EXAM = 'fecal_exam',
  THYROID_PANEL = 'thyroid_panel',
  HEARTWORM_TEST = 'heartworm_test',
  FELV_FIV_TEST = 'felv_fiv_test',
  GENETICS = 'genetics',
  ALLERGY_PANEL = 'allergy_panel',
  CULTURE_SENSITIVITY = 'culture_sensitivity',
  BIOPSY = 'biopsy',
  CYTOLOGY = 'cytology',
  OTHER = 'other'
}

interface LabTestResult {
  parameter: string;                  // e.g., "WBC", "Glucose", "BUN"
  value: number | string;
  unit: string;
  reference_range_min?: number;
  reference_range_max?: number;
  is_abnormal: boolean;
  abnormality_type?: AbnormalityType;
  critical_value: boolean;
  trend?: TrendDirection;             // Compared to previous tests
}

enum AbnormalityType {
  HIGH = 'high',
  LOW = 'low',
  PRESENT = 'present',               // For qualitative tests
  ABSENT = 'absent'
}

enum TrendDirection {
  IMPROVING = 'improving',
  STABLE = 'stable',
  WORSENING = 'worsening',
  NEW_FINDING = 'new_finding'
}
```

---

### 4.3 Vaccinations & Immunizations

```typescript
interface Vaccination {
  vaccination_id: string;
  vaccine_name: string;
  vaccine_type: VaccineType;
  manufacturer?: string;
  lot_number?: string;
  administered_date: Date;
  administered_by?: string;          // Veterinarian/clinic
  clinic?: string;
  route: AdministrationRoute;
  site: InjectionSite;
  dose_number?: number;              // 1st, 2nd, 3rd in series
  is_booster: boolean;
  next_due_date?: Date;
  expiration_date?: Date;
  certificate_number?: string;       // For travel
  reactions?: VaccineReaction[];
  notes?: string;
}

enum VaccineType {
  // Dogs
  RABIES = 'rabies',
  DISTEMPER = 'distemper',
  PARVOVIRUS = 'parvovirus',
  ADENOVIRUS = 'adenovirus',
  PARAINFLUENZA = 'parainfluenza',
  BORDETELLA = 'bordetella',
  LEPTOSPIROSIS = 'leptospirosis',
  LYME = 'lyme',
  CANINE_INFLUENZA = 'canine_influenza',
  
  // Cats
  FELINE_PANLEUKOPENIA = 'feline_panleukopenia',
  FELINE_HERPESVIRUS = 'feline_herpesvirus',
  FELINE_CALICIVIRUS = 'feline_calicivirus',
  FELINE_LEUKEMIA = 'feline_leukemia',
  FIP = 'fip',
  
  // Rabbits
  RABBIT_HEMORRHAGIC_DISEASE = 'rabbit_hemorrhagic_disease',
  MYXOMATOSIS = 'myxomatosis',
  
  // Other
  COMBINATION = 'combination',       // Multi-valent vaccine
  OTHER = 'other'
}

enum AdministrationRoute {
  SUBCUTANEOUS = 'subcutaneous',
  INTRAMUSCULAR = 'intramuscular',
  INTRANASAL = 'intranasal',
  ORAL = 'oral'
}

enum InjectionSite {
  RIGHT_SHOULDER = 'right_shoulder',
  LEFT_SHOULDER = 'left_shoulder',
  RIGHT_HINDLIMB = 'right_hindlimb',
  LEFT_HINDLIMB = 'left_hindlimb',
  SCRUFF = 'scruff',
  OTHER = 'other'
}

interface VaccineReaction {
  reaction_type: ReactionType;
  severity: Severity;
  onset_time?: string;               // Time after vaccination
  description: string;
  treatment_required: boolean;
  treatment_given?: string;
  reported_to_manufacturer: boolean;
}

enum ReactionType {
  NONE = 'none',
  MILD_LETHARGY = 'mild_lethargy',
  LOCAL_SWELLING = 'local_swelling',
  LOCAL_PAIN = 'local_pain',
  FEVER = 'fever',
  VOMITING = 'vomiting',
  DIARRHEA = 'diarrhea',
  URTICARIA = 'urticaria',           // Hives
  FACIAL_SWELLING = 'facial_swelling',
  ANAPHYLAXIS = 'anaphylaxis',
  VACCINE_SITE_SARCOMA = 'vaccine_site_sarcoma'
}

interface VaccinationSchedule {
  species: SpeciesType;
  breed_specific_recommendations?: string[];
  core_vaccines: VaccineProtocol[];
  non_core_vaccines: VaccineProtocol[];
  lifestyle_based_vaccines: VaccineProtocol[];
  compliance_percentage: number;      // % of schedule completed
  overdue_vaccines: string[];
  upcoming_vaccines: UpcomingVaccine[];
}

interface VaccineProtocol {
  vaccine_type: VaccineType;
  classification: VaccineClassification;
  first_dose_age_weeks: number;
  booster_schedule: BoosterSchedule[];
  lifetime_requirement: boolean;
  required_for_travel?: boolean;
  required_for_boarding?: boolean;
  regional_requirement?: boolean;
}

enum VaccineClassification {
  CORE = 'core',                     // Recommended for all
  NON_CORE = 'non_core',            // Based on risk
  NOT_RECOMMENDED = 'not_recommended'
}

interface BoosterSchedule {
  timing: string;                    // e.g., "3-4 weeks after first dose"
  timing_weeks?: number;
  frequency_years?: number;          // Annual, 3-year, etc.
  age_dependent: boolean;
}

interface UpcomingVaccine {
  vaccine_type: VaccineType;
  due_date: Date;
  overdue: boolean;
  priority: Priority;
  reason?: string;
}
```

---

### 4.4 Medications & Treatments

```typescript
interface Medication {
  medication_id: string;
  medication_name: string;
  generic_name?: string;
  drug_class?: DrugClass;
  form: MedicationForm;
  strength: string;                  // e.g., "10mg", "2.5%"
  
  // Prescription Info
  prescribed_by?: string;
  prescribed_date?: Date;
  prescription_number?: string;
  pharmacy?: string;
  
  // Dosing
  dosage: string;                    // e.g., "1 tablet"
  frequency: string;                 // e.g., "twice daily"
  route: MedicationRoute;
  duration?: string;                 // e.g., "14 days"
  start_date: Date;
  end_date?: Date;
  
  // Status
  status: MedicationStatus;
  is_long_term: boolean;
  refills_remaining?: number;
  
  // Indication
  indication: string;                // What it's treating
  icd10_code?: string;
  
  // Administration
  to_be_given_with_food?: boolean;
  special_instructions?: string;
  side_effects?: string[];
  observed_side_effects?: MedicationSideEffect[];
  
  // Effectiveness
  effectiveness_rating?: number;      // 1-5 scale
  compliance_percentage?: number;     // % of doses taken as prescribed
  
  // Cost
  cost_per_unit?: number;
  total_cost?: number;
  covered_by_insurance?: boolean;
}

enum DrugClass {
  ANTIBIOTIC = 'antibiotic',
  ANTI_INFLAMMATORY = 'anti_inflammatory',
  PAIN_MEDICATION = 'pain_medication',
  CARDIAC = 'cardiac',
  GASTROINTESTINAL = 'gastrointestinal',
  ENDOCRINE = 'endocrine',
  BEHAVIORAL = 'behavioral',
  ANTIPARASITIC = 'antiparasitic',
  CHEMOTHERAPY = 'chemotherapy',
  SUPPLEMENT = 'supplement',
  OTHER = 'other'
}

enum MedicationForm {
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  LIQUID = 'liquid',
  INJECTION = 'injection',
  TOPICAL = 'topical',
  TRANSDERMAL_PATCH = 'transdermal_patch',
  INHALER = 'inhaler',
  EYE_DROPS = 'eye_drops',
  EAR_DROPS = 'ear_drops',
  CHEWABLE = 'chewable',
  POWDER = 'powder'
}

enum MedicationRoute {
  ORAL = 'oral',
  TOPICAL = 'topical',
  SUBCUTANEOUS = 'subcutaneous',
  INTRAMUSCULAR = 'intramuscular',
  INTRAVENOUS = 'intravenous',
  OPHTHALMIC = 'ophthalmic',
  OTIC = 'otic',
  RECTAL = 'rectal',
  TRANSDERMAL = 'transdermal',
  INHALATION = 'inhalation'
}

enum MedicationStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DISCONTINUED = 'discontinued',
  ON_HOLD = 'on_hold'
}

interface MedicationSideEffect {
  side_effect: string;
  severity: Severity;
  first_observed: Date;
  action_taken?: string;
  resolved: boolean;
}

interface ParasitePrevention {
  prevention_id: string;
  parasite_type: ParasiteType;
  product_name: string;
  manufacturer?: string;
  form: MedicationForm;
  application_date: Date;
  next_application_date?: Date;
  coverage_duration_days: number;
  administered_by?: string;
  lot_number?: string;
  effectiveness?: string;
}

enum ParasiteType {
  FLEA = 'flea',
  TICK = 'tick',
  HEARTWORM = 'heartworm',
  INTESTINAL_WORM = 'intestinal_worm',
  MITE = 'mite',
  LICE = 'lice',
  COMBINATION = 'combination'
}
```

---

## 5. BEHAVIORAL & LIFESTYLE DATA

```typescript
interface BehaviorProfile {
  // Temperament
  temperament: TemperamentTraits;
  
  // Behavioral Issues
  behavioral_issues: BehavioralIssue[];
  
  // Training
  training_history: TrainingHistory;
  
  // Socialization
  socialization: SocializationProfile;
  
  // Activity Level
  activity_level: ActivityLevel;
  exercise_routine: ExerciseRoutine;
  
  // Environment
  living_environment: LivingEnvironment;
  
  // Diet & Nutrition
  diet: DietProfile;
}

interface TemperamentTraits {
  energy_level: number;              // 1-10 scale
  friendliness_humans: number;       // 1-10
  friendliness_dogs: number;         // 1-10
  friendliness_cats: number;         // 1-10
  friendliness_children: number;     // 1-10
  playfulness: number;               // 1-10
  independence: number;              // 1-10
  trainability: number;              // 1-10
  vocalization: number;              // 1-10 (quiet to very vocal)
  aggression_level: number;          // 1-10 (1=none, 10=severe)
  anxiety_level: number;             // 1-10
  prey_drive: number;                // 1-10
  overall_temperament: OverallTemperament;
}

enum OverallTemperament {
  VERY_FRIENDLY = 'very_friendly',
  FRIENDLY = 'friendly',
  NEUTRAL = 'neutral',
  SHY = 'shy',
  FEARFUL = 'fearful',
  AGGRESSIVE = 'aggressive',
  UNPREDICTABLE = 'unpredictable'
}

interface BehavioralIssue {
  issue_type: BehavioralIssueType;
  severity: Severity;
  first_observed: Date;
  frequency: IssueFrequency;
  triggers?: string[];
  management_strategies?: string[];
  professional_help_sought: boolean;
  status: IssueStatus;
}

enum BehavioralIssueType {
  SEPARATION_ANXIETY = 'separation_anxiety',
  AGGRESSION_HUMANS = 'aggression_humans',
  AGGRESSION_ANIMALS = 'aggression_animals',
  FEAR_ANXIETY = 'fear_anxiety',
  EXCESSIVE_BARKING = 'excessive_barking',
  DESTRUCTIVE_BEHAVIOR = 'destructive_behavior',
  HOUSE_SOILING = 'house_soiling',
  COMPULSIVE_BEHAVIOR = 'compulsive_behavior',
  HYPERACTIVITY = 'hyperactivity',
  RESOURCE_GUARDING = 'resource_guarding',
  OTHER = 'other'
}

enum IssueFrequency {
  RARELY = 'rarely',
  OCCASIONALLY = 'occasionally',
  FREQUENTLY = 'frequently',
  CONSTANTLY = 'constantly'
}

enum IssueStatus {
  UNADDRESSED = 'unaddressed',
  IN_TREATMENT = 'in_treatment',
  IMPROVING = 'improving',
  RESOLVED = 'resolved',
  CHRONIC = 'chronic'
}

interface TrainingHistory {
  house_trained: boolean;
  house_trained_age_months?: number;
  crate_trained: boolean;
  leash_trained: boolean;
  basic_commands: Command[];
  advanced_training?: string[];
  training_classes: TrainingClass[];
  tricks_known?: string[];
}

interface Command {
  command_name: string;
  proficiency: Proficiency;
  learned_age_months?: number;
}

enum Proficiency {
  NOVICE = 'novice',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

interface TrainingClass {
  class_name: string;
  training_type: TrainingType;
  start_date: Date;
  end_date?: Date;
  completed: boolean;
  trainer?: string;
  certification_earned?: string;
}

enum TrainingType {
  PUPPY_KINDERGARTEN = 'puppy_kindergarten',
  BASIC_OBEDIENCE = 'basic_obedience',
  ADVANCED_OBEDIENCE = 'advanced_obedience',
  AGILITY = 'agility',
  THERAPY_DOG = 'therapy_dog',
  SERVICE_DOG = 'service_dog',
  BEHAVIOR_MODIFICATION = 'behavior_modification',
  PROTECTION = 'protection',
  SCENT_WORK = 'scent_work',
  OTHER = 'other'
}

interface SocializationProfile {
  socialization_level: SocializationLevel;
  comfortable_with_strangers: boolean;
  comfortable_with_children: boolean;
  comfortable_with_other_dogs: boolean;
  comfortable_with_cats: boolean;
  comfortable_with_other_animals: boolean;
  comfortable_in_public_places: boolean;
  comfortable_with_loud_noises: boolean;
  socialization_activities?: string[];
}

enum SocializationLevel {
  WELL_SOCIALIZED = 'well_socialized',
  MODERATELY_SOCIALIZED = 'moderately_socialized',
  MINIMALLY_SOCIALIZED = 'minimally_socialized',
  NOT_SOCIALIZED = 'not_socialized',
  REACTIVE = 'reactive'
}

enum ActivityLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

interface ExerciseRoutine {
  daily_exercise_minutes: number;
  exercise_type: ExerciseType[];
  exercise_frequency_per_week: number;
  outdoor_access: OutdoorAccess;
  exercise_restrictions?: string[];
}

enum ExerciseType {
  WALKING = 'walking',
  RUNNING = 'running',
  SWIMMING = 'swimming',
  FETCH = 'fetch',
  AGILITY = 'agility',
  HIKING = 'hiking',
  DOG_PARK = 'dog_park',
  INDOOR_PLAY = 'indoor_play',
  OTHER = 'other'
}

enum OutdoorAccess {
  FENCED_YARD = 'fenced_yard',
  UNFENCED_YARD = 'unfenced_yard',
  BALCONY = 'balcony',
  NO_OUTDOOR_SPACE = 'no_outdoor_space',
  RURAL_PROPERTY = 'rural_property'
}

interface LivingEnvironment {
  home_type: HomeType;
  indoor_outdoor: IndoorOutdoorStatus;
  other_pets: OtherPet[];
  children_in_home: boolean;
  children_ages?: number[];
  household_size: number;
  primary_caregiver?: string;
  noise_level: NoiseLevel;
  climate: ClimateType;
}

enum HomeType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  FARM = 'farm',
  MOBILE_HOME = 'mobile_home',
  OTHER = 'other'
}

enum IndoorOutdoorStatus {
  INDOOR_ONLY = 'indoor_only',
  OUTDOOR_ONLY = 'outdoor_only',
  BOTH = 'both',
  PRIMARILY_INDOOR = 'primarily_indoor',
  PRIMARILY_OUTDOOR = 'primarily_outdoor'
}

interface OtherPet {
  species: SpeciesType;
  age_years?: number;
  relationship: PetRelationship;
}

enum PetRelationship {
  FRIENDLY = 'friendly',
  NEUTRAL = 'neutral',
  TOLERANT = 'tolerant',
  HOSTILE = 'hostile',
  SEPARATE = 'separate'
}

enum NoiseLevel {
  VERY_QUIET = 'very_quiet',
  QUIET = 'quiet',
  MODERATE = 'moderate',
  NOISY = 'noisy',
  VERY_NOISY = 'very_noisy'
}

enum ClimateType {
  TROPICAL = 'tropical',
  SUBTROPICAL = 'subtropical',
  TEMPERATE = 'temperate',
  COLD = 'cold',
  ARID = 'arid',
  VARIABLE = 'variable'
}

interface DietProfile {
  diet_type: DietType;
  feeding_schedule: FeedingSchedule;
  food_brand?: string;
  food_quality: FoodQuality;
  daily_calories?: number;
  meals_per_day: number;
  treats_per_day?: number;
  dietary_restrictions?: string[];
  food_allergies?: string[];
  preferred_foods?: string[];
  weight_management_diet: boolean;
  prescription_diet: boolean;
  prescription_diet_reason?: string;
  supplements?: Supplement[];
}

enum DietType {
  DRY_KIBBLE = 'dry_kibble',
  WET_CANNED = 'wet_canned',
  RAW = 'raw',
  HOME_COOKED = 'home_cooked',
  COMBINATION = 'combination',
  PRESCRIPTION = 'prescription',
  GRAIN_FREE = 'grain_free',
  LIMITED_INGREDIENT = 'limited_ingredient'
}

enum FeedingSchedule {
  FREE_FEEDING = 'free_feeding',
  SCHEDULED_MEALS = 'scheduled_meals',
  TIMED_PORTIONS = 'timed_portions'
}

enum FoodQuality {
  ECONOMY = 'economy',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  HOLISTIC = 'holistic',
  PRESCRIPTION = 'prescription'
}

interface Supplement {
  supplement_name: string;
  purpose: string;
  dosage: string;
  frequency: string;
  started_date?: Date;
}
```

---

## 6. BREED-SPECIFIC DATA & GENETIC INFORMATION

```typescript
interface BreedSpecificData {
  // Breed Standards
  breed_name: string;
  breed_group?: BreedGroup;
  breed_size: BreedSize;
  breed_lifespan_years: {min: number, max: number};
  breed_weight_range_kg: {min: number, max: number};
  breed_height_range_cm?: {min: number, max: number};
  
  // Genetic Health Risks
  breed_predispositions: BreedPredisposition[];
  genetic_tests_performed: GeneticTest[];
  genetic_test_results: GeneticTestResult [];
  
  // Breed Characteristics
  breed_traits: BreedTraits;
  working_purpose?: WorkingPurpose;
  
  // Pedigree (if purebred)
  pedigree?: Pedigree;
}

enum BreedGroup {
  SPORTING = 'sporting',
  HOUND = 'hound',
  WORKING = 'working',
  TERRIER = 'terrier',
  TOY = 'toy',
  NON_SPORTING = 'non_sporting',
  HERDING = 'herding',
  MIXED = 'mixed',
  // Cats
  PERSIAN = 'persian',
  SIAMESE = 'siamese',
  MAINE_COON = 'maine_coon',
  // Other species groups...
}

enum BreedSize {
  TOY = 'toy',                       // <5kg
  SMALL = 'small',                   // 5-10kg
  MEDIUM = 'medium',                 // 10-25kg
  LARGE = 'large',                   // 25-45kg
  GIANT = 'giant'                    // >45kg
}

interface BreedPredisposition {
  condition_name: string;
  risk_level: RiskLevel;
  onset_age_typical_years?: number;
  prevalence_percentage?: number;    // % of breed affected
  preventive_measures?: string[];
  screening_recommended?: string;
}

interface GeneticTest {
  test_name: string;
  test_type: GeneticTestType;
  test_date?: Date;
  laboratory?: string;
  purpose: string;
}

enum GeneticTestType {
  DNA_BREED_IDENTIFICATION = 'dna_breed_identification',
  DISEASE_SCREENING = 'disease_screening',
  TRAIT_ANALYSIS = 'trait_analysis',
  PARENTAGE_VERIFICATION = 'parentage_verification',
  FULL_GENOME_SEQUENCE = 'full_genome_sequence'
}

interface GeneticTestResult {
  test_id: string;
  gene_marker?: string;
  condition_tested: string;
  result: GeneticTestResultType;
  carrier_status?: CarrierStatus;
  interpretation: string;
  clinical_significance: ClinicalSignificance;
}

enum GeneticTestResultType {
  NORMAL = 'normal',
  ABNORMAL = 'abnormal',
  CARRIER = 'carrier',
  AT_RISK = 'at_risk',
  INCONCLUSIVE = 'inconclusive'
}

enum CarrierStatus {
  NOT_A_CARRIER = 'not_a_carrier',
  CARRIER = 'carrier',
  AFFECTED = 'affected'
}

enum ClinicalSignificance {
  BENIGN = 'benign',
  LIKELY_BENIGN = 'likely_benign',
  UNCERTAIN = 'uncertain',
  LIKELY_PATHOGENIC = 'likely_pathogenic',
  PATHOGENIC = 'pathogenic'
}

interface BreedTraits {
  coat_shedding: SheddingLevel;
  drooling_tendency: DroolingLevel;
  barking_tendency: BarkingLevel;
  intelligence_ranking?: number;      // 1-194 (Stanley Coren)
  adaptability: number;               // 1-10
  apartment_friendly: boolean;
  good_with_kids: boolean;
  good_with_dogs: boolean;
  good_with_cats: boolean;
  climate_tolerance: ClimateTolerance;
}

enum SheddingLevel {
  NONE = 'none',
  MINIMAL = 'minimal',
  MODERATE = 'moderate',
  HEAVY = 'heavy',
  SEASONAL = 'seasonal'
}

enum DroolingLevel {
  NONE = 'none',
  MINIMAL = 'minimal',
  MODERATE = 'moderate',
  HEAVY = 'heavy'
}

enum BarkingLevel {
  QUIET = 'quiet',
  OCCASIONAL = 'occasional',
  MODERATE = 'moderate',
  FREQUENT = 'frequent',
  EXCESSIVE = 'excessive'
}

interface ClimateTolerance {
  cold_tolerance: ToleranceLevel;
  heat_tolerance: ToleranceLevel;
  humidity_tolerance: ToleranceLevel;
}

enum ToleranceLevel {
  POOR = 'poor',
  FAIR = 'fair',
  GOOD = 'good',
  EXCELLENT = 'excellent'
}

enum WorkingPurpose {
  COMPANION = 'companion',
  HERDING = 'herding',
  HUNTING = 'hunting',
  GUARDING = 'guarding',
  POLICE_MILITARY = 'police_military',
  SERVICE_DOG = 'service_dog',
  THERAPY_DOG = 'therapy_dog',
  SEARCH_RESCUE = 'search_rescue',
  FARM_WORK = 'farm_work',
  SPORT = 'sport',
  SHOW = 'show'
}

interface Pedigree {
  registration_number: string;
  registry: string;                  // AKC, CFA, etc.
  sire_name?: string;
  sire_registration?: string;
  dam_name?: string;
  dam_registration?: string;
  grand_sires?: string[];
  grand_dams?: string[];
  champions_in_lineage?: number;
  titles_earned?: string[];
}
```

---

## 7. ANALYTICS & DATA AGGREGATION

### 7.1 Health Partner Data Export Format

```typescript
interface HealthPartnerDataExport {
  export_id: string;
  export_date: Date;
  export_type: ExportType;
  partner_id: string;
  partner_type: PartnerType;
  
  // Aggregated Data
  pet_summary: PetSummaryForPartner;
  health_metrics_summary: HealthMetricsSummary;
  risk_assessment: RiskAssessmentSummary;
  claims_prediction?: ClaimsPrediction;
  
  // Compliance & Quality
  data_completeness_score: number;   // 0-100
  last_updated: Date;
  data_quality_flags?: DataQualityFlag[];
}

enum ExportType {
  INSURANCE_QUOTE = 'insurance_quote',
  INSURANCE_CLAIM = 'insurance_claim',
  VETERINARY_REFERRAL = 'veterinary_referral',
  RESEARCH_DATASET = 'research_dataset',
  BREEDING_EVALUATION = 'breeding_evaluation'
}

enum PartnerType {
  INSURANCE_PROVIDER = 'insurance_provider',
  VETERINARY_NETWORK = 'veterinary_network',
  RESEARCH_INSTITUTION = 'research_institution',
  BREEDING_REGISTRY = 'breeding_registry',
  PHARMACEUTICAL = 'pharmaceutical'
}

interface PetSummaryForPartner {
  pet_id_anonymized?: string;        // For privacy
  species: SpeciesType;
  breed: string;
  age_years: number;
  sex: SexType;
  reproductive_status: ReproductiveStatus;
  weight_current_kg: number;
  body_condition_category: BCSCategory;
  microchip_verified: boolean;
  location_country: string;
  location_region?: string;
}

interface HealthMetricsSummary {
  overall_health_score: number;
  health_score_trend: TrendDirection;
  chronic_conditions_count: number;
  chronic_conditions_list?: string[]; // ICD-10 codes
  medications_count: number;
  surgeries_count: number;
  hospitalizations_count: number;
  emergency_visits_count: number;
  last_vet_visit_days_ago?: number;
  vaccination_compliance_percentage: number;
  preventive_care_compliance: number;
}

interface RiskAssessmentSummary {
  overall_risk_level: RiskLevel;
  top_health_risks: HealthRisk[];
  breed_risk_factors: BreedPredisposition[];
  age_risk_multiplier: number;
  lifestyle_risk_factors?: string[];
  environmental_risk_factors?: string[];
}

interface ClaimsPrediction {
  predicted_annual_claims: number;
  prediction_confidence: number;      // 0-100%
  high_cost_risk_conditions: string[];
  expected_cost_range: {min: number, max: number};
  cost_drivers: CostDriver[];
}

interface CostDriver {
  factor: string;
  impact_percentage: number;
  description: string;
}

interface DataQualityFlag {
  flag_type: DataQualityFlagType;
  severity: Severity;
  description: string;
  affected_fields?: string[];
}

enum DataQualityFlagType {
  MISSING_CRITICAL_DATA = 'missing_critical_data',
  OUTDATED_DATA = 'outdated_data',
  INCONSISTENT_DATA = 'inconsistent_data',
  UNVERIFIED_DATA = 'unverified_data',
  INCOMPLETE_RECORDS = 'incomplete_records'
}
```

---

### 7.2 Population Health Analytics

```typescript
interface PopulationAnalytics {
  analytics_id: string;
  generated_date: Date;
  population_size: number;
  filters_applied?: PopulationFilters;
  
  // Demographics
  species_distribution: SpeciesDistribution[];
  breed_distribution: BreedDistribution[];
  age_distribution: AgeDistribution;
  geographic_distribution: GeographicDistribution[];
  
  // Health Trends
  common_conditions: ConditionPrevalence[];
  vaccination_rates: VaccinationRates;
  obesity_prevalence: number;
  avg_health_score: number;
  
  // Behavioral
  behavioral_issues_prevalence: BehavioralPrevalence[];
  
  // Economic
  avg_annual_vet_costs: number;
  insurance_penetration: number;
}

interface PopulationFilters {
  species?: SpeciesType[];
  breed?: string[];
  age_range?: {min: number, max: number};
  location?: string[];
  health_score_range?: {min: number, max: number};
}

interface SpeciesDistribution {
  species: SpeciesType;
  count: number;
  percentage: number;
}

interface BreedDistribution {
  breed_name: string;
  count: number;
  percentage: number;
  avg_health_score: number;
}

interface AgeDistribution {
  age_0_1: number;
  age_1_3: number;
  age_3_7: number;
  age_7_10: number;
  age_10_plus: number;
}

interface GeographicDistribution {
  region: string;
  count: number;
  percentage: number;
  avg_health_score: number;
}

interface ConditionPrevalence {
  condition_name: string;
  icd10_code?: string;
  prevalence_percentage: number;
  avg_age_of_onset: number;
  most_affected_breeds?: string[];
}

interface VaccinationRates {
  rabies_compliance: number;
  core_vaccines_compliance: number;
  avg_overdue_days?: number;
}

interface BehavioralPrevalence {
  issue_type: BehavioralIssueType;
  prevalence_percentage: number;
  most_affected_breeds?: string[];
}
```

---

## 8. DATA SCHEMAS FOR PARTNER APIs

### 8.1 Insurance Provider Integration

```typescript
interface InsuranceQuoteRequest {
  request_id: string;
  timestamp: Date;
  
  // Pet Details
  pet: {
    species: SpeciesType;
    breed: string;
    age_years: number;
    weight_kg: number;
    sex: SexType;
    neutered: boolean;
    microchip_number?: string;
  };
  
  // Health Summary
  health: {
    overall_health_score: number;
    pre_existing_conditions: string[]; // ICD-10 codes
    chronic_medications_count: number;
    recent_surgeries: boolean;
    recent_emergency_visits: boolean;
    vaccination_current: boolean;
    bcs_category: BCSCategory;
  };
  
  // Risk Profile
  risk: {
    overall_risk_level: RiskLevel;
    breed_predispositions: string[];
    lifestyle_risks: string[];
  };
  
  // Owner Details
  owner: {
    location_country: string;
    location_postal_code: string;
    multi_pet: boolean;
    previous_insurance: boolean;
  };
  
  // Coverage Preferences
  coverage: {
    coverage_type: CoverageType;
    annual_limit?: number;
    deductible_preference?: number;
    reimbursement_rate_preference?: number;
  };
}

enum CoverageType {
  ACCIDENT_ONLY = 'accident_only',
  ACCIDENT_ILLNESS = 'accident_illness',
  WELLNESS_ADDON = 'wellness_addon',
  COMPREHENSIVE = 'comprehensive'
}

interface InsuranceQuoteResponse {
  quote_id: string;
  provider_name: string;
  monthly_premium: number;
  annual_premium: number;
  coverage_details: CoverageDetails;
  exclusions: string[];
  waiting_periods: WaitingPeriod[];
  quote_valid_until: Date;
}

interface CoverageDetails {
  annual_limit: number | 'unlimited';
  deductible: number;
  reimbursement_rate: number;        // 70%, 80%, 90%, 100%
  covers_hereditary: boolean;
  covers_chronic: boolean;
  covers_behavioral: boolean;
  direct_vet_payment: boolean;
}

interface WaitingPeriod {
  condition_type: string;
  days: number;
}
```

---

### 8.2 Veterinary Network Integration

```typescript
interface VeterinaryRecordExchange {
  transfer_id: string;
  transfer_date: Date;
  from_clinic: string;
  to_clinic: string;
  pet_id: string;
  owner_consent: boolean;
  consent_date: Date;
  
  // Complete Record Package
  pet_demographics: PetIdentification;
  medical_history: MedicalHistory;
  current_medications: Medication[];
  allergies: Allergy[];
  latest_vitals?: VitalSigns;
  vaccination_records: Vaccination[];
  lab_results_recent?: LabResult[];
  imaging_studies?: ImagingStudy[];
  
  // Transfer Reason
  transfer_reason: TransferReason;
  urgency: Urgency;
  specific_concerns?: string;
}

enum TransferReason {
  RELOCATION = 'relocation',
  REFERRAL = 'referral',
  SECOND_OPINION = 'second_opinion',
  SPECIALTY_CARE = 'specialty_care',
  EMERGENCY = 'emergency'
}

enum Urgency {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  EMERGENCY = 'emergency'
}
```

---

## 9. INTERNATIONAL TRAVEL REQUIREMENTS

```typescript
interface TravelPassport {
  passport_id: string;
  pet_id: string;
  issue_date: Date;
  expiry_date?: Date;
  
  // Travel Details
  origin_country: string;
  destination_country: string;
  travel_date?: Date;
  
  // Requirements Compliance
  microchip_compliant: boolean;       // ISO 11784/11785
  rabies_vaccination_current: boolean;
  rabies_vaccination_date?: Date;
  rabies_certificate_number?: string;
  
  // Country-Specific Requirements
  country_requirements: CountryRequirement[];
  compliance_status: ComplianceStatus;
  missing_requirements?: string[];
  
  // Health Certificate
  health_certificate_issued: boolean;
  health_certificate_date?: Date;
  health_certificate_number?: string;
  examining_veterinarian?: string;
  
  // Additional Documents
  import_permit?: ImportPermit;
  export_permit?: ExportPermit;
  quarantine_requirements?: QuarantineRequirement;
}

interface CountryRequirement {
  requirement_type: RequirementType;
  description: string;
  compliance_met: boolean;
  evidence?: string;
  due_date?: Date;
}

enum RequirementType {
  MICROCHIP = 'microchip',
  RABIES_VACCINATION = 'rabies_vaccination',
  RABIES_TITER_TEST = 'rabies_titer_test',
  HEALTH_CERTIFICATE = 'health_certificate',
  PARASITE_TREATMENT = 'parasite_treatment',
  TAPEWORM_TREATMENT = 'tapeworm_treatment',
  BLOOD_TEST = 'blood_test',
  QUARANTINE = 'quarantine',
  IMPORT_PERMIT = 'import_permit',
  OTHER_VACCINATION = 'other_vaccination'
}

enum ComplianceStatus {
  FULLY_COMPLIANT = 'fully_compliant',
  PARTIALLY_COMPLIANT = 'partially_compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING_VERIFICATION = 'pending_verification'
}

interface ImportPermit {
  permit_number: string;
  issue_date: Date;
  expiry_date: Date;
  issuing_authority: string;
}

interface ExportPermit {
  permit_number: string;
  issue_date: Date;
  issuing_authority: string;
}

interface QuarantineRequirement {
  required: boolean;
  duration_days?: number;
  facility?: string;
  cost_estimate?: number;
  exemption_possible: boolean;
  exemption_criteria?: string[];
}
```

---

## CONCLUSION

This comprehensive data specification provides a complete framework for digital pet passports, enabling:

1. **Complete Health Tracking** - All medical, behavioral, and lifestyle data
2. **Risk Assessment** - Predictive analytics for insurance and health partners
3. **Partner Integrations** - Standardized data exchange formats
4. **Regulatory Compliance** - International travel requirements
5. **Population Analytics** - Research and trend analysis
6. **AI/ML Ready** - Structured data for machine learning applications

**Total Data Points**: 200+ fields across 50+ data structures

**Use Cases**:
- Insurance underwriting and claims
- Veterinary record exchange
- Breed health research
- International travel documentation
- Predictive health analytics
- Personalized care recommendations

🐾 **Complete. Comprehensive. Connected.** 🐾

