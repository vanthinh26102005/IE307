import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
    isDarkMode?: boolean;
}

export default function InputField({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    isDarkMode = false,
}: InputFieldProps) {
    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: isDarkMode ? "#FFF" : "#111" }]}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: isDarkMode ? "#222" : "#f9f9f9",
                        color: isDarkMode ? "#FFF" : "#111",
                        borderColor: isDarkMode ? "#555" : "#DDD",
                    },
                ]}
                placeholder={placeholder}
                placeholderTextColor={isDarkMode ? "#999" : "#666"}
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginVertical: 8 },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingBottom: 40,
        fontSize: 15,
        paddingTop: 15,
    },
});