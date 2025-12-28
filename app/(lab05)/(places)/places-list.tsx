import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getPlaces, initDb, type Place } from "@/utils/db";

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
      headerRight: () => (
        <Pressable
          onPress={() => router.push("/(lab05)/(places)/add-place")}
          style={styles.headerButton}
        >
          <Ionicons name="add" size={24} color="#1D4ED8" />
        </Pressable>
      ),
    });
  }, [navigation, router]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.placeholder}>Loading places...</Text>
      ) : places.length === 0 ? (
        <Text style={styles.placeholder}>No places yet. Add your first one.</Text>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => String(item.id)}
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
              <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerButton: {
    marginRight: 12,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
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
