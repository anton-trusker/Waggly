import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/lib/supabase';
import { Pet } from '@/types';

interface AddVaccinationModalProps {
  visible: boolean;
  petId?: string;
  pets?: Pet[];
  onClose: () => void;
}

export default function AddVaccinationModal({ visible, petId, pets, onClose }: AddVaccinationModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(petId || '');
  const [formData, setFormData] = useState({
    vaccine_name: '',
    date_given: '',
    next_due_date: '',
    dose_number: '',
    provider: '',
    batch_number: '',
    cost: '',
    currency: 'USD',
    notes: '',
  });

  useEffect(() => {
    if (petId) setSelectedPetId(petId);
    else if (pets && pets.length > 0 && !selectedPetId) setSelectedPetId(pets[0].id);
  }, [petId, pets]);

  if (!visible) return null;

  const handleSubmit = async () => {
    const targetPetId = petId || selectedPetId;
    if (!targetPetId) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }
    if (!formData.vaccine_name) {
      Alert.alert('Error', 'Please enter vaccine name');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('vaccinations')
        .insert({
          pet_id: targetPetId,
          vaccine_name: formData.vaccine_name,
          date_given: formData.date_given || null,
          next_due_date: formData.next_due_date || null,
          dose_number: formData.dose_number ? parseInt(formData.dose_number) : null,
          provider: formData.provider || null,
          batch_number: formData.batch_number || null,
          cost: parseFloat(formData.cost) || null,
          currency: formData.currency,
          notes: formData.notes || null,
        });

      if (error) throw error;
      Alert.alert('Success', 'Vaccination added successfully');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Vaccination</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {!petId && pets && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Pet *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedPetId}
                  onValueChange={(itemValue) => setSelectedPetId(itemValue)}
                  style={styles.picker}
                >
                  {pets.map((pet) => (
                    <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vaccine Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Rabies, DHPP, Bordetella"
              value={formData.vaccine_name}
              onChangeText={(text) => setFormData({ ...formData, vaccine_name: text })}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Date Given</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.date_given}
                onChangeText={(text) => setFormData({ ...formData, date_given: text })}
              />
            </View>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Next Due Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.next_due_date}
                onChangeText={(text) => setFormData({ ...formData, next_due_date: text })}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Dose Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1, 2, 3..."
                keyboardType="number-pad"
                value={formData.dose_number}
                onChangeText={(text) => setFormData({ ...formData, dose_number: text })}
              />
            </View>
            <View style={[styles.inputGroup, styles.flex2]}>
              <Text style={styles.label}>Provider/Clinic</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Happy Paws Vet"
                value={formData.provider}
                onChangeText={(text) => setFormData({ ...formData, provider: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Batch Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., ABC123456"
              value={formData.batch_number}
              onChangeText={(text) => setFormData({ ...formData, batch_number: text })}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex2]}>
              <Text style={styles.label}>Cost</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={formData.cost}
                onChangeText={(text) => setFormData({ ...formData, cost: text })}
              />
            </View>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Currency</Text>
              <TextInput
                style={styles.input}
                placeholder="USD"
                value={formData.currency}
                onChangeText={(text) => setFormData({ ...formData, currency: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Additional notes..."
              multiline
              numberOfLines={4}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Vaccination'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 32, zIndex: 1000,
  },
  modal: { backgroundColor: '#fff', borderRadius: 20, width: '100%', maxWidth: 640, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  form: { padding: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#111827', backgroundColor: '#F9FAFB' },
  textarea: { height: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 16 },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  footer: { flexDirection: 'row', gap: 12, padding: 24, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  saveButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#6366F1', alignItems: 'center' },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});

