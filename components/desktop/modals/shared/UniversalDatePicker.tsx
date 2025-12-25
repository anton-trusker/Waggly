import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface UniversalDatePickerProps {
  label?: string;
  value: string; // ISO date string or datetime string
  onChange: (value: string) => void;
  mode?: 'date' | 'time' | 'datetime';
  required?: boolean;
  error?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

export default function UniversalDatePicker({
  label = 'Date',
  value,
  onChange,
  mode = 'date',
  required = false,
  error,
  placeholder,
  minDate,
  maxDate,
}: UniversalDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());

  const formatDisplayValue = () => {
    if (!value) return '';

    try {
      const date = new Date(value);

      if (mode === 'date') {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      } else if (mode === 'time') {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
      } else {
        return date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch (e) {
      return value;
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setTempDate(selectedDate);

      if (mode === 'date') {
        onChange(selectedDate.toISOString().split('T')[0]);
      } else if (mode === 'time') {
        const hours = selectedDate.getHours().toString().padStart(2, '0');
        const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
        onChange(`${hours}:${minutes}`);
      } else {
        onChange(selectedDate.toISOString());
      }
    }
  };

  const handleDone = () => {
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.inputContainer, error && styles.inputContainerError]}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons
          name={mode === 'time' ? 'time-outline' : 'calendar-outline'}
          size={20}
          color="#9CA3AF"
        />
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value ? formatDisplayValue() : (placeholder || `Select ${mode}`)}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Native Date/Time Picker */}
      {showPicker && (
        <View style={styles.pickerContainer}>
          {Platform.OS === 'ios' ? (
            <View style={styles.iosPickerWrapper}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>
                  Select {mode === 'datetime' ? 'Date & Time' : mode === 'time' ? 'Time' : 'Date'}
                </Text>
                <TouchableOpacity onPress={handleDone}>
                  <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode={mode === 'datetime' ? 'datetime' : mode}
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minDate}
                maximumDate={maxDate}
                textColor="#FFFFFF"
                style={styles.picker}
              />
            </View>
          ) : (
            <DateTimePicker
              value={tempDate}
              mode={mode === 'datetime' ? 'date' : mode}
              display="default"
              onChange={handleDateChange}
              minimumDate={minDate}
              maximumDate={maxDate}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  placeholder: {
    color: '#4B5563',
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 4,
  },
  pickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  iosPickerWrapper: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  doneButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A84FF',
  },
  picker: {
    height: 200,
  },
});
