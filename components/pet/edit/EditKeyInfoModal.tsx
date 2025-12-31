import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Platform, TouchableOpacity, Text, ScrollView } from 'react-native';
import FormModal from '@/components/ui/FormModal';
import { usePets } from '@/hooks/usePets';
import { Pet } from '@/types';
import { designSystem } from '@/constants/designSystem';
import DatePickerWeb from '@/components/ui/DatePickerWeb';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import ModernSelect from '@/components/ui/ModernSelect';
import { IconSymbol } from '@/components/ui/IconSymbol';

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
    const { pets, updatePet } = usePets();
    const pet = pets.find(p => p.id === petId);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Pet>>({});
    const [showDatePicker, setShowDatePicker] = useState(false);

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
        setLoading(true);
        try {
            await updatePet(petId, {
                ...formData,
                updated_at: new Date().toISOString(),
            });
            onClose();
        } catch (error) {
            console.error('Failed to update key info:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return 'Select Date';
        return new Date(dateStr).toLocaleDateString();
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
                    {Platform.OS === 'web' ? (
                        <DatePickerWeb
                            label="Date of Birth"
                            value={formData.date_of_birth || ''}
                            onChange={(v) => handleChange('date_of_birth', v)}
                            placeholder="Select Date"
                        />
                    ) : (
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Date of Birth</Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={formData.date_of_birth ? styles.inputText : styles.placeholderText}>
                                    {formatDate(formData.date_of_birth)}
                                </Text>
                                <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={20} color={designSystem.colors.text.tertiary} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Mobile Date Picker Modal */}
                    <CustomDatePicker
                        visible={showDatePicker}
                        date={formData.date_of_birth ? new Date(formData.date_of_birth) : new Date()}
                        onClose={() => setShowDatePicker(false)}
                        onConfirm={(date) => {
                            handleChange('date_of_birth', date.toISOString().split('T')[0]);
                            setShowDatePicker(false);
                        }}
                        title="Date of Birth"
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
    dateInput: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderWidth: 1, borderColor: designSystem.colors.neutral[200], borderRadius: 12,
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff'
    },
    inputText: { fontSize: 16, color: designSystem.colors.text.primary },
    placeholderText: { fontSize: 16, color: designSystem.colors.text.tertiary },
});
