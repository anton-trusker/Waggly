import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';

interface WizardStepReviewProps {
    formData: any;
    onBack: () => void;
    onSubmit: () => void;
    loading: boolean;
}

const WizardStepReview: React.FC<WizardStepReviewProps> = ({
    formData,
    onBack,
    onSubmit,
    loading,
}) => {
    const { theme } = useAppTheme();

    const renderRow = (label: string, value: any, icon?: string) => {
        if (!value) return null;

        return (
            <View style={[styles.row, { borderBottomColor: theme.colors.border.primary }]}>
                <View style={styles.rowLabel}>
                    {icon && <Ionicons name={icon as any} size={16} color={theme.colors.text.tertiary} />}
                    <Text style={[styles.labelText, { color: theme.colors.text.secondary }]}>{label}</Text>
                </View>
                <Text style={[styles.valueText, { color: theme.colors.text.primary }]}>{value}</Text>
            </View>
        );
    };

    return (
        <ScrollView style={[styles.container, { padding: 32 }]} showsVerticalScrollIndicator={false}>
            <Text style={[styles.heading, { color: theme.colors.text.primary }]}>Review & Confirm</Text>
            <Text style={[styles.subheading, { color: theme.colors.text.secondary }]}>Check all information before adding your pet</Text>

            {/* Basic Info Section */}
            <View style={[styles.section, { backgroundColor: theme.colors.background.secondary }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Basic Information</Text>
                {renderRow('Name', formData.name, 'paw')}
                {renderRow('Species', formData.species, 'albums')}
                {renderRow('Breed', formData.breed, 'search')}
                {renderRow('Color', formData.color, 'color-palette')}
                {renderRow('Gender', formData.gender, 'male-female')}
                {renderRow('Date of Birth', formData.date_of_birth, 'calendar')}
                {renderRow('Weight', formData.weight ? `${formData.weight} ${formData.weight_unit}` : null, 'fitness')}
            </View>

            {/* Contact Info Section */}
            <View style={[styles.section, { backgroundColor: theme.colors.background.secondary }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Contact Information</Text>
                {renderRow('Microchip', formData.microchip_number, 'qr-code')}
                {renderRow('Clinic Name', formData.vet_clinic_name, 'business')}
                {renderRow('Veterinarian', formData.vet_name, 'medical')}
                {renderRow('Clinic Address', formData.vet_address, 'location')}
                {renderRow('Clinic Country', formData.vet_country, 'globe')}
                {renderRow('Clinic Phone', formData.vet_phone, 'call')}
                {renderRow('Emergency Contact', formData.emergency_contact_name, 'person')}
                {renderRow('Emergency Phone', formData.emergency_contact_phone, 'call')}
            </View>

            {/* Details Section */}
            <View style={[styles.section, { backgroundColor: theme.colors.background.secondary }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Additional Details</Text>
                {renderRow('Spayed/Neutered', formData.is_spayed_neutered ? 'Yes' : 'No', 'checkmark-circle')}
                {formData.allergies?.length > 0 && renderRow('Allergies', formData.allergies.join(', '), 'alert-circle')}
                {renderRow('Special Needs', formData.special_needs, 'heart')}
                {renderRow('Notes', formData.notes, 'document-text')}
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.backButton, { borderColor: theme.colors.border.primary }]}
                    onPress={onBack}
                    disabled={loading}
                >
                    <Ionicons name="arrow-back" size={20} color={theme.colors.primary[500]} />
                    <Text style={[styles.backButtonText, { color: theme.colors.primary[500] }]}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                            <Text style={styles.submitButtonText}>Add Pet</Text>
                        </>
                    )}
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
    section: {
        marginBottom: 32,
        padding: 20,
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    rowLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    labelText: {
        fontSize: 14,
    },
    valueText: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
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
    submitButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#10B981',
        paddingVertical: 16,
        borderRadius: 12,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default WizardStepReview;
