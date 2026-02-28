'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchUsers = useCallback(async (page = 1, q = search) => {
        setLoading(true);
        const res = await api.adminGetUsers({ search: q, page, limit: 10 });
        if (res.success) {
            setUsers((res as any).data || []);
            setPagination((res as any).pagination || { total: 0, page: 1, pages: 1 });
        }
        setLoading(false);
    }, [search]);

    useEffect(() => { fetchUsers(); }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUsers(1, search);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        await api.adminDeleteUser(id);
        fetchUsers(pagination.page);
        setDeleteId(null);
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ color: '#f1f5f9', fontSize: '26px', fontWeight: '700', margin: '0 0 6px' }}>Users</h1>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{pagination.total} registered users</p>
                </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        flex: 1, padding: '10px 16px', borderRadius: '10px',
                        background: 'rgba(30,41,59,0.6)', border: '1px solid #334155',
                        color: '#f1f5f9', fontSize: '14px', outline: 'none', maxWidth: '400px',
                    }}
                />
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#0ea5e9', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    Search
                </button>
                {search && <button type="button" onClick={() => { setSearch(''); fetchUsers(1, ''); }} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', fontSize: '14px', cursor: 'pointer' }}>Clear</button>}
            </form>

            {/* Table */}
            <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1e293b' }}>
                                {['Name', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>Loading...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>No users found</td></tr>
                            ) : users.map(user => (
                                <tr key={user._id} style={{ borderBottom: '1px solid #0f172a', transition: 'background 0.15s' }}>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                                                background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontSize: '13px', fontWeight: '600',
                                            }}>{user.name?.charAt(0).toUpperCase()}</div>
                                            <span style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '500' }}>{user.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{user.email}</td>
                                    <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px' }}>{user.phone || '—'}</td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                            background: user.role === 'admin' ? 'rgba(139,92,246,0.15)' : 'rgba(14,165,233,0.15)',
                                            color: user.role === 'admin' ? '#a78bfa' : '#38bdf8',
                                        }}>{user.role}</span>
                                    </td>
                                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '13px' }}>{formatDate(user.createdAt)}</td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Link href={`/admin/users/${user._id}`} style={{
                                                padding: '6px 14px', borderRadius: '7px', background: 'rgba(14,165,233,0.1)',
                                                color: '#0ea5e9', fontSize: '12px', fontWeight: '600', textDecoration: 'none',
                                                border: '1px solid rgba(14,165,233,0.2)',
                                            }}>View</Link>
                                            <button onClick={() => handleDelete(user._id)} style={{
                                                padding: '6px 14px', borderRadius: '7px', background: 'rgba(239,68,68,0.1)',
                                                color: '#ef4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                                                border: '1px solid rgba(239,68,68,0.2)',
                                            }}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#64748b', fontSize: '13px' }}>Page {pagination.page} of {pagination.pages}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => fetchUsers(pagination.page - 1)} disabled={pagination.page <= 1}
                                style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: pagination.page <= 1 ? '#334155' : '#94a3b8', cursor: pagination.page <= 1 ? 'default' : 'pointer', fontSize: '13px' }}>
                                Prev
                            </button>
                            <button onClick={() => fetchUsers(pagination.page + 1)} disabled={pagination.page >= pagination.pages}
                                style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: pagination.page >= pagination.pages ? '#334155' : '#94a3b8', cursor: pagination.page >= pagination.pages ? 'default' : 'pointer', fontSize: '13px' }}>
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
