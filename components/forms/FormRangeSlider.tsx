import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    PanResponder,
    Animated,
    Platform,
} from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { useAppTheme } from '@/hooks/useAppTheme';

interface FormRangeSliderProps {
    label?: string;
    min: number;
    max: number;
    values: [number, number]; // [min, max]
    onChange: (values: [number, number]) => void;
    unit?: string;
    step?: number;
    disabled?: boolean;
    error?: string;
    helperText?: string;
}

export default function FormRangeSlider({
    label,
    min,
    max,
    values,
    onChange,
    unit = '',
    step = 1,
    disabled = false,
    error,
    helperText,
}: FormRangeSliderProps) {
    const { theme } = useAppTheme();
    const isDark = theme === 'dark';
    const [sliderWidth, setSliderWidth] = useState(0);

    const effectiveColors = isDark
        ? {
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            track: designSystem.colors.neutral[700],
            activeTrack: designSystem.colors.primary[500],
            thumb: designSystem.colors.primary[500],
            error: designSystem.colors.error[400],
        }
        : {
            text: designSystem.colors.text.primary,
            textSecondary: designSystem.colors.text.secondary,
            track: designSystem.colors.neutral[300],
            activeTrack: designSystem.colors.primary[500],
            thumb: designSystem.colors.primary[500],
            error: designSystem.colors.error[500],
        };

    const getPosition = (value: number) => {
        const percentage = ((value - min) / (max - min)) * 100;
        return Math.max(0, Math.min(100, percentage));
    };

    const getValue = (percentage: number) => {
        const range = max - min;
        const rawValue = min + (range * percentage) / 100;
        const steppedValue = Math.round(rawValue / step) * step;
        return Math.max(min, Math.min(max, steppedValue));
    };

    const createPanResponder = (isMinThumb: boolean) => {
        return PanResponder.create({
            onStartShouldSetPanResponder: () => !disabled,
            onMoveShouldSetPanResponder: () => !disabled,
            onPanResponderMove: (_, gestureState) => {
                if (sliderWidth === 0) return;

                const percentage = Math.max(
                    0,
                    Math.min(100, (gestureState.moveX / sliderWidth) * 100)
                );
                const newValue = getValue(percentage);

                if (isMinThumb) {
                    if (newValue < values[1]) {
                        onChange([newValue, values[1]]);
                    }
                } else {
                    if (newValue > values[0]) {
                        onChange([values[0], newValue]);
                    }
                }
            },
        });
    };

    const minPanResponder = createPanResponder(true);
    const maxPanResponder = createPanResponder(false);

    const minPosition = getPosition(values[0]);
    const maxPosition = getPosition(values[1]);

    return (
        <View style={styles.container}>
            {label && (
                <Text style={[styles.label, { color: effectiveColors.text }]}>
                    {label}
                </Text>
            )}

            <View style={styles.sliderContainer}>
                <View
                    style={[
                        styles.track,
                        { backgroundColor: effectiveColors.track },
                    ] as any}
                    onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
                >
                    <View
                        style={[
                            styles.activeTrack,
                            {
                                backgroundColor: effectiveColors.activeTrack,
                                left: `${minPosition}%`,
                                right: `${100 - maxPosition}%`,
                            },
                        ] as any}
                    />
                </View>

                {/* Min Thumb */}
                <View
                    {...(Platform.OS !== 'web' ? minPanResponder.panHandlers : {})}
                    style={[
                        styles.thumb,
                        {
                            backgroundColor: effectiveColors.thumb,
                            left: `${minPosition}%`,
                            opacity: disabled ? 0.5 : 1,
                        },
                    ] as any}
                />

                {/* Max Thumb */}
                <View
                    {...(Platform.OS !== 'web' ? maxPanResponder.panHandlers : {})}
                    style={[
                        styles.thumb,
                        {
                            backgroundColor: effectiveColors.thumb,
                            left: `${maxPosition}%`,
                            opacity: disabled ? 0.5 : 1,
                        },
                    ] as any}
                />
            </View>

            <View style={styles.valuesContainer}>
                <Text style={[styles.valueText, { color: effectiveColors.textSecondary }]}>
                    {values[0] as any}
                    {unit}
                </Text>
                <Text style={[styles.valueText, { color: effectiveColors.textSecondary }]}>
                    {values[1] as any}
                    {unit}
                </Text>
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
    sliderContainer: {
        height: 40,
        justifyContent: 'center',
        position: 'relative',
        marginHorizontal: 12,
    },
    track: {
        height: 4,
        borderRadius: 2,
    },
    activeTrack: {
        position: 'absolute',
        height: '100%',
        borderRadius: 2,
    },
    thumb: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        marginLeft: -12,
        marginTop: -10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                cursor: 'pointer',
            },
        }),
    },
    valuesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 4,
    },
    valueText: {
        fontSize: 13,
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
