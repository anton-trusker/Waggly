import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { usePets } from '@/hooks/usePets';
import UniversalDatePicker from './shared/UniversalDatePicker';

interface HealthMetricsModalProps {
    visible: boolean;
    onClose: () => void;
    petId?: string;
    onSuccess?: () => void;
}

const BODY_CONDITION_SCORES = [
    { score: 1, label: 'Emaciated', description: 'Ribs, spine visible', color: '#EF4444', emoji: '😟' },
    { score: 2, label: 'Very Thin', description: 'Ribs easily felt', color: '#F97316', emoji: '😕' },
    { score: 3, label: 'Thin', description: 'Ribs visible', color: '#F59E0B', emoji: '😐' },
    { score: 4, label: 'Underweight', description: 'Ribs easily felt, minimal fat', color: '#EAB308', emoji: '🙂' },
    { score: 5, label: 'Ideal', description: 'Ribs felt with slight cover', color: '#22C55E', emoji: '😊' },
    { score: 6, label: 'Overweight', description: 'Ribs palpable with fat', color: '#EAB308', emoji: '🙂' },
    { score: 7, label: 'Heavy', description: 'Ribs hard to feel', color: '#F59E0B', emoji: '😐' },
    { score: 8, label: 'Obese', description: 'Fat deposits visible', color: '#F97316', emoji: '😕' },
    { score: 9, label: 'Severely Obese', description: 'Obvious fat deposits', color: '#EF4444', emoji: '😟' },
];

const ACTIVITY_LEVELS = ['Very Low', 'Low', 'Normal', 'High', 'Very High'];
const APPETITE_LEVELS = ['Not Eating', 'Reduced', 'Normal', 'Increased'];
const ENERGY_LEVELS = ['Lethargic', 'Low', 'Normal', 'Very Active'];
const COAT_CONDITIONS = ['Poor', 'Dull', 'Normal', 'Shiny'];
const STOOL_QUALITIES = ['Diarrhea', 'Soft', 'Normal', 'Hard'];

