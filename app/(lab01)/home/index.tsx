import { Link } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
    return (
        <View style={styles.container}> 
            <Text style={styles.title}> Home Screen</Text>
            <Link href="/(lab01)/home-details" asChild>
                <Button title="Go to Details" />
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
    title: { fontSize: 20, fontWeight: "bold" },
});
