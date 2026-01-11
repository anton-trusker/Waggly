import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

interface FormToggleProps {
    label?: string;
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
    error?: string;
    helperText?: string;
}

export default function FormToggle({
    label,
    value,
    onChange,
    disabled = false,
    error,
    helperText,
}: FormToggleProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const [animation] = React.useState(new Animated.Value(value ? 1 : 0));

    React.useEffect(() => {
        Animated.timing(animation, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: Platform.OS !== 'web',
        }).start();
    }, [value]);

    const effectiveColors = isDark
        ? {
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[700],
            background: designSystem.colors.neutral[800],
            activeTrack: designSystem.colors.primary[500],
            inactiveTrack: designSystem.colors.neutral[600],
            thumb: '#FFFFFF',
            error: designSystem.colors.error[400],
        }
        : {
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            border: designSystem.colors.neutral[300],
            background: designSystem.colors.neutral[100],
            activeTrack: designSystem.colors.primary[500],
            inactiveTrack: designSystem.colors.neutral[300],
            thumb: '#FFFFFF',
            error: designSystem.colors.error[500],
        };

    const trackColor = value ? effectiveColors.activeTrack : effectiveColors.inactiveTrack;
    const thumbPosition = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 26],
    });

    return (
        <View style={styles.container}>
            {label && (
                <Text style={[styles.label, { color: effectiveColors.text }]}>
                    {label}
                </Text>
            )}

            <TouchableOpacity
                onPress={() => !disabled && onChange(!value)}
                disabled={disabled}
                activeOpacity={0.7}
                style={styles.toggleContainer}
            >
                <View
                    style={[
                        styles.track,
                        {
                            backgroundColor: trackColor,
                            opacity: disabled ? 0.5 : 1,
                        },
                    ] as any}
                >
                    <Animated.View
                        style={[
                            styles.thumb,
                            {
                                backgroundColor: effectiveColors.thumb,
                                transform: [{ translateX: thumbPosition }],
                            },
                        ] as any}
                    />
                </View>

                <Text
                    style={[
                        styles.valueLabel,
                        {
                            color: effectiveColors.textSecondary,
                            opacity: disabled ? 0.5 : 1,
                        },
                    ] as any}
                >
                    {value ? 'Yes' : 'No'}
                </Text>
            </TouchableOpacity>

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
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    track: {
        width: 50,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        position: 'relative',
    },
    thumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        position: 'absolute',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            },
        }),
    },
    valueLabel: {
        fontSize: 14,
        fontWeight: '500',
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
