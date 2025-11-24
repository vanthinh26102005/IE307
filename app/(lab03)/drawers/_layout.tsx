import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="home/_layout" // This will render the HomeStack from home/_layout.tsx
        options={{
          headerShown: false, // Hide header as the stack navigator will handle it
          title: "Home", // Title for the drawer item
        }}
      />
      <Drawer.Screen
        name="notification/_layout" // This will render the NotificationsStack from notification/_layout.tsx
        options={{
          headerShown: false, // Hide header as the stack navigator will handle it
          title: "Notifications", // Title for the drawer item
        }}
      />
      <Drawer.Screen
        name="help" // This will render help.tsx
        options={{
          title: "Help", // Title for the drawer item
        }}
      />
    </Drawer>
  );
}
