import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function WebAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handle the OAuth callback for web
    const handleCallback = async () => {
      try {
        // Get the current session to check if user is authenticated
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          router.replace('/web/auth/login' as any);
          return;
        }

        if (session) {
          // User is authenticated, redirect to appropriate page
          // Check if user has completed onboarding by checking profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            // User has profile, go to dashboard
            router.replace('/web/dashboard' as any);
          } else {
            // User needs to complete profile setup
            router.replace('/web/onboarding/language' as any);
          }
        } else {
          // No session found, redirect to login
          router.replace('/web/auth/login' as any);
        }
      } catch (error) {
        console.error('Callback error:', error);
        router.replace('/web/auth/login' as any);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366F1" />
      <Text style={styles.text}>Completing authentication...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
});