'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Users, Shield, CheckCircle, XCircle, 
  MapPin, Clock, DollarSign, Award, Heart, Share2, Compass, Play
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

export default function PackageDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;
  const { user, isAuthenticated, logout } = useAuth();

  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [travelersCount, setTravelersCount] = useState(2);
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!packageId) return;
    const apiBase = process.env.NEXT_PUBLIC_API_URL!;
    fetch(`${apiBase}/packages/${packageId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setPkg(data.data);
        } else {
          router.push('/packages');
        }
      })
      .catch(() => {
        router.push('/packages');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [packageId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!bookingDate) return;
    
    router.push(`/packages/${packageId}/booking?date=${bookingDate}&travelers=${travelersCount}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0f1d', color: '#f1f5f9' }}>
        <Compass className="animate-spin" size={48} style={{ color: 'var(--gold)' }} />
        <p style={{ marginTop: '1rem', letterSpacing: '0.15em', fontSize: '0.9rem' }}>LOADING EXPEDITION DETAILS...</p>
      </div>
    );
  }

  if (!pkg) return null;

  // Generate dynamic day-by-day plans based on highlights and duration
  const durationDays = pkg.duration || 5;
  const itineraryDays = Array.from({ length: durationDays }).map((_, idx) => {
    const dayNum = idx + 1;
    let title = `Exploring ${pkg.destination?.city}`;
    let desc = `Experience the best of local attractions and hidden gems in ${pkg.destination?.city}.`;
    
    if (dayNum === 1) {
      title = 'Arrival & Grand Check-in';
      desc = `Touchdown and transfers to your premium accommodation. Enjoy a leisurely evening exploring surrounding neighborhoods.`;
    } else if (dayNum === durationDays) {
      title = 'Farewell & Departures';
      desc = `Final souvenir shopping and transfer back to the airport for your flight home.`;
    } else if (pkg.highlights?.[idx - 1]) {
      title = pkg.highlights[idx - 1];
      desc = `Dedicated day to experience: ${pkg.highlights[idx - 1]}. Led by our certified local travel guide with private premium transfers.`;
    }
    
    return { day: `Day ${dayNum}`, title, desc };
  });

  const totalPrice = pkg.price * travelersCount;

  return (
    <div style={{ background: '#0a0f1d', color: '#f1f5f9', minHeight: '100vh', paddingBottom: '120px' }}>
      
      {/* ── Navbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: 'rgba(10, 15, 29, 0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Playfair Display', serif", cursor: 'pointer' }}>
            TrekStar<span style={{ color: 'var(--gold)' }}>.</span>
          </button>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <button onClick={() => router.push('/')} className="navbar-link">Home</button>
            <button onClick={() => router.push('/destinations')} className="navbar-link">Destinations</button>
            <button onClick={() => router.push('/packages')} className="navbar-link" style={{ color: 'var(--gold)' }}>Packages</button>
            <button onClick={() => router.push('/visa')} className="navbar-link">Visa Services</button>
            {isAuthenticated ? (
              <button className="btn-gold" style={{ borderRadius: '30px', padding: '0.5rem 1.2rem' }}>
                Hi, {user?.name?.split(' ')[0]}
              </button>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary" style={{ borderRadius: '30px', padding: '0.5rem 1.2rem' }}>
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* ── Cinematic Hero Banner ── */}
      <section style={{ position: 'relative', height: '65vh', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(to top, #0a0f1d 0%, rgba(10, 15, 29, 0.1) 60%, rgba(10, 15, 29, 0.7) 100%), url('${pkg.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200'}')`,
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        
        <div style={{ position: 'absolute', bottom: '3rem', left: 0, width: '100%' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
            <div>
              <button onClick={() => router.push('/packages')} style={{ background: 'rgba(10,15,29,0.85)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '1.5rem', transition: 'background 0.2s' }}>
                <ArrowLeft size={14} /> Back to Directory
              </button>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.8rem' }}>
                <span style={{ background: 'var(--gold)', color: '#000', fontSize: '0.72rem', fontWeight: 800, padding: '3px 12px', borderRadius: '30px', textTransform: 'uppercase' }}>
                  {pkg.travelMood}
                </span>
                <span style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', borderRadius: '30px', textTransform: 'uppercase', backdropFilter: 'blur(5px)' }}>
                  🧑‍🤝‍🧑 {pkg.travelCompanion === 'all' ? 'All Travellers' : pkg.travelCompanion}
                </span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1.1, margin: 0 }}>
                {pkg.title}
              </h1>
              <p style={{ color: 'var(--gold)', fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem' }}>
                <MapPin size={16} /> {pkg.destination?.city}, {pkg.destination?.country}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setIsLiked(!isLiked)} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(10,15,29,0.8)', border: '1px solid rgba(255,255,255,0.15)', color: isLiked ? '#ef4444' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                <Heart size={20} fill={isLiked ? '#ef4444' : 'none'} style={{ margin: 'auto' }} />
              </button>
              <button style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(10,15,29,0.8)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Share2 size={20} style={{ margin: 'auto' }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content grid ── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem 0', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem' }}>
        
        {/* Left Side: Editorial Timeline & Info */}
        <div>
          <div style={{ marginBottom: '3.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
              Journey Overview
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
              {pkg.description}
            </p>
          </div>

          {/* Key Facts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3.5rem', background: 'rgba(30, 41, 59, 0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem 2rem', borderRadius: '20px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>DURATION</span>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)', marginTop: '0.2rem' }}>{pkg.duration} Days</p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GROUP SIZE</span>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)', marginTop: '0.2rem' }}>Up to {pkg.maxGroupSize} People</p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SUPPORT</span>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)', marginTop: '0.2rem' }}>24/7 Expert Help</p>
            </div>
          </div>

          {/* Animated Itinerary Timeline */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 600, marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
              Day-by-Day Timeline
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', borderLeft: '2px solid rgba(255,255,255,0.08)', paddingLeft: '2rem', marginLeft: '0.5rem' }}>
              {itineraryDays.map((d, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute', left: '-2.4rem', top: '5px', width: '12px', height: '12px',
                    borderRadius: '50%', background: 'var(--gold)', border: '4px solid #0a0f1d'
                  }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {d.day}
                    </span>
                    <h4 style={{ fontSize: '1.2rem', color: '#fff', margin: '0.2rem 0 0.5rem', fontFamily: "'Playfair Display', serif" }}>
                      {d.title}
                    </h4>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {d.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} style={{ color: '#10b981' }} /> Inclusions
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: 0, listStyle: 'none' }}>
                {(pkg.inclusions?.length ? pkg.inclusions : ['Premium 4/5 Star Hotels', 'Private Transfers throughout', 'Daily buffet breakfasts', 'All sightseeing & guide entry fees']).map((inc: string, i: number) => (
                  <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>
                    <span style={{ color: '#10b981' }}>✓</span> {inc}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <XCircle size={18} style={{ color: '#ef4444' }} /> Exclusions
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: 0, listStyle: 'none' }}>
                {(pkg.exclusions?.length ? pkg.exclusions : ['International flight tickets', 'Travel medical insurance', 'Optional activity tip charges', 'Personal laundry & items']).map((exc: string, i: number) => (
                  <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>
                    <span style={{ color: '#ef4444' }}>✕</span> {exc}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Photo Gallery */}
          {pkg.images?.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem' }}>
                Gallery
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
                <div style={{ height: '320px', borderRadius: '16px', overflow: 'hidden' }}>
                  <img src={pkg.images[0]} alt="Scenic view" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1.25rem', height: '320px' }}>
                  {pkg.images.slice(1, 3).map((img: string, i: number) => (
                    <div key={i} style={{ borderRadius: '16px', overflow: 'hidden' }}>
                      <img src={img} alt="Sightseeing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Sidebar Booking Widget */}
        <div>
          <div style={{ position: 'sticky', top: '120px', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 700, margin: 0 }}>Secure Your Spot</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.2rem' }}>Select date and travellers to see pricing</p>
            
            <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '1.5rem 0' }} />

            {formSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={48} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.2rem', color: '#fff' }}>Booking Initiated!</h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  A TrekStar designer has received your request. We will email you with your custom visa checklist and flight itinerary details shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Departure Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Number of Travellers
                  </label>
                  <select
                    value={travelersCount}
                    onChange={e => setTravelersCount(Number(e.target.value))}
                    style={{ width: '100%', padding: '12px 14px', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>Starting Price</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold)' }}>${pkg.price} <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>/person</span></span>
                </div>

                <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', height: '48px', borderRadius: '12px', fontWeight: 700 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Processing Request...' : isAuthenticated ? 'Reserve This Package' : 'Sign In to Book'}
                </button>

                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textAlign: 'center', margin: 0 }}>
                  🛡️ 100% Secure Transaction. 24h Free Cancellation.
                </p>
              </form>
            )}

          </div>
        </div>

      </main>

      {/* ── Sticky Bottom Booking Bar ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 900,
        background: 'rgba(10, 15, 29, 0.9)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem 2rem'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>TOTAL COST ({travelersCount} Travelers)</span>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              ${totalPrice} <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>USD</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>DEPARTURE CITY</span>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--gold)', margin: 0 }}>New York / Delhi</p>
            </div>
            
            <button
              onClick={() => {
                if (formSuccess) return;
                const form = document.querySelector('form');
                if (form) form.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-gold"
              style={{ padding: '0.85rem 2rem', borderRadius: '30px', fontWeight: 700 }}
            >
              {formSuccess ? 'Request Submitted' : 'Book Adventure Now'}
            </button>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
