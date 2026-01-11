import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Vaccination, MedicalVisit, Medication, Allergy, Condition, ActivityLog, WeightLog } from '@/types/v2/schema';

// Unified Profile Data Interface
export interface PetProfileDataV2 {
    vaccinations: (Vaccination & { provider_name?: string })[];
    visits: (MedicalVisit & { clinic_name?: string })[];
    medications: Medication[];
    allergies: Allergy[];
    conditions: Condition[];
    activities: ActivityLog[];
    weightLogs: WeightLog[];
    behaviorTags: BehaviorTag[];
}

export function usePetProfileV2(petId: string) {
    return useQuery({
        queryKey: ['pet-profile', petId],
        queryFn: async () => {
            if (!petId) throw new Error('Pet ID is required');

            const [
                vaccinations,
                visits,
                medications,
                allergies,
                conditions,
                activities,
                weightLogs,
                behaviorTags
            ] = await Promise.all([
                supabase
                    .from('vaccinations')
                    .select('*, providers(name)')
                    .eq('pet_id', petId)
                    .order('administered_date', { ascending: false }),
                supabase
                    .from('medical_visits')
                    .select('*, providers(clinic_name)')
                    .eq('pet_id', petId)
                    .order('visit_date', { ascending: false }),
                supabase
                    .from('medications')
                    .select('*')
                    .eq('pet_id', petId)
                    .order('start_date', { ascending: false }),
                supabase
                    .from('allergies')
                    .select('*')
                    .eq('pet_id', petId)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('conditions')
                    .select('*')
                    .eq('pet_id', petId)
                    .order('diagnosed_date', { ascending: false }),
                supabase
                    .from('activity_logs')
                    .select('*')
                    .eq('pet_id', petId)
                    .order('created_at', { ascending: false })
                    .limit(20),
                supabase
                    .from('weight_logs')
                    .select('*')
                    .eq('pet_id', petId)
                    .order('recorded_date', { ascending: false }),
                supabase
                    .from('behavior_tags')
                    .select('*')
                    .eq('pet_id', petId)
                    .order('created_at', { ascending: false })
            ]);

            return {
                vaccinations: (vaccinations.data || []).map(v => ({
                    ...v,
                    provider_name: (v.providers as any)?.name
                })) as (Vaccination & { provider_name?: string })[],
                visits: (visits.data || []).map(v => ({
                    ...v,
                    clinic_name: (v.providers as any)?.clinic_name
                })) as (MedicalVisit & { clinic_name?: string })[],
                medications: (medications.data || []) as Medication[],
                allergies: (allergies.data || []) as Allergy[],
                conditions: (conditions.data || []) as Condition[],
                activities: (activities.data || []) as ActivityLog[],
                weightLogs: (weightLogs.data || []) as WeightLog[],
                behaviorTags: (behaviorTags.data || []) as BehaviorTag[]
            };
        },
        enabled: !!petId
    });
}

