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
    EmergencyContactFormData,
    EmergencyContactSchema,
    EmergencyContactType
} from '@/types/passport';
import FormField from '@/components/forms/FormField';
import FormSelect from '@/components/forms/FormSelect';
import BottomCTA from '@/components/ui/BottomCTA';
import { IconSymbol } from '@/components/ui/IconSymbol';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import AddressAutocomplete from '@/components/ui/AddressAutocomplete';

interface EmergencyContactFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: EmergencyContactFormData) => Promise<void>;
    initialData?: Partial<EmergencyContactFormData>;
}

const TYPE_OPTIONS = [
    { label: 'Owner', value: EmergencyContactType.OWNER },
    { label: 'Alternate Contact', value: EmergencyContactType.ALTERNATE },
    { label: 'Veterinarian', value: EmergencyContactType.VETERINARIAN },
    { label: 'Emergency Vet', value: EmergencyContactType.EMERGENCY_VET },
];

export default function EmergencyContactForm({
    visible,
    onClose,
    onSubmit,
    initialData
}: EmergencyContactFormProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const [submitting, setSubmitting] = useState(false);

    const { control, handleSubmit, reset } = useForm<EmergencyContactFormData>({
        resolver: zodResolver(EmergencyContactSchema),
        defaultValues: {
            contactType: EmergencyContactType.ALTERNATE,
            isPrimary: false,
            ...initialData
        }
    });

    useEffect(() => {
        if (visible) {
            reset({
                contactType: EmergencyContactType.ALTERNATE,
                isPrimary: false,
                ...initialData
            });
        }
    }, [visible, initialData, reset]);

    const onFormSubmit = async (data: EmergencyContactFormData) => {
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
                                    ios_icon_name="phone.fill"
                                    android_material_icon_name="phone"
                                    size={24}
                                    color={designSystem.colors.primary[500] as any}
                                    style={styles.headerIcon}
                                />
                                <Text style={[styles.title, { color: effectiveColors.text }]}>
                                    {initialData ? 'Edit Contact' : 'Add Emergency Contact'}
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
                            <FormSelect
                                control={control}
                                name="contactType"
                                label="Contact Type"
                                options={TYPE_OPTIONS}
                                required
                            />

                            <FormField
                                control={control}
                                name="name"
                                label="Name / Clinic Name"
                                placeholder="e.g. John Doe or City Vet Clinic"
                                required
                            />

                            <FormField
                                control={control}
                                name="relationship"
                                label="Relationship"
                                placeholder="e.g. Neighbor, Sitter"
                            />

                            <FormField
                                control={control}
                                name="phone"
                                label="Phone Number"
                                placeholder="(555) 123-4567"
                                required
                                keyboardType="phone-pad"
                            />

                            <FormField
                                control={control}
                                name="email"
                                label="Email"
                                placeholder="email@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <Controller
                                control={control}
                                name="address"
                                render={({ field: { onChange, value } }) => (
                                    <AddressAutocomplete
                                        label="Address"
                                        placeholder="Enter full address"
                                        initialValue={value}
                                        onSelect={(details) => onChange(details.formattedAddress)}
                                    />
                                )}
                            />

                            {/* Is Primary Switch */}
                            <Controller
                                control={control}
                                name="isPrimary"
                                render={({ field: { onChange, value } }) => (
                                    <View style={styles.switchContainer}>
                                        <Text style={[styles.switchLabel, { color: effectiveColors.text }]}>
                                            Primary Contact
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
                        </ScrollView>

                        {/* Footer */}
                        <BottomCTA
                            onPrimary={handleSubmit(onFormSubmit)}
                            primaryLabel={initialData ? 'Update Contact' : 'Add Contact'}
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
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingVertical: 8,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
});
