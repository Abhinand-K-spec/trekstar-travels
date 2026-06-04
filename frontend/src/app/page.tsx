'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Destination } from '@/types/types';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

const WHY = [
  { icon: '🗺️', title: 'Tailored Itineraries', desc: 'Every plan is crafted around your travel style, budget, and travel dates — nothing generic.' },
  { icon: '🏨', title: 'Curated Stays', desc: 'We surface the finest hotels and boutique properties aligned with your preferences.' },
  { icon: '✈️', title: 'End-to-End Planning', desc: 'From flights to day activities, everything is planned so you just show up and enjoy.' },
];

const moodBg: Record<string, string> = {
  relaxed: '#d1fae5', adventure: '#ffedd5', culture: '#ede9fe', foodie: '#fce7f3'
};
const moodColor: Record<string, string> = {
  relaxed: '#059669', adventure: '#ea580c', culture: '#7c3aed', foodie: '#db2777'
};

function FeaturedPackages({ onAuthNeeded, isAuthenticated }: { onAuthNeeded: () => void; isAuthenticated: boolean }) {
  const router = useRouter();
  const [pkgs, setPkgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL!;
    fetch(`${apiBase}/packages?limit=3`)
      .then(r => r.json())
      .then(d => { if (d.success) setPkgs((d.data || []).slice(0, 3)); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid-3">{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 280 }} />)}</div>;
  if (!pkgs.length) return <p style={{ color: 'var(--ink-soft)', textAlign: 'center', padding: '2rem' }}>No packages available yet.</p>;

  return (
    <div className="grid-3">
      {pkgs.map(pkg => (
        <div key={pkg._id} className="card-destination" style={{ display: 'flex', flexDirection: 'column', cursor: 'default' }}>
          <div style={{ padding: '1.5rem', background: '#fff', flex: 1 }}>
            <span style={{
              display: 'inline-block', marginBottom: '0.6rem', padding: '2px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700,
              background: moodBg[pkg.travelMood] || '#f3f4f6', color: moodColor[pkg.travelMood] || '#6b7280', textTransform: 'capitalize'
            }}>
              {pkg.travelMood}
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: 'var(--navy)', marginBottom: '0.2rem' }}>{pkg.title}</h3>
            <p style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              {pkg.destination?.city}, {pkg.destination?.country}
            </p>
            <p style={{
              color: 'var(--ink-soft)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>{pkg.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--ink-soft)', fontSize: '0.82rem' }}>⏱ {pkg.duration} days</span>
              <span style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '1rem' }}>${pkg.price}<span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/person</span></span>
            </div>
            <button onClick={() => isAuthenticated ? router.push('/packages') : onAuthNeeded()} className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              {isAuthenticated ? 'View Package' : 'Sign In to Book'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    api.getTrendingDestinations()
      .then(res => { if (res.success && res.data) setDestinations(res.data); })
      .catch(() => { })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-inner">
          <span className="navbar-brand">
            TrekStar<span className="navbar-brand-dot" />
          </span>
          <nav className="navbar-nav">
            <a href="/" className="navbar-link">Home</a>
            <button onClick={() => router.push('/destinations')} className="navbar-link">Destinations</button>
            <button onClick={() => router.push('/packages')} className="navbar-link">Packages</button>
            <button onClick={() => router.push('/visa')} className="navbar-link">Visa Services</button>
            {isAuthenticated ? (
              <div className="profile-dropdown-container">
                <button className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                  Hi, {user?.name?.split(' ')[0]} ▾
                </button>
                <div className="profile-dropdown-menu">
                  <button onClick={() => router.push('/my-packages')} className="profile-dropdown-item">🎒 My Packages</button>
                  <button onClick={logout} className="profile-dropdown-item" style={{ color: '#b91c1c' }}>🚪 Logout</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary">
                  Sign In
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <p className="hero-eyebrow">Your Journey Awaits</p>
            <h1 className="hero-title">
              Travel Crafted<br /><em>For You</em>
            </h1>
            <p className="hero-subtitle">
              Tell us where you want to go and we'll build a day-by-day itinerary tailored to your style, companion, and budget.
            </p>
            <div className="hero-actions">
              <button onClick={() => router.push('/onboarding')} className="btn-gold">
                Plan My Trip
              </button>
              <button onClick={() => router.push('/destinations')} className="btn-ghost" style={{ color: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.2)' }}>
                Explore destinations
              </button>
            </div>
          </div>
          <div>
            <div className="hero-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80"
                alt="Beautiful travel destination"
                className="hero-img"
              />
              <div className="hero-img-badge">
                <span className="hero-img-badge-icon">✈️</span>
                <div>
                  <div className="hero-img-badge-text">500+ Destinations</div>
                  <div className="hero-img-badge-sub">Handpicked by our experts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <main className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Curated Picks</span>
            <h2 className="section-title">Trending Destinations</h2>
            <p className="section-subtitle">Popular picks from travelers around the world.</p>
          </div>
          <button onClick={() => router.push('/onboarding')} className="btn-ghost">
            Plan a trip
          </button>
        </div>

        {isLoading ? (
          <div className="grid-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 280 }} />)}
          </div>
        ) : (
          <div className="grid-3">
            {destinations.map((dest, i) => (
              <div
                key={dest.city + i}
                onClick={() => router.push('/onboarding')}
                className="card-destination"
              >
                <div style={{ overflow: 'hidden' }}>
                  <img
                    src={dest.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'}
                    alt={dest.city}
                    className="card-destination-img"
                  />
                </div>
                <div className="card-destination-body">
                  <div className="card-destination-city">{dest.city}</div>
                  <div className="card-destination-country">{dest.country}</div>
                  {dest.description && (
                    <p className="card-destination-desc">{dest.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Featured Packages */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="section-header">
          <div>
            <span className="eyebrow">Admin Curated</span>
            <h2 className="section-title">Featured Packages</h2>
            <p className="section-subtitle">Ready-made trips crafted by our travel experts.</p>
          </div>
          <button onClick={() => router.push('/packages')} className="btn-ghost">View all packages</button>
        </div>
        <FeaturedPackages onAuthNeeded={() => setIsAuthModalOpen(true)} isAuthenticated={isAuthenticated} />
      </section>

      {/* Why TrekStar */}
      <section className="why-section">
        <div className="why-inner">
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>Why TrekStar</span>
          <h2 className="why-title">Travel, perfected.</h2>
          <p className="why-subtitle">Everything you need for a seamless journey.</p>
          <div className="why-grid">
            {WHY.map((w, i) => (
              <div key={i} className="why-card">
                <span className="why-icon">{w.icon}</span>
                <h4 className="why-card-title">{w.title}</h4>
                <p className="why-card-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
