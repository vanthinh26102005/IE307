import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./index";
import HomeDetailsScreen from "./details";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="HomeDetails"
        component={HomeDetailsScreen}
        options={{ title: "Home Details" }}
      />
    </Stack.Navigator>
  );
}