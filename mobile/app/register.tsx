import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import axios from 'axios';
import { APP_CONFIG, ENV } from '@/constants/app-config';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const router = useRouter();
    const loginStore = useAuthStore((s) => s.login);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (k: string, v: string) => {
        setForm((prev) => ({ ...prev, [k]: v }));
    };

    const handleRegister = async () => {
        const { firstName, lastName, email, password } = form;
        if (!firstName || !lastName || !email || !password) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các trường bắt buộc.');
            return;
        }
        try {
            setLoading(true);
            const param = { ...form, fullName: `${form.firstName} ${form.lastName}` };
            const res = await axios.post(`${ENV.BASE_URL}${APP_CONFIG.API.AUTH.REGISTER}`, param);
            const data = res.data;
            if (data) {
                loginStore(data);
                Alert.alert('Thành công', 'Tài khoản đã được tạo thành công 🌿');
                router.replace('/(tabs)/profile');
            } else {
                Alert.alert('Lỗi', 'Không nhận được phản hồi hợp lệ từ máy chủ.');
            }
        } catch (err: any) {
            Alert.alert('Đăng ký thất bại', err.response?.data?.message || 'Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#FFFFFF' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={s.header}>
                    <Image
                        source={require('@/assets/images/banner4.jpg')}
                        style={s.image}
                        resizeMode="contain"
                    />
                    <Text style={s.headerTitle}>Tạo tài khoản của bạn</Text>
                    <Text style={s.headerSubtitle}>Tham gia cộng đồng nông nghiệp xanh 🌾</Text>
                </View>

                {/* Form */}
                <View style={s.formBox}>
                    <View style={s.row}>
                        <TextInput
                            placeholder="Họ"
                            style={s.inputHalf}
                            value={form.firstName}
                            onChangeText={(v) => handleChange('firstName', v)}
                            placeholderTextColor="#757575"
                        />
                        <TextInput
                            placeholder="Tên"
                            style={s.inputHalf}
                            value={form.lastName}
                            onChangeText={(v) => handleChange('lastName', v)}
                            placeholderTextColor="#757575"
                        />
                    </View>

                    <TextInput
                        placeholder="Email"
                        style={s.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.email}
                        onChangeText={(v) => handleChange('email', v)}
                        placeholderTextColor="#757575"
                    />

                    <TextInput
                        placeholder="Mật khẩu"
                        style={s.input}
                        secureTextEntry
                        value={form.password}
                        onChangeText={(v) => handleChange('password', v)}
                        placeholderTextColor="#757575"
                    />

                    <TextInput
                        placeholder="Số điện thoại"
                        style={s.input}
                        keyboardType="phone-pad"
                        value={form.phone}
                        onChangeText={(v) => handleChange('phone', v)}
                        placeholderTextColor="#757575"
                    />

                    <TextInput
                        placeholder="Địa chỉ"
                        style={s.input}
                        value={form.address}
                        onChangeText={(v) => handleChange('address', v)}
                        placeholderTextColor="#757575"
                    />

                    <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Đăng ký ngay</Text>}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text style={s.link}>
                        Đã có tài khoản? <Text style={s.linkAccent}>Đăng nhập</Text>
                    </Text>
                </TouchableOpacity>

                {/* Tip */}
                <View style={s.tipBox}>
                    <Text style={s.tipTitle}>💡 Mẹo nhỏ:</Text>
                    <Text style={s.tipText}>
                        Khi đăng ký, bạn sẽ nhận được thông tin khuyến mãi về hạt giống, chậu trồng và phân bón mỗi tháng!
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 28,
        backgroundColor: '#FFFFFF',
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    image: {
        width: 180,
        height: 180,
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#2E7D32', // Xanh Nông Nghiệp
    },
    headerSubtitle: {
        color: '#757575',
        fontSize: 15,
        marginTop: 4,
        textAlign: 'center',
    },
    formBox: {
        backgroundColor: '#F5F7FA', // Nền phụ
        borderRadius: 20,
        padding: 20,
        shadowColor: 'rgba(0, 0, 0, 0.08)', // Đổ bóng nhẹ
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    inputHalf: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#EEEEEE', // Viền xám nhạt
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
        fontSize: 15,
        color: '#212121',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
        fontSize: 15,
        color: '#212121',
        marginBottom: 16,
    },
    btn: {
        backgroundColor: '#F57C00', // Cam Đất CTA
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: 'rgba(0,0,0,0.15)',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
    },
    btnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
    link: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        color: '#212121',
    },
    linkAccent: {
        color: '#2E7D32', // Xanh chủ đạo
        fontWeight: '700',
    },
    tipBox: {
        backgroundColor: '#E8F5E9',
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
        marginTop: 30,
        padding: 12,
        borderRadius: 8,
    },
    tipTitle: {
        color: '#2E7D32',
        fontWeight: '700',
        marginBottom: 4,
    },
    tipText: {
        color: '#424242',
        fontSize: 13.5,
        lineHeight: 20,
    },
});
