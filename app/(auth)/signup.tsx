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
  const isDesktop = width >= 1024; // Changed from 768 to hide hero on tablet
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
        {/* Left Side - Hero Panel (50%) */}
        <View style={styles.desktopHeroContainer}>
          <AuthHeroPanel
            title={t('auth.hero_signup_title')}
            subtitle={t('auth.hero_signup_subtitle')}
          />
        </View>

        {/* Right Side - Form (50%) */}
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
    backgroundColor: '#fff',
  },
  desktopHeroContainer: {
    flex: 1,
    display: 'flex',
  },
  desktopFormPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  desktopScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    maxWidth: 520,
    alignSelf: 'center',
  },

  // Mobile Layout
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },

  // Common Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 12,
  },
  logoContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },

  // Typography
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans' : undefined,
  },

  // Form Container
  formContainer: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  formContainerDesktop: {
    width: '100%',
    maxWidth: 440,
    padding: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },

  // Inputs
  inputs: {
    gap: 8, // Reduced from 12
    marginBottom: 20, // Reduced from 24
  },

  signUpButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 16,
    fontWeight: '500',
  },

  // Social Buttons
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    gap: 10,
  },
  socialButtonText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DB4437',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
