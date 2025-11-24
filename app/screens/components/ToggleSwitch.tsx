import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";

interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isDarkMode?: boolean;
}

export default function ToggleSwitch({ label, value, onValueChange, isDarkMode }: ToggleSwitchProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: isDarkMode ? "#FFF" : "#111" }]}>{label}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#2cf22fff" }}
        thumbColor={value ? "#ffffffff" : "#f4f3f4"}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});