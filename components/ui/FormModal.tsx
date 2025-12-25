import React, { ReactNode, useState, useCallback } from 'react';
import {
    View,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/ui/IconSymbol';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import BottomCTA from '@/components/ui/BottomCTA';

export interface FormModalProps<T = any> {
    visible: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    initialData?: Partial<T>;
    onSubmit: (data: T) => Promise<void>;
    onSuccess?: () => void;
    validate?: (data: T) => Record<string, string> | null;
    children: (formState: FormState<T>) => ReactNode;
    successMessage?: string;
    errorMessage?: string;
    submitLabel?: string;
    showBackButton?: boolean;
    headerIcon?: string;
}

export interface FormState<T> {
    data: T;
    errors: Record<string, string>;
    updateField: (field: keyof T, value: any) => void;
    updateFields: (fields: Partial<T>) => void;
    setError: (field: string, error: string) => void;
    clearError: (field: string) => void;
    reset: () => void;
}

export default function FormModal<T = any>({
    visible,
    onClose,
    title,
    subtitle,
    initialData,
    onSubmit,
    onSuccess,
    validate,
    children,
    successMessage = 'Saved successfully!',
    errorMessage = 'An error occurred. Please try again.',
    submitLabel = 'Save',
    showBackButton = true,
    headerIcon,
}: FormModalProps<T>) {
    const [formData, setFormData] = useState<T>((initialData || {}) as T);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Update single field
    const updateField = useCallback((field: keyof T, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when field is updated
        if (errors[field as string]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field as string];
                return newErrors;
            });
        }
    }, [errors]);

    // Update multiple fields
    const updateFields = useCallback((fields: Partial<T>) => {
        setFormData((prev) => ({
            ...prev,
            ...fields,
        }));
    }, []);

    // Set error for specific field
    const setError = useCallback((field: string, error: string) => {
        setErrors((prev) => ({
            ...prev,
            [field]: error,
        }));
    }, []);

    // Clear error for specific field
    const clearError = useCallback((field: string) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    // Reset form to initial state
    const reset = useCallback(() => {
        setFormData((initialData || {}) as T);
        setErrors({});
        setLoading(false);
    }, [initialData]);

    // Handle form submission
    const handleSubmit = useCallback(async () => {
        // Run validation if provided
        if (validate) {
            const validationErrors = validate(formData);
            if (validationErrors && Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                // Alert about first error
                const firstError = Object.values(validationErrors)[0];
                Alert.alert('Validation Error', firstError);
                return;
            }
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            Alert.alert('Success', successMessage);
            reset();
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Form submission error:', error);
            const message = error?.message || errorMessage;
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    }, [formData, validate, onSubmit, successMessage, errorMessage, reset, onSuccess, onClose]);

    // Form state object passed to children
    const formState: FormState<T> = {
        data: formData,
        errors,
        updateField,
        updateFields,
        setError,
        clearError,
        reset,
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
                    <View style={styles.modalContainer} className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl">
                        {/* Header */}
                        <View style={styles.header} className="px-4 sm:px-6 py-4 sm:py-5">
                            <View style={styles.headerContent}>
                                {headerIcon && (
                                    <IconSymbol
                                        ios_icon_name={headerIcon}
                                        android_material_icon_name={headerIcon}
                                        size={24}
                                        color={colors.primary}
                                        style={styles.headerIcon}
                                    />
                                )}
                                <View style={styles.headerText}>
                                    <Text style={styles.title} className="text-base sm:text-lg">
                                        {title}
                                    </Text>
                                    {subtitle && (
                                        <Text style={styles.subtitle}>{subtitle}</Text>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={onClose}
                                style={styles.closeButton}
                                accessibilityLabel="Close"
                                accessibilityRole="button"
                            >
                                <IconSymbol
                                    ios_icon_name="xmark"
                                    android_material_icon_name="close"
                                    size={24}
                                    color={colors.text}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            className="p-4 sm:p-5 md:p-6"
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {children(formState)}

                            {/* Spacer for bottom button */}
                            <View style={{ height: 100 }} />
                        </ScrollView>

                        {/* Bottom CTA */}
                        <BottomCTA
                            onBack={showBackButton ? onClose : undefined}
                            onPrimary={handleSubmit}
                            primaryLabel={submitLabel}
                            disabled={loading}
                            bottomOffset={Platform.OS === 'ios' ? 0 : 20}
                        />

                        {/* Loading Overlay */}
                        <LoadingOverlay visible={loading} message="Saving..." />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = {
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
        backgroundColor: colors.background,
        borderRadius: 16,
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
    },
    header: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerContent: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        flex: 1,
    },
    headerIcon: {
        marginRight: 12,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: colors.text,
    },
    subtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    closeButton: {
        padding: 8,
        marginLeft: 12,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
};
