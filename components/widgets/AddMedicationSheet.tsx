import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useForm } from '@/hooks/useForm';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { medicationSchema, Medication } from '@/utils/validation/schemas';
import { FormField, FormDatePicker } from '@/components/forms';
import BottomSheet from '@/components/navigation/BottomSheet';
import { Button } from '@/components/base';
import { designSystem } from '@/constants/designSystem';
import { supabase } from '@/lib/supabase';

interface AddMedicationSheetProps {
    petId: string;
    onSuccess?: (medication: Medication) => void;
}

/**
 * Example bottom sheet form for adding medication
 * Demonstrates complete Phase 4 integration:
 * - React Hook Form + Zod validation
 * - Form components (FormField, FormDatePicker)
 * - Bottom Sheet modal
 * - Design system styling
 */
export default function AddMedicationSheet({ petId, onSuccess }: AddMedicationSheetProps) {
    const { visible, open, close } = useBottomSheet();

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm(
        medicationSchema,
        {
            defaultValues: {
                name: '',
                dosage: '',
                frequency: '',
                startDate: new Date(),
                prescribedBy: '',
                notes: '',
                reminderEnabled: true,
            },
        }
    );

    const onSubmit = async (data: Medication) => {
        try {
            // Add medication to database via Supabase
            const { data: medication, error } = await supabase
                .from('medications')
                .insert({
                    pet_id: petId,
                    name: data.name,
                    dosage: data.dosage,
                    frequency: data.frequency,
                    start_date: data.startDate.toISOString(),
                    end_date: data.endDate?.toISOString(),
                    prescribed_by: data.prescribedBy,
                    notes: data.notes,
                    reminder_enabled: data.reminderEnabled,
                })
                .select()
                .single();

            if (error) throw error;

            Alert.alert(
                'Success',
                `${data.name} has been added!`,
                [{
                    text: 'OK', onPress: () => {
                        reset();
                        close();
                        onSuccess?.(medication as any);
                    }
                }]
            );
        } catch (error) {
            console.error('Error adding medication:', error);
            Alert.alert('Error', 'Failed to add medication. Please try again.');
        }
    };

    const handleClose = () => {
        reset();
        close();
    };

    return (
        <>
            {/* Trigger Button - In real app, this would be in parent component */}
            <Button onPress={open}>
                Add Medication
            </Button>

            {/* Bottom Sheet Form */}
            <BottomSheet
                visible={visible}
                onClose={handleClose}
                title="Add Medication"
                snapPoints={['75%', '95%'] as any}
            >
                <ScrollView
                    style={styles.form}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Medication Name */}
                    <FormField
                        control={control}
                        name="name"
                        label="Medication Name"
                        placeholder="e.g., Rimadyl, Heartgard"
                        required
                    />

                    {/* Dosage */}
                    <FormField
                        control={control}
                        name="dosage"
                        label="Dosage"
                        placeholder="e.g., 25mg, 1 tablet"
                        required
                    />

                    {/* Frequency */}
                    <FormField
                        control={control}
                        name="frequency"
                        label="Frequency"
                        placeholder="e.g., Once daily, Every 8 hours"
                        required
                    />

                    {/* Start Date */}
                    <FormDatePicker
                        control={control}
                        name="startDate"
                        label="Start Date"
                        required
                    />

                    {/* End Date (Optional) */}
                    <FormDatePicker
                        control={control}
                        name="endDate"
                        label="End Date"
                        placeholder="Optional"
                    />

                    {/* Prescribed By */}
                    <FormField
                        control={control}
                        name="prescribedBy"
                        label="Prescribed By"
                        placeholder="Veterinarian name"
                    />

                    {/* Notes */}
                    <FormField
                        control={control}
                        name="notes"
                        label="Notes"
                        placeholder="Additional information..."
                        multiline
                        rows={3}
                    />

                    {/* Submit Button */}
                    <View style={styles.buttonContainer}>
                        <Button
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            style={styles.submitButton}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Medication'}
                        </Button>

                        <Button
                            onPress={handleClose}
                            variant="outline"
                            style={styles.cancelButton}
                        >
                            Cancel
                        </Button>
                    </View>

                    {/* Bottom spacing for keyboard */}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </BottomSheet>
        </>
    );
}

const styles = StyleSheet.create({
    form: {
        flex: 1,
    },
    buttonContainer: {
        marginTop: designSystem.spacing[6],
        gap: designSystem.spacing[3],
    },
    submitButton: {
        width: '100%',
    },
    cancelButton: {
        width: '100%',
    },
});
