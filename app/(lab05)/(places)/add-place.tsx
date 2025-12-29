import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Image as ExpoImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { insertPlace } from "@/utils/db";
import * as FileSystem from "expo-file-system";
import {
  requestCameraPermission,
  requestLocationPermission,
  requestMediaLibraryPermission,
} from "@/utils/permissions";
import { scheduleNotificationAsync } from "@/utils/notifications";
import { getCurrentLocation, reverseGeocode } from "@/utils/location";
import BottomTabs from "@/components/lab05/BottomTabs";

export default function AddPlaceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lat?: string;
    lng?: string;
    imageUri?: string;
    title?: string;
  }>();

  const [title, setTitle] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [pickedLocation, setPickedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const persistImageUri = async (uri: string) => {
    const baseDir = FileSystem.documentDirectory;
    if (!baseDir || !uri.startsWith("file://")) {
      return uri;
    }
    const imagesDir = `${baseDir}places`;
    const dirInfo = await FileSystem.getInfoAsync(imagesDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
    }
    if (uri.startsWith(imagesDir)) {
      return uri;
    }
    const extension = uri.split(".").pop() || "jpg";
    const fileName = `place-${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
    const dest = `${imagesDir}/${fileName}`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  };

  useEffect(() => {
    const lat = params.lat ? Number(params.lat) : null;
    const lng = params.lng ? Number(params.lng) : null;
    if (lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      void updatePickedLocation(lat, lng);
    }
  }, [params.lat, params.lng]);

  useEffect(() => {
    if (typeof params.imageUri === "string" && params.imageUri) {
      setImageUri(params.imageUri);
    }
    if (typeof params.title === "string" && params.title) {
      setTitle(params.title);
    }
  }, [params.imageUri, params.title]);

  const updatePickedLocation = async (lat: number, lng: number) => {
    const address = await reverseGeocode(lat, lng);
    const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    setPickedLocation({ lat, lng, address: address || fallback });
  };

  const handlePickImage = async () => {
    const granted = await requestMediaLibraryPermission();
    if (!granted) {
      Alert.alert("Permission required", "Media library access is needed.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled) {
      const pickedUri = result.assets[0]?.uri;
      if (pickedUri) {
        const storedUri = await persistImageUri(pickedUri);
        setImageUri(storedUri);
      }
    }
  };

  const handleTakePhoto = async () => {
    const granted = await requestCameraPermission();
    if (!granted) {
      Alert.alert("Permission required", "Camera access is needed.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled) {
      const pickedUri = result.assets[0]?.uri;
      if (pickedUri) {
        const storedUri = await persistImageUri(pickedUri);
        setImageUri(storedUri);
      }
    }
  };

  const handleGetLocation = async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      Alert.alert("Permission required", "Location access is needed.");
      return;
    }
    const coords = await getCurrentLocation();
    await updatePickedLocation(coords.lat, coords.lng);
  };

  const handlePickOnMap = () => {
    router.push({
      pathname: "/(lab05)/(places)/map",
      params: {
        mode: "pick",
        imageUri: imageUri ?? undefined,
        title: title.trim() ? title : undefined,
      },
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Missing info", "Please enter a place name.");
      return;
    }
    if (!imageUri) {
      Alert.alert("Missing info", "Please add a photo.");
      return;
    }
    if (!pickedLocation) {
      Alert.alert("Missing info", "Please select a location.");
      return;
    }

    await insertPlace({
      title: title.trim(),
      imageUri,
      lat: pickedLocation.lat,
      lng: pickedLocation.lng,
      address: pickedLocation.address,
    });

    await scheduleNotificationAsync(
      "Places added successfully",
      "The place has been added to your favourites list!"
    );
    Alert.alert("Saved", "Place added successfully.");
    router.replace("/(lab05)/(places)/places-list");
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          placeholder="Enter place name"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <View style={styles.previewBox}>
          {imageUri ? (
            <ExpoImage
              source={{ uri: imageUri }}
              style={styles.previewImage}
              contentFit="cover"
            />
          ) : (
            <Text style={styles.previewText}>No image taken yet.</Text>
          )}
        </View>
        <View style={styles.row}>
          <Pressable style={styles.outlineButton} onPress={handlePickImage}>
            <View style={styles.buttonContent}>
              <Ionicons name="image" size={16} color="#2563EB" />
              <Text style={styles.outlineButtonText}>Pick Image</Text>
            </View>
          </Pressable>
          <Pressable style={styles.outlineButton} onPress={handleTakePhoto}>
            <View style={styles.buttonContent}>
              <Ionicons name="camera" size={16} color="#2563EB" />
              <Text style={styles.outlineButtonText}>Take Image</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.previewBox}>
          {pickedLocation ? (
            <MapView
              style={styles.mapPreview}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: pickedLocation.lat,
                longitude: pickedLocation.lng,
                latitudeDelta: 0.012,
                longitudeDelta: 0.012,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: pickedLocation.lat,
                  longitude: pickedLocation.lng,
                }}
              />
            </MapView>
          ) : (
            <Text style={styles.previewText}>No location picked yet.</Text>
          )}
        </View>
        <View style={styles.row}>
          <Pressable style={styles.outlineButton} onPress={handleGetLocation}>
            <View style={styles.buttonContent}>
              <Ionicons name="locate" size={16} color="#2563EB" />
              <Text style={styles.outlineButtonText}>Locate User</Text>
            </View>
          </Pressable>
          <Pressable style={styles.outlineButton} onPress={handlePickOnMap}>
            <View style={styles.buttonContent}>
              <Ionicons name="map" size={16} color="#2563EB" />
              <Text style={styles.outlineButtonText}>Pick on Map</Text>
            </View>
          </Pressable>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Add Place</Text>
        </Pressable>
      </ScrollView>
      <BottomTabs active="places" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: "#FFFFFF",
    paddingBottom: 24,
  },
  scroll: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  previewBox: {
    minHeight: 120,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 8,
  },
  previewImage: {
    width: "100%",
    height: 160,
  },
  mapPreview: {
    width: "100%",
    height: 160,
  },
  previewText: {
    color: "#6B7280",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#2563EB",
    paddingVertical: 8,
    alignItems: "center",
  },
  outlineButtonText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
