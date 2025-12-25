import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

interface PhotoStepProps {
    onNext: (photoUri: string | null) => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export default function PhotoStep({ onNext, onBack, isSubmitting }: PhotoStepProps) {
    const { t } = useTranslation();
    const [photo, setPhoto] = useState<string | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <IconSymbol ios_icon_name="arrow.left" android_material_icon_name="arrow-back" size={24} color={designSystem.colors.text.secondary} />
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                    <IconSymbol ios_icon_name="pawprint.fill" android_material_icon_name="pets" size={24} color={designSystem.colors.primary[500]} />
                </View>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.progressContainer}>
                <View style={[styles.progressSegment, styles.progressActive]} />
                <View style={[styles.progressSegment, styles.progressActive]} />
                <View style={[styles.progressSegment, styles.progressActive]} />
                <View style={[styles.progressSegment, styles.progressActive]} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('onboarding.photo_title')}</Text>
                    <Text style={styles.subtitle}>{t('onboarding.photo_subtitle')}</Text>
                </View>

                <View style={styles.uploadContainer}>
                    <TouchableOpacity style={styles.avatarButton} onPress={pickImage}>
                        {photo ? (
                            <Image source={{ uri: photo }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.placeholder}>
                                <IconSymbol ios_icon_name="person.fill" android_material_icon_name="person" size={64} color={designSystem.colors.primary[200]} />
                                <View style={styles.cameraIcon}>
                                    <IconSymbol ios_icon_name="camera.fill" android_material_icon_name="photo-camera" size={20} color={designSystem.colors.neutral[0]} />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage}>
                        <Text style={styles.changeText}>{photo ? t('onboarding.change_photo') : t('onboarding.upload_photo')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                    onPress={() => onNext(photo)}
                    disabled={isSubmitting}
                >
                    <Text style={styles.buttonText}>{isSubmitting ? t('common.saving') : t('common.finish')}</Text>
                    {!isSubmitting && <IconSymbol
                        ios_icon_name="checkmark"
                        android_material_icon_name="check"
                        size={20}
                        color={designSystem.colors.neutral[0]}
                    />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.skipButton} onPress={() => onNext(null)} disabled={isSubmitting}>
                    <Text style={styles.skipText}>{t('common.skip')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: designSystem.colors.background.primary,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    logoContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[100],
        justifyContent: 'center',
        alignItems: 'center',
        ...designSystem.shadows.sm,
    },
    progressContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 8,
        marginBottom: 24,
    },
    progressSegment: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        backgroundColor: designSystem.colors.neutral[200],
    },
    progressActive: {
        backgroundColor: designSystem.colors.primary[500],
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 140,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        ...designSystem.typography.display.medium,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        ...designSystem.typography.body.large,
        textAlign: 'center',
        color: designSystem.colors.text.secondary,
        maxWidth: 280,
    },
    uploadContainer: {
        alignItems: 'center',
        gap: 24,
    },
    avatarButton: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: designSystem.colors.neutral[0],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: designSystem.colors.neutral[100],
        ...designSystem.shadows.md,
        position: 'relative',
    },
    avatarImage: {
        width: 152,
        height: 152,
        borderRadius: 76,
    },
    placeholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: designSystem.colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: designSystem.colors.neutral[0],
    },
    changeText: {
        ...designSystem.typography.title.small,
        color: designSystem.colors.primary[500],
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: designSystem.colors.background.primary,
        borderTopWidth: 1,
        borderTopColor: designSystem.colors.neutral[100],
    },
    button: {
        backgroundColor: designSystem.colors.primary[500],
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
        ...designSystem.shadows.md,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        ...designSystem.typography.title.medium,
        color: designSystem.colors.neutral[0],
        fontWeight: 'bold',
    },
    skipButton: {
        alignItems: 'center',
        padding: 8,
    },
    skipText: {
        ...designSystem.typography.body.medium,
        color: designSystem.colors.text.secondary,
        fontWeight: '600',
    }
});
