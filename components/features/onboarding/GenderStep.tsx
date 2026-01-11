import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTranslation } from 'react-i18next';

interface GenderStepProps {
    initialGender?: string;
    onNext: (gender: string) => void;
    onBack: () => void;
}

export default function GenderStep({ initialGender, onNext, onBack }: GenderStepProps) {
    const { t } = useTranslation();
    const [selectedGender, setSelectedGender] = useState(initialGender);

    const GENDERS = [
        { id: 'female', label: t('onboarding.gender_female'), icon: 'female', color: 'pink' },
        { id: 'male', label: t('onboarding.gender_male'), icon: 'male', color: 'blue' },
        { id: 'non_binary', label: t('onboarding.gender_non_binary'), icon: 'transgender', color: 'purple' },
        { id: 'prefer_not_to_say', label: t('onboarding.gender_prefer_not_to_say'), icon: 'slash.circle', color: 'slate' },
    ];

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
                <View style={styles.progressSegment} />
                <View style={styles.progressSegment} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('onboarding.gender_title')}</Text>
                    <Text style={styles.subtitle}>{t('onboarding.gender_subtitle')}</Text>
                </View>

                <View style={styles.list}>
                    {GENDERS.map((item) => {
                        const isSelected = selectedGender === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.card,
                                    isSelected && styles.cardSelected
                                ] as any}
                                onPress={() => setSelectedGender(item.id)}
                            >
                                <View style={styles.cardLeft}>
                                    <View style={[styles.iconBox, { backgroundColor: item.color === 'slate' ? designSystem.colors.neutral[100] : (item.color === 'pink' ? '#fce7f3' : (item.color === 'blue' ? '#dbeafe' : '#f3e8ff')) }]}>
                                        <IconSymbol
                                            ios_icon_name={item.icon as any}
                                            android_material_icon_name={item.icon as any}
                                            size={24}
                                            color={item.color === 'slate' ? designSystem.colors.text.tertiary : (item.color === 'pink' ? '#ec4899' : (item.color === 'blue' ? '#3b82f6' : '#a855f7'))}
                                        />
                                    </View>
                                    <Text style={styles.cardLabel}>{item.label}</Text>
                                </View>
                                <View style={styles.radio}>
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, !selectedGender && styles.buttonDisabled] as any}
                    onPress={() => selectedGender && onNext(selectedGender)}
                    disabled={!selectedGender}
                >
                    <Text style={styles.buttonText}>{t('common.continue')}</Text>
                    <IconSymbol
                        ios_icon_name="arrow.right"
                        android_material_icon_name="arrow-forward"
                        size={20}
                        color={designSystem.colors.neutral[0] as any}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.skipButton} onPress={() => onNext('')}>
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
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
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
    list: {
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: designSystem.colors.neutral[0],
        borderRadius: 16,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        ...designSystem.shadows.sm,
    },
    cardSelected: {
        borderColor: designSystem.colors.primary[500],
        borderWidth: 2,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardLabel: {
        ...designSystem.typography.body.large,
        fontWeight: '600',
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: designSystem.colors.neutral[300],
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: designSystem.colors.primary[500],
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
        opacity: 0.5,
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
