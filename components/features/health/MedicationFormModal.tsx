import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Switch, StyleSheet } from 'react-native';
import { usePetsV2 } from '@/hooks/domain/usePetV2';
import { designSystem } from '@/constants/designSystem';
import PetSelector from '@/components/features/pets/PetSelector';
import UniversalDatePicker from '@/components/ui/UniversalDatePicker';
import RichTextInput from '@/components/ui/RichTextInput';
import FormModal, { FormState } from '@/components/ui/FormModal';
import BottomSheetSelect from '@/components/ui/BottomSheetSelect';
import { Medication } from '@/types/v2/schema';
import { useLocale } from '@/hooks/useLocale';
import { useCreateMedication, useUpdateMedication, useCreateActivityLog } from '@/hooks/domain/useHealthMutationsV2';
import MedicationSelector from '@/components/features/health/MedicationSelector';
import { RefMedication } from '@/hooks/useReferenceData';

interface MedicationFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    existingMedication?: Medication | null;
    onSuccess?: () => void;
}

const DOSAGE_UNITS = [
    { label: 'mg', value: 'mg' },
    { label: 'ml', value: 'ml' },
    { label: 'tablet', value: 'tablet' },
    { label: 'capsule', value: 'capsule' },
    { label: 'drop', value: 'drop' },
    { label: 'g', value: 'g' },
    { label: 'IU', value: 'IU' }
];
const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Every 12 hours', 'As needed'];

interface MedicationFormData {
    name: string;
    dosage_value: string;
    dosage_unit: string;
    frequency: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    notes: string;
}

