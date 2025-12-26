import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import PetSelector from './shared/PetSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';

interface MedicationFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const TREATMENT_TYPES = ['Medication', 'Injection', 'Supplement', 'Topical', 'Eye Drops', 'Ear Drops', 'Inhaler', 'Other'];
const DOSAGE_UNITS = ['mg', 'ml', 'pills', 'tablets', 'drops', 'puffs', 'units'];
const FREQUENCIES = ['Once daily', 'Twice daily', '3 times daily', 'Every 8 hours', 'Every 12 hours', 'As needed', 'Weekly'];
const DURATION_UNITS = ['Days', 'Weeks', 'Months', 'Years'];
const ROUTE_OF_ADMIN = ['Oral', 'Topical', 'Injection (SubQ)', 'Injection (IM)', 'Injection (IV)', 'Inhalation', 'Rectal', 'Ophthalmic', 'Otic'];
const SIDE_EFFECT_SEVERITIES = ['None', 'Mild', 'Moderate', 'Severe'];
const COMMON_SIDE_EFFECTS = ['Vomiting', 'Diarrhea', 'Lethargy', 'Loss of Appetite', 'Increased Thirst', 'Increased Urination', 'Itching', 'Behavioral Changes'];

export default function MedicationFormModal({ visible, onClose, petId: initialPetId, onSuccess }: MedicationFormModalProps) {
    const { pets } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);
    const [interactionWarnings, setInteractionWarnings] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        medication_name: '',
        treatment_type: 'Medication',
        dosage_value: '',
        dosage_unit: 'mg',
        strength: '',
        form: '',
        route_of_administration: 'Oral',
        frequency: 'Once daily',
        administration_times: [] as string[],
        administration_instructions: '',
        best_time_to_give: [] as string[],
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
        unit_price: 0,
        quantity: '',
        total_cost: 0,
        currency: 'EUR',
        insurance_coverage_percent: 0,
        side_effects: [] as string[],
        severity_rating: 'None',
        side_effect_notes: '',
        contraindications: '',
        interactions: '',
        storage_instructions: '',
        reason_for_treatment: '',
        condition_being_treated: '',
        monitor_for: '',
        notes: '',
    });

    useEffect(() => {
        if (initialPetId) {
            setSelectedPetId(initialPetId);
        } else if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(pets[0].id);
        }
    }, [initialPetId, pets, selectedPetId]);

    useEffect(() => {
        if (formData.medication_name && selectedPetId) {
            checkInteractions();
        }
    }, [formData.medication_name, selectedPetId]);

    const checkInteractions = async () => {
        if (!formData.medication_name || !selectedPetId) return;
        const warnings: string[] = [];
        try {
            const { data: activeMeds } = await supabase
                .from('medications')
                .select('medication_name, treatment_type')
                .eq('pet_id', selectedPetId)
                .or('end_date.is.null,end_date.gt.' + new Date().toISOString());

            const { data: allergies } = await supabase
                .from('allergies')
                .select('allergen_name, allergy_type, severity_level')
                .eq('pet_id', selectedPetId)
                .eq('allergy_type', 'medication');

            if (allergies && allergies.length > 0) {
                allergies.forEach(allergy => {
                    if (formData.medication_name.toLowerCase().includes(allergy.allergen_name.toLowerCase())) {
                        warnings.push(`⚠️ ALLERGY WARNING: Pet has documented ${allergy.severity_level} allergy to ${allergy.allergen_name}`);
                    }
                });
            }

            if (activeMeds && activeMeds.length >= 3) {
                warnings.push(`ℹ️ INFO: Pet is currently on ${activeMeds.length} medications. Consider monitoring for polypharmacy effects.`);
            }

            setInteractionWarnings(warnings);
        } catch (error) {
            console.error('Error checking interactions:', error);
        }
    };

    const toggleSideEffect = (effect: string) => {
        if (formData.side_effects.includes(effect)) {
            setFormData({ ...formData, side_effects: formData.side_effects.filter(e => e !== effect) });
        } else {
            setFormData({ ...formData, side_effects: [...formData.side_effects, effect] });
        }
    };

    const resetForm = () => {
        setFormData({
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
            unit_price: 0,
            quantity: '',
            total_cost: 0,
            currency: 'EUR',
            insurance_coverage_percent: 0,
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
        });
        setInteractionWarnings([]);
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!formData.medication_name) {
            Alert.alert('Error', 'Please enter medication name');
            return;
        }

        if (interactionWarnings.length > 0) {
            Alert.alert(
                'Interaction Warnings',
                interactionWarnings.join('\n\n') + '\n\nDo you want to proceed?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Proceed Anyway', onPress: submitToDatabase }
                ]
            );
        } else {
            submitToDatabase();
        }
    };

    const submitToDatabase = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('medications')
                .insert({
                    pet_id: selectedPetId,
                    medication_name: formData.medication_name,
                    treatment_type: formData.treatment_type,
                    dosage_value: formData.dosage_value ? parseFloat(formData.dosage_value) : null,
                    dosage_unit: formData.dosage_unit,
                    strength: formData.strength || null,
                    form: formData.form || null,
                    route_of_administration: formData.route_of_administration,
                    frequency: formData.frequency,
                    administration_times: formData.administration_times.length > 0 ? formData.administration_times : null,
                    administration_instructions: formData.administration_instructions || null,
                    best_time_to_give: formData.best_time_to_give.length > 0 ? formData.best_time_to_give : null,
                    start_date: formData.start_date,
                    end_date: formData.end_date || null,
                    duration_value: formData.duration_value ? parseInt(formData.duration_value) : null,
                    duration_unit: formData.duration_unit,
                    is_ongoing: formData.is_ongoing,
                    prescribed_by: formData.prescribed_by || null,
                    prescription_number: formData.prescription_number || null,
                    pharmacy_name: formData.pharmacy_name || null,
                    pharmacy_phone: formData.pharmacy_phone || null,
                    auto_refill: formData.auto_refill,
                    refill_schedule: formData.auto_refill ? {
                        every: formData.refill_every,
                        quantity: formData.refill_quantity,
                    } : null,
                    refills_remaining: formData.refills_remaining ? parseInt(formData.refills_remaining) : null,
                    unit_price: formData.unit_price || null,
                    quantity: formData.quantity ? parseInt(formData.quantity) : null,
                    total_cost: formData.total_cost || null,
                    currency: formData.currency,
                    insurance_coverage_percent: formData.insurance_coverage_percent || null,
                    side_effects: formData.side_effects.length > 0 ? formData.side_effects : null,
                    severity_rating: formData.severity_rating,
                    side_effect_notes: formData.side_effect_notes || null,
                    contraindications: formData.contraindications || null,
                    interactions: formData.interactions || null,
                    storage_instructions: formData.storage_instructions || null,
                    reason_for_treatment: formData.reason_for_treatment || null,
                    condition_being_treated: formData.condition_being_treated || null,
                    monitor_for: formData.monitor_for || null,
                    notes: formData.notes || null,
                } as any);

            if (error) throw error;

            Alert.alert('Success', 'Medication added successfully');
            resetForm();
            onSuccess?.();
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Add Medication</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.formContent}>

                            <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />

                            {/* Interaction Warnings */}
                            {interactionWarnings.length > 0 && (
                                <View style={styles.warningBox}>
                                    <View style={styles.warningHeader}>
                                        <Ionicons name="warning" size={20} color="#EF4444" />
                                        <Text style={styles.warningTitle}>Warnings Detected</Text>
                                    </View>
                                    {interactionWarnings.map((warning, index) => (
                                        <Text key={index} style={styles.warningText}>• {warning}</Text>
                                    ))}
                                </View>
                            )}

                            {/* Medication Details */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="medkit" size={20} color="#0A84FF" />
                                    <Text style={styles.sectionTitle}>Medication Details</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Medication Name *</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g. Apoquel, Prednisone"
                                            placeholderTextColor="#4B5563"
                                            value={formData.medication_name}
                                            onChangeText={(text) => setFormData({ ...formData, medication_name: text })}
                                        />
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Treatment Type</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.chipRow}>
                                                {TREATMENT_TYPES.map(type => (
                                                    <TouchableOpacity
                                                        key={type}
                                                        onPress={() => setFormData({ ...formData, treatment_type: type })}
                                                        style={[styles.chip, formData.treatment_type === type && styles.chipSelected]}
                                                    >
                                                        <Text style={[styles.chipText, formData.treatment_type === type && styles.chipTextSelected]}>{type}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Dosage</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="16"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.dosage_value}
                                                onChangeText={(text) => setFormData({ ...formData, dosage_value: text })}
                                            />
                                        </View>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Unit</Text>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                <View style={styles.chipRow}>
                                                    {DOSAGE_UNITS.map(unit => (
                                                        <TouchableOpacity
                                                            key={unit}
                                                            onPress={() => setFormData({ ...formData, dosage_unit: unit })}
                                                            style={[styles.unitChip, formData.dosage_unit === unit && styles.unitChipSelected]}
                                                        >
                                                            <Text style={[styles.unitChipText, formData.dosage_unit === unit && styles.unitChipTextSelected]}>{unit}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </ScrollView>
                                        </View>
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Frequency</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.chipRow}>
                                                {FREQUENCIES.map(freq => (
                                                    <TouchableOpacity
                                                        key={freq}
                                                        onPress={() => setFormData({ ...formData, frequency: freq })}
                                                        style={[styles.chip, formData.frequency === freq && styles.chipSelected]}
                                                    >
                                                        <Text style={[styles.chipText, formData.frequency === freq && styles.chipTextSelected]}>{freq}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Route of Administration</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.chipRow}>
                                                {ROUTE_OF_ADMIN.map(route => (
                                                    <TouchableOpacity
                                                        key={route}
                                                        onPress={() => setFormData({ ...formData, route_of_administration: route })}
                                                        style={[styles.chip, formData.route_of_administration === route && styles.chipSelected]}
                                                    >
                                                        <Text style={[styles.chipText, formData.route_of_administration === route && styles.chipTextSelected]}>{route}</Text>
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
                                    <Text style={styles.sectionTitle}>Duration & Schedule</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <UniversalDatePicker
                                                label="Start Date"
                                                value={formData.start_date}
                                                onChange={(text) => setFormData({ ...formData, start_date: text })}
                                                mode="date"
                                            />
                                        </View>
                                        <View style={styles.halfWidth}>
                                            <UniversalDatePicker
                                                label="End Date (Optional)"
                                                value={formData.end_date}
                                                onChange={(text) => setFormData({ ...formData, end_date: text })}
                                                mode="date"
                                                minDate={new Date(formData.start_date)}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.switchRow}>
                                        <Text style={styles.switchLabel}>Ongoing Medication</Text>
                                        <Switch
                                            value={formData.is_ongoing}
                                            onValueChange={(val) => setFormData({ ...formData, is_ongoing: val })}
                                            trackColor={{ false: '#3F3F46', true: '#0A84FF' }}
                                        />
                                    </View>

                                    {!formData.is_ongoing && (
                                        <View style={styles.row}>
                                            <View style={styles.halfWidth}>
                                                <Text style={styles.label}>Duration</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="7"
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#4B5563"
                                                    value={formData.duration_value}
                                                    onChangeText={(text) => setFormData({ ...formData, duration_value: text })}
                                                />
                                            </View>
                                            <View style={styles.halfWidth}>
                                                <Text style={styles.label}>Unit</Text>
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                    <View style={styles.chipRow}>
                                                        {DURATION_UNITS.map(unit => (
                                                            <TouchableOpacity
                                                                key={unit}
                                                                onPress={() => setFormData({ ...formData, duration_unit: unit })}
                                                                style={[styles.unitChip, formData.duration_unit === unit && styles.unitChipSelected]}
                                                            >
                                                                <Text style={[styles.unitChipText, formData.duration_unit === unit && styles.unitChipTextSelected]}>{unit}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
                                                </ScrollView>
                                            </View>
                                        </View>
                                    )}

                                    <RichTextInput
                                        label="Administration Instructions"
                                        placeholder="Give with food, wait 30 minutes before eating..."
                                        value={formData.administration_instructions}
                                        onChangeText={(text) => setFormData({ ...formData, administration_instructions: text })}
                                        minHeight={60}
                                    />
                                </View>
                            </View>

                            {/* Side Effects */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="warning" size={20} color="#EF4444" />
                                    <Text style={styles.sectionTitle}>Side Effects</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.buttonRow}>
                                        {SIDE_EFFECT_SEVERITIES.map(severity => (
                                            <TouchableOpacity
                                                key={severity}
                                                onPress={() => setFormData({ ...formData, severity_rating: severity })}
                                                style={[
                                                    styles.severityButton,
                                                    formData.severity_rating === severity && (severity === 'None' ? styles.severityNone : styles.severityDanger)
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.severityText,
                                                    formData.severity_rating === severity && (severity === 'None' ? styles.severityTextNone : styles.severityTextDanger)
                                                ]}>
                                                    {severity}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {formData.severity_rating !== 'None' && (
                                        <>
                                            <View style={styles.fieldGroup}>
                                                <Text style={styles.label}>Symptoms Observed</Text>
                                                <View style={styles.chipWrap}>
                                                    {COMMON_SIDE_EFFECTS.map(effect => (
                                                        <TouchableOpacity
                                                            key={effect}
                                                            onPress={() => toggleSideEffect(effect)}
                                                            style={[styles.chip, formData.side_effects.includes(effect) && styles.chipDanger]}
                                                        >
                                                            <Text style={[styles.chipText, formData.side_effects.includes(effect) && styles.chipTextDanger]}>
                                                                {effect}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>

                                            <RichTextInput
                                                label="Side Effect Notes"
                                                placeholder="Describe side effects..."
                                                value={formData.side_effect_notes}
                                                onChangeText={(text) => setFormData({ ...formData, side_effect_notes: text })}
                                                minHeight={60}
                                            />
                                        </>
                                    )}
                                </View>
                            </View>

                            {/* Medical Context */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="document-text" size={20} color="#8B5CF6" />
                                    <Text style={styles.sectionTitle}>Medical Context</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Reason for Treatment</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Allergies, infection, pain management..."
                                            placeholderTextColor="#4B5563"
                                            value={formData.reason_for_treatment}
                                            onChangeText={(text) => setFormData({ ...formData, reason_for_treatment: text })}
                                        />
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Condition Being Treated</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Atopic dermatitis, UTI, arthritis..."
                                            placeholderTextColor="#4B5563"
                                            value={formData.condition_being_treated}
                                            onChangeText={(text) => setFormData({ ...formData, condition_being_treated: text })}
                                        />
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Prescribed By</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Dr. Smith, ABC Veterinary Clinic"
                                            placeholderTextColor="#4B5563"
                                            value={formData.prescribed_by}
                                            onChangeText={(text) => setFormData({ ...formData, prescribed_by: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Cost */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="cash" size={20} color="#10B981" />
                                    <Text style={styles.sectionTitle}>Cost Information</Text>
                                </View>
                                <View style={styles.card}>
                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Total Cost</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="45.50"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.total_cost.toString()}
                                                onChangeText={(text) => setFormData({ ...formData, total_cost: parseFloat(text) || 0 })}
                                            />
                                        </View>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Currency</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={formData.currency}
                                                onChangeText={(text) => setFormData({ ...formData, currency: text })}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Notes */}
                            <RichTextInput
                                label="Additional Notes"
                                placeholder="Any other important information..."
                                value={formData.notes}
                                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                minHeight={80}
                            />

                            <View style={{ height: 40 }} />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        maxHeight: '90%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    cancelText: {
        color: '#9CA3AF',
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    saveText: {
        color: '#0A84FF',
        fontSize: 17,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    formContent: {
        padding: 20,
        gap: 24,
    },
    warningBox: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 1,
        borderColor: '#EF4444',
        borderRadius: 12,
        padding: 16,
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    warningTitle: {
        color: '#EF4444',
        fontWeight: '700',
    },
    warningText: {
        color: '#EF4444',
        fontSize: 14,
        marginBottom: 4,
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
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#2C2C2E',
        borderRadius: 16,
        padding: 16,
        gap: 16,
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#FFFFFF',
        fontSize: 16,
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
        borderColor: '#374151',
        backgroundColor: '#1C1C1E',
    },
    chipSelected: {
        backgroundColor: '#0A84FF',
        borderColor: '#0A84FF',
    },
    chipText: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    chipTextSelected: {
        color: '#FFFFFF',
    },
    chipDanger: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#EF4444',
    },
    chipTextDanger: {
        color: '#EF4444',
    },
    unitChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#1C1C1E',
        marginRight: 8,
    },
    unitChipSelected: {
        backgroundColor: '#0A84FF',
    },
    unitChipText: {
        color: '#9CA3AF',
    },
    unitChipTextSelected: {
        color: '#FFFFFF',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },
    severityButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#374151',
    },
    severityNone: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    severityDanger: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#EF4444',
    },
    severityText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '500',
    },
    severityTextNone: {
        color: '#FFFFFF',
    },
    severityTextDanger: {
        color: '#EF4444',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    switchLabel: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
});
