'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

const statusColor = (status: string) => {
    const m: Record<string, { bg: string; color: string }> = {
        pending: { bg: 'rgba(234,179,8,0.15)', color: '#fbbf24' },
        confirmed: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
        cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
        completed: { bg: 'rgba(14,165,233,0.15)', color: '#38bdf8' },
    };
    return m[status] || { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' };
};

const paymentStatusColor = (status: string) => {
    const m: Record<string, { bg: string; color: string }> = {
        paid: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
        pending: { bg: 'rgba(234,179,8,0.15)', color: '#fbbf24' },
        failed: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
        refunded: { bg: 'rgba(14,165,233,0.15)', color: '#38bdf8' },
    };
    return m[status] || { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' };
};

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        api.adminGetOrder(id as string).then(res => {
            if (res.success) {
                setOrder(res.data);
                setNewStatus(res.data.status);
            }
            setLoading(false);
        });
    }, [id]);

    const handleStatusUpdate = async () => {
        setUpdating(true);
        const res = await api.adminUpdateOrderStatus(id as string, newStatus);
        if (res.success) setOrder((prev: any) => ({ ...prev, status: newStatus }));
        setUpdating(false);
    };

    if (loading) return <div style={{ color: '#64748b', padding: '60px', textAlign: 'center' }}>Loading...</div>;
    if (!order) return <div style={{ color: '#ef4444', padding: '60px', textAlign: 'center' }}>Order not found</div>;

    const sc = statusColor(order.status);
    const payment = order.paymentId;

    const InfoRow = ({ label, value }: { label: string; value: string }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
            <span style={{ color: '#64748b', fontSize: '13px' }}>{label}</span>
            <span style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: '500' }}>{value}</span>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/admin/orders" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none' }}>← Orders</Link>
                <h1 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: '700', margin: 0 }}>Order Details</h1>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: sc.bg, color: sc.color }}>{order.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Order info */}
                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 16px' }}>Order Info</h2>
                    <InfoRow label="Order ID" value={order._id} />
                    <InfoRow label="Package" value={order.package?.title || 'Custom Itinerary'} />
                    <InfoRow label="Total Amount" value={`$${order.totalAmount} ${order.currency}`} />
                    <InfoRow label="Travelers" value={String(order.travelers)} />
                    <InfoRow label="Travel Date" value={order.travelDate ? new Date(order.travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'} />
                    <InfoRow label="Created" value={new Date(order.createdAt).toLocaleString()} />
                    {order.notes && <InfoRow label="Notes" value={order.notes} />}
                </div>

                {/* Customer */}
                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 16px' }}>Customer</h2>
                    {order.user ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', fontWeight: '700' }}>
                                    {order.user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600' }}>{order.user.name}</div>
                                    <div style={{ color: '#64748b', fontSize: '13px' }}>{order.user.email}</div>
                                </div>
                            </div>
                            <InfoRow label="Phone" value={order.user.phone || '—'} />
                            <Link href={`/admin/users/${order.user._id}`} style={{ display: 'inline-block', marginTop: '12px', color: '#0ea5e9', fontSize: '13px', textDecoration: 'none' }}>View user profile →</Link>
                        </>
                    ) : <div style={{ color: '#64748b' }}>User not found</div>}
                </div>

                {/* Package details */}
                {order.package && (
                    <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                        <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 16px' }}>Package</h2>
                        <InfoRow label="Title" value={order.package.title} />
                        <InfoRow label="Destination" value={`${order.package.destination?.city || ''}, ${order.package.destination?.country || ''}`} />
                        <InfoRow label="Duration" value={`${order.package.duration} days`} />
                        <InfoRow label="Base Price" value={`$${order.package.price}/person`} />
                    </div>
                )}

                {/* Payment */}
                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 16px' }}>Payment</h2>
                    {payment ? (
                        <>
                            {(() => {
                                const pc = paymentStatusColor(payment.status); return (
                                    <span style={{ display: 'inline-block', marginBottom: '16px', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: pc.bg, color: pc.color }}>{payment.status}</span>
                                );
                            })()}
                            <InfoRow label="Amount" value={`$${payment.amount} ${payment.currency}`} />
                            <InfoRow label="Method" value={payment.method} />
                            <InfoRow label="Transaction ID" value={payment.transactionId || '—'} />
                            <InfoRow label="Paid At" value={payment.paidAt ? new Date(payment.paidAt).toLocaleString() : '—'} />
                        </>
                    ) : <div style={{ color: '#64748b', fontSize: '13px' }}>No payment recorded</div>}
                </div>
            </div>

            {/* Status Update */}
            <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 16px' }}>Update Order Status</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {STATUS_OPTIONS.map(s => {
                        const sc2 = statusColor(s);
                        return (
                            <button key={s} onClick={() => setNewStatus(s)} style={{
                                padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                                border: newStatus === s ? `2px solid ${sc2.color}` : '2px solid #334155',
                                background: newStatus === s ? sc2.bg : 'transparent',
                                color: newStatus === s ? sc2.color : '#64748b',
                                transition: 'all 0.15s',
                            }}>{s}</button>
                        );
                    })}
                    <button onClick={handleStatusUpdate} disabled={updating || newStatus === order.status} style={{
                        marginLeft: 'auto', padding: '10px 24px', borderRadius: '10px', border: 'none',
                        background: newStatus === order.status ? '#334155' : 'linear-gradient(90deg, #0ea5e9 0%, #10b981 100%)',
                        color: 'white', fontSize: '13px', fontWeight: '600', cursor: newStatus === order.status ? 'default' : 'pointer',
                    }}>{updating ? 'Updating...' : 'Apply Status'}</button>
                </div>
            </div>
        </div>
    );
}
