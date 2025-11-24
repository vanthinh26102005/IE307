import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSegments, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function Lab01Layout() {
    const { isAuthenticated } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // an array of all segments of the current route
        const inAuthGroup = (segments as string[]).includes('(auth)');

        if (!isAuthenticated && !inAuthGroup) {
            router.replace('/(lab01)/(auth)/login');
        } else if (isAuthenticated && inAuthGroup) {
            router.replace('/(lab01)/home');
        }
    }, [isAuthenticated, router, segments]);

    const renderBackButton = () => (
        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
    );

    return (
        <Drawer screenOptions={{ headerShown: true }}>
            <Drawer.Screen
                name="home"
                options={{
                    title: "Home",
                    drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
                }}
            />
            <Drawer.Screen
                name="notification/index"
                options={{
                    title: "Notification",
                    drawerIcon: ({ color, size }) => <Ionicons name="notifications-outline" color={color} size={size} />,
                }}
            />
            <Drawer.Screen
                name="help"
                options={{
                    title: "Help",
                    drawerIcon: ({ color, size }) => <Ionicons name="help-circle-outline" color={color} size={size} />,
                }}
            />
            {/* Screens not visible in the drawer */}
            <Drawer.Screen
                name="(auth)"
                options={{
                    drawerItemStyle: { display: 'none' },
                    headerShown: false,
                }}
            />
            <Drawer.Screen
                name="home-details"
                options={{
                    drawerItemStyle: { display: 'none' },
                    title: "Home Details",
                    headerLeft: renderBackButton,
                }}
            />
            <Drawer.Screen
                name="notification-details"
                options={{
                    drawerItemStyle: { display: 'none' },
                    title: "Notification Details",
                    headerLeft: renderBackButton,
                }}
            />
        </Drawer>
    );
}
