import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';


export interface Step1Data {
    name: string;
    species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'reptile' | 'other';
    photoUri?: string;
}

interface Step1Props {
    initialData: Step1Data;
    onNext: (data: Step1Data) => void;
}

const SPECIES_OPTIONS = [
    { id: 'dog', label: 'Dog', icon: '🐕', iosIcon: 'pawprint.fill', androidIcon: 'pets' },
    { id: 'cat', label: 'Cat', icon: '🐈', iosIcon: 'pawprint.fill', androidIcon: 'pets' },
    { id: 'bird', label: 'Bird', icon: '🦜', iosIcon: 'bird.fill', androidIcon: 'flutter_dash' },
    { id: 'rabbit', label: 'Rabbit', icon: '🐰', iosIcon: 'hare.fill', androidIcon: 'cruelty_free' },
    { id: 'reptile', label: 'Reptile', icon: '🦎', iosIcon: 'lizard.fill', androidIcon: 'pets' },
    { id: 'other', label: 'Other', icon: '🐾', iosIcon: 'pawprint.fill', androidIcon: 'pets' },
] as const;

export default function Step1BasicInfo({ initialData, onNext }: Step1Props) {
    const [name, setName] = useState(initialData.name);
    const [species, setSpecies] = useState(initialData.species);
    const [photoUri, setPhotoUri] = useState(initialData.photoUri);

    const handlePhotoPick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleNext = () => {
        if (name.trim()) {
            onNext({ name, species, photoUri });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Let's meet your companion</Text>
                </View>

                {/* Photo Upload */}
                <View style={styles.photoSection}>
                    <TouchableOpacity onPress={handlePhotoPick} style={styles.photoContainer}>
                        {photoUri ? (
                            <Image source={{ uri: photoUri }} style={styles.photo} />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <IconSymbol
                                    ios_icon_name="camera"
                                    android_material_icon_name="photo-camera"
                                    size={32}
                                    color={designSystem.colors.text.tertiary}
                                />
                            </View>
                        )}
                        <View style={styles.addPhotoButton}>
                            <IconSymbol
                                ios_icon_name="plus"
                                android_material_icon_name="add"
                                size={20}
                                color={designSystem.colors.neutral[0]}
                            />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.addPhotoLabel}>Add Photo</Text>
                </View>

                {/* Form Fields */}
                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PET'S NAME</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Bella, Max"
                            placeholderTextColor={designSystem.colors.text.tertiary}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>WHAT ARE THEY?</Text>
                        <View style={styles.speciesRow}>
                            {SPECIES_OPTIONS.map((opt) => (
                                <TouchableOpacity
                                    key={opt.id}
                                    style={styles.speciesItem}
                                    onPress={() => setSpecies(opt.id as any)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[
                                        styles.speciesBox,
                                        species === opt.id && styles.speciesBoxSelected,
                                    ]}>
                                        <Text style={styles.speciesIcon}>{opt.icon}</Text>
                                    </View>
                                    <Text style={[
                                        styles.speciesLabel,
                                        species === opt.id && styles.speciesLabelSelected
                                    ]}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={{ height: Platform.OS === 'web' ? 100 : 160 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, !name.trim() && styles.continueButtonDisabled]}
                    onPress={handleNext}
                    disabled={!name.trim()}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                    <IconSymbol
                        ios_icon_name="arrow.right"
                        android_material_icon_name="arrow-forward"
                        size={20}
                        color={designSystem.colors.neutral[0]}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    heroSection: {
        marginBottom: 20,
    },
    heroTitle: {
        ...(designSystem.typography.title.large as any),
        color: designSystem.colors.text.primary,
        lineHeight: 34,
    },
    photoSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    photoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
        position: 'relative',
        ...designSystem.shadows.sm,
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
        backgroundColor: designSystem.colors.neutral[100],
        borderWidth: 2,
        borderColor: designSystem.colors.neutral[200],
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: designSystem.colors.primary[500],
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: designSystem.colors.background.primary,
    },
    addPhotoLabel: {
        ...(designSystem.typography.title.medium as any),
        color: designSystem.colors.text.primary,
    },
    formSection: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        ...(designSystem.typography.label.small as any),
        color: designSystem.colors.text.secondary,
        letterSpacing: 1,
        fontWeight: '700',
    },
    input: {
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 18,
        color: designSystem.colors.text.primary,
        ...designSystem.shadows.sm,
    },
    speciesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        rowGap: 16,
    },
    speciesItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    speciesBox: {
        width: 25,
        height: 25,
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1.5,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    speciesBoxSelected: {
        borderColor: designSystem.colors.primary[500],
        borderWidth: 2,
        backgroundColor: designSystem.colors.primary[50],
    },
    speciesIcon: {
        fontSize: 16,
        lineHeight: 16,
    },
    speciesLabel: {
        ...(designSystem.typography.label.small as any),
        color: designSystem.colors.text.secondary,
        fontWeight: '600',
    },
    speciesLabelSelected: {
        color: designSystem.colors.primary[700],
    },
    checkIcon: {
        position: 'absolute',
        top: 6,
        right: 6,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: designSystem.colors.background.primary,
        borderTopWidth: 1,
        borderTopColor: designSystem.colors.neutral[100],
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    },
    continueButton: {
        backgroundColor: designSystem.colors.primary[500],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        ...designSystem.shadows.md,
    },
    continueButtonDisabled: {
        opacity: 0.5,
    },
    continueButtonText: {
        ...(designSystem.typography.title.medium as any),
        color: designSystem.colors.neutral[0],
        fontWeight: '800',
    },
});
