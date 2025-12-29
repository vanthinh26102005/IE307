import { Stack } from "expo-router";

export default function PlacesLayout() {
  return (
    <Stack>
      <Stack.Screen name="places-list" options={{ title: "My Places" }} />
      <Stack.Screen name="add-place" options={{ title: "Add a new Place" }} />
      <Stack.Screen name="place-detail" options={{ title: "Place Detail" }} />
      <Stack.Screen name="map" options={{ title: "Map" }} />
    </Stack>
  );
}
