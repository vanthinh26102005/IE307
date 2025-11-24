import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link, Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
    const { isAuthenticated } = useAuth();

    //   MENU _ CAC BAI TAP DA LAM
    return (
        <View style={styles.container}>
            <Text style={styles.title}>BTTH IE307</Text>

            <Link href="/(tabs)/feed" asChild>
                <TouchableOpacity style={styles.btn}>
                    <Text style={styles.btnText}>LAB01 + LAB02 (1+2)</Text>
                </TouchableOpacity>
            </Link>

            <Link href={isAuthenticated ? "/(main)/home" : "/(auth)/login"} asChild>
                <TouchableOpacity style={styles.btn}>
                    <Text style={styles.btnText}>LAB02 ( 3 - Authentication)</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 24 },
    title: { fontSize: 22, fontWeight: "bold" },
    btn: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
    },
    btnText: { color: "white", fontSize: 16, fontWeight: "600" },
    note: { marginTop: 30, fontSize: 14, color: "#666" },
});