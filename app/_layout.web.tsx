import "@/lib/i18n";
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
  initialRouteName: "(tabs)",
};

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

  const { session, loading } = useAuth();
  const router = useRouter(); // Need useRouter, segments

  useEffect(() => {
    if (loading) return;

    // Simple auth guard for web
    // Assuming all /web routes (except auth) require session
    // And /web/auth routes (login/signup) are for non-session

    // However, the router logic is better placed in a higher order component or here if we have segments.
    // But since we are at the root, we can just ensure we have 'web' in the stack.
  }, [loading, session]);

  return (
    <>
      <StatusBar style="auto" animated />
      <ThemeContextProvider>
        <NavigationThemeProvider
          value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
        >
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
                <Stack.Screen name="web" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
              </Stack>
              <SystemBars style="auto" />
            </GestureHandlerRootView>
          </AuthProvider>
        </NavigationThemeProvider>
      </ThemeContextProvider>
    </>
  );
}
