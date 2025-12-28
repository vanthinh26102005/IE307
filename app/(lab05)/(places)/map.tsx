import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, MapPressEvent, PROVIDER_GOOGLE } from "react-native-maps";

const DEFAULT_REGION = {
  latitude: 10.776889,
  longitude: 106.700806,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ lat?: string; lng?: string; mode?: string }>();
  const isPicking = params.mode === "pick";

  const initialCoords = useMemo(() => {
    const lat = params.lat ? Number(params.lat) : null;
    const lng = params.lng ? Number(params.lng) : null;
    if (lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      return { lat, lng };
    }
    return null;
  }, [params.lat, params.lng]);

  const [selected, setSelected] = useState(initialCoords);

  const handleSelect = (event: MapPressEvent) => {
    if (!isPicking) {
      return;
    }
    setSelected({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  };

  const handleSave = useCallback(() => {
    if (!selected) {
      Alert.alert("Pick a location", "Tap on the map to select a location.");
      return;
    }
    router.navigate({
      pathname: "/(lab05)/(places)/add-place",
      params: { lat: String(selected.lat), lng: String(selected.lng) },
    });
  }, [router, selected]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isPicking ? "Pick Location" : "Map",
      headerRight: isPicking
        ? () => (
            <Pressable style={styles.headerButton} onPress={handleSave}>
              <Text style={styles.headerButtonText}>Save</Text>
            </Pressable>
          )
        : undefined,
    });
  }, [handleSave, isPicking, navigation]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={
          initialCoords
            ? {
                latitude: initialCoords.lat,
                longitude: initialCoords.lng,
                latitudeDelta: 0.012,
                longitudeDelta: 0.012,
              }
            : DEFAULT_REGION
        }
        onPress={handleSelect}
      >
        {selected && (
          <Marker coordinate={{ latitude: selected.lat, longitude: selected.lng }} />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  headerButton: {
    marginRight: 12,
  },
  headerButtonText: {
    color: "#1D4ED8",
    fontWeight: "600",
  },
});
