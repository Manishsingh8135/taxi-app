import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="search" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="tracking" />
    </Stack>
  );
}
