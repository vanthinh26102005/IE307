import { Stack } from "expo-router";
import { useSettings } from "../context/SettingsContext";

export default function SettingsLayout() {
    const { colors } = useSettings();
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
                headerTitleStyle: { color: colors.text },
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen name="index" options={{ title: "Cài đặt" }} />
        </Stack>
    );
}
