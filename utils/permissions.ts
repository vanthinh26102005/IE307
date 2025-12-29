import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";

async function ensurePermission(
  request: () => Promise<{ status: string }>
): Promise<boolean> {
  const { status } = await request();
  return status === "granted";
}

export async function requestCameraPermission() {
  return ensurePermission(() => Camera.requestCameraPermissionsAsync());
}

export async function requestMicrophonePermission() {
  return ensurePermission(() => Camera.requestMicrophonePermissionsAsync());
}

export async function requestMediaLibraryPermission() {
  return ensurePermission(() => MediaLibrary.requestPermissionsAsync());
}

export async function requestLocationPermission() {
  return ensurePermission(() => Location.requestForegroundPermissionsAsync());
}
