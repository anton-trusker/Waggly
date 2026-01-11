import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

interface FormSegmentedControlProps {
    label?: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
    helperText?: string;
}

export default function FormSegmentedControl({
    label,
    options,
    value,
    onChange,
    disabled = false,
    error,
    helperText,
}: FormSegmentedControlProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const selectedIndex = options.indexOf(value);
    const [animation] = React.useState(new Animated.Value(selectedIndex));

    React.useEffect(() => {
        Animated.spring(animation, {
            toValue: selectedIndex,
            useNativeDriver: Platform.OS !== 'web',
            speed: 20,
            bounciness: 6,
        }).start();
    }, [selectedIndex]);

    const effectiveColors = isDark
        ? {
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[700],
            background: designSystem.colors.neutral[800],
            activeBackground: designSystem.colors.primary[500],
            activeText: '#FFFFFF',
            error: designSystem.colors.error[400],
        }
        : {
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[300],
            background: designSystem.colors.neutral[100],
            activeBackground: designSystem.colors.primary[500],
            activeText: '#FFFFFF',
            error: designSystem.colors.error[500],
        };

    const segmentWidth = 100 / options.length;
    const translateX = animation.interpolate({
        inputRange: options.map((_, i) => i),
        outputRange: options.map((_, i) => i * segmentWidth),
    });

    return (
        <View style={styles.container}>
            {label && (
                <Text style={[styles.label, { color: effectiveColors.text }]}>
                    {label}
                </Text>
            )}

            <View
                style={[
                    styles.segmentedControl,
                    {
                        backgroundColor: effectiveColors.background,
                        borderColor: effectiveColors.border,
                        opacity: disabled ? 0.5 : 1,
                    },
                ] as any}
            >
                <Animated.View
                    style={[
                        styles.activeSegment,
                        {
                            backgroundColor: effectiveColors.activeBackground,
                            width: `${segmentWidth}%`,
                            transform: [
                                {
                                    translateX: Platform.OS === 'web'
                                        ? `${selectedIndex * segmentWidth}%` as any
                                        : translateX,
                                },
                            ],
                        },
                    ] as any}
                />

                {options.map((option, index) => {
                    const isSelected = value === option;

                    return (
                        <TouchableOpacity
                            key={option}
                            onPress={() => !disabled && onChange(option)}
                            disabled={disabled}
                            activeOpacity={0.7}
                            style={styles.segment}
                        >
                            <Text
                                style={[
                                    styles.segmentLabel,
                                    {
                                        color: isSelected
                                            ? effectiveColors.activeText
                                            : effectiveColors.textSecondary,
                                        fontWeight: isSelected ? '600' : '500',
                                    },
                                ] as any}
                            >
                                {option}
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
        marginBottom: 8,
    },
    segmentedControl: {
        flexDirection: 'row',
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    activeSegment: {
        position: 'absolute',
        height: '100%',
        borderRadius: 8,
        zIndex: 0,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            },
        }),
    },
    segment: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    segmentLabel: {
        fontSize: 14,
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
