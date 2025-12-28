import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
import * as MediaLibrary from "expo-media-library";
import { requestMediaLibraryPermission } from "@/utils/permissions";

export default function MediaLibraryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = useCallback(async () => {
    const granted = await requestMediaLibraryPermission();
    if (!granted) {
      setError("Media permission not granted.");
      return;
    }
    setError(null);
    const result = await MediaLibrary.getAssetsAsync({
      first: 15,
      sortBy: [MediaLibrary.SortBy.creationTime],
      mediaType: [
        MediaLibrary.MediaType.photo,
        MediaLibrary.MediaType.video,
      ],
    });
    setAssets(result.assets);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadAssets();
    }, [loadAssets])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => router.push("/(lab05)/(media)/record-video")}
          style={styles.headerButton}
        >
          <Ionicons name="videocam" size={22} color="#0F766E" />
        </Pressable>
      ),
    });
  }, [navigation, router]);

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.placeholder}>{error}</Text>
      ) : (
        <FlatList
          data={assets}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.column}
          renderItem={({ item }) => (
            <View style={styles.assetCard}>
              {item.mediaType === MediaLibrary.MediaType.photo ? (
                <Image source={{ uri: item.uri }} style={styles.assetImage} />
              ) : (
                <View style={styles.videoPlaceholder}>
                  <Ionicons name="play-circle" size={32} color="#FFFFFF" />
                  <Text style={styles.videoLabel}>Video</Text>
                </View>
              )}
            </View>
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
    padding: 12,
    gap: 12,
  },
  column: {
    gap: 12,
  },
  assetCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 1,
  },
  assetImage: {
    width: "100%",
    height: 160,
  },
  videoPlaceholder: {
    width: "100%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F172A",
    gap: 6,
  },
  videoLabel: {
    color: "#E2E8F0",
    fontSize: 12,
  },
  placeholder: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
  },
});
