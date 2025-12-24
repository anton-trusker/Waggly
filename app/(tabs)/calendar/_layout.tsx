import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function CalendarLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="add-event" 
        options={{ 
          presentation: 'modal',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
