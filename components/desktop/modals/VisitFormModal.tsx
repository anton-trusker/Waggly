import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import PetSelector from './shared/PetSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';
import PlacesAutocomplete, { Place } from '@/components/ui/PlacesAutocomplete';

interface VisitFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const PROVIDER_TYPES = [
    { type: 'veterinary', label: 'Veterinary', icon: 'medical', color: '#EF4444' },
    { type: 'groomer', label: 'Grooming', icon: 'cut', color: '#06B6D4' },
    { type: 'trainer', label: 'Training', icon: 'school', color: '#8B5CF6' },
    { type: 'boarder', label: 'Boarding', icon: 'bed', color: '#F59E0B' },
    { type: 'daycare', label: 'Daycare', icon: 'home', color: '#10B981' },
    { type: 'walker', label: 'Walker', icon: 'walk', color: '#3B82F6' },
    { type: 'sitter', label: 'Sitter', icon: 'person', color: '#EC4899' },
    { type: 'behaviorist', label: 'Behaviorist', icon: 'fitness', color: '#6366F1' },
    { type: 'nutritionist', label: 'Nutritionist', icon: 'restaurant', color: '#14B8A6' },
] as const;

const SERVICE_CATEGORIES: Record<string, string[]> = {
    veterinary: ['Routine Check-up', 'Emergency', 'Vaccination', 'Specialist', 'Dental', 'Surgery', 'Lab Work', 'Follow-up'],
    groomer: ['Full Grooming', 'Bath Only', 'Nail Trim', 'Haircut', 'De-shedding', 'Teeth Brushing'],
    trainer: ['Obedience', 'Behavioral', 'Puppy Class', 'Agility', 'Private Session', 'Group Class'],
    boarder: ['Overnight Boarding', 'Extended Stay', 'Daycare Boarding'],
    daycare: ['Full Day', 'Half Day', 'Trial Day'],
    walker: ['30min Walk', '1hr Walk', 'Group Walk', 'Private Walk'],
    sitter: ['In-Home', 'Drop-In Visit', 'Overnight'],
    behaviorist: ['Assessment', 'Training Session', 'Follow-up'],
    nutritionist: ['Consultation', 'Diet Plan', 'Follow-up'],
};

const URGENCY_LEVELS = [
    { label: 'Routine', value: 'routine', color: '#10B981' },
    { label: 'Urgent', value: 'urgent', color: '#FBBF24' },
    { label: 'Emergency', value: 'emergency', color: '#EF4444' },
];

const COMMON_SYMPTOMS = ['Vomiting', 'Diarrhea', 'Limping', 'Ear Infection', 'Eye Discharge', 'Fever', 'Loss of Appetite', 'Coughing'];

