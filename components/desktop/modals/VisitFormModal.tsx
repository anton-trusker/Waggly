import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Place } from '@/components/ui/PlacesAutocomplete';
import PetSelector from './shared/PetSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';
import PlacesAutocomplete from '@/components/ui/PlacesAutocomplete';
import FormModal, { FormState } from '@/components/ui/FormModal';

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

interface VisitFormData {
    provider_type: 'veterinary' | 'groomer' | 'trainer' | 'boarder' | 'daycare' | 'walker' | 'sitter' | 'behaviorist' | 'nutritionist';
    service_category: string;
    urgency: string;
    date: string;
    visit_time: string;
    duration_minutes: string;
    business_name: string;
    provider_name: string;
    business_place_id: string;
    business_address: string;
    business_phone: string;
    business_website: string;
    reason: string;
    symptoms: string[];
    diagnosis: string;
    notes: string;
    cost: string;
    currency: string;
    payment_method: string;
    follow_up_date: string;
    reminder_enabled: boolean;
}

export default function VisitFormModal({ visible, onClose, petId: initialPetId, onSuccess }: VisitFormModalProps) {
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

    const initialData: VisitFormData = {
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
        cost: '',
        currency: 'EUR',
        payment_method: '',
        follow_up_date: '',
        reminder_enabled: false,
    };

    const handleRepeatLast = async (formState: FormState<VisitFormData>) => {
        if (!selectedPetId) return;

        try {
            const { data } = await supabase
                .from('medical_visits')
                .select('*')
                .eq('pet_id', selectedPetId)
                .order('date', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                formState.updateField('provider_type', (data.provider_type as any) || 'veterinary');
                formState.updateField('service_category', data.service_category || 'Routine Check-up');
                formState.updateField('business_name', data.business_name || '');
                formState.updateField('provider_name', data.provider_name || '');
                // Address not currently stored in DB column
                // formState.updateField('business_address', data.business_address || ''); 
                formState.updateField('business_phone', data.business_phone || '');
                formState.updateField('currency', data.currency || 'EUR');

                Alert.alert('Auto-Filled', 'Details from the last visit have been applied.');
            } else {
                Alert.alert('Info', 'No previous visits found for this pet.');
            }
        } catch (err) {
            console.log('Error fetching last visit:', err);
        }
    };

    const handleSubmit = async (data: VisitFormData) => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!data.business_name) {
            Alert.alert('Error', 'Please enter provider/business name');
            return;
        }

        // Append address to notes since there is no column for it
        let finalNotes = data.notes || '';
        if (data.business_address) {
            finalNotes = `Address: ${data.business_address}\n\n${finalNotes}`;
        }

        const visitData = {
            pet_id: selectedPetId,
            provider_type: data.provider_type,
            service_category: data.service_category,
            urgency: data.urgency,
            date: data.date,
            visit_time: data.visit_time || null,
            duration_minutes: data.duration_minutes ? parseInt(data.duration_minutes) : null,
            business_name: data.business_name,
            provider_name: data.provider_name || null,
            business_place_id: data.business_place_id || null,
            // business_address: data.business_address || null, // Column missing
            business_phone: data.business_phone || null,
            business_website: data.business_website || null,
            reason: data.reason || data.service_category,
            symptoms: data.provider_type === 'veterinary' ? data.symptoms : null,
            diagnosis: data.provider_type === 'veterinary' ? data.diagnosis : null,
            notes: finalNotes || null,
            cost: data.cost ? parseFloat(data.cost) : null,
            currency: data.currency,
            payment_method: data.payment_method || null,
            follow_up_date: data.follow_up_date || null,
            reminder_enabled: data.reminder_enabled,
        };

        const { error } = await supabase
            .from('medical_visits')
            .insert(visitData as any);

        if (error) throw error;
        onSuccess?.();
    };

    const validate = (data: VisitFormData) => {
        const errors: Record<string, string> = {};
        if (!data.business_name.trim()) errors.business_name = 'Business name is required';
        return errors;
    };

    const toggleSymptom = (symptom: string, formState: FormState<VisitFormData>) => {
        const currentSymptoms = formState.data.symptoms || [];
        if (currentSymptoms.includes(symptom)) {
            formState.updateField('symptoms', currentSymptoms.filter(s => s !== symptom));
        } else {
            formState.updateField('symptoms', [...currentSymptoms, symptom]);
        }
    };

    const handlePlaceSelect = (place: Place, formState: FormState<VisitFormData>) => {
        formState.updateField('business_address', place.formatted_address);
        formState.updateField('business_place_id', place.place_id);
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title="Add New Visit"
            initialData={initialData}
            onSubmit={handleSubmit}
            validate={validate}
            submitLabel="Save Visit"
        >
            {(formState: FormState<VisitFormData>) => {
                const selectedProvider = PROVIDER_TYPES.find(p => p.type === formState.data.provider_type);
                const availableCategories = SERVICE_CATEGORIES[formState.data.provider_type] || [];

                return (
                    <View style={styles.formContent}>
                        <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />

                        <TouchableOpacity
                            onPress={() => handleRepeatLast(formState)}
                            style={[styles.repeatButton, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}
                        >
                            <Ionicons name="reload" size={16} color={theme.colors.primary[500]} />
                            <Text style={[styles.repeatButtonText, { color: theme.colors.primary[500] }]}>Repeat Last Visit Details</Text>
                        </TouchableOpacity>

                        {/* Provider Type Selector */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionLabel, { color: theme.colors.text.secondary }]}>PROVIDER TYPE</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.providerRow}>
                                    {PROVIDER_TYPES.map(provider => (
                                        <TouchableOpacity
                                            key={provider.type}
                                            onPress={() => formState.updateField('provider_type', provider.type as any)}
                                            style={styles.providerItem}
                                        >
                                            <View
                                                style={[
                                                    styles.providerIcon,
                                                    {
                                                        backgroundColor: formState.data.provider_type === provider.type ? provider.color : '#2C2C2E',
                                                        borderColor: formState.data.provider_type === provider.type ? provider.color : '#374151'
                                                    }
                                                ]}
                                            >
                                                <Ionicons
                                                    name={provider.icon as any}
                                                    size={28}
                                                    color={formState.data.provider_type === provider.type ? '#FFFFFF' : '#9CA3AF'}
                                                />
                                            </View>
                                            <Text
                                                style={[
                                                    styles.providerLabel,
                                                    { color: formState.data.provider_type === provider.type ? provider.color : '#9CA3AF' }
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
                                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Add Visit Record</Text>
                            </View>

                            <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                                {/* Urgency */}
                                <View style={styles.buttonRow}>
                                    {URGENCY_LEVELS.map((level) => (
                                        <TouchableOpacity
                                            key={level.value}
                                            onPress={() => formState.updateField('urgency', level.value)}
                                            style={[
                                                styles.urgencyButton,
                                                {
                                                    backgroundColor: formState.data.urgency === level.value ? `${level.color}20` : 'transparent',
                                                    borderColor: formState.data.urgency === level.value ? level.color : theme.colors.border.primary
                                                }
                                            ]}
                                        >
                                            <Text style={[styles.urgencyText, { color: formState.data.urgency === level.value ? level.color : theme.colors.text.secondary }]}>
                                                {level.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Service Category */}
                                <View style={styles.fieldGroup}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Service Type</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View style={styles.chipRow}>
                                            {availableCategories.map(category => (
                                                <TouchableOpacity
                                                    key={category}
                                                    onPress={() => formState.updateField('service_category', category)}
                                                    style={[
                                                        styles.categoryChip,
                                                        { borderColor: theme.colors.border.primary },
                                                        formState.data.service_category === category && { backgroundColor: theme.colors.primary[500], borderColor: theme.colors.primary[500] }
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.categoryChipText,
                                                        { color: theme.colors.text.secondary },
                                                        formState.data.service_category === category && { color: '#FFFFFF' }
                                                    ]}>
                                                        {category}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>
                                </View>

                                <UniversalDatePicker
                                    label="Date"
                                    value={formState.data.date}
                                    onChange={(text) => formState.updateField('date', text)}
                                />

                                <View style={styles.row}>
                                    <View style={styles.halfWidth}>
                                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Time (Optional)</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                            placeholder="HH:MM"
                                            placeholderTextColor={theme.colors.text.tertiary}
                                            value={formState.data.visit_time}
                                            onChangeText={(text) => formState.updateField('visit_time', text)}
                                        />
                                    </View>
                                    <View style={styles.halfWidth}>
                                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Duration (min)</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                            placeholder="30"
                                            placeholderTextColor={theme.colors.text.tertiary}
                                            keyboardType="numeric"
                                            value={formState.data.duration_minutes}
                                            onChangeText={(text) => formState.updateField('duration_minutes', text)}
                                        />
                                    </View>
                                </View>

                                <RichTextInput
                                    label="Reason for Visit"
                                    placeholder="e.g. Annual check-up, bath and nail trim..."
                                    value={formState.data.reason}
                                    onChangeText={(text) => formState.updateField('reason', text)}
                                    minHeight={60}
                                />
                            </View>
                        </View>

                        {/* Medical Fields (Veterinary Only) */}
                        {formState.data.provider_type === 'veterinary' && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="pulse" size={20} color="#EF4444" />
                                    <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Medical Details</Text>
                                </View>

                                <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <View style={styles.chipRow}>
                                            {COMMON_SYMPTOMS.map(symptom => (
                                                <TouchableOpacity
                                                    key={symptom}
                                                    onPress={() => toggleSymptom(symptom, formState)}
                                                    style={[
                                                        styles.chip,
                                                        { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary },
                                                        formState.data.symptoms.includes(symptom) && styles.chipDanger
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.chipText,
                                                        { color: theme.colors.text.secondary },
                                                        formState.data.symptoms.includes(symptom) && styles.chipTextDanger
                                                    ]}>
                                                        {symptom}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>

                                    <RichTextInput
                                        label="Diagnosis / Assessment"
                                        placeholder="What did the vet say?"
                                        value={formState.data.diagnosis}
                                        onChangeText={(text) => formState.updateField('diagnosis', text)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Provider & Location */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="location" size={20} color="#EC4899" />
                                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Provider & Location</Text>
                            </View>

                            <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                                <View style={styles.fieldGroup}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Business Name *</Text>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            {
                                                backgroundColor: theme.colors.background.secondary,
                                                color: theme.colors.text.primary,
                                                borderColor: formState.errors.business_name ? theme.colors.status.error[500] : theme.colors.border.primary
                                            }
                                        ]}
                                        placeholder={`Enter ${selectedProvider?.label.toLowerCase()} name...`}
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        value={formState.data.business_name}
                                        onChangeText={(text) => formState.updateField('business_name', text)}
                                    />
                                    {formState.errors.business_name && (
                                        <Text style={{ color: theme.colors.status.error[500], fontSize: 12, marginTop: -8 }}>
                                            {formState.errors.business_name}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.fieldGroup}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Provider Name (Optional)</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="Dr. Smith, Jane Doe, etc."
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        value={formState.data.provider_name}
                                        onChangeText={(text) => formState.updateField('provider_name', text)}
                                    />
                                </View>

                                <PlacesAutocomplete
                                    value={formState.data.business_address}
                                    onSelect={(place) => handlePlaceSelect(place, formState)}
                                    placeholder="Search for clinic, groomer, or business..."
                                    types={['veterinary_care', 'establishment']}
                                    label="Business Address (Optional)"
                                />

                                <View style={styles.row}>
                                    <View style={styles.halfWidth}>
                                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Phone</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                            placeholder="(555) 123-4567"
                                            placeholderTextColor={theme.colors.text.tertiary}
                                            value={formState.data.business_phone}
                                            onChangeText={(text) => formState.updateField('business_phone', text)}
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                    <View style={styles.halfWidth}>
                                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Website</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                            placeholder="www.example.com"
                                            placeholderTextColor={theme.colors.text.tertiary}
                                            value={formState.data.business_website}
                                            onChangeText={(text) => formState.updateField('business_website', text)}
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
                                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Cost</Text>
                            </View>
                            <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
                                <View style={styles.row}>
                                    <View style={styles.halfWidth}>
                                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Total Cost</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                            placeholder="0.00"
                                            placeholderTextColor={theme.colors.text.tertiary}
                                            keyboardType="numeric"
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

                                <View style={styles.fieldGroup}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Payment Method (Optional)</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="Cash, Card, Insurance..."
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        value={formState.data.payment_method}
                                        onChangeText={(text) => formState.updateField('payment_method', text)}
                                    />
                                </View>
                            </View>
                        </View>

                        <RichTextInput
                            label="Additional Notes"
                            placeholder="Any other details about this visit..."
                            value={formState.data.notes}
                            onChangeText={(text) => formState.updateField('notes', text)}
                            minHeight={80}
                        />

                        <View style={{ height: 40 }} />
                    </View>
                );
            }}
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
    sectionLabel: {
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
        marginBottom: 8,
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
    },
    chipText: {
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
        marginRight: 8,
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
