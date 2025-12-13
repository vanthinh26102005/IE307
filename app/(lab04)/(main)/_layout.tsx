import { Tabs } from "expo-router";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Lab04MainLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2563EB",
                tabBarLabelStyle: { fontSize: 12 },
            }}
        >
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
                    tabBarIcon: ({ color, size }) => <Ionicons name="albums" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                    tabBarIcon: ({ color, size }) => <Ionicons name="cart" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
