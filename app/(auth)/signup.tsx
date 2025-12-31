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
  useWindowDimensions
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { designSystem } from '@/constants/designSystem';
import Input from '@/components/ui/Input';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { supabase } from '@/lib/supabase';
import AuthHeroPanel from '@/components/desktop/auth/AuthHeroPanel';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else {
      Alert.alert('Success', 'Please check your email to verify your account.');
      router.replace('/(auth)/login');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false
        }
      });

      if (error) {
        console.error('Google signup error:', error);
        Alert.alert('Signup Failed', 'Google authentication failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Google signup failed:', error);
      Alert.alert('Signup Failed', error.message || 'Google authentication failed. Please try again.');
    }
  };

  const handleAppleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false
        }
      });

      if (error) {
        console.error('Apple signup error:', error);
        Alert.alert('Signup Failed', 'Apple authentication failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Apple signup failed:', error);
      Alert.alert('Signup Failed', error.message || 'Apple authentication failed. Please try again.');
    }
  };

  const renderForm = () => (
    <View style={[styles.formContainer, isDesktop && styles.formContainerDesktop]}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Join thousands of pet parents using Pawzly</Text>

      <View style={styles.inputs}>
        <Input
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          isPassword
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          isPassword
        />
      </View>

      <EnhancedButton
        title="Create Account"
        onPress={handleSignup}
        loading={loading}
        fullWidth
      />

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or sign up with</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleSignup}
        >
          <View style={styles.googleIcon}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleAppleSignup}
        >
          <IconSymbol android_material_icon_name="apple" size={20} color={designSystem.colors.text.primary} />
          <Text style={styles.socialButtonText}>Apple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.signUpLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        <AuthHeroPanel />
        <View style={styles.desktopFormPanel}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={styles.desktopScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {renderForm()}
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
          {renderForm()}
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
    backgroundColor: designSystem.colors.background.primary,
  },
  desktopFormPanel: {
    flex: 1,
    backgroundColor: designSystem.colors.background.primary,
  },
  desktopScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 64,
    paddingVertical: 48,
  },

  // Mobile Layout
  container: {
    flex: 1,
    backgroundColor: designSystem.colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  // Form Container
  formContainer: {
    width: '100%',
  },
  formContainerDesktop: {
    maxWidth: 480,
  },

  // Typography
  title: {
    ...designSystem.typography.headline.medium,
    color: designSystem.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...designSystem.typography.body.large,
    color: designSystem.colors.text.secondary,
    marginBottom: 32,
  },

  // Inputs
  inputs: {
    gap: 20,
    marginBottom: 24,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: designSystem.colors.border.primary,
  },
  orText: {
    ...designSystem.typography.body.small,
    color: designSystem.colors.text.tertiary,
    paddingHorizontal: 16,
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
    height: 48,
    borderRadius: designSystem.borderRadius.md,
    borderWidth: 1,
    borderColor: designSystem.colors.border.primary,
    backgroundColor: designSystem.colors.background.secondary,
    gap: 8,
  },
  socialButtonText: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.primary,
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

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.text.secondary,
  },
  signUpLink: {
    ...designSystem.typography.body.medium,
    color: designSystem.colors.primary[500],
    fontWeight: 'bold',
  },
});
