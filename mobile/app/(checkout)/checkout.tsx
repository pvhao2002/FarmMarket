import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { APP_CONFIG } from "@/constants/app-config";
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function CheckoutScreen() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const token = user?.token;
    const { items, clearCart } = useCartStore();

    const totalPrice = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY'>('COD');
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                router.replace('/login');
                return;
            }
            try {
                setLoadingProfile(true);
                const res = await fetch(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.AUTH.PROFILE}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data) {
                    setPhone(data.phone || '');
                    setAddress(data.address || '');
                }
            } catch {
                Alert.alert('⚠️', 'Không thể tải hồ sơ người dùng, vui lòng đăng nhập lại.');
                router.replace('/login');
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleCheckout = async () => {
        if (!address || !phone) {
            Alert.alert('⚠️ Thiếu thông tin', 'Vui lòng nhập đầy đủ địa chỉ và số điện thoại.');
            return;
        }

        const requestBody = {
            items: items.map((it) => ({
                medicineId: it.medicineId,
                quantity: it.quantity,
            })),
            shippingAddress: address,
            paymentMethod,
            phone,
        };

        try {
            setLoading(true);
            const res = await fetch(`${APP_CONFIG.BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();

            if (paymentMethod === 'VNPAY') {
                const redirectUrl = Linking.createURL('payment/success', {
                    queryParams: { method: paymentMethod, orderId: data.id.toString() },
                });

                const paymentReq = {
                    orderId: data.id,
                    amount: data.total,
                    paymentMethod: 'VNPAY',
                };

                const payRes = await fetch(`${APP_CONFIG.BASE_URL}/payment/process`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(paymentReq),
                });

                const json = await payRes.json();
                if (!payRes.ok || !json.data?.paymentUrl)
                    throw new Error(json.message || 'Tạo thanh toán thất bại');

                const result = await WebBrowser.openAuthSessionAsync(json.data.paymentUrl, redirectUrl);
                if (result.type === 'success') {
                    clearCart();
                    router.replace({
                        pathname: '/payment-success',
                        params: { orderId: data.id, rsStatus: 'success', method: 'VNPAY' },
                    });
                } else {
                    await fetch(`${APP_CONFIG.BASE_URL}/payment/cancel/${data.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    router.replace({
                        pathname: '/payment-success',
                        params: { orderId: data.id, rsStatus: 'fail', method: 'VNPAY' },
                    });
                }
            } else {
                clearCart();
                Alert.alert('✅ Thành công', 'Đơn hàng của bạn đã được đặt thành công!', [
                    { text: 'OK', onPress: () => router.replace('/(tabs)/history') },
                ]);
            }
        } catch (err: any) {
            Alert.alert('❌ Lỗi', err.message || 'Không thể tạo đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    if (loadingProfile) {
        return (
            <View style={[s.container, s.center]}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={{ marginTop: 10, color: '#757575' }}>Đang tải thông tin người dùng...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
            <Text style={s.title}>🧾 Thanh toán đơn hàng</Text>

            {/* 🚚 Thông tin giao hàng */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>Thông tin giao hàng</Text>
                <TextInput
                    placeholder="Địa chỉ giao hàng"
                    value={address}
                    onChangeText={setAddress}
                    style={s.input}
                />
                <TextInput
                    placeholder="Số điện thoại"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    style={s.input}
                />
            </View>

            {/* 💳 Phương thức thanh toán */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>Phương thức thanh toán</Text>
                {['COD', 'VNPAY'].map((method) => (
                    <TouchableOpacity
                        key={method}
                        style={[s.payOption, paymentMethod === method && s.paySelected]}
                        onPress={() => setPaymentMethod(method as any)}
                    >
                        <Ionicons
                            name={paymentMethod === method ? 'radio-button-on' : 'radio-button-off'}
                            size={22}
                            color={paymentMethod === method ? '#2E7D32' : '#9CA3AF'}
                        />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={s.payLabel}>
                                {method === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán qua VNPay'}
                            </Text>
                            <Text style={s.payDesc}>
                                {method === 'COD'
                                    ? 'Bạn sẽ trả tiền mặt khi nhận hàng'
                                    : 'Thanh toán an toàn qua cổng VNPay'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 📦 Tóm tắt đơn hàng */}
            <View style={s.summaryBox}>
                <Text style={s.summaryTitle}>Tóm tắt đơn hàng</Text>
                {items.map((it, i) => (
                    <View key={i} style={s.orderRow}>
                        <Text style={s.orderName}>{it.name} × {it.quantity}</Text>
                        <Text style={s.orderPrice}>{(it.price * it.quantity).toLocaleString('vi-VN')} ₫</Text>
                    </View>
                ))}
                <View style={s.divider} />
                <View style={s.orderRow}>
                    <Text style={s.orderTotalLabel}>Tổng cộng</Text>
                    <Text style={s.orderTotalValue}>{totalPrice.toLocaleString('vi-VN')} ₫</Text>
                </View>
            </View>

            {/* 🌾 Nút Đặt hàng */}
            <TouchableOpacity
                style={[s.checkoutBtn, loading && { opacity: 0.7 }]}
                onPress={handleCheckout}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Ionicons name="bag-check-outline" size={22} color="#fff" />
                        <Text style={s.checkoutText}>Đặt hàng ngay</Text>
                    </>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
    center: { justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: '800', color: '#2E7D32', marginBottom: 20 },
    section: { marginBottom: 26 },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: '#212121', marginBottom: 10 },

    input: {
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#F5F7FA',
        color: '#212121',
    },

    payOption: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
    },
    paySelected: { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' },
    payLabel: { fontWeight: '600', color: '#212121' },
    payDesc: { fontSize: 13, color: '#757575', marginTop: 2 },

    summaryBox: {
        backgroundColor: '#F5F7FA',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    summaryTitle: { fontSize: 17, fontWeight: '700', color: '#2E7D32', marginBottom: 10 },

    orderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    orderName: { fontSize: 14, color: '#212121', flex: 1 },
    orderPrice: { fontWeight: '600', color: '#4CAF50' },
    divider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 10 },
    orderTotalLabel: { fontWeight: '700', color: '#212121', fontSize: 16 },
    orderTotalValue: { fontWeight: '800', color: '#2E7D32', fontSize: 18 },

    checkoutBtn: {
        backgroundColor: '#F57C00',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingVertical: 14,
        marginTop: 30,
        gap: 8,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    checkoutText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
