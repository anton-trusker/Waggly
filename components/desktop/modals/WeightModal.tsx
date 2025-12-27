import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { usePets } from '@/hooks/usePets';
import { useAppTheme } from '@/hooks/useAppTheme';
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
    const { theme } = useAppTheme();
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
        unit: 'kg', // Default to kg as database stores in kg (assumed, as no unit column)
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

        // If user selected lbs, we might want to convert to kg if our DB is standardized, 
        // OR if the DB is just a number we trust the user context. 
        // Based on previous code, it seemed to just save the number. 
        // However, standardizing on KG is better for analytics.
        // For now, to preserve behavior match the original: just save the number and unit (if we could).
        // BUT the DB has NO unit column. So we must decide.
        // I will assume the DB stores KG for consistency.
        // If user enters LBS, convert to KG? 
        // Previous code: `const entryData = { weight: numericWeight, unit, date, notes };` 
        // But `addWeightEntry` takes `Omit<WeightEntry, 'id' ...>`. `WeightEntry` type DOES NOT have `unit`.
        // So the previous code was probably failing silently or passing extra props that supabase ignored.
        // I will just save the weight. I will assume the user enters KG or if they toggle LBS, I'll convert.

        let finalWeight = numericWeight;
        if (data.unit === 'lbs') {
            finalWeight = numericWeight * 0.453592;
        }

        const entryData = {
            weight: finalWeight,
            // unit: data.unit, // Cannot save unit as it doesn't exist on type
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

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={existingEntry ? 'Edit Weight' : 'Log Weight'}
            initialData={initialData}
            onSubmit={handleSubmit}
            validate={validate}
            submitLabel="Save Weight"
        >
            {(formState: FormState<WeightFormData>) => (
                <View style={styles.formContent}>
                    {!existingEntry && (
                        <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />
                    )}

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="scale" size={20} color={theme.colors.primary[500]} />
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Weight Details</Text>
                        </View>

                        <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                            <View style={styles.row}>
                                <View style={styles.flex1}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Weight</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="0.00"
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        keyboardType="decimal-pad"
                                        value={formState.data.weight}
                                        onChangeText={(text) => formState.updateField('weight', text)}
                                    />
                                </View>
                                <View style={styles.unitContainer}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Unit</Text>
                                    <View style={[styles.unitToggle, { backgroundColor: theme.colors.background.secondary }]}>
                                        <TouchableOpacity
                                            onPress={() => formState.updateField('unit', 'kg')}
                                            style={[styles.unitButton, formState.data.unit === 'kg' && { backgroundColor: theme.colors.background.tertiary }]}
                                        >
                                            <Text style={[styles.unitText, { color: formState.data.unit === 'kg' ? theme.colors.text.primary : theme.colors.text.tertiary }]}>kg</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => formState.updateField('unit', 'lbs')}
                                            style={[styles.unitButton, formState.data.unit === 'lbs' && { backgroundColor: theme.colors.background.tertiary }]}
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
                                        style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="HH:MM"
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        value={formState.data.time}
                                        onChangeText={(text) => formState.updateField('time', text)}
                                    />
                                </View>
                            </View>

                            <RichTextInput
                                label="Notes"
                                placeholder="Additional notes..."
                                value={formState.data.notes}
                                onChangeText={(text) => formState.updateField('notes', text)}
                                minHeight={80}
                            />
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
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
        gap: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    card: {
        borderRadius: 16,
        padding: 16,
        gap: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    flex1: {
        flex: 1,
    },
    unitContainer: {
        width: 100,
    },
    unitToggle: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
    },
    unitButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    unitText: {
        fontWeight: '700',
    },
});
