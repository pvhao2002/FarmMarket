'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/api/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            try {
                const res = await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD);
                setStats(res.data);
            } catch (err) {
                console.error('Error loading dashboard metrics:', err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading || !stats)
        return <div className="agri-loading">🌿 Đang tải bảng điều khiển...</div>;

    return (
        <div className="agri-dashboard-modern">

            {/* ===== Banner ===== */}
            <div className="agri-banner">
                <div className="agri-banner-text">
                    <h1>🌱 Welcome to AgriSupply Dashboard</h1>
                    <p>Quản lý doanh thu, đơn hàng và sản phẩm vật tư nông nghiệp của bạn một cách hiệu quả!</p>
                    <div className="agri-tip">
                        💡 <b>Mẹo:</b> Theo dõi doanh thu hàng tháng để tối ưu lượng tồn kho và khuyến mãi mùa vụ.
                    </div>
                </div>
                <img
                    src="/banner.jpg"
                    alt="Farm illustration"
                    className="agri-banner-img"
                />
            </div>

            {/* ===== KPI Cards ===== */}
            <section className="agri-stats-grid">
                <div className="agri-stat success">
                    <span className="icon">💰</span>
                    <div>
                        <h4>Doanh thu</h4>
                        <p>{stats.totalRevenue?.toLocaleString('vi-VN')} ₫</p>
                    </div>
                </div>
                <div className="agri-stat">
                    <span className="icon">📦</span>
                    <div>
                        <h4>Đơn hàng</h4>
                        <p>{stats.totalOrders}</p>
                    </div>
                </div>
                <div className="agri-stat warning">
                    <span className="icon">⏳</span>
                    <div>
                        <h4>Đang chờ xử lý</h4>
                        <p>{stats.pendingOrders}</p>
                    </div>
                </div>
                <div className="agri-stat">
                    <span className="icon">👥</span>
                    <div>
                        <h4>Khách hàng</h4>
                        <p>{stats.totalCustomers}</p>
                    </div>
                </div>
                <div className="agri-stat secondary">
                    <span className="icon">🌾</span>
                    <div>
                        <h4>Tồn kho</h4>
                        <p>{stats.productsInStock}</p>
                    </div>
                </div>
            </section>

            {/* ===== Chart Section ===== */}
            <section className="agri-chart-modern">
                <div className="chart-header">
                    <h3>📊 Doanh thu & Đơn hàng theo tháng</h3>
                    <p>Cập nhật: {new Date(stats.generatedAt).toLocaleString()}</p>
                </div>
                {stats.monthlyGrowth?.length ? (
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={stats.monthlyGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" name="Doanh thu (₫)" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="orders" name="Đơn hàng" fill="#81C784" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="newCustomers" name="Khách mới" fill="#FFB300" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="no-data">Chưa có dữ liệu biểu đồ.</p>
                )}
            </section>

            {/* ===== Table Section ===== */}
            <section className="agri-bottom-modern">
                <div className="table-header">
                    <h3>🔥 Top Sản phẩm bán chạy</h3>
                    <p>Theo dõi hiệu suất từng sản phẩm để tăng doanh thu mùa vụ.</p>
                </div>
                <div className="agri-table-wrapper">
                    <table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Sản phẩm</th>
                            <th>Doanh thu (₫)</th>
                            <th>Bán ra</th>
                            <th>Đơn hàng</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stats.topProducts?.length ? (
                            stats.topProducts.map((p: any, idx: number) => (
                                <tr key={p.productId}>
                                    <td>{idx + 1}</td>
                                    <td>{p.productName}</td>
                                    <td>{p.totalRevenue.toLocaleString('vi-VN')}</td>
                                    <td>{p.totalQuantitySold}</td>
                                    <td>{p.orderCount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="no-data">Không có dữ liệu sản phẩm.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
