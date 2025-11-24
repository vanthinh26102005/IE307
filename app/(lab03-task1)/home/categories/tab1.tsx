import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Tab1Screen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Category 1 Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: { fontSize: 18 },
});
