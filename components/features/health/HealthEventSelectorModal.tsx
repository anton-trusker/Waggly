import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface HealthEventSelectorModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (type: 'vaccine' | 'medication' | 'visit') => void;
}

export default function HealthEventSelectorModal({ visible, onClose, onSelect }: HealthEventSelectorModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.content} onPress={(e) => e.stopPPropagation && e.stopPropagation()}>
                    <Text style={styles.title}>Add Health Record</Text>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => onSelect('vaccine')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
                            <Text style={styles.icon}>💉</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.optionTitle}>Vaccination</Text>
                            <Text style={styles.optionDescription}>Log a new vaccine dose</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => onSelect('medication')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
                            <Text style={styles.icon}>💊</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.optionTitle}>Medication</Text>
                            <Text style={styles.optionDescription}>Add a new treatment plan</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => onSelect('visit')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
                            <Text style={styles.icon}>🏥</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.optionTitle}>Vet Visit</Text>
                            <Text style={styles.optionDescription}>Record a checkup or consultation</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
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