export default function MedicationFormModal({ visible, onClose, petId: initialPetId, existingMedication, onSuccess }: MedicationFormModalProps) {
    const { data: pets = [] } = usePetsV2();
    const { t } = useLocale();
    const theme = designSystem;

    const { mutateAsync: createMedication } = useCreateMedication();
    const { mutateAsync: updateMedication } = useUpdateMedication();
    const { mutateAsync: logActivity } = useCreateActivityLog();

    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [selectedMedicationRef, setSelectedMedicationRef] = useState<RefMedication | null>(null);

    // Derive pet species for filtering
    const selectedPet = useMemo(() => pets.find(p => p.id === selectedPetId), [pets, selectedPetId]);
    const species = selectedPet?.species || 'dog';

    useEffect(() => {
        if (visible) {
            if (initialPetId) {
                setSelectedPetId(initialPetId);
            } else if (pets.length > 0 && !selectedPetId) {
                setSelectedPetId(pets[0].id);
            }
            if (existingMedication) {
                setSelectedMedicationRef(null);
            }
        }
    }, [visible, initialPetId, pets, existingMedication]);

    const initialData: MedicationFormData = {
        name: existingMedication?.name || '',
        dosage_value: existingMedication?.dosage ? existingMedication.dosage.split(' ')[0] : '', // Poor man's parse
        dosage_unit: existingMedication?.dosage ? existingMedication.dosage.split(' ')[1] || 'mg' : 'mg',
        frequency: existingMedication?.frequency || 'Once daily',
        start_date: existingMedication?.start_date || new Date().toISOString().split('T')[0],
        end_date: existingMedication?.end_date || '',
        is_active: existingMedication ? (existingMedication.status === 'active') : true,
        notes: existingMedication?.instructions || '', // V2 'instructions' -> 'notes'.
    };

    const handleSubmit = async (data: MedicationFormData) => {
        const medName = selectedMedicationRef?.medication_name || data.name;

        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!medName.trim()) {
            Alert.alert('Error', 'Please select or enter medication name');
            return;
        }

        const payload: any = {
            pet_id: selectedPetId,
            name: medName,
            dosage: data.dosage_value ? `${data.dosage_value} ${data.dosage_unit}` : null,
            frequency: data.frequency,
            start_date: data.start_date,
            end_date: data.end_date || null,
            instructions: data.notes || null,
            status: data.is_active ? 'active' : 'completed',
        };

        try {
            if (existingMedication) {
                await updateMedication({ id: existingMedication.id, updates: payload });
                await logActivity({
                    pet_id: selectedPetId,
                    activity_type: 'medication',
                    title: 'Medication Updated',
                    description: `Updated ${medName}`,
                    metadata: payload
                });
            } else {
                await createMedication(payload);
                await logActivity({
                    pet_id: selectedPetId,
                    activity_type: 'medication',
                    title: 'Medication Added',
                    description: `Added ${medName}`,
                    metadata: payload
                });
            }
            onSuccess?.();
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const validate = (data: MedicationFormData) => {
        const errors: Record<string, string> = {};
        if (!data.name.trim() && !selectedMedicationRef) errors.name = 'Name is required';
        return errors;
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={existingMedication ? t('treatment_form.edit_title') : t('treatment_form.add_title')}
            initialData={initialData}
            onSubmit={handleSubmit}
            validate={validate}
            submitLabel={existingMedication ? t('treatment_form.submit_update') : t('treatment_form.submit_add')}
            forceLight
        >
            {(formState: FormState<MedicationFormData>) => (
                <View style={styles.formContent}>
                    {pets.length > 1 && (
                        <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />
                    )}

                    <View style={[styles.card, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.secondary, borderWidth: 1 }]}>
                        {/* Custom Name Selector */}
                        <MedicationSelector
                            species={species}
                            selectedMedication={selectedMedicationRef}
                            onSelect={(med) => {
                                setSelectedMedicationRef(med);
                                formState.clearError('name');
                                if (med) {
                                    formState.updateField('name', med.medication_name);
                                }
                            }}
                            customName={formState.data.name}
                            onCustomNameChange={(text) => {
                                formState.updateField('name', text);
                                if (text) formState.clearError('name');
                            }}
                            error={formState.errors.name}
                        />

                        {/* Dosage */}
                        <View style={styles.row}>
                            <View style={[styles.flex1, { flex: 2 }]}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('treatment_form.dosage')}</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.background.tertiary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }] as any}
                                    placeholder="e.g. 50"
                                    keyboardType="numeric"
                                    placeholderTextColor={theme.colors.text.tertiary}
                                    value={formState.data.dosage_value}
                                    onChangeText={(text) => formState.updateField('dosage_value', text)}
                                />
                            </View>
                            <View style={[styles.flex1, { flex: 1.5 }]}>
                                <BottomSheetSelect
                                    label="Unit"
                                    value={formState.data.dosage_unit}
                                    onChange={(val) => formState.updateField('dosage_unit', val)}
                                    options={DOSAGE_UNITS}
                                    placeholder="Unit"
                                />
                            </View>
                        </View>

                        {/* Frequency */}
                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('treatment_form.frequency')}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.chipRow}>
                                    {FREQUENCIES.map(freq => (
                                        <TouchableOpacity
                                            key={freq}
                                            onPress={() => formState.updateField('frequency', freq)}
                                            style={[
                                                styles.chip,
                                                { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary },
                                                formState.data.frequency === freq && { backgroundColor: theme.colors.primary[500], borderColor: theme.colors.primary[500] }
                                            ] as any}
                                        >
                                            <Text style={[
                                                styles.chipText,
                                                { color: theme.colors.text.secondary },
                                                formState.data.frequency === freq && { color: '#FFFFFF' }
                                            ]}>{freq}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Dates */}
                        <View style={styles.row}>
                            <View style={styles.flex1}>
                                <UniversalDatePicker
                                    label={t('treatment_form.start_date')}
                                    value={formState.data.start_date}
                                    onChange={(text) => formState.updateField('start_date', text)}
                                />
                            </View>
                            <View style={styles.flex1}>
                                <UniversalDatePicker
                                    label={t('treatment_form.end_date')}
                                    value={formState.data.end_date}
                                    onChange={(text) => formState.updateField('end_date', text)}
                                    placeholder="Ongoing"
                                />
                            </View>
                        </View>

                        {/* Active Switch */}
                        <View style={styles.switchRow}>
                            <Text style={[styles.switchLabel, { color: theme.colors.text.primary }]}>Active Medication</Text>
                            <Switch
                                value={formState.data.is_active}
                                onValueChange={(val) => formState.updateField('is_active', val)}
                                trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary[500] }}
                                thumbColor="#FFFFFF"
                            />
                        </View>

                        <RichTextInput
                            label={t('treatment_form.notes')}
                            placeholder="e.g. Give with food..."
                            value={formState.data.notes}
                            onChangeText={(text) => formState.updateField('notes', text)}
                            minHeight={80}
                        />

                    </View>
                    <View style={{ height: 20 }} />
                </View>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    formContent: { gap: 16 },
    section: { gap: 8 },
    card: { borderRadius: 16, padding: 16, gap: 12 },
    fieldGroup: { gap: 4 },
    label: { fontSize: 13, fontWeight: '500', marginBottom: 4, fontFamily: 'Plus Jakarta Sans' },
    input: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, borderWidth: 1, fontFamily: 'Plus Jakarta Sans' },
    row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    flex1: { flex: 1 },
    chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    chipText: { fontSize: 14, fontWeight: '500', fontFamily: 'Plus Jakarta Sans' },
    switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 },
    switchLabel: { fontWeight: '500', fontSize: 15, fontFamily: 'Plus Jakarta Sans' },
});
