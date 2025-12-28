import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useAuth } from "@/context/AuthContext";
import {
    Cart,
    createCart,
    fetchCategories,
    fetchProducts,
    fetchProductsByCategory,
    fetchUserCarts,
    Product,
    updateCart,
} from "@/services/api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 16 * 2 - 12) / 2;

const CATEGORY_ICONS: Record<string, string> = {
    electronics: "laptop-outline",
    jewelery: "sparkles-outline",
    "men's clothing": "shirt-outline",
    "women's clothing": "woman-outline",
};

const CART_CACHE_PREFIX = "lab04_cart_cache_user_";

export default function CategoriesScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { userId, setCartCount } = useAuth();
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

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Categories",
        });
    }, [navigation]);

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
            const cacheKey = `${CART_CACHE_PREFIX}${userId}`;
            const cached = await AsyncStorage.getItem(cacheKey);
            let baseCart: Cart | null = cached ? JSON.parse(cached) : null;
            if (!baseCart) {
                const cartsResponse = await fetchUserCarts(userId);
                baseCart = cartsResponse.data[0] ?? null;
            }

            let updatedProducts: CartProduct[] = baseCart ? [...baseCart.products] : [];
            const idxProd = updatedProducts.findIndex((p) => p.productId === product.id);
            if (idxProd >= 0) {
                updatedProducts[idxProd] = { ...updatedProducts[idxProd], quantity: updatedProducts[idxProd].quantity + 1 };
            } else {
                updatedProducts.push({ productId: product.id, quantity: 1 });
            }
            const newCount = updatedProducts.reduce((sum, p) => sum + p.quantity, 0);

            if (baseCart && baseCart.id) {
                await updateCart(baseCart.id, {
                    ...baseCart,
                    date: new Date().toISOString(),
                    products: updatedProducts,
                });
                baseCart = { ...baseCart, products: updatedProducts };
            } else {
                const created = await createCart({
                    userId,
                    date: new Date().toISOString(),
                    products: updatedProducts,
                });
                baseCart = created.data;
            }

            setCartCount(newCount > 0 ? newCount : undefined);
            await AsyncStorage.setItem(cacheKey, JSON.stringify(baseCart));
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
            <View style={styles.cardFooter}>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity
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
                </TouchableOpacity>
            </View>
            <View style={styles.rateRow}>
                <Ionicons name="star" color="#D57C2C" size={14} />
                <Text style={styles.rateText}>{item.rating?.rate?.toFixed(1) ?? "0.0"}</Text>
                <Text style={styles.rateCount}>({item.rating?.count ?? 0})</Text>
            </View>
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
                <Text style={[styles.chipText, isActive && styles.chipTextActive]} numberOfLines={1}>
                    {name}
                </Text>
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
            <View style={styles.chipBar}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipContent}
                    style={{ flexGrow: 0 }}
                >
                    {categories.map(renderCategoryChip)}
                </ScrollView>
            </View>

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
    chip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        gap: 8,
        height: 44,
        flexShrink: 0,
    },
    chipBar: {
        height: 60,
        justifyContent: "center",
        marginBottom: 12,
    },
    chipContent: {
        paddingHorizontal: 16,
        gap: 10,
        alignItems: "center",
    },
    chipActive: {
        backgroundColor: "#2563EB",
        borderColor: "#2563EB",
    },
    chipText: {
        textTransform: "capitalize",
        color: "#1F2937",
        fontWeight: "600",
        fontSize: 14,
    },
    chipTextActive: {
        color: "#FFFFFF",
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
