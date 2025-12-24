import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

type Props = {
  selected?: boolean;
};

export default function Radio({ selected = false }: Props) {
  return (
    <View style={[styles.outer, selected && styles.outerSelected]}>
      {selected && <View style={styles.inner} />}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerSelected: {
    borderColor: colors.primary,
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});

