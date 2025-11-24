import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

interface SubmitButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isDarkMode?: boolean;
}

export default function SubmitButton({ title, onPress, disabled = false, isDarkMode = false }: SubmitButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? "#A0AEC0" : "#2563EB",
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text style={[styles.text, { color: "#FFF" }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  text: {
    fontWeight: "700",
    fontSize: 16,
  },
});