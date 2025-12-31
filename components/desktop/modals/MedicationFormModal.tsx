import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Medication } from '@/types';
import PetSelector from './shared/PetSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';
import FormModal, { FormState } from '@/components/ui/FormModal';

interface MedicationFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    existingMedication?: Medication | null; // Added
    onSuccess?: () => void;
}

const TREATMENT_TYPES = ['Medication', 'Injection', 'Supplement', 'Topical', 'Eye Drops', 'Ear Drops', 'Inhaler', 'Other'];
const DOSAGE_UNITS = ['mg', 'ml', 'pills', 'tablets', 'drops', 'puffs', 'units'];
const FREQUENCIES = ['Once daily', 'Twice daily', '3 times daily', 'Every 8 hours', 'Every 12 hours', 'As needed', 'Weekly'];
const DURATION_UNITS = ['Days', 'Weeks', 'Months', 'Years'];
const ROUTE_OF_ADMIN = ['Oral', 'Topical', 'Injection (SubQ)', 'Injection (IM)', 'Injection (IV)', 'Inhalation', 'Rectal', 'Ophthalmic', 'Otic'];
const SIDE_EFFECT_SEVERITIES = ['None', 'Mild', 'Moderate', 'Severe'];
const COMMON_SIDE_EFFECTS = ['Vomiting', 'Diarrhea', 'Lethargy', 'Loss of Appetite', 'Increased Thirst', 'Increased Urination', 'Itching', 'Behavioral Changes'];

interface MedicationFormData {
    medication_name: string;
    treatment_type: string;
    dosage_value: string;
    dosage_unit: string;
    strength: string;
    form: string;
    route_of_administration: string;
    frequency: string;
    administration_times: string[];
    administration_instructions: string;
    best_time_to_give: string[];
    start_date: string;
    end_date: string;
    duration_value: string;
    duration_unit: string;
    is_ongoing: boolean;
    prescribed_by: string;
    prescription_number: string;
    pharmacy_name: string;
    pharmacy_phone: string;
    auto_refill: boolean;
    refill_every: string;
    refill_quantity: string;
    refills_remaining: string;
    unit_price: string;
    quantity: string;
    total_cost: string;
    currency: string;
    insurance_coverage_percent: string;
    side_effects: string[];
    severity_rating: string;
    side_effect_notes: string;
    contraindications: string;
    interactions: string;
    storage_instructions: string;
    reason_for_treatment: string;
    condition_being_treated: string;
    monitor_for: string;
    notes: string;
}

