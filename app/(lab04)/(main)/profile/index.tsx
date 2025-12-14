import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useAuth } from "@/context/AuthContext";
import { fetchUser, User } from "@/services/api";

const AVATAR =
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60";
const PROFILE_CACHE_PREFIX = "lab04_profile_override_";

export default function ProfileScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { userId, signOut } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await fetchUser(userId);
            let profile = response.data;
            const cacheKey = `${PROFILE_CACHE_PREFIX}${userId}`;
            const cached = await AsyncStorage.getItem(cacheKey);
            if (cached) {
                const override = JSON.parse(cached);
                profile = { ...profile, ...override };
            }
            setUser(profile);
        } catch (error) {
            Alert.alert("Error", "Unable to load user info.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, [userId]);

    useFocusEffect(
        React.useCallback(() => {
            loadUser();
        }, [userId])
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Profile",
            headerTitleStyle: { color: "#111827", fontWeight: "800" },
            headerTitleAlign: "left",
        });
    }, [navigation]);

    const handleLogout = async () => {
        await signOut();
        router.replace("/(lab04)/(auth)/login");
    };

    if (!userId) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Please log in to view your profile.</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/(lab04)/(auth)/login")}>
                    <Text style={styles.primaryButtonText}>Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: "#F9FAFB" }}>
            <View style={styles.profileCard}>
                <View style={styles.headerRow}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: AVATAR }} style={styles.avatar} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.name}>
                            {user?.name.firstname} {user?.name.lastname}
                        </Text>
                        <Text style={styles.usernameLabel}>@{user?.username}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push({ pathname: "/(lab04)/(main)/profile/edit", params: { id: userId?.toString() } })}
                    >
                        <Ionicons name="create-outline" size={20} color="#2563EB" />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>Name</Text>
                    <Text style={styles.infoValue}>
                        {user?.name.firstname} {user?.name.lastname}
                    </Text>
                </View>
                <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>Username</Text>
                    <Text style={styles.infoValue}>{user?.username}</Text>
                </View>
                <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{user?.email}</Text>
                </View>
                <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>Phone</Text>
                    <Text style={styles.infoValue}>{user?.phone}</Text>
                </View>
                <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>Address</Text>
                    <Text style={styles.infoValue}>
                        {user?.address.number} {user?.address.street}, {user?.address.city}
                    </Text>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.9}>
                    <Text style={styles.logoutText}>LOG OUT</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#F9FAFB",
    },
    profileCard: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 16,
        gap: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    avatarWrapper: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#2563EB",
    },
    avatar: {
        width: "100%",
        height: "100%",
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    usernameLabel: {
        color: "#6B7280",
        fontWeight: "600",
    },
    editButton: {
        padding: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    infoGroup: {
        gap: 4,
    },
    infoLabel: {
        fontWeight: "700",
        color: "#111827",
    },
    infoValue: {
        color: "#111827",
        fontSize: 15,
    },
    logoutButton: {
        marginTop: 8,
        backgroundColor: "#DC2626",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    logoutText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        gap: 10,
    },
    loadingText: {
        color: "#4B5563",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        gap: 12,
        paddingHorizontal: 24,
    },
    emptyText: {
        color: "#4B5563",
        textAlign: "center",
        fontSize: 16,
    },
    primaryButton: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
});
