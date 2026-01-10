import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type {
    Allergy,
    AllergyFormData,
    AllergyType,
    AllergySeverity,
} from '@/types/passport';

export interface UseAllergiesReturn {
    allergies: Allergy[];
    loading: boolean;
    error: Error | null;
    addAllergy: (data: AllergyFormData) => Promise<void>;
    updateAllergy: (id: string, data: Partial<AllergyFormData>) => Promise<void>;
    deleteAllergy: (id: string) => Promise<void>;
}

export function useAllergies(petId: string): UseAllergiesReturn {
    const [allergies, setAllergies] = useState<Allergy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAllergies = useCallback(async () => {
        if (!petId) {
            setError(new Error('Pet ID is required'));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('allergies')
                .select('*')
                .eq('pet_id', petId);

            if (fetchError) throw fetchError;

            const mappedAllergies: Allergy[] = (data || []).map(a => ({
                id: a.id,
                type: (a.type || 'environment') as AllergyType,
                allergen: a.name || a.allergen_name || a.allergen || 'Unknown',
                reactionDescription: a.reaction_description || '',
                severity: (a.severity_level || a.severity || 'mild') as AllergySeverity,
                notes: a.notes,
            }));

            setAllergies(mappedAllergies);
        } catch (err) {
            console.error('Error fetching allergies:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch allergies'));
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchAllergies();
    }, [fetchAllergies]);

    const addAllergy = useCallback(async (data: AllergyFormData) => {
        const tempId = 'temp-' + Date.now();
        const optimisticAllergy: Allergy = {
            id: tempId,
            type: data.type,
            allergen: data.allergen,
            reactionDescription: data.reactionDescription,
            severity: data.severity,
            notes: data.notes,
        };

        // Optimistic update
        setAllergies(prev => [optimisticAllergy, ...prev]);

        try {
            const { error: insertError } = await supabase
                .from('allergies')
                .insert({
                    pet_id: petId,
                    allergen: data.allergen,
                    type: data.type,
                    reaction_description: data.reactionDescription,
                    severity_level: data.severity,
                    notes: data.notes,
                    allergy_alert_enabled: true,
                });

            if (insertError) throw insertError;

            await fetchAllergies();
        } catch (err) {
            console.error('Error adding allergy:', err);
            // Revert optimistic update
            setAllergies(prev => prev.filter(a => a.id !== tempId));
            throw err;
        }
    }, [petId, fetchAllergies]);

    const updateAllergy = useCallback(async (
        id: string,
        data: Partial<AllergyFormData>
    ) => {
        const previousAllergies = [...allergies];

        // Optimistic update
        setAllergies(prev => prev.map(a => {
            if (a.id === id) {
                return {
                    ...a,
                    ...(data.allergen && { allergen: data.allergen }),
                    ...(data.type && { type: data.type }),
                    ...(data.reactionDescription && { reactionDescription: data.reactionDescription }),
                    ...(data.severity && { severity: data.severity }),
                    ...(data.notes !== undefined && { notes: data.notes }),
                };
            }
            return a;
        }));

        try {
            const updateData: any = {};
            if (data.allergen) updateData.allergen = data.allergen;
            if (data.type) updateData.type = data.type;
            if (data.reactionDescription) updateData.reaction_description = data.reactionDescription;
            if (data.severity) updateData.severity_level = data.severity;
            if (data.notes !== undefined) updateData.notes = data.notes;

            const { error: updateError } = await supabase
                .from('allergies')
                .update(updateData)
                .eq('id', id);

            if (updateError) throw updateError;

            await fetchAllergies();
        } catch (err) {
            console.error('Error updating allergy:', err);
            setAllergies(previousAllergies); // Revert
            throw err;
        }
    }, [allergies, fetchAllergies]);

    const deleteAllergy = useCallback(async (id: string) => {
        const previousAllergies = [...allergies];

        // Optimistic update
        setAllergies(prev => prev.filter(a => a.id !== id));

        try {
            const { error: deleteError } = await supabase
                .from('allergies')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            await fetchAllergies();
        } catch (err) {
            console.error('Error deleting allergy:', err);
            setAllergies(previousAllergies); // Revert
            throw err;
        }
    }, [allergies, fetchAllergies]);

    return {
        allergies,
        loading,
        error,
        addAllergy,
        updateAllergy,
        deleteAllergy,
    };
}
