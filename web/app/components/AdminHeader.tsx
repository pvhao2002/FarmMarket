import { LogOut, Sprout } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './AdminHeader.css';

export default function AdminHeader() {
    const router = useRouter();
    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    return (
        <header className="agri-header">
            <div className="header-left">
                <Sprout className="header-icon" />
                <h2>AgriSupply Management</h2>
            </div>
            <LogOut onClick={handleLogout} className="logout-icon" />
        </header>
    );
}
