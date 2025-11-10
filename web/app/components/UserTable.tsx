'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/api/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import './UserTable.css';

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: string | { name: string };
    isActive?: boolean;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    totalOrders?: number;
    totalSpent?: number;
    lastOrderDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const loadUsers = async (pageNum = 0) => {
        setLoading(true);
        try {
            const res = await apiClient.get(API_ENDPOINTS.USERS.BASE, {
                params: { page: pageNum, size, search: search || undefined },
            });
            const data: PagedResponse<User> = res.data;
            setUsers(data.content ?? []);
            setTotalPages(data.totalPages ?? 0);
            setPage(data.page ?? 0);
        } catch (err) {
            console.error('Error loading users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(page);
    }, [page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadUsers(0);
    };

    return (
        <div className="agri-user-table-container">
            <div className="agri-toolbar">
                <h2>👩‍🌾 Quản lý người dùng</h2>
                <form onSubmit={handleSearch} className="agri-search-form">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, SĐT..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">Tìm kiếm</button>
                </form>
            </div>

            {loading ? (
                <div className="agri-loading">Đang tải danh sách người dùng...</div>
            ) : (
                <>
                    <table className="agri-user-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Địa chỉ</th>
                            <th>Đơn hàng</th>
                            <th>Tổng chi tiêu (₫)</th>
                            <th>Đơn gần nhất</th>
                            <th>Ngày tạo</th>
                            <th>Cập nhật</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={12} className="agri-no-data">
                                    Không có người dùng nào.
                                </td>
                            </tr>
                        ) : (
                            users.map((u, idx) => (
                                <tr key={u.id}>
                                    <td>{page * size + idx + 1}</td>
                                    <td>{`${u.firstName ?? ''} ${u.lastName ?? ''}`}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone || '—'}</td>
                                    <td>
                      <span
                          className={`agri-role-badge ${String(u.role)
                              .toLowerCase()
                              .replace(/\W/g, '')}`}
                      >
                        {typeof u.role === 'string'
                            ? u.role
                            : u.role?.name ?? 'USER'}
                      </span>
                                    </td>
                                    <td>
                      <span
                          className={
                              u.isActive ? 'agri-status-active' : 'agri-status-inactive'
                          }
                      >
                        {u.isActive ? 'Hoạt động' : 'Ngừng'}
                      </span>
                                    </td>
                                    <td>
                                        {[u.street, u.city, u.country].filter(Boolean).join(', ') || '—'}
                                    </td>
                                    <td>{u.totalOrders ?? 0}</td>
                                    <td>
                                        {u.totalSpent
                                            ? u.totalSpent.toLocaleString('vi-VN')
                                            : '—'}
                                    </td>
                                    <td>
                                        {u.lastOrderDate
                                            ? new Date(u.lastOrderDate).toLocaleDateString()
                                            : '—'}
                                    </td>
                                    <td>
                                        {u.createdAt
                                            ? new Date(u.createdAt).toLocaleDateString()
                                            : '—'}
                                    </td>
                                    <td>
                                        {u.updatedAt
                                            ? new Date(u.updatedAt).toLocaleDateString()
                                            : '—'}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    <div className="agri-pagination">
                        <button
                            className="agri-page-btn"
                            disabled={page <= 0}
                            onClick={() => setPage(page - 1)}
                        >
                            ← Trước
                        </button>
                        <span className="agri-page-info">
              Trang {page + 1} / {totalPages}
            </span>
                        <button
                            className="agri-page-btn"
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Sau →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
