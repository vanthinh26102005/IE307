import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useAuth } from "@/context/AuthContext";

export default function Lab04Login() {
    const router = useRouter();
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (loading) return;
        setLoading(true);
        const result = await signIn(email, password);
        setLoading(false);
        if (!result.ok) {
            Alert.alert("Login Failed", result.message || "Incorrect email or password. Please try again.");
            return;
        }
        router.replace("/(lab04)/(main)/home");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
        >
            <View style={styles.card}>
                <Image source={require("@/app/screens/assets/react-logo.png")} style={styles.logo} />
                <Text style={styles.title}>Welcome 23521500</Text>
                <Text style={styles.subtitle}>Ngô Văn Thịnh BTTH4</Text>

                <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#6B7280" />
                    <TextInput
                        placeholder="Email or username"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                    />
                </View>

                <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={handleLogin} activeOpacity={0.9}>
                    <Text style={styles.buttonText}>{loading ? "Signing in..." : "LOG IN"}</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>Or login with</Text>

                <View style={styles.socialRow}>
                    <Image source={require("@/app/screens/assets/facebook-logo.png")} style={styles.socialIcon} />
                    <Image source={require("@/app/screens/assets/google-logo.png")} style={styles.socialIcon} />
                </View>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Don’t have an account?</Text>
                    <Link href="/(lab04)/(auth)/register" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}> Register now!</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    card: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#FFFFFF",
        padding: 24,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
        alignItems: "center",
        gap: 12,
    },
    logo: {
        width: 96,
        height: 96,
        marginBottom: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#111827",
    },
    subtitle: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 8,
    },
    inputWrapper: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
    },
    button: {
        marginTop: 6,
        width: "100%",
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 16,
    },
    orText: {
        color: "#6B7280",
        marginTop: 8,
    },
    socialRow: {
        flexDirection: "row",
        gap: 24,
        marginBottom: 4,
    },
    socialIcon: {
        width: 45,
        height: 45,
    },
    footerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    footerText: {
        color: "#4B5563",
    },
    linkText: {
        color: "#D57C2C",
        fontWeight: "700",
    },
});
