import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useAuth } from "@/context/AuthContext";
import { fetchUserCarts } from "@/services/api";

export default function Lab04MainLayout() {
    const { userId } = useAuth();
    const [cartCount, setCartCount] = useState<number | undefined>(undefined);

    useEffect(() => {
        const loadBadge = async () => {
            if (!userId) {
                setCartCount(undefined);
                return;
            }
            try {
                const response = await fetchUserCarts(userId);
                const first = response.data?.[0];
                if (first) {
                    const count = first.products.reduce((sum, p) => sum + p.quantity, 0);
                    setCartCount(count > 0 ? count : undefined);
                } else {
                    setCartCount(undefined);
                }
            } catch (error) {
                setCartCount(undefined);
            }
        };
        loadBadge();
    }, [userId]);

    return (
        <Tabs
            initialRouteName="home"
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
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: "Categories",
                    tabBarLabel: "Categories",
                    tabBarIcon: ({ color, size }) => <Ionicons name="albums" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                    tabBarLabel: "Cart",
                    tabBarBadge: cartCount,
                    tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
