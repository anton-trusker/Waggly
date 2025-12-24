import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

type Props = {
  options: string[];
  valueIndex: number;
  onChange: (index: number) => void;
};

export default function SegmentedControl({ options, valueIndex, onChange }: Props) {
  return (
    <View style={styles.row}>
      {options.map((opt, i) => (
        <TouchableOpacity key={opt} style={[styles.segment, i === valueIndex && styles.segmentActive]} onPress={() => onChange(i)}>
          <Text style={[styles.text, i === valueIndex && styles.textActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  segmentActive: {
    borderColor: colors.primary,
  },
  text: {
    color: colors.textSecondary,
  },
  textActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});

