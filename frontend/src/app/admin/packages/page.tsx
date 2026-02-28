'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminPackagesPage() {
    const [packages, setPackages] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPackages = useCallback(async (page = 1, q = search) => {
        setLoading(true);
        const res = await api.adminGetPackages({ search: q, page, limit: 10 });
        if (res.success) {
            setPackages((res as any).data || []);
            setPagination((res as any).pagination || { total: 0, page: 1, pages: 1 });
        }
        setLoading(false);
    }, [search]);

    useEffect(() => { fetchPackages(); }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchPackages(1, search);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete package "${title}"?`)) return;
        await api.adminDeletePackage(id);
        fetchPackages(pagination.page);
    };

    const moodColors: Record<string, string> = {
        relaxed: '#34d399', adventure: '#fb923c', culture: '#a78bfa', foodie: '#f472b6'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ color: '#f1f5f9', fontSize: '26px', fontWeight: '700', margin: '0 0 6px' }}>Packages</h1>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{pagination.total} travel packages</p>
                </div>
                <Link href="/admin/packages/new" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px', borderRadius: '10px', border: 'none',
                    background: 'linear-gradient(90deg, #0ea5e9 0%, #10b981 100%)',
                    color: 'white', fontSize: '14px', fontWeight: '600', textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
                }}>
                    + Add Package
                </Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    placeholder="Search by name or destination..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', background: 'rgba(30,41,59,0.6)', border: '1px solid #334155', color: '#f1f5f9', fontSize: '14px', outline: 'none', maxWidth: '400px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#0ea5e9', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Search</button>
                {search && <button type="button" onClick={() => { setSearch(''); fetchPackages(1, ''); }} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', fontSize: '14px', cursor: 'pointer' }}>Clear</button>}
            </form>

            {/* Cards or table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>Loading...</div>
            ) : packages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', background: 'rgba(30,41,59,0.6)', borderRadius: '16px', border: '1px solid #1e293b' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                    <div style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '16px' }}>No packages yet</div>
                    <Link href="/admin/packages/new" style={{ color: '#0ea5e9', fontSize: '14px', textDecoration: 'none' }}>Create your first package →</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                    {packages.map(pkg => (
                        <div key={pkg._id} style={{
                            background: 'rgba(30,41,59,0.6)', border: '1px solid #1e293b', borderRadius: '16px',
                            overflow: 'hidden', display: 'flex', flexDirection: 'column',
                        }}>
                            <div style={{ padding: '20px', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 4px' }}>{pkg.title}</h3>
                                        <div style={{ color: '#64748b', fontSize: '13px' }}>{pkg.destination?.city}, {pkg.destination?.country}</div>
                                    </div>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                                        background: pkg.isActive ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
                                        color: pkg.isActive ? '#34d399' : '#64748b', flexShrink: 0,
                                    }}>{pkg.isActive ? 'Active' : 'Inactive'}</span>
                                </div>
                                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{pkg.description}</p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', background: 'rgba(14,165,233,0.1)', color: '#38bdf8' }}>{pkg.duration} days</span>
                                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', background: `${moodColors[pkg.travelMood] || '#94a3b8'}20`, color: moodColors[pkg.travelMood] || '#94a3b8' }}>{pkg.travelMood}</span>
                                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', background: 'rgba(139,92,246,0.1)', color: '#a78bfa' }}>{pkg.travelCompanion}</span>
                                </div>
                            </div>
                            <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '700' }}>${pkg.price}<span style={{ color: '#64748b', fontSize: '12px', fontWeight: '400' }}>/person</span></span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Link href={`/admin/packages/${pkg._id}/edit`} style={{ padding: '7px 16px', borderRadius: '8px', background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontSize: '12px', fontWeight: '600', textDecoration: 'none', border: '1px solid rgba(14,165,233,0.2)' }}>Edit</Link>
                                    <button onClick={() => handleDelete(pkg._id, pkg.title)} style={{ padding: '7px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: '1px solid rgba(239,68,68,0.2)' }}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <button onClick={() => fetchPackages(pagination.page - 1)} disabled={pagination.page <= 1}
                        style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}>Prev</button>
                    <span style={{ color: '#64748b', padding: '8px 16px', fontSize: '13px' }}>Page {pagination.page} of {pagination.pages}</span>
                    <button onClick={() => fetchPackages(pagination.page + 1)} disabled={pagination.page >= pagination.pages}
                        style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}>Next</button>
                </div>
            )}
        </div>
    );
}
