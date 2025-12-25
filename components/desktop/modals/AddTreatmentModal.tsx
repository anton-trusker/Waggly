import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

interface AddTreatmentModalProps {
  visible: boolean;
  petId: string;
  onClose: () => void;
}

export default function AddTreatmentModal({ visible, petId, onClose }: AddTreatmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    treatment_type: '',
    diagnosis: '',
    veterinarian: '',
    treatment_date: '',
    dosage_value: '',
    dosage_unit: 'mg',
    frequency: '',
    next_due_date: '',
    notes: '',
    cost: '',
    currency: 'USD',
    provider: '',
  });

  if (!visible) return null;

  const handleSubmit = async () => {
    if (!formData.treatment_type) {
      Alert.alert('Error', 'Please enter treatment type');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('treatments')
        .insert({
          pet_id: petId,
          treatment_type: formData.treatment_type,
          diagnosis: formData.diagnosis || null,
          veterinarian: formData.veterinarian || null,
          treatment_date: formData.treatment_date || null,
          dosage_value: parseFloat(formData.dosage_value) || null,
          dosage_unit: formData.dosage_unit,
          frequency: formData.frequency || null,
          next_due_date: formData.next_due_date || null,
          notes: formData.notes || null,
          cost: parseFloat(formData.cost) || null,
          currency: formData.currency,
          provider: formData.provider || null,
        });

      if (error) throw error;
      Alert.alert('Success', 'Treatment added successfully');
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
          <Text style={styles.title}>Add Treatment</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Treatment Type *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Flea Treatment, Dental Cleaning"
              value={formData.treatment_type}
              onChangeText={(text) => setFormData({ ...formData, treatment_type: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Diagnosis</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Fleas, Dental Disease"
              value={formData.diagnosis}
              onChangeText={(text) => setFormData({ ...formData, diagnosis: text })}
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
              <Text style={styles.label}>Provider/Clinic</Text>
              <TextInput
                style={styles.input}
                placeholder="Happy Paws Vet"
                value={formData.provider}
                onChangeText={(text) => setFormData({ ...formData, provider: text })}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Treatment Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.treatment_date}
                onChangeText={(text) => setFormData({ ...formData, treatment_date: text })}
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
            <View style={[styles.inputGroup, styles.flex2]}>
              <Text style={styles.label}>Dosage Value</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                keyboardType="decimal-pad"
                value={formData.dosage_value}
                onChangeText={(text) => setFormData({ ...formData, dosage_value: text })}
              />
            </View>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Unit</Text>
              <TextInput
                style={styles.input}
                placeholder="mg"
                value={formData.dosage_unit}
                onChangeText={(text) => setFormData({ ...formData, dosage_unit: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Frequency</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Once daily, Weekly"
              value={formData.frequency}
              onChangeText={(text) => setFormData({ ...formData, frequency: text })}
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
            <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Treatment'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'fixed' as any, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 32, zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: 20, width: '100%', maxWidth: 640, maxHeight: '90%' },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
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

