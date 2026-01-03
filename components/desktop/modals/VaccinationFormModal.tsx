import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { designSystem } from '@/constants/designSystem'; // Force Light Theme
import { useVaccines, RefVaccine, calculateNextDueDate } from '@/hooks/useReferenceData';
import { Vaccination } from '@/types';
import VaccineSelector from './shared/VaccineSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import PetSelector from './shared/PetSelector';
import RichTextInput from './shared/RichTextInput';
import FormModal, { FormState } from '@/components/ui/FormModal';
import BottomSheetSelect from '@/components/ui/BottomSheetSelect';

interface VaccinationFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    existingVaccination?: Vaccination | null;
    onSuccess?: () => void;
}

interface VaccinationFormData {
    // Vaccine
    dateGiven: string;
    nextDueDate: string;
    customVaccineName: string;

    // Clinic
    clinicName: string;
    vetName: string;
    batchNumber: string;
    cost: string;
    currency: string;

    // Other
    reminderEnabled: boolean;
    notes: string;
}

const CURRENCIES = [
    { label: 'EUR', value: 'EUR' },
    { label: 'USD', value: 'USD' },
    { label: 'GBP', value: 'GBP' },
    { label: 'CAD', value: 'CAD' },
    { label: 'AUD', value: 'AUD' },
];

