import { Database } from './db';

export type User = {
  id: string;
  email?: string;
  created_at?: string;
};

export type Profile = Database['public']['Tables']['profiles']['Row'] & { gender?: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | null };
export type Pet = Database['public']['Tables']['pets']['Row'] & {
  registry_provider?: string | null;
  blood_type?: string;
  address_json?: any; // JSONB
  role?: 'owner' | 'co-owner' | 'viewer';
  height?: number | null;
  microchip_implantation_date?: string | null;
  sterilization_date?: string | null;
  // New Physical Attributes
  tail_length?: string | null;
  fur_description?: string | null;
  coat_type?: string | null;
  eye_color?: string | null;
  distinguishing_marks?: string | null;
  tattoo_id?: string | null;
};
export type Veterinarian = Database['public']['Tables']['veterinarians']['Row'] & {
  type?: 'clinic' | 'emergency' | 'specialist';
  location_lat?: number;
  location_lng?: number;
  place_id?: string;
  city?: string;
  zip_code?: string;
};
export type Condition = {
  id: string;
  pet_id: string;
  name: string;
  status: 'active' | 'resolved' | 'recurring';
  diagnosed_date: string;
  resolved_date?: string;
  notes?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  treatment_plan?: string;
};
export type Allergy = Database['public']['Tables']['allergies']['Row'] & {
  // Add support for alternate schema names or legacy fields
  allergen?: string; // Legacy alias for allergen_name
  allergen_name?: string; // Schema name
  type?: 'food' | 'environment' | 'medication'; // Legacy alias for allergy_type
  allergy_type?: string; // Schema name
  severity?: string; // Legacy alias for severity_level
  severity_level?: string; // Schema name
  reaction_description?: string;
};
export type BehaviorTag = Database['public']['Tables']['behavior_tags']['Row'];
export type MedicalHistory = Database['public']['Tables']['medical_history']['Row'];
export type Food = Database['public']['Tables']['food']['Row'];
// export type Treatment = Database['public']['Tables']['treatments']['Row'];
export type Treatment = {
  id: string;
  pet_id: string;
  treatment_name: string; // Mapped from name
  category?: string;
  start_date: string;
  end_date?: string | null;
  dosage?: string | null;
  frequency?: string | null;
  notes?: string | null; // Mapped from instructions
  is_active: boolean; // Mapped from is_ongoing
  created_at?: string;
  updated_at?: string;
};
export type Vaccination = Database['public']['Tables']['vaccinations']['Row'];
export type WeightEntry = Database['public']['Tables']['weight_logs']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type Document = Database['public']['Tables']['documents']['Row'];
export type MedicalVisit = Database['public']['Tables']['medical_visits']['Row'];
export type EmergencyContact = {
  id: string;
  pet_id: string;
  name: string;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CoOwnerPermissions = {
  scope: 'all' | 'selected';
  pet_ids: string[];
  access_level: 'admin' | 'editor' | 'viewer';
};

export type CoOwner = {
  id: string;
  main_owner_id: string;
  co_owner_id?: string | null;
  co_owner_email: string;
  status: 'pending' | 'accepted' | 'requested' | 'declined';
  created_by?: string | null;
  created_at?: string;
  permissions?: CoOwnerPermissions; // Added
  valid_until?: string | null; // Added
  invite_token?: string | null; // Added
};

export type VaccinationStatus = 'up-to-date' | 'due-soon' | 'overdue';
export type TreatmentStatus = 'active' | 'completed' | 'upcoming';

export type Medication = Database['public']['Tables']['medications']['Row'];
export type SharedLink = Database['public']['Tables']['shared_links']['Row'];
// Health Tab View Models
export interface HealthDashboardSummary {
  pet_id: string;
  health_score: number;
  weight_summary: {
    current: number | null;
    trend: 'increasing' | 'decreasing' | 'stable' | null;
    last_measured: string | null;
  };
  preventive_status: {
    vaccines_active: number;
    vaccines_overdue: number;
    meds_active: number;
  };
}

export interface VaccinationStatusView {
  id: string;
  pet_id: string;
  vaccine_name: string;
  date_given: string;
  next_due_date: string | null;
  status_code: 'overdue' | 'due_soon' | 'valid';
  category: 'core' | 'non-core';
  reminder_enabled: boolean;
}

export interface MedicationTrackerView {
  id: string;
  pet_id: string;
  medication_name: string;
  frequency: string | null;
  start_date: string;
  end_date: string | null;
  days_remaining: number | null;
  refill_status: 'refill_needed' | 'ok';
  next_due_date: string | null;
  dosage_value?: number | null;
  dosage_unit?: string | null;
}

export interface PreventiveCareStatusView {
  id: string;
  pet_id: string;
  treatment_name: string;
  category: 'preventive';
  is_active: boolean;
  next_due_date: string | null;
  frequency: string | null;
}
