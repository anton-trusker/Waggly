
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { designSystem } from '@/constants/designSystem';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { useLocale } from '@/hooks/useLocale';

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.title}>{t('auth.reset_title')}</Text>
        <Text style={styles.subtitle}>
          {t('auth.reset_subtitle')}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={commonStyles.inputLabel}>{t('auth.email_label')}</Text>
          <TextInput
            style={commonStyles.input}
            placeholder={t('auth.email_placeholder')}
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <EnhancedButton
          title={t('auth.send_reset_link')}
          variant="primary"
          size="lg"
          onPress={handleResetPassword}
          loading={loading}
          fullWidth={true}
          style={styles.button}
        />

        <EnhancedButton
          title={t('auth.back_to_login')}
          variant="secondary"
          size="lg"
          onPress={() => router.back()}
          disabled={loading}
          fullWidth={true}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  button: {
    width: '100%',
    marginBottom: 16,
  },
});
