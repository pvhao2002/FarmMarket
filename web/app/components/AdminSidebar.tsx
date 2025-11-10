'use client';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Home, Layers, Leaf, Package, Users, ClipboardList} from 'lucide-react';
import './AdminSidebar.css';
import PageLoader from './PageLoader';

const menuItems = [
    {href: '/admin', label: 'Dashboard', icon: Home},
    {href: '/admin/categories', label: 'Loại sản phẩm', icon: Layers},
    {href: '/admin/products', label: 'Sản phẩm', icon: Leaf},
    {href: '/admin/orders', label: 'Đơn hàng', icon: ClipboardList},
    {href: '/admin/users', label: 'Người dùng', icon: Users},
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 50);
        return () => clearTimeout(timeout);
    }, [pathname]);

    const handleNavigate = (href: string) => {
        if (href !== pathname) {
            setLoading(true);
            router.push(href);
        }
    };

    return (
        <>
            {loading && <PageLoader/>}
            <aside className="agri-sidebar">
                <div className="sidebar-logo">
                    <span className="logo-text">AgriSupply</span>
                    <small>Farm Essentials</small>
                </div>

                <nav>
                    <ul>
                        {menuItems.map(({href, label, icon: Icon}) => (
                            <li key={href} className={pathname === href ? 'active' : ''}>
                                <button
                                    className="menu-link"
                                    onClick={() => handleNavigate(href)}
                                >
                                    <Icon className="icon"/>
                                    <span>{label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
}
