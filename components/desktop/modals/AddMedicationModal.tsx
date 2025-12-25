import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

interface AddMedicationModalProps {
  visible: boolean;
  petId: string;
  onClose: () => void;
}

const DOSAGE_UNITS = ['mg', 'ml', 'tablet', 'capsule', 'drops'];
const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'As needed', 'Weekly', 'Monthly'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD'];

export default function AddMedicationModal({ visible, petId, onClose }: AddMedicationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage_value: '',
    dosage_unit: 'mg',
    frequency: 'Once daily',
    start_date: '',
    end_date: '',
    reminders_enabled: false,
    cost: '',
    currency: 'USD',
    notes: '',
  });

  if (!visible) return null;

  const handleSubmit = async () => {
    if (!formData.name) {
      Alert.alert('Error', 'Please enter medication name');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('medications')
        .insert({
          pet_id: petId,
          name: formData.name,
          dosage_value: parseFloat(formData.dosage_value) || null,
          dosage_unit: formData.dosage_unit,
          frequency: formData.frequency,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          reminders_enabled: formData.reminders_enabled,
          cost: parseFloat(formData.cost) || null,
          currency: formData.currency,
          notes: formData.notes || null,
        });

      if (error) throw error;
      Alert.alert('Success', 'Medication added successfully');
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
          <Text style={styles.title}>Add Medication</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medication Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Heartgard Plus"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
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
              <View style={styles.select}>
                {DOSAGE_UNITS.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[styles.selectOption, formData.dosage_unit === unit && styles.selectOptionActive]}
                    onPress={() => setFormData({ ...formData, dosage_unit: unit })}
                  >
                    <Text style={styles.selectOptionText}>{unit}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.chipContainer}>
              {FREQUENCIES.map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[styles.chip, formData.frequency === freq && styles.chipActive]}
                  onPress={() => setFormData({ ...formData, frequency: freq })}
                >
                  <Text style={[styles.chipText, formData.frequency === freq && styles.chipTextActive]}>{freq}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Start Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.start_date}
                onChangeText={(text) => setFormData({ ...formData, start_date: text })}
              />
            </View>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>End Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.end_date}
                onChangeText={(text) => setFormData({ ...formData, end_date: text })}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => setFormData({ ...formData, reminders_enabled: !formData.reminders_enabled })}
          >
            <Text style={styles.switchLabel}>Enable Reminders</Text>
            <View style={[styles.switch, formData.reminders_enabled && styles.switchActive]}>
              <View style={[styles.switchThumb, formData.reminders_enabled && styles.switchThumbActive]} />
            </View>
          </TouchableOpacity>

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
              <View style={styles.currencyButtons}>
                {CURRENCIES.map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    style={[styles.currencyButton, formData.currency === curr && styles.currencyButtonActive]}
                    onPress={() => setFormData({ ...formData, currency: curr })}
                  >
                    <Text style={[styles.currencyButtonText, formData.currency === curr && styles.currencyButtonTextActive]}>
                      {curr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Medication</Text>}
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
  select: { gap: 8 },
  selectOption: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#F3F4F6' },
  selectOptionActive: { backgroundColor: '#6366F1' },
  selectOptionText: { fontSize: 14, color: '#111827' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  chipText: { fontSize: 13, color: '#6B7280' },
  chipTextActive: { color: '#fff' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  switchLabel: { fontSize: 14, fontWeight: '600', color: '#374151' },
  switch: { width: 48, height: 28, borderRadius: 14, backgroundColor: '#E5E7EB', padding: 2 },
  switchActive: { backgroundColor: '#6366F1' },
  switchThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' },
  switchThumbActive: { transform: [{ translateX: 20 }] },
  currencyButtons: { flexDirection: 'row', gap: 8 },
  currencyButton: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  currencyButtonActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  currencyButtonText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  currencyButtonTextActive: { color: '#fff' },
  footer: { flexDirection: 'row', gap: 12, padding: 24, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  saveButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#6366F1', alignItems: 'center' },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});

