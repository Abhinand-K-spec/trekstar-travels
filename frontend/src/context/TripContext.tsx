'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TripPreferences, Itinerary, Pricing } from '@/types/types';

interface TripContextType {
    preferences: TripPreferences;
    setPreferences: (preferences: TripPreferences) => void;
    updatePreferences: (updates: Partial<TripPreferences>) => void;
    itinerary: Itinerary | null;
    setItinerary: (itinerary: Itinerary | null) => void;
    pricing: Pricing | null;
    setPricing: (pricing: Pricing | null) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const defaultPreferences: TripPreferences = {
    destination: null,
    travelMonth: '',
    duration: 7,
    travelCompanion: '',
    groupSize: undefined,
    travelMood: '',
    budget: {
        min: 1000,
        max: 5000,
        currency: 'USD',
    },
    departureCity: '',
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
    const [preferences, setPreferences] = useState<TripPreferences>(defaultPreferences);
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);
    const [pricing, setPricing] = useState<Pricing | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const updatePreferences = (updates: Partial<TripPreferences>) => {
        setPreferences((prev) => ({ ...prev, ...updates }));
    };

    return (
        <TripContext.Provider
            value={{
                preferences,
                setPreferences,
                updatePreferences,
                itinerary,
                setItinerary,
                pricing,
                setPricing,
                currentStep,
                setCurrentStep,
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </TripContext.Provider>
    );
};

export const useTripContext = () => {
    const context = useContext(TripContext);
    if (context === undefined) {
        throw new Error('useTripContext must be used within a TripProvider');
    }
    return context;
};