export default function VisitFormModal({ visible, onClose, petId: initialPetId, onSuccess }: VisitFormModalProps) {
    const { pets } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        provider_type: 'veterinary' as 'veterinary' | 'groomer' | 'trainer' | 'boarder' | 'daycare' | 'walker' | 'sitter' | 'behaviorist' | 'nutritionist',
        service_category: 'Routine Check-up',
        urgency: 'routine',
        date: new Date().toISOString().split('T')[0],
        visit_time: '',
        duration_minutes: '',
        business_name: '',
        provider_name: '',
        business_place_id: '',
        business_address: '',
        business_phone: '',
        business_website: '',
        reason: '',
        symptoms: [] as string[],
        diagnosis: '',
        notes: '',
        cost: 0,
        currency: 'EUR',
        payment_method: '',
        follow_up_date: '',
        reminder_enabled: false,
    });

    useEffect(() => {
        if (initialPetId) {
            setSelectedPetId(initialPetId);
        } else if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(pets[0].id);
        }
    }, [initialPetId, pets, selectedPetId]);

    useEffect(() => {
        const categories = SERVICE_CATEGORIES[formData.provider_type];
        if (categories && categories.length > 0) {
            setFormData(prev => ({ ...prev, service_category: categories[0] }));
        }
    }, [formData.provider_type]);

    const resetForm = () => {
        setFormData({
            provider_type: 'veterinary',
            service_category: 'Routine Check-up',
            urgency: 'routine',
            date: new Date().toISOString().split('T')[0],
            visit_time: '',
            duration_minutes: '',
            business_name: '',
            provider_name: '',
            business_place_id: '',
            business_address: '',
            business_phone: '',
            business_website: '',
            reason: '',
            symptoms: [],
            diagnosis: '',
            notes: '',
            cost: 0,
            currency: 'EUR',
            payment_method: '',
            follow_up_date: '',
            reminder_enabled: false,
        });
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    };

    const toggleSymptom = (symptom: string) => {
        if (formData.symptoms.includes(symptom)) {
            setFormData({ ...formData, symptoms: formData.symptoms.filter(s => s !== symptom) });
        } else {
            setFormData({ ...formData, symptoms: [...formData.symptoms, symptom] });
        }
    };

    const handlePlaceSelect = (place: Place) => {
        setFormData(prev => ({
            ...prev,
            business_address: place.formatted_address,
            business_place_id: place.place_id,
        }));
    };

    const handleRepeatLast = async () => {
        if (!selectedPetId) return;
        setLoading(true);
        try {
            const { data } = await supabase
                .from('medical_visits')
                .select('*')
                .eq('pet_id', selectedPetId)
                .order('date', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    provider_type: data.provider_type || 'veterinary',
                    service_category: data.service_category || prev.service_category,
                    business_name: data.business_name || '',
                    provider_name: data.provider_name || '',
                    business_address: data.business_address || '',
                    business_phone: data.business_phone || '',
                    currency: data.currency || prev.currency,
                }));
                Alert.alert('Auto-Filled', 'Details from the last visit have been applied.');
            } else {
                Alert.alert('Info', 'No previous visits found for this pet.');
            }
        } catch (err) {
            console.log('Error fetching last visit:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!formData.date) {
            Alert.alert('Error', 'Please enter visit date');
            return;
        }
        if (!formData.business_name) {
            Alert.alert('Error', 'Please enter provider/business name');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('medical_visits')
                .insert({
                    pet_id: selectedPetId,
                    provider_type: formData.provider_type,
                    service_category: formData.service_category,
                    urgency: formData.urgency,
                    date: formData.date,
                    visit_time: formData.visit_time || null,
                    duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
                    business_name: formData.business_name,
                    provider_name: formData.provider_name || null,
                    business_place_id: formData.business_place_id || null,
                    business_address: formData.business_address || null,
                    business_phone: formData.business_phone || null,
                    business_website: formData.business_website || null,
                    reason: formData.reason || formData.service_category,
                    symptoms: formData.provider_type === 'veterinary' ? formData.symptoms : null,
                    diagnosis: formData.provider_type === 'veterinary' ? formData.diagnosis : null,
                    notes: formData.notes || null,
                    cost: formData.cost || null,
                    currency: formData.currency,
                    payment_method: formData.payment_method || null,
                    follow_up_date: formData.follow_up_date || null,
                    reminder_enabled: formData.reminder_enabled,
                } as any);

            if (error) throw error;

            Alert.alert('Success', `${PROVIDER_TYPES.find(p => p.type === formData.provider_type)?.label} visit added successfully`);
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

    const selectedProvider = PROVIDER_TYPES.find(p => p.type === formData.provider_type);
    const availableCategories = SERVICE_CATEGORIES[formData.provider_type] || [];

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Add New Visit</Text>
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
                                <Text style={styles.repeatButtonText}>Repeat Last Visit Details</Text>
                            </TouchableOpacity>

                            {/* Provider Type Selector */}
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>PROVIDER TYPE</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={styles.providerRow}>
                                        {PROVIDER_TYPES.map(provider => (
                                            <TouchableOpacity
                                                key={provider.type}
                                                onPress={() => setFormData({ ...formData, provider_type: provider.type as any })}
                                                style={styles.providerItem}
                                            >
                                                <View
                                                    style={[
                                                        styles.providerIcon,
                                                        {
                                                            backgroundColor: formData.provider_type === provider.type ? provider.color : '#2C2C2E',
                                                            borderColor: formData.provider_type === provider.type ? provider.color : '#374151'
                                                        }
                                                    ]}
                                                >
                                                    <Ionicons
                                                        name={provider.icon as any}
                                                        size={28}
                                                        color={formData.provider_type === provider.type ? '#FFFFFF' : '#9CA3AF'}
                                                    />
                                                </View>
                                                <Text
                                                    style={[
                                                        styles.providerLabel,
                                                        { color: formData.provider_type === provider.type ? provider.color : '#9CA3AF' }
                                                    ]}
                                                >
                                                    {provider.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                            {/* Visit Details */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="calendar" size={20} color={selectedProvider?.color} />
                                    <Text style={styles.sectionTitle}>Add Visit Record</Text>
                                </View>

                                <View style={styles.card}>
                                    {/* Urgency */}
                                    <View style={styles.buttonRow}>
                                        {URGENCY_LEVELS.map((level) => (
                                            <TouchableOpacity
                                                key={level.value}
                                                onPress={() => setFormData({ ...formData, urgency: level.value })}
                                                style={[
                                                    styles.urgencyButton,
                                                    {
                                                        backgroundColor: formData.urgency === level.value ? `${level.color}20` : 'transparent',
                                                        borderColor: formData.urgency === level.value ? level.color : '#374151'
                                                    }
                                                ]}
                                            >
                                                <Text style={[styles.urgencyText, { color: formData.urgency === level.value ? level.color : '#9CA3AF' }]}>
                                                    {level.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {/* Service Category */}
                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Service Type</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.chipRow}>
                                                {availableCategories.map(category => (
                                                    <TouchableOpacity
                                                        key={category}
                                                        onPress={() => setFormData({ ...formData, service_category: category })}
                                                        style={[
                                                            styles.categoryChip,
                                                            formData.service_category === category && styles.categoryChipSelected
                                                        ]}
                                                    >
                                                        <Text style={[styles.categoryChipText, formData.service_category === category && styles.categoryChipTextSelected]}>
                                                            {category}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </View>

                                    <UniversalDatePicker
                                        label="Date"
                                        value={formData.date}
                                        onChange={(text) => setFormData({ ...formData, date: text })}
                                    />

                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Time (Optional)</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="HH:MM"
                                                placeholderTextColor="#4B5563"
                                                value={formData.visit_time}
                                                onChangeText={(text) => setFormData({ ...formData, visit_time: text })}
                                            />
                                        </View>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Duration (min)</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="30"
                                                placeholderTextColor="#4B5563"
                                                keyboardType="numeric"
                                                value={formData.duration_minutes}
                                                onChangeText={(text) => setFormData({ ...formData, duration_minutes: text })}
                                            />
                                        </View>
                                    </View>

                                    <RichTextInput
                                        label="Reason for Visit"
                                        placeholder="e.g. Annual check-up, bath and nail trim..."
                                        value={formData.reason}
                                        onChangeText={(text) => setFormData({ ...formData, reason: text })}
                                        minHeight={60}
                                    />
                                </View>
                            </View>

                            {/* Medical Fields (Veterinary Only) */}
                            {formData.provider_type === 'veterinary' && (
                                <View style={styles.section}>
                                    <View style={styles.sectionHeader}>
                                        <Ionicons name="pulse" size={20} color="#EF4444" />
                                        <Text style={styles.sectionTitle}>Medical Details</Text>
                                    </View>

                                    <View style={styles.card}>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.chipRow}>
                                                {COMMON_SYMPTOMS.map(symptom => (
                                                    <TouchableOpacity
                                                        key={symptom}
                                                        onPress={() => toggleSymptom(symptom)}
                                                        style={[styles.chip, formData.symptoms.includes(symptom) && styles.chipDanger]}
                                                    >
                                                        <Text style={[styles.chipText, formData.symptoms.includes(symptom) && styles.chipTextDanger]}>
                                                            {symptom}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>

                                        <RichTextInput
                                            label="Diagnosis / Assessment"
                                            placeholder="What did the vet say?"
                                            value={formData.diagnosis}
                                            onChangeText={(text) => setFormData({ ...formData, diagnosis: text })}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Provider & Location */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="location" size={20} color="#EC4899" />
                                    <Text style={styles.sectionTitle}>Provider & Location</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Business Name *</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder={`Enter ${selectedProvider?.label.toLowerCase()} name...`}
                                            placeholderTextColor="#4B5563"
                                            value={formData.business_name}
                                            onChangeText={(text) => setFormData({ ...formData, business_name: text })}
                                        />
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Provider Name (Optional)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Dr. Smith, Jane Doe, etc."
                                            placeholderTextColor="#4B5563"
                                            value={formData.provider_name}
                                            onChangeText={(text) => setFormData({ ...formData, provider_name: text })}
                                        />
                                    </View>

                                    <PlacesAutocomplete
                                        value={formData.business_address}
                                        onSelect={handlePlaceSelect}
                                        placeholder="Search for clinic, groomer, or business..."
                                        types={['veterinary_care', 'establishment']}
                                        label="Business Address (Optional)"
                                    />

                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Phone</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="(555) 123-4567"
                                                placeholderTextColor="#4B5563"
                                                value={formData.business_phone}
                                                onChangeText={(text) => setFormData({ ...formData, business_phone: text })}
                                                keyboardType="phone-pad"
                                            />
                                        </View>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Website</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="www.example.com"
                                                placeholderTextColor="#4B5563"
                                                value={formData.business_website}
                                                onChangeText={(text) => setFormData({ ...formData, business_website: text })}
                                                keyboardType="url"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Cost */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="cash" size={20} color="#10B981" />
                                    <Text style={styles.sectionTitle}>Cost</Text>
                                </View>
                                <View style={styles.card}>
                                    <View style={styles.row}>
                                        <View style={styles.halfWidth}>
                                            <Text style={styles.label}>Total Cost</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="0.00"
                                                placeholderTextColor="#4B5563"
                                                keyboardType="numeric"
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

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Payment Method (Optional)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Cash, Card, Insurance..."
                                            placeholderTextColor="#4B5563"
                                            value={formData.payment_method}
                                            onChangeText={(text) => setFormData({ ...formData, payment_method: text })}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Notes */}
                            <RichTextInput
                                label="Additional Notes"
                                placeholder="Any other details about this visit..."
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
    sectionLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 12,
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
    providerRow: {
        flexDirection: 'row',
        gap: 12,
    },
    providerItem: {
        alignItems: 'center',
        minWidth: 80,
    },
    providerIcon: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        borderWidth: 2,
    },
    providerLabel: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
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
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },
    urgencyButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
    },
    urgencyText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
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
    chipText: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    chipDanger: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#EF4444',
    },
    chipTextDanger: {
        color: '#EF4444',
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#4B5563',
        marginRight: 8,
    },
    categoryChipSelected: {
        backgroundColor: '#0A84FF',
        borderColor: '#0A84FF',
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    categoryChipTextSelected: {
        color: '#FFFFFF',
    },
});
