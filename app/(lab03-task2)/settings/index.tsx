import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Switch, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";

export default function SettingsScreen() {
    const { darkMode, toggleDarkMode, fontSize, setFontSize, colors } = useSettings();

    return (
        <SafeAreaView
            edges={["left", "right", "bottom"]}
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    paddingTop: 16,
                },
            ]}
        >
            <Text style={[styles.label, { color: colors.text, fontSize: fontSize + 4 }]}>Chế độ tối</Text>
            <Switch value={darkMode} onValueChange={toggleDarkMode} />

            <Text style={[styles.label, { color: colors.text, fontSize: fontSize + 4 }]}>Kích thước chữ</Text>
            <Slider
                minimumValue={12}
                maximumValue={36}
                step={2}
                value={fontSize}
                onValueChange={setFontSize}
                minimumTrackTintColor="#2563EB"
            />
            <Text style={[styles.value, { color: colors.text }]}>Hiện tại: {fontSize}</Text>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        gap: 12,
    },
    label: {
        fontWeight: "700",
    },
    value: {
        fontWeight: "600",
    },
    hint: {
        lineHeight: 22,
    },
});
