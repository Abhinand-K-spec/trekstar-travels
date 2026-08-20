'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, ArrowLeft, ArrowRight, Check, Shield, FileText, Lock, 
  Plane, Ticket, AlertCircle, UploadCloud, Users, MapPin, Calendar, CreditCard 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

// Wrap search params logic in a Suspense component to satisfy Next.js CSR static generation rules
function BookingFormContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = params.id as string;
  const { user, isAuthenticated } = useAuth();
  
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Form step state: 1 (Check-in), 2 (Security), 3 (Immigration), 4 (Boarding Gate), 5 (Success Takeoff)
  const [currentStep, setCurrentStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1]);

  // Animated immigration stamp state
  const [stampActive, setStampActive] = useState(false);

  // Prefill dates and traveler count from query parameters
  const initialDate = searchParams.get('date') || '';
  const initialTravelers = Number(searchParams.get('travelers')) || 2;

  // --- Form Data State ---
  const [formData, setFormData] = useState({
    // Step 1: Check-in
    fullName: user?.name || '',
    dob: '',
    gender: 'male',
    nationality: 'India',
    email: user?.email || '',
    phone: '',
    travelers: initialTravelers,
    
    // Step 2: Security check
    travelDate: initialDate,
    accommodation: 'luxury',
    roomType: 'double',
    mealPreference: 'veg',
    transportation: 'private',
    specialReq: '',
    
    // Step 3: Immigration
    passportNumber: '',
    passportExpiry: '',
    issueCountry: 'India',
    visaType: 'tourist',
    visaAssistance: true,
    fileUploaded: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!packageId) return;
    const apiBase = process.env.NEXT_PUBLIC_API_URL!;
    fetch(`${apiBase}/packages/${packageId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setPkg(d.data);
        else router.push('/packages');
      })
      .catch(() => router.push('/packages'))
      .finally(() => setLoading(false));
  }, [packageId]);

  // Prefill user details when authenticated state triggers
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  // Inline Form Validation
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.email.includes('@')) newErrors.email = 'Enter a valid passenger email';
      if (!formData.phone.trim()) newErrors.phone = 'Contact number is required';
    } else if (step === 2) {
      if (!formData.travelDate) newErrors.travelDate = 'Departure date is required';
    } else if (step === 3) {
      if (!formData.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';
      if (!formData.passportExpiry) newErrors.passportExpiry = 'Passport expiry date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    
    if (currentStep === 3) {
      // Trigger passport stamp animation first
      setStampActive(true);
      setTimeout(() => {
        setVisitedSteps(prev => [...new Set([...prev, 4])]);
        setCurrentStep(4);
      }, 1200); // 1.2 seconds stamp experience
    } else {
      const nextStep = currentStep + 1;
      setVisitedSteps(prev => [...new Set([...prev, nextStep])]);
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepJump = (step: number) => {
    if (visitedSteps.includes(step)) {
      setStampActive(false);
      setCurrentStep(step);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(5);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0f1d', color: '#f1f5f9' }}>
        <Compass className="animate-spin" size={48} style={{ color: 'var(--gold)' }} />
        <p style={{ marginTop: '1rem', letterSpacing: '0.15em', fontSize: '0.9rem' }}>ESTABLISHING BOOKING GATE...</p>
      </div>
    );
  }

  const checkpoints = [
    { id: 1, label: 'CHECK-IN', desc: 'Traveler Details', icon: <Ticket size={18} /> },
    { id: 2, label: 'SECURITY', desc: 'Travel Preferences', icon: <Shield size={18} /> },
    { id: 3, label: 'IMMIGRATION', desc: 'Visa & Passport', icon: <FileText size={18} /> },
    { id: 4, label: 'BOARDING GATE', desc: 'Review & Confirm', icon: <Plane size={18} /> }
  ];

  return (
    <div style={{ background: '#060913', color: '#f1f5f9', minHeight: '100vh' }} className="airport-terminal-blueprint">
      
      {/* ── Immersive Header Nav ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: 'rgba(6, 9, 19, 0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => router.push(`/packages/${packageId}`)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
              <ArrowLeft size={16} /> Exit Gate
            </button>
            <span style={{ height: '16px', width: '1px', background: 'rgba(255,255,255,0.15)' }} />
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: "'Playfair Display', serif", color: '#fff' }}>
              TrekStar<span style={{ color: 'var(--gold)' }}>.</span>
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>FLIGHT PATH STATUS</span>
            <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '3px 10px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(16,185,129,0.2)' }}>
              🟢 ACTIVE
            </span>
          </div>
        </div>
      </header>

      {/* ── Mobile Compact Progress (Sticky) ── */}
      <div className="booking-mobile-progress" style={{ background: 'rgba(10,15,29,0.9)', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: '57px', zIndex: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {checkpoints.map(cp => {
            const isCompleted = currentStep > cp.id;
            const isActive = currentStep === cp.id;
            return (
              <div 
                key={cp.id} 
                onClick={() => handleStepJump(cp.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '4px', 
                  color: isActive ? 'var(--gold)' : isCompleted ? '#10b981' : 'rgba(255,255,255,0.3)',
                  fontSize: '0.75rem', fontWeight: isActive || isCompleted ? 700 : 500,
                  cursor: visitedSteps.includes(cp.id) ? 'pointer' : 'default'
                }}
              >
                <span>{cp.id}.</span>
                <span>{cp.label}</span>
                {isCompleted && <span>✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {currentStep <= 4 ? (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '3rem 2rem' }}>
          <div className="booking-grid">
            
            {/* ── LEFT COLUMN: Airport Wayfinding Journey Tracker ── */}
            <div className="booking-wayfinding">
              <div style={{ position: 'sticky', top: '120px' }}>
                <span className="airport-signage-label" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>WAYFINDING TERMINAL</span>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', fontFamily: "'Playfair Display', serif", margin: '0.4rem 0 2rem' }}>Your Airport Journey</h3>
                
                {/* Visual Connector Track */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {checkpoints.map((cp, idx) => {
                    const isCompleted = currentStep > cp.id;
                    const isActive = currentStep === cp.id;
                    const isNext = currentStep < cp.id;
                    
                    return (
                      <div key={cp.id} style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
                        
                        {/* Vertical line indicator */}
                        {idx < checkpoints.length - 1 && (
                          <div className="airport-vertical-line" style={{
                            position: 'absolute', left: '14px', top: '30px', bottom: '-26px', zIndex: 1
                          }} />
                        )}

                        {/* Node circle */}
                        <div 
                          onClick={() => handleStepJump(cp.id)}
                          style={{
                            width: '30px', height: '30px', borderRadius: '50%',
                            background: isActive ? 'var(--gold)' : isCompleted ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                            border: `2px solid ${isActive ? 'var(--gold)' : isCompleted ? '#10b981' : 'rgba(255,255,255,0.15)'}`,
                            color: isActive ? '#000' : isCompleted ? '#10b981' : 'rgba(255,255,255,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
                            cursor: visitedSteps.includes(cp.id) ? 'pointer' : 'default',
                            transition: 'all 0.3s'
                          }}
                        >
                          {isCompleted ? <Check size={14} /> : cp.id}
                        </div>

                        {/* Description labels */}
                        <div onClick={() => handleStepJump(cp.id)} style={{ cursor: visitedSteps.includes(cp.id) ? 'pointer' : 'default' }}>
                          <span className="airport-signage-label" style={{ 
                            fontSize: '0.8rem', display: 'block',
                            color: isActive ? 'var(--gold)' : isCompleted ? '#10b981' : 'rgba(255,255,255,0.3)',
                            fontWeight: 800
                          }}>
                            {cp.label}
                          </span>
                          <span style={{ fontSize: '0.85rem', color: isActive || isCompleted ? '#fff' : 'rgba(255,255,255,0.4)', marginTop: '0.1rem', display: 'block' }}>
                            {cp.desc}
                          </span>
                          {isCompleted && (
                            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, display: 'block', marginTop: '2px' }}>✓ CLEARED</span>
                          )}
                          {isActive && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 700, display: 'block', marginTop: '2px' }}>● CURRENT CHECKPOINT</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '4rem', background: 'rgba(30,41,59,0.2)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>Destinations Info</p>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '0.25rem', marginBottom: '0.1rem', fontFamily: "'Playfair Display', serif" }}>{pkg?.title}</h4>
                  <p style={{ color: 'var(--gold)', fontSize: '0.85rem', margin: 0 }}>📍 {pkg?.destination?.city}, {pkg?.destination?.country}</p>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Active Form & METAPHOR Checkpoint Panel ── */}
            <div>
              
              {/* Form container card */}
              <div style={{ background: 'rgba(30, 41, 59, 0.35)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
                
                {/* ── STEP 01: CHECK-IN ── */}
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    <span className="airport-signage-label" style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>STEP 01 — CHECK-IN</span>
                    <h2 style={{ fontSize: '2.2rem', color: '#fff', fontFamily: "'Playfair Display', serif", margin: '0.4rem 0 0.2rem' }}>Welcome to your journey</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Let's get your traveler details ready for check-in.</p>

                    {/* Boarding pass ticket view */}
                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PASSENGER SUMMARY</span>
                        <h4 style={{ fontSize: '1.15rem', color: '#fff', marginTop: '0.2rem', fontFamily: "'Playfair Display', serif" }}>
                          {formData.fullName || 'New Traveler'}
                        </h4>
                        <p style={{ color: 'var(--gold)', fontSize: '0.8rem', marginTop: '0.2rem', textTransform: 'uppercase', fontWeight: 700 }}>
                          ✈️ {formData.nationality.toUpperCase()} CITIZEN
                        </p>
                      </div>
                      <div style={{ textTransform: 'uppercase', borderLeft: '1px dashed rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', display: 'block' }}>CLASS</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold)' }}>FIRST CLASS</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Full Passenger Name</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={e => setFormData({...formData, fullName: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: errors.fullName ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                          placeholder="As written on passport"
                        />
                        {errors.fullName && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem' }}><AlertCircle size={10} style={{ display: 'inline', marginRight: 4 }} /> {errors.fullName}</p>}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Date of Birth</label>
                        <input
                          type="date"
                          value={formData.dob}
                          onChange={e => setFormData({...formData, dob: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: errors.dob ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        />
                        {errors.dob && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem' }}><AlertCircle size={10} style={{ display: 'inline', marginRight: 4 }} /> {errors.dob}</p>}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Gender</label>
                        <select
                          value={formData.gender}
                          onChange={e => setFormData({...formData, gender: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Nationality</label>
                        <input
                          type="text"
                          value={formData.nationality}
                          onChange={e => setFormData({...formData, nationality: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        />
                        {errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem' }}><AlertCircle size={10} style={{ display: 'inline', marginRight: 4 }} /> {errors.email}</p>}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Contact Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: errors.phone ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                          placeholder="+91 XXXXX XXXXX"
                        />
                        {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem' }}><AlertCircle size={10} style={{ display: 'inline', marginRight: 4 }} /> {errors.phone}</p>}
                      </div>
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'end' }}>
                      <button onClick={handleNext} className="btn-gold" style={{ padding: '0.85rem 2.2rem', borderRadius: '30px', fontWeight: 700 }}>
                        Continue to Security <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 02: SECURITY CHECK ── */}
                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    
                    {/* Scanner horizontal line animation */}
                    <div className="scanner-active-line" />

                    <span className="airport-signage-label" style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>STEP 02 — SECURITY CHECK</span>
                    <h2 style={{ fontSize: '2.2rem', color: '#fff', fontFamily: "'Playfair Display', serif", margin: '0.4rem 0 0.2rem' }}>Prepare for security</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Tell us about your travel preferences and requirements.</p>

                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem 1.5rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)' }} />
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>SECURITY CLEARED DETAILS STATUS</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold)' }}>READY FOR SCREENING</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Travel Date</label>
                        <input
                          type="date"
                          value={formData.travelDate}
                          onChange={e => setFormData({...formData, travelDate: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: errors.travelDate ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        />
                        {errors.travelDate && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem' }}><AlertCircle size={10} style={{ display: 'inline', marginRight: 4 }} /> {errors.travelDate}</p>}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Number of Travelers</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={formData.travelers}
                          onChange={e => setFormData({...formData, travelers: Number(e.target.value)})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Accommodation Preference</label>
                        <select
                          value={formData.accommodation}
                          onChange={e => setFormData({...formData, accommodation: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        >
                          <option value="luxury">Luxury 5-Star Boutique</option>
                          <option value="premium">Premium 4-Star Suites</option>
                          <option value="comfort">Comfort Style Lodging</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Room Style</label>
                        <select
                          value={formData.roomType}
                          onChange={e => setFormData({...formData, roomType: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        >
                          <option value="single">Single Room</option>
                          <option value="double">Double Sharing</option>
                          <option value="family">Family Connecting</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Meal Preference</label>
                        <select
                          value={formData.mealPreference}
                          onChange={e => setFormData({...formData, mealPreference: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        >
                          <option value="veg">Vegetarian Selection</option>
                          <option value="halal">Halal Selection</option>
                          <option value="continental">Continental / All</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Transit & Ground Transport</label>
                        <select
                          value={formData.transportation}
                          onChange={e => setFormData({...formData, transportation: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        >
                          <option value="private">Private VIP Car Transfers</option>
                          <option value="shared">Shared Group Coach</option>
                          <option value="none">Self-Transit / None</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Special Requirements</label>
                      <textarea
                        value={formData.specialReq}
                        onChange={e => setFormData({...formData, specialReq: e.target.value})}
                        style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none', height: '80px', resize: 'none' }}
                        placeholder="Dietary requests, room proximity, wheelchair access support..."
                      />
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                      <button onClick={handleBack} className="btn-ghost" style={{ padding: '0.85rem 1.8rem', borderRadius: '30px', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                        Back
                      </button>
                      <button onClick={handleNext} className="btn-gold" style={{ padding: '0.85rem 2.2rem', borderRadius: '30px', fontWeight: 700 }}>
                        Continue to Immigration <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 03: IMMIGRATION & DOCUMENTS ── */}
                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    
                    {/* Passport stamp absolute overlay when active */}
                    <AnimatePresence>
                      {stampActive && (
                        <div style={{
                          position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(6,9,19,0.85)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
                        }}>
                          <div style={{ textAlign: 'center' }}>
                            <div className="stamp-immigration-clear active">
                              PASSPORT CHECKED<br/>
                              IMMIGRATION CLEARED<br/>
                              TREKSTAR VISA DESK
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '1.25rem', letterSpacing: '0.05em' }}>
                              STAMPING SYSTEM CREDENTIALS...
                            </p>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>

                    <span className="airport-signage-label" style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>STEP 03 — IMMIGRATION</span>
                    <h2 style={{ fontSize: '2.2rem', color: '#fff', fontFamily: "'Playfair Display', serif", margin: '0.4rem 0 0.2rem' }}>Immigration & Visa</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Complete your travel documentation before proceeding.</p>

                    {/* Passport metaphor UI card */}
                    <div style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '64px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Ticket size={24} color="var(--gold)" />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block' }}>IMMIGRATION HUB STATUS</span>
                        <h4 style={{ fontSize: '1rem', color: '#fff', margin: '0.15rem 0' }}>Passport ID: {formData.passportNumber || 'AWAITING INPUT'}</h4>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(201,168,76,0.15)', display: 'inline-block', marginTop: '4px' }}>
                          VISA ASSISTANCE INCLUDED
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Passport Number</label>
                        <input
                          type="text"
                          value={formData.passportNumber}
                          onChange={e => setFormData({...formData, passportNumber: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: errors.passportNumber ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                          placeholder="Enter 8-digit passport ID"
                        />
                        {errors.passportNumber && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem' }}><AlertCircle size={10} style={{ display: 'inline', marginRight: 4 }} /> {errors.passportNumber}</p>}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Passport Expiry Date</label>
                        <input
                          type="date"
                          value={formData.passportExpiry}
                          onChange={e => setFormData({...formData, passportExpiry: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: errors.passportExpiry ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        />
                        {errors.passportExpiry && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem' }}><AlertCircle size={10} style={{ display: 'inline', marginRight: 4 }} /> {errors.passportExpiry}</p>}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Country of Issue</label>
                        <input
                          type="text"
                          value={formData.issueCountry}
                          onChange={e => setFormData({...formData, issueCountry: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Visa Category</label>
                        <select
                          value={formData.visaType}
                          onChange={e => setFormData({...formData, visaType: e.target.value})}
                          style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                        >
                          <option value="tourist">Tourist Visa Assistance</option>
                          <option value="business">Business / Corporate Entry</option>
                          <option value="transit">Transit approval</option>
                        </select>
                      </div>
                    </div>

                    {/* Document upload box */}
                    <div style={{ marginTop: '2rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Upload Passport Bio Page Scan</label>
                      <div 
                        onClick={() => setFormData({...formData, fileUploaded: true})}
                        style={{
                          border: '2px dashed rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.2)',
                          borderRadius: '16px', padding: '2rem', textAlign: 'center', cursor: 'pointer',
                          transition: 'all 0.2s', borderColor: formData.fileUploaded ? '#10b981' : 'rgba(255,255,255,0.15)'
                        }}
                      >
                        {formData.fileUploaded ? (
                          <div>
                            <Check size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                            <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>passport_bio_scan.pdf</h4>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Upload completed successfully</p>
                          </div>
                        ) : (
                          <div>
                            <UploadCloud size={32} color="rgba(255,255,255,0.3)" style={{ margin: '0 auto 0.5rem' }} />
                            <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Click or drag to upload document</h4>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.2rem' }}>PDF, JPG, PNG formats up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                      <button onClick={handleBack} className="btn-ghost" style={{ padding: '0.85rem 1.8rem', borderRadius: '30px', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                        Back
                      </button>
                      <button onClick={handleNext} className="btn-gold" style={{ padding: '0.85rem 2.2rem', borderRadius: '30px', fontWeight: 700 }}>
                        Verify & Clear Immigration <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 04: BOARDING GATE ── */}
                {currentStep === 4 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    <span className="airport-signage-label" style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>STEP 04 — BOARDING GATE</span>
                    <h2 style={{ fontSize: '2.2rem', color: '#fff', fontFamily: "'Playfair Display', serif", margin: '0.4rem 0 0.2rem' }}>You're ready to board</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Review your trip details and complete your booking.</p>

                    {/* Immersive Airport Boarding Ticket Summary */}
                    <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', overflow: 'hidden', marginBottom: '2.5rem' }}>
                      <div style={{ background: 'var(--gold)', color: '#000', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="airport-signage-label" style={{ fontSize: '0.85rem', fontWeight: 900 }}>BOARDING PASS</span>
                        <span className="airport-signage-label" style={{ fontSize: '0.85rem', fontWeight: 900 }}>GATE 04</span>
                      </div>
                      
                      <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem 2rem' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block' }}>PASSENGER</span>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{formData.fullName}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block' }}>DESTINATION</span>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{pkg?.destination?.city}, {pkg?.destination?.country}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block' }}>DEPARTURE</span>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{formData.travelDate || '12 September 2026'}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block' }}>DURATION</span>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{pkg?.duration} Days / {pkg?.duration - 1} Nights</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block' }}>ACCOMMODATION</span>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>{formData.accommodation} ({formData.roomType})</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block' }}>BOARDING STATUS</span>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>● READY TO BOARD</span>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem 2rem', borderTop: '1px dashed rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Fare (Inclusive of Taxes)</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)' }}>₹{(pkg?.price * formData.travelers * 83).toLocaleString() || '₹83,000'}</span>
                      </div>
                    </div>

                    <form onSubmit={handlePaymentSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Cardholder Name</label>
                          <input
                            type="text"
                            required
                            placeholder={formData.fullName}
                            style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                          />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Card Number</label>
                            <input
                              type="text"
                              required
                              placeholder="•••• •••• •••• ••••"
                              style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Expiry</label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>CVV</label>
                            <input
                              type="password"
                              required
                              placeholder="•••"
                              style={{ width: '100%', padding: '12px 16px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', outline: 'none' }}
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                        <button type="button" onClick={handleBack} className="btn-ghost" style={{ padding: '0.85rem 1.8rem', borderRadius: '30px', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                          Edit Details
                        </button>
                        <button type="submit" className="btn-gold" style={{ padding: '0.85rem 2.5rem', borderRadius: '30px', fontWeight: 900 }}>
                          Confirm & Pay <CreditCard size={16} style={{ marginLeft: 6 }} />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

              </div>
            </div>

          </div>
        </div>
      ) : (
        /* ── STEP 05: TAKEOFF CLEARANCE SUCCESS PAGE ── */
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} style={{ maxWidth: 750, margin: '5rem auto', padding: '0 2rem' }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '4rem', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
            
            <Plane size={56} style={{ color: 'var(--gold)', margin: '0 auto 1.5rem', transform: 'rotate(45deg)' }} />
            
            <span className="airport-signage-label" style={{ color: '#10b981', fontSize: '1rem', letterSpacing: '0.2em' }}>✈ JOURNEY CONFIRMED</span>
            <h1 style={{ fontSize: '3rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#fff', margin: '0.5rem 0 1rem', lineHeight: 1.1 }}>
              You're cleared for takeoff.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 3rem' }}>
              Your boarding formalities have been cleared. An email confirmation containing your complete travel vouchers and visa status has been sent.
            </p>

            {/* Checkpoint checklist clearance */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3.5rem' }}>
              {checkpoints.map(cp => (
                <div key={cp.id} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.85rem 0.5rem', borderRadius: '12px' }}>
                  <Check size={16} color="#10b981" style={{ margin: '0 auto 0.25rem' }} />
                  <span className="airport-signage-label" style={{ fontSize: '0.65rem', color: '#10b981', display: 'block' }}>{cp.label}</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px', display: 'block' }}>CLEARED</span>
                </div>
              ))}
            </div>

            {/* Trip details overview */}
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.75rem 2rem', textAlign: 'left', marginBottom: '3rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem 2rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>DESTINATION</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '2px 0 0' }}>{pkg?.destination?.city || 'Dubai'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>DEPARTURE</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '2px 0 0' }}>{formData.travelDate || '12 September 2026'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>BOOKING ID</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold)', margin: '2px 0 0', textTransform: 'uppercase' }}>LUM-{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>TRAVEL CLASS</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '2px 0 0' }}>FIRST CLASS</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
              <button onClick={() => router.push('/my-packages')} className="btn-gold" style={{ padding: '0.85rem 2rem', borderRadius: '30px', fontWeight: 700 }}>
                View My Trip
              </button>
              <button className="btn-ghost" style={{ padding: '0.85rem 2rem', borderRadius: '30px', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                Download Confirmation
              </button>
            </div>

          </div>
        </motion.div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0f1d', color: '#f1f5f9' }}>
        <Compass className="animate-spin" size={48} style={{ color: 'var(--gold)' }} />
        <p style={{ marginTop: '1rem', letterSpacing: '0.15em', fontSize: '0.9rem' }}>INITIALIZING BOOKING TERMINALS...</p>
      </div>
    }>
      <BookingFormContent />
    </Suspense>
  );
}
