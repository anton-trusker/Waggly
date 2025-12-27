import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Platform, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { designSystem, getSpacing } from '@/constants/designSystem';
import AppHeader from '@/components/layout/AppHeader';
import DateInput from '@/components/ui/DateInput';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { usePets } from '@/hooks/usePets';
import { IconSymbol } from '@/components/ui/IconSymbol';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';

const EVENT_TYPES = [
  { id: 'vet', label: 'Vet Visit', icon: 'hospital-box' },
  { id: 'grooming', label: 'Grooming', icon: 'content-cut' },
  { id: 'walking', label: 'Walking', icon: 'walk' },
  { id: 'training', label: 'Training', icon: 'school' },
  { id: 'medication', label: 'Medication', icon: 'pill' },
  { id: 'vaccination', label: 'Vaccination', icon: 'needle' },
  { id: 'other', label: 'Other', icon: 'calendar-star' },
];

export default function AddEventScreen() {
  const { petId: initialPetId } = useLocalSearchParams();
  const { user } = useAuth();
  const { pets } = usePets();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(initialPetId as string || (pets.length > 0 ? pets[0].id : null));

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [locationDetails, setLocationDetails] = useState<any>(null);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }
    if (!selectedPetId) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          pet_id: selectedPetId,
          title: title.trim(),
          description: description.trim() || null,
          type,
          start_time: time ? `${date}T${time}:00` : `${date}T09:00:00`, // Default time if not set
          location: location || null,
          location_lat: locationDetails?.lat || null,
          location_lng: locationDetails?.lng || null,
          place_id: locationDetails?.placeId || null,
          // end_time could be optional
        });

      if (error) throw error;

      Alert.alert('Success', 'Event added successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Add Event" showBack />

      <ScrollView contentContainerStyle={styles.content}>

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

        {/* Event Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Event Type</Text>
          <View style={styles.typeGrid}>
            {EVENT_TYPES.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[styles.typeCard, type === t.id && styles.typeCardSelected]}
                onPress={() => setType(t.id)}
              >
                <IconSymbol
                  android_material_icon_name={t.icon as any}
                  ios_icon_name={t.id === 'vet' ? 'cross.case.fill' : t.id === 'walking' ? 'figure.walk' : 'star.circle.fill'}
                  size={24}
                  color={type === t.id ? '#fff' : colors.primary}
                />
                <Text style={[styles.typeLabel, type === t.id && styles.typeLabelSelected]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.label}>Event Details</Text>

          <TextInput
            style={styles.input}
            placeholder="Event Title (e.g., Annual Checkup)"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          <DateInput value={date} onChange={setDate} label="Date" />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notes / Description"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <LocationAutocomplete
            onLocationSelect={(details) => {
              setLocation(details.address);
              setLocationDetails(details);
            }}
            initialValue={location}
            placeholder="Location (Optional)"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Create Event</Text>}
        </TouchableOpacity>

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
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
  },
  typeCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeLabel: {
    fontSize: 12,
    marginTop: 6,
    color: colors.text,
    textAlign: 'center',
  },
  typeLabelSelected: {
    color: '#fff',
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
