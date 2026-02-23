'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Destination } from '@/types/types';

export default function DestinationsPage() {
    const router = useRouter();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await api.getTrendingDestinations();
                if (res.success && res.data) {
                    setDestinations(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch destinations', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--parchment)' }}>
            {/* Navbar */}
            <header className="navbar">
                <div className="navbar-inner">
                    <button onClick={() => router.push('/')} className="navbar-brand">
                        TrekStar<span className="navbar-brand-dot" />
                    </button>
                    <nav className="navbar-nav">
                        <button onClick={() => router.push('/')} className="navbar-link">Home</button>
                        <button onClick={() => router.push('/destinations')} className="navbar-link" style={{ color: 'var(--gold)', fontWeight: 600 }}>Destinations</button>
                        <button onClick={() => router.push('/onboarding')} className="btn-primary">
                            Plan a Trip
                        </button>
                    </nav>
                </div>
            </header>

            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 2rem 5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <p className="eyebrow" style={{ marginTop: '2rem' }}>Discover</p>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '3.5rem',
                        color: 'var(--navy)',
                        marginTop: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        Trending Destinations
                    </h1>
                    <p style={{ color: 'var(--ink-soft)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
                        Explore our handpicked curation of the world's most beautiful and culturally rich locations for your next luxury getaway.
                    </p>
                </div>

                {isLoading ? (
                    <div className="loading-spinner" style={{ margin: '4rem auto' }} />
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {destinations.map((dest, i) => (
                            <div key={dest.city + i} className="card-destination" style={{ overflow: 'hidden' }}>
                                <div className="card-destination-img-wrapper" style={{ height: '240px' }}>
                                    <Image
                                        src={dest.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                                        alt={dest.city}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="card-destination-img"
                                    />
                                </div>
                                <div className="card-destination-body" style={{ padding: '1.5rem', background: '#fff' }}>
                                    <h3 style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '1.5rem',
                                        color: 'var(--navy)',
                                        marginBottom: '0.4rem'
                                    }}>
                                        {dest.city}
                                    </h3>
                                    <p style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                        {dest.country}
                                    </p>
                                    <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {dest.description || `Experience the magic of ${dest.city}. Let TrekStar craft a personalized luxury itinerary tailored just for you.`}
                                    </p>
                                    <button
                                        onClick={() => router.push('/onboarding')}
                                        className="btn-gold"
                                        style={{ width: '100%', justifyContent: 'center' }}
                                    >
                                        Plan a trip here
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
