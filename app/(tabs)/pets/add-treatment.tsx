import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { usePets } from '@/hooks/usePets';
import { supabase } from '@/lib/supabase';
import { useTreatments } from '@/hooks/useTreatments';

// Design System
import { designSystem } from '@/constants/designSystem';
import { TextField } from '@/components/design-system/forms/TextField';
import { SelectField } from '@/components/design-system/forms/SelectField';
import { DateField } from '@/components/design-system/forms/DateField';
import { Button } from '@/components/design-system/primitives/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AppHeader from '@/components/layout/AppHeader';

import { MEDICINES } from '@/constants/medicines';

interface TreatmentFormData {
  medicationId: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  instructions?: string;
}

export default function AddTreatmentScreen() {
  const { petId: initialPetId } = useLocalSearchParams<{ petId: string }>();
  const { user } = useAuth();
  const { pets } = usePets();

  const [selectedPetId, setSelectedPetId] = useState<string | null>(initialPetId as string || (pets.length > 0 ? pets[0].id : null));
  const [loading, setLoading] = useState(false);
  const { addTreatment } = useTreatments(selectedPetId);

  useEffect(() => {
    if (initialPetId) setSelectedPetId(initialPetId);
  }, [initialPetId]);

  const selectedPet = useMemo(() => pets.find(p => p.id === selectedPetId), [pets, selectedPetId]);

  const medOptions = useMemo(() => {
    return MEDICINES.map(m => ({
      value: m.id,
      label: m.brandName,
      // Could show generic name if component supported subtitle, but label is fine
    }));
  }, []);

  const methods = useForm<TreatmentFormData>({
    defaultValues: {
      startDate: new Date(),
      dosage: '',
      frequency: ''
    }
  });

  const { control, handleSubmit, watch, setValue } = methods;
  const medicationId = watch('medicationId');

  // Auto-fill details when med selected
  useEffect(() => {
    if (medicationId) {
      const med = MEDICINES.find(m => m.id === medicationId);
      if (med) {
        setValue('dosage', `${med.dosage} ${med.dosageUnit}`);
        setValue('frequency', med.frequency);
      }
    }
  }, [medicationId, setValue]);

  const onSubmit = async (data: TreatmentFormData) => {
    if (!user || !selectedPetId) return;
    setLoading(true);

    try {
      const med = MEDICINES.find(m => m.id === data.medicationId);

      // Format dates
      const formattedStartDate = data.startDate.toISOString();
      const formattedEndDate = data.endDate?.toISOString() || null;

      const { error } = await addTreatment({
        treatment_name: med?.brandName || 'Unknown',
        dosage: data.dosage,
        frequency: data.frequency,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        notes: data.instructions,
        is_active: true,
      });

      if (error) throw error;
      router.back();

    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', 'Failed to save treatment');
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ title, icon }: { title: string, icon: any }) => (
    <View style={styles.sectionHeader}>
      <IconSymbol android_material_icon_name={icon} ios_icon_name={icon} size={20} color={designSystem.colors.primary[500]} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppHeader title="Add Medication" showBack />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

          {/* Pet Selector */}
          <View style={{ marginBottom: 24 }}>
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

          <FormProvider {...methods}>
            <View style={styles.card}>
              <SectionHeader title="Medication Details" icon="medication" />

              <SelectField
                control={control}
                name="medicationId"
                label="Medication"
                options={medOptions}
                placeholder="Search/Select Medication"
              />

              <View style={styles.row}>
                <View style={styles.col}>
                  <TextField control={control} name="dosage" label="Dosage" placeholder="e.g. 1 tablet" />
                </View>
                <View style={styles.col}>
                  <TextField control={control} name="frequency" label="Frequency" placeholder="e.g. Daily" />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.col}>
                  <DateField control={control} name="startDate" label="Start Date" />
                </View>
                <View style={styles.col}>
                  <DateField control={control} name="endDate" label="End Date" placeholder="Optional" />
                </View>
              </View>

              <TextField
                control={control}
                name="instructions"
                label="Instructions"
                placeholder="Special instructions..."
                multiline
                numberOfLines={3}
              />

              {/* Info Box */}
              {medicationId && (
                <View style={styles.infoBox}>
                  <IconSymbol ios_icon_name="info.circle" android_material_icon_name="info" size={16} color={designSystem.colors.primary[500]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoTitle}>About this medication:</Text>
                    <Text style={styles.infoText}>
                      {MEDICINES.find(m => m.id === medicationId)?.description}
                    </Text>
                  </View>
                </View>
              )}

              <View style={{ marginTop: 24 }}>
                <Button
                  title={loading ? "Saving..." : "Save Treatment"}
                  onPress={handleSubmit(onSubmit)}
                  variant="primary"
                  size="lg"
                  loading={loading}
                />
              </View>
            </View>
          </FormProvider>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designSystem.colors.background.secondary,
  },
  scrollView: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: designSystem.colors.text.secondary,
    marginBottom: 10,
  },
  petRow: { gap: 10 },
  petChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: designSystem.colors.background.primary,
    borderWidth: 1,
    borderColor: designSystem.colors.neutral[200],
  },
  petChipSelected: {
    backgroundColor: designSystem.colors.primary[50],
    borderColor: designSystem.colors.primary[500],
  },
  petChipText: {
    color: designSystem.colors.text.primary,
    fontWeight: '500',
  },
  petChipTextSelected: {
    color: designSystem.colors.primary[700],
  },
  card: {
    backgroundColor: designSystem.colors.background.primary,
    borderRadius: 16,
    padding: 20,
    ...designSystem.shadows.sm,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: designSystem.colors.text.primary,
  },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: designSystem.colors.background.secondary,
    padding: 12,
    borderRadius: 8,
    gap: 10,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: designSystem.colors.primary[700],
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: designSystem.colors.text.secondary,
    lineHeight: 18,
  },
});


