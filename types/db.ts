// Generated types for Supabase Database

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
      profiles: {
        Row: {
          id: string;
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          country_code: string | null;
          language_code: string | null;
          date_of_birth: string | null;
          photo_url: string | null;
          notification_prefs: Json | null;
          created_at: string | null;
          updated_at: string | null;
          address: string | null;
          location_lat: number | null;
          location_lng: number | null;
          place_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name?: string | null;
          last_name?: string | null;
          country_code?: string | null;
          language_code?: string | null;
          date_of_birth?: string | null;
          photo_url?: string | null;
          notification_prefs?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
          address?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          place_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          country_code?: string | null;
          language_code?: string | null;
          date_of_birth?: string | null;
          photo_url?: string | null;
          notification_prefs?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
          address?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          place_id?: string | null;
        };
      };
      pets: {
        Row: {
          id: string;
          created_at: string | null;
          name: string;
          species: string;
          breed: string | null;
          date_of_birth: string | null;
          weight: number | null;
          weight_unit: string | null;
          profile_id: string;
          photo_url: string | null;
          gender: string | null;
          is_spayed_neutered: boolean | null;
          microchip_number: string | null;
          notes: string | null;
          size: string | null;
          color: string | null;
          registration_id: string | null;
          photo_gallery: string[] | null;
          age_approximate: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          name: string;
          species: string;
          breed?: string | null;
          date_of_birth?: string | null;
          weight?: number | null;
          weight_unit?: string | null;
          profile_id: string;
          photo_url?: string | null;
          gender?: string | null;
          is_spayed_neutered?: boolean | null;
          microchip_number?: string | null;
          notes?: string | null;
          size?: string | null;
          color?: string | null;
          registration_id?: string | null;
          photo_gallery?: string[] | null;
          age_approximate?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          name?: string;
          species?: string;
          breed?: string | null;
          date_of_birth?: string | null;
          weight?: number | null;
          weight_unit?: string | null;
          profile_id?: string;
          photo_url?: string | null;
          gender?: string | null;
          is_spayed_neutered?: boolean | null;
          microchip_number?: string | null;
          notes?: string | null;
          size?: string | null;
          color?: string | null;
          registration_id?: string | null;
          photo_gallery?: string[] | null;
          age_approximate?: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          user_id: string;
          pet_id: string | null;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string | null;
          type: string | null;
          location: string | null;
          location_lat: number | null;
          location_lng: number | null;
          place_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          pet_id?: string | null;
          title: string;
          description?: string | null;
          start_time: string;
          end_time?: string | null;
          type?: string | null;
          location?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          place_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          pet_id?: string | null;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string | null;
          type?: string | null;
          location?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          place_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      vaccinations: {
        Row: {
          id: string;
          pet_id: string;
          vaccine_name: string;
          category: string;
          date_given: string;
          next_due_date: string | null;
          dose_number: number | null;
          administering_vet: string | null;
          notes: string | null;
          location: string | null;
          location_lat: number | null;
          location_lng: number | null;
          place_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          pet_id: string;
          vaccine_name: string;
          category?: string;
          date_given: string;
          next_due_date?: string | null;
          dose_number?: number | null;
          administering_vet?: string | null;
          notes?: string | null;
          location?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          place_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          pet_id?: string;
          vaccine_name?: string;
          category?: string;
          date_given?: string;
          next_due_date?: string | null;
          dose_number?: number | null;
          administering_vet?: string | null;
          notes?: string | null;
          location?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          place_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      // Add other tables as needed
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
