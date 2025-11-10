import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { APP_CONFIG } from '@/constants/app-config';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const token = user?.token;

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const menuItems = [
        { icon: 'leaf-outline', label: 'Đơn hàng của tôi', action: () => router.push('/history') },
        { icon: 'cart-outline', label: 'Giỏ hàng', action: () => router.push('/cart') },
        { icon: 'person-outline', label: 'Cập nhật hồ sơ', action: () => router.push('/update-profile') },
        { icon: 'lock-closed-outline', label: 'Đổi mật khẩu', action: () => router.push('/change-password') },
        { icon: 'help-circle-outline', label: 'Trung tâm hỗ trợ', action: () => router.push('/support') },
        { icon: 'information-circle-outline', label: 'Về ứng dụng', action: () => router.push('/about') },
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                router.replace('/login');
                return;
            }
            try {
                setLoading(true);
                const res = await fetch(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.AUTH.PROFILE}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const json = await res.json();
                if (!res.ok || json.success === false) throw new Error(json.message);
                setProfile(json.data ?? json);
            } catch (err: any) {
                Alert.alert('Lỗi', err.message || 'Không thể tải thông tin người dùng');
                if (err.message?.includes('Unauthorized')) router.replace('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    if (loading) {
        return (
            <View style={s.loadingWrap}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={s.loadingText}>Đang tải hồ sơ của bạn...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={s.guestWrap}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7077/7077311.png' }}
                    style={s.guestImg}
                />
                <Text style={s.guestTitle}>Chào mừng bạn đến với AgriMarket 🌿</Text>
                <Text style={s.guestText}>
                    Hãy đăng nhập để quản lý đơn hàng, tích điểm và nhận ưu đãi nông nghiệp xanh.
                </Text>
                <TouchableOpacity style={s.primaryBtn} onPress={() => router.push('/login')}>
                    <Text style={s.primaryText}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.secondaryBtn} onPress={() => router.push('/register')}>
                    <Text style={s.secondaryText}>Đăng ký</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
            {/* 🌾 Header Card */}
            <View style={s.headerCard}>
                <Image
                    source={{
                        uri: profile?.avatar || 'https://cdn-icons-png.flaticon.com/512/219/219983.png',
                    }}
                    style={s.avatar}
                />
                <Text style={s.name}>{profile?.fullName}</Text>
                <Text style={s.email}>{profile?.email}</Text>
                {profile?.phone && <Text style={s.phone}>📞 {profile.phone}</Text>}
            </View>

            {/* 🌱 Quick Stats */}
            <View style={s.statsRow}>
                <View style={s.statBox}>
                    <Text style={s.statNumber}>{profile?.orderCount ?? 0}</Text>
                    <Text style={s.statLabel}>Đơn hàng</Text>
                </View>
                <View style={s.statBox}>
                    <Text style={s.statNumber}>{profile?.points ?? 0}</Text>
                    <Text style={s.statLabel}>Điểm thưởng</Text>
                </View>
                <View style={s.statBox}>
                    <Text style={s.statNumber}>{profile?.wishlistCount ?? 0}</Text>
                    <Text style={s.statLabel}>Yêu thích</Text>
                </View>
            </View>

            {/* 🍀 Menu */}
            <View style={s.menuSection}>
                {menuItems.map((item, i) => (
                    <TouchableOpacity key={i} style={s.menuItem} onPress={item.action}>
                        <View style={s.menuLeft}>
                            <Ionicons name={item.icon as any} size={22} color="#2E7D32" />
                            <Text style={s.menuText}>{item.label}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* 🚪 Logout */}
            <TouchableOpacity style={s.logoutBtn} onPress={logout}>
                <Ionicons name="log-out-outline" size={18} color="#fff" />
                <Text style={s.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    loadingText: { marginTop: 10, color: '#757575' },

    headerCard: {
        backgroundColor: '#2E7D32',
        paddingVertical: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
        marginBottom: 12,
    },
    name: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
    email: { color: '#E0F2F1', fontSize: 14 },
    phone: { color: '#E0F2F1', marginTop: 4 },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 18,
        marginTop: -30,
        paddingVertical: 14,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 3,
    },
    statBox: { alignItems: 'center' },
    statNumber: { fontSize: 18, fontWeight: '700', color: '#2E7D32' },
    statLabel: { color: '#757575', fontSize: 13 },

    menuSection: {
        backgroundColor: '#FFFFFF',
        marginTop: 20,
        marginHorizontal: 18,
        borderRadius: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
    },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    menuText: { fontSize: 15, fontWeight: '500', color: '#212121' },

    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F57C00',
        paddingVertical: 12,
        borderRadius: 30,
        marginTop: 30,
        marginHorizontal: 60,
        gap: 6,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
    },
    logoutText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },

    guestWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    guestImg: { width: 120, height: 120, marginBottom: 16 },
    guestTitle: { fontSize: 20, fontWeight: '700', color: '#2E7D32', textAlign: 'center' },
    guestText: { color: '#757575', textAlign: 'center', marginVertical: 12, lineHeight: 20 },

    primaryBtn: {
        backgroundColor: '#2E7D32',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 40,
        marginTop: 10,
    },
    primaryText: { color: '#FFFFFF', fontWeight: '700' },
    secondaryBtn: {
        borderWidth: 1,
        borderColor: '#F57C00',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 40,
        marginTop: 10,
    },
    secondaryText: { color: '#F57C00', fontWeight: '600' },
});
