import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EnhancedDatePicker from '@/components/ui/EnhancedDatePicker';
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

// Convert YYYY-MM-DD to DD-MM-YYYY
const isoToDmy = (isoDate: string): string => {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
};

// Convert DD-MM-YYYY to YYYY-MM-DD
const dmyToIso = (dmyDate: string): string => {
  if (!dmyDate) return '';
  const parts = dmyDate.split('-');
  if (parts.length !== 3) return dmyDate;
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
};

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

  // Handle time mode - EnhancedDatePicker doesn't support time, so use simple input
  if (mode === 'time') {
    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
            {label}
            {required && <Text style={{ color: theme.colors.status.error[500] }}> *</Text>}
          </Text>
        )}
        <View style={[
          styles.timeInput,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: error ? theme.colors.status.error[500] : theme.colors.border.primary
          }
        ]}>
          <input
            type="time"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: theme.colors.text.primary,
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

  // Convert ISO format to DD-MM-YYYY for EnhancedDatePicker
  const displayValue = isoToDmy(value);

  const handleChange = (dmyDate: string) => {
    // Convert DD-MM-YYYY back to ISO format
    const isoDate = dmyToIso(dmyDate);
    onChange(isoDate);
  };

  return (
    <EnhancedDatePicker
      label={label}
      value={displayValue}
      onChange={handleChange}
      required={required}
      error={error}
      placeholder={placeholder || 'Select date'}
    />
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
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
  },
});
