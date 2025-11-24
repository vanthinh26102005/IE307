import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { getAllNotes, updateNote } from "../lib/db";
import { useSettings } from "../context/SettingsContext";

export default function EditNoteScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const { colors, fontSize } = useSettings();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [saving, setSaving] = useState(false);

    const loadNote = useCallback(async () => {
        if (!id) return;
        try {
            const notes = await getAllNotes();
            const note = notes.find((n) => String(n.id) === String(id));
            if (note) {
                setTitle(note.title);
                setContent(note.content ?? "");
            } else {
                Alert.alert("Không tìm thấy", "Ghi chú không tồn tại, quay lại danh sách.");
                router.back();
            }
        } catch (err) {
            console.error("Load note error", err);
            Alert.alert("Lỗi", "Không thể tải ghi chú.");
        }
    }, [id, router]);

    useEffect(() => {
        loadNote();
    }, [loadNote]);

    const handleSave = async () => {
        if (!id) return;
        const trimmed = title.trim();
        if (!trimmed) {
            Alert.alert("Thiếu tiêu đề", "Vui lòng nhập tiêu đề trước khi lưu.");
            return;
        }
        try {
            setSaving(true);
            await updateNote(Number(id), trimmed, content);
            router.back();
        } catch (err) {
            console.error("Update note error", err);
            Alert.alert("Lỗi", "Không thể cập nhật ghi chú, thử lại sau.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => router.back();

    return (
        <KeyboardAvoidingView
            style={[styles.flex, { backgroundColor: colors.background }]}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.heading, { color: colors.text, fontSize: fontSize + 2 }]}>
                    Chỉnh sửa ghi chú
                </Text>

                <Text style={[styles.label, { color: colors.text, fontSize }]}>Tiêu đề *</Text>
                <TextInput
                    style={[
                        styles.input,
                        {
                            borderColor: colors.border,
                            color: colors.text,
                            fontSize: fontSize + 1,
                            backgroundColor: colors.surface,
                        },
                    ]}
                    placeholder="Nhập tiêu đề"
                    placeholderTextColor="#9ca3af"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={[styles.label, { color: colors.text, fontSize }]}>Nội dung</Text>
                <TextInput
                    style={[
                        styles.textArea,
                        {
                            borderColor: colors.border,
                            color: colors.text,
                            fontSize,
                            backgroundColor: colors.surface,
                        },
                    ]}
                    placeholder="Nhập nội dung ghi chú"
                    placeholderTextColor="#9ca3af"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                />

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        onPress={handleCancel}
                        style={[styles.actionBtn, styles.cancelBtn, { borderColor: colors.border }]}
                        disabled={saving}
                    >
                        <Ionicons name="close-circle-outline" size={22} color={colors.text} />
                        <Text style={[styles.actionText, { color: colors.text, fontSize }]}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.actionBtn, styles.saveBtn, { backgroundColor: "#2563EB" }]}
                        disabled={saving}
                    >
                        <Ionicons name="save-outline" size={22} color="#fff" />
                        <Text style={[styles.actionText, { color: "#fff", fontSize }]}>
                            {saving ? "Đang lưu..." : "Lưu"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: {
        flexGrow: 1,
        padding: 16,
        gap: 12,
    },
    heading: {
        fontWeight: "700",
    },
    label: {
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        minHeight: 180,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 8,
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
    },
    cancelBtn: {
        borderWidth: 1,
    },
    saveBtn: {},
    actionText: {
        fontWeight: "700",
    },
});
