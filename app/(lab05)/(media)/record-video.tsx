import { Camera, CameraType } from "expo-camera";
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

export default function RecordVideoScreen() {
  const router = useRouter();
  const cameraRef = useRef<Camera | null>(null);
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
            <Pressable style={styles.outlineButton} onPress={handleReset}>
              <Text style={styles.outlineButtonText}>Re-record</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera
            ref={(ref) => {
              cameraRef.current = ref;
            }}
            style={styles.camera}
            type={CameraType.back}
          />
          <View style={styles.row}>
            {isRecording ? (
              <Pressable style={styles.stopButton} onPress={handleStopRecording}>
                <Text style={styles.stopButtonText}>Stop</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.recordButton} onPress={handleStartRecording}>
                <Text style={styles.recordButtonText}>Start Recording</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 16,
    justifyContent: "center",
  },
  cameraContainer: {
    gap: 16,
  },
  camera: {
    width: "100%",
    height: 360,
    borderRadius: 16,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  recordButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  recordButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  stopButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  stopButtonText: {
    color: "#0F172A",
    fontWeight: "700",
  },
  previewContainer: {
    gap: 16,
  },
  preview: {
    width: "100%",
    height: 360,
    backgroundColor: "#000000",
    borderRadius: 16,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  outlineButtonText: {
    color: "#E2E8F0",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#16A34A",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  placeholder: {
    textAlign: "center",
    color: "#E2E8F0",
  },
});