export default function MedicationFormModal({ visible, onClose, petId: initialPetId, existingMedication, onSuccess }: MedicationFormModalProps) {
    const { pets } = usePets();
    const { theme } = useAppTheme();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || existingMedication?.pet_id || '');

    useEffect(() => {
        if (visible) {
            if (existingMedication?.pet_id) {
                setSelectedPetId(existingMedication.pet_id);
            } else if (initialPetId) {
                setSelectedPetId(initialPetId);
            } else if (pets.length > 0 && !selectedPetId) {
                setSelectedPetId(pets[0].id);
            }
        }
    }, [visible, initialPetId, pets, existingMedication]);

    const initialData: MedicationFormData = useMemo(() => {
        if (existingMedication) {
            return {
                medication_name: existingMedication.medication_name,
                treatment_type: existingMedication.treatment_type || 'Medication',
                dosage_value: existingMedication.dosage_value ? existingMedication.dosage_value.toString() : '',
                dosage_unit: existingMedication.dosage_unit || 'mg',
                strength: existingMedication.strength || '',
                form: existingMedication.form || '',
                route_of_administration: existingMedication.route_of_administration || 'Oral',
                frequency: existingMedication.frequency || 'Once daily',
                administration_times: existingMedication.administration_times || [],
                administration_instructions: existingMedication.administration_instructions || '',
                best_time_to_give: existingMedication.best_time_to_give || [],
                start_date: existingMedication.start_date || new Date().toISOString().split('T')[0],
                end_date: existingMedication.end_date || '',
                duration_value: existingMedication.duration_value ? existingMedication.duration_value.toString() : '',
                duration_unit: existingMedication.duration_unit || 'Days',
                is_ongoing: existingMedication.is_ongoing || false,
                prescribed_by: existingMedication.prescribed_by || '',
                prescription_number: existingMedication.prescription_number || '',
                pharmacy_name: existingMedication.pharmacy_name || '',
                pharmacy_phone: existingMedication.pharmacy_phone || '',
                auto_refill: existingMedication.auto_refill || false,
                refill_every: existingMedication.refill_schedule?.every || '',
                refill_quantity: existingMedication.refill_schedule?.quantity || '',
                refills_remaining: existingMedication.refills_remaining ? existingMedication.refills_remaining.toString() : '',
                unit_price: existingMedication.unit_price ? existingMedication.unit_price.toString() : '',
                quantity: existingMedication.quantity ? existingMedication.quantity.toString() : '',
                total_cost: existingMedication.total_cost ? existingMedication.total_cost.toString() : '',
                currency: existingMedication.currency || 'EUR',
                insurance_coverage_percent: existingMedication.insurance_coverage_percent ? existingMedication.insurance_coverage_percent.toString() : '',
                side_effects: existingMedication.side_effects || [],
                severity_rating: existingMedication.severity_rating || 'None',
                side_effect_notes: existingMedication.side_effect_notes || '',
                contraindications: existingMedication.contraindications || '',
                interactions: existingMedication.interactions || '',
                storage_instructions: existingMedication.storage_instructions || '',
                reason_for_treatment: existingMedication.reason_for_treatment || '',
                condition_being_treated: existingMedication.condition_being_treated || '',
                monitor_for: existingMedication.monitor_for || '',
                notes: existingMedication.notes || '',
            };
        }
        return {
            medication_name: '',
            treatment_type: 'Medication',
            dosage_value: '',
            dosage_unit: 'mg',
            strength: '',
            form: '',
            route_of_administration: 'Oral',
            frequency: 'Once daily',
            administration_times: [],
            administration_instructions: '',
            best_time_to_give: [],
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            duration_value: '',
            duration_unit: 'Days',
            is_ongoing: false,
            prescribed_by: '',
            prescription_number: '',
            pharmacy_name: '',
            pharmacy_phone: '',
            auto_refill: false,
            refill_every: '',
            refill_quantity: '',
            refills_remaining: '',
            unit_price: '',
            quantity: '',
            total_cost: '',
            currency: 'EUR',
            insurance_coverage_percent: '',
            side_effects: [],
            severity_rating: 'None',
            side_effect_notes: '',
            contraindications: '',
            interactions: '',
            storage_instructions: '',
            reason_for_treatment: '',
            condition_being_treated: '',
            monitor_for: '',
            notes: '',
        };
    }, [existingMedication]);

    const checkInteractions = async (medName: string, petId: string): Promise<string[]> => {
        if (!medName || !petId) return [];
        const warnings: string[] = [];
        try {
            const { data: activeMeds } = await supabase
                .from('medications')
                .select('medication_name, treatment_type')
                .eq('pet_id', petId)
                .neq('medication_name', medName) // Don't match against self
                .or('end_date.is.null,end_date.gt.' + new Date().toISOString());

            const { data: allergies } = await supabase
                .from('allergies')
                .select('allergen, allergy_type, severity_level')
                .eq('pet_id', petId)
                .eq('allergy_type', 'medication');

            if (allergies && allergies.length > 0) {
                allergies.forEach(allergy => {
                    if (medName.toLowerCase().includes(allergy.allergen.toLowerCase())) {
                        warnings.push(`⚠️ ALLERGY WARNING: Pet has documented ${allergy.severity_level} allergy to ${allergy.allergen}`);
                    }
                });
            }

            if (activeMeds && activeMeds.length >= 3) {
                warnings.push(`ℹ️ INFO: Pet is currently on ${activeMeds.length} other medications. Consider monitoring for polypharmacy effects.`);
            }
        } catch (error) {
            console.error('Error checking interactions:', error);
        }
        return warnings;
    };

    const insertToDb = async (data: MedicationFormData) => {
        const payload = {
            pet_id: selectedPetId,
            medication_name: data.medication_name,
            treatment_type: data.treatment_type,
            dosage_value: data.dosage_value ? parseFloat(data.dosage_value) : null,
            dosage_unit: data.dosage_unit,
            strength: data.strength || null,
            form: data.form || null,
            route_of_administration: data.route_of_administration,
            frequency: data.frequency,
            administration_times: data.administration_times.length > 0 ? data.administration_times : null,
            administration_instructions: data.administration_instructions || null,
            best_time_to_give: data.best_time_to_give.length > 0 ? data.best_time_to_give : null,
            start_date: data.start_date,
            end_date: data.end_date || null,
            duration_value: data.duration_value ? parseInt(data.duration_value) : null,
            duration_unit: data.duration_unit,
            is_ongoing: data.is_ongoing,
            prescribed_by: data.prescribed_by || null,
            prescription_number: data.prescription_number || null,
            pharmacy_name: data.pharmacy_name || null,
            pharmacy_phone: data.pharmacy_phone || null,
            auto_refill: data.auto_refill,
            refill_schedule: data.auto_refill ? {
                every: data.refill_every,
                quantity: data.refill_quantity,
            } : null,
            refills_remaining: data.refills_remaining ? parseInt(data.refills_remaining) : null,
            unit_price: data.unit_price ? parseFloat(data.unit_price) : null,
            quantity: data.quantity ? parseInt(data.quantity) : null,
            total_cost: data.total_cost ? parseFloat(data.total_cost) : null,
            currency: data.currency,
            insurance_coverage_percent: data.insurance_coverage_percent ? parseFloat(data.insurance_coverage_percent) : null,
            side_effects: data.side_effects.length > 0 ? data.side_effects : null,
            severity_rating: data.severity_rating,
            side_effect_notes: data.side_effect_notes || null,
            contraindications: data.contraindications || null,
            interactions: data.interactions || null,
            storage_instructions: data.storage_instructions || null,
            reason_for_treatment: data.reason_for_treatment || null,
            condition_being_treated: data.condition_being_treated || null,
            monitor_for: data.monitor_for || null,
            notes: data.notes || null,
        };

        let result;
        if (existingMedication) {
            const { error } = await supabase
                .from('medications')
                .update(payload as any)
                .eq('id', existingMedication.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('medications')
                .insert(payload as any);
            if (error) throw error;
        }

        // Log activity
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (userId) {
            await supabase.from('activity_logs').insert({
                actor_id: userId,
                owner_id: userId,
                pet_id: selectedPetId,
                action_type: existingMedication ? 'medication_updated' : 'medication_added',
                details: {
                    medication_name: data.medication_name,
                    start_date: data.start_date,
                    treatment_type: data.treatment_type
                },
            });
        }
    };

    const handleSubmit = async (data: MedicationFormData) => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }

        const warnings = await checkInteractions(data.medication_name, selectedPetId);

        if (warnings.length > 0) {
            return new Promise<void>((resolve, reject) => {
                Alert.alert(
                    'Interaction Warnings',
                    warnings.join('\n\n') + '\n\nDo you want to proceed?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => reject(new Error('User cancelled due to warnings'))
                        },
                        {
                            text: 'Proceed Anyway',
                            onPress: async () => {
                                try {
                                    await insertToDb(data);
                                    onSuccess?.();
                                    resolve();
                                } catch (err) {
                                    reject(err);
                                }
                            }
                        }
                    ]
                );
            });
        } else {
            await insertToDb(data);
            onSuccess?.();
        }
    };

    const validate = (data: MedicationFormData) => {
        const errors: Record<string, string> = {};
        if (!data.medication_name) errors.medication_name = 'Medication name is required';
        return errors;
    };

    const toggleSideEffect = (effect: string, formState: FormState<MedicationFormData>) => {
        const current = formState.data.side_effects || [];
        if (current.includes(effect)) {
            formState.updateField('side_effects', current.filter(e => e !== effect));
        } else {
            formState.updateField('side_effects', [...current, effect]);
        }
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={existingMedication ? "Edit Medication" : "Add Medication"}
            initialData={initialData}
            onSubmit={handleSubmit}
            validate={validate}
            submitLabel={existingMedication ? "Update Medication" : "Save Medication"}
        >
            {(formState: FormState<MedicationFormData>) => (
                <View style={styles.formContent}>
                    {!existingMedication && (
                        <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />
                    )}

                    {/* Medication Details */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="medkit" size={20} color={theme.colors.primary[500]} />
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Medication Details</Text>
                        </View>

                        <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                            <View style={styles.fieldGroup}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Medication Name *</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: formState.errors.medication_name ? theme.colors.status.error[500] : theme.colors.border.primary }]}
                                    placeholder="e.g. Apoquel, Prednisone"
                                    placeholderTextColor={theme.colors.text.tertiary}
                                    value={formState.data.medication_name}
                                    onChangeText={(text) => formState.updateField('medication_name', text)}
                                />
                                {formState.errors.medication_name && (
                                    <Text style={{ color: theme.colors.status.error[500], fontSize: 12 }}>
                                        {formState.errors.medication_name}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.fieldGroup}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Treatment Type</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={styles.chipRow}>
                                        {TREATMENT_TYPES.map(type => (
                                            <TouchableOpacity
                                                key={type}
                                                onPress={() => formState.updateField('treatment_type', type)}
                                                style={[
                                                    styles.chip,
                                                    { borderColor: theme.colors.border.primary, backgroundColor: theme.colors.background.secondary },
                                                    formState.data.treatment_type === type && { backgroundColor: theme.colors.primary[500], borderColor: theme.colors.primary[500] }
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.chipText,
                                                    { color: theme.colors.text.secondary },
                                                    formState.data.treatment_type === type && { color: '#FFFFFF' }
                                                ]}>
                                                    {type}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Dosage</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="16"
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
                                                        { borderColor: theme.colors.border.primary, backgroundColor: theme.colors.background.secondary },
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
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Route of Administration</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={styles.chipRow}>
                                        {ROUTE_OF_ADMIN.map(route => (
                                            <TouchableOpacity
                                                key={route}
                                                onPress={() => formState.updateField('route_of_administration', route)}
                                                style={[
                                                    styles.chip,
                                                    { borderColor: theme.colors.border.primary, backgroundColor: theme.colors.background.secondary },
                                                    formState.data.route_of_administration === route && { backgroundColor: theme.colors.primary[500], borderColor: theme.colors.primary[500] }
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.chipText,
                                                    { color: theme.colors.text.secondary },
                                                    formState.data.route_of_administration === route && { color: '#FFFFFF' }
                                                ]}>{route}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
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
                                                    { borderColor: theme.colors.border.primary, backgroundColor: theme.colors.background.secondary },
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

                    {/* Duration & Schedule */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="calendar" size={20} color="#F59E0B" />
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Duration & Schedule</Text>
                        </View>

                        <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <UniversalDatePicker
                                        label="Start Date"
                                        value={formState.data.start_date}
                                        onChange={(text) => formState.updateField('start_date', text)}
                                        mode="date"
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <UniversalDatePicker
                                        label="End Date (Optional)"
                                        value={formState.data.end_date}
                                        onChange={(text) => formState.updateField('end_date', text)}
                                        mode="date"
                                        minDate={new Date(formState.data.start_date)}
                                    />
                                </View>
                            </View>

                            <View style={[styles.reminderRow, { backgroundColor: theme.colors.background.secondary }]}>
                                <Text style={[styles.reminderText, { color: theme.colors.text.primary }]}>Ongoing Medication</Text>
                                <Switch
                                    value={formState.data.is_ongoing}
                                    onValueChange={(val) => formState.updateField('is_ongoing', val)}
                                    trackColor={{ false: theme.colors.border.primary, true: theme.colors.primary[500] }}
                                    thumbColor={theme.colors.text.inverse}
                                />
                            </View>

                            <RichTextInput
                                label="Administration Instructions"
                                placeholder="Give with food, wait 30 minutes before eating..."
                                value={formState.data.administration_instructions}
                                onChangeText={(text) => formState.updateField('administration_instructions', text)}
                                minHeight={60}
                            />
                        </View>
                    </View>

                    {/* Medical Context */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="document-text" size={20} color="#8B5CF6" />
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Medical Context</Text>
                        </View>

                        <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                            <View style={styles.fieldGroup}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Reason for Treatment</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                    placeholder="Allergies, infection, pain management..."
                                    placeholderTextColor={theme.colors.text.tertiary}
                                    value={formState.data.reason_for_treatment}
                                    onChangeText={(text) => formState.updateField('reason_for_treatment', text)}
                                />
                            </View>

                            <View style={styles.fieldGroup}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Condition Being Treated</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                    placeholder="Atopic dermatitis, UTI, arthritis..."
                                    placeholderTextColor={theme.colors.text.tertiary}
                                    value={formState.data.condition_being_treated}
                                    onChangeText={(text) => formState.updateField('condition_being_treated', text)}
                                />
                            </View>

                            <View style={styles.fieldGroup}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Prescribed By</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                    placeholder="Dr. Smith, ABC Veterinary Clinic"
                                    placeholderTextColor={theme.colors.text.tertiary}
                                    value={formState.data.prescribed_by}
                                    onChangeText={(text) => formState.updateField('prescribed_by', text)}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Cost */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="cash" size={20} color="#10B981" />
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Cost Information</Text>
                        </View>
                        <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Total Cost</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        value={formState.data.total_cost}
                                        onChangeText={(text) => formState.updateField('total_cost', text)}
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

                    {/* Side Effects */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="warning" size={20} color="#EF4444" />
                            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Side Effects</Text>
                        </View>

                        <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                            <View style={styles.buttonRow}>
                                {SIDE_EFFECT_SEVERITIES.map(severity => {
                                    const isSelected = formState.data.severity_rating === severity;
                                    const isNone = severity === 'None';
                                    return (
                                        <TouchableOpacity
                                            key={severity}
                                            onPress={() => formState.updateField('severity_rating', severity)}
                                            style={[
                                                styles.severityButton,
                                                { borderWidth: 1, borderColor: theme.colors.border.primary },
                                                isSelected && (
                                                    isNone
                                                        ? { backgroundColor: theme.colors.status.success + '20', borderColor: theme.colors.status.success }
                                                        : { backgroundColor: theme.colors.status.error['500'] + '20', borderColor: theme.colors.status.error['500'] }
                                                )
                                            ]}
                                        >
                                            <Text style={[
                                                styles.severityText,
                                                { color: theme.colors.text.secondary },
                                                isSelected && (
                                                    isNone
                                                        ? { color: theme.colors.status.success }
                                                        : { color: theme.colors.status.error['500'] }
                                                )
                                            ]}>
                                                {severity}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {formState.data.severity_rating !== 'None' && (
                                <>
                                    <View style={styles.fieldGroup}>
                                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Symptoms Observed</Text>
                                        <View style={styles.chipWrap}>
                                            {COMMON_SIDE_EFFECTS.map(effect => (
                                                <TouchableOpacity
                                                    key={effect}
                                                    onPress={() => toggleSideEffect(effect, formState)}
                                                    style={[
                                                        styles.chip,
                                                        { borderColor: theme.colors.border.primary, backgroundColor: theme.colors.background.secondary },
                                                        formState.data.side_effects.includes(effect) && { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: '#EF4444' }
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.chipText,
                                                        { color: theme.colors.text.secondary },
                                                        formState.data.side_effects.includes(effect) && { color: '#EF4444' }
                                                    ]}>
                                                        {effect}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <RichTextInput
                                        label="Side Effect Notes"
                                        placeholder="Describe side effects..."
                                        value={formState.data.side_effect_notes}
                                        onChangeText={(text) => formState.updateField('side_effect_notes', text)}
                                        minHeight={60}
                                    />
                                </>
                            )}
                        </View>
                    </View>

                    {/* Notes */}
                    <RichTextInput
                        label="Additional Notes"
                        placeholder="Any other important information..."
                        value={formState.data.notes}
                        onChangeText={(text) => formState.updateField('notes', text)}
                        minHeight={80}
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
    section: {
        gap: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    card: {
        borderRadius: 16,
        padding: 20,
        gap: 20,
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
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
    chipWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },
    severityButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    severityText: {
        fontSize: 13,
        fontWeight: '700',
    },
    reminderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    reminderText: {
        fontSize: 15,
        fontWeight: '500',
    },
});
