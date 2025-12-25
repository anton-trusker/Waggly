import "@/lib/i18n";
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useScreenType } from "@/hooks/useScreenType";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { ThemeProvider as ThemeContextProvider } from "@/contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "web",
};

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const { isMobile } = useScreenType();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (loading || !isMounted) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inWebGroup = segments[0] === 'web';
    const inTabsGroup = segments[0] === '(tabs)';

    // If on mobile and in web group -> go to mobile tabs
    if (isMobile && inWebGroup) {
      // Preserve sub-path if possible? For now, just go to root tabs
      // or map specific routes. Simplest is root tabs.
      router.replace('/(tabs)' as any);
    }
    // If on desktop and in tabs group -> go to web dashboard
    else if (!isMobile && inTabsGroup) {
      router.replace('/web/dashboard');
    }
  }, [loading, isMounted, isMobile, segments, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="web" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <SystemBars style="auto" />
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log('Environment check:');
    console.log('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
    console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
  }, []);

  if (!loaded) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "#70A1FF",
      background: "#F8F8FF",
      card: "#FFFFFF",
      text: "#333333",
      border: "#E0E0E0",
      notification: "#FFB347",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "#70A1FF",
      background: "#1A1A2E",
      card: "#16213E",
      text: "#EAEAEA",
      border: "#0F3460",
      notification: "#FFB347",
    },
  };

  return (
    <>
      <StatusBar style="auto" animated />
      <ThemeContextProvider>
        <NavigationThemeProvider
          value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
        >
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </NavigationThemeProvider>
      </ThemeContextProvider>
    </>
  );
}
