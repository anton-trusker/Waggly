import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { designSystem } from '@/constants/designSystem';
import { Input } from '@/components/design-system/primitives/Input';
import { Button } from '@/components/design-system/primitives/Button';
import { useLocale } from '@/hooks/useLocale';
import { AuthHeroLayout } from '@/components/features/auth/AuthHeroLayout';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { t } = useLocale();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert(t('common.error'), t('auth.email_placeholder'));
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Success',
        t('auth.reset_sent'),
        [{ text: t('common.close'), onPress: () => router.back() }]
      );
    }
  };

  return (
    <AuthHeroLayout
      title={t('auth.reset_title')}
      subtitle={t('auth.reset_subtitle')}
    >
      <View style={styles.formContent}>
        <View style={styles.inputs}>
          <Input
            label={t('auth.email_label')}
            placeholder={t('auth.email_placeholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Button
          title={t('auth.send_reset_link')}
          onPress={handleResetPassword}
          loading={loading}
          fullWidth
          size="lg"
          style={styles.actionButton}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>{t('auth.back_to_login')}</Text>
        </TouchableOpacity>
      </View>
    </AuthHeroLayout>
  );
}

const styles = StyleSheet.create({
  formContent: {
    width: '100%',
  },
  inputs: {
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 8,
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: designSystem.colors.text.secondary,
  },
});
