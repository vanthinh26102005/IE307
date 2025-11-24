import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";

interface PostActionsProps {
  liked: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export default function PostActions({ liked, onLike, onComment, onShare }: PostActionsProps) {
  return (
    <View style={styles.actions}>
      <Pressable onPress={onLike} style={styles.actionBtn}>
        <EvilIcons name="like" size={24} color={liked ? "blue" : "black"} />
        <Text style={[styles.actionText, liked && styles.liked]}>Likes</Text>
      </Pressable>

      <Pressable onPress={onComment} style={styles.actionBtn}>
        <EvilIcons name="comment" size={24} color="black" />
        <Text style={styles.actionText}>Comments</Text>
      </Pressable>

      <Pressable onPress={onShare} style={styles.actionBtn}>
        <EvilIcons name="share-apple" size={24} color="black" />
        <Text style={styles.actionText}>Shares</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2
  },
  actionText: {
    color: "#374151",
    fontWeight: "500",
    marginLeft: 4
  },
  liked: { color: "#2563EB" },
});