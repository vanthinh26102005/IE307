import * as Location from "expo-location";

export type Coordinates = {
  lat: number;
  lng: number;
};

export async function getCurrentLocation() {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
  });
  return {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };
}

export async function reverseGeocode(lat: number, lng: number) {
  const results = await Location.reverseGeocodeAsync({
    latitude: lat,
    longitude: lng,
  });
  const item = results[0];
  if (!item) {
    return "";
  }
  const parts = [
    item.name,
    item.street,
    item.city,
    item.region,
    item.postalCode,
    item.country,
  ].filter(Boolean);
  return parts.join(", ");
}
