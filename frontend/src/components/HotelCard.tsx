'use client';

import { Hotel } from '@/types/types';

interface HotelCardProps {
    hotel: Hotel;
    dayNumber: number;
    onSwap?: () => void;
}

export default function HotelCard({ hotel, dayNumber, onSwap }: HotelCardProps) {
    return (
        <div className="hotel-card">
            {/* Image */}
            <div className="hotel-img-wrap">
                <img
                    src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                    alt={hotel.name}
                    className="hotel-img"
                />
                <span className="hotel-stay-tag">Stay</span>
            </div>

            {/* Info */}
            <div className="hotel-info">
                <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <h4 className="hotel-name">{hotel.name}</h4>
                        {onSwap && (
                            <button onClick={onSwap} className="hotel-modify-btn">Modify</button>
                        )}
                    </div>
                    {hotel.rating && (
                        <div className="hotel-rating">
                            <span className="hotel-star">★</span>
                            {hotel.rating.toFixed(1)}
                            {hotel.reviewCount && <span>· {hotel.reviewCount} reviews</span>}
                        </div>
                    )}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="hotel-amenities">
                            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                <span key={idx} className="hotel-amenity">{amenity}</span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hotel-footer">
                    <div>
                        <span className="hotel-room-label">Room Type</span>
                        <span className="hotel-room-type">{hotel.roomType || 'Deluxe Suite'}</span>
                    </div>
                    <div>
                        <span className="hotel-price">
                            ${hotel.pricePerNight}
                            <span className="hotel-price-unit">/ night</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
