
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
  Image,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { designSystem } from '@/constants/designSystem';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { useLocale } from '@/hooks/useLocale';
import AuthHeroPanel from '@/components/desktop/auth/AuthHeroPanel';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import Input from '@/components/ui/Input';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { t } = useLocale();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

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

  // Common Header
  const renderLogo = () => (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.appName}>Pawzly</Text>
    </View>
  );

  const renderFormContent = () => (
    <View style={[styles.formContainer, isDesktop && styles.formContainerDesktop]}>
      {/* Logo inside only if we wanted it, but we want it OUTSIDE on mobile now */}

      <Text style={styles.cardTitle}>{t('auth.reset_title')}</Text>
      <Text style={styles.subtitle}>{t('auth.reset_subtitle')}</Text>

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

      <EnhancedButton
        title={t('auth.send_reset_link')}
        onPress={handleResetPassword}
        loading={loading}
        fullWidth
        style={{ marginBottom: 12 }}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>{t('auth.back_to_login')}</Text>
      </TouchableOpacity>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        <AuthHeroPanel />
        <View style={styles.desktopFormPanel}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <ScrollView
              contentContainerStyle={styles.desktopScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {renderLogo()}
              {renderFormContent()}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <LoadingOverlay visible={loading} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderLogo()}
          {renderFormContent()}
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingOverlay visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Desktop Layout
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: designSystem.colors.neutral[50],
  },
  desktopFormPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desktopScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },

  // Mobile Layout
  container: {
    flex: 1,
    backgroundColor: designSystem.colors.neutral[50],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },

  // Common Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // consistent
    gap: 8,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: designSystem.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 24,
    height: 24,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: designSystem.colors.text.primary,
    letterSpacing: -0.5,
  },

  // Form Container
  formContainer: {
    width: '100%',
    backgroundColor: designSystem.colors.background.primary,
    borderRadius: designSystem.borderRadius['2xl'],
    padding: 24,
    ...designSystem.shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  formContainerDesktop: {
    width: '100%',
    maxWidth: 480,
    padding: 40,
    ...designSystem.shadows.xl,
  },

  // Typography
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: designSystem.colors.text.primary,
    textAlign: 'center',
    marginBottom: 8, // subtitle follows
    fontFamily: 'Plus Jakarta Sans',
  },
  title: { display: 'none' }, // Remove old title styles
  subtitle: {
    fontSize: 14,
    color: designSystem.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Plus Jakarta Sans',
  },

  inputs: {
    marginBottom: 20,
  },

  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: designSystem.colors.text.secondary,
  },
});
