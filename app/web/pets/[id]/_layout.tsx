import { Stack } from 'expo-router';

export default function PetIdLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="edit" />
            <Stack.Screen name="health/medication" options={{ presentation: 'modal' }} />
            <Stack.Screen name="health/treatment" options={{ presentation: 'modal' }} />
            <Stack.Screen name="health/vaccination" options={{ presentation: 'modal' }} />
            <Stack.Screen name="health/visit" options={{ presentation: 'modal' }} />
        </Stack>
    );
}
