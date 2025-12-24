import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useLocale } from '@/hooks/useLocale';

type Props = {
  subtitle: string;
  step: number;
  totalSteps?: number;
  onBack: () => void;
};

export default function WizardHeader({ subtitle, step, totalSteps = 4, onBack }: Props) {
  const { t } = useLocale();
  const progress = Math.max(0, Math.min(totalSteps, step)) / totalSteps;
  return (
    <View>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backHit}>
          <Text style={styles.backText}>{t('common.back', { defaultValue: '‹ Back' })}</Text>
        </TouchableOpacity>
        <View style={styles.centerArea}>
          <Text style={styles.title}>{t('onboarding.add_pet_profile', { defaultValue: 'Add Pet Profile' })}</Text>
          <Text style={styles.subtitle}>{t(subtitle, { defaultValue: subtitle })}</Text>
        </View>
        <Text style={styles.stepLabel}>{t('onboarding.step', { defaultValue: 'Step' })} <Text style={{ color: colors.text }}>{step}/{totalSteps}</Text></Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFg, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  backHit: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '300',
  },
  centerArea: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  stepLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  progressBarBg: {
    height: 2,
    backgroundColor: colors.separator,
    marginHorizontal: 20,
  },
  progressBarFg: {
    height: 2,
    backgroundColor: colors.primary,
  },
});
