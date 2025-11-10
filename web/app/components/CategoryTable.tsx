'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/api/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import Modal from './Modal';
import CategoryForm from './CategoryForm';
import './CategoryTable.css';

export default function CategoryTable() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editItem, setEditItem] = useState<Category | null>(null);

    const loadCategories = async () => {
        const res = await apiClient.get(API_ENDPOINTS.CATEGORIES.BASE);
        setCategories(res.data);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
        await apiClient.delete(`${API_ENDPOINTS.CATEGORIES.ADMIN}/${id}`);
        await loadCategories();
    };

    const handleSuccess = async () => {
        setOpenModal(false);
        setEditItem(null);
        await loadCategories();
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <div className="agri-category-wrapper">
            {/* ===== Toolbar ===== */}
            <div className="agri-toolbar">
                <div>
                    <h2>🌱 Quản lý danh mục sản phẩm</h2>
                    <p>Phân loại các sản phẩm như hạt giống, phân bón, chậu trồng...</p>
                </div>
                <button className="add-btn" onClick={() => setOpenModal(true)}>
                    + Thêm danh mục
                </button>
            </div>

            {/* ===== Table Section ===== */}
            <div className="agri-table-container">
                <table className="agri-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên danh mục</th>
                        <th>Mô tả</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.length ? (
                        categories.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.id}</td>
                                <td>{cat.name}</td>
                                <td>{cat.description || '-'}</td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => {
                                            setEditItem(cat);
                                            setOpenModal(true);
                                        }}
                                    >
                                        ✏️ Sửa
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(cat.id)}
                                    >
                                        🗑 Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="no-data">
                                Chưa có danh mục nào.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* ===== Modal ===== */}
            <Modal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditItem(null);
                }}
                title={editItem ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
            >
                <CategoryForm
                    category={editItem}
                    onSuccess={handleSuccess}
                    onCancel={() => setOpenModal(false)}
                />
            </Modal>
        </div>
    );
}
