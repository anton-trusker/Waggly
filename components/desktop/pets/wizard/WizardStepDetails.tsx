import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WizardStepDetailsProps {
    formData: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

const WizardStepDetails: React.FC<WizardStepDetailsProps> = ({
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

    const toggleSpayedNeutered = () => {
        updateField('is_spayed_neutered', !localData.is_spayed_neutered);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>Additional Details</Text>
            <Text style={styles.subheading}>Allergies, special needs, and notes</Text>

            {/* Spayed/Neutered Toggle */}
            <TouchableOpacity style={styles.toggleRow} onPress={toggleSpayedNeutered}>
                <View>
                    <Text style={styles.toggleLabel}>Spayed/Neutered</Text>
                    <Text style={styles.toggleSubtext}>Is your pet spayed or neutered?</Text>
                </View>
                <View style={[styles.toggle, localData.is_spayed_neutered && styles.toggleActive]}>
                    <View
                        style={[
                            styles.toggleThumb,
                            localData.is_spayed_neutered && styles.toggleThumbActive,
                        ]}
                    />
                </View>
            </TouchableOpacity>

            {/* Allergies */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Allergies</Text>
                <Text style={styles.hint}>Enter each allergy separated by commas</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Chicken, Wheat, Grass"
                    placeholderTextColor="#9CA3AF"
                    value={localData.allergies?.join(', ') || ''}
                    onChangeText={(text) =>
                        updateField('allergies', text.split(',').map((a) => a.trim()).filter(Boolean))
                    }
                />
            </View>

            {/* Special Needs */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Special Needs</Text>
                <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="Any special care requirements..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    value={localData.special_needs}
                    onChangeText={(text) => updateField('special_needs', text)}
                />
            </View>

            {/* General Notes */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="Additional notes about your pet..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={5}
                    value={localData.notes}
                    onChangeText={(text) => updateField('notes', text)}
                />
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Ionicons name="arrow-back" size={20} color="#6366F1" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                    <Text style={styles.nextButtonText}>Review & Confirm</Text>
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
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 24,
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    toggleSubtext: {
        fontSize: 13,
        color: '#6B7280',
    },
    toggle: {
        width: 52,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
        padding: 2,
    },
    toggleActive: {
        backgroundColor: '#6366F1',
    },
    toggleThumb: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
    },
    toggleThumbActive: {
        transform: [{ translateX: 20 }],
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    hint: {
        fontSize: 12,
        color: '#9CA3AF',
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
    textarea: {
        height: 100,
        textAlignVertical: 'top',
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

export default WizardStepDetails;
