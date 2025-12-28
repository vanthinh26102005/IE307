import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = () => {
        if (loading) return;
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirm = confirm.trim();

        if (!trimmedEmail || !trimmedPassword || !trimmedConfirm) {
            Alert.alert("Missing info", "Please fill out all fields.");
            return;
        }
        const isEmailLike = /\S+@\S+\.\S+/.test(trimmedEmail);
        if (!isEmailLike) {
            Alert.alert("Invalid email", "Please enter a valid email address.");
            return;
        }
        if (trimmedPassword.length < 4) {
            Alert.alert("Weak password", "Password should be at least 4 characters.");
            return;
        }
        if (trimmedPassword !== trimmedConfirm) {
            Alert.alert("Password mismatch", "Passwords do not match.");
            return;
        }
        setLoading(true);
        Alert.alert("Registration", "Demo registration completed. Please log in.", [
            {
                text: "OK",
                onPress: () => {
                    setLoading(false);
                    router.replace("/(lab04)/(auth)/login");
                },
            },
        ]);
        if (!loading) {
            setEmail("");
            setPassword("");
            setConfirm("");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign up to explore products</Text>

                <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#6B7280" />
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoComplete="off"
                        textContentType="none"
                        importantForAutofill="no"
                        autoCorrect={false}
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
                        autoComplete="off"
                        textContentType="none"
                        importantForAutofill="no"
                        autoCorrect={false}
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
                    <TextInput
                        placeholder="Confirm password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={confirm}
                        onChangeText={setConfirm}
                        autoComplete="off"
                        textContentType="none"
                        importantForAutofill="no"
                        autoCorrect={false}
                        style={styles.input}
                    />
                </View>

                <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleRegister} activeOpacity={0.9} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Processing..." : "REGISTER"}</Text>
                </TouchableOpacity>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <Link href="/(lab04)/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}> Back to login</Text>
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
        gap: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
    },
    subtitle: {
        fontSize: 14,
        color: "#6B7280",
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
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 16,
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
