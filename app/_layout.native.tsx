import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/contexts/AuthContext";
import { PostHogProvider } from "posthog-react-native";

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
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <PostHogProvider
          apiKey="phc_V69oo6nlMMA57eE6zWC4uyfCop2RgR6Wuh8tC1KhPbu"
          options={{
            host: 'https://eu.i.posthog.com',
            enableSessionReplay: true,
          }}
          autocapture
        >
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
              </Stack>
              <SystemBars style="auto" />
            </GestureHandlerRootView>
          </AuthProvider>
        </PostHogProvider>
      </ThemeProvider>
    </>
  );
}