import { Link } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { requestNotificationPermission } from "@/utils/notifications";

export default function Lab05Index() {
  useEffect(() => {
    void requestNotificationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LAB05 - Native Device Features</Text>
      <Link href="/(lab05)/(places)/places-list" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Places</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/(lab05)/(media)/media-library" asChild>
        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonText}>Media</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  button: {
    width: "100%",
    backgroundColor: "#1D4ED8",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonSecondary: {
    width: "100%",
    backgroundColor: "#0F766E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
