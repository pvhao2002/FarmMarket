import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { APP_CONFIG } from '@/constants/app-config';
import { useCartStore } from '@/store/cartStore';

const { width, height } = Dimensions.get('window');

interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    images: string[];
    stock?: number;
    category?: { id: number; name: string };
}

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomIndex, setZoomIndex] = useState(0);
    const [cartMessage, setCartMessage] = useState<string | null>(null);

    const flatListRef = useRef<FlatList>(null);
    const addToCart = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        if (product && (!product.stock || product.stock <= 0)) {
            setCartMessage('⚠️ Sản phẩm tạm hết hàng.');
            return;
        }

        const cartItem = {
            medicineId: product!.id,
            name: product!.name,
            price: product!.price,
            image: product!.images?.[0],
            quantity: 1,
        };

        addToCart(cartItem);
        setCartMessage('✅ Đã thêm vào giỏ hàng!');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${APP_CONFIG.BASE_URL}${APP_CONFIG.API.PRODUCTS.BASE}/${id}`
                );
                setProduct(res.data);
            } catch (err) {
                console.error('Error loading product:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (cartMessage) {
            const timer = setTimeout(() => setCartMessage(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [cartMessage]);

    const handleScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    if (loading) {
        return (
            <View style={s.center}>
                <ActivityIndicator size="large" color="#2E7D32" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={s.center}>
                <Text style={{ color: '#757575' }}>Không tìm thấy sản phẩm</Text>
            </View>
        );
    }

    return (
        <View style={s.safe}>
            <ScrollView
                style={s.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* 🌾 Hình ảnh sản phẩm */}
                <View style={s.carouselContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={product.images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {
                                    setZoomIndex(index);
                                    setShowZoom(true);
                                }}
                            >
                                <Image source={{ uri: item }} style={s.imageSlide} />
                            </TouchableOpacity>
                        )}
                    />
                    <View style={s.indicatorContainer}>
                        {product.images.map((_, i) => (
                            <View key={i} style={[s.dot, activeIndex === i && s.dotActive]} />
                        ))}
                    </View>
                </View>

                {/* 🧾 Thông báo thêm giỏ */}
                {cartMessage && (
                    <View style={[
                        s.toastBox,
                        cartMessage.includes('✅')
                            ? { backgroundColor: '#4CAF50' }
                            : { backgroundColor: '#FFA000' }
                    ]}>
                        <Text style={s.toastText}>{cartMessage}</Text>
                    </View>
                )}

                {/* 🍃 Thông tin sản phẩm */}
                <View style={s.infoCard}>
                    <Text style={s.name}>{product.name}</Text>
                    {product.category?.name && (
                        <Text style={s.category}>{product.category.name}</Text>
                    )}
                    <Text style={s.price}>{product.price.toLocaleString('vi-VN')} ₫</Text>

                    {product.stock !== undefined && (
                        <Text
                            style={[
                                s.stockText,
                                product.stock < 3 && { color: '#FFA000' },
                            ]}
                        >
                            Còn lại: {product.stock} sản phẩm
                        </Text>
                    )}

                    <View style={s.line} />
                    <Text style={s.descTitle}>Mô tả sản phẩm</Text>
                    <Text style={s.desc}>
                        {product.description || 'Chưa có mô tả chi tiết.'}
                    </Text>
                </View>
            </ScrollView>

            {/* 🛒 Thanh hành động cố định */}
            <View style={s.bottomBar}>
                <TouchableOpacity style={s.cartBtn} onPress={handleAddToCart}>
                    <Ionicons name="cart-outline" size={22} color="#fff" />
                    <Text style={s.cartText}>Thêm vào giỏ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={s.buyBtn}>
                    <Ionicons name="leaf-outline" size={22} color="#fff" />
                    <Text style={s.buyText}>Mua ngay</Text>
                </TouchableOpacity>
            </View>

            {/* 🔍 Zoom hình */}
            <Modal visible={showZoom} transparent animationType="fade">
                <View style={s.zoomBackdrop}>
                    <FlatList
                        data={product.images}
                        horizontal
                        pagingEnabled
                        initialScrollIndex={zoomIndex}
                        getItemLayout={(_, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Pressable style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={{ uri: item }} style={s.zoomImage} resizeMode="contain" />
                            </Pressable>
                        )}
                    />
                    <TouchableOpacity style={s.closeZoom} onPress={() => setShowZoom(false)}>
                        <Ionicons name="close-circle" size={40} color="#fff" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

/* --- Styles --- */
const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    /* --- Carousel --- */
    carouselContainer: { position: 'relative' },
    imageSlide: { width, height: 340, resizeMode: 'cover' },
    indicatorContainer: {
        position: 'absolute',
        bottom: 12,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: '#EEEEEE',
    },
    dotActive: { backgroundColor: '#2E7D32' },

    /* --- Product Info --- */
    infoCard: {
        backgroundColor: '#F5F7FA',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        padding: 18,
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
        borderTopWidth: 1,
        borderColor: '#EEEEEE',
    },
    name: { fontSize: 22, fontWeight: '800', color: '#212121' },
    category: { color: '#757575', marginTop: 4, fontStyle: 'italic' },
    price: { color: '#2E7D32', fontWeight: '800', fontSize: 20, marginTop: 8 },
    stockText: { color: '#4CAF50', fontSize: 13, marginTop: 6 },

    line: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 14 },
    descTitle: { fontWeight: '700', fontSize: 16, color: '#212121' },
    desc: { color: '#757575', marginTop: 6, lineHeight: 20, fontSize: 14 },

    /* --- Toast --- */
    toastBox: {
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        zIndex: 10,
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    toastText: { color: '#FFFFFF', fontWeight: '700' },

    /* --- Bottom Bar --- */
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        elevation: 12,
    },
    cartBtn: {
        flex: 1,
        backgroundColor: '#2E7D32',
        borderRadius: 30,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    cartText: { color: '#FFFFFF', fontWeight: '700', marginLeft: 6 },
    buyBtn: {
        flex: 1,
        backgroundColor: '#F57C00',
        borderRadius: 30,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyText: { color: '#FFFFFF', fontWeight: '700', marginLeft: 6 },

    /* --- Zoom --- */
    zoomBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    zoomImage: { width, height: height * 0.85 },
    closeZoom: { position: 'absolute', top: 50, right: 20 },
});
