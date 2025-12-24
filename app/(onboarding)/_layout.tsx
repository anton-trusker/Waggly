import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="language-selection" />
      <Stack.Screen name="profile-setup" />
    </Stack>
  );
}
