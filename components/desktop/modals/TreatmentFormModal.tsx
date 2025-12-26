import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import PetSelector from './shared/PetSelector';
import SmartAddressInput from './shared/SmartAddressInput';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';

interface TreatmentFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const TREATMENT_TYPES = ['Medication', 'Supplement', 'Therapy', 'Topical', 'Injection', 'Other'];
const DOSAGE_UNITS = ['mg', 'ml', 'tablet', 'capsule', 'drop', 'g', 'IU'];
const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Every 12 hours', 'As needed'];

export default function TreatmentFormModal({ visible, onClose, petId: initialPetId, onSuccess }: TreatmentFormModalProps) {
    const { pets } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
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
    });

    useEffect(() => {
        if (initialPetId) {
            setSelectedPetId(initialPetId);
        } else if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(pets[0].id);
        }
    }, [initialPetId, pets, selectedPetId]);

    const resetForm = () => {
        setFormData({
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
        });
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    };

    const handleRepeatLast = async () => {
        if (!selectedPetId) return;
        setLoading(true);
        try {
            const { data } = await supabase
                .from('medications')
                .select('*')
                .eq('pet_id', selectedPetId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    name: data.name || prev.name,
                    dosage_value: data.dosage_value?.toString() || prev.dosage_value,
                    dosage_unit: data.dosage_unit || prev.dosage_unit,
                    frequency: data.frequency || prev.frequency,
                    currency: data.currency || prev.currency,
                }));
                Alert.alert('Auto-Filled', 'Details from the last medication have been applied.');
            } else {
                Alert.alert('Info', 'No previous medications found.');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!formData.name) {
            Alert.alert('Error', 'Please enter medication name');
            return;
        }

        setLoading(true);
        try {
            const { error } = await (supabase
                .from('medications') as any)
                .insert({
                    pet_id: selectedPetId,
                    name: formData.name,
                    dosage_value: formData.dosage_value ? parseFloat(formData.dosage_value) : null,
                    dosage_unit: formData.dosage_unit,
                    frequency: formData.frequency,
                    start_date: formData.start_date,
                    end_date: formData.end_date || null,
                    reminders_enabled: formData.reminders_enabled,
                    cost: formData.cost ? parseFloat(formData.cost) : null,
                    currency: formData.currency,
                    notes: formData.notes || null,
                });

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
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Add Treatment</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.formContent}>

                            <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />

                            <TouchableOpacity onPress={handleRepeatLast} style={styles.repeatButton}>
                                <Ionicons name="reload" size={16} color="#0A84FF" />
                                <Text style={styles.repeatButtonText}>Repeat Last Medication</Text>
                            </TouchableOpacity>

                            {/* Medication Details */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="medkit" size={20} color="#0A84FF" />
                                    <Text style={styles.sectionTitle}>Medication Details</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Medication Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g. Amoxicillin"
                                            placeholderTextColor="#4B5563"
                                            value={formData.name}
                                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                                        />
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Dosage</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="e.g. 50"
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
                                                            style={[styles.chip, formData.dosage_unit === unit && styles.chipSelected]}
                                                        >
                                                            <Text style={[styles.chipText, formData.dosage_unit === unit && styles.chipTextSelected]}>{unit}</Text>
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
                                </View>
                            </View>

                            {/* Schedule */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="calendar" size={20} color="#F59E0B" />
                                    <Text style={styles.sectionTitle}>Schedule</Text>
                                </View>
                                <View style={styles.card}>
                                    <UniversalDatePicker
                                        label="Start Date"
                                        value={formData.start_date}
                                        onChange={(text) => setFormData({ ...formData, start_date: text })}
                                    />
                                    <UniversalDatePicker
                                        label="End Date (Optional)"
                                        value={formData.end_date}
                                        onChange={(text) => setFormData({ ...formData, end_date: text })}
                                        placeholder="Ongoing if empty"
                                    />
                                    <View style={styles.switchRow}>
                                        <Text style={styles.switchLabel}>Enable Reminders</Text>
                                        <Switch
                                            value={formData.reminders_enabled}
                                            onValueChange={(val) => setFormData({ ...formData, reminders_enabled: val })}
                                            trackColor={{ false: '#3F3F46', true: '#0A84FF' }}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Provider */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="location" size={20} color="#EC4899" />
                                    <Text style={styles.sectionTitle}>Pharmacy / Provider</Text>
                                </View>
                                <View style={styles.card}>
                                    <SmartAddressInput
                                        providerName={formData.provider}
                                        setProviderName={(text) => setFormData({ ...formData, provider: text })}
                                        address={formData.address}
                                        setAddress={(text) => setFormData({ ...formData, address: text })}
                                        city={formData.city}
                                        setCity={(text) => setFormData({ ...formData, city: text })}
                                        state={formData.state}
                                        setState={(text) => setFormData({ ...formData, state: text })}
                                        zip={formData.zip}
                                        setZip={(text) => setFormData({ ...formData, zip: text })}
                                        country={formData.country}
                                        setCountry={(text) => setFormData({ ...formData, country: text })}
                                    />
                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Cost</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="0.00"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.cost}
                                                onChangeText={(text) => setFormData({ ...formData, cost: text })}
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

                            <RichTextInput
                                label="Instructions / Notes"
                                placeholder="e.g. Give with food..."
                                value={formData.notes}
                                onChangeText={(text) => setFormData({ ...formData, notes: text })}
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
    repeatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2C2C2E',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#374151',
    },
    repeatButtonText: {
        color: '#0A84FF',
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
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
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
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
    },
    switchLabel: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
});
