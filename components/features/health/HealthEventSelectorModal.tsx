import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface HealthEventSelectorModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (type: 'vaccination' | 'visit' | 'treatment' | 'weight' | 'medication') => void;
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
                <Pressable style={styles.content} onPress={(e) => e.stopPropagation && e.stopPropagation()}>
                    <Text style={styles.title}>Add Health Record</Text>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => onSelect('vaccination')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
                            <Text style={styles.iconEmoji}>💉</Text>
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
                            <Text style={styles.iconEmoji}>💊</Text>
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
                            <Text style={styles.iconEmoji}>🏥</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.optionTitle}>Vet Visit</Text>
                            <Text style={styles.optionDescription}>Record a checkup or consultation</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => onSelect('weight')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#F5F3FF' }]}>
                            <Text style={styles.iconEmoji}>⚖️</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.optionTitle}>Weight</Text>
                            <Text style={styles.optionDescription}>Record current weight</Text>
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
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconEmoji: {
        fontSize: 24,
    },
    textContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    optionDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    arrow: {
        fontSize: 24,
        color: '#9CA3AF',
        marginLeft: 8,
    },
});
