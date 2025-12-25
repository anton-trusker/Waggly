import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import Input from '@/components/ui/Input';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, session } = useAuth();
  const { colors, isDark } = useAppTheme();

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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false
        }
      });
      
      if (error) {
        console.error('Google login error:', error);
        Alert.alert('Login Failed', 'Google authentication failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Google login failed:', error);
      Alert.alert('Login Failed', error.message || 'Google authentication failed. Please try again.');
    }
  };

  const handleAppleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false
        }
      });
      
      if (error) {
        console.error('Apple login error:', error);
        Alert.alert('Login Failed', 'Apple authentication failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Apple login failed:', error);
      Alert.alert('Login Failed', error.message || 'Apple authentication failed. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.imageContainer}>
            {/* Using the image from design or placeholder */}
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuTVMEMHuEIPq00WTY1X1jvzd7VG7GPA2j34f2PJi_t_6NmJj8BTT8xijkJE8p2OOjlaYhGmgYK7UyUV4Erb_KO8JnD5zBo3-pP2HWjbLVhiWGeeiAK2pGvv8xUzk4-qFO4ObBgm3GdJajlYIhLI4wdV3_QodWslo1e3XH8lYiSroWAYvE95-h3QFMGzBZLXpXCgkmscbPfjfssYS8CB3ziFhWBJl6VRKjPbZfFdEnaeuEPmjzhogs1WzdYc7E7X_afbGbdQaGBA9K' }}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', colors.background.primary]}
              start={{ x: 0.5, y: 0.6 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.imageGradient}
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: colors.text.primary }]}>Welcome back to Pawzly</Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Manage your pet's health and happiness.</Text>

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
                  <Text style={[styles.forgotPasswordText, { color: colors.primary[500] }]}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actions}>
              <EnhancedButton
                title="Log In"
                onPress={handleLogin}
                loading={loading}
                fullWidth
              />

              <TouchableOpacity style={[styles.faceIdButton, { borderColor: colors.border.primary, backgroundColor: colors.background.secondary }]}>
                <IconSymbol android_material_icon_name="face" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.socialSection}>
              <View style={styles.divider}>
                <View style={[styles.line, { backgroundColor: colors.border.primary }]} />
                <Text style={[styles.orText, { color: colors.text.secondary, backgroundColor: colors.background.primary }]}>Or continue with</Text>
                <View style={[styles.line, { backgroundColor: colors.border.primary }]} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity 
                  style={[styles.socialButton, { borderColor: colors.border.primary, backgroundColor: colors.background.secondary }]}
                  onPress={handleAppleLogin}
                >
                  <IconSymbol android_material_icon_name="apple" size={24} color={colors.text.primary} />
                  <Text style={[styles.socialButtonText, { color: colors.text.primary }]}>Continue with Apple</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.socialButton, { borderColor: colors.border.primary, backgroundColor: colors.background.secondary }]}
                  onPress={handleGoogleLogin}
                >
                  {/* Google Icon SVG or Placeholder - utilizing a simple text or icon for now */}
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'red', marginRight: 8, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>G</Text>
                  </View>
                  <Text style={[styles.socialButtonText, { color: colors.text.primary }]}>Continue with Google</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.text.secondary }]}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text style={[styles.signUpLink, { color: colors.primary[500] }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingOverlay visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: -20, // Overlap slightly or just sit below
  },
  title: {
    fontSize: 28, // 32px in design, scaled down slightly for mobile or use 32
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.select({ ios: 'Manrope-Bold', android: 'sans-serif-bold' }), // Fallback
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: Platform.select({ ios: 'Manrope-Regular', android: 'sans-serif' }),
  },
  inputs: {
    gap: 16,
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  faceIdButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialSection: {
    marginTop: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
    height: 20,
  },
  line: {
    flex: 1,
    height: 1,
  },
  orText: {
    paddingHorizontal: 12,
    fontSize: 14,
    position: 'absolute',
    // centering handled by flex container if we remove absolute, but absolute helps with background covering the line
    zIndex: 1,
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
