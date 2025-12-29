import { CameraView } from "expo-camera";
import { ResizeMode, Video } from "expo-av";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import {
  requestCameraPermission,
  requestMediaLibraryPermission,
  requestMicrophonePermission,
} from "@/utils/permissions";
import { scheduleNotificationAsync } from "@/utils/notifications";
import BottomTabs from "@/components/lab05/BottomTabs";

export default function RecordVideoScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraGranted = await requestCameraPermission();
      const micGranted = await requestMicrophonePermission();
      setHasPermission(cameraGranted && micGranted);
    };
    void requestPermissions();
  }, []);

  const handleStartRecording = async () => {
    if (!cameraRef.current || isRecording) {
      return;
    }
    setVideoUri(null);
    setIsRecording(true);
    try {
      const recording = await cameraRef.current.recordAsync();
      if (recording?.uri) {
        setVideoUri(recording.uri);
      }
    } catch (error) {
      Alert.alert("Recording error", "Unable to record video.");
    } finally {
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    cameraRef.current?.stopRecording();
  };

  const handleSave = async () => {
    if (!videoUri) {
      return;
    }
    const granted = await requestMediaLibraryPermission();
    if (!granted) {
      Alert.alert("Permission required", "Media library access is needed.");
      return;
    }
    await MediaLibrary.createAssetAsync(videoUri);
    await scheduleNotificationAsync("Video saved!", "Your recording is ready.");
    Alert.alert("Saved", "Video saved to your library.");
    router.back();
  };

  const handleReset = () => {
    setVideoUri(null);
  };

  if (hasPermission == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>Requesting permissions...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>
          Camera and microphone permissions are required.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {videoUri ? (
        <View style={styles.previewContainer}>
          <Video
            source={{ uri: videoUri }}
            style={styles.preview}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
          />
          <View style={styles.row}>
            <Pressable style={styles.reRecordButton} onPress={handleReset}>
              <Text style={styles.reRecordText}>Re-Record</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={(ref) => {
              cameraRef.current = ref;
            }}
            style={styles.camera}
            facing="back"
            mode="video"
          />
          <Pressable
            style={styles.recordButton}
            onPress={isRecording ? handleStopRecording : handleStartRecording}
          >
            <View style={isRecording ? styles.stopSquare : styles.recordInner} />
          </Pressable>
        </View>
      )}
      <View style={styles.tabs}>
        <BottomTabs active="media" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    paddingVertical: 12,
    marginBottom: 56,
  },
  recordButton: {
    position: "absolute",
    bottom: 88,
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#FEE2E2",
  },
  recordInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
  stopSquare: {
    width: 22,
    height: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
  },
  preview: {
    width: "100%",
    height: "70%",
    backgroundColor: "#000000",
  },
  reRecordButton: {
    backgroundColor: "#DC2626",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  reRecordText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#2563EB",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  placeholder: {
    textAlign: "center",
    color: "#64748B",
    padding: 24,
  },
  tabs: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
