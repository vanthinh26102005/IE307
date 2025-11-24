import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface FAQItemProps {
  question: string;
  isDarkMode?: boolean;
}

export default function FAQItem({ question, isDarkMode = false }: FAQItemProps) {
  return (
    <View style={styles.item}>
      <Text style={[styles.text, { color: isDarkMode ? "#FFF" : "#111" }]}>Q: {question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 4,
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
  },
});