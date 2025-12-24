import { Database } from './db';

export type User = {
  id: string;
  email?: string;
  created_at?: string;
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Pet = Database['public']['Tables']['pets']['Row'];
export type Veterinarian = Database['public']['Tables']['veterinarians']['Row'];
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
