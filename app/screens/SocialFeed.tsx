import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import PostCard from "@/app/screens/components/PostCard";
import { posts } from "@/app/screens/data/post";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SocialFeed() {
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerText}>Social Media Feed</Text>
      </SafeAreaView>

      {posts.map((item) => (
        <PostCard key={item.id} {...item} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
