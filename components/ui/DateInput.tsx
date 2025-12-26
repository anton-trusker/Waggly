import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { designSystem, getSpacing } from '@/constants/designSystem';
import { getColor } from '@/utils/designSystem';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDDMMYYYY, isDateYYYYMMDD } from '@/utils/validation';

type Props = {
  value?: string;
  onChange: (isoDate: string) => void;
  label?: string;
};

function toISO(ddmmyyyy: string): string | null {
  const [d, m, y] = ddmmyyyy.split('-').map((x) => parseInt(x, 10));
  if (!y || !m || !d) return null;
  const iso = `${y.toString().padStart(4, '0')}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
  return iso;
}

function toDisplay(iso?: string): string {
  if (!iso || !isDateYYYYMMDD(iso)) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function DateInput({ value, onChange, label = 'Date of birth' }: Props) {
  const [text, setText] = useState(toDisplay(value));
  const [show, setShow] = useState(false);

  useEffect(() => {
    setText(toDisplay(value));
  }, [value]);

  const onTextChange = (t: string) => {
    const formatted = formatDDMMYYYY(t);
    setText(formatted);
    const iso = toISO(formatted);
    if (iso) {
      onChange(iso);
    }
  };

  const onPick = (_: any, date?: Date) => {
    setShow(Platform.OS === 'ios');
    if (date) {
      const iso = date.toISOString().slice(0, 10);
      onChange(iso);
      setText(toDisplay(iso));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="dd/mm/yyyy"
          placeholderTextColor={designSystem.colors.text.tertiary}
          value={text}
          onChangeText={onTextChange}
          keyboardType="number-pad"
          accessibilityLabel="Date of birth input"
        />
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShow(true)} accessibilityRole="button" accessibilityLabel="Open date picker">
          <Text style={styles.icon}>📅</Text>
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          value={value && isDateYYYYMMDD(value) ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onPick}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: getSpacing(4) },
  label: {
    ...designSystem.typography.label.small,
    color: designSystem.colors.text.secondary,
    marginBottom: getSpacing(1.5),
  },
  row: {
    flexDirection: 'row',
    gap: getSpacing(2),
    alignItems: 'center'
  },
  input: {
    flex: 1,
    height: designSystem.components.input.height,
    borderWidth: 1,
    borderColor: getColor('border.primary'),
    borderRadius: designSystem.borderRadius.md,
    backgroundColor: getColor('background.primary'),
    paddingHorizontal: getSpacing(3),
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.primary,
  },
  iconBtn: {
    width: designSystem.components.input.height,
    height: designSystem.components.input.height,
    borderRadius: designSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: designSystem.colors.background.primary,
  },
  icon: {
    fontSize: designSystem.iconSizes.md,
    lineHeight: designSystem.iconSizes.md,
  },
});
