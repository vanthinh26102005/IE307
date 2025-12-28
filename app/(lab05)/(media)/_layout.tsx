import { Stack } from "expo-router";

export default function MediaLayout() {
  return (
    <Stack>
      <Stack.Screen name="media-library" options={{ title: "Media Library" }} />
      <Stack.Screen name="record-video" options={{ title: "Record Video" }} />
    </Stack>
  );
}
