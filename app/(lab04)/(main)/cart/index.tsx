import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useAuth } from "@/context/AuthContext";
import {
    Cart,
    CartProduct,
    deleteCart,
    fetchProducts,
    fetchUserCarts,
    Product,
    updateCart,
} from "@/services/api";

type CartItemView = {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    productId: number;
};

export default function CartScreen() {
    const router = useRouter();
    const { userId } = useAuth();

    const [cart, setCart] = useState<Cart | null>(null);
    const [productMap, setProductMap] = useState<Record<number, Product>>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const loadCart = async () => {
        if (!userId) {
            setLoading(false);
            setRefreshing(false);
            return;
        }
        setLoading(true);
        try {
            const [cartResponse, productsResponse] = await Promise.all([
                fetchUserCarts(userId),
                fetchProducts(),
            ]);
            const firstCart = cartResponse.data?.[0] ?? null;
            setCart(firstCart);
            const map: Record<number, Product> = {};
            productsResponse.data.forEach((p) => {
                map[p.id] = p;
            });
            setProductMap(map);
        } catch (error) {
            Alert.alert("Error", "Unable to load cart. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, [userId]);

    const items = useMemo<CartItemView[]>(() => {
        if (!cart) return [];
        return cart.products.map((p) => {
            const product = productMap[p.productId];
            return {
                id: p.productId,
                productId: p.productId,
                title: product?.title ?? "Product",
                price: product?.price ?? 0,
                image: product?.image ?? "",
                quantity: p.quantity,
            };
        });
    }, [cart, productMap]);

    const totalAmount = useMemo(() => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [items]);

    const syncCart = async (nextProducts: CartProduct[]) => {
        if (!cart) return;
        const prevCart = cart;
        setCart({ ...cart, products: nextProducts });
        setUpdating(true);
        try {
            if (nextProducts.length === 0) {
                await deleteCart(cart.id);
                setCart(null);
            } else {
                await updateCart(cart.id, {
                    ...cart,
                    date: new Date().toISOString(),
                    products: nextProducts,
                });
            }
        } catch (error) {
            setCart(prevCart);
            Alert.alert("Error", "Unable to update cart. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    const handleIncrease = (productId: number) => {
        if (!cart) return;
        const updated = cart.products.map((p) =>
            p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p
        );
        syncCart(updated);
    };

    const handleDecrease = (productId: number) => {
        if (!cart) return;
        const current = cart.products.find((p) => p.productId === productId);
        if (!current) return;
        if (current.quantity === 1) {
            setConfirmId(productId);
            setModalVisible(true);
            return;
        }
        const updated = cart.products.map((p) =>
            p.productId === productId ? { ...p, quantity: p.quantity - 1 } : p
        );
        syncCart(updated);
    };

    const confirmRemove = () => {
        if (!cart || confirmId === null) return;
        const updated = cart.products.filter((p) => p.productId !== confirmId);
        setModalVisible(false);
        setConfirmId(null);
        syncCart(updated);
    };

    const openRemoveModal = (productId: number) => {
        setConfirmId(productId);
        setModalVisible(true);
    };

    if (!userId) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Please log in to view your cart.</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/(lab04)/(auth)/login")}>
                    <Text style={styles.primaryButtonText}>Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading cart...</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: CartItemView }) => (
        <View style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
            <View style={{ flex: 1, gap: 6 }}>
                <Text numberOfLines={2} style={styles.itemTitle}>
                    {item.title}
                </Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <View style={styles.quantityRow}>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => handleDecrease(item.productId)}
                        disabled={updating}
                    >
                        <Ionicons name="remove" size={18} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => handleIncrease(item.productId)}
                        disabled={updating}
                    >
                        <Ionicons name="add" size={18} color="#111827" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => openRemoveModal(item.productId)} style={styles.deleteBtn}>
                <Ionicons name="close" size={18} color="#DC2626" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {cart && cart.products.length > 0 ? (
                <>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 12 }}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => {
                                setRefreshing(true);
                                loadCart();
                            }} tintColor="#2563EB" />
                        }
                    />
                    <View style={styles.footer}>
                        <View>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.checkoutBtn, updating && { opacity: 0.7 }]}
                            activeOpacity={0.9}
                            disabled={updating}
                            onPress={() => Alert.alert("Checkout", "Checkout flow is not implemented for this lab.")}
                        >
                            {updating ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.checkoutText}>CHECKOUT</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>You have no products in your cart.</Text>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.replace("/(lab04)/(main)/home")}
                    >
                        <Text style={styles.primaryButtonText}>SHOP NOW</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal transparent visible={modalVisible} animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Remove item</Text>
                        <Text style={styles.modalText}>Are you sure you want to delete this product?</Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.modalButton, styles.modalCancel]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalCancelText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.modalConfirm]} onPress={confirmRemove}>
                                <Text style={styles.modalConfirmText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    itemCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 12,
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    itemImage: {
        width: 80,
        height: 80,
    },
    itemTitle: {
        fontWeight: "700",
        fontSize: 14,
        color: "#111827",
    },
    itemPrice: {
        color: "#2563EB",
        fontWeight: "700",
    },
    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    qtyBtn: {
        backgroundColor: "#E5E7EB",
        borderRadius: 8,
        padding: 6,
    },
    qtyText: {
        fontWeight: "700",
        minWidth: 24,
        textAlign: "center",
        color: "#111827",
    },
    deleteBtn: {
        padding: 6,
    },
    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: 16,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
        gap: 12,
    },
    totalLabel: {
        color: "#6B7280",
        fontWeight: "600",
        fontSize: 12,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
    },
    checkoutBtn: {
        backgroundColor: "#2563EB",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: "center",
    },
    checkoutText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 24,
        backgroundColor: "#F9FAFB",
    },
    emptyText: {
        color: "#4B5563",
        textAlign: "center",
        fontSize: 16,
    },
    primaryButton: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        width: "100%",
        maxWidth: 360,
        gap: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    modalText: {
        color: "#4B5563",
        lineHeight: 20,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 10,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: "center",
    },
    modalCancel: {
        backgroundColor: "#E5E7EB",
    },
    modalConfirm: {
        backgroundColor: "#DC2626",
    },
    modalCancelText: {
        color: "#111827",
        fontWeight: "700",
    },
    modalConfirmText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
});
