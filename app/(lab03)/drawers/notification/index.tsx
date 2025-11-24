import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function NotificationsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Notifications Screen</Text>
      <Button
        title="Go to Notification Details"
        onPress={() => navigation.navigate("NotificationDetails")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});