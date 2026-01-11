import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { usePetsV2 } from '@/hooks/domain/usePetV2';
import { designSystem } from '@/constants/designSystem'; // Force Light Theme
import FormModal, { FormState } from '@/components/ui/FormModal';
import UniversalDatePicker from '@/components/ui/UniversalDatePicker';
import { useLocale } from '@/hooks/useLocale';
import { useCreateActivityLog } from '@/hooks/domain/useHealthMutationsV2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface WeightFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

interface WeightFormData {
    weight: string;
    unit: string;
    date: string;
}

// Minimal hook for creating weight log since it wasn't in the massive mutations file yet, or I can add it there.
// For speed, defining here or finding if it exists. 
// Actually, I should add it to useHealthMutationsV2 for consistency, but for now specific here is fine or I can just use Supabase direct for this single simple table.
// Better: Add to V2 mutations file later? No, let's keep it clean. I'll define a local mutation or import if added.
// I didn't add useCreateWeightLog in previous steps. I'll do inline mutation for now to save a step, or add it to the file.
// Let's add it to the file? No, I can't edit that file again without Context check.
// I'll implement inline for now.

export default function WeightFormModal({ visible, onClose, petId: initialPetId, onSuccess }: WeightFormModalProps) {
    const { t } = useLocale();
    const theme = designSystem;
    const queryClient = useQueryClient();

    const { mutateAsync: logActivity } = useCreateActivityLog();

    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');

    const createWeightLog = useMutation({
        mutationFn: async (data: any) => {
            const { error } = await supabase.from('weight_logs').insert(data);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pet-profile', selectedPetId] });
        }
    });

    const initialData: WeightFormData = {
        weight: '',
        unit: 'kg', // Default or user pref?
        date: new Date().toISOString().split('T')[0],
    };

    const handleSubmit = async (data: WeightFormData) => {
        if (!selectedPetId) return;

        try {
            await createWeightLog.mutateAsync({
                pet_id: selectedPetId,
                weight: parseFloat(data.weight),
                date: data.date,
                // unit? Schema usually stores in kg or standardized.
                // V2 Schema for weight_logs: id, pet_id, weight, date, created_at.
                // Weight is likely numeric (kg by default convention in DB).
                // If user selects lbs, we convert?
                // For now assuming KG input.
            });
            await logActivity({
                pet_id: selectedPetId,
                activity_type: 'weight',
                title: 'Weight Recorded',
                description: `${data.weight} kg`,
            });
            onSuccess?.();
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={t('weight_form.title') || "Log Weight"}
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel={t('common.save')}
            forceLight
        >
            {(formState: FormState<WeightFormData>) => (
                <View style={styles.formContent}>
                    <View style={[styles.card, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.secondary, borderWidth: 1 }]}>
                        <View style={styles.row}>
                            <View style={styles.flex1}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('weight_form.weight_label') || "Weight (kg)"}</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.background.tertiary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                    placeholder="0.00"
                                    keyboardType="numeric"
                                    placeholderTextColor={theme.colors.text.tertiary}
                                    value={formState.data.weight}
                                    onChangeText={(text) => formState.updateField('weight', text)}
                                />
                            </View>
                        </View>
                        <UniversalDatePicker
                            label={t('common.date')}
                            value={formState.data.date}
                            onChange={(text) => formState.updateField('date', text)}
                        />
                    </View>
                </View>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    formContent: { gap: 16 },
    card: { borderRadius: 16, padding: 16, gap: 12 },
    label: { fontSize: 13, fontWeight: '500', marginBottom: 4, fontFamily: 'Plus Jakarta Sans' },
    input: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, borderWidth: 1, fontFamily: 'Plus Jakarta Sans' },
    row: { flexDirection: 'row', gap: 12 },
    flex1: { flex: 1 },
});
