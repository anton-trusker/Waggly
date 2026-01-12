import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DatePicker } from '@/components/design-system/primitives/DatePicker';

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

  // Helper to parse value to Date
  const parseValue = (val: string, m: string): Date | undefined => {
    if (!val) return undefined;
    if (m === 'time') {
      const parts = val.split(':');
      if (parts.length < 2) return undefined;
      const [h, min] = parts.map(Number);
      const d = new Date();
      d.setHours(h, min, 0, 0);
      return d;
    }
    // Date mode: YYYY-MM-DD
    const parts = val.split('-');
    if (parts.length !== 3) return undefined;
    const [y, mon, d] = parts.map(Number);
    return new Date(y, mon - 1, d);
  };

  const dateValue = parseValue(value, mode);

  const handleChange = (date: Date) => {
    if (mode === 'time') {
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      onChange(`${h}:${m}`);
    } else {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      onChange(`${y}-${m}-${d}`);
    }
  };

  return (
    <View style={styles.container}>
      <DatePicker
        label={label}
        value={dateValue}
        onChange={handleChange}
        error={error}
        required={required}
        mode={mode}
        minimumDate={minDate}
        maximumDate={maxDate}
      // placeholder={placeholder} // DatePicker renders "Select date" if no value
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
});
