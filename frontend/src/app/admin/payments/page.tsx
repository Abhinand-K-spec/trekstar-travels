'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const STATUS_OPTIONS = ['', 'pending', 'paid', 'failed', 'refunded'];

const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
        paid: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
        pending: { bg: 'rgba(234,179,8,0.15)', color: '#fbbf24' },
        failed: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
        refunded: { bg: 'rgba(14,165,233,0.15)', color: '#38bdf8' },
    };
    const c = colors[status] || { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' };
    return <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: c.bg, color: c.color }}>{status}</span>;
};

const methodIcon: Record<string, string> = {
    card: '💳', upi: '📱', bank_transfer: '🏦', cash: '💵'
};

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const fetchPayments = useCallback(async (page = 1, status = statusFilter) => {
        setLoading(true);
        const params: any = { page, limit: 10 };
        if (status) params.status = status;
        const res = await api.adminGetPayments(params);
        if (res.success) {
            const list = (res as any).data || [];
            setPayments(list);
            setPagination((res as any).pagination || { total: 0, page: 1, pages: 1 });
            if (!status) {
                const rev = list.filter((p: any) => p.status === 'paid').reduce((s: number, p: any) => s + p.amount, 0);
                setTotalRevenue(rev);
            }
        }
        setLoading(false);
    }, [statusFilter]);

    useEffect(() => { fetchPayments(); }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
                <h1 style={{ color: '#f1f5f9', fontSize: '26px', fontWeight: '700', margin: '0 0 6px' }}>Payments</h1>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{pagination.total} transactions</p>
            </div>

            {/* Revenue card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                {[
                    { label: 'Total Transactions', value: pagination.total, color: '#0ea5e9' },
                    { label: 'Revenue (paid)', value: `$${totalRevenue.toLocaleString()}`, color: '#10b981' },
                ].map(c => (
                    <div key={c.label} style={{ background: 'rgba(30,41,59,0.6)', border: `1px solid ${c.color}30`, borderRadius: '14px', padding: '20px' }}>
                        <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>{c.label}</div>
                        <div style={{ color: '#f1f5f9', fontSize: '26px', fontWeight: '700' }}>{c.value}</div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: '8px' }}>
                {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => { setStatusFilter(s); fetchPayments(1, s); }} style={{
                        padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                        border: s === statusFilter ? 'none' : '1px solid #334155',
                        background: s === statusFilter ? 'linear-gradient(90deg, #0ea5e9 0%, #10b981 100%)' : 'transparent',
                        color: s === statusFilter ? 'white' : '#94a3b8',
                    }}>{s || 'All'}</button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1e293b' }}>
                                {['Customer', 'Package', 'Amount', 'Method', 'Transaction ID', 'Status', 'Date', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>Loading...</td></tr>
                            ) : payments.length === 0 ? (
                                <tr><td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>No payments found</td></tr>
                            ) : payments.map(payment => (
                                <tr key={payment._id} style={{ borderBottom: '1px solid #0f172a' }}>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '500' }}>{payment.user?.name || '—'}</div>
                                        <div style={{ color: '#64748b', fontSize: '12px' }}>{payment.user?.email}</div>
                                    </td>
                                    <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {payment.order?.package?.title || 'Custom Itinerary'}
                                    </td>
                                    <td style={{ padding: '14px 20px', color: '#f1f5f9', fontSize: '14px', fontWeight: '700' }}>${payment.amount} <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '400' }}>{payment.currency}</span></td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
                                            <span>{methodIcon[payment.method] || '💰'}</span>
                                            {payment.method?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '12px', fontFamily: 'monospace' }}>{payment.transactionId || '—'}</td>
                                    <td style={{ padding: '14px 20px' }}>{statusBadge(payment.status)}</td>
                                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '12px' }}>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <Link href={`/admin/orders/${payment.order?._id}`} style={{ padding: '6px 14px', borderRadius: '7px', background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', fontSize: '12px', fontWeight: '600', textDecoration: 'none', border: '1px solid rgba(14,165,233,0.2)', whiteSpace: 'nowrap' }}>
                                            View Order
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pagination.pages > 1 && (
                    <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#64748b', fontSize: '13px' }}>Page {pagination.page} of {pagination.pages}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => fetchPayments(pagination.page - 1)} disabled={pagination.page <= 1}
                                style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}>Prev</button>
                            <button onClick={() => fetchPayments(pagination.page + 1)} disabled={pagination.page >= pagination.pages}
                                style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}>Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
