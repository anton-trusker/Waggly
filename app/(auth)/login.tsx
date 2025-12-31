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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      router.replace('/(tabs)/(home)');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Use window.location.origin for web, or allow Supabase to handle default for native
      const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          // skipBrowserRedirect: false // Default is false, removing explicit set to avoid issues
        }
      });

      if (error) {
        console.error('Google login error:', error);
        Alert.alert('Login Failed', error.message || 'Google authentication failed.');
      }
    } catch (error: any) {
      console.error('Google login failed:', error);
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred.');
    }
  };

  const handleAppleLogin = async () => {
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
      // ...
    } catch (error) { ... }
    */
  };

  const renderDesktopHeader = () => (
    <View style={styles.desktopHeader}>
      <View style={styles.desktopLogoContainer}>
        <IconSymbol android_material_icon_name="pets" size={28} color={designSystem.colors.primary[600]} />
      </View>
      <Text style={styles.desktopAppName}>Pawzly</Text>
    </View>
  );

  const renderMobileHeader = () => (
    <View style={styles.mobileHeader}>
      <View style={styles.logoContainer}>
        <IconSymbol android_material_icon_name="pets" size={40} color={designSystem.colors.primary[600]} />
      </View>
      <Text style={styles.appName}>Pawzly</Text>
    </View>
  );

  const renderForm = () => (
    <View style={[styles.formContainer, isDesktop && styles.formContainerDesktop]}>
      {/* Dynamic Headers based on platform/view within the form flow if needed, but we place them outside in main render usually. 
          However, for Mobile, "In center before Form" suggests inside scrollview.
          For Desktop, "Add Header...". We'll put it top left of form panel.
      */}
      {!isDesktop && renderMobileHeader()}
      {isDesktop && renderDesktopHeader()}

      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to continue to Pawzly</Text>

      <View style={styles.inputs}>
        <Input
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View>
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            isPassword
          />
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <EnhancedButton
        title="Sign In"
        onPress={handleLogin}
        loading={loading}
        fullWidth
      />

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or continue with</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleLogin}
        >
          <View style={styles.googleIcon}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>

        {/* Hidden Apple Signin 
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleAppleLogin}
        >
          <IconSymbol android_material_icon_name="apple" size={20} color={designSystem.colors.text.primary} />
          <Text style={styles.socialButtonText}>Apple</Text>
        </TouchableOpacity>
        */}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        <AuthHeroPanel
          title="Welcome back to Pawzly"
          subtitle="Your pet's health and happiness, all in one place. Sign in to access your dashboard and manage your furry friends."
        />
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
    justifyContent: 'center', // Center vertically
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
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  // Header Logic
  mobileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  desktopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
    gap: 12,
  },

  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: designSystem.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  desktopLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: designSystem.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: designSystem.colors.text.primary,
    letterSpacing: -0.5,
  },
  desktopAppName: {
    fontSize: 24,
    fontWeight: '800',
    color: designSystem.colors.text.primary,
    letterSpacing: -0.5,
  },

  // Form Container
  formContainer: {
    width: '100%',
  },
  formContainerDesktop: {
    maxWidth: 480,
    alignSelf: 'center', // Ensure centered in panel
  },

  // Typography
  title: {
    ...(designSystem.typography.headline.medium as any),
    color: designSystem.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...(designSystem.typography.body.large as any),
    color: designSystem.colors.text.secondary,
    marginBottom: 32,
  },

  // Inputs
  inputs: {
    gap: 20,
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    ...(designSystem.typography.label.medium as any),
    color: designSystem.colors.primary[500],
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
    ...(designSystem.typography.body.small as any),
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
    ...(designSystem.typography.body.medium as any),
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
    ...(designSystem.typography.body.medium as any),
    color: designSystem.colors.text.secondary,
  },
  signUpLink: {
    ...(designSystem.typography.body.medium as any),
    color: designSystem.colors.primary[500],
    fontWeight: 'bold',
  },
});

