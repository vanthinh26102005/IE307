import { Stack } from "expo-router";

export default function PlacesLayout() {
  return (
    <Stack>
      <Stack.Screen name="places-list" options={{ title: "Places" }} />
      <Stack.Screen name="add-place" options={{ title: "Add Place" }} />
      <Stack.Screen name="place-detail" options={{ title: "Place Detail" }} />
      <Stack.Screen name="map" options={{ title: "Map" }} />
    </Stack>
  );
}
