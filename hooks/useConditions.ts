
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Condition } from '@/types';

export function useConditions(petId: string | null) {
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchConditions = useCallback(async () => {
        if (!petId) {
            setConditions([]);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('conditions')
                .select('*')
                .eq('pet_id', petId)
                .order('diagnosed_date', { ascending: false });

            if (error) {
                console.error('Error fetching conditions:', error);
            } else {
                // Map DB types to Condition type if needed, but they should match closely
                // specific mapping might be needed for enums if TS complains
                setConditions(data as any as Condition[]);
            }
        } catch (error) {
            console.error('Error fetching conditions:', error);
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchConditions();
    }, [fetchConditions]);

    return {
        conditions,
        loading,
        refreshConditions: fetchConditions,
    };
}
