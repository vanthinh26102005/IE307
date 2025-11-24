import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LoginScreen() {
    const router = useRouter(); // route init

    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) return;
        const result = await signIn(email, password);
        if (!result.ok) {
            Alert.alert("Login Failed", result.message || "Invalid credentials");
        } else {
            // if login success, navigate to main 
            router.replace("/(lab01)/home");
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={require("@/app/screens/assets/react-logo.png")}
                style={styles.logo}
            />

            <Text style={styles.title}>Welcome - 23521500</Text>

            {/* Email input */}
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* Password input */}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Login button */}
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.loginText}>LOG IN</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>Or login with</Text>

            {/* Social Login */}
            <View style={styles.socialRow}>
                <Image
                    source={require("@/app/screens/assets/facebook-logo.png")}
                    style={styles.socialIcon}
                />
                <Image
                    source={require("@/app/screens/assets/google-logo.png")}
                    style={styles.socialIcon}
                />
            </View>

            <Text style={styles.bottomText}>
                Don&apos;t have an account?{" "}
                <Link href="/(lab01)/(auth)/register" style={styles.linkText}>
                    Sign up here!
                </Link>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FB",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 24,
        paddingTop: 100,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: "#FFF",
        width: "100%",
        padding: 10
    },
    inputIcon: {
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        fontSize: 22,
        color: "#333",
    },
    forgotBtn: {
        alignSelf: "flex-end",
    },
    forgotText: {
        color: "#B84CE0",
        fontSize: 15,
        marginBottom: 12,
        paddingRight: 5,
    },
    loginBtn: {
        backgroundColor: "#D57C2C",
        borderRadius: 10,
        paddingVertical: 20,
        width: "100%",
        alignItems: "center",
        marginTop: 5,
    },
    loginText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    orText: {
        color: "#666",
        marginVertical: 20,
    },
    socialRow: {
        flexDirection: "row",
        gap: 24,
    },
    socialIcon: {
        width: 45,
        height: 45,
    },
    bottomText: {
        marginTop: 25,
        fontSize: 14,
        color: "#444",
    },
    linkText: {
        color: "#2563EB",
        fontWeight: "bold",
    },
});