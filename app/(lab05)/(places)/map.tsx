import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker, MapPressEvent, PROVIDER_GOOGLE } from "react-native-maps";
import BottomTabs from "@/components/lab05/BottomTabs";
import { Ionicons } from "@expo/vector-icons";
import { reverseGeocode } from "@/utils/location";

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
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    let isActive = true;
    const loadAddress = async () => {
      if (!selected) {
        if (isActive) setSelectedAddress("");
        return;
      }
      const address = await reverseGeocode(selected.lat, selected.lng);
      if (isActive) {
        const fallback = `${selected.lat.toFixed(5)}, ${selected.lng.toFixed(5)}`;
        setSelectedAddress(address || fallback);
      }
    };
    void loadAddress();
    return () => {
      isActive = false;
    };
  }, [selected]);

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
              <Ionicons name="save" size={20} color="#2563EB" />
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
          <Marker
            coordinate={{ latitude: selected.lat, longitude: selected.lng }}
            title={selectedAddress || "Selected location"}
          />
        )}
      </MapView>
      <View style={styles.tabs}>
        <BottomTabs active="places" />
      </View>
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
  tabs: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerButton: {
    marginRight: 12,
  },
});
