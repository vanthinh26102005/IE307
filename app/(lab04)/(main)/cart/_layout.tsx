import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartStack() {
    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: { backgroundColor: "#F9FAFB" },
                header: ({ options, route }) => (
                    <SafeAreaView edges={["top", "left", "right"]} style={{ backgroundColor: "#F9FAFB", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
                        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "800",
                                    color: "#111827",
                                }}
                            >
                                {options.title ?? route.name}
                            </Text>
                        </View>
                    </SafeAreaView>
                ),
            }}
        />
    );
}
