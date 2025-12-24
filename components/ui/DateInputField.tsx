import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/ui/IconSymbol';
import CalendarSheet from '@/components/features/calendar/CalendarSheet';
import { formatDateDDMMYYYY } from '@/utils/dateUtils';

type Props = {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
  editable?: boolean;
  maxDate?: Date | null;
  minDate?: Date | null;
};

export default function DateInputField({ label, value, onChange, placeholder = 'DD-MM-YYYY', editable = true, maxDate, minDate }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange(date.toISOString().split('T')[0]);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const displayValue = value ? formatDateDDMMYYYY(value) : '';

  return (
    <View style={styles.container}>
      <Text style={commonStyles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => editable && setShowPicker(true)}
        disabled={!editable}
      >
        <Text style={[styles.text, !displayValue && styles.placeholder]}>
          {displayValue || placeholder}
        </Text>
        {value && editable ? (
          <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleClear(); }} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
             <IconSymbol
              ios_icon_name="xmark.circle.fill"
              android_material_icon_name="cancel"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ) : (
          <IconSymbol
            ios_icon_name="calendar"
            android_material_icon_name="calendar-today"
            size={20}
            color={colors.textSecondary}
          />
        )}
      </TouchableOpacity>
      
      <CalendarSheet
        visible={showPicker}
        date={value ? new Date(value) : null}
        onChange={handleDateChange}
        onClose={() => setShowPicker(false)}
        title={label}
        maxDate={maxDate ?? undefined}
        minDate={minDate ?? undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 50,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    color: colors.textSecondary,
  },
});
