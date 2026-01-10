import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { BodyConditionScore, BCSCategory } from '@/types/passport';

export interface BodyConditionRecord extends BodyConditionScore {
    id: string;
    petId: string;
}

export interface UseBodyConditionReturn {
    scores: BodyConditionRecord[];
    latestScore: BodyConditionRecord | null;
    loading: boolean;
    error: Error | null;
    addScore: (score: number, notes?: string, date?: Date) => Promise<void>;
    deleteScore: (id: string) => Promise<void>;
}

const getBCSCategory = (score: number): BCSCategory => {
    if (score <= 3) return BCSCategory.UNDERWEIGHT;
    if (score <= 5) return BCSCategory.IDEAL;
    if (score <= 7) return BCSCategory.OVERWEIGHT;
    return BCSCategory.OBESE;
};

export function useBodyCondition(petId: string): UseBodyConditionReturn {
    const [scores, setScores] = useState<BodyConditionRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchScores = useCallback(async () => {
        if (!petId) return;

        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('body_condition_scores')
                .select('*')
                .eq('pet_id', petId)
                .order('assessed_date', { ascending: false });

            if (fetchError) throw fetchError;

            const mappedScores: BodyConditionRecord[] = (data || []).map(s => ({
                id: s.id,
                petId: s.pet_id,
                score: s.score,
                scaleType: '9-point',
                assessedDate: new Date(s.assessed_date),
                category: getBCSCategory(s.score),
                notes: s.notes
            }));

            setScores(mappedScores);
        } catch (err) {
            console.error('Error fetching BCS:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch BCS'));
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchScores();
    }, [fetchScores]);

    const addScore = useCallback(async (score: number, notes?: string, date: Date = new Date()) => {
        try {
            const { error: insertError } = await supabase
                .from('body_condition_scores')
                .insert({
                    pet_id: petId,
                    score,
                    notes,
                    assessed_date: date.toISOString()
                });

            if (insertError) throw insertError;

            await fetchScores();
        } catch (err) {
            console.error('Error adding BCS:', err);
            throw err;
        }
    }, [petId, fetchScores]);

    const deleteScore = useCallback(async (id: string) => {
        try {
            const { error: deleteError } = await supabase
                .from('body_condition_scores')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            await fetchScores();
        } catch (err) {
            console.error('Error deleting BCS:', err);
            throw err;
        }
    }, [fetchScores]);

    return {
        scores,
        latestScore: scores.length > 0 ? scores[0] : null,
        loading,
        error,
        addScore,
        deleteScore
    };
}
