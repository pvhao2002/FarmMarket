import React, {useEffect, useState, useCallback} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    Dimensions,
} from 'react-native';
import axios from 'axios';
import {Ionicons} from '@expo/vector-icons';
import {APP_CONFIG} from '@/constants/app-config';
import {useRouter} from 'expo-router';

const {width} = Dimensions.get('window');

interface Products {
    id: number;
    name: string;
    price: number;
    images: string[];
    category?: { id: number; name: string };
}

interface Category {
    id: number;
    name: string;
}

interface PagedResponse<T> {
    content: T[];
    page: number;
    totalPages: number;
}

export default function ProductScreen() {
    const router = useRouter();
    const [products, setProducts] = useState<Products[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');

    const loadAll = async (pageNum = 0, searchQuery = '') => {
        try {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                axios.get(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.PRODUCTS.BASE}`, {
                    params: {page: pageNum, size: 10, search: searchQuery || undefined},
                }),
                axios.get(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.CATEGORIES.BASE}`),
            ]);
            const prodData: PagedResponse<Products> = prodRes.data;
            setProducts(pageNum === 0 ? prodData.content : [...products, ...prodData.content]);
            setTotalPages(prodData.totalPages ?? 1);
            setPage(pageNum);
            setCategories(catRes.data ?? []);
        } catch (err) {
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadAll(0);
    }, []);

    const onRefresh = useCallback(() => {
        loadAll(0, search);
    }, [search]);

    const handleLoadMore = () => {
        if (!loading && page + 1 < totalPages) loadAll(page + 1, search);
    };

    const handleSearch = () => loadAll(0, search);

    const renderItem = ({item}: { item: Products }) => (
        <TouchableOpacity
            style={s.card}
            activeOpacity={0.9}
            onPress={() => router.push(`/(product)/${item.id}`)}
        >
            <Image
                source={{
                    uri: item.images?.[0] || `${APP_CONFIG.IMAGE_URL}/placeholder.jpg`,
                }}
                style={s.image}
            />
            <View style={s.info}>
                <Text style={s.name} numberOfLines={2}>{item.name}</Text>
                <Text style={s.category}>{item.category?.name ?? 'Không phân loại'}</Text>
                <Text style={s.price}>{item.price.toLocaleString('vi-VN')} ₫</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={s.container}>
            {/* 🌾 Banner */}
            <View style={s.bannerBox}>
                <Image source={require('@/assets/images/banner4.jpg')} style={s.bannerImage}/>
                <View style={s.bannerText}>
                    <Text style={s.bannerTitle}>Nông phẩm sạch cho mọi nhà</Text>
                    <Text style={s.bannerSub}>Phân bón, hạt giống & dụng cụ trồng trọt</Text>
                </View>
            </View>

            {/* 🌿 Header */}
            <View style={s.header}>
                <Text style={s.title}>Tất cả sản phẩm</Text>
                <TouchableOpacity onPress={onRefresh}>
                    <Ionicons name="refresh-outline" size={22} color="#2E7D32"/>
                </TouchableOpacity>
            </View>

            {/* 🔍 Search */}
            <View style={s.searchBox}>
                <Ionicons name="search-outline" size={20} color="#757575"/>
                <TextInput
                    style={s.searchInput}
                    placeholder="Tìm kiếm: phân bón, hạt giống, chậu trồng..."
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    placeholderTextColor="#9e9e9e"
                />
                {search !== '' && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Ionicons name="close-circle" size={20} color="#9e9e9e"/>
                    </TouchableOpacity>
                )}
            </View>

            {/* 🪴 Product grid */}
            {products.length === 0 && loading ? (
                <ActivityIndicator size="large" color="#2E7D32" style={{marginTop: 40}}/>
            ) : (
                <FlatList
                    data={products}
                    numColumns={2}
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{paddingHorizontal: 14, paddingBottom: 100}}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.3}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#2E7D32']}
                            tintColor="#2E7D32"
                        />
                    }
                    ListFooterComponent={
                        loading && products.length > 0 ? (
                            <ActivityIndicator size="small" color="#2E7D32" style={{marginVertical: 10}}/>
                        ) : null
                    }
                />
            )}
        </View>
    );
}

const s = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#FFFFFF'},

    bannerBox: {position: 'relative', height: 180, marginBottom: 8},
    bannerImage: {width: '100%', height: '100%', resizeMode: 'cover'},
    bannerText: {
        position: 'absolute',
        bottom: 16,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: 12,
        padding: 8,
    },
    bannerTitle: {color: '#fff', fontSize: 18, fontWeight: '700'},
    bannerSub: {color: '#E0F2F1', fontSize: 13, marginTop: 2},

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#F5F7FA',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    title: {fontSize: 20, fontWeight: '800', color: '#2E7D32'},

    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    searchInput: {flex: 1, marginLeft: 6, color: '#212121', fontSize: 15},

    card: {
        backgroundColor: '#fff',
        width: (width - 40) / 2,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    image: {
        width: '100%',
        height: 160,
        resizeMode: 'cover',
        backgroundColor: '#F5F7FA',
    },
    info: {padding: 10},
    name: {fontWeight: '600', fontSize: 14, color: '#212121'},
    category: {fontSize: 12, color: '#757575', marginTop: 2},
    price: {color: '#2E7D32', fontWeight: '700', marginTop: 6, fontSize: 15},
});
