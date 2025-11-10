'use client';

import { useState, FormEvent } from 'react';
import './CategoryForm.css';
import apiClient from '@/api/apiClient';
import { API_ENDPOINTS } from '@/constants/api';

interface Category {
    id?: number;
    name: string;
    description?: string;
}

interface CategoryFormProps {
    category?: Category | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
    const [name, setName] = useState(category?.name || '');
    const [description, setDescription] = useState(category?.description || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (category?.id) {
                await apiClient.put(`${API_ENDPOINTS.CATEGORIES.ADMIN}/${category.id}`, { name, description });
            } else {
                await apiClient.post(API_ENDPOINTS.CATEGORIES.ADMIN, { name, description });
            }
            onSuccess();
        } catch (err) {
            console.error('Error saving category:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="agri-form" onSubmit={handleSubmit}>
            <h3 className="form-title">
                {category ? '✏️ Cập nhật danh mục' : '🌾 Thêm danh mục mới'}
            </h3>

            <div className="form-group">
                <label>Tên danh mục</label>
                <input
                    type="text"
                    placeholder="Nhập tên danh mục (vd: Hạt giống, Phân bón...)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>Mô tả</label>
                <textarea
                    placeholder="Nhập mô tả ngắn gọn về danh mục"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onCancel}>
                    Hủy
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? 'Đang lưu...' : category ? 'Cập nhật' : 'Thêm mới'}
                </button>
            </div>
        </form>
    );
}
