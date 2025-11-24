import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function AccountScreen() {
    const { signOut, email } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        signOut();
        // The root layout will automatically redirect to the login screen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome, {email}</Text>
            <Button title="LOG OUT" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
    text: { fontSize: 18, marginBottom: 20 },
});
