'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api'}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!data.success) {
                setError(data.message || 'Login failed');
                setLoading(false);
                return;
            }

            if (data.data?.role !== 'admin') {
                setError('Access denied. Admin accounts only.');
                setLoading(false);
                return;
            }

            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('admin_user', JSON.stringify(data.data));
            router.push('/admin');
        } catch {
            setError('Network error. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Background decoration */}
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
            </div>

            <div style={{
                background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148,163,184,0.1)', borderRadius: '20px',
                padding: '48px', width: '100%', maxWidth: '420px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '28px', fontWeight: '800', color: 'white',
                        boxShadow: '0 8px 24px rgba(14,165,233,0.3)',
                    }}>T</div>
                    <h1 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: '700', margin: '0 0 8px' }}>Admin Panel</h1>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>TrekStar Tours & Travels</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Email Address</label>
                        <input
                            type="email"
                            id="admin-email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@trekstar.com"
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '10px',
                                background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(148,163,184,0.15)',
                                color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                                transition: 'border-color 0.2s',
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Password</label>
                        <input
                            type="password"
                            id="admin-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '10px',
                                background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(148,163,184,0.15)',
                                color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        id="admin-login-btn"
                        disabled={loading}
                        style={{
                            padding: '14px', borderRadius: '10px', border: 'none',
                            background: loading ? '#334155' : 'linear-gradient(90deg, #0ea5e9 0%, #10b981 100%)',
                            color: 'white', fontSize: '15px', fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 15px rgba(14,165,233,0.3)',
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In to Admin'}
                    </button>
                </form>
            </div>
        </div>
    );
}
