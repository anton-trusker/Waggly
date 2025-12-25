import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTranslation } from 'react-i18next';

interface NameStepProps {
    initialFirstName: string;
    initialLastName: string;
    onNext: (first: string, last: string) => void;
    onBack: () => void;
}

export default function NameStep({ initialFirstName, initialLastName, onNext, onBack }: NameStepProps) {
    const { t } = useTranslation();
    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);

    const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;

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
                <View style={styles.progressSegment} />
                <View style={styles.progressSegment} />
                <View style={styles.progressSegment} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('onboarding.name_title')}</Text>
                    <Text style={styles.subtitle}>
                        {t('onboarding.name_subtitle')}
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('onboarding.first_name')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('onboarding.first_name_placeholder')}
                            placeholderTextColor={designSystem.colors.text.tertiary}
                            value={firstName}
                            onChangeText={setFirstName}
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('onboarding.last_name')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('onboarding.last_name_placeholder')}
                            placeholderTextColor={designSystem.colors.text.tertiary}
                            value={lastName}
                            onChangeText={setLastName}
                            autoCapitalize="words"
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, !isValid && styles.buttonDisabled]}
                    onPress={() => isValid && onNext(firstName, lastName)}
                    disabled={!isValid}
                >
                    <Text style={styles.buttonText}>{t('common.continue')}</Text>
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
        paddingBottom: 120,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        ...designSystem.typography.display.medium,
        marginBottom: 12,
    },
    subtitle: {
        ...designSystem.typography.body.large,
        color: designSystem.colors.text.secondary,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.text.secondary,
        fontWeight: 'bold',
    },
    input: {
        height: 56,
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: designSystem.colors.text.primary,
        ...designSystem.shadows.sm,
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
});
