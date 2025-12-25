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
export type Allergy = Database['public']['Tables']['allergies']['Row'];
export type BehaviorTag = Database['public']['Tables']['behavior_tags']['Row'];
export type MedicalHistory = Database['public']['Tables']['medical_history']['Row'];
export type Food = Database['public']['Tables']['food']['Row'];
export type Treatment = Database['public']['Tables']['treatments']['Row'];
export type Vaccination = Database['public']['Tables']['vaccinations']['Row'];
export type WeightEntry = Database['public']['Tables']['weight_entries']['Row'];
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
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row'];
