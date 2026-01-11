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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024; // Changed from 768 to hide hero on tablet
  const { t } = useLocale();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.enter_both'));
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      Alert.alert(t('auth.login_failed'), error.message);
    } else {
      router.replace('/(tabs)/(home)');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const redirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        }
      });

      if (error) {
        console.error('Google login error:', error);
        Alert.alert(t('auth.login_failed'), error.message || t('common.error'));
      }
    } catch (error: any) {
      console.error('Google login failed:', error);
      Alert.alert(t('auth.login_failed'), error.message || t('common.error'));
    }
  };

  // Common Header (Logo + Name)
  const renderLogo = () => (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/icons/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.appName}>Waggli</Text>
    </View>
  );

  const renderFormContent = () => (
    <View style={[styles.formContainer, isDesktop && styles.formContainerDesktop]}>
      {/* Title on Top of Card */}
      <Text style={styles.cardTitle}>{t('auth.sign_in')}</Text>

      <AuthTabs activeTab="signin" />

      <View style={styles.inputs}>
        <Input
          label={t('auth.email_label')}
          placeholder={t('auth.email_placeholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={{ marginBottom: 12, backgroundColor: '#F9FAFB' }}
        />

        <View>
          <Input
            label={t('auth.password_label')}
            placeholder={t('auth.password_placeholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            isPassword
            containerStyle={{ backgroundColor: '#F9FAFB' }}
          />
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>{t('auth.forgot_password')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <EnhancedButton
        title={t('auth.sign_in')}
        onPress={handleLogin}
        loading={loading}
        fullWidth
        style={styles.signInButton}
      />

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>{t('auth.or_continue')}</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleLogin}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' }}
            style={{ width: 20, height: 20 }}
          />
          {/* Fallback to text if image fails or for simplicity in RN without SVG support */}
          <View style={[styles.googleIcon, { display: 'none' }]}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.socialButtonText}>{t('auth.google')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        {/* Left Side - Hero Panel (50%) */}
        <View style={styles.desktopHeroContainer}>
          <AuthHeroPanel
            title={t('auth.hero_title')}
            subtitle={t('auth.hero_subtitle')}
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
    backgroundColor: '#fff', // Clean white background
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
    maxWidth: 520, // Constrain width
    alignSelf: 'center',
  },

  // Mobile Layout
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray background for mobile
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16, // Slightly tighter padding
    paddingVertical: 24,
    alignItems: 'center',
  },

  // Common Header
  header: {
    flexDirection: 'row', // Horizontal
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24, // Reduced from 32
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
    fontSize: 24, // Smaller font
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },

  // Typography
  cardTitle: {
    fontSize: 20, // Smaller title for mobile
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.OS === 'web' ? 'Plus Jakarta Sans' : undefined,
  },
  sectionTitle: {
    display: 'none',
  },

  // Form Container
  formContainer: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#fff',
    borderRadius: 20, // Slightly less rounded
    padding: 20, // Reduced padding
    shadowColor: '#000', // Softer shadow color
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
    padding: 0, // Remove padding to make it flush
    shadowColor: 'transparent', // Remove shadow for cleaner look on split screen
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 0,
    backgroundColor: 'transparent', // Ensure it's transparent
  },

  // Inputs
  inputs: {
    gap: 8, // Reduced from 12
    marginBottom: 20, // Reduced from 24
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1', // Primary brand color
  },

  signInButton: {
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
    // Hover state would be handled in CSS/interaction
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
