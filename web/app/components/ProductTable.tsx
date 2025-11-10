'use client';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import apiClient from '@/api/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import Modal from './Modal';
import ProductForm, { ProductResponseCreate } from './ProductForm';
import ImageModal from './ImageModal';
import './ProductTable.css';

interface Product {
    id: number;
    name: string;
    description?: string;
    manufacturer?: string;
    price: number;
    images?: string[];
    category?: { id: number; name: string };
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    stock?: number;
}

export default function ProductTable() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [editItem, setEditItem] = useState<Product | null>(null);
    const [showImages, setShowImages] = useState<string[] | null>(null);
    const [propProduct, setPropProduct] = useState<ProductResponseCreate | null>(null);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadProducts = useCallback(async (pageNum = 0) => {
        setLoading(true);
        try {
            const res = await apiClient.get<PagedResponse<ProductResponse>>(API_ENDPOINTS.PRODUCTS.BASE, {
                params: { page: pageNum, size },
            });
            const data = res.data;

            setProducts(data.content ?? []);
            setFiltered(data.content ?? []);
            setPage(data.page ?? 0);
            setTotalPages(data.totalPages ?? 1);
        } catch (err) {
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    }, [size]);

    useEffect(() => {
        loadProducts(page);
    }, [page, loadProducts]);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value.toLowerCase();
        setSearch(keyword);
        setFiltered(
            products.filter(
                (p) =>
                    p.name.toLowerCase().includes(keyword) ||
                    p.category?.name?.toLowerCase().includes(keyword)
            )
        );
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        await apiClient.delete(`${API_ENDPOINTS.PRODUCTS.ADMIN}/${id}`);
        await loadProducts(page);
    };

    const handleSuccess = async () => {
        setOpenModal(false);
        setEditItem(null);
        await loadProducts(page);
    };

    return (
        <div className="agri-product-wrapper">
            {/* ===== Toolbar ===== */}
            <div className="agri-toolbar">
                <div className="agri-toolbar-left">
                    <h2>🪴 Quản lý sản phẩm nông nghiệp</h2>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm hoặc danh mục..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <button
                    className="add-btn"
                    onClick={() => {
                        setEditItem(null);
                        setOpenModal(true);
                    }}
                >
                    + Thêm sản phẩm
                </button>
            </div>

            {/* ===== Table ===== */}
            {loading ? (
                <div className="loading">Đang tải dữ liệu...</div>
            ) : (
                <>
                    <div className="agri-table-container">
                        <table className="agri-table">
                            <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Danh mục</th>
                                <th>Giá</th>
                                <th>Tồn kho</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="no-data text-center">
                                        Không tìm thấy sản phẩm.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            {p.images?.length ? (
                                                <img
                                                    src={p.images[0]}
                                                    alt={p.name}
                                                    className="thumb"
                                                    onClick={() => setShowImages(p.images!)}
                                                />
                                            ) : (
                                                <span className="no-img">Chưa có ảnh</span>
                                            )}
                                        </td>
                                        <td>{p.name}</td>
                                        <td>{p.category?.name ?? '-'}</td>
                                        <td>{p.price.toLocaleString('vi-VN')} ₫</td>
                                        <td>{p.stock ?? 0}</td>
                                        <td>
                                                <span
                                                    className={
                                                        p.isActive
                                                            ? 'status-active'
                                                            : 'status-inactive'
                                                    }
                                                >
                                                    {p.isActive ? 'Đang bán' : 'Ngưng bán'}
                                                </span>
                                        </td>
                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => {
                                                    setEditItem(p);
                                                    setOpenModal(true);
                                                    const productResponseCreate: ProductResponseCreate =
                                                        {
                                                            categoryId: p.category?.id ?? 0,
                                                            category: {
                                                                cid: p.category?.id ?? 0,
                                                                name:
                                                                    p.category?.name ?? '',
                                                            },
                                                            createdAt: p.createdAt,
                                                            description: p.description,
                                                            id: p.id,
                                                            images: p?.images ?? [],
                                                            isActive: p.isActive,
                                                            name: p.name,
                                                            price: p.price,
                                                            stock: p?.stock ?? 0,
                                                            updatedAt: p.updatedAt,
                                                        };
                                                    setPropProduct(productResponseCreate);
                                                }}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* ===== Pagination ===== */}
                    <div className="pagination">
                        <button
                            className="page-btn"
                            disabled={page <= 0}
                            onClick={() => setPage(page - 1)}
                        >
                            ← Trước
                        </button>
                        <span className="page-info">
                            Trang {page + 1} / {totalPages}
                        </span>
                        <button
                            className="page-btn"
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Tiếp →
                        </button>
                    </div>
                </>
            )}

            {/* ===== Modals ===== */}
            <Modal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditItem(null);
                }}
                title={editItem ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
            >
                <ProductForm
                    product={editItem ? propProduct : null}
                    onSuccess={handleSuccess}
                    onCancel={() => setOpenModal(false)}
                />
            </Modal>

            {showImages && (
                <ImageModal open images={showImages} onClose={() => setShowImages(null)} />
            )}
        </div>
    );
}
