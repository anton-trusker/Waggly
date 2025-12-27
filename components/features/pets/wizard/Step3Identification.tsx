import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import ModernSelect from '@/components/ui/ModernSelect';

export interface Step3Data {
    microchipNumber: string;
    registryProvider: string;
    implantationDate?: Date;
    tagId: string;
    weight: number;
    weightUnit: 'kg' | 'lbs';
    height: number;
    heightUnit: 'cm' | 'in';
    bloodType: string;
}

interface Step3Props {
    initialData: Step3Data;
    onNext: (data: Step3Data) => void;
}

const REGISTRY_PROVIDERS = [
    { label: 'HomeAgain', value: 'homeagain' },
    { label: 'Avid', value: 'avid' },
    { label: 'AKC Reunite', value: 'akc' },
    { label: '24PetWatch', value: '24petwatch' },
    { label: 'Other', value: 'other' },
];

const BLOOD_TYPES = [
    { label: 'DEA 1.1 Positive', value: 'DEA 1.1 Positive' },
    { label: 'DEA 1.1 Negative', value: 'DEA 1.1 Negative' },
    { label: 'Type A', value: 'Type A' },
    { label: 'Type B', value: 'Type B' },
    { label: 'Type AB', value: 'Type AB' },
    { label: 'Unknown', value: 'Unknown' },
];

