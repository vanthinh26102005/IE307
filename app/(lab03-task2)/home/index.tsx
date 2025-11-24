import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "../context/SettingsContext";
import { deleteNote, getAllNotes, NoteRow } from "../lib/db";

export default function NotesHomeScreen() {
    const { colors, fontSize } = useSettings();
    const [notes, setNotes] = useState<NoteRow[]>([]);
    const [loading, setLoading] = useState(false);

    const loadNotes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllNotes();
            setNotes(data);
        } catch (err) {
            console.error("Load notes error", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadNotes();
        }, [loadNotes])
    );

    const handleDelete = async (id: number) => {
        try {
            await deleteNote(id);
            loadNotes();
        } catch (err) {
            console.error("Delete note error", err);
            Alert.alert("Lỗi", "Không thể xóa ghi chú, thử lại sau.");
        }
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
            bounces={false}
        >
            <View style={styles.headerRow}>
                <Text style={[styles.title, { color: colors.text, fontSize: fontSize + 6 }]}>
                    Note Keeper
                </Text>
                <Link href="/(lab03-task2)/home/add" asChild>
                    <TouchableOpacity style={[styles.iconBtn, { borderColor: colors.border }]}>
                        <Ionicons name="add-circle-outline" size={28} color={colors.text} />
                    </TouchableOpacity>
                </Link>
            </View>

            <View style={[styles.emptyState, { borderColor: colors.border }]}>
                {loading ? (
                    <Text style={[styles.emptyText, { color: colors.text, fontSize }]}>Đang tải...</Text>
                ) : notes.length === 0 ? (
                    <>
                        <Ionicons name="book-outline" size={32} color={colors.text} />
                        <Text style={[styles.emptyText, { color: colors.text, fontSize }]}>
                            Danh sách ghi chú sẽ hiển thị ở đây.
                        </Text>
                        <Text style={[styles.emptyHint, { color: colors.text, fontSize: fontSize - 2 }]}>
                            Bắt đầu với nút thêm mới để tạo ghi chú đầu tiên.
                        </Text>
                    </>
                ) : (
                    <View style={styles.listContainer}>
                        {notes.map((note) => (
                            <View
                                key={note.id}
                                style={[
                                    styles.noteCard,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                        marginTop: 16,
                                    },
                                ]}
                            >
                                <Link
                                    href={{ pathname: "/(lab03-task2)/home/edit", params: { id: String(note.id) } }}
                                    asChild
                                >
                                    <TouchableOpacity style={styles.noteContent}>
                                        <Text
                                            style={[
                                                styles.noteTitle,
                                                { color: colors.text, fontSize: fontSize + 2 },
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {note.title}
                                        </Text>
                                        {!!note.content && (
                                            <Text
                                                style={[styles.noteBody, { color: colors.text, fontSize }]}
                                                numberOfLines={3}
                                            >
                                                {note.content}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </Link>
                                <TouchableOpacity
                                    onPress={() => handleDelete(note.id)}
                                    style={styles.deleteBtn}
                                    hitSlop={12}
                                >
                                    <Ionicons name="trash-outline" size={20} color={colors.text} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        gap: 20,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontWeight: "700",
    },
    iconBtn: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 8,
    },
    emptyState: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        gap: 6,
    },
    listContainer: {
        width: "100%",
        gap: 12,
    },
    noteCard: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        minHeight: 90,
    },
    noteContent: {
        flex: 1,
        gap: 6,
        paddingRight: 10,
    },
    noteTitle: {
        fontWeight: "700",
    },
    noteBody: {
        lineHeight: 20,
        paddingTop: 16,
    },
    deleteBtn: {
        paddingLeft: 12,
    },
    emptyText: {
        fontWeight: "600",
    },
    emptyHint: {
        textAlign: "center",
    },
});
