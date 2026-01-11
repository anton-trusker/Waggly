import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

interface FormRadioGroupProps {
    label?: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
    helperText?: string;
    direction?: 'vertical' | 'horizontal';
}

export default function FormRadioGroup({
    label,
    options,
    value,
    onChange,
    disabled = false,
    error,
    helperText,
    direction = 'vertical',
}: FormRadioGroupProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';

    const effectiveColors = isDark
        ? {
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[700],
            activeBorder: designSystem.colors.primary[500],
            activeBackground: `${designSystem.colors.primary[500]}20`,
            error: designSystem.colors.error[400],
        }
        : {
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[300],
            activeBorder: designSystem.colors.primary[500],
            activeBackground: `${designSystem.colors.primary[500]}10`,
            error: designSystem.colors.error[500],
        };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={[styles.label, { color: effectiveColors.text }]}>
                    {label}
                </Text>
            )}

            <View
                style={[
                    styles.optionsContainer,
                    direction === 'horizontal' && styles.horizontalContainer,
                ] as any}
            >
                {options.map((option) => {
                    const isSelected = value === option.value;

                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => !disabled && onChange(option.value)}
                            disabled={disabled}
                            activeOpacity={0.7}
                            style={[
                                styles.option,
                                direction === 'horizontal' && styles.horizontalOption,
                                {
                                    borderColor: isSelected
                                        ? effectiveColors.activeBorder
                                        : effectiveColors.border,
                                    backgroundColor: isSelected
                                        ? effectiveColors.activeBackground
                                        : 'transparent',
                                    opacity: disabled ? 0.5 : 1,
                                },
                            ] as any}
                        >
                            <View
                                style={[
                                    styles.radio,
                                    {
                                        borderColor: isSelected
                                            ? effectiveColors.activeBorder
                                            : effectiveColors.border,
                                    },
                                ] as any}
                            >
                                {isSelected && (
                                    <View
                                        style={[
                                            styles.radioInner,
                                            {
                                                backgroundColor: effectiveColors.activeBorder,
                                            },
                                        ] as any}
                                    />
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.optionLabel,
                                    {
                                        color: isSelected
                                            ? effectiveColors.text
                                            : effectiveColors.textSecondary,
                                        fontWeight: isSelected ? '600' : '400',
                                    },
                                ] as any}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {error && (
                <Text style={[styles.errorText, { color: effectiveColors.error }]}>
                    {error}
                </Text>
            )}

            {helperText && !error && (
                <Text style={[styles.helperText, { color: effectiveColors.textSecondary }]}>
                    {helperText}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    optionsContainer: {
        gap: 8,
    },
    horizontalContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1.5,
    },
    horizontalOption: {
        flex: 1,
        minWidth: 100,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    optionLabel: {
        fontSize: 15,
        flex: 1,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    },
    helperText: {
        fontSize: 12,
        marginTop: 4,
    },
});
