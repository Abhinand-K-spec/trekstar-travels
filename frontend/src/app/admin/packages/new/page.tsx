'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewPackagePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        title: '',
        'destination.city': '',
        'destination.country': '',
        duration: 3,
        description: '',
        price: 0,
        maxGroupSize: 10,
        travelMood: 'relaxed',
        travelCompanion: 'all',
        highlights: '',
        inclusions: '',
        exclusions: '',
        isActive: true,
    });

    const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.title || !form['destination.city'] || !form['destination.country'] || !form.description || !form.price) {
            setError('Please fill all required fields.');
            return;
        }
        setSaving(true);
        const payload = {
            title: form.title,
            destination: { city: form['destination.city'], country: form['destination.country'] },
            duration: Number(form.duration),
            description: form.description,
            price: Number(form.price),
            maxGroupSize: Number(form.maxGroupSize),
            travelMood: form.travelMood,
            travelCompanion: form.travelCompanion,
            highlights: form.highlights.split('\n').filter(Boolean),
            inclusions: form.inclusions.split('\n').filter(Boolean),
            exclusions: form.exclusions.split('\n').filter(Boolean),
            isActive: form.isActive,
        };
        const res = await api.adminCreatePackage(payload);
        if (res.success) {
            router.push('/admin/packages');
        } else {
            setError(res.error || 'Failed to create package');
            setSaving(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link href="/admin/packages" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none' }}>← Packages</Link>
                <h1 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: '700', margin: 0 }}>New Package</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Basic Info */}
                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 20px' }}>Basic Information</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={labelStyle}>Package Title *</label>
                            <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Tropical Bali Retreat" />
                        </div>
                        <div>
                            <label style={labelStyle}>City *</label>
                            <input style={inputStyle} value={form['destination.city']} onChange={e => set('destination.city', e.target.value)} placeholder="Bali" />
                        </div>
                        <div>
                            <label style={labelStyle}>Country *</label>
                            <input style={inputStyle} value={form['destination.country']} onChange={e => set('destination.country', e.target.value)} placeholder="Indonesia" />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={labelStyle}>Description *</label>
                            <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe this package..." />
                        </div>
                    </div>
                </div>

                {/* Pricing & Duration */}
                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 20px' }}>Pricing & Duration</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Price per Person (USD) *</label>
                            <input type="number" style={inputStyle} value={form.price} onChange={e => set('price', e.target.value)} placeholder="999" min={0} />
                        </div>
                        <div>
                            <label style={labelStyle}>Duration (days) *</label>
                            <input type="number" style={inputStyle} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="7" min={1} />
                        </div>
                        <div>
                            <label style={labelStyle}>Max Group Size</label>
                            <input type="number" style={inputStyle} value={form.maxGroupSize} onChange={e => set('maxGroupSize', e.target.value)} placeholder="10" min={1} />
                        </div>
                    </div>
                </div>

                {/* Travel Details */}
                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 20px' }}>Travel Details</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Travel Mood</label>
                            <select style={inputStyle} value={form.travelMood} onChange={e => set('travelMood', e.target.value)}>
                                <option value="relaxed">Relaxed</option>
                                <option value="adventure">Adventure</option>
                                <option value="culture">Culture</option>
                                <option value="foodie">Foodie</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Best For</label>
                            <select style={inputStyle} value={form.travelCompanion} onChange={e => set('travelCompanion', e.target.value)}>
                                <option value="all">All</option>
                                <option value="solo">Solo</option>
                                <option value="couple">Couple</option>
                                <option value="family">Family</option>
                                <option value="friends">Friends</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Highlights, Inclusions, Exclusions */}
                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', padding: '24px', border: '1px solid #1e293b' }}>
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: '0 0 20px' }}>Package Details (one per line)</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        {[
                            { label: 'Highlights', key: 'highlights', placeholder: 'Sunset cruise\nTemple visits\n...' },
                            { label: 'Inclusions', key: 'inclusions', placeholder: 'Flights\nHotel (5 nights)\n...' },
                            { label: 'Exclusions', key: 'exclusions', placeholder: 'Travel insurance\nPersonal expenses\n...' },
                        ].map(({ label, key, placeholder }) => (
                            <div key={key}>
                                <label style={labelStyle}>{label}</label>
                                <textarea style={{ ...inputStyle, height: '120px', resize: 'vertical' }} value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <label htmlFor="isActive" style={{ color: '#94a3b8', fontSize: '14px', cursor: 'pointer' }}>Active (visible to users)</label>
                </div>

                {error && <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px' }}>{error}</div>}

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" disabled={saving} style={{
                        padding: '12px 28px', borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(90deg, #0ea5e9 0%, #10b981 100%)',
                        color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
                    }}>{saving ? 'Creating...' : 'Create Package'}</button>
                    <Link href="/admin/packages" style={{ padding: '12px 24px', borderRadius: '10px', border: '1px solid #334155', color: '#94a3b8', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Cancel</Link>
                </div>
            </form>
        </div>
    );
}
