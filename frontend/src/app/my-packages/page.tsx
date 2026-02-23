'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Itinerary } from '@/types/types';

export default function MyPackagesPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, token, logout } = useAuth();
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        const fetchItineraries = async () => {
            if (!token) return;
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';
                const res = await fetch(`${apiBaseUrl}/itineraries/my-packages`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await res.json();

                if (data.success) {
                    setItineraries(data.data);
                } else {
                    setError('Failed to load packages');
                }
            } catch (err) {
                console.error(err);
                setError('Could not connect to server.');
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchItineraries();
        }
    }, [isAuthenticated, token]);

    if (authLoading || (!isAuthenticated && isLoading)) {
        return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="loading-spinner" /></div>;
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--parchment)' }}>
            {/* Navbar */}
            <header className="navbar" style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-light)' }}>
                <div className="navbar-inner">
                    <button onClick={() => router.push('/')} className="navbar-brand">
                        TrekStar<span className="navbar-brand-dot" />
                    </button>
                    <nav className="navbar-nav">
                        <button onClick={() => router.push('/')} className="navbar-link">Home</button>
                        <button onClick={() => router.push('/destinations')} className="navbar-link">Destinations</button>

                        <div className="profile-dropdown-container">
                            <button className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                                Hi, {user?.name?.split(' ')[0]} ▾
                            </button>
                            <div className="profile-dropdown-menu">
                                <button onClick={() => router.push('/my-packages')} className="profile-dropdown-item" style={{ color: 'var(--gold)' }}>🎒 My Packages</button>
                                <button onClick={logout} className="profile-dropdown-item" style={{ color: '#b91c1c' }}>🚪 Logout</button>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 2rem' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'var(--navy)' }}>My Travel Packages</h1>
                    <p style={{ color: 'var(--ink-soft)', marginTop: '0.5rem', fontSize: '1.05rem' }}>View and manage your saved itineraries.</p>
                </div>

                {error && <div style={{ color: '#b91c1c', background: '#fee2e2', padding: '1rem', borderRadius: 8, marginBottom: '2rem' }}>{error}</div>}

                {isLoading && (
                    <div className="loading-spinner" style={{ margin: '4rem auto' }} />
                )}

                {!isLoading && itineraries.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: 16, border: '1px dashed var(--border-gold)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎒</div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>No packages yet</h3>
                        <p style={{ color: 'var(--ink-soft)', marginBottom: '2rem' }}>Looks like you haven't created any travel itineraries yet.</p>
                        <button onClick={() => router.push('/onboarding')} className="btn-gold">
                            Plan a New Trip
                        </button>
                    </div>
                )}

                {!isLoading && itineraries.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                        {itineraries.map(it => (
                            <div key={it._id} className="card-destination" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '1.5rem', flex: 1, background: '#fff' }}>
                                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>
                                        {it.destination.city}
                                    </h3>
                                    <p style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
                                        {it.destination.country}
                                    </p>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Duration</p>
                                            <p style={{ fontWeight: 500, color: 'var(--navy)' }}>{it.duration} Days</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Month</p>
                                            <p style={{ fontWeight: 500, color: 'var(--navy)' }}>{it.travelMonth}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Style</p>
                                            <p style={{ fontWeight: 500, color: 'var(--navy)', textTransform: 'capitalize' }}>{it.travelMood}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>Est. Cost</p>
                                            <p style={{ fontWeight: 500, color: 'var(--navy)' }}>${it.pricing?.total}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/itinerary/${it._id}`)}
                                        className="btn-gold"
                                        style={{ width: '100%', justifyContent: 'center' }}
                                    >
                                        View Full Itinerary
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
