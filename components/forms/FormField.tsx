import React from 'react';
import { View, Text, StyleSheet, TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

interface FormFieldProps<T extends FieldValues> extends Omit<RNTextInputProps, 'value' | 'onChangeText'> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    required?: boolean;
    type?: 'text' | 'number' | 'email' | 'password';
    multiline?: boolean;
    rows?: number;
}

export default function FormField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    required = false,
    type = 'text',
    multiline = false,
    rows = 4,
    ...textInputProps
}: FormFieldProps<T>) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <View style={styles.container}>
                    {/* Label */}
                    <View style={styles.labelContainer}>
                        <Text style={[styles.label, isDark && styles.labelDark]}>
                            {label}
                            {required && <Text style={styles.required}> *</Text>}
                        </Text>
                    </View>

                    {/* Input */}
                    <RNTextInput
                        style={[
                            styles.input,
                            isDark && styles.inputDark,
                            multiline && styles.inputMultiline,
                            multiline && { height: rows * 20 + 24 },
                            error && styles.inputError,
                        ]}
                        value={value?.toString() || ''}
                        onChangeText={(text) => {
                            if (type === 'number') {
                                const num = parseFloat(text);
                                onChange(isNaN(num) ? undefined : num);
                            } else {
                                onChange(text);
                            }
                        }}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        placeholderTextColor={designSystem.colors.text.tertiary}
                        keyboardType={
                            type === 'email' ? 'email-address' :
                                type === 'number' ? 'numeric' :
                                    'default'
                        }
                        secureTextEntry={type === 'password'}
                        multiline={multiline}
                        textAlignVertical={multiline ? 'top' : 'center'}
                        {...textInputProps}
                    />

                    {/* Error Message */}
                    {error && (
                        <Text style={styles.errorText}>{error.message}</Text>
                    )}
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
    input: {
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: designSystem.borderRadius.md,
        paddingHorizontal: designSystem.spacing[4],
        paddingVertical: designSystem.spacing[3],
        ...designSystem.typography.body.large,
        color: designSystem.colors.text.primary,
        minHeight: 48,
    },
    inputDark: {
        backgroundColor: designSystem.colors.background.primary,
        borderColor: designSystem.colors.neutral[700],
        color: designSystem.colors.text.primary,
    },
    inputMultiline: {
        paddingTop: designSystem.spacing[3],
    },
    inputError: {
        borderColor: designSystem.colors.status.error[500],
    },
    errorText: {
        ...designSystem.typography.body.small,
        color: designSystem.colors.status.error[500],
        marginTop: designSystem.spacing[1],
    },
});
