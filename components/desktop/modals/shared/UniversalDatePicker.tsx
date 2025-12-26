import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet, Modal as RNModal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UniversalDatePickerProps {
  label?: string;
  value: string; // ISO date string (YYYY-MM-DD) or time string (HH:MM)
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
  const inputRef = useRef<any>(null);

  const formatDisplayValue = () => {
    if (!value) return '';

    try {
      if (mode === 'time') {
        // Value is HH:MM format
        const [hours, minutes] = value.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour12 = h % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      }

      const date = new Date(value);
      if (isNaN(date.getTime())) return value;

      if (mode === 'date') {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
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

  const handleWebChange = (e: any) => {
    const newValue = e.target?.value || e.nativeEvent?.text;
    if (newValue) {
      onChange(newValue);
    }
  };

  const getInputType = () => {
    if (mode === 'time') return 'time';
    if (mode === 'datetime') return 'datetime-local';
    return 'date';
  };

  // For web, use native HTML5 input
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}

        <View style={[styles.webInputWrapper, error && styles.webInputWrapperError]}>
          <Ionicons
            name={mode === 'time' ? 'time-outline' : 'calendar-outline'}
            size={18}
            color="#9CA3AF"
            style={styles.webIcon}
          />
          <input
            type={getInputType()}
            value={value || ''}
            onChange={handleWebChange}
            min={minDate?.toISOString().split('T')[0]}
            max={maxDate?.toISOString().split('T')[0]}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: value ? '#FFFFFF' : '#4B5563',
              fontSize: 16,
              fontFamily: 'inherit',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  // For native (iOS/Android), use TouchableOpacity + Modal with DateTimePicker
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

      {/* Native Modal Picker for iOS/Android */}
      {showPicker && Platform.OS !== 'web' && (
        <RNModal
          transparent
          visible={showPicker}
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>
                  Select {mode === 'datetime' ? 'Date & Time' : mode === 'time' ? 'Time' : 'Date'}
                </Text>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>
              </View>

              {/* Native picker would go here - using TextInput fallback for now */}
              <View style={styles.manualInputContainer}>
                <Text style={styles.manualInputLabel}>
                  Enter {mode === 'time' ? 'time (HH:MM)' : 'date (YYYY-MM-DD)'}:
                </Text>
                <TextInput
                  ref={inputRef}
                  style={styles.manualInput}
                  value={value}
                  onChangeText={onChange}
                  placeholder={mode === 'time' ? '12:00' : '2024-12-25'}
                  placeholderTextColor="#4B5563"
                  autoFocus
                />
              </View>
            </View>
          </View>
        </RNModal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
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
    paddingVertical: 14,
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
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
  },
  // Web-specific styles
  webInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    gap: 12,
  },
  webInputWrapperError: {
    borderColor: '#EF4444',
  },
  webIcon: {
    marginRight: 4,
  },
  // Modal styles for native
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
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
    fontSize: 17,
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
  manualInputContainer: {
    padding: 24,
  },
  manualInputLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  manualInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
