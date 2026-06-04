'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import api from '@/lib/api';

// Static Country Visa Data Directory
const COUNTRY_VISA_DATA: Record<string, Record<string, {
    title: string;
    fee: string;
    processingTime: string;
    overview: string;
    requirements: string[];
    documents: string[];
}>> = {
    Canada: {
        tourist: {
            title: 'Canada Visitor Visa (V-1)',
            fee: '$100 CAD (approx. $75 USD)',
            processingTime: '12-30 days',
            overview: 'Allows tourists to visit Canada for leisure, sightseeing, or visiting family and friends for up to 6 consecutive months.',
            requirements: [
                'Proof of clean travel intent (will return home)',
                'Proof of sufficient funds for stay duration',
                'No criminal record and in good health',
                'Ties to home country (job, school, property)'
            ],
            documents: [
                'Valid passport (6+ months remaining)',
                'Completed visitor visa application forms',
                'Recent passport-size photographs',
                'Bank statements for the last 6 months',
                'Proof of employment or business ownership',
                'Detailed travel itinerary'
            ]
        },
        business: {
            title: 'Canada Business Visitor Visa',
            fee: '$100 CAD (approx. $75 USD)',
            processingTime: '10-21 days',
            overview: 'For individuals visiting Canada temporarily to engage in business activities without entering the Canadian labor market.',
            requirements: [
                'No intention to stay or work directly in Canada',
                'Business activities must support international trade',
                'Proof of financial backing by home employer',
                'Invitation from a registered Canadian business host'
            ],
            documents: [
                'Valid passport',
                'Invitation letter from the Canadian host company',
                'Support letter from your employer outlining purpose of trip',
                'Proof of corporate assets and company registry',
                'Business bank statements'
            ]
        },
        study: {
            title: 'Canada Study Permit',
            fee: '$150 CAD (approx. $110 USD)',
            processingTime: '6-12 weeks',
            overview: 'Enables foreign students to study at Designated Learning Institutions (DLIs) in Canada. Often leads to post-grad work opportunities.',
            requirements: [
                'Letter of Acceptance from a Designated Learning Institution (DLI)',
                'Proof of financial support (Tuition fee + $20,635 CAD/year living expenses)',
                'No criminal background check (police certificate)',
                'Medical examination proof'
            ],
            documents: [
                'Valid passport',
                'Letter of Acceptance (LOA) from DLI',
                'Provincial Attestation Letter (PAL) if applicable',
                'GIC certificate or bank statements showing funds',
                'Statement of Purpose (Study Plan)',
                'IELTS/TOEFL academic results'
            ]
        },
        work: {
            title: 'Canada Employer-Specific / Open Work Permit',
            fee: '$155 CAD (approx. $115 USD)',
            processingTime: '8-16 weeks',
            overview: 'Enables qualified professionals to work in Canada. Often requires a valid job offer and Labor Market Impact Assessment (LMIA).',
            requirements: [
                'Valid job offer from a Canadian employer (unless applying for Open Work Permit)',
                'LMIA approval from ESDC (if employer-specific)',
                'Proof of meeting education and experience requirements of job',
                'Sufficient funds to settle in Canada initially'
            ],
            documents: [
                'Valid passport',
                'Copy of Job Offer letter',
                'Approved LMIA document (or copy)',
                'Resume and letters of reference from previous employers',
                'Degree certificates and academic transcripts',
                'IELTS General results'
            ]
        },
        pr: {
            title: 'Canada Express Entry / Permanent Residency',
            fee: '$1,525 CAD (incl. right of PR fee)',
            processingTime: '6-8 months',
            overview: 'The primary federal immigration pathway for skilled workers. Uses the Comprehensive Ranking System (CRS) to rank profiles.',
            requirements: [
                'Meet Federal Skilled Worker, Trades, or CEC program criteria',
                'Age, education, experience, and language skills evaluated',
                'Achieve minimum CRS draw cut-off score',
                'Sufficient settlement funds for family size'
            ],
            documents: [
                'Valid passport',
                'Educational Credential Assessment (ECA) report',
                'IELTS General (CLB 7 or higher required)',
                'Police clearance certificates from all lived-in countries',
                'Proof of funds (bank letters)',
                'Detailed reference letters matching NOC codes'
            ]
        }
    },
    Australia: {
        tourist: {
            title: 'Australia Visitor Visa (Subclass 600)',
            fee: '$195 AUD (approx. $130 USD)',
            processingTime: '15-25 days',
            overview: 'Allows you to visit Australia for holiday, recreation, or to see family and friends for up to 3, 6, or 12 months.',
            requirements: [
                'Be a genuine temporary entrant who will return home',
                'Have access to sufficient funds for your stay',
                'Meet character and health requirements'
            ],
            documents: [
                'Valid passport',
                'Bank statements showing robust savings',
                'Employment confirmation letter/payslips',
                'Travel plan and flight reservations',
                'National ID card'
            ]
        },
        study: {
            title: 'Australia Student Visa (Subclass 500)',
            fee: '$1,600 AUD (approx. $1,050 USD)',
            processingTime: '4-8 weeks',
            overview: 'Allows international students to study full-time at registered Australian education institutions.',
            requirements: [
                'Confirmation of Enrolment (CoE) from an Australian university',
                'Genuine Student (GS) requirement statement',
                'Proof of English capability (IELTS/PTE)',
                'Overseas Student Health Cover (OSHC)'
            ],
            documents: [
                'Valid passport',
                'Confirmation of Enrolment (CoE) certificate',
                'Evidence of financial capacity (Living cost: $29,710 AUD/year)',
                'English language test scorecard',
                'Health exam results',
                'Statement of GS intent'
            ]
        },
        work: {
            title: 'Australia Temporary Skill Shortage (TSS Subclass 482)',
            fee: '$1,495 AUD - $3,110 AUD',
            processingTime: '2-3 months',
            overview: 'Allows employers to sponsor skilled workers to address labor shortages in occupations where an Australian cannot be found.',
            requirements: [
                'Be nominated by an approved Australian sponsor',
                'Possess at least 2 years of relevant work experience',
                'Meet English language proficiency minimums',
                'Hold relevant skills assessment if required'
            ],
            documents: [
                'Valid passport',
                'Nomination details or sponsorship approval letter',
                'Degree certificates and resume',
                'Skills Assessment report',
                'Reference letters from previous employers',
                'English language test results'
            ]
        },
        pr: {
            title: 'Australia Skilled Independent Visa (Subclass 189/190)',
            fee: '$4,640 AUD (approx. $3,050 USD)',
            processingTime: '9-12 months',
            overview: 'Points-tested visa for skilled workers who are not sponsored by an employer. Allows living and working permanently.',
            requirements: [
                'Occupation must be on the relevant skilled list',
                'Positive Skills Assessment from governing body (e.g. ACS, Engineers Australia)',
                'Score at least 65 points on points test',
                'Under 45 years of age'
            ],
            documents: [
                'Passport',
                'Positive Skills Assessment outcome',
                'English competency scorecard (PTE Academic / IELTS)',
                'Degree credentials and employment reference letters',
                'Police checks'
            ]
        }
    },
    USA: {
        tourist: {
            title: 'US Tourist / Visitor Visa (B-2)',
            fee: '$185 USD',
            processingTime: '3-6 weeks (depends on interview wait times)',
            overview: 'Non-immigrant visa for persons entering the United States temporarily for pleasure, tourism, or medical treatment.',
            requirements: [
                'The purpose of your trip is temporary travel',
                'Plan to remain for a specific, limited period',
                'Evidence of funds to cover expenses in the US',
                'Social and economic ties abroad ensuring return'
            ],
            documents: [
                'Passport (valid for 6 months beyond stay)',
                'DS-160 confirmation page barcode',
                'Application fee payment receipt',
                'Interview appointment letter',
                'Financial stability documents (bank records, tax returns)'
            ]
        },
        study: {
            title: 'US Student Visa (F-1)',
            fee: '$185 USD + $350 SEVIS Fee',
            processingTime: '2-4 weeks',
            overview: 'For international students pursuing academic studies at US colleges, universities, high schools, or English language programs.',
            requirements: [
                'Form I-20 issued by an SEVP-approved school',
                'Enrolled in a full-time academic course of study',
                'Proficient in English or enrolled in English courses',
                'Proof of immediate funds to pay for the first year of education'
            ],
            documents: [
                'Valid passport',
                'DS-160 confirmation page',
                'Form I-20 signed by university DSO and student',
                'SEVIS I-901 fee payment receipt',
                'Academic diplomas and transcripts',
                'Financial proofs (affidavits of support, liquid assets)'
            ]
        }
    },
    UK: {
        tourist: {
            title: 'UK Standard Visitor Visa',
            fee: '£115 (approx. $145 USD)',
            processingTime: '3 weeks',
            overview: 'Allows you to visit the UK for leisure, business events, or to see family/friends for up to 6 months.',
            requirements: [
                'You will leave the UK at the end of your visit',
                'You can support yourself and dependents during the trip',
                'Proof of planned activities in the UK'
            ],
            documents: [
                'Passport',
                'Bank statements for the last 6 months showing disposable income',
                'Employer letter detailing salary and approval of leave',
                'Flight itinerary and accommodation bookings'
            ]
        },
        work: {
            title: 'UK Skilled Worker Visa',
            fee: '£719 - £1,500 (plus NHS health surcharge)',
            processingTime: '3-4 weeks',
            overview: 'For skilled professionals with a job offer from an approved sponsor to live and work in the UK.',
            requirements: [
                'Work for a UK employer that has been approved by the Home Office',
                'Have a Certificate of Sponsorship (CoS) code from your employer',
                'Job must be on the eligible occupations list and meet minimum salary',
                'Speak, read, write English to level B1 (IELTS 4.0 minimum)'
            ],
            documents: [
                'Passport',
                'Certificate of Sponsorship (CoS) reference number',
                'Tuberculosis test results (if applicable)',
                'English proficiency certificate',
                'Proof of personal savings (£1,270 minimum)'
            ]
        }
    }
};

