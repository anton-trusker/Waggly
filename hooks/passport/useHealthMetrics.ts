import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { HealthRecordFormData } from '@/types/passport';
import { useAuth } from '@/contexts/AuthContext';

export function useHealthMetrics(petId: string) {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const addHealthRecord = useCallback(async (data: HealthRecordFormData) => {
        if (!user) throw new Error('User not authenticated');
        if (!petId) throw new Error('Pet ID is required');

        setLoading(true);
        try {
            const { error: insertError } = await supabase
                .from('health_metrics')
                .insert({
                    pet_id: petId,
                    measured_at: data.date.toISOString(),
                    weight: data.weight,
                    temperature: data.temperature,
                    heart_rate: data.heartRate,
                    respiratory_rate: data.respiratoryRate,
                    body_condition_score: data.bodyConditionScore,
                    activity_level: data.activityLevel,
                    energy_level: data.energyLevel,
                    appetite_level: data.appetiteLevel,
                    coat_condition: data.coatCondition,
                    stool_quality: data.stoolQuality,
                    notes: data.notes,
                });

            if (insertError) throw insertError;

            // Log activity
            await supabase.from('activity_logs').insert({
                profile_id: user.id,
                pet_id: petId,
                activity_type: 'health_check_added',
                activity_data: {
                    weight: data.weight ? `${data.weight} ${data.weightUnit}` : undefined,
                    bcs: data.bodyConditionScore,
                },
            });

        } catch (err) {
            console.error('Error adding health record:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [petId, user]);

    return {
        addHealthRecord,
        loading
    };
}
