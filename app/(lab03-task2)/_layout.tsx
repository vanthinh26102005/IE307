import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SettingsProvider, useSettings } from "./context/SettingsContext";

function TabNavigator() {
    const { colors, darkMode } = useSettings();
    return (
        <Tabs
            initialRouteName="home"
            screenOptions={{
                headerShown: false,
                headerShadowVisible: false,
                tabBarActiveTintColor: darkMode ? "#38bdf8" : "#2563EB",
                tabBarInactiveTintColor: darkMode ? "#94a3b8" : "#94a3b8",
                tabBarStyle: { backgroundColor: colors.surface },
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
                tabBarLabelStyle: { fontSize: 12 },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Notes",
                    tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}

export default function Lab03Task2Layout() {
    return (
        <SettingsProvider>
            <TabNavigator />
        </SettingsProvider>
    );
}
