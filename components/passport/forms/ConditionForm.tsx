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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ConditionFormData,
    ConditionSchema,
} from '@/types/passport';
import FormField from '@/components/forms/FormField';
import FormSelect from '@/components/forms/FormSelect';
import FormDatePicker from '@/components/forms/FormDatePicker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Button } from '@/components/design-system/primitives/Button';

interface ConditionFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: ConditionFormData) => Promise<void>;
    initialData?: Partial<ConditionFormData>;
}

const STATUS_OPTIONS = [
    { label: 'Active', value: 'Active' },
    { label: 'Chronic', value: 'Chronic' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Watch', value: 'Watch' },
];

export default function ConditionForm({
    visible,
    onClose,
    onSubmit,
    initialData
}: ConditionFormProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const [submitting, setSubmitting] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<ConditionFormData>({
        resolver: zodResolver(ConditionSchema),
        defaultValues: {
            status: 'Active',
            diagnosedDate: new Date(),
            ...initialData
        }
    });

    // Reset form when modal opens or initialData changes
    useEffect(() => {
        if (visible) {
            reset({
                status: 'Active',
                diagnosedDate: new Date(),
                ...initialData
            });
        }
    }, [visible, initialData, reset]);

    const onFormSubmit = async (data: ConditionFormData) => {
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

    // Responsive styles
    const getModalWidth = () => {
        if (width < 640) return '95%'; // Mobile
        if (width < 1024) return '70%'; // Tablet
        return '50%'; // Desktop
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={[
                    styles.modalContent,
                    {
                        backgroundColor: isDark ? designSystem.colors.background.secondary : '#ffffff',
                        width: getModalWidth(),
                        borderColor: isDark ? designSystem.colors.border.primary : 'transparent',
                        borderWidth: isDark ? 1 : 0,
                    }
                ]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.titleRow}>
                            <View style={[styles.iconContainer, { backgroundColor: designSystem.colors.primary[100] }]}>
                                <IconSymbol name="bandage.fill" size={24} color={designSystem.colors.primary[500]} />
                            </View>
                            <View>
                                <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                                    {initialData ? 'Edit Condition' : 'Add Medical Condition'}
                                </Text>
                                <Text style={styles.subtitle}>
                                    Record chronic or acute medical conditions
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <IconSymbol name="xmark" size={20} color={designSystem.colors.text.secondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.formContent}>
                        <FormField
                            control={control}
                            name="conditionName"
                            label="Condition Name"
                            placeholder="e.g. Arthritis, Diabetes"
                            error={errors.conditionName?.message}
                            required
                        />

                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <FormSelect
                                    control={control}
                                    name="status"
                                    label="Status"
                                    options={STATUS_OPTIONS}
                                    required
                                />
                            </View>
                            <View style={styles.halfWidth}>
                                <FormDatePicker
                                    control={control}
                                    name="diagnosedDate"
                                    label="Date Diagnosed"
                                />
                            </View>
                        </View>

                        <FormField
                            control={control}
                            name="notes"
                            label="Notes / Treatment Plan"
                            placeholder="Add any additional details..."
                            multiline
                            numberOfLines={4}
                        />
                    </ScrollView>

                    {/* Footer */}
                    <View style={[styles.footer, { borderTopColor: designSystem.colors.border.primary }]}>
                        <Button
                            title={initialData ? "Update Condition" : "Add Condition"}
                            onPress={handleSubmit(onFormSubmit)}
                            loading={submitting}
                            fullWidth
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 24,
        maxHeight: '90%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 24,
        paddingBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        gap: 16,
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
    },
    closeButton: {
        padding: 8,
        marginRight: -8,
        marginTop: -8,
    },
    scrollView: {
        maxHeight: 500,
    },
    formContent: {
        padding: 24,
        paddingTop: 0,
        gap: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    halfWidth: {
        flex: 1,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
    },
});
