import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, buttonStyles } from '@/styles/commonStyles';

type Props = {
  visible: boolean;
  title?: string;
  date: Date | null;
  onChange: (d: Date | null) => void;
  onClose: () => void;
  maxDate?: Date | null;
  minDate?: Date | null;
};

export default function CalendarSheet({ visible, title = 'Birth date', date, onChange, onClose, maxDate, minDate }: Props) {
  // Use local state to track changes within the modal before confirming
  const [tempDate, setTempDate] = useState<Date>(date || new Date());

  useEffect(() => {
    if (visible) {
      setTempDate(date || new Date());
    }
  }, [visible, date]);

  const handleDateChange = (_: any, d?: Date) => {
    if (Platform.OS === 'android') {
      // On Android, the picker is a modal itself. Closing it confirms the selection.
      if (d) {
        onChange(d);
      }
      onClose(); // Close the wrapper modal immediately after Android picker closes
    } else {
      // iOS: Update local state (spinner style)
      if (d) setTempDate(d);
    }
  };

  const handleSave = () => {
    onChange(tempDate);
    onClose();
  };

  if (!visible) return null;

  // Android DateTimePicker is imperative, not a component you embed in a view like iOS
  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={tempDate}
        onChange={handleDateChange}
        mode="date"
        display="default"
        maximumDate={maxDate ?? undefined}
        minimumDate={minDate ?? new Date(1970, 0, 1)}
      />
    );
  }

  // iOS View
  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={tempDate}
              onChange={handleDateChange}
              mode="date"
              display="spinner"
              maximumDate={maxDate ?? undefined}
              minimumDate={minDate ?? new Date(1970, 0, 1)}
              style={styles.picker}
            />
          </View>
          <TouchableOpacity style={[buttonStyles.primary, styles.save]} onPress={handleSave} accessibilityRole="button" accessibilityLabel="Save">
            <Text style={buttonStyles.textWhite}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  picker: {
    width: '100%',
  },
  save: {
    marginTop: 12,
  },
});
