import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, buttonStyles } from '@/styles/commonStyles';

type Props = {
  onBack: () => void;
  onPrimary: () => void;
  primaryLabel: string;
  disabled?: boolean;
  bottomOffset?: number;
};

export default function BottomCTA({ onBack, onPrimary, primaryLabel, disabled = false, bottomOffset = 0 }: Props) {
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardShowSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardHideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardShowSubscription.remove();
      keyboardHideSubscription.remove();
    };
  }, []);

  if (isKeyboardVisible) {
    return null;
  }

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 16), bottom: bottomOffset }]}>
      <TouchableOpacity style={styles.backPill} onPress={onBack} accessibilityRole="button" accessibilityLabel="Back">
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[buttonStyles.primary, styles.primary, disabled && buttonStyles.disabled] as any}
        onPress={onPrimary}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={primaryLabel}
      >
        <Text style={buttonStyles.textWhite}>{primaryLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
  },
  backPill: {
    height: 44,
    width: 60,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  backIcon: {
    color: colors.textSecondary,
    fontSize: 18,
  },
  primary: {
    flex: 1,
  },
});

