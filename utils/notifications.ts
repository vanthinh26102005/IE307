import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function scheduleNotificationAsync(title: string, body: string) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    return null;
  }
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}
