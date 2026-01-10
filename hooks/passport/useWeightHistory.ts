import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { WeightRecord } from '@/types/passport';
import { Alert } from 'react-native';

export function useWeightHistory(petId: string) {
    const [history, setHistory] = useState<WeightRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchHistory = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('weight_history')
                .select('*')
                .eq('pet_id', petId)
                .order('date', { ascending: false });

            if (error) throw error;

            const formatted: WeightRecord[] = (data || []).map(item => ({
                id: item.id,
                petId: item.pet_id,
                weight: Number(item.weight),
                unit: item.unit,
                date: item.date,
                notes: item.notes,
                createdAt: item.created_at,
            }));

            setHistory(formatted);
        } catch (err: any) {
            console.error('Error fetching weight history:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        if (petId) {
            fetchHistory();
        }
    }, [petId, fetchHistory]);

    const addWeight = async (weight: number, date: string, notes?: string) => {
        try {
            const { error } = await supabase
                .from('weight_history')
                .insert({
                    pet_id: petId,
                    weight,
                    unit: 'kg', // Todo: handle user preference
                    date,
                    notes
                });

            if (error) throw error;
            await fetchHistory();


            // Sync with pet profile
            const { error: updateError } = await supabase
                .from('pets')
                .update({ weight })
                .eq('id', petId);

            if (updateError) {
                console.warn('Failed to sync weight to pet profile:', updateError);
                // Don't throw, as history was saved
            }
        } catch (err) {
            console.error('Error adding weight:', err);
            throw err;
        }
    };

    const deleteWeight = async (id: string) => {
        try {
            const { error } = await supabase
                .from('weight_history')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchHistory();
        } catch (err) {
            console.error('Error deleting weight:', err);
            throw err;
        }
    };

    return {
        history,
        loading,
        error,
        addWeight,
        deleteWeight,
        refetch: fetchHistory
    };
}
