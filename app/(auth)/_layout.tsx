import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AuthLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#f8f9fb" },
        headerTitleAlign: "center",
        headerShadowVisible: false,
      }}
    >
      {/* LOGIN SCREEN */}
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.replace("/")}
              style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}
            >
              <Ionicons name="home-outline" size={22} color="#2563EB" />
              <Text style={{ marginLeft: 4, color: "#2563EB", fontWeight: "600" }}>
                Home
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      {/* REGISTER SCREEN */}
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.replace("/")}
              style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}
            >
              <Ionicons name="home-outline" size={22} color="#2563EB" />
              <Text style={{ marginLeft: 4, color: "#2563EB", fontWeight: "600" }}>
                Home
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}