import React, { useState, useEffect } from 'react';
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

// Design System
import { designSystem } from '@/constants/designSystem';
import { TextField } from '@/components/design-system/forms/TextField';
import { DateField } from '@/components/design-system/forms/DateField';
import { Button } from '@/components/design-system/primitives/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AppHeader from '@/components/layout/AppHeader';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';

interface VisitFormData {
  title: string;
  date: Date;
  time: string; // HH:MM
  location: string;
  notes: string;
}

export default function AddVisitScreen() {
  const { petId: initialPetId } = useLocalSearchParams<{ petId: string }>();
  const { user } = useAuth();
  const { pets } = usePets();

  const [selectedPetId, setSelectedPetId] = useState<string | null>(initialPetId as string || (pets.length > 0 ? pets[0].id : null));
  const [loading, setLoading] = useState(false);
  const [locationDetails, setLocationDetails] = useState<{ lat: number, lng: number, placeId: string } | null>(null);

  const methods = useForm<VisitFormData>({
    defaultValues: {
      title: '',
      date: new Date(),
      time: '',
      location: '',
      notes: ''
    }
  });

  const { control, handleSubmit, setValue, watch } = methods;

  useEffect(() => {
    if (initialPetId) setSelectedPetId(initialPetId);
  }, [initialPetId]);

  const onSubmit = async (data: VisitFormData) => {
    if (!user || !selectedPetId) return;
    setLoading(true);

    try {
      let startTime = data.date.toISOString().split('T')[0]; // YYYY-MM-DD
      if (data.time) {
        startTime = `${startTime}T${data.time}:00`;
      } else {
        startTime = `${startTime}T09:00:00`;
      }

      const { error } = await supabase
        .from('events')
        .insert([{
          user_id: user.id,
          pet_id: selectedPetId,
          type: 'vet',
          title: data.title,
          start_time: startTime,
          location: data.location || null,
          location_lat: locationDetails?.lat || null,
          location_lng: locationDetails?.lng || null,
          place_id: locationDetails?.placeId || null,
          description: data.notes || null,
        }]);

      if (error) throw error;

      Alert.alert('Success', 'Visit added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', 'Failed to add visit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppHeader title="Add Visit" showBack />

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
              <View style={styles.sectionHeader}>
                <IconSymbol ios_icon_name="stethoscope" android_material_icon_name="medical_services" size={20} color={designSystem.colors.primary[500]} />
                <Text style={styles.sectionTitle}>Visit Details</Text>
              </View>

              <TextField control={control} name="title" label="Visit Title" placeholder="e.g. Annual Checkup" required />

              <View style={styles.row}>
                <View style={styles.col}>
                  <DateField control={control} name="date" label="Date" />
                </View>
                <View style={styles.col}>
                  <TextField control={control} name="time" label="Time" placeholder="HH:MM" />
                </View>
              </View>

              {/* Location - Using Wrapper or Manual Control */}
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>Location</Text>
                <LocationAutocomplete
                  label="Location"
                  value={watch('location')}
                  onChangeText={(text) => setValue('location', text)}
                  onPlaceSelected={(details) => {
                    setValue('location', details.address);
                    setLocationDetails({
                      lat: details.lat,
                      lng: details.lng,
                      placeId: details.placeId,
                    });
                  }}
                  placeholder="Search for a location..."
                  // Style overrides to match new system
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>

              <TextField
                control={control}
                name="notes"
                label="Notes"
                placeholder="Additional notes..."
                multiline
                numberOfLines={4}
              />

              <View style={{ marginTop: 24 }}>
                <Button
                  title={loading ? "Saving..." : "Save Visit"}
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
    marginBottom: 8,
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
});
