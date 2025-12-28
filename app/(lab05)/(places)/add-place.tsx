import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { insertPlace } from "@/utils/db";
import {
  requestCameraPermission,
  requestLocationPermission,
  requestMediaLibraryPermission,
} from "@/utils/permissions";
import { scheduleNotificationAsync } from "@/utils/notifications";
import { getCurrentLocation, reverseGeocode } from "@/utils/location";

export default function AddPlaceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lat?: string; lng?: string }>();
  const cameraRef = useRef<Camera | null>(null);

  const [title, setTitle] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [pickedLocation, setPickedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    const lat = params.lat ? Number(params.lat) : null;
    const lng = params.lng ? Number(params.lng) : null;
    if (lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      void updatePickedLocation(lat, lng);
    }
  }, [params.lat, params.lng]);

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
      setImageUri(result.assets[0]?.uri ?? null);
    }
  };

  const handleOpenCamera = async () => {
    const granted = await requestCameraPermission();
    if (!granted) {
      Alert.alert("Permission required", "Camera access is needed.");
      return;
    }
    setShowCamera(true);
  };

  const handleCapture = async () => {
    if (!cameraRef.current) {
      return;
    }
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    if (photo?.uri) {
      setImageUri(photo.uri);
    }
    setShowCamera(false);
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
      params: { mode: "pick" },
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

    await scheduleNotificationAsync("Place saved!", "Your place was added.");
    Alert.alert("Saved", "Place added successfully.");
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Place name</Text>
      <TextInput
        placeholder="Enter place name"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Text style={styles.label}>Photo</Text>
      <View style={styles.previewBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.previewText}>No photo selected</Text>
        )}
      </View>
      <View style={styles.row}>
        <Pressable style={styles.outlineButton} onPress={handlePickImage}>
          <Text style={styles.outlineButtonText}>Choose Photo</Text>
        </Pressable>
        <Pressable style={styles.outlineButton} onPress={handleOpenCamera}>
          <Text style={styles.outlineButtonText}>Take Photo</Text>
        </Pressable>
      </View>

      {showCamera && (
        <View style={styles.cameraContainer}>
          <Camera
            ref={(ref) => {
              cameraRef.current = ref;
            }}
            style={styles.camera}
            type={CameraType.back}
          />
          <View style={styles.cameraActions}>
            <Pressable style={styles.outlineButton} onPress={handleCapture}>
              <Text style={styles.outlineButtonText}>Capture</Text>
            </Pressable>
            <Pressable
              style={styles.outlineButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.outlineButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Text style={styles.label}>Location</Text>
      <View style={styles.previewBox}>
        {pickedLocation ? (
          <Text style={styles.previewText}>{pickedLocation.address}</Text>
        ) : (
          <Text style={styles.previewText}>No location selected</Text>
        )}
      </View>
      <View style={styles.row}>
        <Pressable style={styles.outlineButton} onPress={handleGetLocation}>
          <Text style={styles.outlineButtonText}>Use Current</Text>
        </Pressable>
        <Pressable style={styles.outlineButton} onPress={handlePickOnMap}>
          <Text style={styles.outlineButtonText}>Pick on Map</Text>
        </Pressable>
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Place</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: "#F8FAFC",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  previewBox: {
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 8,
  },
  previewImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
  },
  previewText: {
    color: "#64748B",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1D4ED8",
    paddingVertical: 10,
    alignItems: "center",
  },
  outlineButtonText: {
    color: "#1D4ED8",
    fontWeight: "600",
  },
  cameraContainer: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    overflow: "hidden",
  },
  camera: {
    width: "100%",
    height: 240,
  },
  cameraActions: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    backgroundColor: "#0F172A",
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
