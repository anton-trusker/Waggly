import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { usePets } from '@/hooks/usePets';
import { supabase } from '@/lib/supabase';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { IconSymbol } from '@/components/ui/IconSymbol';
import EnhancedDatePicker from '@/components/ui/EnhancedDatePicker';
import EnhancedSelection from '@/components/ui/EnhancedSelection';
import AppHeader from '@/components/layout/AppHeader';
import { MEDICINES } from '@/constants/medicines';
import BottomCTA from '@/components/ui/BottomCTA';

export default function AddTreatmentScreen() {
  const { petId: initialPetId } = useLocalSearchParams<{ petId: string }>();
  const { user } = useAuth();
  const { pets } = usePets();

  const [selectedPetId, setSelectedPetId] = useState<string | null>(initialPetId as string || (pets.length > 0 ? pets[0].id : null));
  const [selectedMedId, setSelectedMedId] = useState<string>('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    selectedMedId?: string;
    dosage?: string;
    startDate?: string;
  }>({});

  useEffect(() => {
    if (initialPetId) setSelectedPetId(initialPetId);
  }, [initialPetId]);

  const selectedPet = useMemo(() => pets.find(p => p.id === selectedPetId), [pets, selectedPetId]);

  const medOptions = useMemo(() => {
    return MEDICINES.map(m => ({
        id: m.id,
        label: m.brandName,
        subLabel: `${m.genericName} - ${m.type}`,
        category: m.type
    }));
  }, []);

  // Auto-fill details when med selected
  useEffect(() => {
    if (selectedMedId) {
        const med = MEDICINES.find(m => m.id === selectedMedId);
        if (med) {
            if (!dosage) setDosage(`${med.dosage} ${med.dosageUnit}`);
            if (!frequency) setFrequency(med.frequency);
        }
    }
  }, [selectedMedId]);

  const validate = useCallback(() => {
    const nextErrors: typeof errors = {};
    if (!selectedMedId) {
      nextErrors.selectedMedId = 'Please select a medication';
    }
    if (!dosage.trim()) {
      nextErrors.dosage = 'Please enter dosage';
    }
    if (!startDate) {
      nextErrors.startDate = 'Please select a start date';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [selectedMedId, dosage, startDate]);

  const handleAddTreatment = async () => {
    if (!validate()) return;
    if (!user) return;
    if (!selectedPetId) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }

    setLoading(true);
    const med = MEDICINES.find(m => m.id === selectedMedId);

    try {
      // Create treatment record
      const { data: treatmentData, error: treatmentError } = await supabase
        .from('treatments')
        .insert([{
          pet_id: selectedPetId,
          medication_name: med?.brandName || 'Unknown Med',
          dosage: dosage.trim(),
          frequency: frequency || null,
          start_date: startDate, // Format fix needed if API expects YYYY-MM-DD and date is DD-MM-YYYY
          end_date: endDate || null,
          instructions: instructions || null,
          prescribing_vet: null,
        }])
        .select()
        .single();

      if (treatmentError) throw treatmentError;

      // Create event
      const { error: eventError } = await supabase
        .from('events')
        .insert([{
          user_id: user.id,
          pet_id: selectedPetId,
          type: 'treatment',
          title: `Meds: ${med?.brandName}`,
          start_time: startDate, 
          end_time: endDate || startDate,
          description: `${dosage} - ${frequency}`,
          related_id: treatmentData.id,
        }]);

      if (eventError) throw eventError;

      Alert.alert('Success', 'Treatment added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error adding treatment:', error);
      Alert.alert('Error', 'Failed to add treatment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppHeader title="Add Medication" showBack />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Pet Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>For Pet</Text>
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

          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <IconSymbol ios_icon_name="pill.fill" android_material_icon_name="medication" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Medication Details</Text>
            </View>

            <EnhancedSelection
                label="Medication"
                value={selectedMedId}
                options={medOptions}
                onSelect={(opt) => setSelectedMedId(opt.id)}
                placeholder="Search medication..."
                error={errors.selectedMedId}
                required
                icon="pill.fill"
            />

            <View style={styles.inputRow}>
                 <View style={{ flex: 1 }}>
                     <Text style={styles.inputLabel}>Dosage</Text>
                     <TextInput
                        style={styles.input}
                        value={dosage}
                        onChangeText={setDosage}
                        placeholder="e.g. 1 tablet"
                     />
                 </View>
                 <View style={{ flex: 1 }}>
                     <Text style={styles.inputLabel}>Frequency</Text>
                     <TextInput
                        style={styles.input}
                        value={frequency}
                        onChangeText={setFrequency}
                        placeholder="e.g. Daily"
                     />
                 </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <EnhancedDatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  error={errors.startDate}
                  required
                  icon="calendar"
                />
              </View>
              <View style={styles.inputColumn}>
                <EnhancedDatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  icon="calendar"
                  placeholder="Optional"
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Instructions / Notes</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={instructions}
                onChangeText={setInstructions}
                placeholder="Special instructions..."
                multiline
                numberOfLines={3}
            />

             {/* Info Box */}
            {selectedMedId && (
                <View style={styles.infoBox}>
                    <IconSymbol ios_icon_name="info.circle" android_material_icon_name="info" size={16} color={colors.primary} />
                    <View>
                        <Text style={styles.infoTitle}>About this medication:</Text>
                        <Text style={styles.infoText}>
                            {MEDICINES.find(m => m.id === selectedMedId)?.description}
                        </Text>
                    </View>
                </View>
            )}

          </View>

          {/* Spacer for bottom button */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </TouchableWithoutFeedback>
      
      <BottomCTA 
        onBack={() => router.back()} 
        onPrimary={handleAddTreatment} 
        primaryLabel="Save Treatment" 
        disabled={loading} 
      />
      
      <LoadingOverlay visible={loading} message="Saving treatment..." />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
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
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  inputColumn: {
    flex: 1,
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
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.iconBackgroundBlue,
    padding: 12,
    borderRadius: 8,
    gap: 10,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 18,
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 80, // Raised to avoid tab bar
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
