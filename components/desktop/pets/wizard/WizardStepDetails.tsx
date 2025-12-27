import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import RichTextInput from '@/components/desktop/modals/shared/RichTextInput';

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
    const { theme } = useAppTheme();
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
        <ScrollView style={[styles.container, { padding: 32 }]} showsVerticalScrollIndicator={false}>
            <Text style={[styles.heading, { color: theme.colors.text.primary }]}>Additional Details</Text>
            <Text style={[styles.subheading, { color: theme.colors.text.secondary }]}>Allergies, special needs, and notes</Text>

            {/* Spayed/Neutered Toggle */}
            <TouchableOpacity
                style={[styles.toggleRow, { backgroundColor: theme.colors.background.secondary }]}
                onPress={toggleSpayedNeutered}
            >
                <View>
                    <Text style={[styles.toggleLabel, { color: theme.colors.text.primary }]}>Spayed/Neutered</Text>
                    <Text style={[styles.toggleSubtext, { color: theme.colors.text.secondary }]}>Is your pet spayed or neutered?</Text>
                </View>
                <View style={[styles.toggle, localData.is_spayed_neutered ? { backgroundColor: theme.colors.primary[500] } : { backgroundColor: theme.colors.border.primary }]}>
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
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Allergies</Text>
                <Text style={[styles.hint, { color: theme.colors.text.tertiary }]}>Enter each allergy separated by commas</Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.colors.background.secondary,
                        borderColor: theme.colors.border.primary,
                        color: theme.colors.text.primary
                    }]}
                    placeholder="e.g., Chicken, Wheat, Grass"
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={localData.allergies?.join(', ') || ''}
                    onChangeText={(text) =>
                        updateField('allergies', text.split(',').map((a) => a.trim()).filter(Boolean))
                    }
                />
            </View>

            {/* Special Needs */}
            <RichTextInput
                label="Special Needs"
                placeholder="Any special care requirements..."
                value={localData.special_needs}
                onChangeText={(text) => updateField('special_needs', text)}
                minHeight={100}
            />

            {/* General Notes */}
            <View style={{ marginTop: 24 }}>
                <RichTextInput
                    label="Notes"
                    placeholder="Additional notes about your pet..."
                    value={localData.notes}
                    onChangeText={(text) => updateField('notes', text)}
                    minHeight={100}
                />
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
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    toggleSubtext: {
        fontSize: 13,
    },
    toggle: {
        width: 52,
        height: 32,
        borderRadius: 16,
        padding: 2,
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
        marginBottom: 4,
    },
    hint: {
        fontSize: 12,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
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

export default WizardStepDetails;
