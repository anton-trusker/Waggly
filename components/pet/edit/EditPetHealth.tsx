import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import DatePickerWeb from '@/components/ui/DatePickerWeb';
import ModernSelect from '@/components/ui/ModernSelect';
import { Pet } from '@/types/index';

interface EditPetHealthProps {
    data: Partial<Pet>;
    onChange: (field: string, value: any) => void;
    errors?: Record<string, string>;
}

const BLOOD_TYPES = [
    { label: 'DEA 1.1 Positive', value: 'DEA 1.1 Positive' },
    { label: 'DEA 1.1 Negative', value: 'DEA 1.1 Negative' },
    { label: 'Type A', value: 'Type A' },
    { label: 'Type B', value: 'Type B' },
    { label: 'Type AB', value: 'Type AB' },
    { label: 'Unknown', value: 'Unknown' },
];

// Helper component for decimal inputs to handle "12." case
const DecimalInput = ({ value, onChange, placeholder, style, error }: any) => {
    const [localValue, setLocalValue] = useState(value?.toString() || '');

    useEffect(() => {
        if (value !== undefined && value !== null && parseFloat(localValue) !== value) {
            setLocalValue(value.toString());
        }
    }, [value]);

    const handleChange = (text: string) => {
        setLocalValue(text);
        const floatVal = parseFloat(text);
        if (!isNaN(floatVal) && text.trim() !== '') {
            // Only update parent if it's a valid number
            // But if text ends in '.' or '.0', we wait?
            // Actually, best to just update parent with valid numbers, ignoring trailing format
            // but keep localValue for display.

            // If text is "12.", parseFloat is 12. Parent gets 12. 
            // If parent updates back, it sends 12. 
            // useEffect sees 12 === 12, so it doesn't reset localValue "12." -> Correct!
            onChange(floatVal);
        } else if (text === '') {
            onChange(null);
        }
    };

    return (
        <TextInput
            style={[style, error && styles.inputError]}
            value={localValue}
            onChangeText={handleChange}
            placeholder={placeholder}
            keyboardType="decimal-pad"
        />
    );
};

