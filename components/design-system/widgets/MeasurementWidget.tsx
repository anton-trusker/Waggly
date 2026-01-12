import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { designSystem } from '@/constants/designSystem';
import { Input } from '../primitives/Input';

export type MeasurementType = 'weight' | 'height' | 'age';
export type UnitSystem = 'metric' | 'imperial';

interface MeasurementValue {
    value: number;
    unit: string;
}

interface MeasurementWidgetProps {
    label?: string;
    type: MeasurementType;
    value?: MeasurementValue; // We assume simple value for now or object? Let's use value/unit object
    onChange?: (value: MeasurementValue) => void;
    defaultUnitSystem?: UnitSystem;
    error?: string;
}

const UNITS = {
    weight: {
        metric: 'kg',
        imperial: 'lbs',
    },
    height: {
        metric: 'cm',
        imperial: 'in', // or ft/in? keeping simple for now
    },
    age: {
        metric: 'yrs', // generic
        imperial: 'yrs',
    },
};

const convert = (value: number, fromUnit: string, toUnit: string): number => {
    if (!value) return 0;
    if (fromUnit === toUnit) return value;

    // Simple conversions
    if (fromUnit === 'kg' && toUnit === 'lbs') return value * 2.20462;
    if (fromUnit === 'lbs' && toUnit === 'kg') return value / 2.20462;

    if (fromUnit === 'cm' && toUnit === 'in') return value / 2.54;
    if (fromUnit === 'in' && toUnit === 'cm') return value * 2.54;

    return value;
};

export const MeasurementWidget = ({
    label,
    type,
    value,
    onChange,
    defaultUnitSystem = 'metric',
    error,
}: MeasurementWidgetProps) => {
    const [unitSystem, setUnitSystem] = useState<UnitSystem>(defaultUnitSystem);
    const currentUnit = UNITS[type][unitSystem];

    // Local state for the input string to allow typing decimals nicely
    const [localValue, setLocalValue] = useState(value?.value?.toString() || '');

    // Update local state when prop value changes
    useEffect(() => {
        // If the incoming value has a unit different from current display unit, calculate it?
        // Or just assume the parent handles it? 
        // A widget should ideally hide the complexity.
        // If parent passes { value: 10, unit: 'kg' } and we are in 'lbs' mode, we should show 22.
        if (value) {
            const displayVal = convert(value.value, value.unit, currentUnit);
            // Only update if significantly different to avoid cursor jumping? 
            // For simple implementation, let's just sync.
            setLocalValue(displayVal ? parseFloat(displayVal.toFixed(2)).toString() : '');
        }
    }, [value, currentUnit]);

    const handleTextChange = (text: string) => {
        setLocalValue(text);

        const num = parseFloat(text);
        if (!isNaN(num)) {
            onChange?.({
                value: num,
                unit: currentUnit
            });
        }
    };

    const toggleUnit = () => {
        const newSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
        const newUnit = UNITS[type][newSystem];

        // When toggling, we want to convert the current input value to the new unit
        // so the visual number changes but represents the same physical quantity?
        // OR do we keep the number and change the unit (re-interpreting)?
        // Usually users toggle because they want to ENTER in that unit.
        // If I type "10" (kg) and switch to lbs, should it become "22" (lbs) or stay "10" (lbs)?
        // Standard UX: Convert the value so it stays physically physically accurate.

        const currentNum = parseFloat(localValue);
        if (!isNaN(currentNum)) {
            const converted = convert(currentNum, currentUnit, newUnit);
            const formatted = parseFloat(converted.toFixed(2));
            setLocalValue(formatted.toString());
            onChange?.({
                value: formatted,
                unit: newUnit
            });
        }

        setUnitSystem(newSystem);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.inputWrapper}>
                <Input
                    containerStyle={{ flex: 1, marginBottom: 0 }}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={localValue}
                    onChangeText={handleTextChange}
                    error={error}
                />

                <TouchableOpacity style={styles.unitToggle} onPress={toggleUnit}>
                    <Text style={styles.unitText}>{currentUnit}</Text>
                    {type !== 'age' && ( // Don't toggle age units usually
                        <Text style={styles.toggleHint}>switch</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: designSystem.colors.text.secondary,
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start', // Align top so error text doesn't break layout
        gap: 8,
    },
    unitToggle: {
        height: 44,
        paddingHorizontal: 16,
        backgroundColor: designSystem.colors.neutral[100],
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
    },
    unitText: {
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    toggleHint: {
        fontSize: 10,
        color: designSystem.colors.text.tertiary,
        marginTop: 2,
    },
});
