import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAllergies } from '@/hooks/useAllergies';
import { usePets } from '@/hooks/usePets';
import { Allergy } from '@/types';

interface AllergyModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    existingAllergy?: Allergy | null;
    onSuccess?: () => void;
}

const SEVERITY_LEVELS = [
    { id: 'mild', label: 'Mild', color: '#22C55E' },
    { id: 'moderate', label: 'Moderate', color: '#F59E0B' },
    { id: 'severe', label: 'Severe', color: '#EF4444' },
];

export default function AllergyModal({ visible, onClose, petId: initialPetId, existingAllergy, onSuccess }: AllergyModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const { addAllergy, updateAllergy } = useAllergies(selectedPetId);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [severity, setSeverity] = useState('moderate');
    const [notes, setNotes] = useState('');
    const [reaction, setReaction] = useState('');

    useEffect(() => {
        if (visible) {
            if (initialPetId) setSelectedPetId(initialPetId);
            else if (pets.length > 0 && !selectedPetId) setSelectedPetId(pets[0].id);

            if (existingAllergy) {
                setName(existingAllergy.allergen);
                setSeverity(existingAllergy.severity_level || 'moderate');
                setNotes(existingAllergy.notes || '');
            } else {
                setName('');
                setSeverity('moderate');
                setNotes('');
                setReaction('');
            }
        }
    }, [visible, existingAllergy, initialPetId, pets]);

    const handleSave = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter allergy name');
            return;
        }

        setLoading(true);

        const allergyData = {
            allergen: name,
            severity_level: severity,
            notes: reaction ? `Reaction: ${reaction}\n${notes}` : notes
        };

        let result;
        if (existingAllergy) {
            result = await updateAllergy(existingAllergy.id, allergyData);
        } else {
            result = await addAllergy(allergyData);
        }

        setLoading(false);

        if (result && !result.error) {
            onSuccess?.();
            onClose();
        } else {
            Alert.alert('Error', result?.error?.message || 'Failed to save allergy');
        }
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{existingAllergy ? 'Edit Allergy' : 'Add Allergy'}</Text>
                        <TouchableOpacity onPress={handleSave} disabled={loading}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.formContent}>

                            {/* Pet Selector */}
                            {!existingAllergy && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionLabel}>WHO IS THIS FOR?</Text>
                                    <View style={styles.petRow}>
                                        {petsLoading ? (
                                            <ActivityIndicator color="#0A84FF" />
                                        ) : (
                                            pets.map((pet) => (
                                                <TouchableOpacity
                                                    key={pet.id}
                                                    onPress={() => setSelectedPetId(pet.id)}
                                                    style={styles.petItem}
                                                >
                                                    <View style={[styles.petAvatar, selectedPetId === pet.id && styles.petAvatarSelected]}>
                                                        {pet.photo_url ? (
                                                            <Image source={{ uri: pet.photo_url }} style={styles.petImage} />
                                                        ) : (
                                                            <Ionicons name="paw" size={32} color={selectedPetId === pet.id ? '#FFFFFF' : '#6B7280'} />
                                                        )}
                                                        {selectedPetId === pet.id && (
                                                            <View style={styles.checkmark}>
                                                                <Ionicons name="checkmark" size={12} color="white" />
                                                            </View>
                                                        )}
                                                    </View>
                                                    <Text style={[styles.petName, selectedPetId === pet.id && styles.petNameSelected]}>
                                                        {pet.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))
                                        )}
                                    </View>
                                </View>
                            )}

                            {/* Allergy Details */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="warning" size={20} color="#F59E0B" />
                                    <Text style={styles.sectionTitle}>Allergy Details</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Allergy Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g. Peanuts, Bee Stings"
                                            placeholderTextColor="#4B5563"
                                            value={name}
                                            onChangeText={setName}
                                        />
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Severity</Text>
                                        <View style={styles.severityRow}>
                                            {SEVERITY_LEVELS.map((level) => (
                                                <TouchableOpacity
                                                    key={level.id}
                                                    onPress={() => setSeverity(level.id)}
                                                    style={[
                                                        styles.severityButton,
                                                        severity === level.id && { borderColor: level.color, backgroundColor: `${level.color}20` }
                                                    ]}
                                                >
                                                    <Text style={[styles.severityText, { color: severity === level.id ? level.color : '#6B7280' }]}>
                                                        {level.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Reaction Details</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g. Swelling, Hives"
                                            placeholderTextColor="#4B5563"
                                            value={reaction}
                                            onChangeText={setReaction}
                                        />
                                    </View>

                                    <View style={styles.fieldGroup}>
                                        <Text style={styles.label}>Notes</Text>
                                        <TextInput
                                            style={[styles.input, styles.textArea]}
                                            placeholder="Additional notes..."
                                            placeholderTextColor="#4B5563"
                                            multiline
                                            textAlignVertical="top"
                                            value={notes}
                                            onChangeText={setNotes}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={{ height: 40 }} />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 700,
        backgroundColor: '#0F0F10',
        borderRadius: 24,
        maxHeight: '90%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    cancelText: {
        color: '#9CA3AF',
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    saveText: {
        color: '#0A84FF',
        fontSize: 17,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    formContent: {
        padding: 20,
        gap: 24,
    },
    section: {
        gap: 12,
    },
    sectionLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    petRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    petItem: {
        alignItems: 'center',
        gap: 8,
    },
    petAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2C2C2E',
    },
    petAvatarSelected: {
        backgroundColor: '#0A84FF',
    },
    petImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    checkmark: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#22C55E',
        borderRadius: 10,
        padding: 2,
        borderWidth: 2,
        borderColor: '#1C1C1E',
    },
    petName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    petNameSelected: {
        color: '#0A84FF',
    },
    card: {
        backgroundColor: '#2C2C2E',
        borderRadius: 16,
        padding: 16,
        gap: 16,
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#FFFFFF',
        fontSize: 16,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: 16,
    },
    severityRow: {
        flexDirection: 'row',
        gap: 8,
    },
    severityButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
        backgroundColor: '#1C1C1E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    severityText: {
        fontWeight: '700',
        fontSize: 14,
    },
});
