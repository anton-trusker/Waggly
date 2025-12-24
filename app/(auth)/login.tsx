
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { designSystem } from '@/constants/designSystem';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '@/components/ui/Input';
import { IconSymbol } from '@/components/ui/IconSymbol';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import BetaBadge from '@/components/ui/BetaBadge';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; auth?: string }>({});
  const { signIn, session, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (session && !authLoading) {
      router.replace('/(tabs)/(home)');
    }
  }, [session, authLoading]);

  const handleLogin = async () => {
    const nextErrors: typeof errors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      nextErrors.email = 'Enter a valid email';
    }
    if (!password.trim()) {
      nextErrors.password = 'Password is required';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      setErrors((e) => ({ ...e, auth: error.message || 'Invalid email or password' }));
    } else {
      router.replace('/(tabs)/(home)');
    }
  };

  if (authLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (showLoginForm) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
          style={styles.gradient}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowLoginForm(false)}
            >
              <Text style={styles.backText}>‹ Back</Text>
            </TouchableOpacity>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue managing your pet&apos;s health
              </Text>

              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={(t) => { setEmail(t); if (errors.email) setErrors((e)=>({...e,email:undefined})); }}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
                accessibilityLabel="Email"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(t) => { setPassword(t); if (errors.password) setErrors((e)=>({...e,password:undefined})); }}
                secureTextEntry
                editable={!loading}
                accessibilityLabel="Password"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => router.push('/(auth)/forgot-password')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {errors.auth && <Text style={styles.errorText}>{errors.auth}</Text>}

              <EnhancedButton
                title="Sign In"
                variant="primary"
                size="lg"
                onPress={handleLogin}
                loading={loading}
                fullWidth={true}
                style={styles.button}
              />
            </View>
          </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
        <LoadingOverlay visible={loading} message="Signing in..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.illustrationContainer}>
            <Image
              source={require('@/assets/images/image 8276.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Text style={[styles.title, { marginBottom: 0 }]}>Welcome to Pawzly</Text>
                <BetaBadge />
            </View>
            <Text style={styles.subtitle}>
              Connecting kind people who care about animals — together we make a difference
            </Text>

            <EnhancedButton
              title="Create Account"
              variant="primary"
              size="lg"
              onPress={() => router.push('/(auth)/signup')}
              disabled={loading}
              fullWidth={true}
              style={styles.button}
            />

            <EnhancedButton
              title="Sign In"
              variant="secondary"
              size="lg"
              onPress={() => setShowLoginForm(true)}
              disabled={loading}
              fullWidth={true}
              style={styles.button}
            />

            {/* Social login hidden for now */}

            <Text style={styles.terms}>
              By creating new account, you agree to our{'\n'}
              <Text style={styles.termsLink}>Terms of Services</Text> &{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  backText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '300',
  },
  illustrationContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  illustration: {
    width: '100%',
    height: 300,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    minHeight: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    width: '100%',
    marginBottom: designSystem.spacing[3],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textSecondary,
    fontSize: 13,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  terms: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
  },
});
