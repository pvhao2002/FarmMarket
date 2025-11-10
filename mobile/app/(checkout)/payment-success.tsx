import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PaymentSuccessScreen() {
    const { orderId, status, method } = useLocalSearchParams();
    const router = useRouter();
    const [displayStatus, setDisplayStatus] = useState<'pending' | 'success' | 'fail'>('pending');

    useEffect(() => {
        if (status === 'success') setDisplayStatus('success');
        else if (status === 'fail') setDisplayStatus('fail');
        else setDisplayStatus('pending');
    }, [status]);

    if (displayStatus === 'pending') {
        return (
            <View style={s.container}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={s.loadingText}>Đang xử lý thanh toán...</Text>
            </View>
        );
    }

    const isSuccess = displayStatus === 'success';

    return (
        <View style={s.container}>
            <View style={s.card}>
                <Image
                    source={
                        isSuccess
                            ? require('@/assets/images/payment-success.png')
                            : require('@/assets/images/payment-fail.png')
                    }
                    style={s.image}
                />

                <Text style={[s.title, { color: isSuccess ? '#2E7D32' : '#D32F2F' }]}>
                    {isSuccess ? '🎉 Thanh toán thành công!' : '❌ Thanh toán thất bại'}
                </Text>

                <Text style={s.text}>Mã đơn hàng: #{orderId}</Text>
                <Text style={s.text}>
                    Phương thức: {String(method || '').toUpperCase() || '—'}
                </Text>

                {isSuccess ? (
                    <>
                        <Text style={s.note}>
                            Cảm ơn bạn đã mua sắm tại <Text style={{ fontWeight: '700' }}>AgriMarket</Text> 🌿
                        </Text>
                        <TouchableOpacity
                            style={[s.btn, { backgroundColor: '#2E7D32' }]}
                            onPress={() => router.replace('/(tabs)/history')}
                        >
                            <Text style={s.btnText}>Xem đơn hàng của tôi</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={[s.note, { color: '#757575' }]}>
                            Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức khác.
                        </Text>
                        <TouchableOpacity
                            style={[s.btn, { backgroundColor: '#F57C00' }]}
                            onPress={() => router.replace('/checkout')}
                        >
                            <Text style={s.btnText}>Thử thanh toán lại</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    card: {
        backgroundColor: '#F5F7FA',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        width: '100%',
        maxWidth: 360,
    },
    image: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
    },
    text: {
        fontSize: 15,
        color: '#212121',
        textAlign: 'center',
        marginBottom: 4,
    },
    note: {
        fontSize: 14,
        color: '#4B5563',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
        lineHeight: 20,
    },
    btn: {
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 30,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    btnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#757575',
        fontSize: 15,
    },
});
