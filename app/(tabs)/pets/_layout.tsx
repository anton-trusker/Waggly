import { Stack } from 'expo-router';

export default function PetsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-pet" />
      <Stack.Screen name="add-pet-wizard" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="add-vaccination" />
      <Stack.Screen name="add-treatment" />
      <Stack.Screen name="add-health-record" />
    </Stack>
  );
}
