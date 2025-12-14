import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useAuth } from "@/context/AuthContext";
import { Cart, createCart, fetchProducts, fetchUserCarts, Product, updateCart } from "@/services/api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 16 * 2 - 12) / 2;

const BANNERS = [
    {
        id: 1,
        title: "Shop for quality, Shop for style",
        uri: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=60",
    },
    {
        id: 2,
        title: "Hot deals everyday",
        uri: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=60",
    },
    {
        id: 3,
        title: "New arrivals just in",
        uri: "https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=900&q=60",
    },
];

const CART_CACHE_PREFIX = "lab04_cart_cache_user_";

export default function HomeScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { userId, setCartCount } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<number | null>(null);

    const loadProducts = async () => {
        try {
            const response = await fetchProducts();
            setProducts(response.data);
        } catch (error) {
            Alert.alert("Error", "Unable to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Home",
        });
    }, [navigation]);

    const hotDeals = useMemo(() => {
        if (!products.length) return [];
        return products.filter((_, idx) => idx % 2 === 0).slice(0, 8);
    }, [products]);

    const newArrivals = useMemo(() => {
        if (!products.length) return [];
        const rest = products.filter((_, idx) => idx % 2 !== 0);
        return rest.slice(0, 8);
    }, [products]);

    const handleAddToCart = async (product: Product) => {
        if (!userId) {
            Alert.alert("Login required", "Please log in to add items to cart.", [
                { text: "Cancel" },
                { text: "Go to login", onPress: () => router.replace("/(lab04)/(auth)/login") },
            ]);
            return;
        }
        setAddingId(product.id);
        try {
            const cacheKey = `${CART_CACHE_PREFIX}${userId}`;
            const cartsResponse = await fetchUserCarts(userId);
            const existingCart = cartsResponse.data[0];
            let newCount = 1;
            if (existingCart) {
                const updatedProducts = [...existingCart.products];
                const index = updatedProducts.findIndex((p) => p.productId === product.id);
                if (index >= 0) {
                    newCount = updatedProducts.reduce((sum, p, idx) =>
                        idx === index ? sum + p.quantity + 1 : sum + p.quantity, 0);
                    updatedProducts[index] = { ...updatedProducts[index], quantity: updatedProducts[index].quantity + 1 };
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
                // cache update best-effort
            }
            Alert.alert("Success", "Product added to cart.");
        } catch (error) {
            Alert.alert("Error", "Unable to add to cart. Please try again.");
        } finally {
            setAddingId(null);
        }
    };

    const renderCard = (item: Product) => (
        <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
                router.push({
                    pathname: "/(lab04)/(main)/home/details",
                    params: { id: item.id.toString() },
                })
            }
        >
            <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
            <Text style={styles.productTitle} numberOfLines={2}>
                {item.title}
            </Text>
            <View style={styles.cardFooter}>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                    }}
                >
                    {addingId === item.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Ionicons name="add" size={18} color="#FFFFFF" />
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.rateRow}>
                <Ionicons name="star" color="#D57C2C" size={14} />
                <Text style={styles.rateText}>{item.rating?.rate?.toFixed(1) ?? "0.0"}</Text>
                <Text style={styles.rateCount}>({item.rating?.count ?? 0})</Text>
            </View>
        </TouchableOpacity>
    );

    const listHeader = useMemo(
        () => (
            <View style={{ gap: 16 }}>
                <View style={styles.bannerContainer}>
                    <Carousel
                        width={width - 32}
                        height={180}
                        autoPlay
                        loop
                        data={BANNERS}
                        scrollAnimationDuration={1200}
                        renderItem={({ item }) => (
                            <View style={styles.banner}>
                                <Image source={{ uri: item.uri }} style={styles.bannerImage} />
                                <View style={styles.bannerOverlay} />
                                <Text style={styles.bannerTitle}>{item.title}</Text>
                            </View>
                        )}
                    />
                </View>
            </View>
        ),
        []
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading products...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 20 }}>
            {listHeader}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Hot Deals 🔥</Text>
            </View>
            <View style={styles.grid}>
                {hotDeals.map(renderCard)}
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>New Arrivals ✨</Text>
            </View>
            <View style={styles.grid}>
                {newArrivals.map(renderCard)}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
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
    bannerContainer: {
        borderRadius: 12,
        overflow: "hidden",
    },
    banner: {
        width: width - 32,
        height: 180,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#E5E7EB",
    },
    bannerImage: {
        width: "100%",
        height: "100%",
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.25)",
    },
    bannerTitle: {
        position: "absolute",
        bottom: 12,
        left: 12,
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        maxWidth: "80%",
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
    },
    card: {
        width: CARD_WIDTH,
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
    cardFooter: {
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
        width: 34,
        height: 34,
        borderRadius: 17,
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
    rateCount: {
        color: "#9CA3AF",
        fontSize: 12,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "space-between",
    },
});
