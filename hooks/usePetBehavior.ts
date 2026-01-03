import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface BehaviorTag {
    id: string;
    pet_id: string;
    tag: string;
    notes: string | null;
    created_at: string;
}

export function usePetBehavior(petId?: string) {
    const [behaviorTags, setBehaviorTags] = useState<BehaviorTag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBehavior = useCallback(async () => {
        if (!petId) {
            setBehaviorTags([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('behavior_tags')
                .select('*')
                .eq('pet_id', petId)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setBehaviorTags(data || []);
        } catch (err: any) {
            console.error('Error fetching behavior tags:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchBehavior();
    }, [fetchBehavior]);

    return { behaviorTags, loading, error, refreshBehavior: fetchBehavior };
}
