'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // ── If on the login page, bypass auth guard entirely ──────────────────────
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        // Don't run auth check on login page
        if (pathname === '/admin/login') {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('admin_token');
        const userStr = localStorage.getItem('admin_user');
        if (!token || !userStr) {
            setLoading(false);
            router.push('/admin/login');
            return;
        }
        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'admin') {
                setLoading(false);
                router.push('/admin/login');
                return;
            }
            setAdmin(user);
        } catch {
            setLoading(false);
            router.push('/admin/login');
            return;
        }
        setLoading(false);
    }, [router, pathname]);

    // ── Render the login page directly without sidebar/header ─────────────────
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a', color: '#94a3b8' }}>
                <div>Loading admin panel...</div>
            </div>
        );
    }

    if (!admin) return null;

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: '📊' },
        { label: 'Users', href: '/admin/users', icon: '👥' },
        { label: 'Packages', href: '/admin/packages', icon: '📦' },
        { label: 'Orders', href: '/admin/orders', icon: '🛒' },
        { label: 'Payments', href: '/admin/payments', icon: '💳' },
        { label: 'Visa Apps', href: '/admin/visa', icon: '🛂' },
    ];

    const logout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/admin/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarOpen ? '260px' : '70px',
                background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                borderRight: '1px solid #1e293b',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s ease',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
            }}>
                {/* Logo */}
                <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', fontWeight: '700', color: 'white'
                    }}>T</div>
                    {sidebarOpen && (
                        <div>
                            <div style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '14px' }}>TrekStar</div>
                            <div style={{ color: '#64748b', fontSize: '11px' }}>Admin Panel</div>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {navItems.map(item => {
                        const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href} style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '10px 12px', borderRadius: '8px',
                                textDecoration: 'none',
                                background: active ? 'linear-gradient(90deg, rgba(14,165,233,0.15) 0%, rgba(16,185,129,0.10) 100%)' : 'transparent',
                                color: active ? '#0ea5e9' : '#94a3b8',
                                fontSize: '14px', fontWeight: active ? '600' : '400',
                                borderLeft: active ? '2px solid #0ea5e9' : '2px solid transparent',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap',
                            }}>
                                <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                                {sidebarOpen && item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Admin info + logout */}
                <div style={{ padding: '16px 12px', borderTop: '1px solid #1e293b' }}>
                    {sidebarOpen && (
                        <div style={{ marginBottom: '12px', padding: '10px 12px', background: '#1e293b', borderRadius: '8px' }}>
                            <div style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{admin.name}</div>
                            <div style={{ color: '#64748b', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{admin.email}</div>
                        </div>
                    )}
                    <button onClick={logout} style={{
                        width: '100%', padding: '9px 12px', borderRadius: '8px',
                        background: 'transparent', border: '1px solid #ef4444',
                        color: '#ef4444', cursor: 'pointer', fontSize: '13px',
                        display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: '8px',
                        transition: 'all 0.2s',
                    }}>
                        <span>🚪</span>
                        {sidebarOpen && 'Logout'}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div style={{ flex: 1, marginLeft: sidebarOpen ? '260px' : '70px', transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Topbar */}
                <header style={{
                    height: '60px', background: '#1e293b', borderBottom: '1px solid #334155',
                    display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px',
                    position: 'sticky', top: 0, zIndex: 50,
                }}>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                        background: 'transparent', border: 'none', color: '#94a3b8',
                        cursor: 'pointer', fontSize: '20px', padding: '4px', lineHeight: 1,
                    }}>☰</button>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                        {navItems.find(n => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label || 'Admin'}
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link href="/" target="_blank" style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none' }}>View Site →</Link>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
