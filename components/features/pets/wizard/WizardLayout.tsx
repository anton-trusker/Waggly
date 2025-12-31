import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useLocale } from '@/hooks/useLocale';

interface WizardLayoutProps {
    children: React.ReactNode;
    currentStep: number;
    totalSteps: number;
    title: string;
    onBack: () => void;
    onCancel?: () => void;
}

export default function WizardLayout({
    children,
    currentStep,
    totalSteps,
    title,
    onBack,
    onCancel,
}: WizardLayoutProps) {
    const navigation = useNavigation();
    const { colors } = useAppTheme();
    const { t } = useLocale();

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigation.goBack();
        }
    };

    const dynamicStyles = {
        container: { backgroundColor: colors.background.primary },
        headerTitle: { color: colors.text.primary },
        stepIndicator: { color: colors.text.secondary },
        progressChunk: { backgroundColor: colors.neutral[200] },
    };

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={onBack}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <IconSymbol
                        ios_icon_name="chevron.left"
                        android_material_icon_name="arrow-back"
                        size={24}
                        color={colors.text.primary}
                    />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>{title}</Text>

                <TouchableOpacity
                    onPress={handleCancel}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.cancelButton}>{t('add_pet.wizard.cancel')}</Text>
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    {Array.from({ length: totalSteps }).map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.progressChunk,
                                dynamicStyles.progressChunk,
                                index < currentStep && styles.progressChunkActive,
                                index === currentStep - 1 && styles.progressChunkCurrent,
                            ]}
                        />
                    ))}
                </View>
                <Text style={[styles.stepIndicator, dynamicStyles.stepIndicator]}>
                    {t('add_pet.wizard.step_indicator', { current: currentStep, total: totalSteps })}
                </Text>
            </View>

            {/* Content */}
            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {children}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: designSystem.colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: Platform.OS === 'android' ? 20 : 0,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        ...(designSystem.typography.title.medium as any),
        color: designSystem.colors.text.primary,
        opacity: 0, // Hidden initially as per design, but keeping structure
    },
    cancelButton: {
        ...(designSystem.typography.label.large as any),
        color: designSystem.colors.primary[500], // Using primary color for action
        fontWeight: '600',
    },
    progressContainer: {
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    progressBar: {
        flexDirection: 'row',
        height: 6,
        gap: 8,
        width: '100%',
    },
    progressChunk: {
        flex: 1,
        backgroundColor: designSystem.colors.neutral[200],
        borderRadius: 999,
    },
    progressChunkActive: {
        backgroundColor: designSystem.colors.primary[500],
    },
    progressChunkCurrent: {
        backgroundColor: designSystem.colors.primary[500],
        shadowColor: designSystem.colors.primary[500],
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 3,
    },
    stepIndicator: {
        textAlign: 'center',
        marginTop: 12,
        ...(designSystem.typography.label.small as any),
        color: designSystem.colors.text.secondary,
        letterSpacing: 1.5,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
});
