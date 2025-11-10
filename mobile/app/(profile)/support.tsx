import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SupportScreen() {
    const router = useRouter();
    const [expanded, setExpanded] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const faqs = [
        {
            q: 'Làm sao để theo dõi đơn hàng phân bón hoặc hạt giống?',
            a: 'Vào “Đơn hàng của tôi” → chọn đơn cần xem → nhấn “Theo dõi giao hàng” để xem trạng thái vận chuyển thực tế.',
        },
        {
            q: 'Nếu sản phẩm bị hư hỏng hoặc giao sai thì sao?',
            a: 'Bạn có thể liên hệ hỗ trợ trong vòng 3 ngày kể từ khi nhận hàng để được đổi hoặc hoàn tiền miễn phí.',
        },
        {
            q: 'Thanh toán online trên AgriMarket có an toàn không?',
            a: 'Chắc chắn rồi! Chúng tôi sử dụng cổng thanh toán bảo mật cao (VNPay, MoMo, Visa, MasterCard).',
        },
        {
            q: 'Tôi có thể đặt hàng mà không cần tài khoản không?',
            a: 'Bạn có thể mua nhanh bằng chế độ khách, nhưng để theo dõi đơn hàng dễ dàng hơn, hãy đăng ký tài khoản miễn phí.',
        },
        {
            q: 'AgriMarket có bán sản phẩm chính hãng không?',
            a: 'Tất cả sản phẩm đều được nhập trực tiếp từ nhà sản xuất hoặc nhà phân phối nông nghiệp uy tín.',
        },
        {
            q: 'Làm thế nào để nhận tư vấn kỹ thuật trồng cây?',
            a: 'Chọn “Tư vấn nông nghiệp” trên trang chủ để trò chuyện trực tuyến với chuyên viên kỹ thuật của chúng tôi.',
        },
        {
            q: 'Tôi có thể mua lại đơn hàng cũ không?',
            a: 'Có. Truy cập “Đơn hàng của tôi”, chọn đơn cũ và nhấn “Mua lại” để đặt hàng nhanh chóng.',
        },
    ];

    const handleSubmit = () => {
        if (!message.trim()) {
            Alert.alert('⚠️ Thiếu thông tin', 'Vui lòng nhập nội dung trước khi gửi.');
            return;
        }
        Alert.alert('🌿 Cảm ơn bạn!', 'Phản hồi của bạn đã được gửi đến đội ngũ AgriMarket.');
        setMessage('');
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#F5F7FA' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={s.header}>
                    <Ionicons name="leaf-outline" size={60} color="#2E7D32" />
                    <Text style={s.title}>Trung tâm hỗ trợ AgriMarket</Text>
                    <Text style={s.subtitle}>Chúng tôi luôn sẵn sàng giúp bạn 🌱</Text>
                </View>

                {/* Liên hệ */}
                <View style={s.card}>
                    <Text style={s.sectionTitle}>📞 Liên hệ với chúng tôi</Text>
                    <TouchableOpacity style={s.row} onPress={() => Linking.openURL('mailto:support@agrimarket.vn')}>
                        <Ionicons name="mail-outline" size={22} color="#2E7D32" />
                        <Text style={s.linkText}>support@agrimarket.vn</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={s.row} onPress={() => Linking.openURL('tel:+84901234567')}>
                        <Ionicons name="call-outline" size={22} color="#2E7D32" />
                        <Text style={s.linkText}>+84 901 234 567</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={s.row} onPress={() => Linking.openURL('https://www.agrimarket.vn')}>
                        <Ionicons name="globe-outline" size={22} color="#2E7D32" />
                        <Text style={s.linkText}>www.agrimarket.vn</Text>
                    </TouchableOpacity>
                </View>

                {/* FAQ */}
                <View style={s.card}>
                    <Text style={s.sectionTitle}>💬 Câu hỏi thường gặp</Text>
                    {faqs.map((item, index) => (
                        <View key={index} style={s.faqItem}>
                            <TouchableOpacity
                                style={s.faqHeader}
                                onPress={() => setExpanded(expanded === index ? null : index)}
                            >
                                <Text style={s.faqQuestion}>{item.q}</Text>
                                <Ionicons
                                    name={expanded === index ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color="#757575"
                                />
                            </TouchableOpacity>
                            {expanded === index && <Text style={s.faqAnswer}>{item.a}</Text>}
                        </View>
                    ))}
                </View>

                {/* Feedback */}
                <View style={s.card}>
                    <Text style={s.sectionTitle}>✉️ Gửi phản hồi</Text>
                    <Text style={s.paragraph}>
                        Nếu bạn gặp sự cố, có ý kiến đóng góp hoặc muốn chia sẻ ý tưởng mới — đừng ngần ngại gửi cho
                        chúng tôi! Mọi phản hồi đều giúp AgriMarket phục vụ tốt hơn.
                    </Text>
                    <TextInput
                        placeholder="Nhập nội dung của bạn tại đây..."
                        placeholderTextColor="#9E9E9E"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        style={s.input}
                    />
                    <TouchableOpacity style={s.btn} onPress={handleSubmit}>
                        <Ionicons name="send-outline" size={18} color="#fff" />
                        <Text style={s.btnText}>Gửi phản hồi</Text>
                    </TouchableOpacity>
                </View>

                {/* Back */}
                <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={18} color="#2E7D32" />
                    <Text style={s.backText}>Quay lại</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: { padding: 18, paddingBottom: 60 },

    header: { alignItems: 'center', marginTop: 12, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: '800', color: '#2E7D32', marginTop: 8 },
    subtitle: { color: '#757575', marginTop: 4, fontSize: 14 },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: '#2E7D32', marginBottom: 8 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
    linkText: { color: '#2E7D32', fontSize: 15, fontWeight: '500' },

    paragraph: { color: '#212121', marginBottom: 10, lineHeight: 20, fontSize: 14 },

    // FAQ
    faqItem: { borderTopWidth: 1, borderColor: '#EEEEEE', paddingVertical: 10 },
    faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    faqQuestion: { fontSize: 15, fontWeight: '600', color: '#212121', flex: 1, marginRight: 8 },
    faqAnswer: { color: '#757575', marginTop: 6, lineHeight: 20, fontSize: 14 },

    // Feedback
    input: {
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        padding: 12,
        textAlignVertical: 'top',
        minHeight: 100,
        marginTop: 8,
        marginBottom: 14,
        fontSize: 14,
        color: '#212121',
    },
    btn: {
        backgroundColor: '#F57C00',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 30,
        gap: 8,
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
    btnText: { color: '#FFFFFF', fontWeight: '700' },

    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 6,
    },
    backText: { color: '#2E7D32', fontWeight: '700' },
});
