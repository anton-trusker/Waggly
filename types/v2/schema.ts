export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// Enums
export type Species = 'dog' | 'cat' | 'other';
export type Gender = 'male' | 'female';
export type PetSize = 'small' | 'medium' | 'large' | 'giant';
export type PetConcern = 'anxiety' | 'aggression' | 'dietary' | 'mobility' | 'other';

export type VisitType = 'checkup' | 'vaccination' | 'surgery' | 'emergency' | 'grooming' | 'other';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type VaccinationStatus = 'pending' | 'completed' | 'overdue' | 'scheduled';

export type ProviderCategory = 'veterinarian' | 'groomer' | 'insurance' | 'trainer' | 'sitter/walker' | 'boarding';
export type DocumentCategory = 'medical_record' | 'prescription' | 'lab_result' | 'contract' | 'invoice' | 'photo' | 'passport' | 'other';

// Tables

export interface Profile {
    id: string; // UUID
    email: string;
    full_name: string | null;
    phone_number: string | null;
    avatar_url: string | null;
    preferences: Json;
    created_at: string;
    updated_at: string;
}

export interface Pet {
    id: string; // UUID
    owner_id: string; // UUID
    name: string;
    species: Species;
    breed: string | null;
    gender: Gender | null;
    size: PetSize | null;
    date_of_birth: string | null; // Date string YYYY-MM-DD
    date_of_adoption: string | null;
    weight_current: number | null;
    weight_unit: string | null; // 'kg' | 'lbs'
    blood_type: string | null;
    color: string | null;
    microchip_number: string | null;
    microchip_implantation_date: string | null; // Date string YYYY-MM-DD
    registration_id: string | null;
    avatar_url: string | null;
    photo_url: string | null; // Alias for avatar_url for backward compatibility
    description: string | null;
    is_spayed_neutered: boolean;
    is_deceased: boolean;
    created_at: string;
    updated_at: string;
}

export interface Provider {
    id: string;
    owner_id: string;
    category: ProviderCategory;
    name: string;
    clinic_name: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    address: string | null;
    policy_number: string | null;
    group_number: string | null;
    notes: string | null;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface PetProvider {
    id: string;
    pet_id: string;
    provider_id: string;
    description: string | null;
    created_at: string;
}

export interface Vaccination {
    id: string;
    pet_id: string;
    vaccine_name: string;
    manufacturer: string | null;
    batch_number: string | null;
    administered_date: string;
    valid_until: string | null;
    next_due_date: string | null;
    provider_id: string | null;
    status: VaccinationStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface MedicalVisit {
    id: string;
    pet_id: string;
    visit_date: string;
    visit_type: VisitType;
    reason: string | null;
    diagnosis: string | null;
    treatment_summary: string | null;
    cost: number | null;
    currency: string | null;
    provider_id: string | null;
    follow_up_required: boolean;
    follow_up_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface Medication {
    id: string;
    pet_id: string;
    name: string;
    dosage: string | null;
    frequency: string | null;
    instructions: string | null;
    start_date: string;
    end_date: string | null;
    is_ongoing: boolean;
    provider_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Allergy {
    id: string;
    pet_id: string;
    name: string;
    type: string | null;
    severity: SeverityLevel;
    reaction: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface WeightLog {
    id: string;
    pet_id: string;
    weight: number;
    unit: string;
    recorded_date: string;
    notes: string | null;
    created_at: string;
}

export interface Document {
    id: string;
    owner_id: string;
    pet_id: string | null;
    name: string;
    category: DocumentCategory;
    file_path: string;
    file_type: string | null;
    file_size: number | null;
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
}

export interface TravelRecord {
    id: string;
    pet_id: string;
    destination_country: string | null;
    travel_date: string | null;
    return_date: string | null;
    notes: string | null;
    status: string | null;
    created_at: string;
    updated_at: string;
}

export interface Condition {
    id: string;
    pet_id: string;
    name: string;
    description: string | null;
    diagnosed_date: string | null;
    treatment_plan: string | null;
    notes: string | null;
    status: 'active' | 'resolved' | 'managed' | 'unknown';
    created_at: string;
    updated_at: string;
}

export interface ActivityLog {
    id: string;
    pet_id: string;
    created_by: string | null;
    activity_type: string;
    title: string;
    description: string | null;
    metadata: Json | null;
    created_at: string;
}

export interface BehaviorTag {
    id: string;
    pet_id: string;
    tag: string;
    notes: string | null;
    created_at: string;
}

// Database helper type (Mocking Supabase generated type structure if needed, or just use direct interfaces)
export type DatabaseV2 = {
    public: {
        Tables: {
            profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
            pets: { Row: Pet; Insert: Partial<Pet>; Update: Partial<Pet> };
            providers: { Row: Provider; Insert: Partial<Provider>; Update: Partial<Provider> };
            vaccinations: { Row: Vaccination; Insert: Partial<Vaccination>; Update: Partial<Vaccination> };
            medical_visits: { Row: MedicalVisit; Insert: Partial<MedicalVisit>; Update: Partial<MedicalVisit> };
            medications: { Row: Medication; Insert: Partial<Medication>; Update: Partial<Medication> };
            allergies: { Row: Allergy; Insert: Partial<Allergy>; Update: Partial<Allergy> };
            weight_logs: { Row: WeightLog; Insert: Partial<WeightLog>; Update: Partial<WeightLog> };
            documents: { Row: Document; Insert: Partial<Document>; Update: Partial<Document> };
            travel_records: { Row: TravelRecord; Insert: Partial<TravelRecord>; Update: Partial<TravelRecord> };
            conditions: { Row: Condition; Insert: Partial<Condition>; Update: Partial<Condition> };
            activity_logs: { Row: ActivityLog; Insert: Partial<ActivityLog>; Update: Partial<ActivityLog> };
        }
    }
}
