import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Switch, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import PetSelector from './shared/PetSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';

interface VaccinationFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const COMMON_VACCINES = ['Rabies', 'DHPP', 'Bordetella', 'Leptospirosis', 'Lyme', 'FVRCP', 'FeLV', 'Canine Influenza'];
const ADMINISTRATION_ROUTES = ['Subcutaneous', 'Intramuscular', 'Intranasal', 'Oral'];
const VACCINATION_TYPES = ['Core', 'Non-Core', 'Optional'];
const REACTION_SEVERITIES = ['None', 'Mild', 'Moderate', 'Severe', 'Anaphylaxis'];
const COMMON_REACTIONS = ['Swelling at injection site', 'Lethargy', 'Fever', 'Vomiting', 'Diarrhea', 'Itching', 'Difficulty Breathing', 'Loss of Appetite'];

export default function VaccinationFormModal({ visible, onClose, petId: initialPetId, onSuccess }: VaccinationFormModalProps) {
    const { pets } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        vaccine_name: '',
        date_given: new Date().toISOString().split('T')[0],
        administered_time: '',
        next_due_date: '',
        manufacturer: '',
        batch_number: '',
        lot_number: '',
        route_of_administration: 'Subcutaneous',
        administered_by: '',
        vaccination_type: 'Core',
        schedule_interval: '1 Year',
        clinic_name: '',
        clinic_address: '',
        clinic_phone: '',
        cost: 0,
        currency: 'EUR',
        payment_method: '',
        insurance_provider: '',
        reaction_severity: 'None',
        reactions: [] as string[],
        reaction_notes: '',
        reminder_enabled: true,
        reminder_days_before: 7,
        reminder_methods: ['app'] as string[],
        notes: '',
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
            vaccine_name: '',
            date_given: new Date().toISOString().split('T')[0],
            administered_time: '',
            next_due_date: '',
            manufacturer: '',
            batch_number: '',
            lot_number: '',
            route_of_administration: 'Subcutaneous',
            administered_by: '',
            vaccination_type: 'Core',
            schedule_interval: '1 Year',
            clinic_name: '',
            clinic_address: '',
            clinic_phone: '',
            cost: 0,
            currency: 'EUR',
            payment_method: '',
            insurance_provider: '',
            reaction_severity: 'None',
            reactions: [],
            reaction_notes: '',
            reminder_enabled: true,
            reminder_days_before: 7,
            reminder_methods: ['app'],
            notes: '',
        });
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    };

    const toggleReaction = (reaction: string) => {
        if (formData.reactions.includes(reaction)) {
            setFormData({ ...formData, reactions: formData.reactions.filter(r => r !== reaction) });
        } else {
            setFormData({ ...formData, reactions: [...formData.reactions, reaction] });
        }
    };

    const toggleReminderMethod = (method: string) => {
        if (formData.reminder_methods.includes(method)) {
            setFormData({ ...formData, reminder_methods: formData.reminder_methods.filter(m => m !== method) });
        } else {
            setFormData({ ...formData, reminder_methods: [...formData.reminder_methods, method] });
        }
    };

    const handleRepeatLast = async () => {
        if (!selectedPetId) return;
        setLoading(true);
        try {
            const { data } = await supabase
                .from('vaccinations')
                .select('*')
                .eq('pet_id', selectedPetId)
                .order('date_given', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    vaccine_name: data.name || prev.vaccine_name,
                    manufacturer: data.manufacturer || prev.manufacturer,
                    route_of_administration: data.route_of_administration || prev.route_of_administration,
                    vaccination_type: data.vaccination_type || prev.vaccination_type,
                    clinic_name: data.clinic_name || prev.clinic_name,
                    clinic_address: data.clinic_address || prev.clinic_address,
                    currency: data.currency || prev.currency,
                }));
                Alert.alert('Auto-Filled', 'Details from the last vaccination have been applied.');
            } else {
                Alert.alert('Info', 'No previous vaccinations found.');
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
        if (!formData.vaccine_name) {
            Alert.alert('Error', 'Please enter vaccine name');
            return;
        }

        setLoading(true);
        try {
            const vaccinationData = {
                pet_id: selectedPetId,
                name: formData.vaccine_name,
                date_given: formData.date_given,
                administered_time: formData.administered_time || null,
                next_due_date: formData.reminder_enabled ? (formData.next_due_date || null) : null,
                manufacturer: formData.manufacturer || null,
                batch_number: formData.batch_number || null,
                lot_number: formData.lot_number || null,
                route_of_administration: formData.route_of_administration,
                administered_by: formData.administered_by || null,
                vaccination_type: formData.vaccination_type,
                schedule_interval: formData.schedule_interval || null,
                clinic_name: formData.clinic_name || null,
                clinic_address: formData.clinic_address || null,
                clinic_phone: formData.clinic_phone || null,
                cost: formData.cost || null,
                currency: formData.currency,
                payment_method: formData.payment_method || null,
                insurance_provider: formData.insurance_provider || null,
                reaction_severity: formData.reaction_severity,
                reactions: formData.reactions.length > 0 ? formData.reactions : null,
                reaction_notes: formData.reaction_notes || null,
                reminder_enabled: formData.reminder_enabled,
                reminder_days_before: formData.reminder_days_before,
                reminder_methods: formData.reminder_methods,
                notes: formData.notes || null,
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
                        <Text style={styles.headerTitle}>Add Vaccination</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.formContent}>

                            <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />

                            <TouchableOpacity onPress={handleRepeatLast} style={styles.repeatButton}>
                                <Ionicons name="reload" size={16} color="#0A84FF" />
                                <Text style={styles.repeatButtonText}>Repeat Last Vaccination</Text>
                            </TouchableOpacity>

                            {/* Vaccine Details */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="medkit" size={20} color="#0A84FF" />
                                    <Text style={styles.sectionTitle}>Vaccine Details</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Vaccine Name *</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g. Rabies, DHPP"
                                            placeholderTextColor="#4B5563"
                                            value={formData.vaccine_name}
                                            onChangeText={(text) => setFormData({ ...formData, vaccine_name: text })}
                                        />
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                                            <View style={styles.chipRow}>
                                                {COMMON_VACCINES.map(v => (
                                                    <TouchableOpacity
                                                        key={v}
                                                        onPress={() => setFormData({ ...formData, vaccine_name: v })}
                                                        style={[styles.chip, formData.vaccine_name === v && styles.chipSelected]}
                                                    >
                                                        <Text style={[styles.chipText, formData.vaccine_name === v && styles.chipTextSelected]}>{v}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Vaccination Type</Text>
                                        <View style={styles.buttonRow}>
                                            {VACCINATION_TYPES.map(type => (
                                                <TouchableOpacity
                                                    key={type}
                                                    onPress={() => setFormData({ ...formData, vaccination_type: type })}
                                                    style={[styles.typeButton, formData.vaccination_type === type && styles.typeButtonSelected]}
                                                >
                                                    <Text style={[styles.typeButtonText, formData.vaccination_type === type && styles.typeButtonTextSelected]}>
                                                        {type}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <UniversalDatePicker
                                                label="Date Given"
                                                value={formData.date_given}
                                                onChange={(text) => setFormData({ ...formData, date_given: text })}
                                                mode="date"
                                            />
                                        </View>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Time</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="HH:MM"
                                                placeholderTextColor="#4B5563"
                                                value={formData.administered_time}
                                                onChangeText={(text) => setFormData({ ...formData, administered_time: text })}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Manufacturer</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Pfizer, Merck, etc."
                                                placeholderTextColor="#4B5563"
                                                value={formData.manufacturer}
                                                onChangeText={(text) => setFormData({ ...formData, manufacturer: text })}
                                            />
                                        </View>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Batch/Lot #</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Optional"
                                                placeholderTextColor="#4B5563"
                                                value={formData.batch_number}
                                                onChangeText={(text) => setFormData({ ...formData, batch_number: text })}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Route of Administration</Text>
                                        <View style={styles.chipRow}>
                                            {ADMINISTRATION_ROUTES.map(route => (
                                                <TouchableOpacity
                                                    key={route}
                                                    onPress={() => setFormData({ ...formData, route_of_administration: route })}
                                                    style={[styles.chip, formData.route_of_administration === route && styles.chipSelected]}
                                                >
                                                    <Text style={[styles.chipText, formData.route_of_administration === route && styles.chipTextSelected]}>
                                                        {route}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Administered By</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Dr. Smith, Veterinary Technician, etc."
                                            placeholderTextColor="#4B5563"
                                            value={formData.administered_by}
                                            onChangeText={(text) => setFormData({ ...formData, administered_by: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Reactions */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="warning" size={20} color="#EF4444" />
                                    <Text style={styles.sectionTitle}>Reactions (if any)</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.buttonRow}>
                                        {REACTION_SEVERITIES.map(severity => (
                                            <TouchableOpacity
                                                key={severity}
                                                onPress={() => setFormData({ ...formData, reaction_severity: severity })}
                                                style={[
                                                    styles.severityButton,
                                                    formData.reaction_severity === severity && (severity === 'None' ? styles.severityNone : styles.severityDanger)
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.severityText,
                                                    formData.reaction_severity === severity && (severity === 'None' ? styles.severityTextNone : styles.severityTextDanger)
                                                ]}>
                                                    {severity}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {formData.reaction_severity !== 'None' && (
                                        <>
                                            <View style={styles.fieldGroup}>
                                                <Text style={styles.label}>Symptoms Observed</Text>
                                                <View style={styles.chipWrap}>
                                                    {COMMON_REACTIONS.map(reaction => (
                                                        <TouchableOpacity
                                                            key={reaction}
                                                            onPress={() => toggleReaction(reaction)}
                                                            style={[styles.chip, formData.reactions.includes(reaction) && styles.chipDanger]}
                                                        >
                                                            <Text style={[styles.chipText, formData.reactions.includes(reaction) && styles.chipTextDanger]}>
                                                                {reaction}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>

                                            <RichTextInput
                                                label="Reaction Details"
                                                placeholder="Describe the reaction..."
                                                value={formData.reaction_notes}
                                                onChangeText={(text) => setFormData({ ...formData, reaction_notes: text })}
                                                minHeight={60}
                                            />
                                        </>
                                    )}
                                </View>
                            </View>

                            {/* Reminders */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="notifications" size={20} color="#F59E0B" />
                                    <Text style={styles.sectionTitle}>Reminders</Text>
                                </View>
                                <View style={styles.card}>
                                    <View style={styles.switchRow}>
                                        <Text style={styles.switchLabel}>Enable Reminder</Text>
                                        <Switch
                                            value={formData.reminder_enabled}
                                            onValueChange={(val) => setFormData({ ...formData, reminder_enabled: val })}
                                            trackColor={{ false: '#3F3F46', true: '#0A84FF' }}
                                        />
                                    </View>

                                    {formData.reminder_enabled && (
                                        <>
                                            <UniversalDatePicker
                                                label="Next Due Date"
                                                value={formData.next_due_date}
                                                onChange={(text) => setFormData({ ...formData, next_due_date: text })}
                                                mode="date"
                                                minDate={new Date()}
                                            />

                                            <View style={styles.fieldGroup}>
                                                <Text style={styles.label}>Remind me before</Text>
                                                <View style={styles.buttonRow}>
                                                    {[7, 14, 30].map(days => (
                                                        <TouchableOpacity
                                                            key={days}
                                                            onPress={() => setFormData({ ...formData, reminder_days_before: days })}
                                                            style={[styles.daysButton, formData.reminder_days_before === days && styles.daysButtonSelected]}
                                                        >
                                                            <Text style={[styles.daysButtonText, formData.reminder_days_before === days && styles.daysButtonTextSelected]}>
                                                                {days} days
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>

                                            <View style={styles.fieldGroup}>
                                                <Text style={styles.label}>Notification Methods</Text>
                                                <View style={styles.buttonRow}>
                                                    {['App', 'Email', 'SMS'].map(method => (
                                                        <TouchableOpacity
                                                            key={method}
                                                            onPress={() => toggleReminderMethod(method.toLowerCase())}
                                                            style={[styles.methodButton, formData.reminder_methods.includes(method.toLowerCase()) && styles.methodButtonSelected]}
                                                        >
                                                            <Text style={[styles.methodButtonText, formData.reminder_methods.includes(method.toLowerCase()) && styles.methodButtonTextSelected]}>
                                                                {method}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                        </>
                                    )}
                                </View>
                            </View>

                            {/* Provider & Cost */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="location" size={20} color="#EC4899" />
                                    <Text style={styles.sectionTitle}>Provider & Cost</Text>
                                </View>
                                <View style={styles.card}>
                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Clinic Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Veterinary clinic"
                                            placeholderTextColor="#4B5563"
                                            value={formData.clinic_name}
                                            onChangeText={(text) => setFormData({ ...formData, clinic_name: text })}
                                        />
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Cost</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="0.00"
                                                keyboardType="numeric"
                                                placeholderTextColor="#4B5563"
                                                value={formData.cost.toString()}
                                                onChangeText={(text) => setFormData({ ...formData, cost: parseFloat(text) || 0 })}
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
                                placeholder="Any other details..."
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
    chipScroll: {
        marginTop: 8,
    },
    chipRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    chipWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
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
    chipDanger: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#EF4444',
    },
    chipTextDanger: {
        color: '#EF4444',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#374151',
    },
    typeButtonSelected: {
        backgroundColor: '#0A84FF',
        borderColor: '#0A84FF',
    },
    typeButtonText: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '500',
    },
    typeButtonTextSelected: {
        color: '#FFFFFF',
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
    daysButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#1C1C1E',
    },
    daysButtonSelected: {
        backgroundColor: '#0A84FF',
    },
    daysButtonText: {
        color: '#9CA3AF',
    },
    daysButtonTextSelected: {
        color: '#FFFFFF',
    },
    methodButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#1C1C1E',
    },
    methodButtonSelected: {
        backgroundColor: '#0A84FF',
    },
    methodButtonText: {
        color: '#9CA3AF',
    },
    methodButtonTextSelected: {
        color: '#FFFFFF',
    },
});
