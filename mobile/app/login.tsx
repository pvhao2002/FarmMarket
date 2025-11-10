import React, {useState} from 'react';
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
    Image
} from 'react-native';
import axios from 'axios';
import {APP_CONFIG} from '@/constants/app-config';
import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();
    const loginStore = useAuthStore((s) => s.login);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin đăng nhập.');
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.AUTH.LOGIN}`, {
                email,
                password,
            });
            const data = res.data;
            if (data) {
                loginStore(data);
                Alert.alert('Thành công', 'Chào mừng bạn quay lại 🌱');
                router.replace('/(tabs)/profile');
            } else Alert.alert('Lỗi', 'Không nhận được phản hồi hợp lệ từ máy chủ.');
        } catch (err: any) {
            Alert.alert('Đăng nhập thất bại', err.response?.data?.message || 'Kiểm tra lại thông tin đăng nhập.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: '#FFFFFF'}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
                <View style={s.header}>
                    <Image
                        source={require('@/assets/images/banner2.jpg')}
                        style={s.image}
                        resizeMode="contain"
                    />
                    <Text style={s.title}>Đăng nhập hệ thống</Text>
                    <Text style={s.subtitle}>Hành trình nông nghiệp bền vững của bạn bắt đầu tại đây 🌾</Text>
                </View>

                {/* Form */}
                <View style={s.form}>
                    <TextInput
                        placeholder="Email"
                        style={s.input}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        placeholderTextColor="#757575"
                    />
                    <TextInput
                        placeholder="Mật khẩu"
                        style={s.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#757575"
                    />

                    <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff"/> : <Text style={s.btnText}>Đăng nhập</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={s.link}>
                            Chưa có tài khoản? <Text style={s.linkAccent}>Đăng ký ngay</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tip section */}
                <View style={s.tipBox}>
                    <Text style={s.tipTitle}>💡 Mẹo nhỏ:</Text>
                    <Text style={s.tipText}>
                        Hãy đăng nhập để quản lý đơn hàng, theo dõi mùa vụ và nhận ưu đãi phân bón mỗi tháng!
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
        alignItems: 'center',
        marginBottom: 24,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#2E7D32', // Xanh Nông Nghiệp
    },
    subtitle: {
        color: '#757575',
        fontSize: 15,
        marginTop: 4,
        textAlign: 'center',
    },
    form: {
        backgroundColor: '#F5F7FA', // nền phụ
        borderRadius: 20,
        padding: 20,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.2,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 6,
        elevation: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#EEEEEE', // đường viền
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        marginBottom: 16,
        color: '#212121', // văn bản chính
        backgroundColor: '#FFFFFF',
    },
    btn: {
        backgroundColor: '#F57C00', // Cam đất CTA
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: 'rgba(0,0,0,0.15)',
        shadowOpacity: 0.4,
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 5,
    },
    btnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
    link: {
        textAlign: 'center',
        marginTop: 10,
        color: '#212121',
        fontSize: 14,
    },
    linkAccent: {
        color: '#2E7D32',
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
