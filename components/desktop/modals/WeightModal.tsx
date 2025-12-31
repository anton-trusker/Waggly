import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { usePets } from '@/hooks/usePets';
import { designSystem } from '@/constants/designSystem'; // Use static designSystem for consistent light theme
import { WeightEntry } from '@/types';
import FormModal, { FormState } from '@/components/ui/FormModal';
import PetSelector from './shared/PetSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';

interface WeightModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
    existingEntry?: WeightEntry | null;
    onSuccess?: () => void;
}

interface WeightFormData {
    weight: string;
    unit: 'kg' | 'lbs';
    date: string;
    time: string;
    notes: string;
}

export default function WeightModal({ visible, onClose, petId: initialPetId, existingEntry, onSuccess }: WeightModalProps) {
    const { pets } = usePets();
    // Force light theme usage to match FormModal's white background and ensure premium look
    const theme = designSystem;
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const { addWeightEntry, updateWeightEntry } = useWeightEntries(selectedPetId);

    useEffect(() => {
        if (visible) {
            if (initialPetId) setSelectedPetId(initialPetId);
            else if (pets.length > 0 && !selectedPetId) setSelectedPetId(pets[0].id);
        }
    }, [visible, initialPetId, pets, selectedPetId]);

    const initialData: WeightFormData = existingEntry ? {
        weight: String(existingEntry.weight),
        unit: 'kg', // Default to kg as database stores in kg
        date: existingEntry.date.split('T')[0],
        time: '',
        notes: existingEntry.notes || '',
    } : {
        weight: '',
        unit: 'kg',
        date: new Date().toISOString().split('T')[0],
        time: '',
        notes: '',
    };

    const validate = (data: WeightFormData) => {
        const errors: Record<string, string> = {};
        if (!data.weight || isNaN(Number(data.weight))) {
            errors.weight = 'Valid weight is required';
        }
        return errors;
    };

    const handleSubmit = async (data: WeightFormData) => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }

        const numericWeight = parseFloat(data.weight);
        let finalWeight = numericWeight;

        // Convert lbs to kg if selected
        if (data.unit === 'lbs') {
            finalWeight = numericWeight * 0.453592;
        }

        const entryData = {
            weight: finalWeight,
            date: data.date,
            notes: data.notes
        };

        const result = existingEntry
            ? await updateWeightEntry(existingEntry.id, entryData)
            : await addWeightEntry(entryData);

        if (result && !result.error) {
            onSuccess?.();
            onClose();
        } else {
            throw new Error(result?.error?.message || 'Failed to save weight entry');
        }
    };

    const showPetSelector = !existingEntry && pets.length > 1;

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={existingEntry ? 'Edit Weight' : 'Log Weight'}
            initialData={initialData}
            onSubmit={handleSubmit}
            validate={validate}
            submitLabel="Save Weight"
            forceLight
        >
            {(formState: FormState<WeightFormData>) => (
                <View style={styles.formContent}>
                    {showPetSelector && (
                        <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />
                    )}

                    <View style={styles.section}>
                        {!showPetSelector && (
                            <View style={styles.sectionHeader}>
                                <View style={[styles.iconContainer, { backgroundColor: theme.colors.success[50] }]}>
                                    <Ionicons name="scale" size={20} color={theme.colors.secondary.leaf} />
                                </View>
                                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                                    Measurement
                                </Text>
                            </View>
                        )}

                        <View style={[styles.card, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary, borderWidth: 1 }]}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Weight</Text>
                                <View style={[styles.weightInputContainer, { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary }]}>
                                    <TextInput
                                        style={[styles.weightInput, { color: theme.colors.text.primary }]}
                                        placeholder="0.00"
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        keyboardType="decimal-pad"
                                        value={formState.data.weight}
                                        onChangeText={(text) => formState.updateField('weight', text)}
                                    />
                                    <View style={[styles.unitToggle, { backgroundColor: theme.colors.border.primary }]}>
                                        {/* Using border.primary (darker than tertiary) for track to show contrast with white button */}
                                        <TouchableOpacity
                                            onPress={() => formState.updateField('unit', 'kg')}
                                            style={[styles.unitButton, formState.data.unit === 'kg' && [styles.activeUnitButton, { backgroundColor: theme.colors.background.secondary, shadowColor: theme.shadows.sm.shadowColor || '#000' }]]}
                                        >
                                            <Text style={[styles.unitText, { color: formState.data.unit === 'kg' ? theme.colors.text.primary : theme.colors.text.tertiary }]}>kg</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => formState.updateField('unit', 'lbs')}
                                            style={[styles.unitButton, formState.data.unit === 'lbs' && [styles.activeUnitButton, { backgroundColor: theme.colors.background.secondary, shadowColor: theme.shadows.sm.shadowColor || '#000' }]]}
                                        >
                                            <Text style={[styles.unitText, { color: formState.data.unit === 'lbs' ? theme.colors.text.primary : theme.colors.text.tertiary }]}>lbs</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.flex1}>
                                    <UniversalDatePicker
                                        label="Date"
                                        value={formState.data.date}
                                        onChange={(text) => formState.updateField('date', text)}
                                    />
                                </View>
                                <View style={styles.flex1}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Time (Optional)</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.colors.background.tertiary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="HH:MM"
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        value={formState.data.time}
                                        onChangeText={(text) => formState.updateField('time', text)}
                                    />
                                </View>
                            </View>

                            <RichTextInput
                                label="Notes"
                                placeholder="Add any details about this weight measurement..."
                                value={formState.data.notes}
                                onChangeText={(text) => formState.updateField('notes', text)}
                                minHeight={100}
                            />
                        </View>
                    </View>
                </View>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    formContent: {
        gap: 24,
    },
    section: {
        gap: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Plus Jakarta Sans',
    },
    card: {
        borderRadius: 16,
        padding: 20,
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 8,
        fontFamily: 'Plus Jakarta Sans',
    },
    input: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
    },
    weightInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        padding: 6,
    },
    weightInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: '600',
        paddingHorizontal: 12,
        fontFamily: 'Plus Jakarta Sans',
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    flex1: {
        flex: 1,
    },
    unitToggle: {
        flexDirection: 'row',
        borderRadius: 10,
        padding: 4,
        height: 44,
    },
    unitButton: {
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 48,
    },
    activeUnitButton: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    unitText: {
        fontWeight: '600',
        fontSize: 14,
        fontFamily: 'Plus Jakarta Sans',
    },
});
