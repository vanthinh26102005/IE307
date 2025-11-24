import { Link } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function NotificationsScreen() {
    return (
        <View style={styles.container}>
            {/* The title for this screen is set in the Drawer _layout */}
            <Text style={styles.title}>Notifications Screen</Text>
            <Link href="/(lab03-task1)/notification-details" asChild>
                <Button title="Go to Details" />
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
    title: { fontSize: 20, fontWeight: "bold" },
});
