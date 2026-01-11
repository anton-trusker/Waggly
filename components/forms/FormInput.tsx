/**
 * FormInput - A consistently styled text input component for forms
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { formColors } from '@/styles/formStyles';

interface FormInputProps extends TextInputProps {
    label?: string;
    required?: boolean;
    error?: string;
    helpText?: string;
    containerStyle?: ViewStyle;
}

export default function FormInput({
    label,
    required,
    error,
    helpText,
    containerStyle,
    style,
    ...props
}: FormInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={styles.label}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                    style,
                ] as any}
                placeholderTextColor={formColors.inputPlaceholder}
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            {helpText && !error && <Text style={styles.helpText}>{helpText}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: formColors.labelText,
        marginBottom: 6,
    },
    required: {
        color: formColors.errorText,
    },
    input: {
        backgroundColor: formColors.inputBackground,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: formColors.inputText,
        borderWidth: 1,
        borderColor: formColors.inputBorder,
    },
    inputFocused: {
        borderColor: formColors.inputBorderFocus,
        shadowColor: formColors.inputBorderFocus,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    inputError: {
        borderColor: formColors.errorBorder,
        backgroundColor: formColors.errorBackground,
    },
    errorText: {
        fontSize: 12,
        color: formColors.errorText,
        marginTop: 4,
    },
    helpText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
});
