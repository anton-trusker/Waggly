
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
} from 'react-native';
import Input from '@/components/ui/Input';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { designSystem } from '@/constants/designSystem';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { EnhancedButton } from '@/components/ui/EnhancedButton';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string; auth?: string }>({});
  const { signUp, signIn } = useAuth();

  const handleSignup = async () => {
    const nextErrors: typeof errors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      nextErrors.email = 'Enter a valid email';
    }
    if (!password.trim()) {
      nextErrors.password = 'Password is required';
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }
    if (confirmPassword !== password) {
      nextErrors.confirm = 'Passwords do not match';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    const { error } = await signUp(email.trim(), password);
    if (error) {
      setLoading(false);
      setErrors((e) => ({ ...e, auth: error.message || 'Signup failed' }));
      return;
    }

    // Attempt auto-login and navigate to dashboard
    const loginResult = await signIn(email.trim(), password);
    setLoading(false);
    if (!loginResult.error) {
      router.replace('/(onboarding)/language-selection' as any);
    } else {
      setErrors((e) => ({ ...e, auth: 'Please verify your email, then sign in.' }));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Pawzly and start tracking your pet&apos;s health</Text>
        </View>

        <View style={styles.form}>
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
            placeholder="Create a password"
            value={password}
            onChangeText={(t) => { setPassword(t); if (errors.password) setErrors((e)=>({...e,password:undefined})); }}
            secureTextEntry
            editable={!loading}
            accessibilityLabel="Password"
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={(t) => { setConfirmPassword(t); if (errors.confirm) setErrors((e)=>({...e,confirm:undefined})); }}
            secureTextEntry
            editable={!loading}
            accessibilityLabel="Confirm password"
          />
          {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}

          {errors.auth && <Text style={styles.errorText}>{errors.auth}</Text>}

          <EnhancedButton
            title="Sign Up"
            variant="primary"
            size="lg"
            onPress={handleSignup}
            loading={loading}
            fullWidth={true}
            style={styles.button}
          />

          <Text style={styles.terms}>
            By creating an account, you agree to our{'\n'}
            <Text style={styles.termsLink}>Terms of Services</Text> &{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
      <LoadingOverlay visible={loading} message="Creating account..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '300',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  button: {
    width: '100%',
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    marginTop: 4,
  },
  terms: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
  termsLink: {
    color: colors.primary,
  },
});
