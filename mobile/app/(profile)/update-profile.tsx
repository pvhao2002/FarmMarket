import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {APP_CONFIG} from '@/constants/app-config';

export default function UpdateProfileScreen() {
    const {user} = useAuthStore();
    const token = user?.token;
    const router = useRouter();

    const [form, setForm] = useState({fullName: '', phone: '', address: ''});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                router.replace('/login');
                return;
            }
            try {
                setLoading(true);
                const res = await fetch(`${APP_CONFIG.BASE_URL}/users/profile`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                const json = await res.json();

                if (!res.ok || json.success === false) {
                    const msg = json.error?.message || json.message || 'Không thể tải thông tin.';
                    throw new Error(msg);
                }

                const data = json.data ?? json;
                setForm({
                    fullName: data.fullName || '',
                    phone: data.phone || '',
                    address: data.address || '',
                });
            } catch (err: any) {
                Alert.alert('❌ Lỗi', err.message || 'Không thể tải thông tin hồ sơ.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${APP_CONFIG.BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const json = await res.json();
            if (!res.ok || json.success === false) {
                const errMsg = json.error?.message || json.message || 'Cập nhật thất bại.';
                throw new Error(errMsg);
            }

            Alert.alert('✅ Thành công', json.message || 'Hồ sơ đã được cập nhật.', [
                {text: 'OK', onPress: () => router.back()},
            ]);
        } catch (err: any) {
            Alert.alert('❌ Lỗi', err.message || 'Không thể lưu thông tin.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={s.loadingWrap}>
                <ActivityIndicator size="large" color="#2E7D32"/>
                <Text style={s.loadingText}>Đang tải thông tin của bạn...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: '#F5F7FA'}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
                {/* 🌱 Header */}
                <View style={s.header}>
                    <Ionicons name="leaf-outline" size={80} color="#2E7D32"/>
                    <Text style={s.title}>Cập nhật thông tin</Text>
                    <Text style={s.subtitle}>Giữ hồ sơ của bạn luôn chính xác 🌾</Text>
                </View>

                {/* 📋 Form */}
                <View style={s.card}>
                    <View style={s.inputBox}>
                        <Ionicons name="person-outline" size={20} color="#2E7D32" style={s.icon}/>
                        <TextInput
                            style={s.input}
                            placeholder="Họ và tên"
                            value={form.fullName}
                            onChangeText={(t) => setForm({...form, fullName: t})}
                        />
                    </View>

                    <View style={s.inputBox}>
                        <Ionicons name="call-outline" size={20} color="#2E7D32" style={s.icon}/>
                        <TextInput
                            style={s.input}
                            placeholder="Số điện thoại"
                            keyboardType="phone-pad"
                            value={form.phone}
                            onChangeText={(t) => setForm({...form, phone: t})}
                        />
                    </View>

                    <View style={[s.inputBox, {alignItems: 'flex-start', paddingVertical: 8}]}>
                        <Ionicons name="home-outline" size={20} color="#2E7D32" style={[s.icon, {marginTop: 6}]}/>
                        <TextInput
                            style={[s.input, {height: 70, textAlignVertical: 'top'}]}
                            placeholder="Địa chỉ đầy đủ"
                            multiline
                            value={form.address}
                            onChangeText={(t) => setForm({...form, address: t})}
                        />
                    </View>

                    <TouchableOpacity
                        style={s.saveBtn}
                        onPress={handleSave}
                        disabled={saving}
                        activeOpacity={0.85}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff"/>
                        ) : (
                            <>
                                <Ionicons name="save-outline" size={20} color="#fff"/>
                                <Text style={s.saveText}>Lưu thay đổi</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* 🔒 Ghi chú bảo mật */}
                <View style={s.footerNote}>
                    <Ionicons name="shield-checkmark-outline" size={18} color="#F57C00"/>
                    <Text style={s.footerText}>
                        Thông tin cá nhân của bạn được mã hóa và lưu trữ an toàn trong hệ thống AgriMarket.
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: {padding: 20, paddingBottom: 60},

    header: {alignItems: 'center', marginTop: 20, marginBottom: 18},
    title: {fontSize: 22, fontWeight: '800', color: '#2E7D32', marginTop: 6},
    subtitle: {color: '#757575', fontSize: 14, textAlign: 'center', marginTop: 4},

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 20,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
    },

    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 12,
        paddingHorizontal: 10,
        backgroundColor: '#F5F7FA',
        marginBottom: 14,
    },
    icon: {marginRight: 8},
    input: {flex: 1, height: 44, fontSize: 15, color: '#212121'},

    saveBtn: {
        backgroundColor: '#F57C00',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingVertical: 14,
        gap: 8,
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
        marginTop: 12,
    },
    saveText: {color: '#FFFFFF', fontWeight: '700', fontSize: 16},

    footerNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
        paddingHorizontal: 24,
        gap: 6,
    },
    footerText: {color: '#757575', fontSize: 13, lineHeight: 18, textAlign: 'center', flex: 1},

    loadingWrap: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA'},
    loadingText: {color: '#757575', marginTop: 10},
});
