import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet, Modal as RNModal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';

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
  const { theme } = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef<any>(null);

  const formatDisplayValue = () => {
    if (!value) return '';

    try {
      if (mode === 'time') {
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
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
            {label}
            {required && <Text style={{ color: theme.colors.status.error[500] }}> *</Text>}
          </Text>
        )}

        <View style={[
          styles.webInputWrapper,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: error ? theme.colors.status.error[500] : theme.colors.border.primary
          }
        ]}>
          <Ionicons
            name={mode === 'time' ? 'time-outline' : 'calendar-outline'}
            size={18}
            color={theme.colors.text.tertiary}
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
              color: value ? theme.colors.text.primary : theme.colors.text.secondary,
              fontSize: 16,
              fontFamily: 'inherit',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        </View>

        {error && <Text style={[styles.errorText, { color: theme.colors.status.error[500] }]}>{error}</Text>}
      </View>
    );
  }

  // For native (iOS/Android), use TouchableOpacity + Modal with DateTimePicker
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
          {label}
          {required && <Text style={{ color: theme.colors.status.error[500] }}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: error ? theme.colors.status.error[500] : theme.colors.border.primary
          }
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons
          name={mode === 'time' ? 'time-outline' : 'calendar-outline'}
          size={20}
          color={theme.colors.text.tertiary}
        />
        <Text style={[
          styles.inputText,
          { color: theme.colors.text.primary },
          !value && { color: theme.colors.text.tertiary }
        ]}>
          {value ? formatDisplayValue() : (placeholder || `Select ${mode}`)}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.colors.text.tertiary} />
      </TouchableOpacity>

      {error && <Text style={[styles.errorText, { color: theme.colors.status.error[500] }]}>{error}</Text>}

      {/* Native Modal Picker for iOS/Android */}
      {showPicker && (Platform.OS as string) !== 'web' && (
        <RNModal
          transparent
          visible={showPicker}
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay.strong }]}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.background.secondary }]}>
              <View style={[styles.pickerHeader, { borderBottomColor: theme.colors.border.primary }]}>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={[styles.cancelButton, { color: theme.colors.text.secondary }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.pickerTitle, { color: theme.colors.text.primary }]}>
                  Select {mode === 'datetime' ? 'Date & Time' : mode === 'time' ? 'Time' : 'Date'}
                </Text>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={[styles.doneButton, { color: theme.colors.primary[500] }]}>Done</Text>
                </TouchableOpacity>
              </View>

              {/* Native picker would go here - using TextInput fallback for now */}
              <View style={styles.manualInputContainer}>
                <Text style={[styles.manualInputLabel, { color: theme.colors.text.secondary }]}>
                  Enter {mode === 'time' ? 'time (HH:MM)' : 'date (YYYY-MM-DD)'}:
                </Text>
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.manualInput,
                    {
                      backgroundColor: theme.colors.background.tertiary,
                      color: theme.colors.text.primary
                    }
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder={mode === 'time' ? '12:00' : '2024-12-25'}
                  placeholderTextColor={theme.colors.text.tertiary}
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
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
  },
  // Web-specific styles
  webInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    gap: 12,
  },
  webIcon: {
    marginRight: 4,
  },
  // Modal styles for native
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
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
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 16,
  },
  doneButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  manualInputContainer: {
    padding: 24,
  },
  manualInputLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  manualInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    textAlign: 'center',
  },
});
