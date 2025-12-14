import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useAuth } from "@/context/AuthContext";
import {
    Cart,
    createCart,
    fetchProductById,
    fetchUserCarts,
    Product,
    updateCart,
} from "@/services/api";

const CART_CACHE_PREFIX = "lab04_cart_cache_user_";

export default function ProductDetailsScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { userId, setCartCount } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (!id) return;
        const loadProduct = async () => {
            try {
                const response = await fetchProductById(Number(id));
                setProduct(response.data);
                navigation.setOptions({
                    title: response.data.title,
                    headerBackTitleVisible: false,
                });
            } catch (error) {
                Alert.alert("Error", "Unable to load product.", [{ text: "OK", onPress: () => router.back() }]);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id, router, navigation]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: product ? product.title : "Details",
            headerBackTitleVisible: false,
        });
    }, [navigation, product]);

    const handleAddToCart = async () => {
        if (!product) return;
        if (!userId) {
            Alert.alert("Login required", "Please log in to add products to your cart.", [
                { text: "Cancel" },
                { text: "Go to login", onPress: () => router.replace("/(lab04)/(auth)/login") },
            ]);
            return;
        }
        setAdding(true);
        try {
            const cartsResponse = await fetchUserCarts(userId);
            const existingCart = cartsResponse.data[0];
            let newCount = 1;
            const cacheKey = `${CART_CACHE_PREFIX}${userId}`;
            if (existingCart) {
                const updatedProducts = [...existingCart.products];
                const index = updatedProducts.findIndex((p) => p.productId === product.id);
                if (index >= 0) {
                    newCount = updatedProducts.reduce((sum, p, idx) =>
                        idx === index ? sum + p.quantity + 1 : sum + p.quantity, 0);
                    updatedProducts[index] = {
                        ...updatedProducts[index],
                        quantity: updatedProducts[index].quantity + 1,
                    };
                } else {
                    updatedProducts.push({ productId: product.id, quantity: 1 });
                    newCount = updatedProducts.reduce((sum, p) => sum + p.quantity, 0);
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
            setCartCount((prev) => {
                if (typeof prev === "number") return prev + 1;
                return newCount;
            });
            try {
                const cached = await AsyncStorage.getItem(cacheKey);
                let nextCart: Cart;
                if (cached) {
                    nextCart = JSON.parse(cached);
                } else {
                    nextCart = { id: Date.now(), userId, date: new Date().toISOString(), products: [] };
                }
                const idx = nextCart.products.findIndex((p) => p.productId === product.id);
                if (idx >= 0) {
                    nextCart.products[idx].quantity += 1;
                } else {
                    nextCart.products.push({ productId: product.id, quantity: 1 });
                }
                await AsyncStorage.setItem(cacheKey, JSON.stringify(nextCart));
            } catch (err) {
                // best effort cache update
            }
            Alert.alert("Success", "Product added to cart.");
        } catch (error) {
            Alert.alert("Error", "Unable to add to cart. Please try again.");
        } finally {
            setAdding(false);
        }
    };

    if (loading || !product) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading product...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: "#F9FAFB" }}>
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.content}>
                <Text style={styles.title}>{product.title}</Text>
                <View style={styles.row}>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    <View style={styles.rateRow}>
                        <Ionicons name="star" color="#D57C2C" size={18} />
                        <Text style={styles.rateText}>
                            {product.rating?.rate ?? "0"} ({product.rating?.count ?? 0} reviews)
                        </Text>
                    </View>
                </View>
                <Text style={styles.description}>{product.description}</Text>

                <TouchableOpacity style={styles.button} onPress={handleAddToCart} activeOpacity={0.9} disabled={adding}>
                    {adding ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <View style={styles.buttonContent}>
                            <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Add to Cart</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
    container: {
        padding: 16,
        gap: 16,
    },
    image: {
        width: "100%",
        height: 320,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
    },
    content: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
        gap: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    price: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2563EB",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    rateText: {
        color: "#4B5563",
        fontWeight: "600",
    },
    description: {
        color: "#4B5563",
        lineHeight: 20,
        fontSize: 14,
    },
    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 16,
    },
});
