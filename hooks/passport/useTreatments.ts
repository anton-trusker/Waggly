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
                .from('treatments')
                .select('*')
                .eq('pet_id', petId)
                .order('start_date', { ascending: false });

            if (fetchError) throw fetchError;

            const mappedTreatments: Treatment[] = (data || []).map(t => ({
                id: t.id,
                treatmentName: t.treatment_name,
                category: t.category || 'acute',
                startDate: new Date(t.start_date),
                endDate: t.end_date ? new Date(t.end_date) : undefined,
                dosage: t.dosage || '',
                frequency: t.frequency || '',
                timeOfDay: t.time_of_day,
                vet: t.vet,
                prescribedBy: t.prescribed_by,
                prescriptionNumber: t.prescription_number,
                pharmacy: t.pharmacy,
                refillsRemaining: t.refills_remaining,
                isActive: t.is_active || false,
                withFood: t.with_food,
                sideEffects: t.side_effects,
                specialInstructions: t.special_instructions,
                notes: t.notes,
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
            vet: undefined, // Form doesn't provide?
            prescribedBy: data.prescribedBy,
            prescriptionNumber: data.prescriptionNumber,
            pharmacy: data.pharmacy,
            refillsRemaining: undefined, // Form doesn't provide?
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

        try {
            const { error: insertError } = await supabase
                .from('treatments')
                .insert({
                    pet_id: petId,
                    treatment_name: data.treatmentName,
                    category: data.category,
                    start_date: data.startDate.toISOString(),
                    end_date: data.endDate?.toISOString(),
                    dosage: data.dosage,
                    frequency: data.frequency,
                    time_of_day: data.timeOfDay,
                    prescribed_by: data.prescribedBy,
                    pharmacy: data.pharmacy,
                    with_food: data.withFood,
                    notes: data.notes,
                    is_active: isActive,
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
                        ...(data.timeOfDay && { timeOfDay: data.timeOfDay }),
                        ...(data.prescribedBy && { prescribedBy: data.prescribedBy }),
                        ...(data.pharmacy && { pharmacy: data.pharmacy }),
                        ...(data.withFood !== undefined && { withFood: data.withFood }),
                        ...(data.notes !== undefined && { notes: data.notes }),
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
            // Re-map all potential fields:
            if (data.treatmentName) updateData.treatment_name = data.treatmentName;
            if (data.category) updateData.category = data.category;
            if (data.startDate) updateData.start_date = data.startDate.toISOString();
            if (data.endDate !== undefined) updateData.end_date = data.endDate?.toISOString() || null;
            if (data.dosage) updateData.dosage = data.dosage;
            if (data.frequency) updateData.frequency = data.frequency;
            if (data.timeOfDay) updateData.time_of_day = data.timeOfDay;
            if (data.prescribedBy) updateData.prescribed_by = data.prescribedBy;
            if (data.pharmacy) updateData.pharmacy = data.pharmacy;
            if (data.withFood !== undefined) updateData.with_food = data.withFood;
            if (data.notes !== undefined) updateData.notes = data.notes;

            if (data.endDate || data.startDate) {
                if ((data.endDate && data.endDate < new Date())) {
                    updateData.is_active = false;
                } else if (!data.endDate || data.endDate > new Date()) {
                    updateData.is_active = true;
                }
            }

            const { error: updateError } = await supabase
                .from('treatments')
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
                .from('treatments')
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
