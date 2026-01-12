import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { designSystem } from '@/constants/designSystem';
import { Input } from '@/components/design-system/primitives/Input';
import { Button } from '@/components/design-system/primitives/Button';
import { supabase } from '@/lib/supabase';
import { useLocale } from '@/hooks/useLocale';
import { AuthHeroLayout } from '@/components/features/auth/AuthHeroLayout';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { t } = useLocale();

  // Simple password strength calculator
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  }, [password]);

  const strengthColor = useMemo(() => {
    if (passwordStrength <= 1) return designSystem.colors.error[500];
    if (passwordStrength === 2) return '#EAB308'; // Yellow
    if (passwordStrength === 3) return '#84CC16'; // Lime
    return designSystem.colors.success[500];
  }, [passwordStrength]);

  const strengthLabel = useMemo(() => {
    if (!password) return '';
    if (passwordStrength <= 1) return t('auth.strength_weak') || 'Weak';
    if (passwordStrength === 2) return t('auth.strength_fair') || 'Fair';
    if (passwordStrength === 3) return t('auth.strength_good') || 'Good';
    return t('auth.strength_strong') || 'Strong';
  }, [passwordStrength, password]);

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
      let message = error.message;
      if (message === 'Database error saving new user') {
        message = 'Account created but profile setup failed. Please contact support.';
      }
      Alert.alert(t('auth.signup_failed'), message);
    } else {
      Alert.alert('Success', t('auth.verify_email') || 'Please check your email to verify your account.');
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
    Alert.alert('Apple Sign Up', 'Apple registration coming soon.');
  };

  return (
    <AuthHeroLayout
      title={t('auth.signup_title')}
      subtitle={t('auth.signup_subtitle')}
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

          <View>
            <Input
              label={t('auth.password_label')}
              placeholder={t('auth.password_placeholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarBackground}>
                  <View
                    style={[
                      styles.strengthBarFill,
                      {
                        width: `${(passwordStrength / 4) * 100}%`,
                        backgroundColor: strengthColor
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.strengthText, { color: strengthColor }]}>
                  {strengthLabel}
                </Text>
              </View>
            )}
          </View>

          <Input
            label={t('auth.confirm_password_label')}
            placeholder={t('auth.password_placeholder')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <Button
          title={t('auth.create_account')}
          onPress={handleSignup}
          loading={loading}
          fullWidth
          size="lg"
          style={styles.actionButton}
        />

        <View style={styles.loginSection}>
          <Text style={styles.alreadyAccountText}>{t('auth.already_have_account')} </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.linkText}>{t('auth.login_link')}</Text>
          </TouchableOpacity>
        </View>

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
            <Image
              source={{ uri: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>{t('auth.google')}</Text>
          </TouchableOpacity>

          {Platform.OS !== 'android' && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleSignup}
              activeOpacity={0.7}
            >
              <View style={styles.appleIconPlaceholder}>
                <Ionicons name="logo-apple" size={20} color="#000" />
              </View>
              <Text style={styles.socialButtonText}>{t('auth.apple')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </AuthHeroLayout>
  );
}

const styles = StyleSheet.create({
  formContent: {
    width: '100%',
  },
  inputs: {
    gap: 16,
    marginBottom: 24,
  },
  strengthContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  strengthBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: designSystem.colors.background.tertiary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    width: 50,
    textAlign: 'right',
  },
  actionButton: {
    marginTop: 8,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  alreadyAccountText: {
    fontSize: 14,
    color: designSystem.colors.text.secondary,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: designSystem.colors.primary[600],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: designSystem.colors.border.secondary,
  },
  orText: {
    fontSize: 14,
    color: designSystem.colors.text.tertiary,
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
    backgroundColor: designSystem.colors.background.primary,
    gap: 10,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  appleIconPlaceholder: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 15,
    color: designSystem.colors.text.primary,
    fontWeight: '600',
  },
});
