import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type {
    Treatment,
    UseTreatmentsReturn,
    TreatmentFormData,
} from '@/types/passport';

export function useTreatments(petId: string): UseTreatmentsReturn {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [activeTreatments, setActiveTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTreatments = useCallback(async () => {
        if (!petId) {
            setError(new Error('Pet ID is required'));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('medications')
                .select('*')
                .eq('pet_id', petId)
                .order('start_date', { ascending: false });

            if (fetchError) throw fetchError;

            const mappedTreatments: Treatment[] = (data || []).map(t => ({
                id: t.id,
                treatmentName: t.name,
                category: 'acute', // Default as V2 doesn't have category
                startDate: new Date(t.start_date),
                endDate: t.end_date ? new Date(t.end_date) : undefined,
                dosage: t.dosage || '',
                frequency: t.frequency || '',
                timeOfDay: undefined,
                vet: undefined,
                prescribedBy: undefined,
                prescriptionNumber: undefined,
                pharmacy: undefined,
                refillsRemaining: undefined,
                isActive: t.is_ongoing || false,
                withFood: undefined,
                sideEffects: undefined,
                specialInstructions: undefined,
                notes: t.instructions,
            }));

            setTreatments(mappedTreatments);
            setActiveTreatments(mappedTreatments.filter(t => t.isActive));
        } catch (err) {
            console.error('Error fetching treatments:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch treatments'));
        } finally {
            setLoading(false);
        }
    }, [petId]);

    useEffect(() => {
        fetchTreatments();
    }, [fetchTreatments]);

    const addTreatment = useCallback(async (data: TreatmentFormData) => {
        const tempId = 'temp-' + Date.now();
        const isActive = !data.endDate || data.endDate > new Date();

        const optimisticTreatment: Treatment = {
            id: tempId,
            treatmentName: data.treatmentName,
            category: data.category,
            startDate: data.startDate,
            endDate: data.endDate,
            dosage: data.dosage || '',
            frequency: data.frequency || '',
            timeOfDay: data.timeOfDay,
            vet: undefined,
            prescribedBy: data.prescribedBy,
            prescriptionNumber: undefined,
            pharmacy: data.pharmacy,
            refillsRemaining: undefined,
            isActive: isActive,
            withFood: data.withFood,
            sideEffects: undefined,
            specialInstructions: undefined,
            notes: data.notes,
        };

        // Optimistic update
        setTreatments(prev => {
            const newList = [optimisticTreatment, ...prev];
            setActiveTreatments(newList.filter(t => t.isActive));
            return newList;
        });

        const instructions = [
            data.notes,
            data.withFood ? 'Take with food' : undefined,
            data.prescribedBy ? `Prescribed by: ${data.prescribedBy}` : undefined,
            data.pharmacy ? `Pharmacy: ${data.pharmacy}` : undefined
        ].filter(Boolean).join('\n');

        try {
            const { error: insertError } = await supabase
                .from('medications')
                .insert({
                    pet_id: petId,
                    name: data.treatmentName,
                    start_date: data.startDate.toISOString(),
                    end_date: data.endDate?.toISOString(),
                    dosage: data.dosage,
                    frequency: data.frequency,
                    instructions: instructions,
                    is_ongoing: isActive,
                });

            if (insertError) throw insertError;

            await fetchTreatments();
        } catch (err) {
            console.error('Error adding treatment:', err);
            // Revert
            setTreatments(prev => {
                const reverted = prev.filter(t => t.id !== tempId);
                setActiveTreatments(reverted.filter(t => t.isActive));
                return reverted;
            });
            throw err;
        }
    }, [petId, fetchTreatments]);

    const updateTreatment = useCallback(async (
        id: string,
        data: Partial<TreatmentFormData>
    ) => {
        const previousTreatments = [...treatments];

        // Optimistic update
        setTreatments(prev => {
            const updatedList = prev.map(t => {
                if (t.id === id) {
                    const mergedEnd = data.endDate !== undefined ? data.endDate : t.endDate;
                    const isActive = !mergedEnd || mergedEnd > new Date();

                    return {
                        ...t,
                        ...(data.treatmentName && { treatmentName: data.treatmentName }),
                        ...(data.category && { category: data.category }),
                        ...(data.startDate && { startDate: data.startDate }),
                        ...(data.endDate !== undefined && { endDate: data.endDate }),
                        ...(data.dosage && { dosage: data.dosage }),
                        ...(data.frequency && { frequency: data.frequency }),
                        ...(data.notes !== undefined && { notes: data.notes }), // Simplification
                        isActive: isActive
                    };
                }
                return t;
            });
            setActiveTreatments(updatedList.filter(t => t.isActive));
            return updatedList;
        });

        try {
            const updateData: any = {};
            if (data.treatmentName) updateData.name = data.treatmentName;
            if (data.startDate) updateData.start_date = data.startDate.toISOString();
            if (data.endDate !== undefined) updateData.end_date = data.endDate?.toISOString() || null;
            if (data.dosage) updateData.dosage = data.dosage;
            if (data.frequency) updateData.frequency = data.frequency;

            // Reconstruct instructions if notes or other fields change is tricky without reading old data perfectly.
            // For now, simple update of instructions if notes provided.
            if (data.notes) updateData.instructions = data.notes;

            if (data.endDate || data.startDate) {
                if ((data.endDate && data.endDate < new Date())) {
                    updateData.is_ongoing = false;
                } else if (!data.endDate || data.endDate > new Date()) {
                    updateData.is_ongoing = true;
                }
            }

            const { error: updateError } = await supabase
                .from('medications')
                .update(updateData)
                .eq('id', id);

            if (updateError) throw updateError;

            await fetchTreatments();
        } catch (err) {
            console.error('Error updating treatment:', err);
            // Revert
            setTreatments(previousTreatments);
            setActiveTreatments(previousTreatments.filter(t => t.isActive));
            throw err;
        }
    }, [treatments, fetchTreatments]);

    const deleteTreatment = useCallback(async (id: string) => {
        const previousTreatments = [...treatments];

        // Optimistic update
        setTreatments(prev => {
            const newList = prev.filter(t => t.id !== id);
            setActiveTreatments(newList.filter(t => t.isActive));
            return newList;
        });

        try {
            const { error: deleteError } = await supabase
                .from('medications')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            await fetchTreatments();
        } catch (err) {
            console.error('Error deleting treatment:', err);
            // Revert
            setTreatments(previousTreatments);
            setActiveTreatments(previousTreatments.filter(t => t.isActive));
            throw err;
        }
    }, [treatments, fetchTreatments]);

    return {
        treatments,
        activeTreatments,
        loading,
        error,
        addTreatment,
        updateTreatment,
        deleteTreatment,
    };
}
