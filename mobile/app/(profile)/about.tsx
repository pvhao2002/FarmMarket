import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AboutScreen() {
    const router = useRouter();

    return (
        <ScrollView style={s.container} contentContainerStyle={s.content}>
            {/* 🌿 Header */}
            <View style={s.header}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' }}
                    style={s.logo}
                />
                <Text style={s.title}>AgriMarket 🌾</Text>
                <Text style={s.subtitle}>Nơi kết nối nông sản và nhu yếu phẩm xanh sạch</Text>
            </View>

            {/* 💡 About Section */}
            <View style={s.card}>
                <Text style={s.sectionTitle}>💡 Giới thiệu về AgriMarket</Text>
                <Text style={s.paragraph}>
                    <Text style={s.bold}>AgriMarket</Text> là nền tảng thương mại điện tử nông nghiệp hiện đại,
                    giúp người dùng dễ dàng tìm mua các sản phẩm nông nghiệp chất lượng cao như
                    <Text style={s.bold}> phân bón, hạt giống, chậu trồng, đất trồng và dụng cụ làm vườn</Text>.
                    Ứng dụng hướng tới việc kết nối người tiêu dùng với nhà cung cấp uy tín, góp phần xây dựng
                    một nền nông nghiệp bền vững và xanh sạch.
                </Text>

                <View style={s.list}>
                    <Text style={s.item}>• Mua sắm phân bón, chậu cây, hạt giống chính hãng</Text>
                    <Text style={s.item}>• Theo dõi đơn hàng và trạng thái giao hàng dễ dàng</Text>
                    <Text style={s.item}>• Nhận tư vấn chăm sóc cây trồng và kỹ thuật nông nghiệp</Text>
                    <Text style={s.item}>• Giao hàng nhanh, đảm bảo chất lượng tận tay người mua</Text>
                </View>
            </View>

            {/* ⚙️ Tech Stack */}
            <View style={s.card}>
                <Text style={s.sectionTitle}>⚙️ Nền tảng công nghệ</Text>
                <View style={s.stackList}>
                    <View style={s.stackItem}>
                        <Ionicons name="logo-react" size={22} color="#2E7D32" />
                        <Text style={s.stackText}>React Native (Expo SDK 54)</Text>
                    </View>
                    <View style={s.stackItem}>
                        <Ionicons name="leaf-outline" size={22} color="#4CAF50" />
                        <Text style={s.stackText}>Spring Boot Backend</Text>
                    </View>
                    <View style={s.stackItem}>
                        <Ionicons name="server-outline" size={22} color="#388E3C" />
                        <Text style={s.stackText}>MySQL / PostgreSQL Database</Text>
                    </View>
                    <View style={s.stackItem}>
                        <Ionicons name="lock-closed-outline" size={22} color="#F57C00" />
                        <Text style={s.stackText}>JWT Bảo mật người dùng</Text>
                    </View>
                </View>
            </View>

            {/* 🌱 Sứ mệnh */}
            <View style={s.card}>
                <Text style={s.sectionTitle}>🌱 Sứ mệnh của chúng tôi</Text>
                <Text style={s.paragraph}>
                    <Text style={s.bold}>AgriMarket</Text> mong muốn mang đến cho người dân Việt Nam
                    một nền tảng nông nghiệp số hóa, giúp người nông dân tiêu thụ sản phẩm nhanh hơn,
                    đồng thời giúp người tiêu dùng tiếp cận dễ dàng với các vật tư nông nghiệp chất lượng cao.
                </Text>
            </View>

            {/* Footer */}
            <View style={s.footer}>
                <TouchableOpacity style={s.btn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={18} color="#fff" />
                    <Text style={s.btnText}>Quay lại</Text>
                </TouchableOpacity>
                <Text style={s.version}>v1.0.0 — Cùng bạn vun trồng tương lai xanh 🌿</Text>
            </View>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    content: { padding: 20, paddingBottom: 60 },

    /* Header */
    header: { alignItems: 'center', marginTop: 20, marginBottom: 24 },
    logo: { width: 90, height: 90, marginBottom: 10 },
    title: { fontSize: 26, fontWeight: '800', color: '#2E7D32', textAlign: 'center' },
    subtitle: { color: '#757575', textAlign: 'center', marginTop: 6, fontSize: 14 },

    /* Card */
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        marginBottom: 18,
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: '#2E7D32', marginBottom: 8 },
    paragraph: { color: '#212121', fontSize: 14, lineHeight: 20, marginBottom: 6 },
    bold: { fontWeight: '700', color: '#2E7D32' },

    list: { marginTop: 6 },
    item: { color: '#424242', marginBottom: 4, fontSize: 14 },

    /* Tech Stack */
    stackList: { marginTop: 8 },
    stackItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 10 },
    stackText: { color: '#212121', fontSize: 14, fontWeight: '500' },

    /* Footer */
    footer: { alignItems: 'center', marginTop: 10 },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F57C00',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        gap: 8,
    },
    btnText: { color: '#FFFFFF', fontWeight: '700' },
    version: { color: '#757575', fontSize: 12, marginTop: 8 },
});
