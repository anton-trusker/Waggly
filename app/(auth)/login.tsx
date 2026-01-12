import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/design-system/primitives/Button';
import { Checkbox } from '@/components/design-system/primitives/Checkbox';
import { supabase } from '@/lib/supabase';
import { useLocale } from '@/hooks/useLocale';
import { AuthHeroLayout } from '@/components/features/auth/AuthHeroLayout';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { t } = useLocale();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.enter_both'));
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password, rememberMe);
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

  const handleAppleLogin = async () => {
    // Basic placeholder for Apple login
    Alert.alert('Apple Login', 'Apple login integration coming soon.');
  };

  return (
    <AuthHeroLayout
      title={t('auth.sign_in')}
      subtitle={t('auth.welcome_back')}
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
          </View>
        </View>

        <View style={styles.formOptions}>
          <Checkbox
            label={t('auth.remember_me')}
            checked={rememberMe}
            onChange={setRememberMe}
          />
          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={styles.linkText}>{t('auth.forgot_password')}</Text>
          </TouchableOpacity>
        </View>

        <Button
          title={t('auth.sign_in')}
          onPress={handleLogin}
          loading={loading}
          fullWidth
          size="lg"
        />

        <View style={styles.signupSection}>
          <Text style={styles.noAccountText}>{t('auth.no_account')} </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.linkText}>{t('auth.sign_up')}</Text>
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
            onPress={handleGoogleLogin}
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
              onPress={handleAppleLogin}
              activeOpacity={0.7}
            >
              {/* Note: In a real app we'd use a better Apple logo SVG/image */}
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
    marginBottom: 8,
  },
  formOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: designSystem.colors.primary[600],
  },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  noAccountText: {
    fontSize: 14,
    color: designSystem.colors.text.secondary,
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
