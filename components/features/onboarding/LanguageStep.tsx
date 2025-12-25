import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/useLocale';

interface LanguageStepProps {
    onNext: (language: string) => void;
}

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export default function LanguageStep({ onNext }: LanguageStepProps) {
    const { t } = useTranslation();
    const { locale, setLocale } = useLocale();

    const handleSelect = (langCode: string) => {
        setLocale(langCode);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('onboarding.welcome_title')}</Text>
                    <Text style={styles.subtitle}>
                        {t('onboarding.welcome_subtitle')}
                    </Text>
                </View>

                <View style={styles.list}>
                    {LANGUAGES.map((lang) => (
                        <TouchableOpacity
                            key={lang.code}
                            style={[
                                styles.card,
                                locale === lang.code && styles.cardSelected
                            ]}
                            onPress={() => handleSelect(lang.code)}
                        >
                            <View style={styles.cardContent}>
                                <Text style={styles.flag}>{lang.flag}</Text>
                                <Text style={styles.langName}>{lang.name}</Text>
                            </View>
                            <View style={styles.radio}>
                                {locale === lang.code && (
                                    <View style={styles.radioInner} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onNext(locale)}
                >
                    <Text style={styles.buttonText}>{t('onboarding.get_started')}</Text>
                    <IconSymbol
                        ios_icon_name="arrow.right"
                        android_material_icon_name="arrow-forward"
                        size={20}
                        color={designSystem.colors.neutral[0]}
                    />
                </TouchableOpacity>
                <Text style={styles.terms}>
                    {t('onboarding.terms_privacy')}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: designSystem.colors.background.primary,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 120,
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
        borderRadius: 12,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        ...designSystem.shadows.sm,
    },
    cardSelected: {
        borderColor: designSystem.colors.primary[500],
        borderWidth: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    flag: {
        fontSize: 24,
    },
    langName: {
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
    buttonText: {
        ...designSystem.typography.title.medium,
        color: designSystem.colors.neutral[0],
        fontWeight: 'bold',
    },
    terms: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.tertiary,
        textAlign: 'center',
    }
});
