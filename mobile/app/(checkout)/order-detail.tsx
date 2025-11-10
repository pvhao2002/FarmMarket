import React, {useEffect, useState, useCallback} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
    TouchableOpacity,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useAuthStore} from '@/store/authStore';
import {APP_CONFIG} from '@/constants/app-config';

export default function OrderDetailScreen() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const {user} = useAuthStore();
    const token = user?.token;
    const router = useRouter();

    const [order, setOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetail = useCallback(async () => {
        if (!id || !token) return;
        try {
            setLoading(true);
            const res = await fetch(`${APP_CONFIG.BASE_URL}/orders/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            const json = await res.json();
            if (!res.ok || json.success === false)
                throw new Error(json.error?.message || json.message || 'Không tải được đơn hàng');
            setOrder(json.data ?? json);
        } catch (err: any) {
            Alert.alert('Lỗi', err.message || 'Không thể tải chi tiết đơn hàng');
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    useEffect(() => {
        fetchOrderDetail();
    }, [fetchOrderDetail]);

    if (loading)
        return (
            <View style={s.center}>
                <ActivityIndicator size="large" color="#2E7D32"/>
                <Text style={s.loadingText}>Đang tải chi tiết đơn hàng...</Text>
            </View>
        );

    if (!order)
        return (
            <View style={s.center}>
                <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF"/>
                <Text style={s.errorText}>Không tìm thấy đơn hàng.</Text>
            </View>
        );

    const formatDate = (d?: string) => (d ? new Date(d).toLocaleString('vi-VN') : '—');

    const getProgressStep = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 1;
            case 'PROCESSING':
                return 2;
            case 'SHIPPED':
                return 3;
            case 'DELIVERED':
                return 4;
            default:
                return 0;
        }
    };
    const progress = getProgressStep(order.status);

    return (
        <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
            {/* 🌿 Header */}
            <View style={s.header}>
                <Ionicons name="leaf-outline" size={26} color="#2E7D32"/>
                <View style={{flex: 1}}>
                    <Text style={s.headerTitle}>Đơn hàng #{order.id}</Text>
                    <Text style={s.headerSub}>{formatDate(order.createdAt)}</Text>
                </View>
                <View style={[s.statusPill, getStatusStyle(order.status)]}>
                    <Ionicons
                        name={getStatusStyle(order.status).icon}
                        size={16}
                        color={getStatusStyle(order.status).color}
                    />
                    <Text style={[s.statusText, {color: getStatusStyle(order.status).color}]}>
                        {order.status}
                    </Text>
                </View>
            </View>

            {/* 👩‍🌾 Khách hàng */}
            <Card title="Thông tin khách hàng">
                <Info icon="person-outline" label={order.fullName || 'Khách hàng'}/>
                <Info icon="mail-outline" label={order.userEmail}/>
                <Info icon="call-outline" label={order.phone || '—'}/>
            </Card>

            {/* 🚚 Địa chỉ giao hàng */}
            <Card title="Địa chỉ giao hàng">
                <Info icon="location-outline" label={order.shippingAddress || '—'}/>
            </Card>

            {/* 🌾 Danh sách sản phẩm */}
            <Card title={`Sản phẩm (${order.items?.length || 0})`}>
                {order.items?.map((it: any) => (
                    <View key={it.id} style={s.itemBox}>
                        <Image
                            source={{uri: it.medicineImages?.[0]}}
                            style={s.itemImg}
                        />
                        <View style={{flex: 1}}>
                            <Text style={s.itemName}>{it.medicineName}</Text>
                            <Text style={s.itemQty}>x{it.quantity}</Text>
                        </View>
                        <Text style={s.itemPrice}>
                            {(it.totalPrice ?? 0).toLocaleString('vi-VN')} ₫
                        </Text>
                    </View>
                ))}
            </Card>

            {/* 💳 Thanh toán */}
            <Card title="Chi tiết thanh toán">
                <Line label="Phương thức" value={order.paymentMethod}/>
                <Line label="Tạm tính" value={`${order.subtotal.toLocaleString('vi-VN')} ₫`}/>
                <Line label="Phí vận chuyển" value={`${order.shipping.toLocaleString('vi-VN')} ₫`}/>
                <Line label="Thuế" value={`${order.tax.toLocaleString('vi-VN')} ₫`}/>
                <View style={s.divider}/>
                <Line label="Tổng cộng" value={`${order.total.toLocaleString('vi-VN')} ₫`} bold accent/>
            </Card>

            {/* 📦 Tiến trình giao hàng */}
            <Card title="Trạng thái đơn hàng">
                <View style={s.timeline}>
                    {[
                        {icon: 'receipt-outline', label: 'Đã đặt hàng'},
                        {icon: 'construct-outline', label: 'Đang xử lý'},
                        {icon: 'cube-outline', label: 'Đang giao hàng'},
                        {icon: 'checkmark-done-outline', label: 'Hoàn tất'},
                    ].map((step, i) => {
                        const done = i + 1 <= progress;
                        return (
                            <View key={i} style={s.timelineStep}>
                                {i < 3 && (
                                    <View
                                        style={[
                                            s.timelineLine,
                                            {backgroundColor: done ? '#2E7D32' : '#EEEEEE'},
                                        ]}
                                    />
                                )}
                                <View
                                    style={[
                                        s.timelineIcon,
                                        {backgroundColor: done ? '#2E7D32' : '#EEEEEE'},
                                    ]}
                                >
                                    <Ionicons
                                        name={step.icon}
                                        size={18}
                                        color={done ? '#FFFFFF' : '#9CA3AF'}
                                    />
                                </View>
                                <Text
                                    style={[
                                        s.timelineLabel,
                                        {color: done ? '#2E7D32' : '#9CA3AF'},
                                    ]}
                                >
                                    {step.label}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </Card>

            {/* 🌻 CTA */}
            <TouchableOpacity
                style={s.ctaBtn}
                activeOpacity={0.9}
                onPress={() => router.replace('/(tabs)/history')}
            >
                <Ionicons name="arrow-back-outline" size={18} color="#fff"/>
                <Text style={s.ctaText}>Quay lại danh sách đơn hàng</Text>
            </TouchableOpacity>

            <View style={{height: 50}}/>
        </ScrollView>
    );
}

/* Components */
const Card = ({title, children}: { title: string; children: React.ReactNode }) => (
    <View style={s.card}>
        <Text style={s.cardTitle}>{title}</Text>
        <View style={s.cardLine}/>
        {children}
    </View>
);

const Info = ({icon, label}: { icon: any; label: string }) => (
    <View style={s.infoRow}>
        <Ionicons name={icon} size={18} color="#2E7D32"/>
        <Text style={s.infoText}>{label}</Text>
    </View>
);

const Line = ({label, value, bold, accent}: { label: string; value: string; bold?: boolean; accent?: boolean }) => (
    <View style={s.lineRow}>
        <Text style={[s.lineLabel, bold && {fontWeight: '700'}]}>{label}</Text>
        <Text
            style={[
                s.lineValue,
                bold && {fontWeight: '800'},
                accent && {color: '#F57C00'},
            ]}
        >
            {value}
        </Text>
    </View>
);

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'DELIVERED':
            return {color: '#4CAF50', backgroundColor: '#E7F9ED', icon: 'checkmark-circle-outline'};
        case 'PROCESSING':
            return {color: '#2E7D32', backgroundColor: '#E8F5E9', icon: 'sync-outline'};
        case 'SHIPPED':
            return {color: '#388E3C', backgroundColor: '#EAF8FB', icon: 'cube-outline'};
        case 'CANCELLED':
            return {color: '#D32F2F', backgroundColor: '#FEE2E2', icon: 'close-circle-outline'};
        default:
            return {color: '#F57C00', backgroundColor: '#FFF3E0', icon: 'time-outline'};
    }
};

/* Styles */
const s = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#FFFFFF', padding: 16},
    center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    loadingText: {color: '#757575', marginTop: 10},
    errorText: {color: '#9CA3AF', marginTop: 10},

    header: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20},
    headerTitle: {fontSize: 20, fontWeight: '800', color: '#2E7D32'},
    headerSub: {fontSize: 12, color: '#757575'},

    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    statusText: {fontWeight: '700', fontSize: 13, textTransform: 'capitalize'},

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    cardTitle: {fontSize: 15, fontWeight: '700', color: '#2E7D32', marginBottom: 4},
    cardLine: {
        height: 2,
        width: 45,
        backgroundColor: '#F57C00',
        borderRadius: 2,
        marginBottom: 10,
    },

    infoRow: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6},
    infoText: {color: '#212121', fontSize: 13},

    lineRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6},
    lineLabel: {color: '#757575', fontSize: 13},
    lineValue: {color: '#212121', fontSize: 13},
    divider: {height: 1, backgroundColor: '#EEEEEE', marginVertical: 8},

    itemBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 14,
        padding: 10,
        marginBottom: 8,
    },
    itemImg: {width: 60, height: 60, borderRadius: 10, marginRight: 10},
    itemName: {fontWeight: '600', color: '#212121', fontSize: 14},
    itemQty: {color: '#757575', fontSize: 12},
    itemPrice: {color: '#2E7D32', fontWeight: '700', fontSize: 13},

    timeline: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 12},
    timelineStep: {alignItems: 'center', flex: 1, position: 'relative'},
    timelineLine: {
        position: 'absolute',
        top: 9,
        left: '50%',
        right: '-50%',
        height: 2,
        zIndex: -1,
    },
    timelineIcon: {width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center'},
    timelineLabel: {marginTop: 6, fontSize: 11, textAlign: 'center', fontWeight: '600'},

    ctaBtn: {
        backgroundColor: '#F57C00',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingVertical: 14,
        gap: 8,
        shadowColor: '#F57C00',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        marginTop: 10,
    },
    ctaText: {color: '#FFFFFF', fontWeight: '700', fontSize: 15},
});
