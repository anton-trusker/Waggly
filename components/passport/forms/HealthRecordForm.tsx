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
    HealthRecordFormData,
    HealthRecordSchema
} from '@/types/passport';
import FormField from '@/components/forms/FormField';
import FormSelect from '@/components/forms/FormSelect';
import FormDatePicker from '@/components/forms/FormDatePicker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Button } from '@/components/design-system/primitives/Button';

interface HealthRecordFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: HealthRecordFormData) => Promise<void>;
    initialData?: Partial<HealthRecordFormData>;
}

const ACTIVITY_OPTIONS = [
    { label: 'Low', value: 'Low' },
    { label: 'Normal', value: 'Normal' },
    { label: 'High', value: 'High' },
];

const APPETITE_OPTIONS = [
    { label: 'Reduced', value: 'Reduced' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Increased', value: 'Increased' },
];

const ENERGY_OPTIONS = [
    { label: 'Lethargic', value: 'Lethargic' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Hyper', value: 'Hyper' },
];

const STOOL_OPTIONS = [
    { label: 'Loose', value: 'Loose' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Hard', value: 'Hard' },
];

const COAT_OPTIONS = [
    { label: 'Dull', value: 'Dull' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Shiny', value: 'Shiny' },
    { label: 'Matting', value: 'Matting' },
];

export default function HealthRecordForm({
    visible,
    onClose,
    onSubmit,
    initialData
}: HealthRecordFormProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const [submitting, setSubmitting] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<HealthRecordFormData>({
        resolver: zodResolver(HealthRecordSchema),
        defaultValues: {
            date: new Date(),
            weightUnit: 'kg',
            temperatureUnit: 'C',
            ...initialData
        }
    });

    useEffect(() => {
        if (visible) {
            reset({
                date: new Date(),
                weightUnit: 'kg',
                temperatureUnit: 'C',
                ...initialData
            });
        }
    }, [visible, initialData, reset]);

    const onFormSubmit = async (data: HealthRecordFormData) => {
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
        return 700;
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
                                    ios_icon_name="heart.text.square"
                                    android_material_icon_name="health-and-safety"
                                    size={24}
                                    color={designSystem.colors.primary[500] as any}
                                    style={styles.headerIcon}
                                />
                                <Text style={[styles.title, { color: effectiveColors.text }]}>
                                    {initialData ? 'Edit Health Record' : 'Add Health Record'}
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
                            <Text style={styles.sectionTitle}>General Info</Text>
                            <FormDatePicker<HealthRecordFormData>
                                control={control}
                                name="date"
                                label="Measurement Date"
                                required
                            />

                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <FormField<HealthRecordFormData>
                                        control={control}
                                        name="weight"
                                        label="Weight"
                                        placeholder="0.0"
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <FormSelect<HealthRecordFormData>
                                        control={control}
                                        name="weightUnit"
                                        label="Unit"
                                        options={[{ label: 'kg', value: 'kg' }, { label: 'lb', value: 'lb' }] as any}
                                    />
                                </View>
                            </View>

                            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Vital Signs</Text>
                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <FormField<HealthRecordFormData>
                                        control={control}
                                        name="temperature"
                                        label="Temperature"
                                        placeholder="--"
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <FormSelect<HealthRecordFormData>
                                        control={control}
                                        name="temperatureUnit"
                                        label="Unit"
                                        options={[{ label: '°C', value: 'C' }, { label: '°F', value: 'F' }] as any}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <FormField<HealthRecordFormData>
                                        control={control}
                                        name="heartRate"
                                        label="Heart Rate"
                                        placeholder="bpm"
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <FormField<HealthRecordFormData>
                                        control={control}
                                        name="respiratoryRate"
                                        label="Resp Rate"
                                        placeholder="br/m"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <FormField<HealthRecordFormData>
                                control={control}
                                name="bodyConditionScore"
                                label="BCS (1-9)"
                                placeholder="e.g. 5"
                                keyboardType="numeric"
                            />

                            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Wellness Indicators</Text>
                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <FormSelect<HealthRecordFormData>
                                        control={control}
                                        name="activityLevel"
                                        label="Activity"
                                        options={ACTIVITY_OPTIONS}
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <FormSelect<HealthRecordFormData>
                                        control={control}
                                        name="energyLevel"
                                        label="Energy"
                                        options={ENERGY_OPTIONS}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <FormSelect<HealthRecordFormData>
                                        control={control}
                                        name="appetiteLevel"
                                        label="Appetite"
                                        options={APPETITE_OPTIONS}
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <FormSelect<HealthRecordFormData>
                                        control={control}
                                        name="coatCondition"
                                        label="Coat"
                                        options={COAT_OPTIONS}
                                    />
                                </View>
                            </View>

                            <FormSelect<HealthRecordFormData>
                                control={control}
                                name="stoolQuality"
                                label="Stool Quality"
                                options={STOOL_OPTIONS}
                            />

                            <FormField<HealthRecordFormData>
                                control={control}
                                name="notes"
                                label="Notes"
                                placeholder="Observations..."
                                multiline
                                rows={3}
                            />

                            <View style={{ height: 100 }} />
                        </ScrollView>

                        {/* Footer */}
                        <View style={{ padding: 20 }}>
                            <Button
                                title={initialData ? 'Update Record' : 'Save Record'}
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
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 16,
        maxHeight: '90%',
        shadowColor: '#000',
        ...Platform.select({
            ios: {
                shadowOpacity: 0.25,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 10 },
            },
            android: {
                elevation: 10,
            },
            web: {
                boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
            }
        }),
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[200],
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
        color: designSystem.colors.text.primary,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: designSystem.colors.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
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
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    halfWidth: {
        flex: 1,
    },
});
