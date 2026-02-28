'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
        pending: { bg: 'rgba(234,179,8,0.15)', color: '#fbbf24' },
        confirmed: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
        cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
        completed: { bg: 'rgba(14,165,233,0.15)', color: '#38bdf8' },
    };
    const c = colors[status] || { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' };
    return <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: c.bg, color: c.color }}>{status}</span>;
};

export default function UserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'user' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.adminGetUser(id as string).then(res => {
            if (res.success) {
                setData(res.data);
                setForm({ name: res.data.user.name, email: res.data.user.email, phone: res.data.user.phone || '', role: res.data.user.role });
            }
            setLoading(false);
        });
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        const res = await api.adminUpdateUser(id as string, form);
        if (res.success) {
            setData((prev: any) => ({ ...prev, user: res.data }));
            setEditing(false);
        }
        setSaving(false);
    };

    if (loading) return <div style={{ color: '#64748b', padding: '40px', textAlign: 'center' }}>Loading...</div>;
    if (!data) return <div style={{ color: '#ef4444', padding: '40px', textAlign: 'center' }}>User not found</div>;

    const { user, orders } = data;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/admin/users" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none' }}>← Users</Link>
                <h1 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: '700', margin: 0 }}>User Details</h1>
            </div>

            {/* User card */}
            <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '28px', border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '22px', fontWeight: '700',
                        }}>{user.name?.charAt(0).toUpperCase()}</div>
                        <div>
                            <div style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: '600' }}>{user.name}</div>
                            <div style={{ color: '#64748b', fontSize: '13px' }}>ID: {user._id}</div>
                        </div>
                    </div>
                    <button onClick={() => setEditing(!editing)} style={{
                        padding: '9px 20px', borderRadius: '10px', border: '1px solid #334155',
                        background: editing ? '#334155' : 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                    }}>{editing ? 'Cancel' : 'Edit User'}</button>
                </div>

                {editing ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {[
                            { label: 'Name', key: 'name', type: 'text' },
                            { label: 'Email', key: 'email', type: 'email' },
                            { label: 'Phone', key: 'phone', type: 'text' },
                        ].map(({ label, key, type }) => (
                            <div key={key}>
                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>{label}</label>
                                <input
                                    type={type}
                                    value={(form as any)[key]}
                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        ))}
                        <div>
                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: '500', marginBottom: '6px' }}>Role</label>
                            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1/-1', display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                            <button onClick={handleSave} disabled={saving} style={{
                                padding: '10px 24px', borderRadius: '10px', border: 'none',
                                background: 'linear-gradient(90deg, #0ea5e9 0%, #10b981 100%)',
                                color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                            }}>{saving ? 'Saving...' : 'Save Changes'}</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {[
                            { label: 'Email', value: user.email },
                            { label: 'Phone', value: user.phone || '—' },
                            { label: 'Role', value: user.role },
                            { label: 'Joined', value: new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ background: '#0f172a', padding: '14px 16px', borderRadius: '10px' }}>
                                <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>{label}</div>
                                <div style={{ color: '#f1f5f9', fontSize: '14px' }}>{value}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Orders */}
            <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                <h2 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '600', margin: '0 0 20px' }}>Order History ({orders?.length || 0})</h2>
                {orders?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {orders.map((order: any) => (
                            <Link key={order._id} href={`/admin/orders/${order._id}`} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '14px 16px', background: '#0f172a', borderRadius: '10px',
                                textDecoration: 'none',
                            }}>
                                <div>
                                    <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '500' }}>{order.package?.title || 'Custom Itinerary'}</div>
                                    <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>
                                        {order.package?.destination ? `${order.package.destination.city}, ${order.package.destination.country}` : ''}
                                        {' · '}{new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {statusBadge(order.status)}
                                    <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>${order.totalAmount}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#475569' }}>No orders yet</div>
                )}
            </div>
        </div>
    );
}
