import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NotificationsScreen from "./index";
import NotificationDetailsScreen from "./details";

const Stack = createNativeStackNavigator();

export default function NotificationsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{ title: "Notifications" }}
      />
      <Stack.Screen
        name="NotificationDetails"
        component={NotificationDetailsScreen}
        options={{ title: "Notification Details" }}
      />
    </Stack.Navigator>
  );
}