import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { fetchUser, updateUser, User } from "@/services/api";

const PROFILE_CACHE_PREFIX = "lab04_profile_override_";

export default function EditProfileScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const { userId } = useAuth();
    const targetId = Number(id || userId);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        phone: "",
        number: "",
        street: "",
        city: "",
    });

    const loadUser = async () => {
        if (!targetId) {
            setLoading(false);
            Alert.alert("Error", "Missing user information.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetchUser(targetId);
            let user: User = response.data;
            const cached = await AsyncStorage.getItem(`${PROFILE_CACHE_PREFIX}${targetId}`);
            if (cached) {
                const override = JSON.parse(cached);
                user = {
                    ...user,
                    ...override,
                    name: override.name ?? user.name,
                    address: override.address ?? user.address,
                };
            }
            setForm({
                firstname: user.name.firstname,
                lastname: user.name.lastname,
                username: user.username,
                email: user.email,
                phone: user.phone,
                number: String(user.address.number),
                street: user.address.street,
                city: user.address.city,
            });
        } catch (error) {
            Alert.alert("Error", "Unable to load profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetId]);

    useFocusEffect(
        useCallback(() => {
            loadUser();
        }, [targetId])
    );

    const updateField = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = useCallback(async () => {
        if (!form.firstname || !form.lastname || !form.username || !form.email) {
            Alert.alert("Validation", "Please fill in all required fields.");
            return;
        }
        if (!targetId) {
            Alert.alert("Error", "Missing user id.");
            return;
        }
        setSaving(true);
        try {
            await updateUser(targetId, {
                email: form.email,
                username: form.username,
                name: { firstname: form.firstname, lastname: form.lastname },
                address: {
                    city: form.city,
                    street: form.street,
                    number: Number(form.number) || 0,
                    zipcode: "00000",
                },
                phone: form.phone,
            });
            Alert.alert("Success", "Profile updated successfully.", [
                { text: "OK", onPress: () => router.back() },
            ]);
            try {
                await AsyncStorage.setItem(
                    `${PROFILE_CACHE_PREFIX}${targetId}`,
                    JSON.stringify({
                        name: { firstname: form.firstname, lastname: form.lastname },
                        username: form.username,
                        email: form.email,
                        phone: form.phone,
                        address: {
                            city: form.city,
                            street: form.street,
                            number: Number(form.number) || 0,
                            zipcode: "00000",
                        },
                    })
                );
            } catch {
                // ignore cache error
            }
        } catch (error) {
            Alert.alert("Error", "Unable to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    }, [form, targetId, router]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Edit Profile",
            headerRight: () =>
                saving ? (
                    <ActivityIndicator color="#2563EB" />
                ) : (
                    <TouchableOpacity onPress={handleSave} hitSlop={10}>
                        <Text style={{ color: "#2563EB", fontWeight: "800", fontSize: 16 }}>✓</Text>
                    </TouchableOpacity>
                ),
        });
    }, [navigation, handleSave, saving]);

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
            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        value={form.firstname}
                        onChangeText={(v) => updateField("firstname", v)}
                        placeholder="First name"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        value={form.lastname}
                        onChangeText={(v) => updateField("lastname", v)}
                        placeholder="Last name"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={form.username}
                    onChangeText={(v) => updateField("username", v)}
                    placeholder="Username"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={form.email}
                    onChangeText={(v) => updateField("email", v)}
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                    style={styles.input}
                    value={form.phone}
                    onChangeText={(v) => updateField("phone", v)}
                    placeholder="Phone number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>House Number</Text>
                    <TextInput
                        style={styles.input}
                        value={form.number}
                        onChangeText={(v) => updateField("number", v)}
                        placeholder="Number"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                    />
                </View>
                <View style={[styles.inputGroup, { flex: 2 }]}>
                    <Text style={styles.label}>Street</Text>
                    <TextInput
                        style={styles.input}
                        value={form.street}
                        onChangeText={(v) => updateField("street", v)}
                        placeholder="Street"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>City</Text>
                <TextInput
                    style={styles.input}
                    value={form.city}
                    onChangeText={(v) => updateField("city", v)}
                    placeholder="City"
                    placeholderTextColor="#9CA3AF"
                />
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        gap: 12,
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    inputGroup: {
        gap: 6,
        flex: 1,
    },
    label: {
        color: "#6B7280",
        fontWeight: "600",
        fontSize: 13,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: "#111827",
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
});
