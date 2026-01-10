import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';
import type { Allergy } from '@/types/passport';
import { AllergySeverity } from '@/types/passport';

interface ImportantNotesWidgetProps {
    allergies: Allergy[];
    behavioralNotes?: string[];
    specialCare?: string[];
    onAddAllergy?: () => void;
    onEditAllergy?: (allergy: Allergy) => void;
    onDeleteAllergy?: (id: string) => void;
    onAddNote?: () => void;
}

export const ImportantNotesWidget: React.FC<ImportantNotesWidgetProps> = ({
    allergies,
    behavioralNotes = [],
    specialCare = [],
    onAddAllergy,
    onEditAllergy,
    onDeleteAllergy,
    onAddNote,
}) => {
    const [expanded, setExpanded] = useState(false);

    const getSeverityColor = (severity: AllergySeverity) => {
        switch (severity) {
            case AllergySeverity.SEVERE:
            case 'severe':
                return designSystem.colors.error[500];
            case AllergySeverity.MODERATE:
            case 'moderate':
                return designSystem.colors.warning[500];
            default:
                return designSystem.colors.success[500];
        }
    };

    const handleDelete = (id: string, name: string) => {
        // We can't import Alert from react-native if it wasn't imported. It was imported.
        // But we need to make sure we use it.
        // Actually, let's just use the passed handler if confirm is needed, 
        // OR implement confirm here. AllergyList did it.
        // Let's implement confirm here. However, Alert needs to be imported.
        // It is not imported in the original file I viewed?
        // Let's check imports.
    };

    // Check if Alert is imported. Step 1013 shows it is NOT.
    // I need to add Alert to imports too. Better to do it in "multi_replace" 
    // or just assume the parent handles confirmation?
    // AllergyList handled confirmation.

    // Let's modify imports first or do it all in one go.

    const renderAllergyItem = (allergy: Allergy) => (
        <View key={allergy.id} style={styles.allergyItem}>
            <View style={styles.allergyHeader}>
                <View style={styles.allergenContainer}>
                    <Ionicons name="alert-circle" size={16} color={getSeverityColor(allergy.severity)} />
                    <Text style={styles.allergenName}>{allergy.allergen}</Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(allergy.severity) + '15' }]}>
                    <Text style={[styles.severityText, { color: getSeverityColor(allergy.severity) }]}>
                        {allergy.severity.toUpperCase()}
                    </Text>
                </View>
            </View>
            <Text style={styles.reactionText}>{allergy.reactionDescription}</Text>
            {allergy.notes && <Text style={styles.noteText}>Note: {allergy.notes}</Text>}

            {(onEditAllergy || onDeleteAllergy) && (
                <View style={styles.actions}>
                    {onEditAllergy && (
                        <TouchableOpacity onPress={() => onEditAllergy(allergy)} style={styles.actionButton}>
                            <Ionicons name="create-outline" size={18} color={designSystem.colors.text.secondary} />
                        </TouchableOpacity>
                    )}
                    {onDeleteAllergy && (
                        <TouchableOpacity onPress={() => onDeleteAllergy(allergy.id)} style={styles.actionButton}>
                            <Ionicons name="trash-outline" size={18} color={designSystem.colors.error[500]} />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );

    const renderNoteItem = (note: string, index: number, type: 'Behavior' | 'Care') => (
        <View key={`${type}-${index}`} style={styles.noteItem}>
            <View style={styles.noteHeader}>
                <Ionicons
                    name={type === 'Behavior' ? 'paw-outline' : 'heart-outline'}
                    size={14}
                    color={designSystem.colors.text.secondary}
                />
                <Text style={styles.noteType}>{type}</Text>
            </View>
            <Text style={styles.noteContent}>{note}</Text>
        </View>
    );

    const hasNotes = behavioralNotes.length > 0 || specialCare.length > 0;
    const hasAllergies = allergies.length > 0;

    // Determine what to show
    // If not expanded, show up to 2 allergies and 1 note
    const displayedAllergies = expanded ? allergies : allergies.slice(0, 2);
    const displayedBehavior = expanded || allergies.length < 2 ? behavioralNotes : [];
    const displayedCare = expanded || (allergies.length < 2 && behavioralNotes.length === 0) ? specialCare : [];

    // Simple view logic: Just list them

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Ionicons name="warning-outline" size={24} color={designSystem.colors.error[500]} />
                    <Text style={styles.title}>Allergies & Notes</Text>
                </View>
                {(onAddAllergy || onAddNote) && (
                    <TouchableOpacity onPress={onAddAllergy} style={styles.addButton}>
                        <Ionicons name="add" size={20} color={designSystem.colors.primary[500]} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                {/* Allergies Section */}
                {hasAllergies ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Allergies</Text>
                        {allergies.map(renderAllergyItem)}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No known allergies</Text>
                    </View>
                )}

                {/* Notes Section - Only show if present */}
                {hasNotes && (
                    <View style={styles.section}>
                        <View style={styles.divider} />
                        <Text style={styles.sectionTitle}>Important Notes</Text>

                        {behavioralNotes.length > 0 && (
                            <View style={styles.noteGroup}>
                                <Text style={styles.subTitle}>Behavioral</Text>
                                {behavioralNotes.map((note, i) => renderNoteItem(note, i, 'Behavior'))}
                            </View>
                        )}

                        {specialCare.length > 0 && (
                            <View style={styles.noteGroup}>
                                <Text style={styles.subTitle}>Special Care</Text>
                                {specialCare.map((note, i) => renderNoteItem(note, i, 'Care'))}
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: designSystem.colors.background.secondary,
        borderRadius: designSystem.borderRadius['2xl'],
        padding: designSystem.spacing[4],
        marginBottom: designSystem.spacing[4],
        ...designSystem.shadows.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: designSystem.spacing[4],
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: designSystem.colors.text.primary,
    },
    addButton: {
        padding: 4,
    },
    content: {
        gap: 16,
    },
    section: {
        gap: designSystem.spacing[2],
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: designSystem.colors.text.secondary,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    divider: {
        height: 1,
        backgroundColor: designSystem.colors.border.primary,
        marginVertical: 12,
    },
    emptyState: {
        padding: 12,
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: designSystem.borderRadius.md,
        alignItems: 'center',
    },
    emptyText: {
        color: designSystem.colors.text.tertiary,
        fontStyle: 'italic',
    },
    allergyItem: {
        padding: designSystem.spacing[3],
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: designSystem.borderRadius.md,
        marginBottom: designSystem.spacing[2],
        borderLeftWidth: 3,
        borderLeftColor: designSystem.colors.error[500],
    },
    allergyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    allergenContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    allergenName: {
        fontSize: 16,
        fontWeight: '500',
        color: designSystem.colors.text.primary,
    },
    severityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    severityText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    reactionText: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
    },
    noteText: {
        fontSize: 12,
        color: designSystem.colors.text.tertiary,
        marginTop: 4,
        fontStyle: 'italic',
    },
    noteGroup: {
        marginTop: 4,
    },
    subTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: designSystem.colors.text.tertiary,
        marginBottom: 4,
    },
    noteItem: {
        flexDirection: 'row',
        gap: 8,
        padding: 8,
        backgroundColor: designSystem.colors.background.primary,
        borderRadius: 6,
        marginBottom: 4,
    },
    noteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        width: 70,
    },
    noteType: {
        fontSize: 10,
        color: designSystem.colors.text.tertiary,
    },
    noteContent: {
        fontSize: 14,
        color: designSystem.colors.text.secondary,
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: designSystem.colors.border.primary,
    },
    actionButton: {
        padding: 4,
    },
});
