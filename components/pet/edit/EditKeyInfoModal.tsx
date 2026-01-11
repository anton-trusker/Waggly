import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import FormModal from '@/components/ui/FormModal';
import { usePetV2, useUpdatePetV2 } from '@/hooks/domain/usePetV2';
import { Pet } from '@/types/v2/schema';
import { designSystem } from '@/constants/designSystem';
import EnhancedDatePicker from '@/components/ui/EnhancedDatePicker';
import ModernSelect from '@/components/ui/ModernSelect';

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

// Convert ISO date to DD-MM-YYYY for EnhancedDatePicker
const isoToDmy = (isoDate: string): string => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
};

// Convert DD-MM-YYYY back to ISO
const dmyToIso = (dmyDate: string): string => {
    if (!dmyDate) return '';
    const parts = dmyDate.split('-');
    if (parts.length !== 3) return dmyDate;
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
};

export default function EditKeyInfoModal({ visible, onClose, petId }: EditKeyInfoModalProps) {
    const { data: pet } = usePetV2(petId);
    const { mutateAsync: updatePet, isPending: loading } = useUpdatePetV2();

    const [formData, setFormData] = useState<Partial<Pet>>({});

    useEffect(() => {
        if (pet && visible) {
            setFormData({
                microchip_number: pet.microchip_number,
                species: pet.species,
                blood_type: pet.blood_type,
                color: pet.color,
                date_of_birth: pet.date_of_birth,
            });
        }
    }, [pet, visible]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!pet) return;
        try {
            await updatePet({
                id: petId,
                updates: {
                    ...formData,
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
            onSubmit={handleSave}
            loading={loading}
        >
            {() => (
                <View style={styles.container}>
                    {/* Microchip */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Microchip ID</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.microchip_number || ''}
                            onChangeText={(v) => handleChange('microchip_number', v)}
                            placeholder="Enter microchip number"
                            keyboardType="number-pad"
                        />
                    </View>

                    {/* Species */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Species</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.species || ''}
                            onChangeText={(v) => handleChange('species', v)}
                            placeholder="Dog, Cat..."
                        />
                    </View>

                    {/* Blood Type */}
                    <ModernSelect
                        label="Blood Type"
                        value={formData.blood_type || ''}
                        options={BLOOD_TYPES}
                        onChange={(v) => handleChange('blood_type', v)}
                        placeholder="Select type"
                    />

                    {/* Color */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Color</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.color || ''}
                            onChangeText={(v) => handleChange('color', v)}
                            placeholder="e.g. Golden"
                        />
                    </View>

                    {/* Date of Birth */}
                    <EnhancedDatePicker
                        label="Date of Birth"
                        value={isoToDmy(formData.date_of_birth || '')}
                        onChange={(dmyDate) => handleChange('date_of_birth', dmyToIso(dmyDate))}
                        placeholder="Select Date"
                    />
                </View>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    container: { gap: 16, paddingBottom: 24 },
    formGroup: { gap: 8 },
    label: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.secondary,
        fontWeight: '700'
    },
    input: {
        borderWidth: 1, borderColor: designSystem.colors.neutral[200], borderRadius: 12,
        paddingHorizontal: 16, paddingVertical: 12, fontSize: 16,
        color: designSystem.colors.text.primary, backgroundColor: '#fff'
    },
});
