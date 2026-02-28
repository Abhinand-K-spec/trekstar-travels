'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const statCard = (label: string, value: string | number, icon: string, color: string) => (
    <div style={{
        background: 'rgba(30,41,59,0.6)', border: `1px solid ${color}30`, borderRadius: '16px',
        padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px',
        position: 'relative', overflow: 'hidden',
    }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: 0.07 }}>{icon}</div>
        <div style={{ fontSize: '28px' }}>{icon}</div>
        <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>{label}</div>
        <div style={{ color: '#f1f5f9', fontSize: '32px', fontWeight: '700' }}>{value}</div>
    </div>
);

const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
        pending: { bg: 'rgba(234,179,8,0.15)', color: '#fbbf24' },
        confirmed: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
        cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
        completed: { bg: 'rgba(14,165,233,0.15)', color: '#38bdf8' },
    };
    const c = colors[status] || { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' };
    return (
        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: c.bg, color: c.color }}>
            {status}
        </span>
    );
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.adminGetStats().then(res => {
            if (res.success) setStats(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ color: '#64748b', fontSize: '15px' }}>Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h1 style={{ color: '#f1f5f9', fontSize: '26px', fontWeight: '700', margin: '0 0 6px' }}>Dashboard</h1>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Overview of your TrekStar platform</p>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {statCard('Total Users', stats?.userCount ?? 0, '👥', '#0ea5e9')}
                {statCard('Packages', stats?.packageCount ?? 0, '📦', '#10b981')}
                {statCard('Orders', stats?.orderCount ?? 0, '🛒', '#f59e0b')}
                {statCard('Revenue', `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, '💰', '#8b5cf6')}
            </div>

            {/* Order status breakdown */}
            {stats?.ordersByStatus?.length > 0 && (
                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '600', margin: '0 0 20px' }}>Orders by Status</h2>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {stats.ordersByStatus.map((s: any) => (
                            <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0f172a', padding: '12px 20px', borderRadius: '10px' }}>
                                {statusBadge(s._id)}
                                <span style={{ color: '#94a3b8', fontSize: '14px' }}>{s.count} orders</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent orders */}
            <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '600', margin: 0 }}>Recent Orders</h2>
                    <Link href="/admin/orders" style={{ color: '#0ea5e9', fontSize: '13px', textDecoration: 'none' }}>View all →</Link>
                </div>
                {stats?.recentOrders?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats.recentOrders.map((order: any) => (
                            <Link key={order._id} href={`/admin/orders/${order._id}`} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '14px 16px', background: '#0f172a', borderRadius: '10px',
                                textDecoration: 'none', transition: 'background 0.2s',
                            }}>
                                <div>
                                    <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '500' }}>{order.user?.name || 'Unknown User'}</div>
                                    <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>{order.package?.title || 'Custom Itinerary'}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {statusBadge(order.status)}
                                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>${order.totalAmount}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>No orders yet</div>
                )}
            </div>

            {/* Quick links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {[
                    { label: 'Manage Users', href: '/admin/users', icon: '👥', desc: 'View and edit all users' },
                    { label: 'Manage Packages', href: '/admin/packages', icon: '📦', desc: 'Create and edit packages' },
                    { label: 'View Orders', href: '/admin/orders', icon: '🛒', desc: 'Track all bookings' },
                    { label: 'View Payments', href: '/admin/payments', icon: '💳', desc: 'Monitor transactions' },
                ].map(item => (
                    <Link key={item.href} href={item.href} style={{
                        background: 'rgba(30,41,59,0.6)', border: '1px solid #1e293b', borderRadius: '14px',
                        padding: '20px', textDecoration: 'none', transition: 'border-color 0.2s, transform 0.2s',
                        display: 'flex', flexDirection: 'column', gap: '8px',
                    }}>
                        <span style={{ fontSize: '24px' }}>{item.icon}</span>
                        <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600' }}>{item.label}</div>
                        <div style={{ color: '#64748b', fontSize: '12px' }}>{item.desc}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
