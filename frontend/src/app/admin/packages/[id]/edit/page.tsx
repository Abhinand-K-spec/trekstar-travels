'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '9px',
    background: 'rgba(15,23,42,0.7)', border: '1px solid #334155',
    color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
};

const labelStyle = {
    display: 'block' as const, color: '#94a3b8', fontSize: '12px', fontWeight: '600' as const, marginBottom: '6px',
};

export default function EditPackagePage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        title: '', 'destination.city': '', 'destination.country': '',
        duration: 3, description: '', price: 0, maxGroupSize: 10,
        travelMood: 'relaxed', travelCompanion: 'all',
        highlights: '', inclusions: '', exclusions: '', isActive: true,
    });

    useEffect(() => {
        api.adminGetPackage(id as string).then(res => {
            if (res.success) {
                const p = res.data;
                setForm({
                    title: p.title, 'destination.city': p.destination?.city || '', 'destination.country': p.destination?.country || '',
                    duration: p.duration, description: p.description, price: p.price, maxGroupSize: p.maxGroupSize || 10,
                    travelMood: p.travelMood, travelCompanion: p.travelCompanion || 'all',
                    highlights: (p.highlights || []).join('\n'),
                    inclusions: (p.inclusions || []).join('\n'),
                    exclusions: (p.exclusions || []).join('\n'),
                    isActive: p.isActive,
                });
            }
            setLoading(false);
        });
    }, [id]);

    const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        const payload = {
            title: form.title,
            destination: { city: form['destination.city'], country: form['destination.country'] },
            duration: Number(form.duration), description: form.description,
            price: Number(form.price), maxGroupSize: Number(form.maxGroupSize),
            travelMood: form.travelMood, travelCompanion: form.travelCompanion,
            highlights: form.highlights.split('\n').filter(Boolean),
            inclusions: form.inclusions.split('\n').filter(Boolean),
            exclusions: form.exclusions.split('\n').filter(Boolean),
            isActive: form.isActive,
        };
        const res = await api.adminUpdatePackage(id as string, payload);
        if (res.success) {
            router.push('/admin/packages');
        } else {
            setError(res.error || 'Failed to update package');
            setSaving(false);
        }
    };

    if (loading) return <div style={{ color: '#64748b', padding: '60px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/admin/packages" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none' }}>← Packages</Link>
                <h1 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: '700', margin: 0 }}>Edit Package</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 20px' }}>Basic Information</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={labelStyle}>Package Title *</label>
                            <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} />
                        </div>
                        <div><label style={labelStyle}>City *</label><input style={inputStyle} value={form['destination.city']} onChange={e => set('destination.city', e.target.value)} /></div>
                        <div><label style={labelStyle}>Country *</label><input style={inputStyle} value={form['destination.country']} onChange={e => set('destination.country', e.target.value)} /></div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={labelStyle}>Description *</label>
                            <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 20px' }}>Pricing & Duration</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div><label style={labelStyle}>Price per Person (USD) *</label><input type="number" style={inputStyle} value={form.price} onChange={e => set('price', e.target.value)} min={0} /></div>
                        <div><label style={labelStyle}>Duration (days)</label><input type="number" style={inputStyle} value={form.duration} onChange={e => set('duration', e.target.value)} min={1} /></div>
                        <div><label style={labelStyle}>Max Group Size</label><input type="number" style={inputStyle} value={form.maxGroupSize} onChange={e => set('maxGroupSize', e.target.value)} min={1} /></div>
                    </div>
                </div>

                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 20px' }}>Travel Details</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Travel Mood</label>
                            <select style={inputStyle} value={form.travelMood} onChange={e => set('travelMood', e.target.value)}>
                                {['relaxed', 'adventure', 'culture', 'foodie'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Best For</label>
                            <select style={inputStyle} value={form.travelCompanion} onChange={e => set('travelCompanion', e.target.value)}>
                                {['all', 'solo', 'couple', 'family', 'friends'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 20px' }}>Package Details (one per line)</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        {[{ label: 'Highlights', key: 'highlights' }, { label: 'Inclusions', key: 'inclusions' }, { label: 'Exclusions', key: 'exclusions' }].map(({ label, key }) => (
                            <div key={key}>
                                <label style={labelStyle}>{label}</label>
                                <textarea style={{ ...inputStyle, height: '120px', resize: 'vertical' }} value={(form as any)[key]} onChange={e => set(key, e.target.value)} />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <label htmlFor="isActive" style={{ color: '#94a3b8', fontSize: '14px', cursor: 'pointer' }}>Active (visible to users)</label>
                </div>

                {error && <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px' }}>{error}</div>}

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" disabled={saving} style={{ padding: '12px 28px', borderRadius: '10px', border: 'none', background: 'linear-gradient(90deg, #0ea5e9 0%, #10b981 100%)', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Changes'}</button>
                    <Link href="/admin/packages" style={{ padding: '12px 24px', borderRadius: '10px', border: '1px solid #334155', color: '#94a3b8', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Cancel</Link>
                </div>
            </form>
        </div>
    );
}
