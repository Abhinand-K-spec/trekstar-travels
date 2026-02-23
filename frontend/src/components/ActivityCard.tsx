'use client';

import { Activity } from '@/types/types';

interface ActivityCardProps {
    activity: Activity;
    timeSlot?: string;
    order: number;
    onRemove?: () => void;
    isDraggable?: boolean;
}

export default function ActivityCard({
    activity,
    timeSlot,
    order,
    onRemove,
}: ActivityCardProps) {
    return (
        <div className="activity-card">
            {/* Image */}
            <div className="activity-img-wrap">
                <img
                    src={activity.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'}
                    alt={activity.name}
                    className="activity-img"
                />
                {timeSlot && (
                    <span className="activity-timeslot">{timeSlot}</span>
                )}
            </div>

            {/* Info */}
            <div className="activity-info">
                <div>
                    <div className="activity-order">Activity {order}</div>
                    <h4 className="activity-name">{activity.name}</h4>
                    {activity.rating && (
                        <div className="activity-rating">
                            <span style={{ color: '#d4970a' }}>★</span>
                            {activity.rating.toFixed(1)} rating
                        </div>
                    )}
                    {activity.description && (
                        <p className="activity-desc">{activity.description}</p>
                    )}
                </div>

                <div className="activity-footer">
                    {activity.duration && (
                        <span className="activity-duration">
                            {activity.duration.hours}h{activity.duration.minutes > 0 ? ` ${activity.duration.minutes}m` : ''}
                        </span>
                    )}
                    <span className="activity-price">${activity.price}</span>
                </div>
            </div>

            {/* Remove Button */}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="activity-remove-btn"
                    title="Remove activity"
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
