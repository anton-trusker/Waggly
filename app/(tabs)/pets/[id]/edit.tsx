import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePets } from '@/hooks/usePets';
import { supabase } from '@/lib/supabase';
import { useLocale } from '@/hooks/useLocale';

const SPECIES_OPTIONS = [
    { id: 'dog', labelKey: 'add_pet.species.dog', icon: '🐕' },
    { id: 'cat', labelKey: 'add_pet.species.cat', icon: '🐈' },
    { id: 'other', labelKey: 'add_pet.species.other', icon: '🐾' },
];

const GENDER_OPTIONS = [
    { id: 'male', labelKey: 'add_pet.step1.male' },
    { id: 'female', labelKey: 'add_pet.step1.female' },
    { id: 'unknown', labelKey: 'common.unknown' }, // reusing common.unknown if exists or add_pet keys
];

export default function EditPetPage() {
    const { t } = useLocale();
    const router = useRouter();
    const params = useLocalSearchParams();
    const petId = params.id as string;
    const { pets } = usePets();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        color: '',
        gender: '',
        date_of_birth: '',
        weight: 0,
        weight_unit: 'kg',
        microchip_number: '',
        notes: '',
        is_spayed_neutered: false,
    });

    const pet = pets.find(p => p.id === petId);

    useEffect(() => {
        if (pet) {
            setFormData({
                name: pet.name || '',
                species: pet.species || '',
                breed: pet.breed || '',
                color: pet.color || '',
                gender: pet.gender || '',
                date_of_birth: pet.date_of_birth || '',
                weight: pet.weight || 0,
                weight_unit: (pet as any).weight_unit || 'kg',
                microchip_number: pet.microchip_number || '',
                notes: (pet as any).notes || '',
                is_spayed_neutered: pet.is_spayed_neutered || false,
            });
        }
    }, [pet]);

    const updateField = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = async () => {
        if (!formData.name) {
            Alert.alert(t('pet_profile.edit.error'), t('pet_profile.edit.name_required'));
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('pets')
                .update({
                    name: formData.name,
                    species: formData.species,
                    breed: formData.breed || null,
                    color: formData.color || null,
                    gender: formData.gender || null,
                    date_of_birth: formData.date_of_birth || null,
                    weight: formData.weight || null,
                    weight_unit: formData.weight_unit,
                    microchip_number: formData.microchip_number || null,
                    notes: formData.notes || null,
                    is_spayed_neutered: formData.is_spayed_neutered,
                })
                .eq('id', petId);

            if (error) throw error;

            if (error) throw error;

            Alert.alert(t('pet_profile.edit.success'), t('pet_profile.edit.success_message'));
            router.back();
        } catch (error: any) {
            Alert.alert(t('pet_profile.edit.error'), error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!pet) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#6B7280" />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.title}>{t('pet_profile.edit.title')}</Text>
                            <Text style={styles.subtitle}>{pet.name}</Text>
                        </View>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                            <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <>
                                    <Ionicons name="checkmark" size={20} color="#fff" />
                                    <Text style={styles.saveButtonText}>{t('pet_profile.edit.save_changes')}</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form */}
                <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                    {/* Basic Information Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('pet_profile.edit.sections.basic_info')}</Text>

                        {/* Pet Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('pet_profile.edit.labels.name')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('pet_profile.edit.placeholders.name')}
                                value={formData.name}
                                onChangeText={(text) => updateField('name', text)}
                            />
                        </View>

                        {/* Species */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('pet_profile.edit.labels.species')}</Text>
                            <View style={styles.optionsGrid}>
                                {SPECIES_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.optionCard,
                                            formData.species === option.id && styles.optionCardSelected,
                                        ]}
                                        onPress={() => updateField('species', option.id)}
                                    >
                                        <Text style={styles.optionIcon}>{option.icon}</Text>
                                        <Text style={styles.optionLabel}>{t(option.labelKey)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Breed & Color */}
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.flex1]}>
                                <Text style={styles.label}>{t('pet_profile.edit.labels.breed')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('pet_profile.edit.placeholders.breed')}
                                    value={formData.breed}
                                    onChangeText={(text) => updateField('breed', text)}
                                />
                            </View>
                            <View style={[styles.inputGroup, styles.flex1]}>
                                <Text style={styles.label}>{t('pet_profile.edit.labels.color')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('pet_profile.edit.placeholders.color')}
                                    value={formData.color}
                                    onChangeText={(text) => updateField('color', text)}
                                />
                            </View>
                        </View>

                        {/* Gender */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('pet_profile.edit.labels.gender')}</Text>
                            <View style={styles.radioGroup}>
                                {GENDER_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={styles.radioOption}
                                        onPress={() => updateField('gender', option.id)}
                                    >
                                        <View style={styles.radio}>
                                            {formData.gender === option.id && <View style={styles.radioSelected} />}
                                        </View>
                                        <Text style={styles.radioLabel}>{t(option.labelKey)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Date of Birth */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('pet_profile.edit.labels.dob')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('pet_profile.edit.placeholders.dob')}
                                value={formData.date_of_birth}
                                onChangeText={(text) => updateField('date_of_birth', text)}
                            />
                        </View>

                        {/* Weight */}
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.flex2]}>
                                <Text style={styles.label}>{t('pet_profile.edit.labels.weight')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('pet_profile.edit.placeholders.weight')}
                                    keyboardType="decimal-pad"
                                    value={formData.weight?.toString()}
                                    onChangeText={(text) => updateField('weight', parseFloat(text) || 0)}
                                />
                            </View>
                            <View style={[styles.inputGroup, styles.flex1]}>
                                <Text style={styles.label}>{t('pet_profile.edit.labels.unit')}</Text>
                                <View style={styles.segmentedControl}>
                                    {['kg', 'lbs'].map((unit) => (
                                        <TouchableOpacity
                                            key={unit}
                                            style={[
                                                styles.segment,
                                                formData.weight_unit === unit && styles.segmentSelected,
                                            ]}
                                            onPress={() => updateField('weight_unit', unit)}
                                        >
                                            <Text
                                                style={[
                                                    styles.segmentText,
                                                    formData.weight_unit === unit && styles.segmentTextSelected,
                                                ]}
                                            >
                                                {unit}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        {/* Spayed/Neutered */}
                        <TouchableOpacity
                            style={styles.toggleRow}
                            onPress={() => updateField('is_spayed_neutered', !formData.is_spayed_neutered)}
                        >
                            <Text style={styles.toggleLabel}>{t('pet_profile.edit.labels.spayed_neutered')}</Text>
                            <View style={[styles.toggle, formData.is_spayed_neutered && styles.toggleActive]}>
                                <View
                                    style={[
                                        styles.toggleThumb,
                                        formData.is_spayed_neutered && styles.toggleThumbActive,
                                    ]}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Medical Information Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('pet_profile.edit.sections.medical_info')}</Text>

                        {/* Microchip */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('pet_profile.edit.labels.microchip')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('pet_profile.edit.placeholders.microchip')}
                                value={formData.microchip_number}
                                onChangeText={(text) => updateField('microchip_number', text)}
                            />
                        </View>
                    </View>

                    {/* Notes Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('pet_profile.edit.sections.notes')}</Text>
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={[styles.input, styles.textarea]}
                                placeholder={t('pet_profile.edit.placeholders.notes')}
                                multiline
                                numberOfLines={6}
                                value={formData.notes}
                                onChangeText={(text) => updateField('notes', text)}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        maxWidth: 900,
        alignSelf: 'center',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#6366F1',
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    form: {
        flex: 1,
        padding: 32,
    },
    section: {
        marginBottom: 32,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#F9FAFB',
    },
    textarea: {
        height: 120,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    flex1: {
        flex: 1,
    },
    flex2: {
        flex: 2,
    },
    optionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    optionCard: {
        flex: 1,
        padding: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    optionCardSelected: {
        borderColor: '#6366F1',
        backgroundColor: '#F0F6FF',
    },
    optionIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    optionLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
    },
    radioGroup: {
        flexDirection: 'row',
        gap: 24,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#6366F1',
    },
    radioLabel: {
        fontSize: 14,
        color: '#374151',
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 4,
    },
    segment: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    segmentSelected: {
        backgroundColor: '#fff',
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    segmentTextSelected: {
        color: '#111827',
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    toggleLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    toggle: {
        width: 52,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
        padding: 2,
    },
    toggleActive: {
        backgroundColor: '#6366F1',
    },
    toggleThumb: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
    },
    toggleThumbActive: {
        transform: [{ translateX: 20 }],
    },
});
