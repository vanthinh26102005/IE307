import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { requestMediaLibraryPermission } from "@/utils/permissions";
import BottomTabs from "@/components/lab05/BottomTabs";
import { Image as ExpoImage } from "expo-image";

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
      title: "My Gallery",
      headerRight: () => (
        <Pressable
          onPress={() => router.push("/(lab05)/(media)/record-video")}
          style={styles.headerButton}
        >
          <Ionicons name="videocam" size={22} color="#DC2626" />
        </Pressable>
      ),
    });
  }, [navigation, router]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {error ? (
          <Text style={styles.placeholder}>{error}</Text>
        ) : (
          <FlatList
            data={assets}
            keyExtractor={(item) => item.id}
            numColumns={2}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.column}
            renderItem={({ item }) => (
              <View style={styles.assetCard}>
                <ExpoImage
                  source={{ uri: item.uri }}
                  style={styles.assetImage}
                  contentFit="cover"
                  transition={150}
                />
                {item.mediaType === MediaLibrary.MediaType.video && (
                  <View style={styles.videoOverlay}>
                    <Ionicons name="play-circle" size={32} color="#FFFFFF" />
                  </View>
                )}
              </View>
            )}
          />
        )}
      </View>
      <BottomTabs active="media" />
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
  },
  listContent: {
    padding: 12,
    gap: 12,
    paddingBottom: 24,
  },
  column: {
    gap: 12,
  },
  assetCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  assetImage: {
    width: "100%",
    height: 160,
  },
  list: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  placeholder: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
  },
});
