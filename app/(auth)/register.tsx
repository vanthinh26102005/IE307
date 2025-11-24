import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <View style={styles.container}>
            <Image
                source={require("@/app/screens/assets/react-logo.png")}
                style={styles.logo}
            />

            <Text style={styles.title}>Create New Account</Text>

            <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    placeholder="Enter username"
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    placeholder="Enter email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    placeholder="Enter password"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    placeholder="Confirm password"
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.createBtn}>
                <Text style={styles.createText}>CREATE</Text>
            </TouchableOpacity>

            <Text style={styles.bottomText}>
                Already have an account?{" "}
                <Link href="/(auth)/login" style={styles.linkText}>
                    Login now!
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
        paddingTop: 30,
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
    createBtn: {
        backgroundColor: "#D57C2C",
        borderRadius: 10,
        paddingVertical: 22,
        width: "100%",
        alignItems: "center",
        marginTop: 5,
    },
    createText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 20,
    },
    bottomText: {
        marginTop: 25,
        fontSize: 18,
        color: "#444",
    },
    linkText: {
        color: "#2563EB",
        fontWeight: "bold",
    },
});