export default function HealthMetricsModal({ visible, onClose, petId: initialPetId, onSuccess }: HealthMetricsModalProps) {
    const { pets, loading: petsLoading } = usePets();
    const [selectedPetId, setSelectedPetId] = useState<string>(initialPetId || '');
    const [loading, setLoading] = useState(false);

    // Form state
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
    const [temperature, setTemperature] = useState('');
    const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
    const [heartRate, setHeartRate] = useState('');
    const [respiratoryRate, setRespiratoryRate] = useState('');
    const [bodyConditionScore, setBodyConditionScore] = useState<number | null>(null);
    const [activityLevel, setActivityLevel] = useState('Normal');
    const [appetiteLevel, setAppetiteLevel] = useState('Normal');
    const [energyLevel, setEnergyLevel] = useState('Normal');
    const [coatCondition, setCoatCondition] = useState('Normal');
    const [stoolQuality, setStoolQuality] = useState('Normal');
    const [notes, setNotes] = useState('');

    const selectedPet = useMemo(() => pets.find(p => p.id === selectedPetId), [pets, selectedPetId]);

    useEffect(() => {
        if (initialPetId) {
            setSelectedPetId(initialPetId);
        } else if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(pets[0].id);
        }
    }, [initialPetId, pets, selectedPetId]);

    const resetForm = () => {
        setDate(new Date().toISOString().split('T')[0]);
        setWeight('');
        setWeightUnit('kg');
        setTemperature('');
        setTemperatureUnit('C');
        setHeartRate('');
        setRespiratoryRate('');
        setBodyConditionScore(null);
        setActivityLevel('Normal');
        setAppetiteLevel('Normal');
        setEnergyLevel('Normal');
        setCoatCondition('Normal');
        setStoolQuality('Normal');
        setNotes('');
        if (!initialPetId && pets.length > 0) {
            setSelectedPetId(pets[0].id);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPetId) {
            Alert.alert('Error', 'Please select a pet');
            return;
        }

        setLoading(true);
        try {
            const metricsData = {
                pet_id: selectedPetId,
                date: date,
                weight: weight ? parseFloat(weight) : null,
                weight_unit: weightUnit,
                temperature: temperature ? parseFloat(temperature) : null,
                temperature_unit: temperatureUnit,
                heart_rate: heartRate ? parseInt(heartRate) : null,
                respiratory_rate: respiratoryRate ? parseInt(respiratoryRate) : null,
                body_condition_score: bodyConditionScore,
                notes: notes || null,
            };

            const { error } = await supabase
                .from('health_metrics')
                .insert(metricsData as any);

            if (error) throw error;

            Alert.alert('Success', 'Health metrics recorded');
            resetForm();
            onSuccess?.();
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        const item = BODY_CONDITION_SCORES.find(b => b.score === score);
        return item?.color || '#6B7280';
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Health Check</Text>
                        <TouchableOpacity onPress={handleSubmit} disabled={loading} style={styles.headerButton}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#0A84FF" />
                            ) : (
                                <Text style={styles.saveText}>Save</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.formContent}>

                            {/* Pet Selector */}
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
                                                        <Ionicons name="paw" size={28} color={selectedPetId === pet.id ? '#FFFFFF' : '#6B7280'} />
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

                            {/* Date */}
                            <View style={styles.section}>
                                <UniversalDatePicker
                                    label="Date"
                                    value={date}
                                    onChange={setDate}
                                    mode="date"
                                />
                            </View>

                            {/* Vitals */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="pulse" size={20} color="#EF4444" />
                                    <Text style={styles.sectionTitle}>Vital Signs</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.row}>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Weight</Text>
                                            <View style={styles.unitRow}>
                                                <TextInput
                                                    style={[styles.input, styles.flex1]}
                                                    placeholder="0.0"
                                                    placeholderTextColor="#4B5563"
                                                    keyboardType="decimal-pad"
                                                    value={weight}
                                                    onChangeText={setWeight}
                                                />
                                                <View style={styles.unitSelector}>
                                                    {(['kg', 'lb'] as const).map(u => (
                                                        <TouchableOpacity
                                                            key={u}
                                                            style={[styles.unitButton, weightUnit === u && styles.unitButtonActive]}
                                                            onPress={() => setWeightUnit(u)}
                                                        >
                                                            <Text style={[styles.unitText, weightUnit === u && styles.unitTextActive]}>{u}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Temperature</Text>
                                            <View style={styles.unitRow}>
                                                <TextInput
                                                    style={[styles.input, styles.flex1]}
                                                    placeholder="38.5"
                                                    placeholderTextColor="#4B5563"
                                                    keyboardType="decimal-pad"
                                                    value={temperature}
                                                    onChangeText={setTemperature}
                                                />
                                                <View style={styles.unitSelector}>
                                                    {(['C', 'F'] as const).map(u => (
                                                        <TouchableOpacity
                                                            key={u}
                                                            style={[styles.unitButton, temperatureUnit === u && styles.unitButtonActive]}
                                                            onPress={() => setTemperatureUnit(u)}
                                                        >
                                                            <Text style={[styles.unitText, temperatureUnit === u && styles.unitTextActive]}>°{u}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Heart Rate (bpm)</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="70-120"
                                                placeholderTextColor="#4B5563"
                                                keyboardType="number-pad"
                                                value={heartRate}
                                                onChangeText={setHeartRate}
                                            />
                                        </View>
                                        <View style={styles.flex1}>
                                            <Text style={styles.label}>Breathing Rate</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="15-30"
                                                placeholderTextColor="#4B5563"
                                                keyboardType="number-pad"
                                                value={respiratoryRate}
                                                onChangeText={setRespiratoryRate}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Body Condition Score */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="body" size={20} color="#8B5CF6" />
                                    <Text style={styles.sectionTitle}>Body Condition Score</Text>
                                </View>

                                <View style={styles.bcsContainer}>
                                    <View style={styles.bcsScale}>
                                        {BODY_CONDITION_SCORES.map(item => (
                                            <TouchableOpacity
                                                key={item.score}
                                                style={[
                                                    styles.bcsItem,
                                                    bodyConditionScore === item.score && { backgroundColor: item.color + '30', borderColor: item.color }
                                                ]}
                                                onPress={() => setBodyConditionScore(item.score)}
                                            >
                                                <Text style={[styles.bcsEmoji, bodyConditionScore === item.score && { transform: [{ scale: 1.2 }] }]}>
                                                    {item.emoji}
                                                </Text>
                                                <Text style={[styles.bcsScore, bodyConditionScore === item.score && { color: item.color }]}>
                                                    {item.score}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    {bodyConditionScore && (
                                        <View style={[styles.bcsDescription, { backgroundColor: getScoreColor(bodyConditionScore) + '20' }]}>
                                            <Text style={[styles.bcsLabel, { color: getScoreColor(bodyConditionScore) }]}>
                                                {BODY_CONDITION_SCORES.find(b => b.score === bodyConditionScore)?.label}
                                            </Text>
                                            <Text style={styles.bcsDescText}>
                                                {BODY_CONDITION_SCORES.find(b => b.score === bodyConditionScore)?.description}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Wellness Indicators */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="happy" size={20} color="#10B981" />
                                    <Text style={styles.sectionTitle}>Wellness Indicators</Text>
                                </View>

                                <View style={styles.card}>
                                    <View style={styles.indicatorRow}>
                                        <Text style={styles.indicatorLabel}>🏃 Activity</Text>
                                        <View style={styles.pillGroup}>
                                            {ACTIVITY_LEVELS.map(level => (
                                                <TouchableOpacity
                                                    key={level}
                                                    style={[styles.pill, activityLevel === level && styles.pillActive]}
                                                    onPress={() => setActivityLevel(level)}
                                                >
                                                    <Text style={[styles.pillText, activityLevel === level && styles.pillTextActive]}>{level}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={styles.indicatorRow}>
                                        <Text style={styles.indicatorLabel}>🍽️ Appetite</Text>
                                        <View style={styles.pillGroup}>
                                            {APPETITE_LEVELS.map(level => (
                                                <TouchableOpacity
                                                    key={level}
                                                    style={[styles.pill, appetiteLevel === level && styles.pillActive]}
                                                    onPress={() => setAppetiteLevel(level)}
                                                >
                                                    <Text style={[styles.pillText, appetiteLevel === level && styles.pillTextActive]}>{level}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={styles.indicatorRow}>
                                        <Text style={styles.indicatorLabel}>⚡ Energy</Text>
                                        <View style={styles.pillGroup}>
                                            {ENERGY_LEVELS.map(level => (
                                                <TouchableOpacity
                                                    key={level}
                                                    style={[styles.pill, energyLevel === level && styles.pillActive]}
                                                    onPress={() => setEnergyLevel(level)}
                                                >
                                                    <Text style={[styles.pillText, energyLevel === level && styles.pillTextActive]}>{level}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={styles.indicatorRow}>
                                        <Text style={styles.indicatorLabel}>✨ Coat</Text>
                                        <View style={styles.pillGroup}>
                                            {COAT_CONDITIONS.map(level => (
                                                <TouchableOpacity
                                                    key={level}
                                                    style={[styles.pill, coatCondition === level && styles.pillActive]}
                                                    onPress={() => setCoatCondition(level)}
                                                >
                                                    <Text style={[styles.pillText, coatCondition === level && styles.pillTextActive]}>{level}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={styles.indicatorRow}>
                                        <Text style={styles.indicatorLabel}>💩 Stool</Text>
                                        <View style={styles.pillGroup}>
                                            {STOOL_QUALITIES.map(level => (
                                                <TouchableOpacity
                                                    key={level}
                                                    style={[styles.pill, stoolQuality === level && styles.pillActive]}
                                                    onPress={() => setStoolQuality(level)}
                                                >
                                                    <Text style={[styles.pillText, stoolQuality === level && styles.pillTextActive]}>{level}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Notes */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="document-text" size={20} color="#6B7280" />
                                    <Text style={styles.sectionTitle}>Notes</Text>
                                </View>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Any observations or concerns..."
                                    placeholderTextColor="#4B5563"
                                    multiline
                                    textAlignVertical="top"
                                    value={notes}
                                    onChangeText={setNotes}
                                />
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 700,
        backgroundColor: '#0F0F10',
        borderRadius: 24,
        maxHeight: '92%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#1C1C1E',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1C1C1E',
    },
    headerButton: {
        minWidth: 60,
    },
    cancelText: {
        color: '#9CA3AF',
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    saveText: {
        color: '#0A84FF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'right',
    },
    scrollView: {
        flex: 1,
    },
    formContent: {
        padding: 24,
        gap: 24,
    },
    section: {
        gap: 12,
    },
    sectionLabel: {
        color: '#6B7280',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 20,
        gap: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    flex1: {
        flex: 1,
    },
    label: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#3C3C3E',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: 14,
    },
    unitRow: {
        flexDirection: 'row',
        gap: 8,
    },
    unitSelector: {
        flexDirection: 'row',
        backgroundColor: '#2C2C2E',
        borderRadius: 10,
        padding: 4,
    },
    unitButton: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
    },
    unitButtonActive: {
        backgroundColor: '#0A84FF',
    },
    unitText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
    },
    unitTextActive: {
        color: '#FFFFFF',
    },
    petRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginTop: 8,
    },
    petItem: {
        alignItems: 'center',
        gap: 6,
    },
    petAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2C2C2E',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    petAvatarSelected: {
        backgroundColor: '#0A84FF',
        borderColor: '#0A84FF',
    },
    petImage: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    petName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    petNameSelected: {
        color: '#0A84FF',
    },
    // Body Condition Score
    bcsContainer: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 16,
    },
    bcsScale: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 4,
    },
    bcsItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    bcsEmoji: {
        fontSize: 20,
    },
    bcsScore: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        marginTop: 4,
    },
    bcsDescription: {
        marginTop: 14,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    bcsLabel: {
        fontSize: 15,
        fontWeight: '700',
    },
    bcsDescText: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 2,
    },
    // Wellness Indicators
    indicatorRow: {
        gap: 10,
    },
    indicatorLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    pillGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        backgroundColor: '#2C2C2E',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#3C3C3E',
    },
    pillActive: {
        backgroundColor: '#0A84FF20',
        borderColor: '#0A84FF',
    },
    pillText: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    pillTextActive: {
        color: '#0A84FF',
    },
});
