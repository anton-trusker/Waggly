import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import { designSystem } from '@/constants/designSystem'; // Force Light Theme
import { Place } from '@/components/ui/PlacesAutocomplete';
import PetSelector from './shared/PetSelector';
import UniversalDatePicker from './shared/UniversalDatePicker';
import RichTextInput from './shared/RichTextInput';
import PlacesAutocomplete from '@/components/ui/PlacesAutocomplete';
import FormModal, { FormState } from '@/components/ui/FormModal';
import BottomSheetSelect from '@/components/ui/BottomSheetSelect';
import { useLocale } from '@/hooks/useLocale';

interface VisitFormModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const PROVIDER_TYPES = [
    { type: 'veterinary', labelKey: 'veterinary', icon: 'medical' as const },
    { type: 'groomer', labelKey: 'groomer', icon: 'cut' as const },
    { type: 'trainer', labelKey: 'trainer', icon: 'school' as const },
    { type: 'boarder', labelKey: 'boarder', icon: 'bed' as const },
    { type: 'daycare', labelKey: 'daycare', icon: 'home' as const },
    { type: 'walker', labelKey: 'walker', icon: 'walk' as const },
    { type: 'sitter', labelKey: 'sitter', icon: 'person' as const },
    { type: 'behaviorist', labelKey: 'behaviorist', icon: 'fitness' as const },
    { type: 'nutritionist', labelKey: 'nutritionist', icon: 'restaurant' as const },
];

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
    { labelKey: 'routine', value: 'routine', color: '#10B981' },
    { labelKey: 'urgent', value: 'urgent', color: '#FBBF24' },
    { labelKey: 'emergency', value: 'emergency', color: '#EF4444' },
];