export default function VaccinationFormModal({ visible, onClose, petId: initialPetId, existingVaccination, onSuccess }: VaccinationFormModalProps) {
    const { pets } = usePets();
    // Force light theme
    const theme = designSystem;

    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || existingVaccination?.pet_id || '');
    const [selectedVaccine, setSelectedVaccine] = useState<RefVaccine | null>(null);

    const selectedPet = useMemo(() => pets.find(p => p.id === selectedPetId), [pets, selectedPetId]);
    const petSpecies = selectedPet?.species || 'dog';
    const { vaccines } = useVaccines(petSpecies);

    useEffect(() => {
        if (visible) {
            if (existingVaccination?.pet_id) {
                setSelectedPetId(existingVaccination.pet_id);
            } else if (initialPetId) {
                setSelectedPetId(initialPetId);
            } else if (pets.length > 0 && !selectedPetId) {
                setSelectedPetId(pets[0].id);
            }

            if (existingVaccination) {
                // Try to find matching vaccine
                if (vaccines.length > 0) {
                    const match = vaccines.find(v => v.vaccine_name === existingVaccination.vaccine_name);
                    if (match) {
                        setSelectedVaccine(match);
                    } else {
                        // If custom or not found in list, implicit handling via customName
                        setSelectedVaccine(null);
                    }
                }
            } else {
                setSelectedVaccine(null);
            }
        }
    }, [visible, initialPetId, pets, existingVaccination, vaccines]);

    const initialData: VaccinationFormData = useMemo(() => {
        if (existingVaccination) {
            return {
                dateGiven: existingVaccination.date_given,
                nextDueDate: existingVaccination.next_due_date || '',
                customVaccineName: existingVaccination.vaccine_name,
                clinicName: existingVaccination.provider || '',
                vetName: '',
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
            vetName: '',
            batchNumber: '',
            cost: '',
            currency: 'EUR',
            reminderEnabled: true,
            notes: '',
        };
    }, [existingVaccination]);



    const getTypeBadgeColor = (type: string | null) => {
        if (type === 'core') return theme.colors.status.success;
        if (type === 'non-core') return theme.colors.status.warning;
        return theme.colors.text.secondary;
    };

    const handleSubmit = async (data: VaccinationFormData) => {
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
        };

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

    const handleDelete = async () => {
        if (!existingVaccination) return;

        const performDelete = async () => {
            try {
                const { error } = await supabase
                    .from('vaccinations')
                    .delete()
                    .eq('id', existingVaccination.id);

                if (error) {
                    Alert.alert('Delete Failed', error.message || 'Could not delete vaccination.');
                } else {
                    const userId = (await supabase.auth.getUser()).data.user?.id;
                    await supabase.from('activity_logs').insert({
                        actor_id: userId,
                        owner_id: userId,
                        pet_id: selectedPetId,
                        action_type: 'vaccination_deleted',
                        details: {
                            vaccine_name: existingVaccination.vaccine_name,
                        },
                    });

                    onSuccess?.();
                    onClose();
                }
            } catch (error: any) {
                console.error('Delete exception:', error);
                Alert.alert('Error', error.message || 'Failed to delete vaccination');
            }
        };

        if (Platform.OS === 'web') {
            if (window.confirm(`Are you sure you want to delete this vaccination record for ${existingVaccination.vaccine_name}?`)) {
                await performDelete();
            }
        } else {
            Alert.alert(
                'Delete Vaccination',
                `Are you sure you want to delete this vaccination record for ${existingVaccination.vaccine_name}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: performDelete,
                    },
                ]
            );
        }
    };

    const validate = (data: VaccinationFormData) => {
        const errors: Record<string, string> = {};
        if (!selectedVaccine && !data.customVaccineName) {
            errors.vaccine = 'Please select a vaccine';
        }
        return Object.keys(errors).length > 0 ? errors : null;
    };

    const showPetSelector = !existingVaccination && pets.length > 1;

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={existingVaccination ? "Edit Vaccination" : "Add Vaccination"}
            initialData={initialData}
            onSubmit={handleSubmit}
            successMessage={existingVaccination ? "Vaccination updated successfully" : "Vaccination added successfully"}
            submitLabel={existingVaccination ? "Update Vaccination" : "Save Vaccination"}
            validate={validate}
            forceLight // Added to ensure modal background is white
        >
            {(formState: FormState<VaccinationFormData>) => (
                <View style={styles.formContent}>
                    {showPetSelector && (
                        <PetSelector
                            selectedPetId={selectedPetId}
                            onSelectPet={(id) => {
                                setSelectedPetId(id);
                                setSelectedVaccine(null);
                            }}
                        />
                    )}

                    <View style={[styles.card, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.secondary, borderWidth: 1 }]}>
                        <VaccineSelector
                            species={petSpecies}
                            selectedVaccine={selectedVaccine}
                            initialValue={existingVaccination?.vaccine_name}
                            onSelect={(vaccine) => {
                                setSelectedVaccine(vaccine);
                                formState.clearError?.('vaccine');
                                if (vaccine && formState.data.dateGiven && !existingVaccination) {
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
                                    label="Date Given"
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
                                    label="Next Due"
                                    value={formState.data.nextDueDate}
                                    onChange={(date) => formState.updateField('nextDueDate', date)}
                                    mode="date"
                                />
                            </View>
                        </View>

                        <View style={styles.switchRow}>
                            <Text style={[styles.switchLabel, { color: theme.colors.text.primary }]}>Set Reminder</Text>
                            <Switch
                                value={formState.data.reminderEnabled}
                                onValueChange={(val) => formState.updateField('reminderEnabled', val)}
                                trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary[500] }}
                                thumbColor="#FFFFFF"
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Clinic / Vet</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.colors.background.tertiary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                placeholder="Clinic Name"
                                placeholderTextColor={theme.colors.text.tertiary}
                                value={formState.data.clinicName}
                                onChangeText={(text) => formState.updateField('clinicName', text)}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.flex1}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Batch #</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.colors.background.tertiary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                    placeholder="Lot Number"
                                    placeholderTextColor={theme.colors.text.tertiary}
                                    value={formState.data.batchNumber}
                                    onChangeText={(text) => formState.updateField('batchNumber', text)}
                                />
                            </View>
                            <View style={[styles.flex1, { flex: 2 }]}>
                                {/* Cost */}
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Cost</Text>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <TextInput
                                        style={[styles.input, { flex: 1, backgroundColor: theme.colors.background.tertiary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        value={formState.data.cost}
                                        onChangeText={(text) => formState.updateField('cost', text)}
                                    />
                                    <View style={{ width: 80 }}>
                                        <BottomSheetSelect
                                            value={formState.data.currency}
                                            onChange={(val) => formState.updateField('currency', val)}
                                            options={CURRENCIES}
                                            placeholder="EUR"
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <RichTextInput
                            label="Notes"
                            placeholder="Add vaccination notes..."
                            value={formState.data.notes}
                            onChangeText={(text) => formState.updateField('notes', text)}
                            minHeight={80}
                        />
                    </View>

                    <View style={{ height: 20 }} />

                    {existingVaccination && (
                        <TouchableOpacity style={styles.deleteButtonFooter} onPress={handleDelete}>
                            <Text style={styles.deleteButtonText}>Delete Vaccination</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    formContent: {
        gap: 16,
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
    vaccineMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: -8,
        marginBottom: 4,
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    typeBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        fontFamily: 'Plus Jakarta Sans',
    },
    boosterText: {
        fontSize: 13,
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
    switchLabel: {
        fontWeight: '500',
        fontSize: 15,
        fontFamily: 'Plus Jakarta Sans',
    },
    deleteButtonFooter: {
        marginTop: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    deleteButtonText: {
        color: '#DC2626',
        fontWeight: '600',
        fontSize: 14,
    },
});
