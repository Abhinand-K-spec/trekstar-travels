'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';

const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
        submitted: { bg: 'rgba(234,179,8,0.15)', color: '#fbbf24' },
        'in-review': { bg: 'rgba(14,165,233,0.15)', color: '#38bdf8' },
        'action-required': { bg: 'rgba(249,115,22,0.15)', color: '#fb923c' },
        approved: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
        rejected: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' }
    };
    const c = colors[status] || { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' };
    return (
        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', background: c.bg, color: c.color }}>
            {status.replace('-', ' ')}
        </span>
    );
};

export default function AdminVisaDashboard() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [updateStatus, setUpdateStatus] = useState('submitted');
    const [updateNote, setUpdateNote] = useState('');
    const [updating, setUpdating] = useState(false);
    
    // Toast state
    const [toast, setToast] = useState<string | null>(null);
    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await api.adminGetVisaApplications({
                status: filterStatus || undefined,
                search: search || undefined
            });
            if (res.success && res.data) {
                setApplications(res.data);
            } else {
                showToast(res.error || 'Failed to fetch visa applications');
            }
        } catch (error) {
            showToast('Network error while retrieving applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [filterStatus]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchApplications();
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApp) return;

        setUpdating(true);
        try {
            const res = await api.adminUpdateVisaApplication(selectedApp._id, {
                status: updateStatus,
                timelineNote: updateNote.trim() || undefined
            });

            if (res.success && res.data) {
                showToast('Visa Application Status Updated!');
                setUpdateNote('');
                
                // Update selected app state with refreshed details
                setSelectedApp(res.data);
                
                // Refresh list
                fetchApplications();
            } else {
                showToast(res.error || 'Update failed');
            }
        } catch (error) {
            showToast('Network error during status update');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: '#f1f5f9' }}>
            <div>
                <h1 style={{ color: '#f1f5f9', fontSize: '26px', fontWeight: '700', margin: '0 0 6px' }}>Visa Applications</h1>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Review documents and update status for TrekStar Visa applications</p>
            </div>

            {/* Toolbar Filters */}
            <div style={{
                background: 'rgba(30,41,59,0.6)', border: '1px solid #1e293b', borderRadius: '16px',
                padding: '20px', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center'
            }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '400px' }}>
                    <input
                        type="text"
                        placeholder="Search name, passport, country..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            flex: 1, padding: '8px 14px', borderRadius: '8px',
                            background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '13px', outline: 'none'
                        }}
                    />
                    <button type="submit" style={{
                        background: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px',
                        cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                    }}>
                        Search
                    </button>
                </form>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>Filter by Status:</span>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        style={{
                            padding: '8px 14px', borderRadius: '8px',
                            background: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '13px', outline: 'none', cursor: 'pointer'
                        }}
                    >
                        <option value="">All Statuses</option>
                        <option value="submitted">Submitted</option>
                        <option value="in-review">In Review</option>
                        <option value="action-required">Action Required</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Main Application Table */}
            <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '16px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading visa applications...</div>
                ) : applications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No visa applications found.</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                                    <th style={{ padding: '16px' }}>Applicant</th>
                                    <th style={{ padding: '16px' }}>Passport Details</th>
                                    <th style={{ padding: '16px' }}>Destination & Type</th>
                                    <th style={{ padding: '16px' }}>Departure Date</th>
                                    <th style={{ padding: '16px' }}>Status</th>
                                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map(app => (
                                    <tr key={app._id} style={{ borderBottom: '1px solid #1e293b', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: '600', color: '#f1f5f9' }}>{app.fullName}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{app.email}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ color: '#e2e8f0' }}>{app.passportNumber}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{app.nationality}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ color: '#e2e8f0', textTransform: 'capitalize' }}>{app.destinationCountry}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', textTransform: 'capitalize' }}>
                                                {app.visaType} visa
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: '#cbd5e1' }}>
                                            {new Date(app.departureDate).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            {statusBadge(app.status)}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => {
                                                    setSelectedApp(app);
                                                    setUpdateStatus(app.status);
                                                }}
                                                style={{
                                                    background: '#1e293b', color: '#38bdf8', border: '1px solid #334155',
                                                    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'
                                                }}
                                            >
                                                ⚙️ Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Manage/Edit Application Status Modal */}
            {selectedApp && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
                }}>
                    <div style={{
                        background: '#1e293b', border: '1px solid #334155', borderRadius: '16px',
                        maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
                        padding: '28px', position: 'relative'
                    }}>
                        <button
                            onClick={() => setSelectedApp(null)}
                            style={{
                                position: 'absolute', top: '1.25rem', right: '1.25rem',
                                border: 'none', background: 'transparent', fontSize: '1.5rem',
                                cursor: 'pointer', color: '#94a3b8'
                            }}
                        >
                            ✕
                        </button>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ color: '#0ea5e9', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                                Visa Application File
                            </div>
                            <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>
                                Manage {selectedApp.fullName}
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>
                                ID: {selectedApp._id.toUpperCase()}
                            </p>
                        </div>

                        {/* Split Details & Update Status */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
                            {/* Left Side: Applicant details & documents */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ background: '#0f172a', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                                    <div>
                                        <span style={{ color: '#64748b' }}>Passport: </span>
                                        <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{selectedApp.passportNumber} ({selectedApp.nationality})</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b' }}>Email: </span>
                                        <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{selectedApp.email}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b' }}>Phone: </span>
                                        <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{selectedApp.phone}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b' }}>Destination: </span>
                                        <span style={{ color: '#e2e8f0', fontWeight: '500', textTransform: 'capitalize' }}>{selectedApp.destinationCountry}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b' }}>Visa Type: </span>
                                        <span style={{ color: '#e2e8f0', fontWeight: '500', textTransform: 'capitalize' }}>{selectedApp.visaType}</span>
                                    </div>
                                    {selectedApp.additionalNotes && (
                                        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '8px', marginTop: '4px' }}>
                                            <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '2px' }}>Notes:</div>
                                            <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>"{selectedApp.additionalNotes}"</div>
                                        </div>
                                    )}
                                </div>

                                {/* Files checklist */}
                                <div>
                                    <h4 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>File Checklist</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {selectedApp.documents.map((doc: any, i: number) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: '#0f172a', padding: '8px 12px', borderRadius: '6px', fontSize: '12px' }}>
                                                <span style={{ color: '#e2e8f0' }}>📄 {doc.name}</span>
                                                <span style={{ color: doc.status === 'verified' ? '#34d399' : '#fb923c', fontWeight: 600 }}>{doc.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Update Status Form */}
                            <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                                <h4 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Update Status</h4>
                                <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Select New Status</label>
                                        <select
                                            value={updateStatus}
                                            onChange={e => setUpdateStatus(e.target.value)}
                                            style={{
                                                padding: '8px 12px', borderRadius: '8px',
                                                background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: '13px', outline: 'none'
                                            }}
                                        >
                                            <option value="submitted">Submitted</option>
                                            <option value="in-review">In Review</option>
                                            <option value="action-required">Action Required</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Timeline Update Note</label>
                                        <textarea
                                            placeholder="Write message for the applicant..."
                                            value={updateNote}
                                            onChange={e => setUpdateNote(e.target.value)}
                                            rows={4}
                                            style={{
                                                padding: '8px 12px', borderRadius: '8px',
                                                background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: '13px', outline: 'none', resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={updating}
                                        style={{
                                            background: '#0ea5e9', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px',
                                            cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginTop: '6px', textAlign: 'center'
                                        }}
                                    >
                                        {updating ? 'Saving...' : 'Apply Status Update'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Recent History / Timeline */}
                        <div style={{ marginTop: '24px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
                            <h4 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>History Logs</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '8px', borderLeft: '2px solid #334155' }}>
                                {selectedApp.timeline.map((event: any, i: number) => (
                                    <div key={i} style={{ fontSize: '12px', position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', left: '-13px', top: '4px',
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            background: '#64748b', border: '1.5px solid #1e293b'
                                        }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                                            <span style={{ fontWeight: '700', textTransform: 'uppercase', color: '#e2e8f0' }}>{event.status.replace('-', ' ')}</span>
                                            <span>{new Date(event.date).toLocaleString()}</span>
                                        </div>
                                        <p style={{ color: '#64748b', marginTop: '2px' }}>{event.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '24px', right: '24px',
                    background: '#0ea5e9', color: '#fff', padding: '12px 24px',
                    borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                    zIndex: 2000, fontSize: '0.88rem', fontWeight: 500
                }}>
                    {toast}
                </div>
            )}
        </div>
    );
}
