import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  active: "places" | "media";
};

export default function BottomTabs({ active }: Props) {
  const router = useRouter();
  const isPlaces = active === "places";

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.tab}
        onPress={() => router.navigate("/(lab05)/(places)/places-list")}
      >
        <Ionicons
          name="location"
          size={20}
          color={isPlaces ? "#2563EB" : "#64748B"}
        />
        <Text style={[styles.label, isPlaces && styles.labelActive]}>Places</Text>
      </Pressable>
      <Pressable
        style={styles.tab}
        onPress={() => router.navigate("/(lab05)/(media)/media-library")}
      >
        <Ionicons
          name="images"
          size={20}
          color={!isPlaces ? "#2563EB" : "#64748B"}
        />
        <Text style={[styles.label, !isPlaces && styles.labelActive]}>Media</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  tab: {
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 12,
    color: "#64748B",
  },
  labelActive: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
