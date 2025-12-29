import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getPlaces, initDb, type Place } from "@/utils/db";
import BottomTabs from "@/components/lab05/BottomTabs";
import { Image as ExpoImage } from "expo-image";

export default function PlacesListScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPlaces = useCallback(async () => {
    setIsLoading(true);
    await initDb();
    const data = await getPlaces();
    setPlaces(data);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPlaces();
    }, [loadPlaces])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Places",
      headerRight: () => (
        <Pressable
          onPress={() => router.push("/(lab05)/(places)/add-place")}
          style={styles.headerButton}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </Pressable>
      ),
    });
  }, [navigation, router]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isLoading ? (
          <Text style={styles.placeholder}>Loading places...</Text>
        ) : places.length === 0 ? (
          <Text style={styles.placeholder}>
            No places added yet - start adding some!
          </Text>
        ) : (
          <FlatList
            data={places}
            keyExtractor={(item) => String(item.id)}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/(lab05)/(places)/place-detail",
                    params: { id: String(item.id) },
                  })
                }
              >
              <ExpoImage
                source={{ uri: item.imageUri }}
                style={styles.cardImage}
                contentFit="cover"
              />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle} numberOfLines={2}>
                    {item.address}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
      <BottomTabs active="places" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerButton: {
    marginRight: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  list: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardImage: {
    width: 96,
    height: 96,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#64748B",
  },
  placeholder: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
  },
});
