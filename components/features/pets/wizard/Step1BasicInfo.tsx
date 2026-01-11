import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { useLocale } from '@/hooks/useLocale';

export interface Step1Data {
    name: string;
    species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'reptile' | 'other';
    photoUri?: string;
    gender: 'male' | 'female';
}

interface Step1Props {
    initialData: Step1Data;
    onNext: (data: Step1Data) => void;
}

const SPECIES_OPTIONS = [
    { id: 'dog', labelKey: 'dog', icon: '🐕', iosIcon: 'pawprint.fill', androidIcon: 'pets' },
    { id: 'cat', labelKey: 'cat', icon: '🐈', iosIcon: 'pawprint.fill', androidIcon: 'pets' },
    { id: 'bird', labelKey: 'bird', icon: '🦜', iosIcon: 'bird.fill', androidIcon: 'flutter_dash' },
    { id: 'rabbit', labelKey: 'rabbit', icon: '🐰', iosIcon: 'hare.fill', androidIcon: 'cruelty_free' },
    { id: 'reptile', labelKey: 'reptile', icon: '🦎', iosIcon: 'lizard.fill', androidIcon: 'pets' },
    { id: 'other', labelKey: 'other', icon: '🐾', iosIcon: 'pawprint.fill', androidIcon: 'pets' },
] as const;

export default function Step1BasicInfo({ initialData, onNext }: Step1Props) {
    const { t } = useLocale();
    const [name, setName] = useState(initialData.name);
    const [species, setSpecies] = useState(initialData.species);
    const [photoUri, setPhotoUri] = useState(initialData.photoUri);
    const [gender, setGender] = useState<'male' | 'female'>(initialData.gender || 'male');

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
            onNext({ name, species, photoUri, gender });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>{t('add_pet.step1.title')}</Text>
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
                                color={designSystem.colors.neutral[0] as any}
                            />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.addPhotoLabel}>{t('add_pet.step1.add_photo')}</Text>
                </View>

                {/* Form Fields */}
                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('add_pet.step1.name_label')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('add_pet.step1.name_placeholder')}
                            placeholderTextColor={designSystem.colors.text.tertiary}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('add_pet.step1.species_label')}</Text>
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
                                        {t(`add_pet.species.${opt.labelKey}`)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('add_pet.step1.gender_label')}</Text>
                        <View style={styles.genderRow}>
                            <TouchableOpacity
                                style={[styles.genderCard, gender === 'male' && styles.genderCardSelected] as any}
                                onPress={() => setGender('male')}
                                activeOpacity={0.7}
                            >
                                <IconSymbol
                                    ios_icon_name="circle"
                                    android_material_icon_name="male"
                                    size={24}
                                    color={gender === 'male' ? designSystem.colors.primary[500] : designSystem.colors.text.tertiary}
                                />
                                <Text style={[styles.genderLabel, gender === 'male' && styles.genderLabelSelected]}>
                                    {t('add_pet.step1.male')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.genderCard, gender === 'female' && styles.genderCardSelected] as any}
                                onPress={() => setGender('female')}
                                activeOpacity={0.7}
                            >
                                <IconSymbol
                                    ios_icon_name="circle"
                                    android_material_icon_name="female"
                                    size={24}
                                    color={gender === 'female' ? designSystem.colors.primary[500] : designSystem.colors.text.tertiary}
                                />
                                <Text style={[styles.genderLabel, gender === 'female' && styles.genderLabelSelected]}>
                                    {t('add_pet.step1.female')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ height: Platform.OS === 'web' ? 100 : 160 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, !name.trim() && styles.continueButtonDisabled] as any}
                    onPress={handleNext}
                    disabled={!name.trim()}
                >
                    <Text style={styles.continueButtonText}>{t('add_pet.step1.continue')}</Text>
                    <IconSymbol
                        ios_icon_name="arrow.right"
                        android_material_icon_name="arrow-forward"
                        size={20}
                        color={designSystem.colors.neutral[0] as any}
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
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
        position: 'relative',
        ...designSystem.shadows.sm,
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
    },
    photoPlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
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
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: designSystem.colors.background.primary,
    },
    addPhotoLabel: {
        ...(designSystem.typography.body.small as any),
        color: designSystem.colors.text.secondary,
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
        gap: 16,
        rowGap: 20,
    },
    speciesItem: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
    },
    speciesBox: {
        width: 60,
        height: 60,
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 2,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        ...designSystem.shadows.sm,
    },
    speciesBoxSelected: {
        borderColor: designSystem.colors.primary[500],
        borderWidth: 2.5,
        backgroundColor: designSystem.colors.primary[50],
    },
    speciesIcon: {
        fontSize: 24,
        lineHeight: 24,
    },
    speciesLabel: {
        ...(designSystem.typography.label.small as any),
        color: designSystem.colors.text.secondary,
        fontWeight: '600',
        fontSize: 11,
    },
    speciesLabelSelected: {
        color: designSystem.colors.primary[700],
        fontWeight: '700',
    },
    genderRow: {
        flexDirection: 'row',
        gap: 12,
    },
    genderCard: {
        flex: 1,
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 2,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...designSystem.shadows.sm,
    },
    genderCardSelected: {
        borderColor: designSystem.colors.primary[500],
        backgroundColor: designSystem.colors.primary[50],
    },
    genderLabel: {
        ...(designSystem.typography.label.medium as any),
        color: designSystem.colors.text.secondary,
        fontWeight: '600',
    },
    genderLabelSelected: {
        color: designSystem.colors.primary[700],
        fontWeight: '700',
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
        paddingBottom: 16,
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
