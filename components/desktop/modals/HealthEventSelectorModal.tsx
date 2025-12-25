import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface HealthEventSelectorModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (type: 'vaccination' | 'visit' | 'treatment' | 'weight') => void;
}

export default function HealthEventSelectorModal({ visible, onClose, onSelect }: HealthEventSelectorModalProps) {
    if (!visible) return null;

    const options = [
        { id: 'vaccination', label: 'Vaccination', icon: 'medical', color: '#10B981', bg: '#D1FAE5' },
        { id: 'visit', label: 'Vet Visit', icon: 'fitness', color: '#6366F1', bg: '#E0E7FF' },
        { id: 'treatment', label: 'Treatment', icon: 'bandage', color: '#F59E0B', bg: '#FDE68A' },
        { id: 'weight', label: 'Weight Entry', icon: 'scale', color: '#8B5CF6', bg: '#EDE9FE' },
    ];

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                    <TouchableWithoutFeedback>
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Log Health Event</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Ionicons name="close" size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.subtitle}>What would you like to record?</Text>

                            <View style={styles.grid}>
                                {options.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={styles.card}
                                        onPress={() => {
                                            onSelect(option.id as any);
                                            onClose();
                                        }}
                                    >
                                        <View style={[styles.icon, { backgroundColor: option.bg }]}>
                                            <Ionicons name={option.icon as any} size={32} color={option.color} />
                                        </View>
                                        <Text style={styles.label}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    card: {
        width: '47%', // roughly half - gap
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    icon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
});
