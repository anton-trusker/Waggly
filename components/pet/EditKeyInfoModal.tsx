import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Platform, TouchableOpacity } from 'react-native';
import FormModal from '@/components/ui/FormModal';
import { designSystem } from '@/constants/designSystem';
import { usePets } from '@/hooks/usePets';
import { Pet } from '@/types/components';
import DatePickerWeb from '@/components/ui/DatePickerWeb';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface EditKeyInfoModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
}

export default function EditKeyInfoModal({ visible, onClose, petId }: EditKeyInfoModalProps) {
    const { pets, updatePet } = usePets();
    const pet = pets.find(p => p.id === petId);

    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formData, setFormData] = useState({
        microchip_number: '',
        species: '',
        blood_type: '',
        color: '',
        date_of_birth: '',
    });

    useEffect(() => {
        if (pet) {
            setFormData({
                microchip_number: pet.microchip_number || '',
                species: pet.species || '',
                blood_type: pet.blood_type || '',
                color: pet.color || '',
                date_of_birth: pet.date_of_birth || '',
            });
        }
    }, [pet, visible]);

    const handleSave = async () => {
        if (!formData.species) {
            Alert.alert('Validation Error', 'Species is required.');
            return;
        }

        setLoading(true);
        try {
            const updates: Partial<Pet> = {
                microchip_number: formData.microchip_number || null,
                species: formData.species,
                blood_type: formData.blood_type || null,
                color: formData.color || null,
                date_of_birth: formData.date_of_birth || null,
            };

            await updatePet(petId, updates as any);
            Alert.alert('Success', 'Key info updated successfully!');
            onClose();
        } catch (error) {
            console.error('Failed to update key info:', error);
            Alert.alert('Error', 'Failed to update key info. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!pet) return null;

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title="Edit Key Info"
            submitLabel="Save"
            onSubmit={handleSave}
            loading={loading}
        >
            {() => (
                <View style={styles.container}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Microchip Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.microchip_number}
                            onChangeText={(value) => updateField('microchip_number', value)}
                            placeholder="15-digit microchip number"
                            placeholderTextColor={designSystem.colors.text.tertiary}
                            keyboardType="number-pad"
                        />
                    </View>

                    <View style={styles.formRow}>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Species *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.species}
                                onChangeText={(value) => updateField('species', value)}
                                placeholder="Dog, Cat, etc."
                                placeholderTextColor={designSystem.colors.text.tertiary}
                            />
                        </View>

                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Blood Type</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.blood_type}
                                onChangeText={(value) => updateField('blood_type', value)}
                                placeholder="e.g. DEA 1.1+"
                                placeholderTextColor={designSystem.colors.text.tertiary}
                            />
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Color</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.color}
                                onChangeText={(value) => updateField('color', value)}
                                placeholder="Coat color"
                                placeholderTextColor={designSystem.colors.text.tertiary}
                            />
                        </View>

                        <View style={[styles.formGroup, { flex: 1 }]}>
                            {Platform.OS === 'web' ? (
                                <DatePickerWeb
                                    label="Date of Birth"
                                    value={formData.date_of_birth}
                                    onChange={(v) => updateField('date_of_birth', v)}
                                    placeholder="YYYY-MM-DD"
                                />
                            ) : (
                                <>
                                    <Text style={styles.label}>Date of Birth</Text>
                                    <TouchableOpacity
                                        style={styles.dateInput}
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <Text style={formData.date_of_birth ? styles.inputText : styles.placeholderText}>
                                            {formData.date_of_birth ? new Date(formData.date_of_birth).toLocaleDateString() : 'Select Date'}
                                        </Text>
                                        <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={20} color={designSystem.colors.text.tertiary} />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Mobile Date Picker */}
                    {Platform.OS !== 'web' && (
                        <CustomDatePicker
                            visible={showDatePicker}
                            date={formData.date_of_birth ? new Date(formData.date_of_birth) : new Date()}
                            onClose={() => setShowDatePicker(false)}
                            onConfirm={(date) => {
                                updateField('date_of_birth', date.toISOString().split('T')[0]);
                                setShowDatePicker(false);
                            }}
                            title="Date of Birth"
                        />
                    )}
                </View>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
        paddingVertical: 8,
    },
    formGroup: {
        gap: 8,
    },
    formRow: {
        flexDirection: 'row',
        gap: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    input: {
        borderWidth: 1,
        borderColor: designSystem.colors.border.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: designSystem.colors.text.primary,
        backgroundColor: '#fff',
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: designSystem.colors.border.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    inputText: {
        fontSize: 15,
        color: designSystem.colors.text.primary,
    },
    placeholderText: {
        fontSize: 15,
        color: designSystem.colors.text.tertiary,
    },
});
