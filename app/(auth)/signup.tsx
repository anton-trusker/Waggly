import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { designSystem } from '@/constants/designSystem';
import Input from '@/components/ui/Input';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { supabase } from '@/lib/supabase';
import AuthHeroPanel from '@/components/desktop/auth/AuthHeroPanel';
import { useLocale } from '@/hooks/useLocale';
import { AuthTabs } from '@/components/auth/AuthTabs';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { t } = useLocale();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert(t('common.error'), t('auth.fill_all'));
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwords_mismatch'));
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      console.error('Signup error:', error);
      // More detailed error message
      let message = error.message;
      if (message === 'Database error saving new user') {
        message = 'Account created but profile setup failed. Please contact support.';
      } else if (error.code === 'unexpected_failure') { // Check if specific code property exists (it might not on AuthError, but good to try)
        message = `${error.message} (Code: ${error.code})`;
      }

      Alert.alert(t('auth.signup_failed'), message);
    } else {
      Alert.alert('Success', t('auth.verify_email'));
      router.replace('/(auth)/login');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        }
      });

      if (error) {
        console.error('Google signup error:', error);
        Alert.alert(t('auth.signup_failed'), error.message || t('common.error'));
      }
    } catch (error: any) {
      console.error('Google signup failed:', error);
      Alert.alert(t('auth.signup_failed'), error.message || t('common.error'));
    }
  };

  const handleAppleSignup = async () => {
    // Hidden per request
    return;
    /*
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      //...
    } catch (error) {...}
    */
  };

  // Common Header (Logo + Name)
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
      {/* Title on Top of Card */}
      <Text style={styles.cardTitle}>{t('auth.signup_title') || 'Create Account'}</Text>

      <AuthTabs activeTab="signup" />

      <View style={styles.inputs}>
        <Input
          label={t('auth.email_label')}
          placeholder={t('auth.email_placeholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={{ marginBottom: 12 }}
        />

        <Input
          label={t('auth.password_label')}
          placeholder={t('auth.password_placeholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          isPassword
          containerStyle={{ marginBottom: 12 }}
        />

        <Input
          label={t('auth.confirm_password_label')}
          placeholder={t('auth.password_placeholder')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          isPassword
        />
      </View>

      <EnhancedButton
        title={t('auth.create_account')}
        onPress={handleSignup}
        loading={loading}
        fullWidth
        style={styles.signUpButton}
      />

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>{t('auth.or_continue')}</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleSignup}
          activeOpacity={0.7}
        >
          <View style={styles.googleIcon}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.socialButtonText}>{t('auth.google')}</Text>
        </TouchableOpacity>

        {/* Hidden Apple
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleAppleSignup}
        >
          <IconSymbol android_material_icon_name="apple" size={20} color={designSystem.colors.text.primary} />
          <Text style={styles.socialButtonText}>Apple</Text>
        </TouchableOpacity>
        */}
      </View>
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

  // Mobile
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo OUTSIDE the form card on mobile */}
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
    backgroundColor: designSystem.colors.neutral[50], // Slightly darker bg for contrast
  },
  desktopFormPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center the card
  },
  desktopScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 16, // Reduced from 24
    width: '100%',
    alignItems: 'center',
  },

  // Mobile Layout
  container: {
    flex: 1,
    backgroundColor: designSystem.colors.neutral[50], // Mobile now uses off-white bg
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16, // Add side spacing for card
    paddingVertical: 20,
    alignItems: 'center',
  },

  // Common Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Reduced from 32
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
    fontSize: 20, // Smaller text
    fontWeight: '800',
    color: designSystem.colors.text.primary,
    letterSpacing: -0.5,
  },

  // Typography
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: designSystem.colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Plus Jakarta Sans',
  },
  sectionTitle: {
    display: 'none', // Hide old title
  },

  // Form Container (Mobile Card by default, Desktop overrides)
  formContainer: {
    width: '100%',
    backgroundColor: designSystem.colors.background.primary,
    borderRadius: designSystem.borderRadius['2xl'],
    padding: 24, // Compact padding
    ...designSystem.shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  formContainerDesktop: {
    width: '100%',
    maxWidth: 480, // Wider for desktop
    padding: 40,
    ...designSystem.shadows.xl, // Stronger shadow for desktop
  },

  // Inputs
  inputs: {
    gap: 12, // Compact gap
    marginBottom: 20,
  },

  signUpButton: {
    shadowColor: designSystem.colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20, // Compact
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: designSystem.colors.border.primary,
  },
  orText: {
    fontSize: 12,
    color: designSystem.colors.text.tertiary,
    paddingHorizontal: 12,
    fontWeight: '500',
  },

  // Social Buttons
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44, // Compact height
    borderRadius: designSystem.borderRadius.xl,
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
    backgroundColor: '#fff',
    gap: 8,
    ...designSystem.shadows.sm,
  },
  socialButtonText: {
    fontSize: 14,
    color: designSystem.colors.text.primary,
    fontWeight: '600',
  },
  googleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DB4437',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
