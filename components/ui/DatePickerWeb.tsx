import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';

interface DatePickerWebProps {
    label: string;
    value: string; // YYYY-MM-DD format
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    maxDate?: string; // YYYY-MM-DD
    minDate?: string; // YYYY-MM-DD
}

export default function DatePickerWeb({
    label,
    value,
    onChange,
    error,
    placeholder = 'Select date',
    maxDate,
    minDate,
}: DatePickerWebProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // Format display value (YYYY-MM-DD to readable format)
    const formatDisplayValue = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    // Trigger the native date picker
    const handleClick = () => {
        inputRef.current?.showPicker?.();
    };

    if (Platform.OS !== 'web') {
        return null; // This component is web-only
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={[styles.inputWrapper, error && styles.inputWrapperError] as any}
                onPress={handleClick}
                activeOpacity={0.7}
            >
                <View style={styles.displayValue}>
                    <Text style={value ? styles.valueText : styles.placeholderText}>
                        {value ? formatDisplayValue(value) : placeholder}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleClick}
                >
                    <IconSymbol
                        ios_icon_name="calendar"
                        android_material_icon_name="event"
                        size={20}
                        color={designSystem.colors.primary[500] as any}
                    />
                </TouchableOpacity>

                {/* Hidden native input */}
                <input
                    ref={inputRef as any}
                    type="date"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    max={maxDate || new Date().toISOString().split('T')[0] as any}
                    min={minDate}
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        width: 1,
                        height: 1,
                        pointerEvents: 'none',
                    }}
                />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
        marginBottom: 16,
    },
    label: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.secondary,
        fontWeight: '700',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 50,
        position: 'relative',
    },
    inputWrapperError: {
        borderColor: designSystem.colors.error[500],
    },
    displayValue: {
        flex: 1,
    },
    valueText: {
        fontSize: 16,
        color: designSystem.colors.text.primary,
    },
    placeholderText: {
        fontSize: 16,
        color: designSystem.colors.text.tertiary,
    },
    iconButton: {
        padding: 4,
        marginLeft: 8,
    },
    errorText: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.error[500],
        marginTop: 4,
    },
});
