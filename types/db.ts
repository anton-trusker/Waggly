export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            activity_logs: {
                Row: {
                    id: string
                    profile_id: string
                    pet_id: string | null
                    activity_type: 'weight' | 'visit' | 'vaccination' | 'treatment' | 'document' | 'photo' | 'medication'
                    activity_data: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    profile_id: string
                    pet_id?: string | null
                    activity_type: string
                    activity_data?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    profile_id?: string
                    pet_id?: string | null
                    activity_type?: string
                    activity_data?: Json | null
                    created_at?: string
                }
            }
            allergies: {
                Row: {
                    id: string
                    pet_id: string
                    name: string
                    severity: string | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    name: string
                    severity?: string | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    name?: string
                    severity?: string | null
                    notes?: string | null
                    created_at?: string
                }
            }
            behavior_tags: {
                Row: {
                    id: string
                    pet_id: string
                    tag: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    tag: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    tag?: string
                    created_at?: string
                }
            }
            co_owners: {
                Row: {
                    id: string
                    main_owner_id: string
                    co_owner_id: string | null
                    co_owner_email: string
                    status: string
                    role: string
                    permissions: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    main_owner_id: string
                    co_owner_id?: string | null
                    co_owner_email: string
                    status: string
                    role?: string
                    permissions?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    main_owner_id?: string
                    co_owner_id?: string | null
                    co_owner_email?: string
                    status?: string
                    role?: string
                    permissions?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            documents: {
                Row: {
                    id: string
                    pet_id: string
                    name: string
                    type: string
                    url: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    name: string
                    type: string
                    url: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    name?: string
                    type?: string
                    url?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    pet_id: string
                    title: string
                    description: string | null
                    event_type: string
                    start_date: string
                    end_date: string | null
                    is_all_day: boolean
                    location: string | null
                    location_place_id: string | null
                    cost: number | null
                    currency: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    title: string
                    description?: string | null
                    event_type: string
                    start_date: string
                    end_date?: string | null
                    is_all_day?: boolean
                    location?: string | null
                    location_place_id?: string | null
                    cost?: number | null
                    currency?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    title?: string
                    description?: string | null
                    event_type?: string
                    start_date?: string
                    end_date?: string | null
                    is_all_day?: boolean
                    location?: string | null
                    location_place_id?: string | null
                    cost?: number | null
                    currency?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            food: {
                Row: {
                    id: string
                    pet_id: string
                    name: string
                    brand: string | null
                    type: string | null
                    amount: string | null
                    frequency: string | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    name: string
                    brand?: string | null
                    type?: string | null
                    amount?: string | null
                    frequency?: string | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    name?: string
                    brand?: string | null
                    type?: string | null
                    amount?: string | null
                    frequency?: string | null
                    notes?: string | null
                    created_at?: string
                }
            }
            medical_history: {
                Row: {
                    id: string
                    pet_id: string
                    condition: string
                    diagnosed_date: string | null
                    status: string
                    treatment: string | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    condition: string
                    diagnosed_date?: string | null
                    status: string
                    treatment?: string | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    condition?: string
                    diagnosed_date?: string | null
                    status?: string
                    treatment?: string | null
                    notes?: string | null
                    created_at?: string
                }
            }
            medical_visits: {
                Row: {
                    id: string
                    pet_id: string
                    date: string
                    visit_type: string // Added
                    urgency: string | null // Added
                    reason: string
                    symptoms: string[] | null // Added
                    diagnosis: string | null // Added
                    clinic_name: string | null
                    clinic_address: string | null // Added
                    vet_name: string | null
                    notes: string | null
                    cost: number | null
                    currency: string | null
                    follow_up_date: string | null // Added
                    created_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    date: string
                    visit_type?: string // Added
                    urgency?: string | null // Added
                    reason: string
                    symptoms?: string[] | null // Added
                    diagnosis?: string | null // Added
                    clinic_name?: string | null
                    clinic_address?: string | null // Added
                    vet_name?: string | null
                    notes?: string | null
                    cost?: number | null
                    currency?: string | null
                    follow_up_date?: string | null // Added
                    created_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    date?: string
                    visit_type?: string // Added
                    urgency?: string | null // Added
                    reason?: string
                    symptoms?: string[] | null // Added
                    diagnosis?: string | null // Added
                    clinic_name?: string | null
                    clinic_address?: string | null // Added
                    vet_name?: string | null
                    notes?: string | null
                    cost?: number | null
                    currency?: string | null
                    follow_up_date?: string | null // Added
                    created_at?: string
                }
            }
            health_metrics: { // New Table
                Row: {
                    id: string
                    pet_id: string
                    date: string
                    weight: number | null
                    weight_unit: string | null
                    temperature: number | null
                    temperature_unit: string | null
                    heart_rate: number | null
                    respiratory_rate: number | null
                    body_condition_score: number | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    date: string
                    weight?: number | null
                    weight_unit?: string | null
                    temperature?: number | null
                    temperature_unit?: string | null
                    heart_rate?: number | null
                    respiratory_rate?: number | null
                    body_condition_score?: number | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    date?: string
                    weight?: number | null
                    weight_unit?: string | null
                    temperature?: number | null
                    temperature_unit?: string | null
                    heart_rate?: number | null
                    respiratory_rate?: number | null
                    body_condition_score?: number | null
                    notes?: string | null
                    created_at?: string
                }
            }
            medications: {
                Row: {
                    id: string
                    pet_id: string
                    name: string
                    dosage_value: number | null
                    dosage_unit: string | null
                    frequency: string | null
                    start_date: string | null
                    end_date: string | null
                    reminders_enabled: boolean
                    cost: number | null
                    currency: string | null
                    notes: string | null
                    attachments: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    name: string
                    dosage_value?: number | null
                    dosage_unit?: string | null
                    frequency?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    reminders_enabled?: boolean
                    cost?: number | null
                    currency?: string | null
                    notes?: string | null
                    attachments?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    name?: string
                    dosage_value?: number | null
                    dosage_unit?: string | null
                    frequency?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    reminders_enabled?: boolean
                    cost?: number | null
                    currency?: string | null
                    notes?: string | null
                    attachments?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    message: string
                    type: string
                    read: boolean
                    data: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    message: string
                    type: string
                    read?: boolean
                    data?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    message?: string
                    type?: string
                    read?: boolean
                    data?: Json | null
                    created_at?: string
                }
            }
            pets: {
                Row: {
                    id: string
                    owner_id: string
                    name: string
                    species: string
                    breed: string | null
                    birth_date: string | null
                    gender: string | null
                    weight: number | null
                    weight_unit: string | null
                    color: string | null
                    chip_number: string | null
                    photo_url: string | null
                    registry_provider: string | null
                    blood_type: string | null
                    address_json: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    owner_id: string
                    name: string
                    species: string
                    breed?: string | null
                    birth_date?: string | null
                    gender?: string | null
                    weight?: number | null
                    weight_unit?: string | null
                    color?: string | null
                    chip_number?: string | null
                    photo_url?: string | null
                    registry_provider?: string | null
                    blood_type?: string | null
                    address_json?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    owner_id?: string
                    name?: string
                    species?: string
                    breed?: string | null
                    birth_date?: string | null
                    gender?: string | null
                    weight?: number | null
                    weight_unit?: string | null
                    color?: string | null
                    chip_number?: string | null
                    photo_url?: string | null
                    registry_provider?: string | null
                    blood_type?: string | null
                    address_json?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string
                    first_name: string | null
                    last_name: string | null
                    photo_url: string | null
                    country: string | null
                    date_of_birth: string | null
                    onboarding_completed: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    first_name?: string | null
                    last_name?: string | null
                    photo_url?: string | null
                    country?: string | null
                    date_of_birth?: string | null
                    onboarding_completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    first_name?: string | null
                    last_name?: string | null
                    photo_url?: string | null
                    country?: string | null
                    date_of_birth?: string | null
                    onboarding_completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            shared_links: {
                Row: {
                    id: string
                    pet_id: string
                    token: string
                    profile_id: string
                    expires_at: string | null
                    view_count: number
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    token: string
                    profile_id: string
                    expires_at?: string | null
                    view_count?: number
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    token?: string
                    profile_id?: string
                    expires_at?: string | null
                    view_count?: number
                    is_active?: boolean
                    created_at?: string
                }
            }
            treatments: {
                Row: {
                    id: string
                    pet_id: string
                    type: string
                    notes: string | null
                    date: string
                    is_active: boolean
                    dosage_value: number | null
                    dosage_unit: string | null
                    frequency: string | null
                    provider: string | null
                    cost: number | null
                    currency: string | null
                    next_due_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    type: string
                    notes?: string | null
                    date: string
                    is_active?: boolean
                    dosage_value?: number | null
                    dosage_unit?: string | null
                    frequency?: string | null
                    provider?: string | null
                    cost?: number | null
                    currency?: string | null
                    next_due_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    type?: string
                    notes?: string | null
                    date?: string
                    is_active?: boolean
                    dosage_value?: number | null
                    dosage_unit?: string | null
                    frequency?: string | null
                    provider?: string | null
                    cost?: number | null
                    currency?: string | null
                    next_due_date?: string | null
                    created_at?: string
                }
            }
            vaccinations: {
                Row: {
                    id: string
                    pet_id: string
                    name: string
                    date: string
                    next_due_date: string | null
                    notes: string | null
                    dose_number: number | null
                    provider: string | null
                    batch_number: string | null
                    cost: number | null
                    currency: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    name: string
                    date: string
                    next_due_date?: string | null
                    notes?: string | null
                    dose_number?: number | null
                    provider?: string | null
                    batch_number?: string | null
                    cost?: number | null
                    currency?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    name?: string
                    date?: string
                    next_due_date?: string | null
                    notes?: string | null
                    dose_number?: number | null
                    provider?: string | null
                    batch_number?: string | null
                    cost?: number | null
                    currency?: string | null
                    created_at?: string
                }
            }
            veterinarians: {
                Row: {
                    id: string
                    name: string
                    clinic_name: string | null
                    phone: string | null
                    email: string | null
                    address: string | null
                    type: string | null
                    location_lat: number | null
                    location_lng: number | null
                    place_id: string | null
                    city: string | null
                    zip_code: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    clinic_name?: string | null
                    phone?: string | null
                    email?: string | null
                    address?: string | null
                    type?: string | null
                    location_lat?: number | null
                    location_lng?: number | null
                    place_id?: string | null
                    city?: string | null
                    zip_code?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    clinic_name?: string | null
                    phone?: string | null
                    email?: string | null
                    address?: string | null
                    type?: string | null
                    location_lat?: number | null
                    location_lng?: number | null
                    place_id?: string | null
                    city?: string | null
                    zip_code?: string | null
                    created_at?: string
                }
            }
            weight_entries: {
                Row: {
                    id: string
                    pet_id: string
                    weight: number
                    unit: string
                    date: string
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    pet_id: string
                    weight: number
                    unit: string
                    date: string
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    pet_id?: string
                    weight?: number
                    unit?: string
                    date?: string
                    notes?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
