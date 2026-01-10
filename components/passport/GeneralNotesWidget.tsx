import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designSystem } from '@/constants/designSystem';

interface GeneralNotesWidgetProps {
    behavioralNotes?: string[];
    specialCare?: string[];
    onAddNote?: () => void;
}

export const GeneralNotesWidget: React.FC<GeneralNotesWidgetProps> = ({
    behavioralNotes = [],
    specialCare = [],
    onAddNote,
}) => {
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Ionicons name="document-text-outline" size={24} color={designSystem.colors.primary[500]} />
                    <Text style={styles.title}>General Notes</Text>
                </View>
                {onAddNote && (
                    <TouchableOpacity onPress={onAddNote} style={styles.addButton}>
                        <Ionicons name="add" size={20} color={designSystem.colors.primary[500]} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                {hasNotes ? (
                    <View style={styles.section}>
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
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No special notes or behavioral entries</Text>
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
});
