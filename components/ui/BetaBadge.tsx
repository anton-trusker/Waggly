import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

export default function BetaBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>BETA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    marginLeft: 8,
  },
  text: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
});
