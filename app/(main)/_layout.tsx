import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

export default function MainLayout() {
    const { favouritesCount } = useAuth();
    return (
        <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#2563EB" }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: "Categories",
                    tabBarIcon: ({ color, size }) => <Ionicons name="grid" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="favourites"
                options={{
                    title: "Favourites",
                    tabBarBadge: favouritesCount,
                    tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: "Account",
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}