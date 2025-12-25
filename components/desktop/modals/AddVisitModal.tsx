import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '@/lib/supabase';
import { Pet } from '@/types';

interface AddVisitModalProps {
  visible: boolean;
  petId?: string;
  pets?: Pet[];
  onClose: () => void;
}

const VISIT_TYPES = ['Checkup', 'Emergency', 'Surgery', 'Specialist', 'Follow-up', 'Other'];

export default function AddVisitModal({ visible, petId, pets, onClose }: AddVisitModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(petId || '');
  const [formData, setFormData] = useState({
    visit_type: 'Checkup',
    visit_date: '',
    veterinarian: '',
    clinic_name: '',
    reason: '',
    diagnosis: '',
    treatment_plan: '',
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
    if (!formData.visit_date) {
      Alert.alert('Error', 'Please enter visit date');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('medical_visits')
        .insert({
          pet_id: targetPetId,
          visit_type: formData.visit_type,
          visit_date: formData.visit_date,
          veterinarian: formData.veterinarian || null,
          clinic_name: formData.clinic_name || null,
          reason: formData.reason || null,
          diagnosis: formData.diagnosis || null,
          treatment_plan: formData.treatment_plan || null,
          cost: parseFloat(formData.cost) || null,
          currency: formData.currency,
          notes: formData.notes || null,
        });

      if (error) throw error;
      Alert.alert('Success', 'Visit added successfully');
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
          <Text style={styles.title}>Book Vet Visit</Text>
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
            <Text style={styles.label}>Visit Type</Text>
            <View style={styles.chipContainer}>
              {VISIT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.chip, formData.visit_type === type && styles.chipActive]}
                  onPress={() => setFormData({ ...formData, visit_type: type })}
                >
                  <Text style={[styles.chipText, formData.visit_type === type && styles.chipTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Visit Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={formData.visit_date}
              onChangeText={(text) => setFormData({ ...formData, visit_date: text })}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Veterinarian</Text>
              <TextInput
                style={styles.input}
                placeholder="Dr. Smith"
                value={formData.veterinarian}
                onChangeText={(text) => setFormData({ ...formData, veterinarian: text })}
              />
            </View>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Clinic Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Happy Paws Vet"
                value={formData.clinic_name}
                onChangeText={(text) => setFormData({ ...formData, clinic_name: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reason for Visit</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Annual checkup, Limping"
              value={formData.reason}
              onChangeText={(text) => setFormData({ ...formData, reason: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Diagnosis</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="What did the vet find?"
              multiline
              numberOfLines={3}
              value={formData.diagnosis}
              onChangeText={(text) => setFormData({ ...formData, diagnosis: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Treatment Plan</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Recommended treatment..."
              multiline
              numberOfLines={3}
              value={formData.treatment_plan}
              onChangeText={(text) => setFormData({ ...formData, treatment_plan: text })}
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
            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Any other details..."
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
            <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Visit'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 640,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  chipText: {
    fontSize: 13,
    color: '#6B7280',
  },
  chipTextActive: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

