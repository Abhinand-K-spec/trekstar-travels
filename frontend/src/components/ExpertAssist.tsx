'use client';

import { useState } from 'react';

export default function ExpertAssist() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Your request has been submitted to our concierge team.');
        setIsOpen(false);
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <>
            {/* Floating Concierge Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="concierge-btn"
                title="Talk to a Travel Expert"
            >
                {isOpen ? (
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                )}
            </button>

            {/* Concierge Panel */}
            {isOpen && (
                <div className="concierge-panel animate-slide-up">
                    <div className="concierge-header">
                        <p className="concierge-header-eyebrow">Concierge</p>
                        <h3 className="concierge-header-title">Expert Assist</h3>
                        <p className="concierge-header-sub">Personalised guidance for your journey.</p>
                    </div>
                    <div className="concierge-body">
                        <form onSubmit={handleSubmit} className="concierge-form">
                            <div>
                                <label className="label">Your Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    placeholder="John Smith"
                                    className="concierge-input"
                                />
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    placeholder="john@example.com"
                                    className="concierge-input"
                                />
                            </div>
                            <div>
                                <label className="label">Message</label>
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    required
                                    rows={3}
                                    placeholder="How can we help plan your trip?"
                                    className="concierge-input"
                                />
                            </div>
                            <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
