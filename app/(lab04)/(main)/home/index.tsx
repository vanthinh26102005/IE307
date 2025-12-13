import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import Ionicons from "@expo/vector-icons/Ionicons";

import { fetchProducts, Product } from "@/services/api";

const { width } = Dimensions.get("window");

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

export default function HomeScreen() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadProducts = async () => {
        try {
            const response = await fetchProducts();
            setProducts(response.data);
        } catch (error) {
            Alert.alert("Error", "Unable to load products. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadProducts();
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
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
            <View style={styles.priceRow}>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <View style={styles.rateRow}>
                    <Ionicons name="star" color="#D57C2C" size={14} />
                    <Text style={styles.rateText}>{item.rating?.rate?.toFixed(1) ?? "0.0"}</Text>
                </View>
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
                <Text style={styles.sectionTitle}>Featured Products</Text>
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
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ gap: 12 }}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                renderItem={renderProduct}
                ListHeaderComponent={listHeader}
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        paddingHorizontal: 4,
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
});