const DEFAULT_VISA_TYPE_INFO = {
    title: 'Visa Information',
    fee: 'Varies by destination',
    processingTime: 'Varies',
    overview: 'Please select a different country or visa type for complete specific information. TrekStar handles all types of visitor and skilled visa applications.',
    requirements: ['General passport validity', 'Clean record', 'Proof of intent to return'],
    documents: ['Passport copy', 'Photographs', 'Proof of funds']
};

export default function VisaPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'directory' | 'calculator' | 'apply' | 'track'>('directory');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Country Directory Tab State
    const [dirCountry, setDirCountry] = useState('Canada');
    const [dirVisaType, setDirVisaType] = useState('tourist');

    // Calculator Tab State
    const [calcForm, setCalcForm] = useState({
        visaType: 'work',
        destinationCountry: 'Canada',
        age: '28',
        education: 'bachelors',
        experience: '4',
        ielts: '7.5',
        monthlyIncome: '3000'
    });
    const [calcLoading, setCalcLoading] = useState(false);
    const [calcResult, setCalcResult] = useState<any>(null);

    // Application Form State
    const [applyForm, setApplyForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        passportNumber: '',
        nationality: '',
        destinationCountry: 'Canada',
        visaType: 'tourist',
        departureDate: '',
        additionalNotes: '',
        documentsList: '' // entered as comma-separated or simple text list
    });
    const [applySubmitting, setApplySubmitting] = useState(false);
    const [applySuccess, setApplySuccess] = useState(false);

    // Tracking Tab State
    const [myApps, setMyApps] = useState<any[]>([]);
    const [trackLoading, setTrackLoading] = useState(false);
    const [selectedApp, setSelectedApp] = useState<any>(null);

    // Notification toast
    const [toast, setToast] = useState<string | null>(null);
    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // Load applications when user visits tracking tab and is authenticated
    useEffect(() => {
        if (activeTab === 'track') {
            if (isAuthenticated) {
                fetchMyApplications();
            } else {
                setIsAuthModalOpen(true);
            }
        }
    }, [activeTab, isAuthenticated]);

    // Fill application form with user details on load if available
    useEffect(() => {
        if (user) {
            setApplyForm(prev => ({
                ...prev,
                fullName: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const fetchMyApplications = async () => {
        setTrackLoading(true);
        try {
            const res = await api.getMyVisaApplications();
            if (res.success && res.data) {
                setMyApps(res.data);
            } else {
                showToast(res.error || 'Failed to fetch visa applications');
            }
        } catch (error) {
            showToast('Network error while fetching applications');
        } finally {
            setTrackLoading(false);
        }
    };

    const handleCalcSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCalcLoading(true);
        try {
            const res = await api.evaluateVisa({
                visaType: calcForm.visaType,
                destinationCountry: calcForm.destinationCountry,
                age: Number(calcForm.age),
                education: calcForm.education,
                experience: Number(calcForm.experience),
                ielts: parseFloat(calcForm.ielts),
                monthlyIncome: Number(calcForm.monthlyIncome)
            });
            if (res.success && res.data) {
                setCalcResult(res.data);
            } else {
                showToast(res.error || 'Evaluation failed');
            }
        } catch (error) {
            showToast('Network error during evaluation');
        } finally {
            setCalcLoading(false);
        }
    };

    const handleApplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            showToast('Please sign in to submit a visa application.');
            setIsAuthModalOpen(true);
            return;
        }

        setApplySubmitting(true);
        try {
            const docArray = applyForm.documentsList
                ? applyForm.documentsList.split(',').map(s => s.trim()).filter(Boolean)
                : ['Passport Copy', 'Bank Statement', 'Travel Itinerary'];

            const res = await api.applyForVisa({
                fullName: applyForm.fullName,
                email: applyForm.email,
                phone: applyForm.phone,
                passportNumber: applyForm.passportNumber,
                nationality: applyForm.nationality,
                destinationCountry: applyForm.destinationCountry,
                visaType: applyForm.visaType,
                departureDate: applyForm.departureDate,
                additionalNotes: applyForm.additionalNotes,
                documents: docArray
            });

            if (res.success) {
                setApplySuccess(true);
                setApplyForm(prev => ({
                    ...prev,
                    passportNumber: '',
                    nationality: '',
                    departureDate: '',
                    additionalNotes: '',
                    documentsList: ''
                }));
                showToast('Visa Application Submitted Successfully!');
                // Auto switch to tracking after 2 seconds
                setTimeout(() => {
                    setApplySuccess(false);
                    setActiveTab('track');
                }, 2000);
            } else {
                showToast(res.error || 'Failed to submit application');
            }
        } catch (error) {
            showToast('Network error during application submission');
        } finally {
            setApplySubmitting(false);
        }
    };

    // Helper to get selected visa info
    const countryData = COUNTRY_VISA_DATA[dirCountry] || {};
    const visaInfo = countryData[dirVisaType] || DEFAULT_VISA_TYPE_INFO;

    const statusBadgeStyles = (status: string) => {
        switch (status) {
            case 'approved':
                return { bg: '#d1fae5', color: '#065f46' };
            case 'rejected':
                return { bg: '#fee2e2', color: '#991b1b' };
            case 'in-review':
                return { bg: '#e0f2fe', color: '#075985' };
            case 'action-required':
                return { bg: '#fef3c7', color: '#92400e' };
            default:
                return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <header className="navbar">
                <div className="navbar-inner">
                    <button onClick={() => router.push('/')} className="navbar-brand">
                        TrekStar<span className="navbar-brand-dot" />
                    </button>
                    <nav className="navbar-nav">
                        <button onClick={() => router.push('/')} className="navbar-link">Home</button>
                        <button onClick={() => router.push('/destinations')} className="navbar-link">Destinations</button>
                        <button onClick={() => router.push('/packages')} className="navbar-link">Packages</button>
                        <button className="navbar-link" style={{ color: 'var(--gold)', fontWeight: 600 }}>Visa Services</button>
                        {isAuthenticated ? (
                            <div className="profile-dropdown-container">
                                <button className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                                    Hi, {user?.name?.split(' ')[0]} ▾
                                </button>
                                <div className="profile-dropdown-menu">
                                    <button onClick={() => router.push('/my-packages')} className="profile-dropdown-item">🎒 My Itineraries</button>
                                    <button onClick={() => { logout(); }} className="profile-dropdown-item" style={{ color: '#b91c1c' }}>🚪 Logout</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary">Sign In</button>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--navy) 0%, #1e3a5f 100%)',
                padding: '4.5rem 2rem 4rem',
                textAlign: 'center',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', zIndex: 2, position: 'relative' }}>
                    <p style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>
                        Expert Visa & Immigration Consultants
                    </p>
                    <h1 style={{ color: '#fff', fontSize: 'clamp(2.2rem, 6vw, 3.2rem)', marginBottom: '1.25rem', fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Visa Services Made Simple
                    </h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1.05rem', lineHeight: '1.65', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Track eligibility scores, explore standard visa requirements, submit online applications, and check real-time updates.
                    </p>

                    {/* Tab Navigation */}
                    <div style={{
                        display: 'inline-flex',
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '5px',
                        borderRadius: '30px',
                        border: '1px solid rgba(255, 255, 255, 0.12)'
                    }}>
                        {[
                            { id: 'directory', label: '📖 Visa Directory' },
                            { id: 'calculator', label: '📊 Points Calculator' },
                            { id: 'apply', label: '✍️ Apply Online' },
                            { id: 'track', label: '⏳ Track Application' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id as any)}
                                style={{
                                    padding: '10px 22px',
                                    borderRadius: '25px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: activeTab === t.id ? 'var(--navy)' : 'rgba(255,255,255,0.85)',
                                    background: activeTab === t.id ? '#fff' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.24s ease'
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '3.5rem 2rem' }}>
                
                {/* ─── TAB 1: VISA DIRECTORY ─── */}
                {activeTab === 'directory' && (
                    <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem' }}>
                        {/* Sidebar selectors */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="card" style={{ padding: '1.25rem' }}>
                                <h4 style={{ fontSize: '0.82rem', color: 'var(--smoke)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Select Country</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {Object.keys(COUNTRY_VISA_DATA).map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setDirCountry(c)}
                                            style={{
                                                textAlign: 'left',
                                                padding: '10px 14px',
                                                borderRadius: '6px',
                                                fontSize: '0.9rem',
                                                fontWeight: dirCountry === c ? 600 : 500,
                                                color: dirCountry === c ? 'var(--navy)' : 'var(--ink-soft)',
                                                background: dirCountry === c ? 'var(--gold-muted)' : 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            🌐 {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="card" style={{ padding: '1.25rem' }}>
                                <h4 style={{ fontSize: '0.82rem', color: 'var(--smoke)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Select Visa Category</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {[
                                        { id: 'tourist', label: '🏖️ Tourist Visa' },
                                        { id: 'business', label: '💼 Business Visa' },
                                        { id: 'study', label: '🎓 Student Visa' },
                                        { id: 'work', label: '🛠️ Work Visa' },
                                        { id: 'pr', label: '🛂 Permanent Residency' }
                                    ].map(vt => {
                                        const exists = !!COUNTRY_VISA_DATA[dirCountry]?.[vt.id];
                                        return (
                                            <button
                                                key={vt.id}
                                                onClick={() => exists && setDirVisaType(vt.id)}
                                                disabled={!exists}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '10px 14px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: dirVisaType === vt.id ? 600 : 500,
                                                    color: !exists ? 'var(--mist)' : (dirVisaType === vt.id ? 'var(--navy)' : 'var(--ink-soft)'),
                                                    background: dirVisaType === vt.id ? 'var(--gold-muted)' : 'transparent',
                                                    border: 'none',
                                                    cursor: exists ? 'pointer' : 'not-allowed',
                                                    transition: 'all 0.2s',
                                                    opacity: exists ? 1 : 0.45
                                                }}
                                            >
                                                {vt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Content display */}
                        <div>
                            <div className="card" style={{ padding: '2.5rem' }}>
                                <span className="eyebrow" style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>{dirCountry}</span>
                                <h2 style={{ fontSize: '1.8rem', color: 'var(--navy)', marginTop: '0.4rem', marginBottom: '1.25rem', fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    {visaInfo.title}
                                </h2>
                                
                                <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '2rem' }}>
                                    {visaInfo.overview}
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.72rem', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>CONSULAR FEE</p>
                                        <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)' }}>{visaInfo.fee}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.72rem', color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>PROCESSING DURATION</p>
                                        <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)' }}>{visaInfo.processingTime}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        <h4 style={{ fontSize: '0.92rem', color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontWeight: 700 }}>📋 Key Requirements</h4>
                                        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {visaInfo.requirements.map((req, i) => (
                                                <li key={i} style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.92rem', color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontWeight: 700 }}>📁 Essential Documents</h4>
                                        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {visaInfo.documents.map((doc, i) => (
                                                <li key={i} style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{doc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div style={{ marginTop: '2.5rem', textAlign: 'right' }}>
                                    <button onClick={() => {
                                        setApplyForm(prev => ({
                                            ...prev,
                                            destinationCountry: dirCountry,
                                            visaType: dirVisaType
                                        }));
                                        setActiveTab('apply');
                                    }} className="btn-gold" style={{ padding: '0.8rem 2.2rem' }}>
                                        Start Visa Application ➔
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── TAB 2: ELIGIBILITY CALCULATOR ─── */}
                {activeTab === 'calculator' && (
                    <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
                        {/* Calculator Input Form */}
                        <div className="card">
                            <h3 style={{ fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>Evaluate Your Eligibility Points</h3>
                            <form onSubmit={handleCalcSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="field">
                                        <label className="label">Destination Country</label>
                                        <select
                                            value={calcForm.destinationCountry}
                                            onChange={e => setCalcForm(prev => ({ ...prev, destinationCountry: e.target.value }))}
                                            className="input"
                                        >
                                            <option value="Canada">Canada</option>
                                            <option value="Australia">Australia</option>
                                            <option value="USA">United States</option>
                                            <option value="UK">United Kingdom</option>
                                        </select>
                                    </div>
                                    
                                    <div className="field">
                                        <label className="label">Visa Category</label>
                                        <select
                                            value={calcForm.visaType}
                                            onChange={e => setCalcForm(prev => ({ ...prev, visaType: e.target.value }))}
                                            className="input"
                                        >
                                            <option value="work">Work Visa</option>
                                            <option value="study">Student Visa</option>
                                            <option value="pr">Permanent Residency (PR)</option>
                                            <option value="tourist">Tourist Visa</option>
                                            <option value="business">Business Visa</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="field">
                                        <label className="label">Age (Years)</label>
                                        <input
                                            type="number"
                                            value={calcForm.age}
                                            onChange={e => setCalcForm(prev => ({ ...prev, age: e.target.value }))}
                                            min={18} max={99} required
                                            className="input"
                                        />
                                    </div>
                                    
                                    <div className="field">
                                        <label className="label">Education Level</label>
                                        <select
                                            value={calcForm.education}
                                            onChange={e => setCalcForm(prev => ({ ...prev, education: e.target.value }))}
                                            className="input"
                                        >
                                            <option value="diploma">High School / Diploma</option>
                                            <option value="bachelors">Bachelor's Degree</option>
                                            <option value="masters">Master's Degree</option>
                                            <option value="doctoral">PhD / Doctoral</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="field">
                                        <label className="label">Work Experience (Years)</label>
                                        <input
                                            type="number"
                                            value={calcForm.experience}
                                            onChange={e => setCalcForm(prev => ({ ...prev, experience: e.target.value }))}
                                            min={0} max={40} required
                                            className="input"
                                        />
                                    </div>
                                    
                                    <div className="field">
                                        <label className="label">IELTS Language Band Score</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={calcForm.ielts}
                                            onChange={e => setCalcForm(prev => ({ ...prev, ielts: e.target.value }))}
                                            min={3.0} max={9.0} required
                                            className="input"
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">Monthly Income (USD Equivalent)</label>
                                    <input
                                        type="number"
                                        value={calcForm.monthlyIncome}
                                        onChange={e => setCalcForm(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                                        min={0} required
                                        className="input"
                                        placeholder="e.g. 3500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={calcLoading}
                                    className="btn-primary"
                                    style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
                                >
                                    {calcLoading ? 'Evaluating Profile...' : 'Calculate My Eligibility ➔'}
                                </button>
                            </form>
                        </div>

                        {/* Evaluation Result View */}
                        <div>
                            {calcResult ? (
                                <div className="card-luxury" style={{ padding: '2.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <div>
                                            <span className="eyebrow">Evaluation Result</span>
                                            <h3 style={{ fontSize: '1.5rem', color: 'var(--navy)', textTransform: 'capitalize' }}>
                                                {calcResult.visaType} Eligibility ({calcResult.destinationCountry})
                                            </h3>
                                        </div>
                                        <div style={{
                                            width: '72px',
                                            height: '72px',
                                            borderRadius: '50%',
                                            border: '3px solid var(--gold)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'var(--cream)'
                                        }}>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)' }}>{calcResult.score}</span>
                                            <span style={{ fontSize: '0.62rem', color: 'var(--stone)', fontWeight: 700 }}>/100</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '5px 15px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        marginBottom: '1.25rem',
                                        background: calcResult.status === 'highly-eligible' || calcResult.status === 'eligible' ? '#e6f4ea' : '#fce8e6',
                                        color: calcResult.status === 'highly-eligible' || calcResult.status === 'eligible' ? '#137333' : '#c5221f'
                                    }}>
                                        🎯 {calcResult.status.replace('-', ' ')}
                                    </div>

                                    {/* Recommendation text */}
                                    <p style={{
                                        fontSize: '0.92rem',
                                        color: 'var(--ink-soft)',
                                        lineHeight: 1.6,
                                        background: 'var(--cream)',
                                        padding: '1.25rem',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-gold)',
                                        marginBottom: '2rem'
                                    }}>
                                        {calcResult.recommendation}
                                    </p>

                                    {/* Score Breakdown List */}
                                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--navy)', marginBottom: '0.75rem', fontWeight: 700 }}>
                                        Criteria Point Breakdown:
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        {calcResult.breakdown.map((item: any, i: number) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border)' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--navy)' }}>{item.criteria}</p>
                                                    <p style={{ fontSize: '0.72rem', color: 'var(--stone)' }}>{item.detail}</p>
                                                </div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink-soft)' }}>
                                                    {item.score} <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--mist)' }}>/ {item.max}</span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                        <button onClick={() => {
                                            setApplyForm(prev => ({
                                                ...prev,
                                                destinationCountry: calcResult.destinationCountry,
                                                visaType: calcResult.visaType
                                            }));
                                            setActiveTab('apply');
                                        }} className="btn-gold" style={{ flex: 1, justifyContent: 'center' }}>
                                            Proceed to Application
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '4rem 2rem',
                                    border: '2px dashed var(--border-warm)',
                                    borderRadius: '14px',
                                    color: 'var(--stone)'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
                                    <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '0.4rem' }}>Awaiting Input Profile</h3>
                                    <p style={{ fontSize: '0.88rem' }}>Fill in your career details and calculate eligibility score instantly.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── TAB 3: APPLY ONLINE FORM ─── */}
                {activeTab === 'apply' && (
                    <div className="animate-slide-up" style={{ maxWidth: '650px', margin: '0 auto' }}>
                        <div className="card">
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <span className="eyebrow">Step-by-Step Submission</span>
                                <h2 style={{ fontSize: '1.6rem', color: 'var(--navy)', marginTop: '0.4rem' }}>Visa Application Portal</h2>
                                <p style={{ color: 'var(--stone)', fontSize: '0.88rem', marginTop: '0.2rem' }}>Fill out passport details and secure mock uploads.</p>
                            </div>

                            {applySuccess ? (
                                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                    <div style={{ fontSize: '4rem', color: '#137333', marginBottom: '1rem' }}>✅</div>
                                    <h3 style={{ fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>Application Submitted!</h3>
                                    <p style={{ color: 'var(--ink-soft)' }}>Redirecting you to tracking portal to monitor processing status...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="field">
                                            <label className="label">Destination Country</label>
                                            <select
                                                value={applyForm.destinationCountry}
                                                onChange={e => setApplyForm(prev => ({ ...prev, destinationCountry: e.target.value }))}
                                                className="input"
                                            >
                                                <option value="Canada">Canada</option>
                                                <option value="Australia">Australia</option>
                                                <option value="USA">United States</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="Germany">Germany</option>
                                                <option value="France">France</option>
                                                <option value="Japan">Japan</option>
                                                <option value="Singapore">Singapore</option>
                                            </select>
                                        </div>

                                        <div className="field">
                                            <label className="label">Visa Type</label>
                                            <select
                                                value={applyForm.visaType}
                                                onChange={e => setApplyForm(prev => ({ ...prev, visaType: e.target.value as any }))}
                                                className="input"
                                            >
                                                <option value="tourist">Tourist Visa</option>
                                                <option value="business">Business Visa</option>
                                                <option value="study">Student Visa</option>
                                                <option value="work">Work Visa</option>
                                                <option value="pr">Permanent Residency (PR)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label className="label">Applicant Full Name (As in Passport)</label>
                                        <input
                                            type="text"
                                            value={applyForm.fullName}
                                            onChange={e => setApplyForm(prev => ({ ...prev, fullName: e.target.value }))}
                                            required
                                            className="input"
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="field">
                                            <label className="label">Email Address</label>
                                            <input
                                                type="email"
                                                value={applyForm.email}
                                                onChange={e => setApplyForm(prev => ({ ...prev, email: e.target.value }))}
                                                required
                                                className="input"
                                                placeholder="e.g. john@example.com"
                                            />
                                        </div>

                                        <div className="field">
                                            <label className="label">Phone Number</label>
                                            <input
                                                type="text"
                                                value={applyForm.phone}
                                                onChange={e => setApplyForm(prev => ({ ...prev, phone: e.target.value }))}
                                                required
                                                className="input"
                                                placeholder="e.g. +1 234 567 890"
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="field">
                                            <label className="label">Passport Number</label>
                                            <input
                                                type="text"
                                                value={applyForm.passportNumber}
                                                onChange={e => setApplyForm(prev => ({ ...prev, passportNumber: e.target.value }))}
                                                required
                                                className="input"
                                                placeholder="e.g. A12345678"
                                            />
                                        </div>

                                        <div className="field">
                                            <label className="label">Nationality</label>
                                            <input
                                                type="text"
                                                value={applyForm.nationality}
                                                onChange={e => setApplyForm(prev => ({ ...prev, nationality: e.target.value }))}
                                                required
                                                className="input"
                                                placeholder="e.g. Indian"
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="field">
                                            <label className="label">Planned Departure Date</label>
                                            <input
                                                type="date"
                                                value={applyForm.departureDate}
                                                onChange={e => setApplyForm(prev => ({ ...prev, departureDate: e.target.value }))}
                                                required
                                                className="input"
                                            />
                                        </div>

                                        <div className="field">
                                            <label className="label">Upload Documents (List, comma-separated)</label>
                                            <input
                                                type="text"
                                                value={applyForm.documentsList}
                                                onChange={e => setApplyForm(prev => ({ ...prev, documentsList: e.target.value }))}
                                                className="input"
                                                placeholder="e.g. Passport Scan, Bank Statement, IELTS Certificate"
                                            />
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label className="label">Additional Notes</label>
                                        <textarea
                                            value={applyForm.additionalNotes}
                                            onChange={e => setApplyForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                                            className="input"
                                            rows={3}
                                            placeholder="Mention specific concerns or urgent schedules..."
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={applySubmitting}
                                        className="btn-gold"
                                        style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
                                    >
                                        {applySubmitting ? 'Submitting Application...' : (isAuthenticated ? 'Submit Secure Visa Application' : 'Sign In to Submit Application')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── TAB 4: TRACK APPLICATIONS ─── */}
                {activeTab === 'track' && (
                    <div className="animate-slide-up">
                        <div className="card">
                            <h3 style={{ fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>Your Visa Application Log</h3>
                            
                            {trackLoading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: '70px', borderRadius: '6px' }} />)}
                                </div>
                            ) : myApps.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📑</div>
                                    <h4 style={{ fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '0.4rem' }}>No Active Visa Applications</h4>
                                    <p style={{ color: 'var(--stone)', fontSize: '0.88rem' }}>You have not submitted any visa applications yet. Go to the "Apply Online" tab to get started.</p>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid var(--border-warm)' }}>
                                                <th style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--stone)', textTransform: 'uppercase' }}>Reference ID</th>
                                                <th style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--stone)', textTransform: 'uppercase' }}>Country & Type</th>
                                                <th style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--stone)', textTransform: 'uppercase' }}>Submission Date</th>
                                                <th style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--stone)', textTransform: 'uppercase' }}>Status</th>
                                                <th style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--stone)', textTransform: 'uppercase' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myApps.map((app: any) => {
                                                const badge = statusBadgeStyles(app.status);
                                                return (
                                                    <tr key={app._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                                        <td style={{ padding: '16px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--navy)' }}>
                                                            #{app._id.slice(-6).toUpperCase()}
                                                        </td>
                                                        <td style={{ padding: '16px' }}>
                                                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy)', textTransform: 'capitalize' }}>
                                                                {app.destinationCountry}
                                                            </p>
                                                            <p style={{ fontSize: '0.75rem', color: 'var(--stone)', textTransform: 'capitalize' }}>
                                                                {app.visaType} Visa
                                                            </p>
                                                        </td>
                                                        <td style={{ padding: '16px', fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
                                                            {new Date(app.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ padding: '16px' }}>
                                                            <span style={{
                                                                display: 'inline-block',
                                                                padding: '4px 10px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.72rem',
                                                                fontWeight: 700,
                                                                textTransform: 'uppercase',
                                                                background: badge.bg,
                                                                color: badge.color
                                                            }}>
                                                                {app.status.replace('-', ' ')}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '16px' }}>
                                                            <button
                                                                onClick={() => setSelectedApp(app)}
                                                                className="btn-ghost"
                                                                style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                                                            >
                                                                🔍 View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Tracking Details Modal */}
            {selectedApp && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 100,
                    background: 'rgba(15, 28, 46, 0.45)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }} className="animate-fade-in">
                    <div className="card animate-fade-scale" style={{
                        maxWidth: '650px',
                        width: '100%',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        padding: '2rem',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setSelectedApp(null)}
                            style={{
                                position: 'absolute',
                                top: '1.25rem',
                                right: '1.25rem',
                                border: 'none',
                                background: 'transparent',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: 'var(--stone)'
                            }}
                        >
                            ✕
                        </button>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <span className="eyebrow">Application Log Details</span>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--navy)', textTransform: 'capitalize', marginTop: '0.2rem' }}>
                                {selectedApp.destinationCountry} {selectedApp.visaType} Visa
                            </h3>
                            <p style={{ fontSize: '0.78rem', color: 'var(--stone)' }}>
                                Application reference: #{selectedApp._id.toUpperCase()}
                            </p>
                        </div>

                        {/* Status timeline */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--navy)', marginBottom: '1rem', fontWeight: 700 }}>
                                ⏳ Processing Progress Timeline
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingLeft: '10px', borderLeft: '2px solid var(--border-warm)' }}>
                                {selectedApp.timeline.map((event: any, idx: number) => (
                                    <div key={idx} style={{ position: 'relative' }}>
                                        {/* Dot */}
                                        <div style={{
                                            position: 'absolute',
                                            left: '-16px',
                                            top: '4px',
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: idx === selectedApp.timeline.length - 1 ? 'var(--gold)' : 'var(--stone)',
                                            border: '2px solid #fff'
                                        }} />
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', textTransform: 'uppercase' }}>
                                                {event.status.replace('-', ' ')}
                                            </span>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--stone)' }}>
                                                {new Date(event.date).toLocaleString()}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>{event.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Document checklist */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--navy)', marginBottom: '0.75rem', fontWeight: 700 }}>
                                📁 File Checklists
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {selectedApp.documents.map((doc: any, idx: number) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--cream)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: '0.88rem', color: 'var(--navy)', fontWeight: 500 }}>📄 {doc.name}</span>
                                        <span style={{
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            color: doc.status === 'verified' ? '#137333' : '#92400e'
                                        }}>
                                            {doc.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                            <button onClick={() => setSelectedApp(null)} className="btn-primary" style={{ padding: '0.6rem 1.8rem' }}>
                                Close Log Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="footer">
                <div className="footer-inner">
                    <span className="footer-brand">TrekStar<span style={{ color: 'var(--gold)', marginLeft: 2 }}>.</span></span>
                    <p className="footer-copy">© 2026 TrekStar Travels. All rights reserved.</p>
                </div>
            </footer>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            
            {/* Custom Toast */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--navy)',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000,
                    fontSize: '0.88rem',
                    fontWeight: 500
                }}>
                    {toast}
                </div>
            )}
        </div>
    );
}
