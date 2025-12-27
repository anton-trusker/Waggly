import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface SelectOption {
    label: string;
    value: string;
}

interface FormSelectProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    required?: boolean;
    options: SelectOption[];
}

export default function FormSelect<T extends FieldValues>({
    control,
    name,
    label,
    placeholder = 'Select an option',
    required = false,
    options,
}: FormSelectProps<T>) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const [showModal, setShowModal] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
                const selectedOption = options.find(opt => opt.value === value);

                return (
                    <View style={styles.container}>
                        {/* Label */}
                        <View style={styles.labelContainer}>
                            <Text style={[styles.label, isDark && styles.labelDark]}>
                                {label}
                                {required && <Text style={styles.required}> *</Text>}
                            </Text>
                        </View>

                        {/* Select Button */}
                        <TouchableOpacity
                            style={[
                                styles.button,
                                isDark && styles.buttonDark,
                                error && styles.buttonError,
                            ]}
                            onPress={() => setShowModal(true)}
                        >
                            <Text style={[
                                styles.buttonText,
                                isDark && styles.buttonTextDark,
                                !selectedOption && styles.placeholder,
                            ]}>
                                {selectedOption?.label || placeholder}
                            </Text>
                            <IconSymbol
                                ios_icon_name="chevron.down"
                                android_material_icon_name="arrow-drop-down"
                                size={20}
                                color={designSystem.colors.text.secondary}
                            />
                        </TouchableOpacity>

                        {/* Error Message */}
                        {error && (
                            <Text style={styles.errorText}>{error.message}</Text>
                        )}

                        {/* Options Modal */}
                        <Modal
                            visible={showModal}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setShowModal(false)}
                        >
                            <TouchableOpacity
                                style={styles.modalOverlay}
                                activeOpacity={1}
                                onPress={() => setShowModal(false)}
                            >
                                <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
                                    <View style={styles.modalHeader}>
                                        <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
                                            {label}
                                        </Text>
                                        <TouchableOpacity onPress={() => setShowModal(false)}>
                                            <IconSymbol
                                                ios_icon_name="xmark"
                                                android_material_icon_name="close"
                                                size={24}
                                                color={designSystem.colors.text.secondary}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <FlatList
                                        data={options}
                                        keyExtractor={(item) => item.value}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={[
                                                    styles.option,
                                                    item.value === value && styles.optionSelected,
                                                ]}
                                                onPress={() => {
                                                    onChange(item.value);
                                                    setShowModal(false);
                                                }}
                                            >
                                                <Text style={[
                                                    styles.optionText,
                                                    isDark && styles.optionTextDark,
                                                    item.value === value && styles.optionTextSelected,
                                                ]}>
                                                    {item.label}
                                                </Text>
                                                {item.value === value && (
                                                    <IconSymbol
                                                        ios_icon_name="checkmark"
                                                        android_material_icon_name="check"
                                                        size={20}
                                                        color={designSystem.colors.primary[500]}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </View>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: designSystem.spacing[4],
    },
    labelContainer: {
        marginBottom: designSystem.spacing[2],
    },
    label: {
        ...designSystem.typography.label.medium,
        color: designSystem.colors.text.secondary,
        fontWeight: '600',
    },
    labelDark: {
        color: designSystem.colors.text.secondary,
    },
    required: {
        color: designSystem.colors.status.error[500],
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: designSystem.borderRadius.md,
        paddingHorizontal: designSystem.spacing[4],
        paddingVertical: designSystem.spacing[3],
        minHeight: 48,
    },
    buttonDark: {
        backgroundColor: designSystem.colors.background.primary,
        borderColor: designSystem.colors.neutral[700],
    },
    buttonError: {
        borderColor: designSystem.colors.status.error[500],
    },
    buttonText: {
        ...designSystem.typography.body.large,
        color: designSystem.colors.text.primary,
        flex: 1,
    },
    buttonTextDark: {
        color: designSystem.colors.text.primary,
    },
    placeholder: {
        color: designSystem.colors.text.tertiary,
    },
    errorText: {
        ...designSystem.typography.body.small,
        color: designSystem.colors.status.error[500],
        marginTop: designSystem.spacing[1],
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: designSystem.spacing[6],
    },
    modalContent: {
        backgroundColor: designSystem.colors.neutral[0],
        borderRadius: designSystem.borderRadius.lg,
        width: '100%',
        maxHeight: '70%',
        overflow: 'hidden',
    },
    modalContentDark: {
        backgroundColor: designSystem.colors.background.secondary,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: designSystem.spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[200],
    },
    modalTitle: {
        ...designSystem.typography.title.medium,
        color: designSystem.colors.text.primary,
    },
    modalTitleDark: {
        color: designSystem.colors.text.primary,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: designSystem.spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: designSystem.colors.neutral[100],
    },
    optionSelected: {
        backgroundColor: designSystem.colors.primary[50],
    },
    optionText: {
        ...designSystem.typography.body.large,
        color: designSystem.colors.text.primary,
        flex: 1,
    },
    optionTextDark: {
        color: designSystem.colors.text.primary,
    },
    optionTextSelected: {
        color: designSystem.colors.primary[600],
        fontWeight: '600',
    },
});
