import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSettings } from "../context/SettingsContext";

export default function EditNoteScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const { colors, fontSize } = useSettings();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.heading, { color: colors.text, fontSize: fontSize + 2 }]}>
                Chỉnh sửa ghi chú
            </Text>
            <Text style={[styles.caption, { color: colors.text, fontSize }]}>
                ID ghi chú: {id ?? "chưa cung cấp"}.
            </Text>
            <Text style={[styles.caption, { color: colors.text, fontSize }]}>
                Nội dung form chỉnh sửa sẽ được bổ sung sau khi kết nối SQLite.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 8,
       
    },
    heading: {
        fontWeight: "700",
    },
    caption: {
        lineHeight: 22,
    },
});
