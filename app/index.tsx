import { Redirect, usePathname, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useEffect, useState } from 'react';

export default function Index() {
  const { session, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Only redirect if we're truly at the root path "/" or "/index"
    if (!loading && (pathname === '/' || pathname === '/index')) {
      setShouldRedirect(true);
    }
  }, [loading, pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Only redirect if we're at the root path
  if (shouldRedirect) {
    return <Redirect href={session ? "/(tabs)/(home)" : "/(auth)/login"} />;
  }

  // Otherwise, let the current route render
  return null;
}
