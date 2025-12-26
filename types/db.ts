export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          id: string
          pet_id: string | null
          profile_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          id?: string
          pet_id?: string | null
          profile_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          id?: string
          pet_id?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      allergies: {
        Row: {
          allergen: string
          allergy_alert_enabled: boolean | null
          allergy_type: string | null
          avoidance_measures: Json | null
          created_at: string | null
          current_treatment: Json | null
          diagnosed_by: string | null
          diagnosed_date: string | null
          diagnostic_test: string | null
          emergency_contact_plan: Json | null
          emergency_medications: Json | null
          id: string
          notes: string | null
          peak_months: string | null
          pet_id: string
          quality_of_life_impact: number | null
          reaction_description: string | null
          reaction_timeline: string | null
          reminder_enabled: boolean | null
          reminder_type: string | null
          safe_alternatives: Json | null
          seasonal_pattern: Json | null
          severity_level: string | null
          shared_with_vets: Json | null
          symptom_onset: string | null
          symptoms: Json | null
          test_results_document_id: string | null
          treatment_effectiveness: string | null
          triggers: Json | null
          type: string
          updated_at: string | null
          vaccination_considerations: string | null
          vet_aware: boolean | null
        }
        Insert: {
          allergen: string
          allergy_alert_enabled?: boolean | null
          allergy_type?: string | null
          avoidance_measures?: Json | null
          created_at?: string | null
          current_treatment?: Json | null
          diagnosed_by?: string | null
          diagnosed_date?: string | null
          diagnostic_test?: string | null
          emergency_contact_plan?: Json | null
          emergency_medications?: Json | null
          id?: string
          notes?: string | null
          peak_months?: string | null
          pet_id: string
          quality_of_life_impact?: number | null
          reaction_description?: string | null
          reaction_timeline?: string | null
          reminder_enabled?: boolean | null
          reminder_type?: string | null
          safe_alternatives?: Json | null
          seasonal_pattern?: Json | null
          severity_level?: string | null
          shared_with_vets?: Json | null
          symptom_onset?: string | null
          symptoms?: Json | null
          test_results_document_id?: string | null
          treatment_effectiveness?: string | null
          triggers?: Json | null
          type: string
          updated_at?: string | null
          vaccination_considerations?: string | null
          vet_aware?: boolean | null
        }
        Update: {
          allergen?: string
          allergy_alert_enabled?: boolean | null
          allergy_type?: string | null
          avoidance_measures?: Json | null
          created_at?: string | null
          current_treatment?: Json | null
          diagnosed_by?: string | null
          diagnosed_date?: string | null
          diagnostic_test?: string | null
          emergency_contact_plan?: Json | null
          emergency_medications?: Json | null
          id?: string
          notes?: string | null
          peak_months?: string | null
          pet_id?: string
          quality_of_life_impact?: number | null
          reaction_description?: string | null
          reaction_timeline?: string | null
          reminder_enabled?: boolean | null
          reminder_type?: string | null
          safe_alternatives?: Json | null
          seasonal_pattern?: Json | null
          severity_level?: string | null
          shared_with_vets?: Json | null
          symptom_onset?: string | null
          symptoms?: Json | null
          test_results_document_id?: string | null
          treatment_effectiveness?: string | null
          triggers?: Json | null
          type?: string
          updated_at?: string | null
          vaccination_considerations?: string | null
          vet_aware?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "allergies_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allergies_test_results_document_id_fkey"
            columns: ["test_results_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      behavior_tags: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          pet_id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          pet_id: string
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          pet_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "behavior_tags_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      breeds: {
        Row: {
          id: string
          name: string
          species: string
        }
        Insert: {
          id?: string
          name: string
          species: string
        }
        Update: {
          id?: string
          name?: string
          species?: string
        }
        Relationships: []
      }
      care_notes: {
        Row: {
          created_at: string | null
          grooming_frequency: string | null
          handling_tips: string | null
          id: string
          pet_id: string
          updated_at: string | null
          walk_routine: string | null
        }
        Insert: {
          created_at?: string | null
          grooming_frequency?: string | null
          handling_tips?: string | null
          id?: string
          pet_id: string
          updated_at?: string | null
          walk_routine?: string | null
        }
        Update: {
          created_at?: string | null
          grooming_frequency?: string | null
          handling_tips?: string | null
          id?: string
          pet_id?: string
          updated_at?: string | null
          walk_routine?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care_notes_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      co_owners: {
        Row: {
          co_owner_email: string
          co_owner_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          invite_token: string | null
          main_owner_id: string
          permissions: Json | null
          role: string | null
          status: string
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          co_owner_email: string
          co_owner_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          invite_token?: string | null
          main_owner_id: string
          permissions?: Json | null
          role?: string | null
          status: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          co_owner_email?: string
          co_owner_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          invite_token?: string | null
          main_owner_id?: string
          permissions?: Json | null
          role?: string | null
          status?: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      conditions: {
        Row: {
          created_at: string | null
          diagnosed_date: string | null
          id: string
          name: string
          notes: string | null
          pet_id: string
          resolved_date: string | null
          severity: string | null
          status: string | null
          treatment_plan: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          diagnosed_date?: string | null
          id?: string
          name: string
          notes?: string | null
          pet_id: string
          resolved_date?: string | null
          severity?: string | null
          status?: string | null
          treatment_plan?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          diagnosed_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          pet_id?: string
          resolved_date?: string | null
          severity?: string | null
          status?: string | null
          treatment_plan?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conditions_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          archived: boolean | null
          auto_archive_date: string | null
          confidentiality_level: string | null
          created_at: string
          document_date: string | null
          document_range_end: string | null
          document_range_start: string | null
          document_source: string | null
          file_name: string
          file_url: string
          id: string
          linked_records: Json | null
          manual_details: Json | null
          metadata: Json | null
          notify_recipients: boolean | null
          ocr_confidence_score: number | null
          ocr_data: Json | null
          pet_id: string
          shared_with_users: Json | null
          shared_with_vets: Json | null
          tags: Json | null
          title: string | null
          type: string
          updated_at: string
          visibility: string | null
        }
        Insert: {
          archived?: boolean | null
          auto_archive_date?: string | null
          confidentiality_level?: string | null
          created_at?: string
          document_date?: string | null
          document_range_end?: string | null
          document_range_start?: string | null
          document_source?: string | null
          file_name: string
          file_url: string
          id?: string
          linked_records?: Json | null
          manual_details?: Json | null
          metadata?: Json | null
          notify_recipients?: boolean | null
          ocr_confidence_score?: number | null
          ocr_data?: Json | null
          pet_id: string
          shared_with_users?: Json | null
          shared_with_vets?: Json | null
          tags?: Json | null
          title?: string | null
          type: string
          updated_at?: string
          visibility?: string | null
        }
        Update: {
          archived?: boolean | null
          auto_archive_date?: string | null
          confidentiality_level?: string | null
          created_at?: string
          document_date?: string | null
          document_range_end?: string | null
          document_range_start?: string | null
          document_source?: string | null
          file_name?: string
          file_url?: string
          id?: string
          linked_records?: Json | null
          manual_details?: Json | null
          metadata?: Json | null
          notify_recipients?: boolean | null
          ocr_confidence_score?: number | null
          ocr_data?: Json | null
          pet_id?: string
          shared_with_users?: Json | null
          shared_with_vets?: Json | null
          tags?: Json | null
          title?: string | null
          type?: string
          updated_at?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cost: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          end_time: string | null
          id: string
          location: string | null
          location_lat: number | null
          location_lng: number | null
          location_place_id: string | null
          pet_id: string | null
          place_id: string | null
          start_time: string
          title: string
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_place_id?: string | null
          pet_id?: string | null
          place_id?: string | null
          start_time: string
          title: string
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_place_id?: string | null
          pet_id?: string | null
          place_id?: string | null
          start_time?: string
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      food: {
        Row: {
          amount: string | null
          brand: string | null
          created_at: string | null
          diet_notes: string | null
          feeding_schedule: string | null
          feeding_times: string[] | null
          food_type: string | null
          id: string
          meals_per_day: number | null
          pet_id: string
          updated_at: string | null
        }
        Insert: {
          amount?: string | null
          brand?: string | null
          created_at?: string | null
          diet_notes?: string | null
          feeding_schedule?: string | null
          feeding_times?: string[] | null
          food_type?: string | null
          id?: string
          meals_per_day?: number | null
          pet_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: string | null
          brand?: string | null
          created_at?: string | null
          diet_notes?: string | null
          feeding_schedule?: string | null
          feeding_times?: string[] | null
          food_type?: string | null
          id?: string
          meals_per_day?: number | null
          pet_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      health_metrics: {
        Row: {
          activity_level: string | null
          activity_observations: string | null
          appetite_level: string | null
          appetite_notes: string | null
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          coat_condition: string | null
          coat_notes: string | null
          consultation_reasons: Json | null
          girth_circumference: number | null
          girth_unit: string | null
          height_at_shoulder: number | null
          height_unit: string | null
          hydration_status: string | null
          id: string
          lab_results: Json | null
          length_unit: string | null
          length_value: number | null
          measured_at: string | null
          measured_by: string | null
          measurement_location: string | null
          pain_observations: string | null
          pain_score: number | null
          pet_id: string
          veterinary_consultation_needed: boolean | null
          weight: number | null
          weight_change_percent: number | null
          weight_trend: string | null
        }
        Insert: {
          activity_level?: string | null
          activity_observations?: string | null
          appetite_level?: string | null
          appetite_notes?: string | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          coat_condition?: string | null
          coat_notes?: string | null
          consultation_reasons?: Json | null
          girth_circumference?: number | null
          girth_unit?: string | null
          height_at_shoulder?: number | null
          height_unit?: string | null
          hydration_status?: string | null
          id?: string
          lab_results?: Json | null
          length_unit?: string | null
          length_value?: number | null
          measured_at?: string | null
          measured_by?: string | null
          measurement_location?: string | null
          pain_observations?: string | null
          pain_score?: number | null
          pet_id: string
          veterinary_consultation_needed?: boolean | null
          weight?: number | null
          weight_change_percent?: number | null
          weight_trend?: string | null
        }
        Update: {
          activity_level?: string | null
          activity_observations?: string | null
          appetite_level?: string | null
          appetite_notes?: string | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          coat_condition?: string | null
          coat_notes?: string | null
          consultation_reasons?: Json | null
          girth_circumference?: number | null
          girth_unit?: string | null
          height_at_shoulder?: number | null
          height_unit?: string | null
          hydration_status?: string | null
          id?: string
          lab_results?: Json | null
          length_unit?: string | null
          length_value?: number | null
          measured_at?: string | null
          measured_by?: string | null
          measurement_location?: string | null
          pain_observations?: string | null
          pain_score?: number | null
          pet_id?: string
          veterinary_consultation_needed?: boolean | null
          weight?: number | null
          weight_change_percent?: number | null
          weight_trend?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_metrics_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_queue: {
        Row: {
          body: string
          created_at: string | null
          id: string
          status: string | null
          subject: string
          to_email: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          status?: string | null
          subject: string
          to_email: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          status?: string | null
          subject?: string
          to_email?: string
        }
        Relationships: []
      }
      medical_history: {
        Row: {
          created_at: string | null
          id: string
          pet_id: string
          summary: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pet_id: string
          summary: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pet_id?: string
          summary?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_history_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_visits: {
        Row: {
          attachments: Json | null
          business_email: string | null
          business_lat: number | null
          business_lng: number | null
          business_name: string | null
          business_phone: string | null
          business_place_id: string | null
          business_website: string | null
          clinic_name: string | null
          cost: number | null
          cost_breakdown: Json | null
          created_at: string
          currency: string | null
          current_medications: Json | null
          date: string
          diagnosis: string | null
          distance_km: number | null
          duration_minutes: number | null
          id: string
          insurance_claim_status: string | null
          insurance_provider: string | null
          invoice_document_id: string | null
          notes: string | null
          payment_method: string | null
          pet_id: string
          provider_name: string | null
          provider_type: string | null
          reason: string
          recommendations: Json | null
          reminder_date: string | null
          reminder_enabled: boolean | null
          reminder_type: string | null
          service_category: string | null
          shared_with: Json | null
          special_instructions: string | null
          updated_at: string
          vet_name: string | null
          visit_time: string | null
        }
        Insert: {
          attachments?: Json | null
          business_email?: string | null
          business_lat?: number | null
          business_lng?: number | null
          business_name?: string | null
          business_phone?: string | null
          business_place_id?: string | null
          business_website?: string | null
          clinic_name?: string | null
          cost?: number | null
          cost_breakdown?: Json | null
          created_at?: string
          currency?: string | null
          current_medications?: Json | null
          date: string
          diagnosis?: string | null
          distance_km?: number | null
          duration_minutes?: number | null
          id?: string
          insurance_claim_status?: string | null
          insurance_provider?: string | null
          invoice_document_id?: string | null
          notes?: string | null
          payment_method?: string | null
          pet_id: string
          provider_name?: string | null
          provider_type?: string | null
          reason: string
          recommendations?: Json | null
          reminder_date?: string | null
          reminder_enabled?: boolean | null
          reminder_type?: string | null
          service_category?: string | null
          shared_with?: Json | null
          special_instructions?: string | null
          updated_at?: string
          vet_name?: string | null
          visit_time?: string | null
        }
        Update: {
          attachments?: Json | null
          business_email?: string | null
          business_lat?: number | null
          business_lng?: number | null
          business_name?: string | null
          business_phone?: string | null
          business_place_id?: string | null
          business_website?: string | null
          clinic_name?: string | null
          cost?: number | null
          cost_breakdown?: Json | null
          created_at?: string
          currency?: string | null
          current_medications?: Json | null
          date?: string
          diagnosis?: string | null
          distance_km?: number | null
          duration_minutes?: number | null
          id?: string
          insurance_claim_status?: string | null
          insurance_provider?: string | null
          invoice_document_id?: string | null
          notes?: string | null
          payment_method?: string | null
          pet_id?: string
          provider_name?: string | null
          provider_type?: string | null
          reason?: string
          recommendations?: Json | null
          reminder_date?: string | null
          reminder_enabled?: boolean | null
          reminder_type?: string | null
          service_category?: string | null
          shared_with?: Json | null
          special_instructions?: string | null
          updated_at?: string
          vet_name?: string | null
          visit_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_visits_invoice_document_id_fkey"
            columns: ["invoice_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_visits_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          administration_instructions: string | null
          administration_times: Json | null
          attachments: string[] | null
          auto_refill: boolean | null
          best_time_to_give: Json | null
          condition_being_treated: string | null
          contraindications: string | null
          cost: number | null
          created_at: string | null
          currency: string | null
          dosage_unit: string | null
          dosage_value: number | null
          duration_unit: string | null
          duration_value: number | null
          end_date: string | null
          form: string | null
          frequency: string | null
          id: string
          insurance_coverage_percent: number | null
          interactions: Json | null
          is_ongoing: boolean | null
          monitor_for: Json | null
          name: string
          notes: string | null
          out_of_pocket_cost: number | null
          pet_id: string
          pharmacy_name: string | null
          pharmacy_place_id: string | null
          prescribed_by: string | null
          prescription_document_id: string | null
          prescription_number: string | null
          quantity: number | null
          reason_for_treatment: string | null
          refill_schedule: Json | null
          reminder_before_minutes: number | null
          reminder_calendar_event: boolean | null
          reminder_notify_caregivers: Json | null
          reminders_enabled: boolean | null
          severity_rating: string | null
          side_effects: Json | null
          start_date: string | null
          storage_instructions: string | null
          strength: string | null
          total_cost: number | null
          treatment_type: string | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          administration_instructions?: string | null
          administration_times?: Json | null
          attachments?: string[] | null
          auto_refill?: boolean | null
          best_time_to_give?: Json | null
          condition_being_treated?: string | null
          contraindications?: string | null
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          dosage_unit?: string | null
          dosage_value?: number | null
          duration_unit?: string | null
          duration_value?: number | null
          end_date?: string | null
          form?: string | null
          frequency?: string | null
          id?: string
          insurance_coverage_percent?: number | null
          interactions?: Json | null
          is_ongoing?: boolean | null
          monitor_for?: Json | null
          name: string
          notes?: string | null
          out_of_pocket_cost?: number | null
          pet_id: string
          pharmacy_name?: string | null
          pharmacy_place_id?: string | null
          prescribed_by?: string | null
          prescription_document_id?: string | null
          prescription_number?: string | null
          quantity?: number | null
          reason_for_treatment?: string | null
          refill_schedule?: Json | null
          reminder_before_minutes?: number | null
          reminder_calendar_event?: boolean | null
          reminder_notify_caregivers?: Json | null
          reminders_enabled?: boolean | null
          severity_rating?: string | null
          side_effects?: Json | null
          start_date?: string | null
          storage_instructions?: string | null
          strength?: string | null
          total_cost?: number | null
          treatment_type?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          administration_instructions?: string | null
          administration_times?: Json | null
          attachments?: string[] | null
          auto_refill?: boolean | null
          best_time_to_give?: Json | null
          condition_being_treated?: string | null
          contraindications?: string | null
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          dosage_unit?: string | null
          dosage_value?: number | null
          duration_unit?: string | null
          duration_value?: number | null
          end_date?: string | null
          form?: string | null
          frequency?: string | null
          id?: string
          insurance_coverage_percent?: number | null
          interactions?: Json | null
          is_ongoing?: boolean | null
          monitor_for?: Json | null
          name?: string
          notes?: string | null
          out_of_pocket_cost?: number | null
          pet_id?: string
          pharmacy_name?: string | null
          pharmacy_place_id?: string | null
          prescribed_by?: string | null
          prescription_document_id?: string | null
          prescription_number?: string | null
          quantity?: number | null
          reason_for_treatment?: string | null
          refill_schedule?: Json | null
          reminder_before_minutes?: number | null
          reminder_calendar_event?: boolean | null
          reminder_notify_caregivers?: Json | null
          reminders_enabled?: boolean | null
          severity_rating?: string | null
          side_effects?: Json | null
          start_date?: string | null
          storage_instructions?: string | null
          strength?: string | null
          total_cost?: number | null
          treatment_type?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_prescription_document_id_fkey"
            columns: ["prescription_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: string
          is_read: boolean | null
          message: string
          pet_id: string | null
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          pet_id?: string | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          pet_id?: string | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_photos: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          is_favorite: boolean | null
          pet_id: string
          url: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          pet_id: string
          url: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          pet_id?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_photos_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          address_json: Json | null
          age_approximate: string | null
          blood_type: string | null
          breed: string | null
          color: string | null
          created_at: string | null
          date_of_birth: string | null
          gender: string | null
          id: string
          is_spayed_neutered: boolean | null
          microchip_number: string | null
          name: string
          photo_gallery: string[] | null
          photo_url: string | null
          registration_id: string | null
          size: string | null
          species: string
          updated_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          address_json?: Json | null
          age_approximate?: string | null
          blood_type?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          gender?: string | null
          id?: string
          is_spayed_neutered?: boolean | null
          microchip_number?: string | null
          name: string
          photo_gallery?: string[] | null
          photo_url?: string | null
          registration_id?: string | null
          size?: string | null
          species: string
          updated_at?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          address_json?: Json | null
          age_approximate?: string | null
          blood_type?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          gender?: string | null
          id?: string
          is_spayed_neutered?: boolean | null
          microchip_number?: string | null
          name?: string
          photo_gallery?: string[] | null
          photo_url?: string | null
          registration_id?: string | null
          size?: string | null
          species?: string
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          bio: string | null
          country_code: string | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string | null
          gender: string | null
          id: string
          language_code: string | null
          last_name: string | null
          location_lat: number | null
          location_lng: number | null
          notification_prefs: Json | null
          phone: string | null
          photo_url: string | null
          place_id: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          country_code?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          id: string
          language_code?: string | null
          last_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          notification_prefs?: Json | null
          phone?: string | null
          photo_url?: string | null
          place_id?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          country_code?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          language_code?: string | null
          last_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          notification_prefs?: Json | null
          phone?: string | null
          photo_url?: string | null
          place_id?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      public_shares: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          pet_id: string
          settings: Json | null
          token: string
          valid_until: string | null
          views: number | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          pet_id: string
          settings?: Json | null
          token: string
          valid_until?: string | null
          views?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          pet_id?: string
          settings?: Json | null
          token?: string
          valid_until?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_shares_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      ref_allergens: {
        Row: {
          allergen_name: string
          allergen_type: string | null
          common_reactions: Json | null
          created_at: string | null
          id: string
        }
        Insert: {
          allergen_name: string
          allergen_type?: string | null
          common_reactions?: Json | null
          created_at?: string | null
          id?: string
        }
        Update: {
          allergen_name?: string
          allergen_type?: string | null
          common_reactions?: Json | null
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      ref_medications: {
        Row: {
          active_ingredient: string | null
          brand_names: Json | null
          category: string | null
          common_uses: string | null
          contraindications: string | null
          created_at: string | null
          id: string
          medication_name: string
          side_effects: Json | null
          typical_dosage_range: string | null
          updated_at: string | null
        }
        Insert: {
          active_ingredient?: string | null
          brand_names?: Json | null
          category?: string | null
          common_uses?: string | null
          contraindications?: string | null
          created_at?: string | null
          id?: string
          medication_name: string
          side_effects?: Json | null
          typical_dosage_range?: string | null
          updated_at?: string | null
        }
        Update: {
          active_ingredient?: string | null
          brand_names?: Json | null
          category?: string | null
          common_uses?: string | null
          contraindications?: string | null
          created_at?: string | null
          id?: string
          medication_name?: string
          side_effects?: Json | null
          typical_dosage_range?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ref_symptoms: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          severity_indicator: boolean | null
          symptom_name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          severity_indicator?: boolean | null
          symptom_name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          severity_indicator?: boolean | null
          symptom_name?: string
        }
        Relationships: []
      }
      ref_vaccines: {
        Row: {
          abbreviation: string | null
          booster_interval: string | null
          created_at: string | null
          description: string | null
          id: string
          species: string
          typical_schedule: string | null
          updated_at: string | null
          vaccine_name: string
          vaccine_type: string | null
        }
        Insert: {
          abbreviation?: string | null
          booster_interval?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          species: string
          typical_schedule?: string | null
          updated_at?: string | null
          vaccine_name: string
          vaccine_type?: string | null
        }
        Update: {
          abbreviation?: string | null
          booster_interval?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          species?: string
          typical_schedule?: string | null
          updated_at?: string | null
          vaccine_name?: string
          vaccine_type?: string | null
        }
        Relationships: []
      }
      reference_breeds: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          name: string
          species: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name: string
          species: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          species?: string
        }
        Relationships: []
      }
      reference_treatments: {
        Row: {
          category: string
          default_frequency: string | null
          description: string | null
          id: string
          name: string
          validity_days: number | null
        }
        Insert: {
          category: string
          default_frequency?: string | null
          description?: string | null
          id?: string
          name: string
          validity_days?: number | null
        }
        Update: {
          category?: string
          default_frequency?: string | null
          description?: string | null
          id?: string
          name?: string
          validity_days?: number | null
        }
        Relationships: []
      }
      reference_vaccinations: {
        Row: {
          category: string
          description: string | null
          id: string
          name: string
          species: string
          validity_months: number | null
        }
        Insert: {
          category: string
          description?: string | null
          id?: string
          name: string
          species: string
          validity_months?: number | null
        }
        Update: {
          category?: string
          description?: string | null
          id?: string
          name?: string
          species?: string
          validity_months?: number | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json
        }
        Relationships: []
      }
      settings: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      shared_links: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          pet_id: string
          profile_id: string
          token: string
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          pet_id: string
          profile_id: string
          token: string
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          pet_id?: string
          profile_id?: string
          token?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_links_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          created_at: string
          id: number
          key: string
          language_code: string
          namespace: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: number
          key: string
          language_code: string
          namespace?: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: number
          key?: string
          language_code?: string
          namespace?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      treatments: {
        Row: {
          category: string
          cost: number | null
          created_at: string | null
          currency: string | null
          dosage: string | null
          dosage_unit: string | null
          dosage_value: number | null
          end_date: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          next_due_date: string | null
          notes: string | null
          pet_id: string
          provider: string | null
          start_date: string
          time_of_day: string | null
          treatment_name: string
          updated_at: string | null
          vet: string | null
        }
        Insert: {
          category: string
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          dosage?: string | null
          dosage_unit?: string | null
          dosage_value?: number | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          next_due_date?: string | null
          notes?: string | null
          pet_id: string
          provider?: string | null
          start_date: string
          time_of_day?: string | null
          treatment_name: string
          updated_at?: string | null
          vet?: string | null
        }
        Update: {
          category?: string
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          dosage?: string | null
          dosage_unit?: string | null
          dosage_value?: number | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          next_due_date?: string | null
          notes?: string | null
          pet_id?: string
          provider?: string | null
          start_date?: string
          time_of_day?: string | null
          treatment_name?: string
          updated_at?: string | null
          vet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown
          refresh_token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown
          refresh_token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          refresh_token?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_login_at: string | null
          metadata: Json | null
          name: string
          password_hash: string
          role_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          last_login_at?: string | null
          metadata?: Json | null
          name: string
          password_hash: string
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_login_at?: string | null
          metadata?: Json | null
          name?: string
          password_hash?: string
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccinations: {
        Row: {
          administered_by: string | null
          administered_time: string | null
          administering_vet: string | null
          batch_number: string | null
          category: string
          certificate_document_id: string | null
          clinic_place_id: string | null
          cost: number | null
          created_at: string | null
          currency: string | null
          date_given: string
          dose_number: number | null
          id: string
          insurance_provider: string | null
          location: string | null
          location_lat: number | null
          location_lng: number | null
          manufacturer: string | null
          next_due_date: string | null
          notes: string | null
          payment_method: string | null
          pet_id: string
          place_id: string | null
          provider: string | null
          reaction_severity: string | null
          reactions: Json | null
          reminder_days_before: number | null
          reminder_enabled: boolean | null
          reminder_methods: Json | null
          reminder_recipients: Json | null
          route_of_administration: string | null
          schedule_interval: string | null
          updated_at: string | null
          vaccination_type: string | null
          vaccine_name: string
        }
        Insert: {
          administered_by?: string | null
          administered_time?: string | null
          administering_vet?: string | null
          batch_number?: string | null
          category: string
          certificate_document_id?: string | null
          clinic_place_id?: string | null
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          date_given: string
          dose_number?: number | null
          id?: string
          insurance_provider?: string | null
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          manufacturer?: string | null
          next_due_date?: string | null
          notes?: string | null
          payment_method?: string | null
          pet_id: string
          place_id?: string | null
          provider?: string | null
          reaction_severity?: string | null
          reactions?: Json | null
          reminder_days_before?: number | null
          reminder_enabled?: boolean | null
          reminder_methods?: Json | null
          reminder_recipients?: Json | null
          route_of_administration?: string | null
          schedule_interval?: string | null
          updated_at?: string | null
          vaccination_type?: string | null
          vaccine_name: string
        }
        Update: {
          administered_by?: string | null
          administered_time?: string | null
          administering_vet?: string | null
          batch_number?: string | null
          category?: string
          certificate_document_id?: string | null
          clinic_place_id?: string | null
          cost?: number | null
          created_at?: string | null
          currency?: string | null
          date_given?: string
          dose_number?: number | null
          id?: string
          insurance_provider?: string | null
          location?: string | null
          location_lat?: number | null
          location_lng?: number | null
          manufacturer?: string | null
          next_due_date?: string | null
          notes?: string | null
          payment_method?: string | null
          pet_id?: string
          place_id?: string | null
          provider?: string | null
          reaction_severity?: string | null
          reactions?: Json | null
          reminder_days_before?: number | null
          reminder_enabled?: boolean | null
          reminder_methods?: Json | null
          reminder_recipients?: Json | null
          route_of_administration?: string | null
          schedule_interval?: string | null
          updated_at?: string | null
          vaccination_type?: string | null
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccinations_certificate_document_id_fkey"
            columns: ["certificate_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccinations_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinarians: {
        Row: {
          address: string | null
          city: string | null
          clinic_name: string
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          location_lat: number | null
          location_lng: number | null
          pet_id: string
          phone: string | null
          place_id: string | null
          type: string | null
          updated_at: string | null
          vet_name: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          clinic_name: string
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          pet_id: string
          phone?: string | null
          place_id?: string | null
          type?: string | null
          updated_at?: string | null
          vet_name?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          clinic_name?: string
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          pet_id?: string
          phone?: string | null
          place_id?: string | null
          type?: string | null
          updated_at?: string | null
          vet_name?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veterinarians_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_entries: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          pet_id: string
          weight: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          pet_id: string
          weight: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          pet_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "weight_entries_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_pet_details: { Args: { share_token: string }; Returns: Json }
      get_user_details: {
        Args: { user_ids: string[] }
        Returns: {
          email: string
          first_name: string
          id: string
          last_name: string
        }[]
      }
      get_user_id_by_email: { Args: { email_addr: string }; Returns: string }
      has_pet_access: { Args: { target_pet_id: string }; Returns: boolean }
      request_co_ownership: { Args: { owner_email: string }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
