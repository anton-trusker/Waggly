import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePetsV2 } from '@/hooks/domain/usePetV2';
import { designSystem } from '@/constants/designSystem'; // Force Light Theme
import { Allergy } from '@/types/v2/schema';
import PetSelector from '@/components/features/pets/PetSelector';
import RichTextInput from '@/components/ui/RichTextInput';
import FormModal, { FormState } from '@/components/ui/FormModal';
import { useLocale } from '@/hooks/useLocale';
import { useCreateAllergy, useUpdateAllergy, useDeleteAllergy, useCreateActivityLog } from '@/hooks/domain/useHealthMutationsV2';

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

const ALLERGY_TYPES = [
    { id: 'food', label: 'Food', icon: 'fast-food' },
    { id: 'environment', label: 'Environment', icon: 'leaf' },
    { id: 'medication', label: 'Medication', icon: 'medkit' },
];

interface AllergyFormData {
    name: string;
    type: 'food' | 'environment' | 'medication';
    severity: string;
    reaction: string;
    notes: string;
}

export default function AllergyModal({ visible, onClose, petId: initialPetId, existingAllergy, onSuccess }: AllergyModalProps) {
    const { data: pets = [] } = usePetsV2();
    const { t } = useLocale();
    const theme = designSystem;

    const { mutateAsync: createAllergy } = useCreateAllergy();
    const { mutateAsync: updateAllergy } = useUpdateAllergy();
    const { mutateAsync: deleteAllergy } = useDeleteAllergy();
    const { mutateAsync: logActivity } = useCreateActivityLog();

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

    const initialData: AllergyFormData = useMemo(() => {
        if (existingAllergy) {
            return {
                name: existingAllergy.name || '',
                type: (existingAllergy.type as any) || 'environment',
                severity: existingAllergy.severity || 'moderate',
                reaction: existingAllergy.reaction || '',
                notes: existingAllergy.notes || '',
            };
        }
        return {
            name: '',
            type: 'food',
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

        const payload: any = {
            pet_id: selectedPetId,
            name: data.name,
            severity: data.severity,
            reaction: data.reaction,
            notes: data.notes || null,
            type: data.type,
        };

        try {
            if (existingAllergy) {
                await updateAllergy({ id: existingAllergy.id, updates: payload });
                await logActivity({
                    pet_id: selectedPetId,
                    activity_type: 'allergy',
                    title: 'Allergy Updated',
                    description: `Updated ${data.name}`,
                    metadata: { severity: data.severity }
                });
            } else {
                await createAllergy(payload);
                await logActivity({
                    pet_id: selectedPetId,
                    activity_type: 'allergy',
                    title: 'Allergy Added',
                    description: `Added ${data.name}`,
                    metadata: { severity: data.severity }
                });
            }
            onSuccess?.();
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleDelete = async () => {
        if (!existingAllergy) return;

        const performDelete = async () => {
            try {
                await deleteAllergy({ id: existingAllergy.id, pet_id: selectedPetId });
                await logActivity({
                    pet_id: selectedPetId,
                    activity_type: 'allergy',
                    title: 'Allergy Deleted',
                    description: `Deleted ${existingAllergy.name}`,
                });
                onSuccess?.();
                onClose();
            } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to delete');
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm(`Delete ${existingAllergy.name}?`)) performDelete();
        } else {
            Alert.alert(
                'Delete Allergy',
                `Are you sure?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: performDelete }
                ]
            );
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
            title={existingAllergy ? t('allergy_form.edit_title') : t('allergy_form.add_title')}
            initialData={initialData}
            onSubmit={handleSubmit}
            onSuccess={onSuccess}
            validate={validate}
            submitLabel={t('allergy_form.save')}
            forceLight
        >
            {(formState: FormState<AllergyFormData>) => (
                <View style={styles.formContent}>
                    {!existingAllergy && pets.length > 1 && (
                        <PetSelector
                            selectedPetId={selectedPetId}
                            onSelectPet={setSelectedPetId}
                        />
                    )}

                    <View style={[styles.card, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.secondary, borderWidth: 1 }]}>
                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('allergy_form.name')}</Text>
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
                            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('allergy_form.type') || 'Type'}</Text>
                            <View style={styles.severityRow}>
                                {ALLERGY_TYPES.map((type) => (
                                    <TouchableOpacity
                                        key={type.id}
                                        onPress={() => formState.updateField('type', type.id as any)}
                                        style={[
                                            styles.severityButton,
                                            { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary },
                                            formState.data.type === type.id && { borderColor: theme.colors.primary[500], backgroundColor: 'rgba(37, 99, 235, 0.1)' }
                                        ]}
                                    >
                                        <Ionicons
                                            name={type.icon as any}
                                            size={16}
                                            color={formState.data.type === type.id ? theme.colors.primary[500] : theme.colors.text.secondary}
                                            style={{ marginBottom: 4 }}
                                        />
                                        <Text style={[styles.severityText, { color: formState.data.type === type.id ? theme.colors.primary[500] : theme.colors.text.secondary, fontSize: 12 }]}>
                                            {type.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('allergy_form.severity')}</Text>
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
                                            {t(`allergy_form.${level.id}`)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('allergy_form.reaction')}</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.colors.background.tertiary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                placeholder="e.g. Swelling, Hives"
                                placeholderTextColor={theme.colors.text.tertiary}
                                value={formState.data.reaction}
                                onChangeText={(text) => formState.updateField('reaction', text)}
                            />
                        </View>

                        <RichTextInput
                            label={t('allergy_form.notes')}
                            placeholder="Additional notes..."
                            value={formState.data.notes}
                            onChangeText={(text) => formState.updateField('notes', text)}
                            minHeight={80}
                        />

                        {existingAllergy && (
                            <TouchableOpacity style={styles.deleteButtonFooter} onPress={handleDelete}>
                                <Text style={styles.deleteButtonText}>Delete Allergy</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    formContent: { gap: 16 },
    card: { borderRadius: 16, padding: 16, gap: 12 },
    fieldGroup: { gap: 4 },
    label: { fontSize: 13, fontWeight: '500', marginBottom: 4, fontFamily: 'Plus Jakarta Sans' },
    input: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, borderWidth: 1, fontFamily: 'Plus Jakarta Sans' },
    severityRow: { flexDirection: 'row', gap: 8 },
    severityButton: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    severityText: { fontWeight: '700', fontSize: 14, fontFamily: 'Plus Jakarta Sans' },
    deleteButtonFooter: { marginTop: 8, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
    deleteButtonText: { color: '#DC2626', fontWeight: '600', fontSize: 14 },
});
