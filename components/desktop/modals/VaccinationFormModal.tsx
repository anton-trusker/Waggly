import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Switch, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { RefVaccine, calculateNextDueDate } from '@/hooks/useReferenceData';
import VaccineSelector from './shared/VaccineSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';

interface VaccinationFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

export default function VaccinationFormModal({ visible, onClose, petId: initialPetId, onSuccess }: VaccinationFormModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);

    // Get species of selected pet for filtering vaccines
    const selectedPet = useMemo(() => pets.find(p => p.id === selectedPetId), [pets, selectedPetId]);
    const petSpecies = selectedPet?.species || 'dog';

    // Vaccine from reference table
    const [selectedVaccine, setSelectedVaccine] = useState<RefVaccine | null>(null);
    const [customVaccineName, setCustomVaccineName] = useState('');

    // Form state
    const [dateGiven, setDateGiven] = useState(new Date().toISOString().split('T')[0]);
    const [nextDueDate, setNextDueDate] = useState('');
    const [clinicName, setClinicName] = useState('');
    const [clinicAddress, setClinicAddress] = useState('');
    const [vetName, setVetName] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [cost, setCost] = useState('');
    const [currency, setCurrency] = useState('EUR');
    const [reminderEnabled, setReminderEnabled] = useState(true);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (initialPetId) {
            setSelectedPetId(initialPetId);
        } else if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(pets[0].id);
        }
    }, [initialPetId, pets, selectedPetId]);

    // Auto-calculate next due date when vaccine or date changes
    useEffect(() => {
        if (selectedVaccine && dateGiven) {
            const calculatedDate = calculateNextDueDate(dateGiven, selectedVaccine.booster_interval);
            if (calculatedDate) {
                setNextDueDate(calculatedDate);
            }
        }
    }, [selectedVaccine, dateGiven]);

    const resetForm = () => {
        setSelectedVaccine(null);
        setCustomVaccineName('');
        setDateGiven(new Date().toISOString().split('T')[0]);
        setNextDueDate('');
        setClinicName('');
        setClinicAddress('');
        setVetName('');
        setBatchNumber('');
        setCost('');
        setCurrency('EUR');
        setReminderEnabled(true);
        setNotes('');
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    };

    const handleSubmit = async () => {
        const vaccineName = selectedVaccine?.vaccine_name || customVaccineName;

        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!vaccineName) {
            Alert.alert('Error', 'Please select or enter a vaccine name');
            return;
        }

        setLoading(true);
        try {
            const vaccinationData = {
                pet_id: selectedPetId,
                name: vaccineName,
                date: dateGiven,
                next_due_date: reminderEnabled ? (nextDueDate || null) : null,
                provider: vetName || clinicName || null,
                batch_number: batchNumber || null,
                cost: cost ? parseFloat(cost) : null,
                currency: currency,
                notes: notes || null,
            };

            const { error } = await supabase
                .from('vaccinations')
                .insert(vaccinationData as any);

            if (error) throw error;

            Alert.alert('Success', 'Vaccination added successfully');
            resetForm();
            onSuccess?.();
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const getTypeBadgeColor = (type: string | null) => {
        if (type === 'core') return '#10B981';
        if (type === 'non-core') return '#F59E0B';
        return '#6B7280';
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Add Vaccination</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading} style={styles.headerButton}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#0A84FF" />
                            ) : (
                                <Text style={styles.saveText}>Save</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.formContent}>

                            {/* Pet Selector */}
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>WHO IS THIS FOR?</Text>
                                <View style={styles.petRow}>
                                    {petsLoading ? (
                                        <ActivityIndicator color="#0A84FF" />
                                    ) : (
                                        pets.map((pet) => (
                                            <TouchableOpacity
                                                key={pet.id}
                                                onPress={() => {
                                                    setSelectedPetId(pet.id);
                                                    setSelectedVaccine(null); // Reset vaccine when pet changes
                                                }}
                                                style={styles.petItem}
                                            >
                                                <View style={[styles.petAvatar, selectedPetId === pet.id && styles.petAvatarSelected]}>
                                                    {pet.photo_url ? (
                                                        <Image source={{ uri: pet.photo_url }} style={styles.petImage} />
                                                    ) : (
                                                        <Ionicons name="paw" size={28} color={selectedPetId === pet.id ? '#FFFFFF' : '#6B7280'} />
                                                    )}
                                                    {selectedPetId === pet.id && (
                                                        <View style={styles.checkmark}>
                                                            <Ionicons name="checkmark" size={10} color="white" />
                                                        </View>
                                                    )}
                                                </View>
                                                <Text style={[styles.petName, selectedPetId === pet.id && styles.petNameSelected]}>
                                                    {pet.name}
                                                </Text>
                                                <Text style={styles.petSpecies}>{pet.species}</Text>
                                            </TouchableOpacity>
                                        ))
                                    )}
                                </View>
                            </View>

                            {/* Vaccine Details */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="medkit" size={20} color="#9333EA" />
                                    <Text style={styles.sectionTitle}>Vaccine Details</Text>
                                </View>

                                <View style={styles.card}>
                                    <VaccineSelector
                                        species={petSpecies}
                                        selectedVaccine={selectedVaccine}
                                        onSelect={setSelectedVaccine}
                                        customName={customVaccineName}
                                        onCustomNameChange={setCustomVaccineName}
                                    />

                                    {/* Type Badge */}
                                    {selectedVaccine?.vaccine_type && (
                                        <View style={styles.vaccineMeta}>
                                            <View style={[styles.typeBadge, { backgroundColor: getTypeBadgeColor(selectedVaccine.vaccine_type) + '20' }]}>
                                                <Text style={[styles.typeBadgeText, { color: getTypeBadgeColor(selectedVaccine.vaccine_type) }]}>
                                                    {selectedVaccine.vaccine_type.toUpperCase()}
                                                </Text>
                                            </View>
                                            {selectedVaccine.booster_interval && (
                                                <Text style={styles.boosterText}>
                                                    Booster every {selectedVaccine.booster_interval}
                                                </Text>
                                            )}
                                        </View>
                                    )}

                                    <View style={styles.row}>
                                        <View style={styles.flex1}>
                                            <UniversalDatePicker
                                                label="Date Administered"
                                                value={dateGiven}
                                                onChange={setDateGiven}
                                                mode="date"
                                            />
                                        </View>
                                        <View style={styles.flex1}>
                                            <UniversalDatePicker
                                                label="Next Due Date"
                                                value={nextDueDate}
                                                onChange={setNextDueDate}
                                                mode="date"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Clinic Details */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="business" size={20} color="#0A84FF" />
                                    <Text style={styles.sectionTitle}>Clinic Details</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Clinic / Vet Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter clinic or vet name..."
                                            placeholderTextColor="#4B5563"
                                            value={clinicName}
                                            onChangeText={setClinicName}
                                        />
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Address</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Clinic address..."
                                            placeholderTextColor="#4B5563"
                                            value={clinicAddress}
                                            onChangeText={setClinicAddress}
                                        />
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Cost</Text>
                                            <View style={styles.costRow}>
                                                <TextInput
                                                    style={[styles.input, styles.costInput]}
                                                    placeholder="0.00"
                                                    placeholderTextColor="#4B5563"
                                                    keyboardType="decimal-pad"
                                                    value={cost}
                                                    onChangeText={setCost}
                                                />
                                                <View style={styles.currencySelector}>
                                                    {['EUR', 'USD', 'GBP'].map(c => (
                                                        <TouchableOpacity
                                                            key={c}
                                                            style={[styles.currencyButton, currency === c && styles.currencyButtonActive]}
                                                            onPress={() => setCurrency(c)}
                                                        >
                                                            <Text style={[styles.currencyText, currency === c && styles.currencyTextActive]}>
                                                                {c === 'EUR' ? '€' : c === 'USD' ? '$' : '£'}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Batch/Lot Number</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="ABC123"
                                                placeholderTextColor="#4B5563"
                                                value={batchNumber}
                                                onChangeText={setBatchNumber}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Reminder */}
                            <View style={styles.section}>
                                <View style={styles.reminderRow}>
                                    <View style={styles.reminderLeft}>
                                        <Ionicons name="notifications" size={20} color="#F59E0B" />
                                        <Text style={styles.reminderText}>Set reminder for next dose</Text>
                                    </View>
                                    <Switch
                                        value={reminderEnabled}
                                        onValueChange={setReminderEnabled}
                                        trackColor={{ false: '#3A3A3C', true: '#0A84FF' }}
                                        thumbColor="#FFFFFF"
                                    />
                                </View>
                            </View>

                            {/* Notes */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="document-text" size={20} color="#6B7280" />
                                    <Text style={styles.sectionTitle}>Notes</Text>
                                </View>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Add any additional notes..."
                                    placeholderTextColor="#4B5563"
                                    multiline
                                    textAlignVertical="top"
                                    value={notes}
                                    onChangeText={setNotes}
                                />
                            </View>

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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 700,
        backgroundColor: '#0F0F10',
        borderRadius: 24,
        maxHeight: '92%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#1C1C1E',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1C1C1E',
        backgroundColor: '#0F0F10',
    },
    headerButton: {
        minWidth: 60,
    },
    cancelText: {
        color: '#9CA3AF',
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    saveText: {
        color: '#0A84FF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'right',
    },
    scrollView: {
        flex: 1,
    },
    formContent: {
        padding: 24,
        gap: 28,
    },
    section: {
        gap: 12,
    },
    sectionLabel: {
        color: '#6B7280',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 20,
        gap: 20,
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#3C3C3E',
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
    petRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginTop: 8,
    },
    petItem: {
        alignItems: 'center',
        gap: 6,
    },
    petAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2C2C2E',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    petAvatarSelected: {
        backgroundColor: '#0A84FF',
        borderColor: '#0A84FF',
    },
    petImage: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    checkmark: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#22C55E',
        borderRadius: 8,
        padding: 2,
        borderWidth: 2,
        borderColor: '#0F0F10',
    },
    petName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    petNameSelected: {
        color: '#0A84FF',
    },
    petSpecies: {
        fontSize: 11,
        color: '#4B5563',
        textTransform: 'capitalize',
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
        color: '#6B7280',
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
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        padding: 4,
    },
    currencyButton: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
    },
    currencyButtonActive: {
        backgroundColor: '#0A84FF',
    },
    currencyText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
    },
    currencyTextActive: {
        color: '#FFFFFF',
    },
    reminderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1C1C1E',
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
        color: '#FFFFFF',
    },
});
