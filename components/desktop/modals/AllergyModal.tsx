import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAllergies } from '@/hooks/useAllergies';
import { usePets } from '@/hooks/usePets';
import { designSystem } from '@/constants/designSystem'; // Force Light Theme
import { Allergy } from '@/types';
import PetSelector from './shared/PetSelector';
import RichTextInput from './shared/RichTextInput';
import FormModal, { FormState } from '@/components/ui/FormModal';

interface AllergyModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    existingAllergy?: Allergy | null;
    onSuccess?: () => void;
}

const SEVERITY_LEVELS = [
    { id: 'mild', label: 'Mild', color: '#22C55E' },
    { id: 'moderate', label: 'Moderate', color: '#F59E0B' },
    { id: 'severe', label: 'Severe', color: '#EF4444' },
];

interface AllergyFormData {
    name: string;
    severity: string;
    reaction: string;
    notes: string;
}

export default function AllergyModal({ visible, onClose, petId: initialPetId, existingAllergy, onSuccess }: AllergyModalProps) {
    const { pets } = usePets();
    // Force Light Theme
    const theme = designSystem;

    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || existingAllergy?.pet_id || '');

    useEffect(() => {
        if (visible) {
            if (existingAllergy?.pet_id) {
                setSelectedPetId(existingAllergy.pet_id);
            } else if (initialPetId) {
                setSelectedPetId(initialPetId);
            } else if (pets.length > 0 && !selectedPetId) {
                setSelectedPetId(pets[0].id);
            }
        }
    }, [visible, existingAllergy, initialPetId, pets]);

    const { addAllergy, updateAllergy } = useAllergies(selectedPetId || null);

    const initialData: AllergyFormData = useMemo(() => {
        if (existingAllergy) {
            let reaction = '';
            let notes = existingAllergy.notes || '';
            if (notes.startsWith('Reaction: ')) {
                const parts = notes.split('\n');
                reaction = parts[0].replace('Reaction: ', '');
                notes = parts.slice(1).join('\n');
            }
            return {
                name: existingAllergy.allergen,
                severity: existingAllergy.severity_level || 'moderate',
                reaction,
                notes,
            };
        }
        return {
            name: '',
            severity: 'moderate',
            reaction: '',
            notes: '',
        };
    }, [existingAllergy]);

    const handleSubmit = async (data: AllergyFormData) => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }

        const payload: Partial<Allergy> = {
            allergen: data.name,
            severity_level: data.severity,
            notes: data.reaction ? `Reaction: ${data.reaction}\n${data.notes}` : data.notes,
            type: 'Allergy',
            pet_id: selectedPetId
        };

        let result;
        if (existingAllergy) {
            result = await updateAllergy(existingAllergy.id, payload);
        } else {
            result = await addAllergy(payload);
        }

        if (result && result.error) {
            throw new Error(result.error.message);
        }
    };

    const validate = (data: AllergyFormData) => {
        const errors: Record<string, string> = {};
        if (!data.name.trim()) errors.name = 'Allergy name is required';
        return errors;
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={existingAllergy ? 'Edit Allergy' : 'Add Allergy'}
            initialData={initialData}
            onSubmit={handleSubmit}
            onSuccess={onSuccess}
            validate={validate}
            submitLabel="Save Allergy"
            forceLight // Force White Modal Background
        >
            {(formState: FormState<AllergyFormData>) => (
                <View style={styles.formContent}>
                    {!existingAllergy && (
                        <PetSelector
                            selectedPetId={selectedPetId}
                            onSelectPet={setSelectedPetId}
                        />
                    )}

                    <View style={[styles.card, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.secondary, borderWidth: 1 }]}>
                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Allergy Name</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: theme.colors.background.tertiary,
                                        color: theme.colors.text.primary,
                                        borderColor: formState.errors.name ? theme.colors.status.error[500] : theme.colors.border.primary
                                    }
                                ]}
                                placeholder="e.g. Peanuts, Bee Stings"
                                placeholderTextColor={theme.colors.text.tertiary}
                                value={formState.data.name}
                                onChangeText={(text) => formState.updateField('name', text)}
                            />
                            {formState.errors.name && (
                                <Text style={{ color: theme.colors.status.error[500], fontSize: 12, marginTop: -8 }}>
                                    {formState.errors.name}
                                </Text>
                            )}
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Severity</Text>
                            <View style={styles.severityRow}>
                                {SEVERITY_LEVELS.map((level) => (
                                    <TouchableOpacity
                                        key={level.id}
                                        onPress={() => formState.updateField('severity', level.id)}
                                        style={[
                                            styles.severityButton,
                                            { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary },
                                            formState.data.severity === level.id && { borderColor: level.color, backgroundColor: `${level.color}20` }
                                        ]}
                                    >
                                        <Text style={[styles.severityText, { color: formState.data.severity === level.id ? level.color : theme.colors.text.secondary }]}>
                                            {level.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Reaction Details</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.colors.background.tertiary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                placeholder="e.g. Swelling, Hives"
                                placeholderTextColor={theme.colors.text.tertiary}
                                value={formState.data.reaction}
                                onChangeText={(text) => formState.updateField('reaction', text)}
                            />
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
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    formContent: {
        gap: 16, // Compact gap
    },
    card: {
        borderRadius: 16,
        padding: 16, // Compact padding
        gap: 12, // Compact card gap
    },
    fieldGroup: {
        gap: 4, // Compact field gap
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 4,
        fontFamily: 'Plus Jakarta Sans',
    },
    input: {
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        borderWidth: 1,
        fontFamily: 'Plus Jakarta Sans',
    },
    severityRow: {
        flexDirection: 'row',
        gap: 8,
    },
    severityButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    severityText: {
        fontWeight: '700',
        fontSize: 14,
        fontFamily: 'Plus Jakarta Sans',
    },
});
