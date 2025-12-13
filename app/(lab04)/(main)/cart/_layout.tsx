import { Stack } from "expo-router";
import React from "react";

export default function CartStack() {
    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerTitleStyle: { fontWeight: "700" },
                headerStyle: { backgroundColor: "#F9FAFB" },
            }}
        />
    );
}
