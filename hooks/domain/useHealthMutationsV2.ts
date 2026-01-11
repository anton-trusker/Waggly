import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Vaccination, MedicalVisit, Medication, Allergy, Condition, WeightLog } from '@/types/v2/schema';

// --- Vaccinations ---

export function useCreateVaccination() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (vaccination: Omit<Vaccination, 'id' | 'created_at' | 'updated_at'>) => {
            const { data, error } = await supabase
                .from('vaccinations')
                .insert(vaccination)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pet-profile', variables.pet_id] });
        }
    });
}

export function useUpdateVaccination() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Vaccination> }) => {
            const { data, error } = await supabase
                .from('vaccinations')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            if (data?.pet_id) {
                queryClient.invalidateQueries({ queryKey: ['pet-profile', data.pet_id] });
            }
        }
    });
}

export function useDeleteVaccination() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, pet_id }: { id: string; pet_id: string }) => {
            const { error } = await supabase
                .from('vaccinations')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return pet_id;
        },
        onSuccess: (pet_id) => {
            queryClient.invalidateQueries({ queryKey: ['pet-profile', pet_id] });
        }
    });
}
// --- Visits ---

export function useCreateVisit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (visit: Omit<MedicalVisit, 'id' | 'created_at' | 'updated_at'>) => {
            const { data, error } = await supabase
                .from('medical_visits')
                .insert(visit)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pet-profile', variables.pet_id] });
        }
    });
}

export function useUpdateVisit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<MedicalVisit> }) => {
            const { data, error } = await supabase
                .from('medical_visits')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            if (data?.pet_id) {
                queryClient.invalidateQueries({ queryKey: ['pet-profile', data.pet_id] });
            }
        }
    });
}

export function useDeleteVisit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, pet_id }: { id: string; pet_id: string }) => {
            const { error } = await supabase
                .from('medical_visits')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return pet_id;
        },
        onSuccess: (pet_id) => {
            queryClient.invalidateQueries({ queryKey: ['pet-profile', pet_id] });
        }
    });
}

// --- Medications ---

export function useCreateMedication() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (medication: Omit<Medication, 'id' | 'created_at' | 'updated_at'>) => {
            const { data, error } = await supabase
                .from('medications')
                .insert(medication)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pet-profile', variables.pet_id] });
        }
    });
}

export function useUpdateMedication() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Medication> }) => {
            const { data, error } = await supabase
                .from('medications')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            if (data?.pet_id) {
                queryClient.invalidateQueries({ queryKey: ['pet-profile', data.pet_id] });
            }
        }
    });
}

export function useDeleteMedication() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, pet_id }: { id: string; pet_id: string }) => {
            const { error } = await supabase
                .from('medications')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return pet_id;
        },
        onSuccess: (pet_id) => {
            queryClient.invalidateQueries({ queryKey: ['pet-profile', pet_id] });
        }
    });
}

// --- Conditions ---

export function useCreateCondition() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (condition: Omit<Condition, 'id' | 'created_at' | 'updated_at'>) => {
            const { data, error } = await supabase
                .from('conditions')
                .insert(condition)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pet-profile', variables.pet_id] });
        }
    });
}

export function useUpdateCondition() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Condition> }) => {
            const { data, error } = await supabase
                .from('conditions')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            if (data?.pet_id) {
                queryClient.invalidateQueries({ queryKey: ['pet-profile', data.pet_id] });
            }
        }
    });
}

export function useDeleteCondition() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, pet_id }: { id: string; pet_id: string }) => {
            const { error } = await supabase
                .from('conditions')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return pet_id;
        },
        onSuccess: (pet_id) => {
            queryClient.invalidateQueries({ queryKey: ['pet-profile', pet_id] });
        }
    });
}
// --- Allergies ---

export function useCreateAllergy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (allergy: Omit<Allergy, 'id' | 'created_at' | 'updated_at'>) => {
            const { data, error } = await supabase
                .from('allergies')
                .insert(allergy)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pet-profile', variables.pet_id] });
        }
    });
}

export function useUpdateAllergy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Allergy> }) => {
            const { data, error } = await supabase
                .from('allergies')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            if (data?.pet_id) {
                queryClient.invalidateQueries({ queryKey: ['pet-profile', data.pet_id] });
            }
        }
    });
}

export function useDeleteAllergy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, pet_id }: { id: string; pet_id: string }) => {
            const { error } = await supabase
                .from('allergies')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return pet_id;
        },
        onSuccess: (pet_id) => {
            queryClient.invalidateQueries({ queryKey: ['pet-profile', pet_id] });
        }
    });
}

// --- Activity Logs ---

export function useCreateActivityLog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (log: { pet_id: string; activity_type: string; title: string; description?: string; metadata?: any }) => {
            const { error } = await supabase
                .from('activity_logs')
                .insert(log);
            if (error) throw error;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pet-profile', variables.pet_id] });
        }
    });
}
