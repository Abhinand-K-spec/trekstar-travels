'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Itinerary, Hotel, Activity } from '@/types/types';
import DayTimeline from '@/components/DayTimeline';
import InteractiveMap from '@/components/InteractiveMap';
import ExpertAssist from '@/components/ExpertAssist';

export default function ItineraryPage() {
    const params = useParams();
    const router = useRouter();
    const itineraryId = params.id as string;

    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [selectedDay, setSelectedDay] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [showHotelSwapModal, setShowHotelSwapModal] = useState(false);
    const [showActivityAddModal, setShowActivityAddModal] = useState(false);
    const [swapDay, setSwapDay] = useState<number | null>(null);
    const [addActivityDay, setAddActivityDay] = useState<number | null>(null);
    const [availableHotels, setAvailableHotels] = useState<Hotel[]>([]);
    const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);

    useEffect(() => {
        if (itineraryId) fetchItinerary();
    }, [itineraryId]);

    const fetchItinerary = async () => {
        setIsLoading(true);
        try {
            const response = await api.getItinerary(itineraryId);
            if (response.success && response.data) {
                setItinerary(response.data);
            } else {
                router.push('/');
            }
        } catch (err) {
            console.error('Failed to load itinerary:', err);
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwapHotel = async (day: number) => {
        setSwapDay(day);
        if (itinerary) {
            const response = await api.getAvailableHotels(itinerary.destination.city);
            if (response.success && response.data) {
                setAvailableHotels(response.data);
                setShowHotelSwapModal(true);
            }
        }
    };

    const confirmSwapHotel = async (newHotel: Hotel) => {
        if (swapDay && itinerary) {
            const response = await api.swapHotel(itineraryId, swapDay, newHotel);
            if (response.success && response.data) {
                setItinerary(response.data);
                setShowHotelSwapModal(false);
                setSwapDay(null);
            }
        }
    };

    const handleAddActivity = async (day: number) => {
        setAddActivityDay(day);
        if (itinerary) {
            const response = await api.getAvailableActivities(itinerary.destination.city, itinerary.travelMood);
            if (response.success && response.data) {
                setAvailableActivities(response.data);
                setShowActivityAddModal(true);
            }
        }
    };

    const confirmAddActivity = async (activity: Activity) => {
        if (addActivityDay && itinerary) {
            const response = await api.addActivity(itineraryId, addActivityDay, activity);
            if (response.success && response.data) {
                setItinerary(response.data);
                setShowActivityAddModal(false);
                setAddActivityDay(null);
            }
        }
    };

    const handleRemoveActivity = async (day: number, activityIndex: number) => {
        const response = await api.removeActivity(itineraryId, day, activityIndex);
        if (response.success && response.data) setItinerary(response.data);
    };

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
                <p className="loading-text">Crafting your itinerary…</p>
            </div>
        );
    }

    if (!itinerary) return null;

    return (
        <div className="itin-page">
            {/* Fixed Header */}
            <header className="itin-header">
                <div className="itin-header-inner">
                    <div className="itin-header-left">
                        <button className="btn-icon" onClick={() => router.push('/')}>←</button>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <h1 className="itin-title">{itinerary.destination.city}</h1>
                                <span className="badge">{itinerary.travelMood}</span>
                            </div>
                            <p className="itin-meta">
                                {itinerary.duration} Days &nbsp;·&nbsp; {itinerary.travelMonth}
                            </p>
                        </div>
                    </div>
                    <div className="itin-header-right">
                        <button className="btn-ghost" style={{ display: 'none' }}>Export PDF</button>
                        <button className="btn-primary">Book This Trip</button>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="itin-body">
                {/* Left: Itinerary */}
                <div className="itin-left">
                    <div className="itin-left-inner animate-fade-in">
                        <span className="eyebrow">Day by Day</span>
                        <h2 className="itin-section-title">The Itinerary</h2>
                        <p className="itin-section-sub">Your journey, curated for every moment.</p>

                        <DayTimeline
                            dailyPlans={itinerary.dailyPlans}
                            selectedDay={selectedDay}
                            onDaySelect={setSelectedDay}
                            onSwapHotel={handleSwapHotel}
                            onRemoveActivity={handleRemoveActivity}
                            onAddActivity={handleAddActivity}
                        />
                    </div>
                </div>

                {/* Right: Map + Pricing */}
                <div className="itin-right">
                    <div className="itin-map-wrap">
                        <InteractiveMap
                            destination={itinerary.destination}
                            markers={itinerary.dailyPlans.map(day => ({
                                lat: itinerary.destination.coordinates?.lat || 0,
                                lng: itinerary.destination.coordinates?.lng || 0,
                                label: `Day ${day.day}`,
                            }))}
                        />
                    </div>

                    <div className="itin-pricing">
                        <div className="itin-pricing-header">
                            <span className="itin-pricing-label">Estimated Total</span>
                            <span className="itin-pricing-total">${itinerary.pricing.total.toLocaleString()}</span>
                        </div>
                        <div className="itin-pricing-grid">
                            <div className="itin-pricing-item">
                                <span className="itin-pricing-item-val">${itinerary.pricing.hotels}</span>
                                <span className="itin-pricing-item-key">Hotels</span>
                            </div>
                            <div className="itin-pricing-item">
                                <span className="itin-pricing-item-val">${itinerary.pricing.activities}</span>
                                <span className="itin-pricing-item-key">Activities</span>
                            </div>
                            <div className="itin-pricing-item">
                                <span className="itin-pricing-item-val">${itinerary.pricing.flights}</span>
                                <span className="itin-pricing-item-key">Flights</span>
                            </div>
                        </div>
                        <button className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                            Confirm Reservation
                        </button>
                    </div>
                </div>
            </div>

            {/* Hotel Swap Modal */}
            {showHotelSwapModal && (
                <div className="modal-backdrop animate-fade-scale" onClick={() => setShowHotelSwapModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h3 className="modal-title">Choose Your Stay</h3>
                                <p className="modal-subtitle">Curated hotels for Day {swapDay}</p>
                            </div>
                            <button className="modal-close" onClick={() => setShowHotelSwapModal(false)}>
                                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            {availableHotels.map((hotel, index) => (
                                <div key={index} className="modal-item" onClick={() => confirmSwapHotel(hotel)}>
                                    <img
                                        src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                                        alt={hotel.name}
                                        className="modal-item-img"
                                    />
                                    <div className="modal-item-info">
                                        <div>
                                            <h4 className="modal-item-name">{hotel.name}</h4>
                                            <div className="modal-item-meta">
                                                <span style={{ color: '#d4970a' }}>★ {hotel.rating?.toFixed(1)}</span>
                                                <span>· {hotel.reviewCount} reviews</span>
                                            </div>
                                        </div>
                                        <div className="modal-item-price">
                                            ${hotel.pricePerNight}
                                            <span className="modal-item-price-unit">/ night</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Activity Modal */}
            {showActivityAddModal && (
                <div className="modal-backdrop animate-fade-scale" onClick={() => setShowActivityAddModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h3 className="modal-title">Add an Experience</h3>
                                <p className="modal-subtitle">Activities for Day {addActivityDay}</p>
                            </div>
                            <button className="modal-close" onClick={() => setShowActivityAddModal(false)}>
                                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            {availableActivities.map((activity, index) => (
                                <div key={index} className="modal-item" onClick={() => confirmAddActivity(activity)}>
                                    <img
                                        src={activity.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'}
                                        alt={activity.name}
                                        className="modal-item-img"
                                    />
                                    <div className="modal-item-info">
                                        <div>
                                            <h4 className="modal-item-name">{activity.name}</h4>
                                            {activity.description && (
                                                <p className="modal-item-desc">{activity.description}</p>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                {activity.duration?.hours}h {activity.duration?.minutes ? `${activity.duration.minutes}m` : ''}
                                            </span>
                                            <div className="modal-item-price">${activity.price}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <ExpertAssist />
        </div>
    );
}
