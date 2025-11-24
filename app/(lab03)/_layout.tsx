import { Stack } from "expo-router";

export default function Lab03Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="drawers" />
    </Stack>
  );
}