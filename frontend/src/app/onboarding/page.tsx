'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTripContext } from '@/context/TripContext';
import { Destination } from '@/types/types';
import api from '@/lib/api';

const popularDestinations: Destination[] = [
    { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800' },
    { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800' },
    { city: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800' },
    { city: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800' },
    { city: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800' },
    { city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800' },
];

const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

const COMPANIONS = [
    { value: 'solo', label: 'Solo', emoji: '🧑', desc: 'Just me' },
    { value: 'couple', label: 'Couple', emoji: '💑', desc: 'Me & my partner' },
    { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', desc: 'Family trip' },
    { value: 'friends', label: 'Friends', emoji: '👥', desc: 'Group of friends' },
];

const MOODS = [
    { value: 'relaxed', label: 'Relaxed & Chill', emoji: '🏖️', desc: 'Beaches, spas, slow mornings' },
    { value: 'adventure', label: 'Adventure', emoji: '🏔️', desc: 'Hiking, sports, the wild' },
    { value: 'culture', label: 'Cultural', emoji: '🎨', desc: 'Museums, history, local life' },
    { value: 'foodie', label: 'Foodie', emoji: '🍜', desc: 'Markets, restaurants, tastings' },
];

// Step labels — step 2b (group size) is an inline sub-step, not counted in progress
const STEP_LABELS = ['Destination & Dates', 'Travel Party', 'Your Style', 'Budget & Departure'];

// Companions that require group size info
const GROUP_COMPANIONS = ['family', 'friends'];

export default function OnboardingPage() {
    const router = useRouter();
    const { preferences, updatePreferences, setItinerary, setIsLoading } = useTripContext();

    // Main wizard step (1–4)
    const [step, setStep] = useState(1);
    // Whether we're in the group-size sub-step (between step 2 and 3)
    const [askGroupSize, setAskGroupSize] = useState(false);

    // Validation toast message
    const [toast, setToast] = useState<string | null>(null);
    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // Step 1
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(preferences.destination);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [month, setMonth] = useState(preferences.travelMonth);
    const [duration, setDuration] = useState(preferences.duration || 7);

    // Step 2
    const [companion, setCompanion] = useState(preferences.travelCompanion);
    const [groupSize, setGroupSize] = useState<number>(preferences.groupSize ?? 3);

    // Step 3
    const [mood, setMood] = useState(preferences.travelMood);

    // Step 4
    const [budgetMin, setBudgetMin] = useState(preferences.budget.min || 1000);
    const [budgetMax, setBudgetMax] = useState(preferences.budget.max || 5000);
    const [departureCity, setDepartureCity] = useState(preferences.departureCity || '');

    const filtered = popularDestinations.filter(d =>
        d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Navigation logic --
    const isStepValid = () => {
        if (askGroupSize) return groupSize >= 2;
        switch (step) {
            case 1: return !!selectedDestination && !!month && duration > 0;
            case 2: return !!companion;
            case 3: return !!mood;
            case 4: return !!departureCity && departureCity.trim().length > 0 && budgetMin < budgetMax;
            default: return false;
        }
    };
    const canContinue = isStepValid();

    const handleNext = () => {
        if (!canContinue) {
            if (askGroupSize) {
                showToast('Please specify how many people are travelling.');
            } else {
                switch (step) {
                    case 1: showToast('Please select a destination and your travel month.'); break;
                    case 2: showToast('Please select who you are travelling with.'); break;
                    case 3: showToast('Please select your preferred travel style.'); break;
                    case 4: showToast('Please enter your departure city.'); break;
                }
            }
            return;
        }

        if (step === 2 && !askGroupSize && GROUP_COMPANIONS.includes(companion)) {
            // Companion chosen is family/friends → go to group size sub-step first
            setAskGroupSize(true);
            return;
        }
        if (askGroupSize) {
            // Done with group size → move to step 3
            setAskGroupSize(false);
            setStep(3);
            return;
        }
        if (step < 4) {
            setStep(s => s + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (askGroupSize) {
            // Back from group-size → return to companion selection
            setAskGroupSize(false);
            return;
        }
        if (step === 1) {
            router.push('/');
        } else {
            setStep(s => s - 1);
        }
    };

    const handleSubmit = async () => {
        if (!selectedDestination || !departureCity) return;

        const prefs = {
            destination: selectedDestination,
            travelMonth: month,
            duration,
            travelCompanion: companion as any,
            groupSize: GROUP_COMPANIONS.includes(companion) ? groupSize : undefined,
            travelMood: mood as any,
            budget: { min: budgetMin, max: budgetMax, currency: 'USD' },
            departureCity,
        };

        updatePreferences(prefs);
        setIsLoading(true);

        try {
            const res = await api.createItinerary(prefs);
            if (res.success && res.data) {
                setItinerary(res.data);
                router.push(`/itinerary/${res.data._id}`);
            } else {
                showToast(res.error || 'Failed to create travel plan. Please try again.');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error: Could not reach the server.');
        } finally {
            setIsLoading(false);
        }
    };

    // Effective step for the progress bar (sub-step 2b doesn't advance bar)
    const progressStep = askGroupSize ? 2 : step;

    return (
        <div className="onboarding-page">
            {/* Navbar */}
            <header className="navbar">
                <div className="navbar-inner">
                    <button onClick={() => router.push('/')} className="navbar-brand">
                        TrekStar<span className="navbar-brand-dot" />
                    </button>
                    <span className="navbar-step">
                        {askGroupSize ? 'Travel Party — Group Size' : STEP_LABELS[step - 1]} &nbsp;·&nbsp; Step {askGroupSize ? '2' : step} of 4
                    </span>
                </div>
            </header>

            <main className="onboarding-main animate-fade-in">
                {/* Progress Bar */}
                <div className="progress-track">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`progress-segment${s <= progressStep ? ' active' : ''}`} />
                    ))}
                </div>

                {/* ── Step 1: Destination & Dates ── */}
                {step === 1 && !askGroupSize && (
                    <div className="animate-slide-up">
                        <div className="step-heading">
                            <span className="eyebrow">Step 1 of 4</span>
                            <h2 className="step-title">Where do you want to go?</h2>
                            <p className="step-desc">Choose your destination and travel dates.</p>
                        </div>

                        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                            {/* Destination search */}
                            <div className="field" style={{ position: 'relative' }}>
                                <label className="label">Destination</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Search for a city..."
                                    value={selectedDestination ? `${selectedDestination.city}, ${selectedDestination.country}` : searchQuery}
                                    onChange={e => { setSearchQuery(e.target.value); setSelectedDestination(null); setShowSuggestions(true); }}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                {showSuggestions && !selectedDestination && searchQuery && (
                                    <div className="dest-dropdown">
                                        {filtered.length > 0 ? filtered.map((dest, i) => (
                                            <button
                                                key={i}
                                                className="dest-item"
                                                onClick={() => { setSelectedDestination(dest); setShowSuggestions(false); }}
                                            >
                                                <img src={dest.image} alt={dest.city} className="dest-item-img" />
                                                <div>
                                                    <div className="dest-item-city">{dest.city}</div>
                                                    <div className="dest-item-country">{dest.country}</div>
                                                </div>
                                            </button>
                                        )) : (
                                            <div className="dest-empty">No results found.</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Travel Month */}
                            <div className="field">
                                <label className="label">Travel Month</label>
                                <select value={month} onChange={e => setMonth(e.target.value)} className="input">
                                    <option value="">Select a month</option>
                                    {months.map(m => <option key={m} value={m}>{m} 2026</option>)}
                                </select>
                            </div>

                            {/* Duration */}
                            <div className="field">
                                <label className="label">Duration — {duration} days</label>
                                <input
                                    type="range" min={3} max={21}
                                    value={duration}
                                    onChange={e => setDuration(+e.target.value)}
                                    style={{ width: '100%', marginTop: '0.35rem' }}
                                />
                                <div className="range-ticks">
                                    <span>3 days</span>
                                    <span>21 days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Step 2: Companion ── */}
                {step === 2 && !askGroupSize && (
                    <div className="animate-slide-up">
                        <div className="step-heading">
                            <span className="eyebrow">Step 2 of 4</span>
                            <h2 className="step-title">Who are you travelling with?</h2>
                            <p className="step-desc">We'll tailor the experience to your group.</p>
                        </div>
                        <div className="choice-grid">
                            {COMPANIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setCompanion(opt.value as any)}
                                    className={`choice-card${companion === opt.value ? ' selected' : ''}`}
                                >
                                    <span className="choice-emoji">{opt.emoji}</span>
                                    <span className="choice-label">{opt.label}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--stone)', marginTop: '0.2rem', display: 'block' }}>{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Step 2b: Group Size (only for family / friends) ── */}
                {askGroupSize && (
                    <div className="animate-slide-up">
                        <div className="step-heading">
                            <span className="eyebrow">
                                {companion === 'family' ? '👨‍👩‍👧‍👦 Family Trip' : '👥 Friends Group'}
                            </span>
                            <h2 className="step-title">How many people are travelling?</h2>
                            <p className="step-desc">Including yourself — we'll plan accordingly for everyone.</p>
                        </div>

                        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                            {/* Quick-select buttons */}
                            <div>
                                <label className="label">Select group size</label>
                                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                    {(companion === 'family'
                                        ? [2, 3, 4, 5, 6]
                                        : [2, 3, 4, 5, 6, 7, 8, 10]
                                    ).map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setGroupSize(n)}
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '6px',
                                                border: groupSize === n ? '2px solid var(--gold)' : '1.5px solid var(--border-warm)',
                                                background: groupSize === n ? 'var(--gold-muted)' : 'var(--surface)',
                                                color: groupSize === n ? 'var(--navy)' : 'var(--ink-soft)',
                                                fontFamily: 'DM Sans, sans-serif',
                                                fontWeight: groupSize === n ? '700' : '500',
                                                fontSize: '0.95rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.22s ease',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Or type a custom number */}
                            <div className="field">
                                <label className="label">Or enter exact number</label>
                                <input
                                    type="number"
                                    className="input"
                                    min={2}
                                    max={50}
                                    value={groupSize}
                                    onChange={e => setGroupSize(Math.max(2, +e.target.value))}
                                    style={{ maxWidth: '140px' }}
                                />
                            </div>

                            {/* Summary */}
                            <div style={{
                                padding: '1rem 1.2rem',
                                background: 'var(--cream)',
                                border: '1px solid var(--border-gold)',
                                borderRadius: '6px',
                            }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--ink-soft)' }}>
                                    Planning for <strong style={{ color: 'var(--navy)' }}>{groupSize} people</strong> travelling as a{' '}
                                    <strong style={{ color: 'var(--navy)' }}>{companion}</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Mood ── */}
                {step === 3 && !askGroupSize && (
                    <div className="animate-slide-up">
                        <div className="step-heading">
                            <span className="eyebrow">Step 3 of 4</span>
                            <h2 className="step-title">What's your travel style?</h2>
                            <p className="step-desc">This helps us prioritise the right activities for you.</p>
                        </div>
                        <div className="choice-grid">
                            {MOODS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setMood(opt.value as any)}
                                    className={`choice-card${mood === opt.value ? ' selected' : ''}`}
                                >
                                    <span className="choice-emoji">{opt.emoji}</span>
                                    <span className="choice-label">{opt.label}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--stone)', marginTop: '0.2rem', display: 'block' }}>{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Step 4: Budget & Departure ── */}
                {step === 4 && !askGroupSize && (
                    <div className="animate-slide-up">
                        <div className="step-heading">
                            <span className="eyebrow">Step 4 of 4</span>
                            <h2 className="step-title">Final details</h2>
                            <p className="step-desc">Set your budget range and where you're flying from.</p>
                        </div>

                        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label className="label">
                                    Budget Range — ${budgetMin.toLocaleString()} – ${budgetMax.toLocaleString()}
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
                                    <div className="range-section">
                                        <label>Minimum</label>
                                        <input type="range" min={500} max={10000} step={100} value={budgetMin}
                                            onChange={e => setBudgetMin(+e.target.value)} />
                                        <div className="range-ticks"><span>$500</span><span>$10,000</span></div>
                                    </div>
                                    <div className="range-section">
                                        <label>Maximum</label>
                                        <input type="range" min={1000} max={20000} step={100} value={budgetMax}
                                            onChange={e => setBudgetMax(+e.target.value)} />
                                        <div className="range-ticks"><span>$1,000</span><span>$20,000</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Departure City</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g. New York"
                                    value={departureCity}
                                    onChange={e => setDepartureCity(e.target.value)}
                                />
                            </div>

                            {/* Trip Summary */}
                            <div style={{
                                padding: '1rem 1.2rem',
                                background: 'var(--cream)',
                                border: '1px solid var(--border-gold)',
                                borderRadius: '6px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.4rem',
                            }}>
                                <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>Your trip summary</p>
                                {selectedDestination && (
                                    <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                                        📍 <strong>{selectedDestination.city}</strong>, {selectedDestination.country}
                                    </p>
                                )}
                                {month && <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>📅 {month} · {duration} days</p>}
                                <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                                    👥 {COMPANIONS.find(c => c.value === companion)?.label}
                                    {GROUP_COMPANIONS.includes(companion) && groupSize ? ` · ${groupSize} people` : ''}
                                </p>
                                <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                                    🎯 {MOODS.find(m => m.value === mood)?.label}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="step-nav">
                    <button onClick={handleBack} className="btn-ghost">
                        {step === 1 && !askGroupSize ? 'Cancel' : '← Back'}
                    </button>
                    <button onClick={handleNext} className="btn-primary step-nav-next">
                        {step === 4 ? 'Create Travel Plan →' : 'Continue →'}
                    </button>
                </div>
            </main>

            {/* Validation Toast */}
            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
