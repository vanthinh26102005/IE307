import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { getPlaceById, type Place } from "@/utils/db";
import BottomTabs from "@/components/lab05/BottomTabs";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image as ExpoImage } from "expo-image";

export default function PlaceDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ id?: string }>();
  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    const loadPlace = async () => {
      const id = params.id ? Number(params.id) : null;
      if (!id || Number.isNaN(id)) {
        return;
      }
      const data = await getPlaceById(id);
      if (data) {
        setPlace(data);
      }
    };
    void loadPlace();
  }, [params.id]);

  useLayoutEffect(() => {
    if (place?.title) {
      navigation.setOptions({ title: place.title });
    }
  }, [navigation, place?.title]);

  if (!place) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>Loading place...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <ExpoImage source={{ uri: place.imageUri }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{place.title}</Text>
          <Text style={styles.address}>{place.address}</Text>
        </View>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: place.lat,
            longitude: place.lng,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker coordinate={{ latitude: place.lat, longitude: place.lng }} />
        </MapView>
        <Pressable
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/(lab05)/(places)/map",
              params: {
                lat: String(place.lat),
                lng: String(place.lng),
                mode: "view",
              },
            })
          }
        >
          <Ionicons name="map" size={16} color="#2563EB" />
          <Text style={styles.buttonText}>View on Map</Text>
        </Pressable>
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
  body: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 220,
  },
  content: {
    padding: 16,
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  address: {
    fontSize: 14,
    color: "#475569",
  },
  map: {
    marginHorizontal: 16,
    height: 180,
    borderRadius: 6,
    overflow: "hidden",
  },
  button: {
    marginTop: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  buttonText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  placeholder: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
  },
});
