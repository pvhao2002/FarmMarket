import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { APP_CONFIG } from '@/constants/app-config';

export default function HistoryScreen() {
    const { user } = useAuthStore();
    const token = user?.token;
    const router = useRouter();

    const [orders, setOrders] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [hasNext, setHasNext] = useState(false);

    const fetchOrders = useCallback(
        async (reset = false) => {
            if (!token) {
                router.replace('/login');
                return;
            }
            try {
                if (reset) setPage(0);
                if (!reset) setLoading(true);

                const res = await fetch(
                    `${APP_CONFIG.BASE_URL}/orders/my-orders?page=${reset ? 0 : page}&size=${size}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const json = await res.json();
                if (!res.ok || json.success === false)
                    throw new Error(json.error?.message || json.message || 'Failed to load orders');

                const data = json.data ?? json;
                reset ? setOrders(data.content) : setOrders((prev) => [...prev, ...data.content]);
                setHasNext(data.hasNext);
            } catch (err: any) {
                Alert.alert('Lỗi', err.message || 'Không thể tải danh sách đơn hàng');
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [token, router, page, size]
    );

    useEffect(() => {
        fetchOrders(true);
    }, [fetchOrders]);

    useEffect(() => {
        if (page > 0) fetchOrders(false);
    }, [page, fetchOrders]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders(true);
    };

    const handleCancel = async (orderId: number) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn huỷ đơn hàng này không?', [
            { text: 'Không' },
            {
                text: 'Đồng ý',
                onPress: async () => {
                    try {
                        const res = await fetch(`${APP_CONFIG.BASE_URL}/orders/${orderId}/cancel`, {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        const json = await res.json();
                        if (!res.ok || json.success === false)
                            throw new Error(json.error?.message || json.message || 'Huỷ đơn thất bại');

                        Alert.alert('✅ Thành công', 'Đơn hàng đã được huỷ.');
                        fetchOrders(true);
                    } catch (err: any) {
                        Alert.alert('❌ Lỗi', err.message || 'Không thể huỷ đơn hàng');
                    }
                },
            },
        ]);
    };

    const renderOrder = ({ item }: { item: any }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: '/order-detail', params: { id: item.id } })}
        >
            <View style={s.card}>
                <View style={s.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="leaf-outline" size={22} color="#2E7D32" />
                        <Text style={s.buyer}>{item.userName || 'Khách hàng'}</Text>
                    </View>
                    <Text style={[s.status, getStatusStyle(item.status)]}>
                        {item.status}
                    </Text>
                </View>

                <Text style={s.dateText}>
                    🗓 {new Date(item.createdAt).toLocaleString('vi-VN')}
                </Text>

                <View style={s.row}>
                    <Ionicons name="location-outline" size={18} color="#757575" />
                    <Text numberOfLines={1} style={s.address}>{item.shippingAddress}</Text>
                </View>

                <View style={s.row}>
                    <Ionicons name="call-outline" size={18} color="#757575" />
                    <Text style={s.phone}>{item.phone ?? 'N/A'}</Text>
                </View>

                <View style={s.row}>
                    <Ionicons name="card-outline" size={18} color="#757575" />
                    <Text style={s.payment}>Thanh toán: {item.paymentMethod} · {item.itemCount} sản phẩm</Text>
                </View>

                <View style={s.divider} />

                <View style={s.footer}>
                    <View>
                        <Text style={s.totalLabel}>Tổng cộng</Text>
                        <Text style={s.totalValue}>
                            {Number(item.total).toLocaleString('vi-VN')} ₫
                        </Text>
                    </View>

                    {(item.status === 'PENDING' ||
                        (item.status === 'PROCESSING' && item.paymentMethod !== 'VNPAY')) && (
                        <TouchableOpacity style={s.cancelBtn} onPress={() => handleCancel(item.id)}>
                            <Ionicons name="close-circle-outline" size={18} color="#fff" />
                            <Text style={s.cancelText}>Huỷ</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () =>
        hasNext ? <ActivityIndicator style={{ marginVertical: 20 }} color="#2E7D32" /> : null;

    if (loading && !orders.length) {
        return (
            <View style={s.center}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={s.loadingText}>Đang tải đơn hàng...</Text>
            </View>
        );
    }

    return (
        <View style={s.container}>
            <View style={s.header}>
                <Ionicons name="bag-handle-outline" size={24} color="#2E7D32" />
                <Text style={s.title}>Đơn hàng của tôi</Text>
            </View>

            {orders.length === 0 ? (
                <View style={s.empty}>
                    <Ionicons name="file-tray-outline" size={60} color="#9E9E9E" />
                    <Text style={s.emptyText}>Chưa có đơn hàng nào</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={() => setPage((p) => (hasNext ? p + 1 : p))}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={renderFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#2E7D32"
                        />
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'DELIVERED':
            return { color: '#4CAF50', backgroundColor: '#E8F5E9' };
        case 'PROCESSING':
            return { color: '#2E7D32', backgroundColor: '#E9F6EC' };
        case 'SHIPPED':
            return { color: '#2E7D32', backgroundColor: '#EAF8FB' };
        case 'CANCELLED':
            return { color: '#D32F2F', backgroundColor: '#FDECEC' };
        case 'PENDING':
        default:
            return { color: '#FFA000', backgroundColor: '#FFF8E1' };
    }
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA', paddingHorizontal: 14 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14 },
    title: { fontSize: 20, fontWeight: '700', color: '#212121' },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    buyer: { fontSize: 15, fontWeight: '600', color: '#212121' },
    status: {
        fontWeight: '700',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        overflow: 'hidden',
        textTransform: 'capitalize',
        fontSize: 13,
    },
    dateText: { color: '#757575', fontSize: 12, marginVertical: 8 },

    row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    address: { color: '#212121', fontSize: 13, flex: 1 },
    phone: { color: '#212121', fontSize: 13 },
    payment: { color: '#757575', fontSize: 13 },

    divider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 10 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 13, color: '#757575' },
    totalValue: { fontWeight: '800', color: '#2E7D32', fontSize: 17 },

    cancelBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D32F2F',
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 16,
        gap: 6,
    },
    cancelText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: '#757575' },

    empty: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 10, color: '#757575', fontSize: 15 },
});
