import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { APP_CONFIG } from '@/constants/app-config';

export default function ChangePasswordScreen() {
    const { user, logout } = useAuthStore();
    const token = user?.token;

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('⚠️ Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('❌ Lỗi', 'Mật khẩu mới không khớp.');
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert('🔒 Mật khẩu yếu', 'Mật khẩu phải có ít nhất 8 ký tự.');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${APP_CONFIG.BASE_URL}/users/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            });

            const json = await res.json();
            if (!res.ok || json.success === false) {
                const errMsg = json.error?.message || json.message || 'Đổi mật khẩu thất bại.';
                throw new Error(errMsg);
            }

            Alert.alert('✅ Thành công', json.message || 'Mật khẩu đã được cập nhật.', [
                { text: 'OK', onPress: () => logout() },
            ]);
        } catch (err: any) {
            Alert.alert('❌ Lỗi', err.message || 'Không thể đổi mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
            {/* 🌱 Header */}
            <View style={s.header}>
                <Ionicons name="key-outline" size={56} color="#2E7D32" />
                <Text style={s.title}>Đổi mật khẩu</Text>
                <Text style={s.subtitle}>Giữ an toàn cho tài khoản của bạn 🌾</Text>
            </View>

            {/* 🔒 Form nhập liệu */}
            <View style={s.card}>
                <View style={s.inputBox}>
                    <Ionicons name="lock-closed-outline" size={20} color="#2E7D32" style={s.icon} />
                    <TextInput
                        style={s.input}
                        placeholder="Mật khẩu hiện tại"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                </View>

                <View style={s.inputBox}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#2E7D32" style={s.icon} />
                    <TextInput
                        style={s.input}
                        placeholder="Mật khẩu mới"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                <View style={s.inputBox}>
                    <Ionicons name="checkmark-done-outline" size={20} color="#2E7D32" style={s.icon} />
                    <TextInput
                        style={s.input}
                        placeholder="Xác nhận mật khẩu mới"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <View style={s.noteBox}>
                    <Ionicons name="information-circle-outline" size={18} color="#F57C00" />
                    <Text style={s.noteText}>
                        Mật khẩu nên gồm ít nhất 8 ký tự, có chữ và số để tăng độ bảo mật.
                    </Text>
                </View>

                <TouchableOpacity style={s.saveBtn} onPress={handleChangePassword} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="refresh-outline" size={20} color="#fff" />
                            <Text style={s.saveText}>Cập nhật mật khẩu</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* --- Styles --- */
const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },

    header: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: '800', color: '#2E7D32', marginTop: 10 },
    subtitle: { color: '#757575', fontSize: 14, textAlign: 'center', marginTop: 4 },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 40,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#EEEEEE',
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
    icon: { marginRight: 8 },
    input: { flex: 1, height: 44, fontSize: 15, color: '#212121' },

    noteBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFF8E1',
        borderRadius: 10,
        padding: 10,
        marginBottom: 16,
        gap: 6,
    },
    noteText: { color: '#757575', fontSize: 13, flex: 1, lineHeight: 18 },

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
    },
    saveText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
