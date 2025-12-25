import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChangeSummaryModalProps {
    visible: boolean;
    onClose: () => void;
    changes: Record<string, { original: any, new: any }>;
    onConfirm: () => void;
}

export default function ChangeSummaryModal({ visible, onClose, changes, onConfirm }: ChangeSummaryModalProps) {
    if (!visible) return null;

    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity activeOpacity={1} style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Review Changes</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {Object.keys(changes).length === 0 ? (
                            <Text style={styles.noChanges}>No changes detected.</Text>
                        ) : (
                            Object.entries(changes).map(([field, values]) => (
                                <View key={field} style={styles.changeRow}>
                                    <Text style={styles.fieldName}>{field.replace(/_/g, ' ')}</Text>
                                    <View style={styles.diffContainer}>
                                        <Text style={[styles.value, styles.oldValue]}>
                                            {String(values.original ?? 'Empty')}
                                        </Text>
                                        <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
                                        <Text style={[styles.value, styles.newValue]}>
                                            {String(values.new)}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.confirmText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#fff',
        borderRadius: 16,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    content: {
        padding: 24,
    },
    noChanges: {
        textAlign: 'center',
        color: '#6B7280',
        fontStyle: 'italic',
    },
    changeRow: {
        marginBottom: 16,
    },
    fieldName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    diffContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 8,
    },
    value: {
        flex: 1,
        fontSize: 14,
    },
    oldValue: {
        color: '#EF4444',
        textDecorationLine: 'line-through',
    },
    newValue: {
        color: '#10B981',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12,
    },
    cancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cancelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    confirmButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#6366F1',
    },
    confirmText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
});
