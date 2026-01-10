import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { MedicalCondition } from '@/types/passport';

export function useConditions(petId: string) {
    const [conditions, setConditions] = useState<MedicalCondition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchConditions = useCallback(async () => {
        if (!petId) return;
        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('medical_conditions')
                .select('*')
                .eq('pet_id', petId)
                .order('diagnosed_date', { ascending: false });

            if (fetchError) throw fetchError;

            setConditions((data || []).map(c => ({
                id: c.id,
                petId: c.pet_id,
                conditionName: c.condition_name,
                diagnosedDate: c.diagnosed_date ? new Date(c.diagnosed_date) : undefined,
                status: c.status,
                notes: c.notes,
            })));
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchConditions();
    }, [fetchConditions]);

    const addCondition = async (newCondition: Omit<MedicalCondition, 'id' | 'petId'>) => {
        const { error: insertError } = await supabase
            .from('medical_conditions')
            .insert({
                pet_id: petId,
                condition_name: newCondition.conditionName,
                diagnosed_date: newCondition.diagnosedDate?.toISOString().split('T')[0],
                status: newCondition.status,
                notes: newCondition.notes,
            });

        if (insertError) throw insertError;
        await fetchConditions();
    };

    const updateCondition = async (id: string, updates: Partial<Omit<MedicalCondition, 'id' | 'petId'>>) => {
        const { error: updateError } = await supabase
            .from('medical_conditions')
            .update({
                condition_name: updates.conditionName,
                diagnosed_date: updates.diagnosedDate?.toISOString().split('T')[0],
                status: updates.status,
                notes: updates.notes,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (updateError) throw updateError;
        await fetchConditions();
    };

    const deleteCondition = async (id: string) => {
        const { error: deleteError } = await supabase
            .from('medical_conditions')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;
        await fetchConditions();
    };

    return {
        conditions,
        loading,
        error,
        addCondition,
        updateCondition,
        deleteCondition,
        refetch: fetchConditions
    };
}
