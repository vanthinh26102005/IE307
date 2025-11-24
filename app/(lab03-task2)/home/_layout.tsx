import { Stack } from "expo-router";
import { useSettings } from "../context/SettingsContext";

export default function HomeStackLayout() {
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
            <Stack.Screen name="index" options={{ title: "Ghi chú" }} />
            <Stack.Screen name="add" options={{ title: "Thêm ghi chú" }} />
            <Stack.Screen name="edit" options={{ title: "Chỉnh sửa ghi chú" }} />
        </Stack>
    );
}
