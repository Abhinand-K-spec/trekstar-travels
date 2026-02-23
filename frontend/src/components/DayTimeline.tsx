'use client';

import { DailyPlan } from '@/types/types';
import HotelCard from './HotelCard';
import ActivityCard from './ActivityCard';

interface DayTimelineProps {
    dailyPlans: DailyPlan[];
    selectedDay: number;
    onDaySelect: (day: number) => void;
    onSwapHotel?: (day: number) => void;
    onRemoveActivity?: (day: number, activityIndex: number) => void;
    onAddActivity?: (day: number) => void;
}

export default function DayTimeline({
    dailyPlans,
    selectedDay,
    onDaySelect,
    onSwapHotel,
    onRemoveActivity,
    onAddActivity,
}: DayTimelineProps) {
    return (
        <div className="timeline">
            {dailyPlans.map((dayPlan) => {
                const isActive = selectedDay === dayPlan.day;
                return (
                    <div key={dayPlan.day} className="timeline-row">
                        {/* Day Number Button */}
                        <button
                            onClick={() => onDaySelect(dayPlan.day)}
                            className={`timeline-day-btn${isActive ? ' active' : ''}`}
                        >
                            {dayPlan.day}
                        </button>

                        {/* Day Title */}
                        <h3
                            className={`timeline-day-title${!isActive ? ' dimmed' : ''}`}
                            onClick={() => onDaySelect(dayPlan.day)}
                        >
                            {dayPlan.title || `Day ${dayPlan.day} Exploration`}
                        </h3>
                        <div className="timeline-day-underline" />

                        {/* Expanded Day Content */}
                        {isActive && (
                            <div className="timeline-content animate-slide-up">
                                {/* Hotel */}
                                {dayPlan.hotel && (
                                    <div style={{ marginBottom: '1.25rem' }}>
                                        <div className="section-label">
                                            <span className="section-label-dot" />
                                            <span className="section-label-text">Accommodation</span>
                                        </div>
                                        <HotelCard
                                            hotel={dayPlan.hotel}
                                            dayNumber={dayPlan.day}
                                            onSwap={onSwapHotel ? () => onSwapHotel(dayPlan.day) : undefined}
                                        />
                                    </div>
                                )}

                                {/* Activities */}
                                <div>
                                    <div className="section-label">
                                        <span className="section-label-dot" />
                                        <span className="section-label-text">Activities & Sights</span>
                                    </div>
                                    {dayPlan.activities.map((activityItem, index) => (
                                        <ActivityCard
                                            key={index}
                                            activity={activityItem.activity}
                                            timeSlot={activityItem.timeSlot}
                                            order={index + 1}
                                            onRemove={
                                                onRemoveActivity
                                                    ? () => onRemoveActivity(dayPlan.day, index)
                                                    : undefined
                                            }
                                        />
                                    ))}
                                </div>

                                {/* Add Activity */}
                                {onAddActivity && (
                                    <button
                                        onClick={() => onAddActivity(dayPlan.day)}
                                        className="timeline-add-btn"
                                    >
                                        + Add Experience
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
