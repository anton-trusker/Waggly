import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBreeds } from '@/hooks/useBreeds';

interface WizardStepBasicInfoProps {
    formData: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
}

const SPECIES_OPTIONS = [
    { id: 'dog', label: 'Dog', icon: '🐕' },
    { id: 'cat', label: 'Cat', icon: '🐈' },
    { id: 'other', label: 'Other', icon: '🐾' },
];

const GENDER_OPTIONS = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'unknown', label: 'Unknown' },
];

const WizardStepBasicInfo: React.FC<WizardStepBasicInfoProps> = ({
    formData,
    onUpdate,
    onNext,
}) => {
    const { breeds } = useBreeds();
    const [localData, setLocalData] = useState(formData);

    const updateField = (field: string, value: any) => {
        const newData = { ...localData, [field]: value };
        setLocalData(newData);
        onUpdate(newData);
    };

    const filteredBreeds = breeds.filter(b => b.species === localData.species);

    const isValid = localData.name && localData.species;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>Basic Information</Text>
            <Text style={styles.subheading}>Tell us about your pet</Text>

            {/* Pet Name */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Pet Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Max, Luna, Bella"
                    placeholderTextColor="#9CA3AF"
                    value={localData.name}
                    onChangeText={(text) => updateField('name', text)}
                />
            </View>

            {/* Species Selection */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Species *</Text>
                <View style={styles.optionsGrid}>
                    {SPECIES_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionCard,
                                localData.species === option.id && styles.optionCardSelected,
                            ]}
                            onPress={() => updateField('species', option.id)}
                        >
                            <Text style={styles.optionIcon}>{option.icon}</Text>
                            <Text style={styles.optionLabel}>{option.label}</Text>
                            {localData.species === option.id && (
                                <View style={styles.optionCheck}>
                                    <Ionicons name="checkmark-circle" size={20} color="#6366F1" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Breed */}
            {localData.species && (
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Breed</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Search breed..."
                            placeholderTextColor="#9CA3AF"
                            value={localData.breed}
                            onChangeText={(text) => updateField('breed', text)}
                        />
                    </View>
                </View>
            )}

            {/* Color */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Color</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Brown, Black, White"
                    placeholderTextColor="#9CA3AF"
                    value={localData.color}
                    onChangeText={(text) => updateField('color', text)}
                />
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.radioGroup}>
                    {GENDER_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={styles.radioOption}
                            onPress={() => updateField('gender', option.id)}
                        >
                            <View style={styles.radio}>
                                {localData.gender === option.id && (
                                    <View style={styles.radioSelected} />
                                )}
                            </View>
                            <Text style={styles.radioLabel}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9CA3AF"
                    value={localData.date_of_birth}
                    onChangeText={(text) => updateField('date_of_birth', text)}
                />
            </View>

            {/* Weight */}
            <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex2]}>
                    <Text style={styles.label}>Weight</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0.0"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="decimal-pad"
                        value={localData.weight?.toString()}
                        onChangeText={(text) => updateField('weight', parseFloat(text) || 0)}
                    />
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={styles.label}>Unit</Text>
                    <View style={styles.segmentedControl}>
                        {['kg', 'lbs'].map((unit) => (
                            <TouchableOpacity
                                key={unit}
                                style={[
                                    styles.segment,
                                    localData.weight_unit === unit && styles.segmentSelected,
                                ]}
                                onPress={() => updateField('weight_unit', unit)}
                            >
                                <Text
                                    style={[
                                        styles.segmentText,
                                        localData.weight_unit === unit && styles.segmentTextSelected,
                                    ]}
                                >
                                    {unit}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            {/* Next Button */}
            <TouchableOpacity
                style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
                onPress={onNext}
                disabled={!isValid}
            >
                <Text style={styles.nextButtonText}>Next: Contact Info</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    subheading: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 24,
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
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
    },
    inputIcon: {
        marginRight: 12,
    },
    optionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    optionCard: {
        flex: 1,
        padding: 20,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#fff',
    },
    optionCardSelected: {
        borderColor: '#6366F1',
        backgroundColor: '#F0F6FF',
    },
    optionIcon: {
        fontSize: 40,
        marginBottom: 8,
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    optionCheck: {
        position: 'absolute',
        top: 8,
        right: 8,
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
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#6366F1',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 24,
    },
    nextButtonDisabled: {
        opacity: 0.5,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default WizardStepBasicInfo;
