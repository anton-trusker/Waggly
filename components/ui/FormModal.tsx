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
    useWindowDimensions,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { designSystem } from '@/constants/designSystem'; // Added
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
    forceLight?: boolean;
    headerRight?: ReactNode;
    hideFooter?: boolean; // Added
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
    forceLight = false,
    headerRight,
    hideFooter = false, // Default to showing footer
}: FormModalProps<T>) {
    const { width } = useWindowDimensions();

    // Determine effective colors
    const effectiveColors = forceLight ? {
        background: designSystem.colors.background.primary,
        text: designSystem.colors.text.primary,
        textSecondary: designSystem.colors.text.secondary,
        border: designSystem.colors.border.secondary,
        primary: designSystem.colors.primary[500],
    } : colors;

    const [formData, setFormData] = useState<T>((initialData || {}) as T);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Sync formData with initialData when it changes or modal opens
    React.useEffect(() => {
        if (visible && initialData) {
            setFormData(initialData as T);
            setErrors({});
        }
    }, [visible, initialData]);

    // Responsive modal width
    const getModalWidth = () => {
        if (width < 640) return '95%'; // Mobile
        if (width < 1024) return 600; // Tablet
        return 700; // Desktop
    };

    // Responsive padding
    const getContentPadding = () => {
        if (width < 640) return 16; // Mobile
        if (width < 1024) return 24; // Tablet
        return 32; // Desktop
    };

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
            if (typeof onSubmit !== 'function') {
                console.warn('FormModal: onSubmit prop is missing or not a function');
                return;
            }
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
                    <View style={[styles.modalContainer, { width: getModalWidth(), maxWidth: getModalWidth(), backgroundColor: effectiveColors.background }]}>
                        {/* Header */}
                        <View style={[styles.header, { paddingHorizontal: getContentPadding(), paddingVertical: width < 640 ? 16 : 20, borderBottomColor: effectiveColors.border }]}>
                            <View style={styles.headerContent}>
                                {headerIcon && (
                                    <IconSymbol
                                        ios_icon_name={headerIcon}
                                        android_material_icon_name={headerIcon}
                                        size={24}
                                        color={effectiveColors.primary}
                                        style={styles.headerIcon}
                                    />
                                )}
                                <View style={styles.headerText}>
                                    <Text style={[styles.title, { color: effectiveColors.text }]} className="text-base sm:text-lg">
                                        {title}
                                    </Text>
                                    {subtitle && (
                                        <Text style={[styles.subtitle, { color: effectiveColors.textSecondary }]}>{subtitle}</Text>
                                    )}
                                </View>
                            </View>

                            {headerRight && (
                                <View style={{ marginLeft: 12 }}>
                                    {headerRight}
                                </View>
                            )}

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
                                    color={effectiveColors.text}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={[styles.scrollContent, { paddingHorizontal: getContentPadding(), paddingTop: getContentPadding() }]}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {children(formState)}

                            {/* Spacer for bottom button if footer is shown */}
                            {!hideFooter && <View style={{ height: 100 }} />}
                        </ScrollView>

                        {/* Bottom CTA */}
                        {!hideFooter && (
                            <BottomCTA
                                onBack={showBackButton ? onClose : undefined}
                                onPrimary={handleSubmit}
                                primaryLabel={submitLabel}
                                disabled={loading}
                                bottomOffset={Platform.OS === 'ios' ? 0 : 20}
                            />
                        )}

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
