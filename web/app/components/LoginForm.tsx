'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './LoginForm.css';
import apiClient from '@/api/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import Spinner from '@/app/components/Spinner';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
            const { token, refreshToken, email: userEmail, role } = res.data;

            localStorage.setItem('auth_token', token);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('user_email', userEmail);
            localStorage.setItem('user_role', role);

            router.push('/admin');
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Email hoặc mật khẩu không đúng.');
            } else {
                setError('Lỗi hệ thống, vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="agri-login-container">
            {loading && <Spinner />}

            {/* Cột trái - Form đăng nhập */}
            <div className="agri-login-left">
                <div className="login-card">
                    <h1 className="brand">🌾 AgriSupply Admin</h1>
                    <p className="subtitle">Đăng nhập để quản lý sản phẩm nông nghiệp</p>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="admin@agrisupply.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="error">{error}</p>}

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>

                    <p className="note">Hệ thống quản lý phân bón, hạt giống, vật tư nông nghiệp</p>
                </div>
            </div>

            {/* Cột phải - Hiệu ứng cây trồng */}
            <div className="agri-login-right">
                <div className="plant-animation">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <rect width="200" height="200" fill="url(#bgGradient)" />
                        <defs>
                            <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#E8F5E9" />
                                <stop offset="100%" stopColor="#C8E6C9" />
                            </linearGradient>
                        </defs>

                        {/* Chậu cây */}
                        <rect x="75" y="140" width="50" height="20" fill="#8D6E63" rx="3" />
                        <rect x="70" y="160" width="60" height="10" fill="#6D4C41" rx="3" />

                        {/* Cây mọc lên */}
                        <line x1="100" y1="140" x2="100" y2="80" stroke="#388E3C" strokeWidth="3" />
                        <circle cx="100" cy="75" r="6" fill="#4CAF50" />

                        {/* Lá 2 bên */}
                        <path d="M100 110 C90 100, 80 100, 85 115 Z" fill="#66BB6A" />
                        <path d="M100 110 C110 100, 120 100, 115 115 Z" fill="#66BB6A" />

                        {/* Giọt nước rơi */}
                        <circle className="water-drop" cx="130" cy="50" r="4" fill="#2196F3" />
                    </svg>
                </div>
                <h2 className="right-title">Tưới tiêu - Phát triển - Bền vững 🌱</h2>
                <p className="right-text">
                    Nền tảng giúp nhà nông quản lý và kinh doanh các sản phẩm thiết yếu hiệu quả hơn.
                </p>
            </div>
        </div>
    );
}
