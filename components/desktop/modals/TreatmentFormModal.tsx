import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { useAppTheme } from '@/hooks/useAppTheme';
import PetSelector from './shared/PetSelector';
import SmartAddressInput from './shared/SmartAddressInput';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';
import FormModal, { FormState } from '@/components/ui/FormModal';

interface TreatmentFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const TREATMENT_TYPES = ['Medication', 'Supplement', 'Therapy', 'Topical', 'Injection', 'Other'];
const DOSAGE_UNITS = ['mg', 'ml', 'tablet', 'capsule', 'drop', 'g', 'IU'];
const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Every 12 hours', 'As needed'];

interface TreatmentFormData {
    treatment_type: string;
    name: string;
    dosage_value: string;
    dosage_unit: string;
    frequency: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    provider: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    cost: string;
    currency: string;
    notes: string;
    reminders_enabled: boolean;
}

export default function TreatmentFormModal({ visible, onClose, petId: initialPetId, onSuccess }: TreatmentFormModalProps) {
    const { pets } = usePets();
    const { theme } = useAppTheme();
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
        treatment_type: 'Medication',
        name: '',
        dosage_value: '',
        dosage_unit: 'mg',
        frequency: 'Once daily',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_active: true,
        provider: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        cost: '',
        currency: 'EUR',
        notes: '',
        reminders_enabled: true,
    };

    const handleRepeatLast = async (formState: FormState<TreatmentFormData>) => {
        if (!selectedPetId) return;

        try {
            const { data } = await supabase
                .from('treatments')
                .select('*')
                .eq('pet_id', selectedPetId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                formState.updateField('name', data.treatment_name || '');
                formState.updateField('dosage_value', data.dosage_value?.toString() || '');
                formState.updateField('dosage_unit', data.dosage_unit || 'mg');
                formState.updateField('frequency', data.frequency || 'Once daily');
                formState.updateField('currency', data.currency || 'EUR');
                formState.updateField('treatment_type', data.category || 'Medication');

                Alert.alert('Auto-Filled', 'Details from the last treatment have been applied.');
            } else {
                Alert.alert('Info', 'No previous treatments found.');
            }
        } catch (err) {
            console.log(err);
        }
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

        const treatmentData = {
            pet_id: selectedPetId,
            treatment_name: data.name,
            category: data.treatment_type,
            start_date: data.start_date,
            end_date: data.end_date || null,
            frequency: data.frequency,
            dosage: data.dosage_value ? `${data.dosage_value} ${data.dosage_unit}` : null,
            dosage_value: data.dosage_value ? parseFloat(data.dosage_value) : null,
            dosage_unit: data.dosage_unit,
            provider: data.provider || null,
            notes: data.notes || null,
            is_active: data.is_active,
            cost: data.cost ? parseFloat(data.cost) : null,
            currency: data.currency,
            created_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('treatments')
            .insert(treatmentData as any);

        if (error) throw error;
        onSuccess?.();
    };

    const validate = (data: TreatmentFormData) => {
        const errors: Record<string, string> = {};
        if (!data.name.trim()) errors.name = 'Name is required';
        return errors;
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title="Add Treatment"
            initialData={initialData}
            onSubmit={handleSubmit}
            successMessage="Treatment added successfully"
            submitLabel="Save Treatment"
            validate={validate}
        >
            {(formState: FormState<TreatmentFormData>) => (
                <View style={styles.formContent}>
                    <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />

                    <TouchableOpacity
                        onPress={() => handleRepeatLast(formState)}
                        style={[styles.repeatButton, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}
                    >
                        <Ionicons name="reload" size={16} color={theme.colors.primary[500]} />
                        <Text style={[styles.repeatButtonText, { color: theme.colors.primary[500] }]}>Repeat Last Treatment</Text>
                    </TouchableOpacity>

                    {/* Treatment Type */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Type</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.chipRow}>
                                {TREATMENT_TYPES.map(type => (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => formState.updateField('treatment_type', type)}
                                        style={[
                                            styles.chip,
                                            { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary },
                                            formState.data.treatment_type === type && { backgroundColor: theme.colors.primary[500], borderColor: theme.colors.primary[500] }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            { color: theme.colors.text.secondary },
                                            formState.data.treatment_type === type && { color: '#FFFFFF' }
                                        ]}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Details */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="medkit" size={20} color={theme.colors.primary[500]} />
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Details</Text>
                        </View>

                        <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                            <View style={styles.fieldGroup}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Name</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: theme.colors.background.secondary,
                                            color: theme.colors.text.primary,
                                            borderColor: formState.errors.name ? theme.colors.status.error[500] : theme.colors.border.primary
                                        }
                                    ]}
                                    placeholder="e.g. Amoxicillin, Physical Therapy"
                                    placeholderTextColor={theme.colors.text.tertiary}
                                    value={formState.data.name}
                                    onChangeText={(text) => formState.updateField('name', text)}
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Dosage</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="e.g. 50"
                                        keyboardType="numeric"
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        value={formState.data.dosage_value}
                                        onChangeText={(text) => formState.updateField('dosage_value', text)}
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Unit</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View style={styles.chipRow}>
                                            {DOSAGE_UNITS.map(unit => (
                                                <TouchableOpacity
                                                    key={unit}
                                                    onPress={() => formState.updateField('dosage_unit', unit)}
                                                    style={[
                                                        styles.chip,
                                                        { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary },
                                                        formState.data.dosage_unit === unit && { backgroundColor: theme.colors.primary[500], borderColor: theme.colors.primary[500] }
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.chipText,
                                                        { color: theme.colors.text.secondary },
                                                        formState.data.dosage_unit === unit && { color: '#FFFFFF' }
                                                    ]}>{unit}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>

                            <View style={styles.fieldGroup}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Frequency</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={styles.chipRow}>
                                        {FREQUENCIES.map(freq => (
                                            <TouchableOpacity
                                                key={freq}
                                                onPress={() => formState.updateField('frequency', freq)}
                                                style={[
                                                    styles.chip,
                                                    { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary },
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
                        </View>
                    </View>

                    {/* Schedule */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="calendar" size={20} color={theme.colors.status.warning} />
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Schedule</Text>
                        </View>
                        <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                            <UniversalDatePicker
                                label="Start Date"
                                value={formState.data.start_date}
                                onChange={(text) => formState.updateField('start_date', text)}
                            />
                            <UniversalDatePicker
                                label="End Date (Optional)"
                                value={formState.data.end_date}
                                onChange={(text) => formState.updateField('end_date', text)}
                                placeholder="Ongoing if empty"
                            />
                            <View style={styles.switchRow}>
                                <Text style={[styles.switchLabel, { color: theme.colors.text.primary }]}>Active Treatment</Text>
                                <Switch
                                    value={formState.data.is_active}
                                    onValueChange={(val) => formState.updateField('is_active', val)}
                                    trackColor={{ false: theme.colors.background.secondary, true: theme.colors.primary[500] }}
                                    thumbColor="#FFFFFF"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Provider & Cost */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="location" size={20} color={theme.colors.status.error[500]} />
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Provider & Cost</Text>
                        </View>
                        <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                            <SmartAddressInput
                                providerName={formState.data.provider}
                                setProviderName={(text) => formState.updateField('provider', text)}
                                address={formState.data.address}
                                setAddress={(text) => formState.updateField('address', text)}
                                city={formState.data.city}
                                setCity={(text) => formState.updateField('city', text)}
                                state={formState.data.state}
                                setState={(text) => formState.updateField('state', text)}
                                zip={formState.data.zip}
                                setZip={(text) => formState.updateField('zip', text)}
                                country={formState.data.country}
                                setCountry={(text) => formState.updateField('country', text)}
                            />
                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Cost</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        value={formState.data.cost}
                                        onChangeText={(text) => formState.updateField('cost', text)}
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Currency</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        value={formState.data.currency}
                                        onChangeText={(text) => formState.updateField('currency', text)}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <RichTextInput
                        label="Instructions / Notes"
                        placeholder="e.g. Give with food..."
                        value={formState.data.notes}
                        onChangeText={(text) => formState.updateField('notes', text)}
                    />

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
    repeatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    repeatButtonText: {
        fontWeight: '500',
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
    fieldGroup: {
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
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
    halfWidth: {
        flex: 1,
    },
    chipRow: {
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 12,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
    },
    switchLabel: {
        fontWeight: '500',
    },
});
