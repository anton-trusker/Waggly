import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import FormModal from '@/components/ui/FormModal';
import { usePetV2, useUpdatePetV2 } from '@/hooks/domain/usePetV2';
import { designSystem } from '@/constants/designSystem';

// Design System
import { TextField } from '@/components/design-system/forms/TextField';
import { SelectField } from '@/components/design-system/forms/SelectField';
import { DateField } from '@/components/design-system/forms/DateField';

interface EditKeyInfoModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
}

const BLOOD_TYPES = [
    { label: 'DEA 1.1 Positive', value: 'DEA 1.1 Positive' },
    { label: 'DEA 1.1 Negative', value: 'DEA 1.1 Negative' },
    { label: 'Type A', value: 'Type A' },
    { label: 'Type B', value: 'Type B' },
    { label: 'Type AB', value: 'Type AB' },
    { label: 'Unknown', value: 'Unknown' },
];

export default function EditKeyInfoModal({ visible, onClose, petId }: EditKeyInfoModalProps) {
    const { data: pet } = usePetV2(petId);
    const { mutateAsync: updatePet, isPending: loading } = useUpdatePetV2();

    const methods = useForm({
        defaultValues: {
            microchip_number: '',
            species: '',
            blood_type: '',
            color: '',
            date_of_birth: undefined as Date | undefined,
        }
    });

    const { control, reset, handleSubmit } = methods;

    useEffect(() => {
        if (pet && visible) {
            reset({
                microchip_number: pet.microchip_number || '',
                species: pet.species || '',
                blood_type: pet.blood_type || '',
                color: pet.color || '',
                date_of_birth: pet.date_of_birth ? new Date(pet.date_of_birth) : undefined,
            });
        }
    }, [pet, visible, reset]);

    const handleSave = async (data: any) => {
        if (!pet) return;
        try {
            await updatePet({
                id: petId,
                updates: {
                    ...data,
                    // Convert Date object back to ISO string for DB if needed, or DateField handles standard JS Dates.
                    // Schema usually expects string YYYY-MM-DD or ISO
                    date_of_birth: data.date_of_birth?.toISOString(),
                    updated_at: new Date().toISOString(),
                }
            });
            onClose();
        } catch (error) {
            console.error('Failed to update key info:', error);
        }
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title="Edit Key Info"
            submitLabel="Save Changes"
            onSubmit={handleSubmit(handleSave)}
            loading={loading}
        >
            {() => (
                <FormProvider {...methods}>
                    <View style={styles.container}>
                        <TextField
                            control={control}
                            name="microchip_number"
                            label="Microchip ID"
                            placeholder="Enter microchip number"
                            keyboardType="numeric"
                        />

                        <TextField
                            control={control}
                            name="species"
                            label="Species"
                            placeholder="Dog, Cat..."
                        />

                        <SelectField
                            control={control}
                            name="blood_type"
                            label="Blood Type"
                            options={BLOOD_TYPES}
                            placeholder="Select type"
                        />

                        <TextField
                            control={control}
                            name="color"
                            label="Color"
                            placeholder="e.g. Golden"
                        />

                        <DateField
                            control={control}
                            name="date_of_birth"
                            label="Date of Birth"
                        />
                    </View>
                </FormProvider>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    container: { gap: 16, paddingBottom: 24 },
});


