import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBreeds } from '@/hooks/useBreeds';
import { useAppTheme } from '@/hooks/useAppTheme';
import { designSystem } from '@/constants/designSystem'; // Still used for token names if not in theme
import * as ImagePicker from 'expo-image-picker';
import EnhancedSelection from '@/components/ui/EnhancedSelection';
import { calculateAgeFromDDMMYYYY, formatAge, parseDDMMYYYY } from '@/utils/dateUtils';
import UniversalDatePicker from '@/components/desktop/modals/shared/UniversalDatePicker';

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
    const { theme } = useAppTheme();
    const [localData, setLocalData] = useState(formData);
    const [ageDisplay, setAgeDisplay] = useState('');

    useEffect(() => {
        if (localData.date_of_birth) {
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
        <ScrollView style={[styles.container, { padding: 32 }]} showsVerticalScrollIndicator={false}>
            <Text style={[styles.heading, { color: theme.colors.text.primary }]}>Basic Information</Text>
            <Text style={[styles.subheading, { color: theme.colors.text.secondary }]}>Tell us about your pet</Text>

            {/* Photo Upload */}
            <View style={styles.photoSection}>
                <TouchableOpacity
                    onPress={handlePhotoPick}
                    style={[styles.photoContainer, { backgroundColor: theme.colors.background.secondary }]}
                >
                    {localData.photoUri ? (
                        <Image source={{ uri: localData.photoUri }} style={styles.photo} />
                    ) : (
                        <View style={[styles.photoPlaceholder, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                            <Ionicons name="camera" size={32} color={theme.colors.text.tertiary} />
                        </View>
                    )}
                    <View style={[styles.addPhotoButton, { backgroundColor: theme.colors.primary[500], borderColor: theme.colors.background.primary }]}>
                        <Ionicons name="add" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={[styles.addPhotoLabel, { color: theme.colors.primary[500] }]}>Add Photo</Text>
            </View>

            {/* Pet Name */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Pet Name *</Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.colors.background.secondary,
                        borderColor: theme.colors.border.primary,
                        color: theme.colors.text.primary
                    }]}
                    placeholder="e.g., Max, Luna, Bella"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={localData.name}
                    onChangeText={(text) => updateField('name', text)}
                />
            </View>

            {/* Species Selection */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Species *</Text>
                <View style={styles.speciesGrid}>
                    {SPECIES_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.speciesCard,
                                {
                                    backgroundColor: theme.colors.background.primary,
                                    borderColor: theme.colors.border.primary
                                },
                                localData.species === option.id && {
                                    borderColor: theme.colors.primary[500],
                                    backgroundColor: theme.colors.primary[50] // Use a lighter primary shade if available, or just rely on border
                                }
                            ]}
                            onPress={() => {
                                updateField('species', option.id);
                                updateField('breed', ''); // Reset breed
                            }}
                        >
                            <Text style={styles.speciesIcon}>{option.icon}</Text>
                            <Text style={[
                                styles.speciesLabel,
                                { color: theme.colors.text.primary },
                                localData.species === option.id && { color: theme.colors.primary[500] }
                            ]}>{option.label}</Text>
                            {localData.species === option.id && (
                                <View style={styles.checkIcon}>
                                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary[500]} />
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
                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Breed / Type</Text>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: theme.colors.background.secondary,
                            borderColor: theme.colors.border.primary,
                            color: theme.colors.text.primary
                        }]}
                        placeholder="e.g. Hamster, Parrot"
                        placeholderTextColor={theme.colors.text.tertiary}
                        value={localData.breed}
                        onChangeText={(text) => updateField('breed', text)}
                    />
                </View>
            )}

            {/* Color & Gender Row */}
            <View style={styles.row}>
                <View style={styles.col}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Color</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: theme.colors.background.secondary,
                                borderColor: theme.colors.border.primary,
                                color: theme.colors.text.primary
                            }]}
                            placeholder="e.g., Brown"
                            placeholderTextColor={theme.colors.text.tertiary}
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
                <UniversalDatePicker
                    label="Date of Birth"
                    value={localData.date_of_birth || ''}
                    onChange={(text) => updateField('date_of_birth', text)}
                    placeholder="YYYY-MM-DD"
                />
                {ageDisplay ? (
                    <Text style={[styles.ageText, { color: theme.colors.primary[500] }]}>Age: {ageDisplay}</Text>
                ) : null}
            </View>

            {/* Weight */}
            <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex2]}>
                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Weight</Text>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: theme.colors.background.secondary,
                            borderColor: theme.colors.border.primary,
                            color: theme.colors.text.primary
                        }]}
                        placeholder="0.0"
                        placeholderTextColor={theme.colors.text.tertiary}
                        keyboardType="decimal-pad"
                        value={localData.weight?.toString()}
                        onChangeText={(text) => updateField('weight', parseFloat(text) || 0)}
                    />
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                    <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Unit</Text>
                    <View style={[styles.segmentedControl, { backgroundColor: theme.colors.background.secondary }]}>
                        {['kg', 'lbs'].map((unit) => (
                            <TouchableOpacity
                                key={unit}
                                style={[
                                    styles.segment,
                                    localData.weight_unit === unit && {
                                        backgroundColor: theme.colors.background.primary,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.1,
                                        elevation: 1,
                                    },
                                ]}
                                onPress={() => updateField('weight_unit', unit)}
                            >
                                <Text
                                    style={[
                                        styles.segmentText,
                                        { color: theme.colors.text.secondary },
                                        localData.weight_unit === unit && { color: theme.colors.text.primary, fontWeight: '600' }
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
                style={[
                    styles.nextButton,
                    { backgroundColor: theme.colors.primary[500] },
                    !isValid && styles.nextButtonDisabled
                ]}
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
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    subheading: {
        fontSize: 16,
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
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
    },
    addPhotoLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
    },
    speciesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    speciesCard: {
        width: '31%', // Approx 1/3
        aspectRatio: 1,
        borderWidth: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    speciesIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    speciesLabel: {
        fontSize: 14,
        fontWeight: '600',
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
        borderRadius: 10,
        padding: 4,
    },
    segment: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
    },
    ageText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
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
