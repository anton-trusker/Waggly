import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { designSystem, getSpacing } from '@/constants/designSystem';
import AppHeader from '@/components/layout/AppHeader';
import { usePets } from '@/hooks/usePets';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { IconSymbol } from '@/components/ui/IconSymbol';
import DateInput from '@/components/ui/DateInput';
import BottomCTA from '@/components/ui/BottomCTA';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function LogWeightScreen() {
  const { petId: initialPetId } = useLocalSearchParams();
  const { pets } = usePets();
  
  const [selectedPetId, setSelectedPetId] = useState<string | null>(initialPetId as string || (pets.length > 0 ? pets[0].id : null));
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch entries for selected pet
  const { weightEntries, loading: entriesLoading, addWeightEntry, deleteWeightEntry } = useWeightEntries(selectedPetId);

  // Update selected pet if initialPetId changes (though unlikely in this flow)
  useEffect(() => {
    if (initialPetId) setSelectedPetId(initialPetId as string);
  }, [initialPetId]);

  const handleSave = async () => {
    if (!weight || !date) {
        Alert.alert('Error', 'Please enter weight and date');
        return;
    }
    if (!selectedPetId) {
        Alert.alert('Error', 'Please select a pet');
        return;
    }

    setSaving(true);
    const { error } = await addWeightEntry({
        weight: parseFloat(weight),
        date,
        notes: notes.trim() || null,
    });
    setSaving(false);

    if (error) {
        Alert.alert('Error', 'Failed to save weight');
    } else {
        setWeight('');
        setNotes('');
        Alert.alert('Success', 'Weight logged successfully');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { 
            text: 'Delete', 
            style: 'destructive', 
            onPress: async () => {
                await deleteWeightEntry(id);
            }
        }
    ]);
  };

  const selectedPet = pets.find(p => p.id === selectedPetId);

  return (
    <View style={styles.container}>
      <AppHeader title="Log Weight" showBack />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Pet Selector */}
        <View style={styles.section}>
            <Text style={styles.label}>Pet</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petRow}>
                {pets.map(pet => (
                    <TouchableOpacity 
                        key={pet.id} 
                        style={[styles.petChip, selectedPetId === pet.id && styles.petChipSelected]}
                        onPress={() => setSelectedPetId(pet.id)}
                    >
                        <Text style={[styles.petChipText, selectedPetId === pet.id && styles.petChipTextSelected]}>{pet.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* Current Stats */}
        {selectedPet && (
            <View style={styles.statsCard}>
                <View>
                    <Text style={styles.statsLabel}>Latest Weight</Text>
                    <Text style={styles.statsValue}>
                        {weightEntries.length > 0 ? `${weightEntries[0].weight} kg` : 'No data'}
                    </Text>
                </View>
                <View>
                    <Text style={styles.statsLabel}>Target</Text>
                    <Text style={styles.statsValue}>--</Text>
                </View>
            </View>
        )}

        {/* Input Form */}
        <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>New Entry</Text>
            
            <View style={styles.inputRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Weight (kg)</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="0.0" 
                        keyboardType="decimal-pad"
                        value={weight}
                        onChangeText={setWeight}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <DateInput value={date} onChange={setDate} label="Date" />
                </View>
            </View>

            <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Notes (optional)" 
                multiline
                numberOfLines={2}
                value={notes}
                onChangeText={setNotes}
            />
        </View>

        {/* History List */}
        <Text style={styles.historyTitle}>History</Text>
        {entriesLoading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
            <View style={styles.historyList}>
                {weightEntries.length === 0 ? (
                    <Text style={styles.emptyText}>No weight history yet.</Text>
                ) : (
                    weightEntries.map((entry) => (
                        <View key={entry.id} style={styles.historyItem}>
                            <View style={styles.historyLeft}>
                                <Text style={styles.historyWeight}>{entry.weight} kg</Text>
                                <Text style={styles.historyDate}>{entry.date}</Text>
                            </View>
                            <View style={styles.historyRight}>
                                {entry.notes && <Text style={styles.historyNotes} numberOfLines={1}>{entry.notes}</Text>}
                                <TouchableOpacity onPress={() => handleDelete(entry.id)} style={styles.deleteButton}>
                                    <IconSymbol ios_icon_name="trash" android_material_icon_name="delete" size={16} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  petRow: {
    gap: 10,
  },
  petChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  petChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  petChipText: {
    color: colors.text,
    fontWeight: '500',
  },
  petChipTextSelected: {
    color: '#fff',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.iconBackgroundBlue, // Light primary
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statsLabel: {
    fontSize: 12,
    color: colors.primaryDark,
    marginBottom: 4,
    fontWeight: '600',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyLeft: {
    flex: 1,
  },
  historyWeight: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  historyNotes: {
    fontSize: 12,
    color: colors.textSecondary,
    maxWidth: 150,
  },
  deleteButton: {
    padding: 4,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
