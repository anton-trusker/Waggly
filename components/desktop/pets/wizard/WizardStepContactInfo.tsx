import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EnhancedSelection from '@/components/ui/EnhancedSelection';
import { COUNTRIES } from '@/constants/countries';
import { useAppTheme } from '@/hooks/useAppTheme';

interface WizardStepContactInfoProps {
    formData: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

// Map countries to EnhancedSelection options, including flag in label since icon prop is for IconSymbol
const COUNTRY_OPTIONS = COUNTRIES.map(c => ({
    id: c.code,
    label: `${c.flag} ${c.name}`
}));

const WizardStepContactInfo: React.FC<WizardStepContactInfoProps> = ({
    formData,
    onUpdate,
    onNext,
    onBack,
}) => {
    const { theme } = useAppTheme();
    const [localData, setLocalData] = useState(formData);

    const updateField = (field: string, value: any) => {
        const newData = { ...localData, [field]: value };
        setLocalData(newData);
        onUpdate(newData);
    };

    return (
        <ScrollView style={[styles.container, { padding: 32 }]} showsVerticalScrollIndicator={false}>
            <Text style={[styles.heading, { color: theme.colors.text.primary }]}>Contact Information</Text>
            <Text style={[styles.subheading, { color: theme.colors.text.secondary }]}>Emergency contacts and vet details</Text>

            {/* Microchip Number */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Microchip Number</Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                    <Ionicons name="qr-code-outline" size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, { color: theme.colors.text.primary }]}
                        placeholder="e.g., 123456789012345"
                        placeholderTextColor={theme.colors.text.tertiary}
                        value={localData.microchip_number}
                        onChangeText={(text) => updateField('microchip_number', text)}
                    />
                </View>
            </View>

            {/* Veterinarian Name */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Veterinarian Name</Text>
                <TextInput
                    style={[styles.standaloneInput, {
                        backgroundColor: theme.colors.background.secondary,
                        borderColor: theme.colors.border.primary,
                        color: theme.colors.text.primary
                    }]}
                    placeholder="Dr. Smith"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={localData.vet_name}
                    onChangeText={(text) => updateField('vet_name', text)}
                />
            </View>

            {/* Clinic Name */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Veterinary Clinic Name</Text>
                <TextInput
                    style={[styles.standaloneInput, {
                        backgroundColor: theme.colors.background.secondary,
                        borderColor: theme.colors.border.primary,
                        color: theme.colors.text.primary
                    }]}
                    placeholder="e.g. City Vet Clinic"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={localData.vet_clinic_name}
                    onChangeText={(text) => updateField('vet_clinic_name', text)}
                />
            </View>

            {/* Vet Address/Clinic */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Veterinary Clinic Address</Text>
                <TextInput
                    style={[styles.standaloneInput, {
                        backgroundColor: theme.colors.background.secondary,
                        borderColor: theme.colors.border.primary,
                        color: theme.colors.text.primary
                    }]}
                    placeholder="123 Main St, City, State"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={localData.vet_address}
                    onChangeText={(text) => updateField('vet_address', text)}
                />
            </View>

            {/* Vet Country */}
            <EnhancedSelection
                label="Country"
                value={localData.vet_country}
                options={COUNTRY_OPTIONS}
                onSelect={(opt) => updateField('vet_country', opt.id)}
                placeholder="Select Country"
                searchable
                icon="globe"
            />

            {/* Vet Phone */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Veterinarian Phone</Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                    <Ionicons name="call-outline" size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, { color: theme.colors.text.primary }]}
                        placeholder="+1 (555) 123-4567"
                        placeholderTextColor={theme.colors.text.tertiary}
                        keyboardType="phone-pad"
                        value={localData.vet_phone}
                        onChangeText={(text) => updateField('vet_phone', text)}
                    />
                </View>
            </View>

            {/* Emergency Contact */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Emergency Contact Name</Text>
                <TextInput
                    style={[styles.standaloneInput, {
                        backgroundColor: theme.colors.background.secondary,
                        borderColor: theme.colors.border.primary,
                        color: theme.colors.text.primary
                    }]}
                    placeholder="John Doe"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={localData.emergency_contact_name}
                    onChangeText={(text) => updateField('emergency_contact_name', text)}
                />
            </View>

            {/* Emergency Contact Phone */}
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Emergency Contact Phone</Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background.secondary, borderColor: theme.colors.border.primary }]}>
                    <Ionicons name="call-outline" size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, { color: theme.colors.text.primary }]}
                        placeholder="+1 (555) 123-4567"
                        placeholderTextColor={theme.colors.text.tertiary}
                        keyboardType="phone-pad"
                        value={localData.emergency_contact_phone}
                        onChangeText={(text) => updateField('emergency_contact_phone', text)}
                    />
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.backButton, { borderColor: theme.colors.border.primary }]}
                    onPress={onBack}
                >
                    <Ionicons name="arrow-back" size={20} color={theme.colors.primary[500]} />
                    <Text style={[styles.backButtonText, { color: theme.colors.primary[500] }]}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: theme.colors.primary[500] }]}
                    onPress={onNext}
                >
                    <Text style={styles.nextButtonText}>Next: Details</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    subheading: {
        fontSize: 16,
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    standaloneInput: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 24,
        marginBottom: 40,
    },
    backButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 12,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default WizardStepContactInfo;
