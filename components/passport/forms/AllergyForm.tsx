import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    useWindowDimensions
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    AllergyFormData,
    AllergySchema,
    AllergyType,
    AllergySeverity
} from '@/types/passport';
import FormField from '@/components/forms/FormField';
import FormSelect from '@/components/forms/FormSelect';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Button } from '@/components/design-system/primitives/Button';

interface AllergyFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: AllergyFormData) => Promise<void>;
    initialData?: Partial<AllergyFormData>;
}

const TYPE_OPTIONS = [
    { label: 'Food', value: AllergyType.FOOD },
    { label: 'Environment', value: AllergyType.ENVIRONMENT },
    { label: 'Medication', value: AllergyType.MEDICATION },
];

const SEVERITY_OPTIONS = [
    { label: 'Mild', value: AllergySeverity.MILD },
    { label: 'Moderate', value: AllergySeverity.MODERATE },
    { label: 'Severe', value: AllergySeverity.SEVERE },
];

export default function AllergyForm({
    visible,
    onClose,
    onSubmit,
    initialData
}: AllergyFormProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const [submitting, setSubmitting] = useState(false);

    const { control, handleSubmit, reset } = useForm<AllergyFormData>({
        resolver: zodResolver(AllergySchema),
        defaultValues: {
            type: AllergyType.FOOD,
            severity: AllergySeverity.MILD,
            ...initialData
        }
    });

    useEffect(() => {
        if (visible) {
            reset({
                type: AllergyType.FOOD,
                severity: AllergySeverity.MILD,
                ...initialData
            });
        }
    }, [visible, initialData, reset]);

    const onFormSubmit = async (data: AllergyFormData) => {
        try {
            setSubmitting(true);
            await onSubmit(data);
            onClose();
            reset();
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getModalWidth = () => {
        if (width < 640) return '95%';
        if (width < 1024) return 600;
        return 600;
    };

    const effectiveColors = isDark ? {
        background: designSystem.colors.background.secondary,
        text: designSystem.colors.text.primary,
        border: designSystem.colors.neutral[700],
    } : {
        background: designSystem.colors.background.primary,
        text: designSystem.colors.text.primary,
        border: designSystem.colors.neutral[200],
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoid}
            >
                <View style={styles.overlay}>
                    <View style={[
                        styles.modalContainer,
                        { width: getModalWidth(), backgroundColor: effectiveColors.background }
                    ]}>
                        {/* Header */}
                        <View style={[styles.header, { borderBottomColor: effectiveColors.border }]}>
                            <View style={styles.headerContent}>
                                <IconSymbol
                                    ios_icon_name="exclamationmark.triangle"
                                    android_material_icon_name="warning"
                                    size={24}
                                    color={designSystem.colors.status.warning[500] as any}
                                    style={styles.headerIcon}
                                />
                                <Text style={[styles.title, { color: effectiveColors.text }]}>
                                    {initialData ? 'Edit Allergy' : 'Add Allergy'}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <IconSymbol
                                    ios_icon_name="xmark"
                                    android_material_icon_name="close"
                                    size={24}
                                    color={effectiveColors.text}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <FormSelect<AllergyFormData>
                                control={control}
                                name="type"
                                label="Allergy Type"
                                options={TYPE_OPTIONS}
                                required
                            />

                            <FormField<AllergyFormData>
                                control={control}
                                name="allergen"
                                label="Allergen"
                                placeholder="e.g. Chicken, Pollen, Penicillin"
                                required
                            />

                            <FormSelect<AllergyFormData>
                                control={control}
                                name="severity"
                                label="Severity"
                                options={SEVERITY_OPTIONS}
                                required
                            />

                            <FormField<AllergyFormData>
                                control={control}
                                name="reactionDescription"
                                label="Reaction Details"
                                placeholder="Describe what happens..."
                                multiline
                                rows={3}
                            />

                            <FormField<AllergyFormData>
                                control={control}
                                name="notes"
                                label="Notes"
                                placeholder="Treatment, avoidance strategy..."
                                multiline
                                rows={2}
                            />

                            {/* Spacer for bottom CTA */}
                            <View style={{ height: 100 }} />
                        </ScrollView>

                        {/* Footer */}
                        <View style={{ padding: 20 }}>
                            <Button
                                title={initialData ? 'Update Allergy' : 'Add Allergy'}
                                onPress={handleSubmit(onFormSubmit)}
                                loading={submitting}
                                fullWidth
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    keyboardAvoid: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        borderRadius: 16,
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
});
