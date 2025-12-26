import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { usePets } from '@/hooks/usePets';
import { WeightEntry } from '@/types';

interface WeightModalProps {
    visible: boolean;
    onClose: () => void;
    petId: string;
    existingEntry?: WeightEntry | null;
    onSuccess?: () => void;
}

export default function WeightModal({ visible, onClose, petId: initialPetId, existingEntry, onSuccess }: WeightModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const { addWeightEntry, updateWeightEntry } = useWeightEntries(selectedPetId);
    const [loading, setLoading] = useState(false);

    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('kg');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (visible) {
            if (initialPetId) setSelectedPetId(initialPetId);
            else if (pets.length > 0 && !selectedPetId) setSelectedPetId(pets[0].id);

            if (existingEntry) {
                setWeight(String(existingEntry.weight));
                setUnit(existingEntry.unit);
                setDate(existingEntry.date.split('T')[0]);
                setNotes(existingEntry.notes || '');
            } else {
                setWeight('');
                setUnit('kg');
                setDate(new Date().toISOString().split('T')[0]);
                setTime('');
                setNotes('');
            }
        }
    }, [visible, existingEntry, initialPetId, pets]);

    const handleSave = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }
        if (!weight || isNaN(Number(weight))) {
            Alert.alert('Error', 'Please enter a valid weight');
            return;
        }

        setLoading(true);

        const numericWeight = parseFloat(weight);
        const entryData = { weight: numericWeight, unit, date, notes };

        let result;
        if (existingEntry) {
            result = await updateWeightEntry(existingEntry.id, entryData);
        } else {
            result = await addWeightEntry(entryData);
        }

        setLoading(false);

        if (result && !result.error) {
            onSuccess?.();
            onClose();
        } else {
            Alert.alert('Error', result?.error?.message || 'Failed to save weight entry');
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
                        <Text style={styles.headerTitle}>{existingEntry ? 'Edit Weight' : 'Log Weight'}</Text>
                        <TouchableOpacity onPress={handleSave} disabled={loading}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.formContent}>

                            {/* Pet Selector */}
                            {!existingEntry && (
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

                            {/* Weight Details */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="scale" size={20} color="#0A84FF" />
                                    <Text style={styles.sectionTitle}>Weight Details</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.row}>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Weight</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="0.00"
                                                placeholderTextColor="#4B5563"
                                                keyboardType="decimal-pad"
                                                value={weight}
                                                onChangeText={setWeight}
                                            />
                                        </View>
                                        <View style={styles.unitContainer}>
                                            <Text style={styles.label}>Unit</Text>
                                            <View style={styles.unitToggle}>
                                                <TouchableOpacity
                                                    onPress={() => setUnit('kg')}
                                                    style={[styles.unitButton, unit === 'kg' && styles.unitButtonSelected]}
                                                >
                                                    <Text style={[styles.unitText, unit === 'kg' && styles.unitTextSelected]}>kg</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => setUnit('lbs')}
                                                    style={[styles.unitButton, unit === 'lbs' && styles.unitButtonSelected]}
                                                >
                                                    <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextSelected]}>lbs</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Date</Text>
                                            <View style={styles.inputWithIcon}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="YYYY-MM-DD"
                                                    placeholderTextColor="#4B5563"
                                                    value={date}
                                                    onChangeText={setDate}
                                                />
                                                <View style={styles.inputIcon}>
                                                    <Ionicons name="calendar" size={18} color="#6B7280" />
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Time</Text>
                                            <View style={styles.inputWithIcon}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="HH:MM"
                                                    placeholderTextColor="#4B5563"
                                                    value={time}
                                                    onChangeText={setTime}
                                                />
                                                <View style={styles.inputIcon}>
                                                    <Ionicons name="time" size={18} color="#6B7280" />
                                                </View>
                                            </View>
                                        </View>
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
        marginBottom: 8,
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
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    flex1: {
        flex: 1,
    },
    unitContainer: {
        width: 100,
    },
    unitToggle: {
        flexDirection: 'row',
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 4,
    },
    unitButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    unitButtonSelected: {
        backgroundColor: '#3A3A3C',
    },
    unitText: {
        fontWeight: '700',
        color: '#6B7280',
    },
    unitTextSelected: {
        color: '#FFFFFF',
    },
    inputWithIcon: {
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        right: 12,
        top: 14,
    },
});
