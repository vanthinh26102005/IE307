import { Stack } from "expo-router";
import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function CategoriesLayout() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false, title: "Categories" }} />
            <TopTabs>
                <TopTabs.Screen name="tab1" options={{ title: "Category 1" }} />
                <TopTabs.Screen name="tab2" options={{ title: "Category 2" }} />
                <TopTabs.Screen name="tab3" options={{ title: "Category 3" }} />
            </TopTabs>
        </>
    );
}
