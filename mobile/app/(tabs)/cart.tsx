import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
    const router = useRouter();
    const items = useCartStore((s) => s.items);
    const removeItem = useCartStore((s) => s.removeItem);
    const clearCart = useCartStore((s) => s.clearCart);
    const updateQuantity = useCartStore((s) => s.updateQuantity);

    const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);
    const totalPrice = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    return (
        <>
            <View style={s.header}>
                <Text style={s.headerTitle}>🛒 Giỏ hàng Nông Sản</Text>
            </View>

            {items.length === 0 ? (
                <View style={s.emptyBox}>
                    <Ionicons name="cart-outline" size={80} color="#9E9E9E" />
                    <Text style={s.emptyText}>Chưa có sản phẩm trong giỏ hàng</Text>
                    <TouchableOpacity
                        style={s.shopBtn}
                        onPress={() => router.push('/products')}
                    >
                        <Ionicons name="leaf-outline" size={18} color="#fff" />
                        <Text style={s.shopText}>Tiếp tục mua sắm</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={items}
                        keyExtractor={(_, i) => i.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 90 }}
                        renderItem={({ item }) => (
                            <View style={s.card}>
                                <Image source={{ uri: item.image }} style={s.img} />
                                <View style={{ flex: 1 }}>
                                    <Text style={s.name} numberOfLines={2}>
                                        {item.name}
                                    </Text>
                                    <Text style={s.price}>
                                        {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                                    </Text>

                                    {/* Controls */}
                                    <View style={s.qtyRow}>
                                        <TouchableOpacity
                                            style={s.qtyBtn}
                                            onPress={() => updateQuantity(item.productId, -1)}
                                        >
                                            <Text style={s.qtyBtnText}>−</Text>
                                        </TouchableOpacity>
                                        <Text style={s.qtyValue}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            style={s.qtyBtn}
                                            onPress={() => updateQuantity(item.productId, +1)}
                                        >
                                            <Text style={s.qtyBtnText}>＋</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => removeItem(item.productId)}>
                                    <Ionicons name="trash-outline" size={22} color="#D32F2F" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    <View style={s.bottomSummary}>
                        <View style={s.totalBox}>
                            <Text style={s.totalLabel}>
                                Tổng cộng ({totalItems} {totalItems > 1 ? 'sản phẩm' : 'sản phẩm'})
                            </Text>
                            <Text style={s.totalPrice}>
                                {totalPrice.toLocaleString('vi-VN')} ₫
                            </Text>
                        </View>

                        <View style={s.actionBox}>
                            <TouchableOpacity style={s.clearBtn} onPress={clearCart}>
                                <Ionicons name="close-circle-outline" size={18} color="#2E7D32" />
                                <Text style={s.clearText}>Xoá tất cả</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={s.checkoutBtn}
                                onPress={() => router.push('/checkout')}
                            >
                                <Ionicons name="cart" size={20} color="#fff" />
                                <Text style={s.checkoutText}>Thanh toán</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}
        </>
    );
}

const s = StyleSheet.create({
    header: {
        backgroundColor: '#2E7D32', // Xanh nông nghiệp
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },

    emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { marginTop: 10, color: '#757575', fontSize: 16 },
    shopBtn: {
        marginTop: 20,
        backgroundColor: '#F57C00', // Cam đất
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
    },
    shopText: { color: '#fff', marginLeft: 6, fontWeight: '600' },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    img: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 12,
        backgroundColor: '#F5F7FA', // Nền phụ
    },
    name: { fontWeight: '600', fontSize: 15, color: '#212121' },
    price: { color: '#2E7D32', fontWeight: '700', marginTop: 4, fontSize: 15 },

    qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
    qtyBtn: {
        width: 30,
        height: 30,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F7FA',
    },
    qtyBtnText: { fontSize: 18, fontWeight: '700', color: '#212121' },
    qtyValue: { minWidth: 26, textAlign: 'center', fontWeight: '600', color: '#212121' },

    bottomSummary: {
        position: 'absolute',
        bottom: 90,
        left: 16,
        right: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 18,
        flexDirection: 'column',
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    totalBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    totalLabel: { fontSize: 15, color: '#757575', fontWeight: '500' },
    totalPrice: { fontSize: 20, fontWeight: '800', color: '#2E7D32' },

    actionBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    clearBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2E7D32',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
    },
    clearText: { color: '#2E7D32', fontWeight: '600', marginLeft: 6 },

    checkoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F57C00',
        borderRadius: 30,
        paddingHorizontal: 24,
        paddingVertical: 10,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowRadius: 6,
        elevation: 4,
    },
    checkoutText: { color: '#FFFFFF', fontWeight: '700', marginLeft: 6 },
});
