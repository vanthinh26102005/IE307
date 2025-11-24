"use client"

import { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SectionList,
    ImageBackground,
    SafeAreaView,
    Image,
    Pressable,
} from "react-native"
import { BlurView } from "expo-blur"
import { workouts, fruits_vegetables } from "@/app/screens/data/workout"

type FruitVegetableSection = {
    title: string
    url: string
    data: string[]
}

export default function WorkoutsFruits() {
    const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([])
    const [selectedItems, setSelectedItems] = useState<string[]>([])

    const toggleWorkout = (id: string) => {
        setSelectedWorkouts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    }

    const toggleItem = (item: string) => {
        setSelectedItems((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]))
    }

    const getAllSelectedItems = () => {
        const selectedWorkoutNames = selectedWorkouts.map((id) => workouts.find((w) => w.id === id)?.type).filter(Boolean)
        return [...selectedWorkoutNames, ...selectedItems]
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.section}>
                <ImageBackground
                    source={require("@/app/screens/assets/bg-1.png")}
                    style={styles.sectionBackground}
                    resizeMode="cover"
                >
                    <View style={styles.sectionOverlay} />
                    <View style={styles.sectionContent}>
                        <BlurView intensity={20} tint="light" style={styles.titleBlur}>
                            <Text style={styles.mainTitle}>FlatList - Workouts</Text>
                        </BlurView>

                        <FlatList
                            data={workouts}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <BlurView intensity={30} tint="dark" style={styles.glassContainer}>
                                    <View style={styles.itemContainer}>
                                        <Text style={styles.itemText}>{item.type}</Text>
                                        <Pressable
                                            onPress={() => toggleWorkout(item.id)}
                                            style={[styles.button, selectedWorkouts.includes(item.id) && styles.buttonSelected]}
                                        >
                                            <Text
                                                style={[styles.buttonText, selectedWorkouts.includes(item.id) && styles.buttonTextSelected]}
                                            >
                                                {selectedWorkouts.includes(item.id) ? "Deselect" : "Select"}
                                            </Text>
                                        </Pressable>
                                    </View>
                                </BlurView>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </ImageBackground>
            </View>

            <View style={styles.section}>
                <ImageBackground
                    source={require("@/app/screens/assets/bg-2.png")}
                    style={styles.sectionBackground}
                    resizeMode="cover"
                >
                    <View style={styles.sectionOverlay} />
                    <View style={styles.sectionContent}>
                        <BlurView intensity={20} tint="light" style={styles.titleBlur}>
                            <Text style={styles.mainTitle}>SectionList - Fruits & Vegetables</Text>
                        </BlurView>

                        <SectionList
                            sections={fruits_vegetables as FruitVegetableSection[]}
                            keyExtractor={(item, index) => item + index}
                            renderSectionHeader={({ section }) => (
                                <BlurView intensity={35} tint="light" style={styles.glassContainer}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>{section.title}</Text>
                                        <Image source={{ uri: section.url }} style={styles.sectionIcon} resizeMode="contain" />
                                    </View>
                                </BlurView>
                            )}
                            renderItem={({ item }) => (
                                <BlurView intensity={30} tint="dark" style={styles.glassContainer}>
                                    <View style={styles.itemContainer}>
                                        <Text style={styles.itemText}>{item}</Text>
                                        <Pressable
                                            onPress={() => toggleItem(item)}
                                            style={[styles.button, selectedItems.includes(item) && styles.buttonSelected]}
                                        >
                                            <Text style={[styles.buttonText, selectedItems.includes(item) && styles.buttonTextSelected]}>
                                                {selectedItems.includes(item) ? "Deselect" : "Select"}
                                            </Text>
                                        </Pressable>
                                    </View>
                                </BlurView>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </ImageBackground>
            </View>

            <View style={styles.selectedWrapper}>
                <BlurView intensity={40} tint="light" style={styles.glassContainer}>
                    <View style={styles.selectedContainer}>
                        <Text style={styles.selectedTitle}>SELECTED EXCERCISES:</Text>
                        <Text style={styles.selectedText}>{getAllSelectedItems().join(", ") || "None"}</Text>
                    </View>
                </BlurView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },
    section: {
        flex: 1,
    },
    sectionBackground: {
        flex: 1,
    },
    sectionOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    sectionContent: {
        flex: 1,
        padding: 16,
    },
    glassContainer: {
        borderRadius: 16,
        marginVertical: 6,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    titleBlur: {
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.4)",
    },
    mainTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        paddingHorizontal: 20,
        paddingVertical: 16,
        textAlign: "center"
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        paddingVertical: 6,
        paddingHorizontal: 18,
    },
    itemText: {
        fontSize: 16,
        color: "#1F2937",
        fontWeight: "600",
        flex: 1,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: "#E5E7EB",
        minWidth: 90,
        alignItems: "center",
    },
    buttonSelected: {
        backgroundColor: "#2563EB",
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
    },
    buttonTextSelected: {
        color: "#FFFFFF",
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        paddingVertical: 12,
        paddingHorizontal: 50,
        justifyContent: "space-between",
    },
    sectionIcon: {
        width: 32,
        height: 32,
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2937",
    },
    selectedWrapper: {
        padding: 5,
    },
    selectedContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        padding: 4,
        paddingBottom: 12
    },
    selectedTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 12,
    },
    selectedText: {
        fontSize: 16,
        color: "#374151",
        lineHeight: 24,
        fontWeight: "500",
    },
})
