import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, StyleSheet } from 'react-native';
import React from 'react';

export default function TabsLayout() {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#2E7D32', // Xanh nông nghiệp
                    tabBarInactiveTintColor: '#757575', // Xám vừa
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '600',
                        marginBottom: Platform.OS === 'ios' ? 4 : 6,
                    },
                    tabBarStyle: {
                        position: 'absolute',
                        left: 16,
                        right: 16,
                        bottom: Platform.OS === 'ios' ? 20 : 14,
                        borderRadius: 26,
                        height: 68,
                        backgroundColor: '#FFFFFF',
                        borderTopWidth: 0,
                        paddingTop: 4,
                        shadowColor: 'rgba(0,0,0,0.08)',
                        shadowOpacity: 0.6,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 5,
                    },
                }}
            >
                {/* 🌿 Trang chủ */}
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Trang chủ',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home-outline" size={size + 1} color={color} />
                        ),
                    }}
                />

                {/* 🌾 Sản phẩm */}
                <Tabs.Screen
                    name="products"
                    options={{
                        title: 'Sản phẩm',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="leaf-outline" size={size + 1} color={color} />
                        ),
                    }}
                />

                {/* 🛒 Giỏ hàng nổi bật */}
                <Tabs.Screen
                    name="cart"
                    options={{
                        title: '',
                        tabBarIcon: ({ focused }) => (
                            <View style={[styles.cartButton, focused && styles.cartButtonActive]}>
                                <Ionicons
                                    name="cart-outline"
                                    size={28}
                                    color="#FFFFFF"
                                />
                            </View>
                        ),
                    }}
                />

                {/* 📦 Đơn hàng */}
                <Tabs.Screen
                    name="orders"
                    options={{
                        title: 'Đơn hàng',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="cube-outline" size={size + 1} color={color} />
                        ),
                    }}
                />

                {/* 👤 Hồ sơ */}
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Tài khoản',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person-circle-outline" size={size + 1} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FA', // Nền phụ tự nhiên
    },
    cartButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F57C00', // Cam đất CTA
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#F57C00',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
        marginBottom: 24,
        transform: [{ scale: 1 }],
        transitionDuration: '150ms',
    },
    cartButtonActive: {
        backgroundColor: '#2E7D32', // Khi focus: chuyển sang xanh nông nghiệp
        shadowColor: '#2E7D32',
    },
});
