import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { useAppTheme } from '@/hooks/useAppTheme';
import { RefVaccine, calculateNextDueDate } from '@/hooks/useReferenceData';
import { Vaccination } from '@/types';
import VaccineSelector from './shared/VaccineSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import PetSelector from './shared/PetSelector';
import FormModal, { FormState } from '@/components/ui/FormModal';

interface VaccinationFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    existingVaccination?: Vaccination | null; // Added
    onSuccess?: () => void;
}

interface VaccinationFormData {
    // Vaccine
    dateGiven: string;
    nextDueDate: string;
    customVaccineName: string;

    // Clinic
    clinicName: string;
    clinicAddress: string;
    vetName: string;
    batchNumber: string;
    cost: string;
    currency: string;

    // Other
    reminderEnabled: boolean;
    notes: string;
}

export default function VaccinationFormModal({ visible, onClose, petId: initialPetId, existingVaccination, onSuccess }: VaccinationFormModalProps) {
    const { pets } = usePets();
    const { theme } = useAppTheme();

    // State managed outside form
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || existingVaccination?.pet_id || '');
    const [selectedVaccine, setSelectedVaccine] = useState<RefVaccine | null>(null);

    useEffect(() => {
        if (visible) {
            if (existingVaccination?.pet_id) {
                setSelectedPetId(existingVaccination.pet_id);
            } else if (initialPetId) {
                setSelectedPetId(initialPetId);
            } else if (pets.length > 0 && !selectedPetId) {
                setSelectedPetId(pets[0].id);
            }
            // Reset vaccine selection when opening unless editing
            if (!existingVaccination) {
                setSelectedVaccine(null);
            }
        }
    }, [visible, initialPetId, pets, existingVaccination]);

    // Initial Data
    const initialData: VaccinationFormData = useMemo(() => {
        if (existingVaccination) {
            return {
                dateGiven: existingVaccination.date_given,
                nextDueDate: existingVaccination.next_due_date || '',
                customVaccineName: existingVaccination.vaccine_name, // Use custom name initially, selector logic will check if it matches ref
                clinicName: existingVaccination.provider || '',
                clinicAddress: '', // Not in DB currently
                vetName: '', // Stored in provider often
                batchNumber: existingVaccination.batch_number || '',
                cost: existingVaccination.cost ? existingVaccination.cost.toString() : '',
                currency: existingVaccination.currency || 'EUR',
                reminderEnabled: !!existingVaccination.next_due_date,
                notes: existingVaccination.notes || '',
            };
        }
        return {
            dateGiven: new Date().toISOString().split('T')[0],
            nextDueDate: '',
            customVaccineName: '',
            clinicName: '',
            clinicAddress: '',
            vetName: '',
            batchNumber: '',
            cost: '',
            currency: 'EUR',
            reminderEnabled: true,
            notes: '',
        };
    }, [existingVaccination]);


    // Get species of selected pet for filtering vaccines
    const selectedPet = useMemo(() => pets.find(p => p.id === selectedPetId), [pets, selectedPetId]);
    const petSpecies = selectedPet?.species || 'dog';

    const getTypeBadgeColor = (type: string | null) => {
        if (type === 'core') return theme.colors.status.success;
        if (type === 'non-core') return theme.colors.status.warning;
        return theme.colors.text.secondary;
    };

    const handleSubmit = async (data: VaccinationFormData) => {
        // Prefer selected vaccine name, otherwise use custom input (or existing editing name)
        const vaccineName = selectedVaccine?.vaccine_name || data.customVaccineName;

        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!vaccineName) {
            Alert.alert('Error', 'Please select or enter a vaccine name');
            return;
        }

        const vaccinationPayload = {
            pet_id: selectedPetId,
            vaccine_name: vaccineName,
            date_given: data.dateGiven,
            category: selectedVaccine?.vaccine_type || existingVaccination?.category || 'Other',
            next_due_date: data.reminderEnabled ? (data.nextDueDate || null) : null,
            provider: data.vetName || data.clinicName || null,
            batch_number: data.batchNumber || null,
            cost: data.cost ? parseFloat(data.cost) : null,
            currency: data.currency,
            notes: data.notes || null,
            // Only update created_at if new? No, usually updated_at. Supabase might handle updated_at triggers.
        };

        let result;
        if (existingVaccination) {
            const { error } = await supabase
                .from('vaccinations')
                .update(vaccinationPayload)
                .eq('id', existingVaccination.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('vaccinations')
                .insert({ ...vaccinationPayload, created_at: new Date().toISOString() });
            if (error) throw error;
        }

        // Log the activity (only for new?) - User might want edit logs too, but typically 'added' or 'updated'
        const userId = (await supabase.auth.getUser()).data.user?.id;
        await supabase.from('activity_logs').insert({
            actor_id: userId,
            owner_id: userId,
            pet_id: selectedPetId,
            action_type: existingVaccination ? 'vaccination_updated' : 'vaccination_added',
            details: {
                vaccine_name: vaccineName,
                date_given: data.dateGiven,
            },
        });

        onSuccess?.();
    };

    const validate = (data: VaccinationFormData) => {
        const errors: Record<string, string> = {};

        // Vaccine is required - either from dropdown or custom
        // If editing and we have a custom name (loaded from DB), valid.
        if (!selectedVaccine && !data.customVaccineName) {
            errors.vaccine = 'Please select a vaccine';
        }

        return Object.keys(errors).length > 0 ? errors : null;
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={existingVaccination ? "Edit Vaccination" : "Add Vaccination"}
            initialData={initialData}
            onSubmit={handleSubmit}
            successMessage={existingVaccination ? "Vaccination updated successfully" : "Vaccination added successfully"}
            submitLabel={existingVaccination ? "Update Vaccination" : "Save Vaccination"}
        >
            {(formState: FormState<VaccinationFormData>) => {
                return (
                    <View style={styles.formContent}>
                        {/* Pet Selector (Only for new) */}
                        {!existingVaccination && (
                            <PetSelector
                                selectedPetId={selectedPetId}
                                onSelectPet={(id) => {
                                    setSelectedPetId(id);
                                    setSelectedVaccine(null); // Reset when pet changes
                                }}
                            />
                        )}

                        {/* Vaccine Details */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="medkit" size={20} color={theme.colors.primary[400]} />
                                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Vaccine Details</Text>
                            </View>

                            {/* ... Rest of UI ... */}
                            <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                                <VaccineSelector
                                    species={petSpecies}
                                    selectedVaccine={selectedVaccine}
                                    initialValue={existingVaccination?.vaccine_name} // Pass initial value for auto-match
                                    onSelect={(vaccine) => {
                                        setSelectedVaccine(vaccine);
                                        formState.clearError?.('vaccine');
                                        if (vaccine && formState.data.dateGiven && !existingVaccination) {
                                            // Only auto-calc on new or explicit change, avoid overwriting existing custom date?
                                            // Actually, if user picks a vaccine from list, we might want to suggest due date.
                                            const calc = calculateNextDueDate(formState.data.dateGiven, vaccine.booster_interval);
                                            if (calc) formState.updateField('nextDueDate', calc);
                                        }
                                    }}
                                    customName={formState.data.customVaccineName}
                                    onCustomNameChange={(name) => {
                                        formState.updateField('customVaccineName', name);
                                        if (name) formState.clearError('vaccine');
                                    }}
                                    error={formState.errors.vaccine}
                                />

                                {/* Type Badge */}
                                {(selectedVaccine?.vaccine_type || (existingVaccination?.category && existingVaccination.category !== 'Other')) && (
                                    <View style={styles.vaccineMeta}>
                                        <View style={[styles.typeBadge, { backgroundColor: getTypeBadgeColor(selectedVaccine?.vaccine_type || existingVaccination?.category || null) + '20' }]}>
                                            <Text style={[styles.typeBadgeText, { color: getTypeBadgeColor(selectedVaccine?.vaccine_type || existingVaccination?.category || null) }]}>
                                                {(selectedVaccine?.vaccine_type || existingVaccination?.category || '').toUpperCase()}
                                            </Text>
                                        </View>
                                        {selectedVaccine?.booster_interval && (
                                            <Text style={[styles.boosterText, { color: theme.colors.text.secondary }]}>
                                                Booster every {selectedVaccine.booster_interval}
                                            </Text>
                                        )}
                                    </View>
                                )}

                                <View style={styles.row}>
                                    <View style={styles.flex1}>
                                        <UniversalDatePicker
                                            label="Date Administered"
                                            value={formState.data.dateGiven}
                                            onChange={(date) => {
                                                formState.updateField('dateGiven', date);
                                                if (selectedVaccine) {
                                                    const calc = calculateNextDueDate(date, selectedVaccine.booster_interval);
                                                    if (calc) formState.updateField('nextDueDate', calc);
                                                }
                                            }}
                                            mode="date"
                                        />
                                    </View>
                                    <View style={styles.flex1}>
                                        <UniversalDatePicker
                                            label="Next Due Date"
                                            value={formState.data.nextDueDate}
                                            onChange={(date) => formState.updateField('nextDueDate', date)}
                                            mode="date"
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Clinic Details */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="business" size={20} color={theme.colors.primary[500]} />
                                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Clinic Details</Text>
                            </View>

                            <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                                <View style={styles.fieldGroup}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Clinic / Vet Name</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="Enter clinic or vet name..."
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        value={formState.data.clinicName}
                                        onChangeText={(text) => formState.updateField('clinicName', text)}
                                    />
                                </View>

                                <View style={styles.fieldGroup}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Address</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="Clinic address..."
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        value={formState.data.clinicAddress}
                                        onChangeText={(text) => formState.updateField('clinicAddress', text)}
                                    />
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.flex1}>
                                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Cost</Text>
                                        <View style={styles.costRow}>
                                            <TextInput
                                                style={[styles.input, styles.costInput, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                                placeholder="0.00"
                                                placeholderTextColor={theme.colors.text.tertiary}
                                                keyboardType="decimal-pad"
                                                value={formState.data.cost}
                                                onChangeText={(text) => formState.updateField('cost', text)}
                                            />
                                            <View style={[styles.currencySelector, { backgroundColor: theme.colors.background.secondary }]}>
                                                {['EUR', 'USD', 'GBP'].map(c => (
                                                    <TouchableOpacity
                                                        key={c}
                                                        style={[styles.currencyButton, formState.data.currency === c && { backgroundColor: theme.colors.primary[500] }]}
                                                        onPress={() => formState.updateField('currency', c)}
                                                    >
                                                        <Text style={[styles.currencyText, { color: formState.data.currency === c ? '#FFFFFF' : theme.colors.text.secondary }]}>
                                                            {c === 'EUR' ? '€' : c === 'USD' ? '$' : '£'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.flex1}>
                                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Batch/Lot Number</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                            placeholder="ABC123"
                                            placeholderTextColor={theme.colors.text.tertiary}
                                            value={formState.data.batchNumber}
                                            onChangeText={(text) => formState.updateField('batchNumber', text)}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Reminder */}
                        <View style={styles.section}>
                            <View style={[styles.reminderRow, { backgroundColor: theme.colors.background.primary }]}>
                                <View style={styles.reminderLeft}>
                                    <Ionicons name="notifications" size={20} color={theme.colors.status.warning} />
                                    <Text style={[styles.reminderText, { color: theme.colors.text.primary }]}>Set reminder for next dose</Text>
                                </View>
                                <Switch
                                    value={formState.data.reminderEnabled}
                                    onValueChange={(val) => formState.updateField('reminderEnabled', val)}
                                    trackColor={{ false: theme.colors.background.secondary, true: theme.colors.primary[500] }}
                                    thumbColor="#FFFFFF"
                                />
                            </View>
                        </View>

                        {/* Notes */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="document-text" size={20} color={theme.colors.text.secondary} />
                                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Notes</Text>
                            </View>
                            <TextInput
                                style={[styles.input, styles.textArea, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                placeholder="Add any additional notes..."
                                placeholderTextColor={theme.colors.text.tertiary}
                                multiline
                                textAlignVertical="top"
                                value={formState.data.notes}
                                onChangeText={(text) => formState.updateField('notes', text)}
                            />
                        </View>
                    </View>
                );
            }}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    formContent: {
        gap: 28,
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
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: 14,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    flex1: {
        flex: 1,
    },
    vaccineMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: -8,
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    typeBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    boosterText: {
        fontSize: 13,
    },
    costRow: {
        flexDirection: 'row',
        gap: 8,
    },
    costInput: {
        flex: 1,
    },
    currencySelector: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
    },
    currencyButton: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
    },
    currencyText: {
        fontSize: 14,
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
    reminderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    reminderText: {
        fontSize: 15,
        fontWeight: '500',
    },
});
