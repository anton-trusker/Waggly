import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
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

export default function EditPetHealth({ data, onChange, errors = {} }: EditPetHealthProps) {
    const [datePickerMode, setDatePickerMode] = useState<'implant' | 'sterilization' | null>(null);

    // Helper to format date for display
    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return 'Select Date';
        return new Date(dateStr).toLocaleDateString();
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
                            <TextInput
                                style={styles.unitInputField}
                                value={data.weight?.toString() || ''}
                                onChangeText={(v) => onChange('weight', parseFloat(v) || null)}
                                placeholder="0.0"
                                keyboardType="decimal-pad"
                            />
                            <View style={styles.unitBadge}><Text style={styles.unitText}>kg</Text></View>
                        </View>
                        {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
                    </View>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Height</Text>
                        <View style={[styles.unitInput, errors.height && styles.inputError]}>
                            <TextInput
                                style={styles.unitInputField}
                                value={data.height?.toString() || ''}
                                onChangeText={(v) => onChange('height', parseFloat(v) || null)}
                                placeholder="0.0"
                                keyboardType="decimal-pad"
                            />
                            <View style={styles.unitBadge}><Text style={styles.unitText}>cm</Text></View>
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

            {/* Note about Medical History */}
            <View style={styles.infoBox}>
                <IconSymbol ios_icon_name="info.circle" android_material_icon_name="info" size={20} color={designSystem.colors.primary[500]} />
                <Text style={styles.infoText}>
                    Allergies and Conditions are managed in the comprehensive Medical Records section for detailed tracking.
                </Text>
            </View>

            {/* Date Pickers */}
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
