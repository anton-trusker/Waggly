import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WizardStepContactInfoProps {
    formData: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

const WizardStepContactInfo: React.FC<WizardStepContactInfoProps> = ({
    formData,
    onUpdate,
    onNext,
    onBack,
}) => {
    const [localData, setLocalData] = useState(formData);

    const updateField = (field: string, value: any) => {
        const newData = { ...localData, [field]: value };
        setLocalData(newData);
        onUpdate(newData);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>Contact Information</Text>
            <Text style={styles.subheading}>Emergency contacts and vet details</Text>

            {/* Microchip Number */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Microchip Number</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="qr-code-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., 123456789012345"
                        placeholderTextColor="#9CA3AF"
                        value={localData.microchip_number}
                        onChangeText={(text) => updateField('microchip_number', text)}
                    />
                </View>
            </View>

            {/* Veterinarian Name */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Veterinarian Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Dr. Smith"
                    placeholderTextColor="#9CA3AF"
                    value={localData.vet_name}
                    onChangeText={(text) => updateField('vet_name', text)}
                />
            </View>

            {/* Vet Address/Clinic */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Veterinary Clinic Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="123 Main St, City, State"
                    placeholderTextColor="#9CA3AF"
                    value={localData.vet_address}
                    onChangeText={(text) => updateField('vet_address', text)}
                />
            </View>

            {/* Emergency Contact */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Emergency Contact Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    placeholderTextColor="#9CA3AF"
                    value={localData.emergency_contact_name}
                    onChangeText={(text) => updateField('emergency_contact_name', text)}
                />
            </View>

            {/* Emergency Contact Phone */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Emergency Contact Phone</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="+1 (555) 123-4567"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        value={localData.emergency_contact_phone}
                        onChangeText={(text) => updateField('emergency_contact_phone', text)}
                    />
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Ionicons name="arrow-back" size={20} color="#6366F1" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={onNext}>
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
        padding: 32,
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    subheading: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#F9FAFB',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB',
    },
    inputIcon: {
        marginRight: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 24,
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
        borderColor: '#E5E7EB',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6366F1',
    },
    nextButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#6366F1',
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
