// Emergency Contact List Widget
// Displays emergency contacts

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { EmergencyContact } from '@/types/passport';
import { designSystem } from '@/constants/designSystem';

interface EmergencyContactListProps {
    contacts: EmergencyContact[];
    onAdd?: () => void;
    onEdit?: (contact: EmergencyContact) => void;
    onDelete?: (id: string) => void;
}

export default function EmergencyContactList({
    contacts,
    onAdd,
    onEdit,
    onDelete
}: EmergencyContactListProps) {
    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Delete Contact",
            `Are you sure you want to delete ${name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => onDelete?.(id)
                }
            ]
        );
    };

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>EMERGENCY CONTACTS</Text>
                <Ionicons name="medical" size={20} color={designSystem.colors.status.error[500]} />
            </View>

            {contacts.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No emergency contacts recorded</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {contacts.map((contact) => (
                        <View key={contact.id} style={[styles.card, contact.isPrimary && styles.primaryCard]}>
                            {contact.isPrimary && (
                                <View style={styles.primaryBadge}>
                                    <Text style={styles.primaryText}>PRIMARY</Text>
                                </View>
                            )}

                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.name}>{contact.name}</Text>
                                    <Text style={styles.typeRelationship}>
                                        {contact.contactType} • {contact.relationship || 'No relationship'}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => handleCall(contact.phone)} style={styles.callButton}>
                                    <Ionicons name="call" size={20} color="#ffffff" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.details}>
                                <View style={styles.detailRow}>
                                    <Ionicons name="call-outline" size={14} color={designSystem.colors.text.secondary} />
                                    <Text style={styles.detailText}>{contact.phone}</Text>
                                </View>
                                {contact.email && (
                                    <View style={styles.detailRow}>
                                        <Ionicons name="mail-outline" size={14} color={designSystem.colors.text.secondary} />
                                        <Text style={styles.detailText}>{contact.email}</Text>
                                    </View>
                                )}
                                {contact.address && (
                                    <View style={styles.detailRow}>
                                        <Ionicons name="location-outline" size={14} color={designSystem.colors.text.secondary} />
                                        <Text style={styles.detailText}>{contact.address}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Actions */}
                            {(onEdit || onDelete) && (
                                <View style={styles.actions}>
                                    {onEdit && (
                                        <TouchableOpacity onPress={() => onEdit(contact)} style={styles.actionButton}>
                                            <Ionicons name="create-outline" size={18} color={designSystem.colors.text.secondary} />
                                        </TouchableOpacity>
                                    )}
                                    {onDelete && (
                                        <TouchableOpacity onPress={() => handleDelete(contact.id, contact.name)} style={styles.actionButton}>
                                            <Ionicons name="trash-outline" size={18} color={designSystem.colors.status.error[500]} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {onAdd && (
                <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                    <Ionicons name="add" size={18} color={designSystem.colors.primary[500]} />
                    <Text style={styles.addButtonText}>Add Contact</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: designSystem.colors.background.secondary,
        borderRadius: designSystem.borderRadius['2xl'],
        padding: designSystem.spacing[5],
        marginBottom: designSystem.spacing[4],
        ...designSystem.shadows.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: designSystem.spacing[4],
        paddingBottom: designSystem.spacing[3],
        borderBottomWidth: 2,
        borderBottomColor: designSystem.colors.error[500],
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: designSystem.colors.text.primary,
    },
    list: {
        gap: designSystem.spacing[3],
    },
    card: {
        backgroundColor: designSystem.colors.background.tertiary,
        borderRadius: designSystem.borderRadius.md,
        padding: designSystem.spacing[3],
        borderLeftWidth: 4,
        borderLeftColor: designSystem.colors.neutral[300],
    },
    primaryCard: {
        backgroundColor: designSystem.colors.error[50],
        borderLeftColor: designSystem.colors.error[500],
    },
    primaryBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: designSystem.colors.status.error[500],
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8, // Match card radius if needed, or 0
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    primaryText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: designSystem.colors.text.primary,
    },
    typeRelationship: {
        fontSize: 12,
        color: designSystem.colors.text.tertiary,
    },
    callButton: {
        backgroundColor: designSystem.colors.status.success[500],
        padding: 8,
        borderRadius: 20,
    },
    details: {
        gap: 4,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        color: designSystem.colors.text.secondary,
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: designSystem.spacing[3],
        marginTop: designSystem.spacing[2],
        borderTopWidth: 1,
        borderTopColor: designSystem.colors.border.primary,
        paddingTop: designSystem.spacing[2],
    },
    actionButton: {
        padding: 4,
    },
    emptyState: {
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        color: designSystem.colors.text.tertiary,
        fontStyle: 'italic',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        paddingVertical: 8,
        gap: 4,
    },
    addButtonText: {
        color: designSystem.colors.primary[500],
        fontSize: 14,
        fontWeight: '600',
    },
});
