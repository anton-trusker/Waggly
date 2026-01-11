import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Switch, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { designSystem } from '@/constants/designSystem';
import PetSelector from './shared/PetSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';
import FormModal, { FormState } from '@/components/ui/FormModal';
import BottomSheetSelect from '@/components/ui/BottomSheetSelect';
import { Treatment } from '@/types';
import { useLocale } from '@/hooks/useLocale';

interface TreatmentFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    existingTreatment?: Treatment | null;
    onSuccess?: () => void;
}

const TREATMENT_TYPES = [
    { value: 'preventive', label: 'Preventive' },
    { value: 'acute', label: 'Acute' },
    { value: 'chronic', label: 'Chronic' }
];
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
const CURRENCIES = [
    { label: 'EUR', value: 'EUR' },
    { label: 'USD', value: 'USD' },
    { label: 'GBP', value: 'GBP' },
    { label: 'CAD', value: 'CAD' },
    { label: 'AUD', value: 'AUD' },
];

interface TreatmentFormData {
    treatment_type: string;
    name: string;
    dosage_value: string;
    dosage_unit: string;
    frequency: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    cost: string;
    currency: string;
    notes: string;
    reminders_enabled: boolean;
}

export default function TreatmentFormModal({ visible, onClose, petId: initialPetId, existingTreatment, onSuccess }: TreatmentFormModalProps) {
    const { pets } = usePets();
    const { t } = useLocale();
    // Force light theme for premium consistent look
    const theme = designSystem;
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');

    useEffect(() => {
        if (visible) {
            if (initialPetId) {
                setSelectedPetId(initialPetId);
            } else if (pets.length > 0 && !selectedPetId) {
                setSelectedPetId(pets[0].id);
            }
        }
    }, [visible, initialPetId, pets]);

    const initialData: TreatmentFormData = {
        treatment_type: existingTreatment?.category || 'preventive',
        name: existingTreatment?.treatment_name || '',
        dosage_value: existingTreatment?.dosage_value ? String(existingTreatment.dosage_value) : '',
        dosage_unit: existingTreatment?.dosage_unit || 'mg',
        frequency: existingTreatment?.frequency || 'Once daily',
        start_date: existingTreatment?.start_date || new Date().toISOString().split('T')[0],
        end_date: existingTreatment?.end_date || '',
        is_active: existingTreatment ? existingTreatment.is_active : true,
        cost: existingTreatment?.cost ? String(existingTreatment.cost) : '',
        currency: existingTreatment?.currency || 'EUR',
        notes: existingTreatment?.notes || '',
        reminders_enabled: true, // DB needs this?
    };

    const handleSubmit = async (data: TreatmentFormData) => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!data.name.trim()) {
            Alert.alert('Error', 'Please enter treatment name');
            return;
        }

        const treatmentPayload = {
            pet_id: selectedPetId,
            treatment_name: data.name,
            category: data.treatment_type,
            start_date: data.start_date,
            end_date: data.end_date || null,
            frequency: data.frequency,
            dosage: data.dosage_value ? `${data.dosage_value} ${data.dosage_unit}` : null,
            dosage_value: data.dosage_value ? parseFloat(data.dosage_value) : null,
            dosage_unit: data.dosage_unit,
            notes: data.notes || null,
            is_active: data.is_active,
            cost: data.cost ? parseFloat(data.cost) : null,
            currency: data.currency,
            // created_at is default on insert
        };

        let error;
        if (existingTreatment && existingTreatment.id) {
            const { error: updateError } = await supabase
                .from('treatments')
                .update(treatmentPayload as any)
                .eq('id', existingTreatment.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('treatments')
                .insert({ ...treatmentPayload, created_at: new Date().toISOString() } as any);
            error = insertError;
        }

        if (error) throw error;
        onSuccess?.();
    };

    const validate = (data: TreatmentFormData) => {
        const errors: Record<string, string> = {};
        if (!data.name.trim()) errors.name = 'Name is required';
        return errors;
    };

    const showPetSelector = pets.length > 1;

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={existingTreatment ? t('treatment_form.edit_title') : t('treatment_form.add_title')}
            initialData={initialData}
            onSubmit={handleSubmit}
            successMessage={existingTreatment ? "Treatment updated successfully" : "Treatment added successfully"}
            submitLabel={existingTreatment ? t('treatment_form.submit_update') : t('treatment_form.submit_add')}
            validate={validate}
            forceLight
        >
            {(formState: FormState<TreatmentFormData>) => (
                <View style={styles.formContent}>
                    {showPetSelector && (
                        <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />
                    )}

                    {/* Treatment Type */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('treatment_form.type')}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.chipRow}>
                                {TREATMENT_TYPES.map(type => (
                                    <TouchableOpacity
                                        key={type.value}
                                        onPress={() => formState.updateField('treatment_type', type.value)}
                                        style={[
                                            styles.chip,
                                            { backgroundColor: theme.colors.background.tertiary, borderColor: theme.colors.border.primary },
                                            formState.data.treatment_type === type.value && { backgroundColor: theme.colors.primary[500], borderColor: theme.colors.primary[500] }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            { color: theme.colors.text.secondary },
                                            formState.data.treatment_type === type.value && { color: '#FFFFFF' }
                                        ]}>{type.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Main Form Fields */}
                    <View style={[styles.card, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.secondary, borderWidth: 1 }]}>
                        {/* Name */}
                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('treatment_form.name')}</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: theme.colors.background.tertiary,
                                        color: theme.colors.text.primary,
                                        borderColor: formState.errors.name ? theme.colors.status.error[500] : theme.colors.border.primary
                                    }
                                ]}
                                placeholder="e.g. Amoxicillin"
                                placeholderTextColor={theme.colors.text.tertiary}
                                value={formState.data.name}
                                onChangeText={(text) => formState.updateField('name', text)}
                            />
                        </View>

                        {/* Dosage */}
                        <View style={styles.row}>
                            <View style={[styles.flex1, { flex: 2 }]}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('treatment_form.dosage')}</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.background.tertiary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
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
                                            ]}
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
                            <Text style={[styles.switchLabel, { color: theme.colors.text.primary }]}>Active Treatment</Text>
                            <Switch
                                value={formState.data.is_active}
                                onValueChange={(val) => formState.updateField('is_active', val)}
                                trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary[500] }}
                                thumbColor="#FFFFFF"
                            />
                        </View>

                        {/* Cost */}
                        <View style={styles.row}>
                            <View style={[styles.flex1, { flex: 2 }]}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('treatment_form.cost')}</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.background.tertiary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                    placeholder="0.00"
                                    keyboardType="numeric"
                                    placeholderTextColor={theme.colors.text.tertiary}
                                    value={formState.data.cost}
                                    onChangeText={(text) => formState.updateField('cost', text)}
                                />
                            </View>
                            <View style={[styles.flex1, { flex: 1.5 }]}>
                                <BottomSheetSelect
                                    label="Currency"
                                    value={formState.data.currency}
                                    onChange={(val) => formState.updateField('currency', val)}
                                    options={CURRENCIES}
                                    placeholder="EUR"
                                />
                            </View>
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
    formContent: {
        gap: 16,
    },
    section: {
        gap: 8,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    fieldGroup: {
        gap: 4,
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
    row: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    flex1: {
        flex: 1,
    },
    chipRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Plus Jakarta Sans',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 4,
    },
    switchLabel: {
        fontWeight: '500',
        fontSize: 15,
        fontFamily: 'Plus Jakarta Sans',
    },
});
