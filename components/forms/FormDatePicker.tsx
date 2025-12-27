import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface FormDatePickerProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

export default function FormDatePicker<T extends FieldValues>({
    control,
    name,
    label,
    placeholder = 'Select date',
    required = false,
    minDate,
    maxDate,
}: FormDatePickerProps<T>) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const [showPicker, setShowPicker] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View style={styles.container}>
                    {/* Label */}
                    <View style={styles.labelContainer}>
                        <Text style={[styles.label, isDark && styles.labelDark]}>
                            {label}
                            {required && <Text style={styles.required}> *</Text>}
                        </Text>
                    </View>

                    {/* Date Display Button */}
                    <TouchableOpacity
                        style={[
                            styles.button,
                            isDark && styles.buttonDark,
                            error && styles.buttonError,
                        ]}
                        onPress={() => setShowPicker(true)}
                    >
                        <IconSymbol
                            ios_icon_name="calendar"
                            android_material_icon_name="event"
                            size={20}
                            color={designSystem.colors.text.secondary}
                            style={styles.icon}
                        />
                        <Text style={[
                            styles.buttonText,
                            isDark && styles.buttonTextDark,
                            !value && styles.placeholder,
                        ]}>
                            {value ? value.toLocaleDateString() : placeholder}
                        </Text>
                    </TouchableOpacity>

                    {/* Error Message */}
                    {error && (
                        <Text style={styles.errorText}>{error.message}</Text>
                    )}

                    {/* Date Picker Modal */}
                    <CustomDatePicker
                        visible={showPicker}
                        date={value || new Date()}
                        onClose={() => setShowPicker(false)}
                        onConfirm={(selectedDate) => {
                            onChange(selectedDate);
                            setShowPicker(false);
                        }}
                        minDate={minDate}
                        maxDate={maxDate}
                    />
                </View>
            )}
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
    icon: {
        marginRight: designSystem.spacing[3],
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
});