export default function EditPetHealth({ data, onChange, errors = {} }: EditPetHealthProps) {
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
    const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');

    // Convert storage value (metric) to display value (selected unit)
    const getDisplayValue = (metricValue: number | null | undefined, unit: 'kg' | 'lb' | 'cm' | 'in') => {
        if (metricValue === null || metricValue === undefined) return '';

        // Return string to avoid small float errors in display
        switch (unit) {
            case 'kg': return metricValue.toString();
            case 'lb': return (metricValue * 2.20462).toFixed(1); // 1 kg = 2.20462 lb
            case 'cm': return metricValue.toString();
            case 'in': return (metricValue / 2.54).toFixed(1);    // 1 in = 2.54 cm
        }
    };

    // Handle change: convert display value (selected unit) back to storage value (metric)
    const handleMetricChange = (field: 'weight' | 'height', displayValue: number | null, unit: 'kg' | 'lb' | 'cm' | 'in') => {
        if (displayValue === null) {
            onChange(field, null);
            return;
        }

        let metricValue = displayValue;
        if (unit === 'lb') metricValue = displayValue / 2.20462;
        if (unit === 'in') metricValue = displayValue * 2.54;

        // Round to 2 decimals for cleaner DB storage
        onChange(field, parseFloat(metricValue.toFixed(2)));
    };

    return (
        <View style={styles.container}>

            {/* --- Microchip Section --- */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <IconSymbol ios_icon_name="memorychip" android_material_icon_name="memory" size={20} color={designSystem.colors.primary[500]} />
                    <Text style={styles.sectionTitle}>MICROCHIP IDENTIFICATION</Text>
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Microchip ID</Text>
                        <TextInput
                            style={styles.input}
                            value={data.microchip_number || ''}
                            onChangeText={(v) => onChange('microchip_number', v)}
                            placeholder="# 985..."
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Registry / Database</Text>
                        <TextInput
                            style={styles.input}
                            value={data.registry_provider || ''}
                            onChangeText={(v) => onChange('registry_provider', v)}
                            placeholder="e.g. HomeAgain"
                        />
                    </View>
                </View>

                {Platform.OS === 'web' ? (
                    <DatePickerWeb
                        label="Implantation Date"
                        value={data.microchip_implantation_date || ''}
                        onChange={(v) => onChange('microchip_implantation_date', v)}
                        placeholder="Select Date"
                    />
                ) : (
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Implantation Date</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setDatePickerMode('implant')}
                        >
                            <Text style={data.microchip_implantation_date ? styles.inputText : styles.placeholderText}>
                                {formatDate(data.microchip_implantation_date)}
                            </Text>
                            <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={20} color={designSystem.colors.text.tertiary} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* --- Physical Metrics --- */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <IconSymbol ios_icon_name="scalemass" android_material_icon_name="scale" size={20} color={designSystem.colors.primary[500]} />
                    <Text style={styles.sectionTitle}>PHYSICAL METRICS</Text>
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Weight</Text>
                        <View style={[styles.unitInput, errors.weight && styles.inputError]}>
                            <DecimalInput
                                style={styles.unitInputField}
                                value={getDisplayValue(data.weight, weightUnit)}
                                onChange={(val: number | null) => handleMetricChange('weight', val, weightUnit)}
                                placeholder="0.0"
                                error={!!errors.weight}
                            />
                            <TouchableOpacity
                                onPress={() => setWeightUnit(prev => prev === 'kg' ? 'lb' : 'kg')}
                                style={styles.unitBadge}
                            >
                                <Text style={styles.unitText}>{weightUnit}</Text>
                            </TouchableOpacity>
                        </View>
                        {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
                    </View>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Height</Text>
                        <View style={[styles.unitInput, errors.height && styles.inputError]}>
                            <DecimalInput
                                style={styles.unitInputField}
                                value={getDisplayValue(data.height, heightUnit)}
                                onChange={(val: number | null) => handleMetricChange('height', val, heightUnit)}
                                placeholder="0.0"
                                error={!!errors.height}
                            />
                            <TouchableOpacity
                                onPress={() => setHeightUnit(prev => prev === 'cm' ? 'in' : 'cm')}
                                style={styles.unitBadge}
                            >
                                <Text style={styles.unitText}>{heightUnit}</Text>
                            </TouchableOpacity>
                        </View>
                        {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
                    </View>
                </View>

                <ModernSelect
                    label="Blood Type"
                    value={data.blood_type || ''}
                    options={BLOOD_TYPES}
                    onChange={(v) => onChange('blood_type', v)}
                    placeholder="Select type"
                />
            </View>

            {/* --- Sterilization --- */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <IconSymbol ios_icon_name="cross.case.fill" android_material_icon_name="medical-services" size={20} color={designSystem.colors.primary[500]} />
                    <Text style={styles.sectionTitle}>MEDICAL PROFILE</Text>
                </View>

                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Spayed / Neutered</Text>
                    <Switch
                        value={!!data.is_spayed_neutered}
                        onValueChange={(v) => onChange('is_spayed_neutered', v)}
                        trackColor={{ false: designSystem.colors.neutral[200], true: designSystem.colors.primary[500] }}
                    />
                </View>

                {data.is_spayed_neutered && (
                    <View style={{ marginTop: 8 }}>
                        {Platform.OS === 'web' ? (
                            <DatePickerWeb
                                label="Procedure Date"
                                value={data.sterilization_date || ''}
                                onChange={(v) => onChange('sterilization_date', v)}
                                placeholder="Select Date"
                            />
                        ) : (
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Procedure Date</Text>
                                <TouchableOpacity
                                    style={styles.dateInput}
                                    onPress={() => setDatePickerMode('sterilization')}
                                >
                                    <Text style={data.sterilization_date ? styles.inputText : styles.placeholderText}>
                                        {formatDate(data.sterilization_date)}
                                    </Text>
                                    <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={20} color={designSystem.colors.text.tertiary} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Note about Medical History */}
            <View style={styles.infoBox}>
                <IconSymbol ios_icon_name="info.circle" android_material_icon_name="info" size={20} color={designSystem.colors.primary[500]} />
                <Text style={styles.infoText}>
                    Allergies and Conditions are managed in the comprehensive Medical Records section for detailed tracking.
                </Text>
            </View>

            {/* Date Pickers - Mobile Only */}
            {Platform.OS !== 'web' && (
                <CustomDatePicker
                    visible={!!datePickerMode}
                    date={
                        datePickerMode === 'implant' && data.microchip_implantation_date ? new Date(data.microchip_implantation_date) :
                            datePickerMode === 'sterilization' && data.sterilization_date ? new Date(data.sterilization_date) :
                                new Date()
                    }
                    onClose={() => setDatePickerMode(null)}
                    onConfirm={(date) => {
                        const isoDate = date.toISOString().split('T')[0];
                        if (datePickerMode === 'implant') onChange('microchip_implantation_date', isoDate);
                        if (datePickerMode === 'sterilization') onChange('sterilization_date', isoDate);
                        setDatePickerMode(null);
                    }}
                    title={datePickerMode === 'implant' ? "Implantation Date" : "Procedure Date"}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 24 },
    section: { gap: 16 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    sectionTitle: { ...designSystem.typography.label.small, color: designSystem.colors.text.primary, fontWeight: '800', letterSpacing: 1 },
    row: { flexDirection: 'row', gap: 16 },
    formGroup: { gap: 8 },
    label: { ...designSystem.typography.label.small, color: designSystem.colors.text.secondary, fontWeight: '700' },
    input: {
        borderWidth: 1, borderColor: designSystem.colors.neutral[200], borderRadius: 12,
        paddingHorizontal: 16, paddingVertical: 12, fontSize: 16,
        color: designSystem.colors.text.primary, backgroundColor: '#fff'
    },
    inputError: {
        borderColor: designSystem.colors.error[500],
    },
    errorText: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.error[500],
        marginTop: 4,
    },
    dateInput: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderWidth: 1, borderColor: designSystem.colors.neutral[200], borderRadius: 12,
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff'
    },
    inputText: { fontSize: 16, color: designSystem.colors.text.primary },
    placeholderText: { fontSize: 16, color: designSystem.colors.text.tertiary },
    unitInput: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: designSystem.colors.neutral[200], borderRadius: 12,
        backgroundColor: '#fff', overflow: 'hidden'
    },
    unitInputField: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
    unitBadge: {
        backgroundColor: designSystem.colors.neutral[100], paddingHorizontal: 12, paddingVertical: 14,
        borderLeftWidth: 1, borderLeftColor: designSystem.colors.neutral[200]
    },
    unitText: { ...designSystem.typography.label.small, fontWeight: '700', color: designSystem.colors.text.secondary },
    switchRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 8, paddingHorizontal: 4
    },
    switchLabel: { ...designSystem.typography.body.medium, fontWeight: '600', color: designSystem.colors.text.primary },
    infoBox: {
        flexDirection: 'row', gap: 12, padding: 16, borderRadius: 12,
        backgroundColor: designSystem.colors.primary[50],
        alignItems: 'center'
    },
    infoText: { flex: 1, ...designSystem.typography.body.small, color: designSystem.colors.text.secondary }
});
