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
    Switch,
    useWindowDimensions
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    TreatmentFormData,
    TreatmentSchema,
    TreatmentCategory
} from '@/types/passport';
import FormField from '@/components/forms/FormField';
import FormSelect from '@/components/forms/FormSelect';
import FormDatePicker from '@/components/forms/FormDatePicker';
import BottomCTA from '@/components/ui/BottomCTA';
import { IconSymbol } from '@/components/ui/IconSymbol';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';

interface MedicationFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: TreatmentFormData) => Promise<void>;
    initialData?: Partial<TreatmentFormData>;
}

const CATEGORY_OPTIONS = [
    { label: 'Preventive (e.g. Flea/Tick)', value: TreatmentCategory.PREVENTIVE },
    { label: 'Acute (e.g. Antibiotics)', value: TreatmentCategory.ACUTE },
    { label: 'Chronic (e.g. Heart meds)', value: TreatmentCategory.CHRONIC },
];

export default function MedicationForm({
    visible,
    onClose,
    onSubmit,
    initialData
}: MedicationFormProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const [submitting, setSubmitting] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<TreatmentFormData>({
        resolver: zodResolver(TreatmentSchema),
        defaultValues: {
            category: TreatmentCategory.ACUTE,
            startDate: new Date(),
            withFood: false,
            ...initialData
        }
    });

    useEffect(() => {
        if (visible) {
            reset({
                category: TreatmentCategory.ACUTE,
                startDate: new Date(),
                withFood: false,
                ...initialData
            });
        }
    }, [visible, initialData, reset]);

    const onFormSubmit = async (data: TreatmentFormData) => {
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
                                    ios_icon_name="pills"
                                    android_material_icon_name="medication"
                                    size={24}
                                    color={designSystem.colors.primary[500]}
                                    style={styles.headerIcon}
                                />
                                <Text style={[styles.title, { color: effectiveColors.text }]}>
                                    {initialData ? 'Edit Medication' : 'Add Medication'}
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
                            <FormField
                                control={control}
                                name="treatmentName"
                                label="Medication Name"
                                placeholder="e.g. Amoxicillin, Heartgard"
                                required
                            />

                            <FormSelect
                                control={control}
                                name="category"
                                label="Category"
                                options={CATEGORY_OPTIONS}
                                required
                            />

                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <FormDatePicker
                                        control={control}
                                        name="startDate"
                                        label="Start Date"
                                        required
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <FormDatePicker
                                        control={control}
                                        name="endDate"
                                        label="End Date"
                                        placeholder="Ongoing if empty"
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <FormField
                                        control={control}
                                        name="dosage"
                                        label="Dosage"
                                        placeholder="e.g. 50mg"
                                        required
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <FormField
                                        control={control}
                                        name="frequency"
                                        label="Frequency"
                                        placeholder="e.g. Twice daily"
                                        required
                                    />
                                </View>
                            </View>

                            <FormField
                                control={control}
                                name="timeOfDay"
                                label="Time of Day"
                                placeholder="e.g. Morning with breakfast"
                            />

                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <FormField
                                        control={control}
                                        name="prescribedBy"
                                        label="Prescribed By"
                                        placeholder="Dr. Name"
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <Controller
                                        control={control}
                                        name="pharmacy"
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <LocationAutocomplete
                                                label="Pharmacy"
                                                placeholder="Search pharmacy..."
                                                value={value}
                                                onChangeText={onChange}
                                                onPlaceSelected={(details) => onChange(details.name)}
                                                error={error?.message}
                                            />
                                        )}
                                    />
                                </View>
                            </View>

                            {/* With Food Switch */}
                            <Controller
                                control={control}
                                name="withFood"
                                render={({ field: { onChange, value } }) => (
                                    <View style={styles.switchContainer}>
                                        <Text style={[styles.switchLabel, { color: effectiveColors.text }]}>
                                            Give with Food
                                        </Text>
                                        <Switch
                                            value={value}
                                            onValueChange={onChange}
                                            trackColor={{ false: designSystem.colors.neutral[200], true: designSystem.colors.primary[500] }}
                                            thumbColor="#ffffff"
                                            ios_backgroundColor={designSystem.colors.neutral[200]}
                                        />
                                    </View>
                                )}
                            />

                            <FormField
                                control={control}
                                name="notes"
                                label="Notes"
                                placeholder="Side effects, special instructions..."
                                multiline
                                rows={3}
                            />

                            <View style={{ height: 100 }} />
                        </ScrollView>

                        {/* Footer */}
                        <BottomCTA
                            onPrimary={handleSubmit(onFormSubmit)}
                            primaryLabel={initialData ? 'Update Medication' : 'Add Medication'}
                            disabled={submitting}
                        />

                        <LoadingOverlay visible={submitting} message={initialData ? 'Updating...' : 'Adding...'} />
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
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 8,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
});
