import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { designSystem } from '@/constants/designSystem';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import ModernSelect from '@/components/ui/ModernSelect';

export interface Step3Data {
    microchipNumber: string;
    implantationDate?: Date;
    tagId: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
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
    const [implantationDate, setImplantationDate] = useState<Date | undefined>(initialData.implantationDate);
    const [tagId, setTagId] = useState(initialData.tagId);

    // Emergency Contacts
    const [emergencyContactName, setEmergencyContactName] = useState(initialData.emergencyContactName || '');
    const [emergencyContactPhone, setEmergencyContactPhone] = useState(initialData.emergencyContactPhone || '');

    // Modals
    const [showDateModal, setShowDateModal] = useState(false);

    const handleNext = () => {
        onNext({
            microchipNumber,
            implantationDate,
            tagId,
            emergencyContactName,
            emergencyContactPhone,
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
                    <Text style={styles.title}>Almost there!</Text>
                    <Text style={styles.subtitle}>Important medical and tracking details.</Text>
                </View>

                <View style={styles.formSection}>
                    {/* --- Microchip Card --- */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <IconSymbol ios_icon_name="memorychip" android_material_icon_name="memory" size={24} color={designSystem.colors.primary[500]} />
                            <Text style={styles.cardTitle}>Microchip Details</Text>
                        </View>

                        {/* Microchip Number and Implantation Date on one row */}
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>MICROCHIP NUMBER</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="985112345678900"
                                    placeholderTextColor={designSystem.colors.text.tertiary}
                                    keyboardType="number-pad"
                                    value={microchipNumber}
                                    onChangeText={setMicrochipNumber}
                                />
                            </View>

                            <View style={styles.col}>
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
                    </View>

                    {/* --- Emergency Contact Card --- */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <IconSymbol ios_icon_name="exclamationmark.triangle.fill" android_material_icon_name="emergency" size={24} color={designSystem.colors.error[500]} />
                            <Text style={styles.cardTitle}>Emergency Contact</Text>
                        </View>

                        {/* Emergency Contact Name and Phone on one row */}
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.label}>CONTACT NAME</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full name"
                                    placeholderTextColor={designSystem.colors.text.tertiary}
                                    value={emergencyContactName}
                                    onChangeText={setEmergencyContactName}
                                />
                            </View>

                            <View style={styles.col}>
                                <Text style={styles.label}>PHONE NUMBER</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="+1 (555) 123-4567"
                                    placeholderTextColor={designSystem.colors.text.tertiary}
                                    keyboardType="phone-pad"
                                    value={emergencyContactPhone}
                                    onChangeText={setEmergencyContactPhone}
                                />
                            </View>
                        </View>
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
                <View style={{ height: Platform.OS === 'web' ? 100 : 160 }} />
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
    title: { ...(designSystem.typography.title.large as any), color: designSystem.colors.text.primary, marginBottom: 6 },
    subtitle: { ...(designSystem.typography.body.medium as any), color: designSystem.colors.text.secondary },
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
    cardTitle: { ...(designSystem.typography.title.medium as any), color: designSystem.colors.text.primary },
    inputGroup: { gap: 8 },
    label: { ...(designSystem.typography.label.small as any), color: designSystem.colors.text.secondary, letterSpacing: 1, fontWeight: '700' },
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
        ...(designSystem.typography.label.small as any),
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
    continueButtonText: { ...(designSystem.typography.title.medium as any), color: designSystem.colors.neutral[0], fontWeight: '800' },
});
