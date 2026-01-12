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
    VaccinationFormData,
    VaccinationSchema,
    VaccineCategory,
    AdministrationRoute
} from '@/types/passport';
import FormField from '@/components/forms/FormField';
import FormSelect from '@/components/forms/FormSelect';
import FormDatePicker from '@/components/forms/FormDatePicker';
import { IconSymbol } from '@/components/ui/IconSymbol';
// import LoadingOverlay from '@/components/ui/LoadingOverlay'; // Removed
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';
import { Button } from '@/components/design-system/primitives/Button';

interface VaccinationFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: VaccinationFormData) => Promise<void>;
    initialData?: Partial<VaccinationFormData>;
}

const CATEGORY_OPTIONS = [
    { label: 'Core', value: VaccineCategory.CORE },
    { label: 'Non-Core', value: VaccineCategory.NON_CORE },
];

const ROUTE_OPTIONS = [
    { label: 'Subcutaneous (SQ)', value: AdministrationRoute.SUBCUTANEOUS },
    { label: 'Intramuscular (IM)', value: AdministrationRoute.INTRAMUSCULAR },
    { label: 'Intranasal (IN)', value: AdministrationRoute.INTRANASAL },
    { label: 'Oral', value: AdministrationRoute.ORAL },
];

export default function VaccinationForm({
    visible,
    onClose,
    onSubmit,
    initialData
}: VaccinationFormProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const [submitting, setSubmitting] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<VaccinationFormData>({
        resolver: zodResolver(VaccinationSchema),
        defaultValues: {
            category: VaccineCategory.CORE,
            requiredForTravel: false,
            dateGiven: new Date(),
            ...initialData
        }
    });

    // Reset form when modal opens or initialData changes
    useEffect(() => {
        if (visible) {
            reset({
                category: VaccineCategory.CORE,
                requiredForTravel: false,
                dateGiven: new Date(),
                ...initialData
            });
        }
    }, [visible, initialData, reset]);

    const onFormSubmit = async (data: VaccinationFormData) => {
        try {
            setSubmitting(true);
            await onSubmit(data);
            onClose();
            reset(); // Reset after successful submit
        } catch (error) {
            console.error('Submission error:', error);
            // Error handling usually done by parent or toast
        } finally {
            setSubmitting(false);
        }
    };

    // Responsive styles
    const getModalWidth = () => {
        if (width < 640) return '95%'; // Mobile
        if (width < 1024) return 600; // Tablet
        return 700; // Desktop
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
                                    ios_icon_name="syringe"
                                    android_material_icon_name="vaccines"
                                    size={24}
                                    color={designSystem.colors.primary[500] as any}
                                    style={styles.headerIcon}
                                />
                                <Text style={[styles.title, { color: effectiveColors.text }]}>
                                    {initialData ? 'Edit Vaccination' : 'Add Vaccination'}
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
                                name="vaccineName"
                                label="Vaccine Name"
                                placeholder="e.g. Rabies, DHPP"
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
                                        name="dateGiven"
                                        label="Date Given"
                                        required
                                        maxDate={new Date()}
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <FormDatePicker
                                        control={control}
                                        name="nextDueDate"
                                        label="Next Due Date"
                                        minDate={new Date()}
                                    />
                                </View>
                            </View>

                            <FormField
                                control={control}
                                name="administeringVet"
                                label="Veterinarian"
                                placeholder="e.g. Dr. Smith"
                            />

                            <Controller
                                control={control}
                                name="clinic"
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <LocationAutocomplete
                                        label="Clinic"
                                        placeholder="Search clinic address..."
                                        value={value}
                                        onChangeText={onChange}
                                        onPlaceSelected={(details) => onChange(details.name)}
                                        error={error?.message}
                                    />
                                )}
                            />

                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <FormField
                                        control={control}
                                        name="manufacturer"
                                        label="Manufacturer"
                                        placeholder="Optional"
                                    />
                                </View>
                                <View style={styles.halfWidth}>
                                    <FormField
                                        control={control}
                                        name="lotNumber"
                                        label="Lot Number"
                                        placeholder="Optional"
                                    />
                                </View>
                            </View>

                            <FormSelect
                                control={control}
                                name="route"
                                label="Administration Route"
                                options={ROUTE_OPTIONS}
                                placeholder="Optional"
                            />

                            {/* Required For Travel Switch */}
                            <Controller
                                control={control}
                                name="requiredForTravel"
                                render={({ field: { onChange, value } }) => (
                                    <View style={styles.switchContainer}>
                                        <Text style={[styles.switchLabel, { color: effectiveColors.text }]}>
                                            Required for Travel
                                        </Text>
                                        <Switch
                                            value={value}
                                            onValueChange={onChange}
                                            trackColor={{ false: designSystem.colors.neutral[200], true: designSystem.colors.primary[500] }}
                                            thumbColor="#ffffff"
                                            ios_backgroundColor={designSystem.colors.neutral[200] as any}
                                        />
                                    </View>
                                )}
                            />

                            <FormField
                                control={control}
                                name="notes"
                                label="Notes"
                                placeholder="Any additional details..."
                                multiline
                                rows={3}
                            />

                            {/* Spacer for bottom CTA */}
                            <View style={{ height: 100 }} />
                        </ScrollView>

                        <View style={styles.footer}>
                            <Button
                                title={initialData ? 'Update Vaccination' : 'Add Vaccination'}
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
