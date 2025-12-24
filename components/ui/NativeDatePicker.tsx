import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { designSystem } from '@/constants/designSystem';

interface NativeDatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
}

export default function NativeDatePicker({
  value,
  onChange,
  label,
  mode = 'date',
  minimumDate,
  maximumDate,
}: NativeDatePickerProps) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value || new Date());

  const displayDate = value ? value.toLocaleDateString() : 'Select Date';

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (selectedDate) {
        onChange(selectedDate);
      }
    } else {
      // iOS: keep modal open, update temp state
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const confirmIOS = () => {
    onChange(tempDate);
    setShow(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={styles.inputButton} 
        onPress={() => {
            setTempDate(value || new Date());
            setShow(true);
        }}
      >
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {displayDate}
        </Text>
      </TouchableOpacity>

      {/* Android: Shows natively when 'show' is true, no modal wrapper needed usually, but logic varies */}
      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={tempDate}
          mode={mode}
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {/* iOS: Needs a Modal wrapper for bottom sheet effect if we want it "sticky" or custom */}
      {Platform.OS === 'ios' && (
        <Modal
            transparent={true}
            visible={show}
            animationType="slide"
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShow(false)}>
                            <Text style={styles.cancelButton}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirmIOS}>
                            <Text style={styles.confirmButton}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    <DateTimePicker
                        value={tempDate}
                        mode={mode}
                        display="spinner" // Wheel style as requested
                        onChange={handleDateChange}
                        style={styles.picker}
                        minimumDate={minimumDate}
                        maximumDate={maximumDate}
                    />
                </View>
            </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: designSystem.colors.text.primary,
    marginBottom: 8,
  },
  inputButton: {
    height: 48,
    backgroundColor: designSystem.colors.background.secondary,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
  },
  inputText: {
    fontSize: 16,
    color: designSystem.colors.text.primary,
  },
  placeholderText: {
    color: designSystem.colors.text.tertiary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cancelButton: {
    color: '#666',
    fontSize: 16,
  },
  confirmButton: {
    color: designSystem.colors.primary[500],
    fontSize: 16,
    fontWeight: '600',
  },
  picker: {
    height: 200,
    width: '100%',
  },
});
