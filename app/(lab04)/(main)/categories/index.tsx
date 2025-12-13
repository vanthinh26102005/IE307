import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useAuth } from "@/context/AuthContext";
import {
    createCart,
    fetchCategories,
    fetchProducts,
    fetchProductsByCategory,
    fetchUserCarts,
    Product,
    updateCart,
} from "@/services/api";

const CATEGORY_ICONS: Record<string, string> = {
    electronics: "laptop-outline",
    jewelery: "sparkles-outline",
    "men's clothing": "shirt-outline",
    "women's clothing": "woman-outline",
};

export default function CategoriesScreen() {
    const router = useRouter();
    const { userId } = useAuth();
    const [categories, setCategories] = useState<string[]>(["all"]);
    const [selected, setSelected] = useState<string>("all");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [addingId, setAddingId] = useState<number | null>(null);

    const loadCategories = async () => {
        try {
            const response = await fetchCategories();
            setCategories(["all", ...response.data]);
        } catch (error) {
            Alert.alert("Error", "Unable to load categories.");
        }
    };

    const loadProducts = async (category: string) => {
        setLoading(true);
        try {
            const response =
                category === "all" ? await fetchProducts() : await fetchProductsByCategory(category);
            setProducts(response.data);
        } catch (error) {
            Alert.alert("Error", "Unable to load products.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadCategories();
        loadProducts("all");
    }, []);

    useEffect(() => {
        loadProducts(selected);
    }, [selected]);

    const onRefresh = () => {
        setRefreshing(true);
        loadProducts(selected);
    };

    const handleAdd = async (product: Product) => {
        if (!userId) {
            Alert.alert("Login required", "Please log in to add items to cart.", [
                { text: "Cancel" },
                { text: "Go to login", onPress: () => router.replace("/(lab04)/(auth)/login") },
            ]);
            return;
        }
        setAddingId(product.id);
        try {
            const cartsResponse = await fetchUserCarts(userId);
            const existingCart = cartsResponse.data[0];
            if (existingCart) {
                const updatedProducts = [...existingCart.products];
                const index = updatedProducts.findIndex((p) => p.productId === product.id);
                if (index >= 0) {
                    updatedProducts[index] = { ...updatedProducts[index], quantity: updatedProducts[index].quantity + 1 };
                } else {
                    updatedProducts.push({ productId: product.id, quantity: 1 });
                }
                await updateCart(existingCart.id, {
                    ...existingCart,
                    date: new Date().toISOString(),
                    products: updatedProducts,
                });
            } else {
                await createCart({
                    userId,
                    date: new Date().toISOString(),
                    products: [{ productId: product.id, quantity: 1 }],
                });
            }
            Alert.alert("Success", "Product added to cart.");
        } catch (error) {
            Alert.alert("Error", "Unable to add to cart.");
        } finally {
            setAddingId(null);
        }
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
                router.push({
                    pathname: "/(lab04)/(main)/categories/details",
                    params: { id: item.id.toString() },
                })
            }
        >
            <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
            <Text style={styles.productTitle} numberOfLines={2}>
                {item.title}
            </Text>
            <View style={styles.priceRow}>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <View style={styles.rateRow}>
                    <Ionicons name="star" color="#D57C2C" size={14} />
                    <Text style={styles.rateText}>{item.rating?.rate?.toFixed(1) ?? "0.0"}</Text>
                </View>
            </View>
            <Pressable
                style={styles.addBtn}
                onPress={(e) => {
                    e.stopPropagation();
                    handleAdd(item);
                }}
            >
                {addingId === item.id ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Ionicons name="add" size={18} color="#FFFFFF" />
                )}
            </Pressable>
        </TouchableOpacity>
    );

    const renderCategoryChip = (name: string) => {
        const isActive = selected === name;
        const iconName = CATEGORY_ICONS[name] || "pricetag-outline";
        return (
            <TouchableOpacity
                key={name}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setSelected(name)}
                activeOpacity={0.85}
            >
                <Ionicons name={iconName as any} size={18} color={isActive ? "#FFFFFF" : "#1F2937"} />
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{name}</Text>
            </TouchableOpacity>
        );
    };

    if (loading && products.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading products...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Categories</Text>
                <Text style={styles.subtitle}>Pick a category to explore</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                style={{ marginBottom: 12 }}
            >
                {categories.map(renderCategoryChip)}
            </ScrollView>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ gap: 12 }}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                renderItem={renderProduct}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },
    subtitle: {
        color: "#6B7280",
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        gap: 6,
    },
    chipActive: {
        backgroundColor: "#2563EB",
        borderColor: "#2563EB",
    },
    chipText: {
        textTransform: "capitalize",
        color: "#1F2937",
        fontWeight: "600",
    },
    chipTextActive: {
        color: "#FFFFFF",
    },
    card: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
        gap: 8,
    },
    productImage: {
        width: "100%",
        height: 140,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    price: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2563EB",
    },
    addBtn: {
        position: "absolute",
        right: 10,
        bottom: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    rateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    rateText: {
        color: "#4B5563",
        fontWeight: "600",
        fontSize: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        gap: 10,
    },
    loadingText: {
        color: "#4B5563",
    },
});