export default function Step3Identification({ initialData, onNext }: Step3Props) {
    // Microchip
    const [microchipNumber, setMicrochipNumber] = useState(initialData.microchipNumber);
    const [registryProvider, setRegistryProvider] = useState(initialData.registryProvider);
    const [implantationDate, setImplantationDate] = useState<Date | undefined>(initialData.implantationDate);
    const [tagId, setTagId] = useState(initialData.tagId);

    // Health
    const [weight, setWeight] = useState(initialData.weight ? initialData.weight.toString() : '');
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(initialData.weightUnit);
    const [height, setHeight] = useState(initialData.height ? initialData.height.toString() : '');
    const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>(initialData.heightUnit);
    const [bloodType, setBloodType] = useState(initialData.bloodType);

    // Modals
    const [showDateModal, setShowDateModal] = useState(false);

    const handleNext = () => {
        onNext({
            microchipNumber,
            registryProvider,
            implantationDate,
            tagId,
            weight: parseFloat(weight) || 0,
            weightUnit,
            height: parseFloat(height) || 0,
            heightUnit,
            bloodType,
        });
    };

    const onDateConfirm = (date: Date) => {
        setImplantationDate(date);
        setShowDateModal(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Health & Identification</Text>
                    <Text style={styles.subtitle}>Important medical and tracking details.</Text>
                </View>

                <View style={styles.formSection}>
                    {/* --- Microchip Card --- */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <IconSymbol ios_icon_name="memorychip" android_material_icon_name="memory" size={24} color={designSystem.colors.primary[500]} />
                            <Text style={styles.cardTitle}>Microchip Details</Text>
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>MICROCHIP NUMBER</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 985112345678900"
                                placeholderTextColor={designSystem.colors.text.tertiary}
                                keyboardType="number-pad"
                                value={microchipNumber}
                                onChangeText={setMicrochipNumber}
                            />
                        </View>

                        <ModernSelect
                            label="REGISTRY PROVIDER"
                            placeholder="Select provider"
                            value={registryProvider}
                            options={REGISTRY_PROVIDERS}
                            onChange={setRegistryProvider}
                            searchable
                        />

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>IMPLANTATION DATE</Text>
                            <TouchableOpacity
                                style={styles.dateTrigger}
                                onPress={() => setShowDateModal(true)}
                            >
                                <Text style={implantationDate ? styles.inputText : styles.placeholderText}>
                                    {implantationDate ? implantationDate.toLocaleDateString() : 'Select date'}
                                </Text>
                                <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={20} color={designSystem.colors.primary[500]} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* --- Health Card --- */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <IconSymbol ios_icon_name="heart.fill" android_material_icon_name="favorite" size={24} color={designSystem.colors.error[500]} />
                            <Text style={styles.cardTitle}>Health Metrics</Text>
                        </View>

                        {/* Weight */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>WEIGHT</Text>
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="0.0"
                                    keyboardType="numeric"
                                    value={weight}
                                    onChangeText={setWeight}
                                />
                                <View style={styles.toggle}>
                                    <TouchableOpacity
                                        style={[styles.toggleOption, weightUnit === 'kg' && styles.toggleSelected]}
                                        onPress={() => setWeightUnit('kg')}
                                    >
                                        <Text style={[styles.toggleText, weightUnit === 'kg' && styles.toggleTextSelected]}>KG</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.toggleOption, weightUnit === 'lbs' && styles.toggleSelected]}
                                        onPress={() => setWeightUnit('lbs')}
                                    >
                                        <Text style={[styles.toggleText, weightUnit === 'lbs' && styles.toggleTextSelected]}>LBS</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Height */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>HEIGHT (Optional)</Text>
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="0.0"
                                    keyboardType="numeric"
                                    value={height}
                                    onChangeText={setHeight}
                                />
                                <View style={styles.toggle}>
                                    <TouchableOpacity
                                        style={[styles.toggleOption, heightUnit === 'cm' && styles.toggleSelected]}
                                        onPress={() => setHeightUnit('cm')}
                                    >
                                        <Text style={[styles.toggleText, heightUnit === 'cm' && styles.toggleTextSelected]}>CM</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.toggleOption, heightUnit === 'in' && styles.toggleSelected]}
                                        onPress={() => setHeightUnit('in')}
                                    >
                                        <Text style={[styles.toggleText, heightUnit === 'in' && styles.toggleTextSelected]}>IN</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                         <ModernSelect
                            label="BLOOD TYPE (Optional)"
                            placeholder="Select blood type"
                            value={bloodType}
                            options={BLOOD_TYPES}
                            onChange={setBloodType}
                        />
                    </View>

                     {/* Tag ID */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>COLLAR TAG ID <Text style={styles.optional}>(Optional)</Text></Text>
                         <View style={styles.inputContainer}>
                             <IconSymbol
                                ios_icon_name="tag"
                                android_material_icon_name="sell"
                                size={20}
                                color={designSystem.colors.primary[500]}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.inputWithIcon}
                                placeholder="Tag or License #"
                                placeholderTextColor={designSystem.colors.text.tertiary}
                                value={tagId}
                                onChangeText={setTagId}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleNext}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                    <IconSymbol
                        ios_icon_name="arrow.right"
                        android_material_icon_name="arrow-forward"
                        size={20}
                        color={designSystem.colors.neutral[0]}
                    />
                </TouchableOpacity>
            </View>

            <CustomDatePicker
                visible={showDateModal}
                date={implantationDate || new Date()}
                onClose={() => setShowDateModal(false)}
                onConfirm={onDateConfirm}
                title="Implantation Date"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16 },
    headerSection: { marginBottom: 24 },
    title: { ...designSystem.typography.title.large, color: designSystem.colors.text.primary, marginBottom: 6 },
    subtitle: { ...designSystem.typography.body.medium, color: designSystem.colors.text.secondary },
    formSection: { gap: 24 },
    card: {
        backgroundColor: designSystem.colors.neutral[0],
        borderRadius: 16,
        padding: 16,
        gap: 16,
        ...designSystem.shadows.sm,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[100],
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
    cardTitle: { ...designSystem.typography.title.medium, color: designSystem.colors.text.primary },
    inputGroup: { gap: 8 },
    label: { ...designSystem.typography.label.small, color: designSystem.colors.text.secondary, letterSpacing: 1, fontWeight: '700' },
    input: {
        backgroundColor: designSystem.colors.background.primary,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: designSystem.colors.text.primary,
    },
    dateTrigger: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: designSystem.colors.background.primary,
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    inputText: { fontSize: 16, color: designSystem.colors.text.primary },
    placeholderText: { fontSize: 16, color: designSystem.colors.text.tertiary },
    row: { flexDirection: 'row', gap: 12 },
    toggle: {
        flexDirection: 'row',
        backgroundColor: designSystem.colors.neutral[100],
        borderRadius: 12,
        padding: 4,
        height: 50, // Match input height roughly
    },
    toggleOption: {
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    toggleSelected: {
        backgroundColor: designSystem.colors.neutral[0],
        ...designSystem.shadows.sm,
    },
    toggleText: {
        ...designSystem.typography.label.small,
        color: designSystem.colors.text.tertiary,
        fontWeight: '700',
    },
    toggleTextSelected: {
        color: designSystem.colors.primary[500],
    },
    optional: { fontWeight: '400', color: designSystem.colors.text.tertiary, fontSize: 12 },
    inputContainer: { position: 'relative' },
    inputIcon: { position: 'absolute', left: 16, top: 18, zIndex: 1 },
    inputWithIcon: {
        backgroundColor: designSystem.colors.neutral[0],
        borderWidth: 1,
        borderColor: designSystem.colors.neutral[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingLeft: 48,
        paddingVertical: 16,
        fontSize: 16,
        color: designSystem.colors.text.primary,
        ...designSystem.shadows.sm,
    },
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16,
        backgroundColor: designSystem.colors.background.primary, borderTopWidth: 1, borderTopColor: designSystem.colors.neutral[100],
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    },
    continueButton: {
        backgroundColor: designSystem.colors.primary[500], flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 16, borderRadius: 12, gap: 8, ...designSystem.shadows.md,
    },
    continueButtonText: { ...designSystem.typography.title.medium, color: designSystem.colors.neutral[0], fontWeight: '800' },
});
