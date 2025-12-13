import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "@/context/AuthContext";

const LoadingOverlay = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F9FAFB" }}>
        <ActivityIndicator size="large" color="#2563EB" />
    </View>
);

const RootNavigator = () => {
    const { isRestoring } = useAuth();

    if (isRestoring) return <LoadingOverlay />;

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(main)" />
        </Stack>
    );
};

export default function Lab04Layout() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
}
