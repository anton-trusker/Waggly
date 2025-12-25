import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBreeds } from '@/hooks/useBreeds';
import * as ImagePicker from 'expo-image-picker';
import EnhancedSelection from '@/components/ui/EnhancedSelection';
import { calculateAgeFromDDMMYYYY, formatAge, parseDDMMYYYY } from '@/utils/dateUtils';
import { designSystem } from '@/constants/designSystem';

interface WizardStepBasicInfoProps {
    formData: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
}

const SPECIES_OPTIONS = [
    { id: 'dog', label: 'Dog', icon: '🐕' },
    { id: 'cat', label: 'Cat', icon: '🐈' },
    { id: 'bird', label: 'Bird', icon: '🦜' },
    { id: 'rabbit', label: 'Rabbit', icon: '🐰' },
    { id: 'reptile', label: 'Reptile', icon: '🦎' },
    { id: 'other', label: 'Other', icon: '🐾' },
];

const GENDER_OPTIONS = [
    { id: 'male', label: 'Male', icon: 'male' },
    { id: 'female', label: 'Female', icon: 'female' },
];

const WizardStepBasicInfo: React.FC<WizardStepBasicInfoProps> = ({
    formData,
    onUpdate,
    onNext,
}) => {
    const { breeds } = useBreeds();
    const [localData, setLocalData] = useState(formData);
    const [ageDisplay, setAgeDisplay] = useState('');

    useEffect(() => {
        if (localData.date_of_birth) {
            // Check format. If YYYY-MM-DD (standard HTML date), convert to DD-MM-YYYY for utils
            // If the input is text "DD-MM-YYYY", use as is.
            // Let's assume we store as YYYY-MM-DD (ISO) for consistency if possible, or whatever the app expects.
            // The previous code had "YYYY-MM-DD" placeholder.
            // But `utils/dateUtils` prefers DD-MM-YYYY.
            // Let's stick to YYYY-MM-DD for storage/input value on web (standard), but convert for display/utils.
            
            // Actually, let's try to parse whatever we have.
            const parts = localData.date_of_birth.split('-');
            let dateObj: Date | null = null;
            
            if (parts.length === 3) {
                if (parts[0].length === 4) {
                     // YYYY-MM-DD
                     dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                } else {
                    // DD-MM-YYYY
                    dateObj = parseDDMMYYYY(localData.date_of_birth);
                }
            }

            if (dateObj && !isNaN(dateObj.getTime())) {
                setAgeDisplay(formatAge(dateObj));
            } else {
                setAgeDisplay('');
            }
        }
    }, [localData.date_of_birth]);

    const updateField = (field: string, value: any) => {
        const newData = { ...localData, [field]: value };
        setLocalData(newData);
        onUpdate(newData);
    };

    const handlePhotoPick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            updateField('photoUri', result.assets[0].uri);
        }
    };

    const filteredBreeds = breeds
        .filter(b => b.species === localData.species)
        .map(b => ({ id: b.name, label: b.name }));

    const isValid = localData.name && localData.species;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>Basic Information</Text>
            <Text style={styles.subheading}>Tell us about your pet</Text>

            {/* Photo Upload */}
            <View style={styles.photoSection}>
                <TouchableOpacity onPress={handlePhotoPick} style={styles.photoContainer}>
                    {localData.photoUri ? (
                        <Image source={{ uri: localData.photoUri }} style={styles.photo} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Ionicons name="camera" size={32} color="#9CA3AF" />
                        </View>
                    )}
                    <View style={styles.addPhotoButton}>
                        <Ionicons name="add" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.addPhotoLabel}>Add Photo</Text>
            </View>

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
                <View style={styles.speciesGrid}>
                    {SPECIES_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.speciesCard,
                                localData.species === option.id && styles.speciesCardSelected,
                            ]}
                            onPress={() => {
                                updateField('species', option.id);
                                updateField('breed', ''); // Reset breed
                            }}
                        >
                            <Text style={styles.speciesIcon}>{option.icon}</Text>
                            <Text style={[
                                styles.speciesLabel,
                                localData.species === option.id && styles.speciesLabelSelected
                            ]}>{option.label}</Text>
                            {localData.species === option.id && (
                                <View style={styles.checkIcon}>
                                    <Ionicons name="checkmark-circle" size={20} color="#6366F1" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Breed */}
            {(localData.species === 'dog' || localData.species === 'cat') && (
                <EnhancedSelection
                    label="Breed"
                    value={localData.breed}
                    options={filteredBreeds}
                    onSelect={(opt) => updateField('breed', opt.id)}
                    placeholder="Select breed"
                    searchable
                />
            )}
             {localData.species && localData.species !== 'dog' && localData.species !== 'cat' && (
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Breed / Type</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Hamster, Parrot"
                        placeholderTextColor="#9CA3AF"
                        value={localData.breed}
                        onChangeText={(text) => updateField('breed', text)}
                    />
                </View>
            )}

            {/* Color & Gender Row */}
            <View style={styles.row}>
                <View style={styles.col}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Color</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Brown"
                            placeholderTextColor="#9CA3AF"
                            value={localData.color}
                            onChangeText={(text) => updateField('color', text)}
                        />
                    </View>
                </View>
                <View style={styles.col}>
                    <EnhancedSelection
                        label="Gender"
                        value={localData.gender}
                        options={GENDER_OPTIONS}
                        onSelect={(opt) => updateField('gender', opt.id)}
                        placeholder="Select gender"
                        searchable={false}
                    />
                </View>
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                {Platform.OS === 'web' ? (
                    React.createElement('input', {
                        type: 'date',
                        style: {
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            borderRadius: 12,
                            padding: '12px 16px',
                            fontSize: '14px',
                            color: '#111827',
                            backgroundColor: '#F9FAFB',
                            width: '100%',
                            outline: 'none',
                            boxSizing: 'border-box',
                            fontFamily: 'inherit'
                        },
                        value: localData.date_of_birth || '',
                        onChange: (e: any) => updateField('date_of_birth', e.target.value),
                        placeholder: "Select date"
                    })
                ) : (
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#9CA3AF"
                        value={localData.date_of_birth}
                        onChangeText={(text) => updateField('date_of_birth', text)}
                    />
                )}
                {ageDisplay ? (
                    <Text style={styles.ageText}>Age: {ageDisplay}</Text>
                ) : null}
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
    photoSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    photoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 12,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    photoPlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
        backgroundColor: '#F3F4F6',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#6366F1',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    addPhotoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6366F1',
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
    speciesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    speciesCard: {
        width: '31%', // Approx 1/3
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    speciesCardSelected: {
        borderColor: '#6366F1',
        backgroundColor: '#F0F6FF',
    },
    speciesIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    speciesLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    speciesLabelSelected: {
        color: '#6366F1',
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    col: {
        flex: 1,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    segmentTextSelected: {
        color: '#111827',
    },
    ageText: {
        marginTop: 8,
        fontSize: 14,
        color: '#6366F1',
        fontWeight: '500',
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
