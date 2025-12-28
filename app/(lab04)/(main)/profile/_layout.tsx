import { Stack } from "expo-router";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileStack() {
    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: { backgroundColor: "#F9FAFB" },
                header: ({ options, route, navigation, back }) => {
                    const showBack = back && route.name === "edit";
                    const right = route.name === "edit" && options.headerRight
                        ? options.headerRight({ tintColor: "#2563EB", canGoBack: showBack })
                        : null;
                    return (
                        <SafeAreaView
                            edges={["top", "left", "right"]}
                            style={{
                                backgroundColor: "#F9FAFB",
                                borderBottomWidth: route.name === "edit" ? 0 : 1,
                                borderBottomColor: "#E5E7EB",
                            }}
                        >
                            <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                                    {showBack ? (
                                        <TouchableOpacity onPress={navigation.goBack} hitSlop={10}>
                                            <Ionicons name="chevron-back" size={24} color="#111827" />
                                        </TouchableOpacity>
                                    ) : null}
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "800",
                                            color: "#111827",
                                        }}
                                    >
                                        {options.title ?? route.name}
                                    </Text>
                                </View>
                                {right}
                            </View>
                        </SafeAreaView>
                    );
                },
            }}
        />
    );
}
