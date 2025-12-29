import { Stack } from "expo-router";

export default function Lab05Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "LAB05 - Native Device Features" }}
      />
      <Stack.Screen name="(places)" options={{ headerShown: false }} />
      <Stack.Screen name="(media)" options={{ headerShown: false }} />
    </Stack>
  );
}
