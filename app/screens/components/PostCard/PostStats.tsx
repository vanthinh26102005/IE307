import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PostStatsProps {
  likes: number;
  comments: number;
  shares: number;
}

export default function PostStats({ likes, comments, shares }: PostStatsProps) {
  return (
    <View style={styles.stats}>
      <Text>{likes} Likes</Text>
      <Text>{comments} Comments</Text>
      <Text>{shares} Shares</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
});