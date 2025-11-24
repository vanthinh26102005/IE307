import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>❓ Help & Support</Text>
      <Text style={styles.subText}>
        This is a static screen for help content.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
  subText: { fontSize: 16, color: "#666" },
});