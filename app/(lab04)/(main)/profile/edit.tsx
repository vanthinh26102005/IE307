import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function EditProfileScreen() {
    const router = useRouter();
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
            const user: User = response.data;
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

    const updateField = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
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
        } catch (error) {
            Alert.alert("Error", "Unable to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

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
            <Text style={styles.title}>Edit Profile</Text>
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

            <TouchableOpacity
                style={[styles.button, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                activeOpacity={0.9}
                disabled={saving}
            >
                {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>SAVE</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        gap: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        color: "#111827",
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
    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "800",
        fontSize: 16,
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
