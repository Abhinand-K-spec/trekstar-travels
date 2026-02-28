'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { login } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Fix: authRoutes.js has /register and /login, and app.use('/api/auth', authRoutes)
        // Correct endpoints should be /auth/login and /auth/register relative to /api
        const endpoint = isLoginView ? '/auth/login' : '/auth/register';
        const payload = isLoginView ? { email, password } : { name, email, password };

        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL!;
            const res = await fetch(`${apiBaseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Authentication failed');
            }

            // Success! Store token and close modal
            login(data.token, data.data);
            onClose();

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content auth-modal auth-dark">
                {/* Entertaining background animation */}
                <div className="stardust-container">
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                    <div className="star"></div>
                </div>

                <button className="modal-close" onClick={onClose}>&times;</button>

                <h2 className="modal-title" style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#fff' }}>
                    {isLoginView ? 'Welcome Back' : 'Join TrekStar'}
                </h2>
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    {isLoginView
                        ? 'Sign in to access your saved travel packages and itineraries.'
                        : 'Create an account to start saving your personalized travel plans.'}
                </p>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                    {!isLoginView && (
                        <div>
                            <label className="auth-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Full Name</label>
                            <input
                                type="text"
                                className="auth-input dark-input"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="auth-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Email Address</label>
                        <input
                            type="email"
                            className="auth-input dark-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="auth-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Password</label>
                        <input
                            type="password"
                            className="auth-input dark-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-gold"
                        style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Please wait...' : (isLoginView ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', position: 'relative', zIndex: 1 }}>
                    {isLoginView ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => {
                            setIsLoginView(!isLoginView);
                            setError(null);
                        }}
                        style={{ color: 'var(--gold)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        {isLoginView ? 'Sign up' : 'Log in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
