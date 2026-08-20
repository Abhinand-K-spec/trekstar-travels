'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

const moodColors: Record<string, string> = {
    relaxed: '#059669', adventure: '#ea580c', culture: '#7c3aed', foodie: '#db2777'
};
const moodBg: Record<string, string> = {
    relaxed: '#d1fae5', adventure: '#ffedd5', culture: '#ede9fe', foodie: '#fce7f3'
};

export default function PackagesPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const fetchPackages = async (mood = '') => {
        setLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL!;
            const q = mood ? `?mood=${mood}` : '';
            const res = await fetch(`${apiBase}/packages${q}`);
            const data = await res.json();
            if (data.success) setPackages(data.data || []);
        } catch {
            setPackages([]);
        }
        setLoading(false);
    };

    useEffect(() => { fetchPackages(); }, []);

    const handleFilterChange = (mood: string) => {
        const next = filter === mood ? '' : mood;
        setFilter(next);
        fetchPackages(next);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--parchment)' }}>
            {/* Navbar */}
            <header className="navbar" style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border-light)' }}>
                <div className="navbar-inner">
                    <button onClick={() => router.push('/')} className="navbar-brand">
                        TrekStar<span className="navbar-brand-dot" />
                    </button>
                    <nav className="navbar-nav">
                        <button onClick={() => router.push('/')} className="navbar-link">Home</button>
                        <button onClick={() => router.push('/destinations')} className="navbar-link">Destinations</button>
                        <button className="navbar-link" style={{ color: 'var(--gold)', fontWeight: 600 }}>Packages</button>
                        <button onClick={() => router.push('/visa')} className="navbar-link">Visa Services</button>
                        {isAuthenticated ? (
                            <div className="profile-dropdown-container">
                                <button className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                                    Hi, {user?.name?.split(' ')[0]} ▾
                                </button>
                                <div className="profile-dropdown-menu">
                                    <button onClick={() => router.push('/my-packages')} className="profile-dropdown-item">🎒 My Itineraries</button>
                                    <button onClick={logout} className="profile-dropdown-item" style={{ color: '#b91c1c' }}>🚪 Logout</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary">Sign In</button>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #1e3a5f 100%)', padding: '4rem 2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>
                    Curated by Experts
                </p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', marginBottom: '1rem' }}>
                    Travel Packages
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>
                    Handcrafted packages designed for every kind of traveller — from relaxed retreats to thrilling adventures.
                </p>
            </section>

            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
                {/* Mood filter */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--ink-soft)', fontSize: '0.875rem', fontWeight: 500 }}>Filter by mood:</span>
                    {['relaxed', 'adventure', 'culture', 'foodie'].map(mood => (
                        <button key={mood} onClick={() => handleFilterChange(mood)} style={{
                            padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                            textTransform: 'capitalize', border: '2px solid',
                            borderColor: filter === mood ? moodColors[mood] : 'var(--border-light)',
                            background: filter === mood ? moodBg[mood] : '#fff',
                            color: filter === mood ? moodColors[mood] : 'var(--ink-soft)',
                            transition: 'all 0.2s',
                        }}>{mood}</button>
                    ))}
                    {filter && (
                        <button onClick={() => handleFilterChange('')} style={{ padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: '0.85rem', border: '2px solid var(--border-light)', background: 'transparent', color: 'var(--ink-soft)' }}>
                            Clear ✕
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid-3">
                        {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 320 }} />)}
                    </div>
                ) : packages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: 16, border: '1px dashed var(--border-gold)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>No packages yet</h3>
                        <p style={{ color: 'var(--ink-soft)' }}>Check back soon — new packages are added regularly.</p>
                    </div>
                ) : (
                    <div className="grid-3">
                        {packages.map(pkg => (
                            <div 
                                key={pkg._id} 
                                className="card-destination cursor-pointer" 
                                style={{ display: 'flex', flexDirection: 'column' }}
                                onClick={() => router.push(`/packages/${pkg._id}`)}
                            >
                                <div style={{ padding: '1.5rem', flex: 1, background: '#fff' }}>
                                    {/* Mood badge */}
                                    <span style={{
                                        display: 'inline-block', marginBottom: '0.75rem',
                                        padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700,
                                        background: moodBg[pkg.travelMood] || '#f3f4f6',
                                        color: moodColors[pkg.travelMood] || '#6b7280',
                                        textTransform: 'capitalize',
                                    }}>{pkg.travelMood}</span>

                                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '0.2rem' }}>
                                        {pkg.title}
                                    </h3>
                                    <p style={{ color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                                        {pkg.destination?.city}, {pkg.destination?.country}
                                    </p>
                                    <p style={{
                                        color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem',
                                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                    }}>{pkg.description}</p>

                                    {/* Details row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                        {[
                                            { label: 'Duration', value: `${pkg.duration} Days` },
                                            { label: 'Best For', value: pkg.travelCompanion === 'all' ? 'Everyone' : pkg.travelCompanion },
                                            { label: 'Group Size', value: `Up to ${pkg.maxGroupSize}` },
                                            { label: 'Price', value: `$${pkg.price}/person` },
                                        ].map(({ label, value }) => (
                                            <div key={label}>
                                                <p style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                                                <p style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.9rem', textTransform: 'capitalize' }}>{value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Highlights */}
                                    {pkg.highlights?.length > 0 && (
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Highlights</p>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                {pkg.highlights.slice(0, 3).map((h: string, i: number) => (
                                                    <li key={i} style={{ fontSize: '0.85rem', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <span style={{ color: 'var(--gold)' }}>✦</span> {h}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <button
                                        className="btn-gold"
                                        style={{ width: '100%', justifyContent: 'center' }}
                                    >
                                        View Journey Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-inner">
                    <span className="footer-brand">TrekStar<span style={{ color: 'var(--gold)', marginLeft: 2 }}>.</span></span>
                    <p className="footer-copy">© 2026 TrekStar Travels. All rights reserved.</p>
                </div>
            </footer>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
}
