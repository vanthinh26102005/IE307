import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface PostContentProps {
  text: string;
  image: any;
}

export default function PostContent({ text, image }: PostContentProps) {
  return (
    <View>
      <Text style={styles.text}>{text}</Text>
      <Image source={image} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  text: { marginBottom: 8, color: "#111" },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
});