const CURRENCIES = [
    { label: 'EUR', value: 'EUR' },
    { label: 'USD', value: 'USD' },
    { label: 'GBP', value: 'GBP' },
    { label: 'CAD', value: 'CAD' },
    { label: 'AUD', value: 'AUD' },
];

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
    const { t } = useLocale();
    // Force Light Theme
    const theme = designSystem;

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

    const handleSubmit = async (data: VisitFormData) => {
        if (!selectedPetId) {
            Alert.alert(t('common.error'), t('visit_form.error_select_pet'));
            return;
        }
        if (!data.business_name) {
            Alert.alert(t('common.error'), t('visit_form.error_business_name'));
            return;
        }

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

        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (userId) {
            await supabase.from('activity_logs').insert({
                actor_id: userId,
                owner_id: userId,
                pet_id: selectedPetId,
                action_type: 'visit_added',
                details: {
                    provider_type: data.provider_type,
                    service_category: data.service_category,
                    date: data.date,
                    business_name: data.business_name
                },
            });
        }

        onSuccess?.();
    };

    const validate = (data: VisitFormData) => {
        const errors: Record<string, string> = {};
        if (!data.business_name.trim()) errors.business_name = t('visit_form.error_business_name');
        return errors;
    };

    const handlePlaceSelect = (place: Place & { name?: string }, formState: FormState<VisitFormData>) => {
        // Set business name from place (use name if available, or formatted address)
        if (place.name) {
            formState.updateField('business_name', place.name);
        }
        // Set address
        formState.updateField('business_address', place.formatted_address);
        formState.updateField('business_place_id', place.place_id);
    };

    return (
        <FormModal
            visible={visible}
            onClose={onClose}
            title={t('visit_form.title')}
            initialData={initialData}
            onSubmit={handleSubmit}
            validate={validate}
            submitLabel={t('visit_form.submit')}
            forceLight // Force White Modal Background
        >
            {(formState: FormState<VisitFormData>) => {
                const selectedProvider = PROVIDER_TYPES.find(p => p.type === formState.data.provider_type);
                const availableCategories = SERVICE_CATEGORIES[formState.data.provider_type] || [];

                return (
                    <View style={styles.formContent}>
                        {pets.length > 1 && (
                            <PetSelector selectedPetId={selectedPetId} onSelectPet={setSelectedPetId} />
                        )}

                        {/* Provider Type Selector */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionLabel, { color: theme.colors.text.secondary }]}>{t('visit_form.provider_type_title')}</Text>
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
                                                        backgroundColor: formState.data.provider_type === provider.type ? theme.colors.primary[500] : theme.colors.background.tertiary,
                                                        borderColor: formState.data.provider_type === provider.type ? theme.colors.primary[500] : theme.colors.border.primary
                                                    }
                                                ]}
                                            >
                                                <Ionicons
                                                    name={provider.icon as any}
                                                    size={24}
                                                    color={formState.data.provider_type === provider.type ? '#FFFFFF' : theme.colors.text.tertiary}
                                                />
                                            </View>
                                            <Text
                                                style={[
                                                    styles.providerLabel,
                                                    { color: formState.data.provider_type === provider.type ? theme.colors.primary[500] : theme.colors.text.secondary }
                                                ]}
                                            >
                                                {t(`visit_form.provider_types.${provider.labelKey}`)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        <View style={[styles.card, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.secondary, borderWidth: 1 }]}>

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
                                            {t(`visit_form.urgency.${level.labelKey}`)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Service Category */}
                            <View style={styles.fieldGroup}>
                                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('visit_form.service_type_title')}</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View style={styles.chipRow}>
                                        {availableCategories.map(category => (
                                            <TouchableOpacity
                                                key={category}
                                                onPress={() => formState.updateField('service_category', category)}
                                                style={[
                                                    styles.categoryChip,
                                                    { borderColor: theme.colors.border.primary, backgroundColor: theme.colors.background.tertiary },
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
                                label={t('visit_form.date')}
                                value={formState.data.date}
                                onChange={(text) => formState.updateField('date', text)}
                            />

                            {/* Business Name - Places Search */}
                            <PlacesAutocomplete
                                value={formState.data.business_name}
                                onSelect={(place) => handlePlaceSelect(place, formState)}
                                placeholder={t('visit_form.business_name_placeholder', { type: selectedProvider ? t(`visit_form.provider_types.${selectedProvider.labelKey}`).toLowerCase() : '' })}
                                types={['establishment']}
                                label={t('visit_form.business_name')}
                                error={formState.errors.business_name}
                            />

                            {/* Business Address - Read-only, auto-filled */}
                            {formState.data.business_address && (
                                <View style={styles.fieldGroup}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('visit_form.address_label')}</Text>
                                    <View style={[
                                        styles.input,
                                        {
                                            backgroundColor: theme.colors.background.tertiary,
                                            borderColor: theme.colors.border.primary,
                                            opacity: 0.8
                                        }
                                    ]}>
                                        <Text style={{ color: theme.colors.text.primary, fontSize: 14 }}>{formState.data.business_address}</Text>
                                    </View>
                                </View>
                            )}

                            <View style={styles.row}>
                                <View style={styles.flex1}>
                                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{t('visit_form.total_cost')}</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.colors.background.tertiary, color: theme.colors.text.primary, borderColor: theme.colors.border.primary }]}
                                        placeholder="0.00"
                                        placeholderTextColor={theme.colors.text.tertiary}
                                        keyboardType="numeric"
                                        value={formState.data.cost}
                                        onChangeText={(text) => formState.updateField('cost', text)}
                                    />
                                </View>
                                <View style={[styles.flex1, { flex: 0.8 }]}>
                                    <BottomSheetSelect
                                        label={t('visit_form.currency')}
                                        value={formState.data.currency}
                                        onChange={(val) => formState.updateField('currency', val)}
                                        options={CURRENCIES}
                                        placeholder="EUR"
                                    />
                                </View>
                            </View>

                            <RichTextInput
                                label={t('visit_form.notes_label')}
                                placeholder={t('visit_form.notes_placeholder')}
                                value={formState.data.notes}
                                onChangeText={(text) => formState.updateField('notes', text)}
                                minHeight={80}
                            />
                        </View>
                        <View style={{ height: 20 }} />
                    </View>
                );
            }}
        </FormModal>
    );
}

const styles = StyleSheet.create({
    formContent: {
        gap: 16,
    },
    section: {
        gap: 8,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    providerRow: {
        flexDirection: 'row',
        gap: 12,
    },
    providerItem: {
        alignItems: 'center',
        minWidth: 64,
    },
    providerIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
        borderWidth: 1,
    },
    providerLabel: {
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
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
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },
    urgencyButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
    },
    urgencyText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        fontFamily: 'Plus Jakarta Sans',
    },
    chipRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    categoryChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    categoryChipText: {
        fontSize: 13,
        fontWeight: '500',
        fontFamily: 'Plus Jakarta Sans',
    },
});
