// TypeScript interfaces and types for the application

export interface Destination {
    city: string;
    country: string;
    description?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    image?: string;
}

export interface Hotel {
    _id?: string;
    name: string;
    location?: {
        city: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    description?: string;
    amenities?: string[];
    rating?: number;
    reviewCount?: number;
    pricePerNight: number;
    images?: string[];
    roomType?: string;
    category?: 'budget' | 'mid-range' | 'luxury' | 'premium';
}

export interface Activity {
    _id?: string;
    name: string;
    description?: string;
    category: 'adventure' | 'culture' | 'food' | 'relaxation' | 'sightseeing' | 'entertainment';
    location?: {
        city: string;
        country: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    duration?: {
        hours: number;
        minutes: number;
    };
    price: number;
    images?: string[];
    rating?: number;
    reviewCount?: number;
    availability?: 'daily' | 'weekdays' | 'weekends' | 'seasonal';
    includeInPackage?: boolean;
}

export interface ActivityItem {
    activity: Activity;
    order: number;
    timeSlot?: string;
}

export interface DailyPlan {
    day: number;
    title?: string;
    hotel?: Hotel;
    activities: ActivityItem[];
    notes?: string;
}

export interface Pricing {
    flights: number;
    hotels: number;
    activities: number;
    total: number;
}

export interface Itinerary {
    _id?: string;
    destination: Destination;
    travelMonth: string;
    duration: number;
    travelCompanion: 'solo' | 'couple' | 'family' | 'friends';
    travelMood: 'relaxed' | 'adventure' | 'culture' | 'foodie';
    budget?: {
        min: number;
        max: number;
        currency: string;
    };
    departureCity?: string;
    dailyPlans: DailyPlan[];
    pricing: Pricing;
    status?: 'draft' | 'confirmed' | 'booked' | 'completed';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TripPreferences {
    destination: Destination | null;
    travelMonth: string;
    duration: number;
    travelCompanion: 'solo' | 'couple' | 'family' | 'friends' | '';
    groupSize?: number; // only relevant when companion is family or friends
    travelMood: 'relaxed' | 'adventure' | 'culture' | 'foodie' | '';
    budget: {
        min: number;
        max: number;
        currency: string;
    };
    departureCity: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export type OnboardingStep = 1 | 2 | 3 | 4;
