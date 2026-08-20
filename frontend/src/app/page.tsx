'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Compass, ArrowRight, Shield, Globe, Award, Sparkles, MapPin, Calendar, 
  DollarSign, Users, ChevronLeft, ChevronRight, CheckCircle2, FileText, 
  Clock, Lock, Plane, Star 
} from 'lucide-react';
import api from '@/lib/api';
import { Destination } from '@/types/types';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

// --- Storytelling Dest Data (Section 2) ---
const JOURNEY_STAGES = [
  { continent: 'ASIA', country: 'JAPAN', city: 'TOKYO', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1200' },
  { continent: 'EUROPE', country: 'SWITZERLAND', city: 'SWISS ALPS', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1200' },
  { continent: 'MIDDLE EAST', country: 'UAE', city: 'DUBAI', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200' }
];

// --- Trip Stories Data (Section 6) ---
const TRIP_DIARY = [
  { day: 'Day 1', title: 'Arrival in Tokyo', desc: 'Touchdown in Neon Metropolis. Dine in Omoide Yokocho and view Shibuya Crossing.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800' },
  { day: 'Day 2', title: 'Mt. Fuji Excursion', desc: 'Bullet train to Hakone. Relax in hot springs (Onsen) under the silhouette of Mt. Fuji.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800' },
  { day: 'Day 3', title: 'Kyoto Temples', desc: 'Wander through Arashiyama Bamboo Grove and the iconic red gates of Fushimi Inari.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800' },
  { day: 'Day 4', title: 'Osaka Culinary Feast', desc: 'Savor street eats in Dotonbori. Michelin-level Takoyaki and neon canal views.', image: 'https://images.unsplash.com/photo-1590250592965-021c323df04c?auto=format&fit=crop&q=80&w=800' }
];

// --- Testimonials Data (Section 10) ---
const TESTIMONIALS = [
  { name: 'Alexandra Vance', role: 'Adventure Enthusiast', quote: 'TrekStar customized my Alpine trek perfectly. The details, lodging, and pricing updates were completely seamless.', rating: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
  { name: 'Hiroshi Sato', role: 'Business Executive', quote: 'Their PR & Business Visa support was swift and highly professional. Unmatched customer onboarding and transparency.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Elena Rostova', role: 'Cultural Explorer', quote: 'From Tokyo temples to Dotonbori street food, Trekstar handled everything. Best premium travel designers out there.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }
];

export default function LandingPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [pkgs, setPkgs] = useState<any[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Travel Finder state
  const [findCity, setFindCity] = useState('Tokyo');
  const [findMonth, setFindMonth] = useState('October');
  const [findBudget, setFindBudget] = useState(4000);
  const [findCompanion, setFindCompanion] = useState('couple');

  // SVG Map flight path animations (India coords to various destinations)
  const [flightActivePath, setFlightActivePath] = useState(0);

  useEffect(() => {
    // Fetch packages
    const apiBase = process.env.NEXT_PUBLIC_API_URL!;
    fetch(`${apiBase}/packages?limit=3`)
      .then(r => r.json())
      .then(d => { if (d.success) setPkgs(d.data || []); })
      .catch(() => {});

    // Fetch trending destinations
    api.getTrendingDestinations()
      .then(res => { if (res.success && res.data) setDestinations(res.data); })
      .catch(() => {});
  }, []);

  const handleFinderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/onboarding?city=${findCity}&month=${findMonth}&budget=${findBudget}&companion=${findCompanion}`);
  };

  return (
    <div style={{ background: '#0a0f1d', color: '#f1f5f9', overflowX: 'hidden' }}>
      
      {/* ── Navbar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000,
        background: 'rgba(10, 15, 29, 0.65)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem' }}>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: "'Playfair Display', serif", color: '#fff' }} onClick={() => router.push('/')} className="cursor-pointer">
            TrekStar<span style={{ color: 'var(--gold)' }}>.</span>
          </span>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>Home</button>
            <button onClick={() => router.push('/destinations')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>Destinations</button>
            <button onClick={() => router.push('/packages')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>Packages</button>
            <button onClick={() => router.push('/visa')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>Visa Services</button>
            
            {isAuthenticated ? (
              <div style={{ position: 'relative' }} className="profile-dropdown-container">
                <button className="btn-gold" style={{ padding: '0.5rem 1.25rem', borderRadius: '30px' }}>
                  Hi, {user?.name?.split(' ')[0]} ▾
                </button>
                <div className="profile-dropdown-menu" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <button onClick={() => router.push('/my-packages')} className="profile-dropdown-item" style={{ color: '#fff' }}>🎒 My Packages</button>
                  <button onClick={logout} className="profile-dropdown-item" style={{ color: '#ef4444' }}>🚪 Logout</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="btn-gold" style={{ borderRadius: '30px', padding: '0.55rem 1.4rem' }}>
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* ── SECTION 1: Cinematic Hero ── */}
      <section className="zoom-parallax-container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "linear-gradient(to bottom, rgba(10,15,29,0.4) 0%, rgba(10,15,29,0.9) 100%), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=80')",
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1
        }} className="zoom-parallax-img" />
        <div style={{ zIndex: 10, maxWidth: 850, padding: '0 2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <p className="eyebrow" style={{ color: 'var(--gold)', letterSpacing: '0.3em', marginBottom: '1.25rem' }}>Premium Travel & Visa Designers</p>
            <h1 className="editorial-title" style={{ marginBottom: '1.5rem', textTransform: 'capitalize' }}>
              Where Will You Go Next?
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 650, margin: '0 auto 2.5rem' }}>
              Discover extraordinary destinations, unforgettable curated experiences, and completely hassle-free visa processing designed for global citizens.
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
              <button onClick={() => router.push('/onboarding')} className="btn-gold" style={{ padding: '0.9rem 2.2rem', borderRadius: '30px', fontSize: '0.95rem' }}>
                Explore Destinations <ArrowRight size={16} />
              </button>
              <button onClick={() => router.push('/visa')} className="btn-ghost" style={{ padding: '0.9rem 2.2rem', borderRadius: '30px', color: '#fff', borderColor: 'rgba(255,255,255,0.25)', fontSize: '0.95rem' }}>
                Get Visa Assistance
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <div style={{ width: '28px', height: '45px', borderRadius: '15px', border: '2px solid rgba(255,255,255,0.3)', position: 'relative', display: 'flex', justifyContent: 'center', padding: '6px' }}>
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              style={{ width: '4px', height: '8px', background: 'var(--gold)', borderRadius: '2px' }}
            />
          </div>
        </div>
      </section>


      {/* ── SECTION 2: Destination Journey (Storytelling Transition) ── */}
      <section style={{ background: '#0a0f1d' }}>
        {JOURNEY_STAGES.map((stage, idx) => (
          <div key={idx} style={{
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            {/* Parallax Background */}
            <motion.div
              initial={{ scale: 1.15, opacity: 0.3 }}
              whileInView={{ scale: 1.02, opacity: 0.65 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: 0,
                backgroundImage: `linear-gradient(to top, rgba(10,15,29,0.9) 0%, rgba(10,15,29,0.4) 50%, rgba(10,15,29,0.9) 100%), url('${stage.image}')`,
                backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1
              }}
            />
            
            {/* Content panel */}
            <div style={{ zIndex: 10, textAlign: 'center', maxWidth: 900, padding: '0 2rem' }}>
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase' }}>THE JOURNEY CONTINUES</span>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '1.5rem' }}>
                  {stage.continent}
                </p>
                <h2 style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#fff', textTransform: 'uppercase', lineHeight: 1.1, margin: '0.5rem 0' }}>
                  {stage.country}
                </h2>
                <p style={{ fontSize: '1.45rem', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'var(--gold)', marginTop: '0.5rem' }}>
                  Exploring {stage.city}
                </p>
              </motion.div>
            </div>
          </div>
        ))}
      </section>


      {/* ── SECTION 3: Interactive Destination Explorer (Horizontal Scroll) ── */}
      <section style={{ padding: '6rem 0', background: '#0a0f1d' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 2rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>Curated Collections</span>
            <h2 style={{ fontSize: '2.5rem', color: '#fff', marginTop: '0.5rem', fontWeight: 600 }}>Explore Global Marvels</h2>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 380, fontSize: '0.95rem' }}>
            Swipe or scroll horizontally to inspect handpicked destinations complete with custom schedules.
          </p>
        </div>

        {/* Horizontal scroll grid */}
        <div className="scroll-container-horizontal" style={{ padding: '0 2rem', gap: '2rem' }}>
          {destinations.map((dest, i) => (
            <div
              key={i}
              className="scroll-item-horizontal cursor-pointer group"
              style={{ width: '380px', position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '480px' }}
              onClick={() => router.push('/onboarding')}
            >
              <img
                src={dest.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'}
                alt={dest.city}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)' }}
                className="group-hover:scale-110"
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(10,15,29,0.95) 0%, rgba(10,15,29,0.3) 60%, transparent 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'end', padding: '2rem'
              }}>
                <div style={{ transform: 'translateY(15px)', transition: 'transform 0.4s ease' }} className="group-hover:translate-y-0">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>POPULAR PICK</span>
                  <h3 style={{ fontSize: '1.8rem', color: '#fff', margin: '0.25rem 0', fontFamily: "'Playfair Display', serif" }}>{dest.city}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>{dest.country}</p>
                  
                  {dest.description && (
                    <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, opacity: 0, transition: 'opacity 0.4s' }} className="group-hover:opacity-100">
                      {dest.description}
                    </p>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold)', fontSize: '0.9rem', marginTop: '1rem', fontWeight: 600 }}>
                    Plan a Journey <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ── SECTION 4: Trending Travel Packages ── */}
      <section style={{ padding: '8rem 2rem', background: '#070b14' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>Immersive Escapes</span>
            <h2 style={{ fontSize: '2.8rem', color: '#fff', fontFamily: "'Playfair Display', serif", marginTop: '0.5rem' }}>Trending Travel Packages</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0.5rem auto 0' }}>
              Handcrafted, all-inclusive packages curated by our travel designers for complete relaxation or high adventure.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem' }}>
            {pkgs.map((pkg) => (
              <motion.div
                key={pkg._id}
                whileHover={{ y: -12 }}
                style={{
                  background: 'rgba(30, 41, 59, 0.4)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)',
                  overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column'
                }}
                onClick={() => router.push(`/packages/${pkg._id}`)}
              >
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'}
                    alt={pkg.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(15,28,46,0.85)', padding: '5px 14px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase' }}>
                      {pkg.travelMood}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', color: '#fff', fontFamily: "'Playfair Display', serif", marginBottom: '0.25rem' }}>{pkg.title}</h3>
                    <p style={{ color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
                      📍 {pkg.destination?.city}, {pkg.destination?.country}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {pkg.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>⏱ {pkg.duration} Days</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>${pkg.price}<span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>/person</span></span>
                    </div>
                    
                    <button className="btn-gold" style={{ width: '100%', justifyContent: 'center', borderRadius: '30px' }}>
                      Explore Package details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ── SECTION 5: Travel Finder (Interactive Trip Planner) ── */}
      <section style={{ padding: '6rem 2rem', background: '#0a0f1d', position: 'relative' }}>
        <div style={{ maxWidth: 950, margin: '0 auto', background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '3.5rem', backdropFilter: 'blur(30px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>Interactive Matchmaker</span>
            <h2 style={{ fontSize: '2.4rem', color: '#fff', fontWeight: 600, marginTop: '0.4rem' }}>Find Your Ideal Trip</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', marginTop: '0.2rem' }}>Fill in details below for live custom recommendation match.</p>
          </div>

          <form onSubmit={handleFinderSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
            
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', display: 'block', marginBottom: '0.6rem' }}>
                <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} /> Destination City
              </label>
              <select
                value={findCity}
                onChange={e => setFindCity(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', outline: 'none' }}
              >
                <option value="Paris">Paris, France</option>
                <option value="Tokyo">Tokyo, Japan</option>
                <option value="Bali">Bali, Indonesia</option>
                <option value="Dubai">Dubai, UAE</option>
                <option value="Santorini">Santorini, Greece</option>
                <option value="Swiss Alps">Swiss Alps, Switzerland</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', display: 'block', marginBottom: '0.6rem' }}>
                <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} /> Travel Month
              </label>
              <select
                value={findMonth}
                onChange={e => setFindMonth(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', outline: 'none' }}
              >
                <option value="October">October</option>
                <option value="December">December</option>
                <option value="April">April</option>
                <option value="June">June</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', display: 'block', marginBottom: '0.6rem' }}>
                <DollarSign size={12} style={{ display: 'inline', marginRight: 4 }} /> Max Budget: ${findBudget}
              </label>
              <input
                type="range"
                min="1000"
                max="8000"
                step="500"
                value={findBudget}
                onChange={e => setFindBudget(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--gold)', height: '8px', borderRadius: '4px', background: '#111827', border: 'none', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', display: 'block', marginBottom: '0.6rem' }}>
                <Users size={12} style={{ display: 'inline', marginRight: 4 }} /> Companions
              </label>
              <select
                value={findCompanion}
                onChange={e => setFindCompanion(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', outline: 'none' }}
              >
                <option value="solo">Solo traveller</option>
                <option value="couple">Couple / Duo</option>
                <option value="family">Family Group</option>
                <option value="friends">Friends Group</option>
              </select>
            </div>

            <button type="submit" className="btn-gold" style={{ padding: '12px 24px', borderRadius: '12px', width: '100%', justifyContent: 'center', height: '46px', fontWeight: 700 }}>
              Search matching packages
            </button>
          </form>
        </div>
      </section>


      {/* ── SECTION 6: Trip Stories (Sticky Diary Scroll) ── */}
      <section style={{ padding: '8rem 2rem', background: '#070b14' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          <div>
            <div style={{ position: 'sticky', top: '150px' }}>
              <span className="eyebrow" style={{ color: 'var(--gold)' }}>Immersive Logbooks</span>
              <h2 style={{ fontSize: '2.8rem', color: '#fff', fontFamily: "'Playfair Display', serif", marginTop: '0.5rem', lineHeight: 1.2 }}>
                7 Days in Japan:<br />A Curated Chronicle
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.7, marginTop: '1.25rem', maxWidth: 440 }}>
                Trace an example route curated by our travel coordinators. Experience the contrast of traditional shrines and ultra-modern cityscape.
              </p>
              
              <button onClick={() => router.push('/onboarding')} className="btn-gold" style={{ marginTop: '2.5rem', padding: '0.8rem 1.8rem', borderRadius: '30px' }}>
                Build My Own story <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {TRIP_DIARY.map((d, index) => (
              <div key={index} style={{ background: 'rgba(30, 41, 59, 0.25)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', overflow: 'hidden' }}>
                <div style={{ height: '240px', overflow: 'hidden' }}>
                  <img src={d.image} alt={d.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '2rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d.day}</span>
                  <h3 style={{ fontSize: '1.4rem', color: '#fff', fontFamily: "'Playfair Display', serif", margin: '0.2rem 0 0.6rem' }}>{d.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: 1.6 }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── SECTION 7: Visa Services Experience ── */}
      <section style={{ padding: '8rem 2rem', background: '#0a0f1d' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--gold)' }}>Immigration Simplified</span>
              <h2 style={{ fontSize: '2.8rem', color: '#fff', fontFamily: "'Playfair Display', serif", marginTop: '0.5rem', lineHeight: 1.15 }}>
                Your Destination.<br />Your Visa. Sorted.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, marginTop: '1.25rem' }}>
                TrekStar coordinates visa document submission, embassy filings, and secure checklists for tourist, business, study, and permanent residency programs globally.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2.5rem' }}>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>99.2%</h4>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', marginTop: '0.25rem' }}>Approval success rate</p>
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>12+ days</h4>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textTransform: 'uppercase', marginTop: '0.25rem' }}>Avg processing speed</p>
                </div>
              </div>
            </div>

            {/* Step visualization progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              {[
                { step: '01', title: 'Select Country & Visa Category', desc: 'Identify eligibility rules and check custom checklists.' },
                { step: '02', title: 'Secure Document Upload', desc: 'Upload passport scans, financials, and logs through our encrypted hub.' },
                { step: '03', title: 'Attorney Verification', desc: 'TrekStar immigration attorneys review and stamp filings.' },
                { step: '04', title: 'Visa Approved & Sent', desc: 'Track updates and retrieve your verified travel visa.' }
              ].map((s, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1.5rem', background: 'rgba(30, 41, 59, 0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gold)', fontFamily: "'Playfair Display', serif" }}>{s.step}</span>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>{s.title}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.5, marginTop: '0.4rem', margin: '0.4rem 0 0' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ── SECTION 8: Why Travel With Us (Full Screen Panels) ── */}
      <section style={{ background: '#070b14' }}>
        {[
          { title: 'Curated Experiences', desc: 'We coordinate unique hotels, routes, and day activities tailored exclusively to your personal tastes and companion status. No cookie-cutter templates.', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200' },
          { title: 'Trusted Global Partners', desc: 'Every driver, local guide, and property owner is verified and monitored by TrekStar to maintain premium quality standard.', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200' },
          { title: 'Fast Legal Visa Filings', desc: 'Our immigration desk works directly with embassies to submit documents securely, maintaining high PR and tourist visa success rates.', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200' }
        ].map((panel, idx) => (
          <div key={idx} style={{
            height: '100vh', display: 'flex', alignItems: 'center', position: 'relative',
            overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            {/* Parallax Background */}
            <motion.div
              initial={{ scale: 1.15, opacity: 0.3 }}
              whileInView={{ scale: 1, opacity: 0.65 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: 0,
                backgroundImage: `linear-gradient(to right, rgba(7,11,20,0.95) 0%, rgba(7,11,20,0.8) 50%, rgba(7,11,20,0.4) 100%), url('${panel.img}')`,
                backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1
              }}
            />
            
            <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 2rem', zIndex: 10 }}>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ maxWidth: 500 }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>DIFFERENCE {idx + 1}</span>
                <h2 style={{ fontSize: '3rem', color: '#fff', fontFamily: "'Playfair Display', serif", margin: '0.5rem 0 1.25rem' }}>{panel.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.7 }}>{panel.desc}</p>
                
                <button onClick={() => router.push('/onboarding')} className="btn-gold" style={{ marginTop: '2rem', padding: '0.75rem 1.6rem', borderRadius: '30px' }}>
                  Experience the Luxury
                </button>
              </motion.div>
            </div>
          </div>
        ))}
      </section>


      {/* ── SECTION 9: Global Flight Route Map Animation ── */}
      <section style={{ padding: '8rem 2rem', background: '#0a0f1d', textAlign: 'center' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>Flight Network Visualizer</span>
          <h2 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: 600, marginTop: '0.5rem' }}>Dynamic Global Flight Paths</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 460, margin: '0.4rem auto 3rem', fontSize: '0.95rem' }}>
            Click active flight routes below to visualize our direct corporate and tourist flight coordination pathways from India.
          </p>

          {/* Map & route navigation */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            {['India ➔ Japan', 'India ➔ Europe', 'India ➔ Thailand', 'India ➔ Dubai'].map((route, i) => (
              <button
                key={i}
                onClick={() => setFlightActivePath(i)}
                style={{
                  padding: '10px 20px', borderRadius: '30px', border: '1px solid',
                  borderColor: flightActivePath === i ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                  background: flightActivePath === i ? 'rgba(201,168,76,0.15)' : 'rgba(30,41,59,0.3)',
                  color: flightActivePath === i ? 'var(--gold)' : 'rgba(255,255,255,0.7)',
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s'
                }}
              >
                ✈️ {route}
              </button>
            ))}
          </div>

          {/* SVG Map mockup with actual coordinates and animations */}
          <div style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 1000 500" style={{ width: '100%', height: 'auto', background: '#0a0f1d' }}>
              
              {/* World outline dots / grid mockup */}
              <circle cx="200" cy="150" r="2" fill="rgba(255,255,255,0.1)" />
              <circle cx="450" cy="220" r="3" fill="rgba(255,255,255,0.25)" /> {/* India */}
              <text x="445" y="245" fill="rgba(255,255,255,0.7)" fontSize="12" fontWeight="700">INDIA</text>
              
              {/* Active Flight Routes paths */}
              {flightActivePath === 0 && (
                <>
                  <path id="route-japan" d="M 450 220 Q 620 120 780 180" fill="none" stroke="var(--gold)" strokeWidth="2.5" className="flight-path" />
                  <circle cx="780" cy="180" r="6" fill="#10b981" />
                  <text x="770" y="205" fill="#fff" fontSize="11" fontWeight="700">JAPAN</text>
                </>
              )}

              {flightActivePath === 1 && (
                <>
                  <path id="route-europe" d="M 450 220 Q 300 130 200 160" fill="none" stroke="var(--gold)" strokeWidth="2.5" className="flight-path" />
                  <circle cx="200" cy="160" r="6" fill="#10b981" />
                  <text x="180" y="185" fill="#fff" fontSize="11" fontWeight="700">EUROPE</text>
                </>
              )}

              {flightActivePath === 2 && (
                <>
                  <path id="route-thailand" d="M 450 220 Q 520 250 590 280" fill="none" stroke="var(--gold)" strokeWidth="2.5" className="flight-path" />
                  <circle cx="590" cy="280" r="6" fill="#10b981" />
                  <text x="575" y="305" fill="#fff" fontSize="11" fontWeight="700">THAILAND</text>
                </>
              )}

              {flightActivePath === 3 && (
                <>
                  <path id="route-dubai" d="M 450 220 Q 380 200 320 210" fill="none" stroke="var(--gold)" strokeWidth="2.5" className="flight-path" />
                  <circle cx="320" cy="210" r="6" fill="#10b981" />
                  <text x="300" y="235" fill="#fff" fontSize="11" fontWeight="700">DUBAI</text>
                </>
              )}
            </svg>
            <div style={{ position: 'absolute', bottom: '1.25rem', right: '1.25rem', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>
              <Lock size={12} /> Encrypted Routing Visualization
            </div>
          </div>
        </div>
      </section>


      {/* ── SECTION 10: Testimonials (Travel Memories) ── */}
      <section style={{ padding: '8rem 2rem', background: '#070b14' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="eyebrow" style={{ color: 'var(--gold)' }}>TESTIMONIALS</span>
            <h2 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: 600, marginTop: '0.5rem' }}>Traveler Memories</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>Hear from guests who booked customized itineraries and visa filings through us.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} style={{ background: 'rgba(30, 41, 59, 0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem' }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" />
                    ))}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '2rem' }}>
                    "{t.quote}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={t.avatar} alt={t.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: 0 }}>{t.name}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── SECTION 11: Final Conversion Section ── */}
      <section style={{
        height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative',
        backgroundImage: "linear-gradient(to top, rgba(10,15,29,0.95) 0%, rgba(10,15,29,0.7) 100%), url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1600')",
        backgroundSize: 'cover', backgroundPosition: 'center', borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: 750, padding: '0 2rem', zIndex: 10 }}>
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>START YOUR VOYAGE</span>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#fff', margin: '0.5rem 0 1.5rem', lineHeight: 1.1 }}>
            Your Next Adventure Starts Here.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 550, margin: '0 auto 2.5rem' }}>
            Book custom travel routes and document approvals with direct coordinate mapping from the travel experts.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => router.push('/onboarding')} className="btn-gold" style={{ padding: '0.85rem 2rem', borderRadius: '30px' }}>
              Plan My Journey
            </button>
            <button onClick={() => router.push('/visa')} className="btn-ghost" style={{ padding: '0.85rem 2rem', borderRadius: '30px', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
              Apply For Visa
            </button>
          </div>
        </div>
      </section>


      {/* ── Footer ── */}
      <footer style={{ background: '#070b14', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: "'Playfair Display', serif", color: '#fff' }}>
              TrekStar<span style={{ color: 'var(--gold)' }}>.</span>
            </span>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              © 2026 TrekStar Tours and Travels Private Limited. All rights reserved.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <button onClick={() => router.push('/admin/login')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
              🔑 Admin Portal
            </button>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
