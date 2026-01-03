import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Medication {
    id: string;
    pet_id: string;
    medication_name: string;
    dosage_value: number;
    dosage_unit: string;
    frequency: string;
    start_date: string;
    end_date?: string;
    reminders_enabled: boolean;
    cost?: number;
    currency?: string;
    notes?: string;
    created_at: string;
}

export const useMedications = (petId?: string) => {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchMedications();
    }, [petId]);

    const fetchMedications = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('medications')
                .select('*')
                .order('start_date', { ascending: false });

            if (petId) {
                query = query.eq('pet_id', petId);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;
            setMedications(data || []);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    const addMedication = async (medication: Omit<Medication, 'id' | 'created_at'>) => {
        try {
            const { data, error: insertError } = await supabase
                .from('medications')
                .insert(medication)
                .select()
                .single();

            if (insertError) throw insertError;

            posthog.capture('medication_created', {
                pet_id: medication.pet_id,
                medication_name: medication.medication_name,
            });

            setMedications([data, ...medications]);
            return { data, error: null };
        } catch (err) {
            return { data: null, error: err as Error };
        }
    };

    const updateMedication = async (id: string, updates: Partial<Medication>) => {
        try {
            const { data, error: updateError } = await supabase
                .from('medications')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;

            posthog.capture('medication_updated', {
                pet_id: data.pet_id,
                medication_id: id,
            });

            setMedications(medications.map(m => m.id === id ? data : m));
            return { data, error: null };
        } catch (err) {
            return { data: null, error: err as Error };
        }
    };

    const deleteMedication = async (id: string) => {
        try {
            const { error: deleteError } = await supabase
                .from('medications')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            posthog.capture('medication_deleted', {
                medication_id: id,
            });

            setMedications(medications.filter(m => m.id !== id));
            return { error: null };
        } catch (err) {
            return { error: err as Error };
        }
    };

    return {
        medications,
        loading,
        error,
        fetchMedications,
        addMedication,
        updateMedication,
        deleteMedication,
    };
};
