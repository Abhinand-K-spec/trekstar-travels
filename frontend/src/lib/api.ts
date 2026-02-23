// API client for making requests to the backend

import { Itinerary, ApiResponse, Destination, Hotel, Activity } from '@/types/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    ...options.headers,
                },
                ...options,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }

    // Itinerary endpoints
    async createItinerary(itineraryData: Partial<Itinerary>): Promise<ApiResponse<Itinerary>> {
        return this.request<Itinerary>('/itineraries', {
            method: 'POST',
            body: JSON.stringify(itineraryData),
        });
    }

    async getItinerary(id: string): Promise<ApiResponse<Itinerary>> {
        return this.request<Itinerary>(`/itineraries/${id}`);
    }

    async updateItinerary(id: string, updates: Partial<Itinerary>): Promise<ApiResponse<Itinerary>> {
        return this.request<Itinerary>(`/itineraries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async swapHotel(
        itineraryId: string,
        day: number,
        newHotelData: Hotel
    ): Promise<ApiResponse<Itinerary>> {
        return this.request<Itinerary>(`/itineraries/${itineraryId}/swap-hotel`, {
            method: 'POST',
            body: JSON.stringify({ day, newHotelData }),
        });
    }

    async addActivity(
        itineraryId: string,
        day: number,
        activityData: Activity,
        timeSlot?: string
    ): Promise<ApiResponse<Itinerary>> {
        return this.request<Itinerary>(`/itineraries/${itineraryId}/add-activity`, {
            method: 'POST',
            body: JSON.stringify({ day, activityData, timeSlot }),
        });
    }

    async removeActivity(
        itineraryId: string,
        day: number,
        activityIndex: number
    ): Promise<ApiResponse<Itinerary>> {
        return this.request<Itinerary>(`/itineraries/${itineraryId}/remove-activity`, {
            method: 'POST',
            body: JSON.stringify({ day, activityIndex }),
        });
    }

    async getPricing(itineraryId: string): Promise<ApiResponse<any>> {
        return this.request(`/itineraries/${itineraryId}/pricing`);
    }

    // Get available options
    async getAvailableHotels(city: string): Promise<ApiResponse<Hotel[]>> {
        return this.request<Hotel[]>(`/itineraries/hotels/available?city=${encodeURIComponent(city)}`);
    }

    async getAvailableActivities(city: string, mood?: string): Promise<ApiResponse<Activity[]>> {
        const moodParam = mood ? `&mood=${encodeURIComponent(mood)}` : '';
        return this.request<Activity[]>(`/itineraries/activities/available?city=${encodeURIComponent(city)}${moodParam}`);
    }

    // Destinations
    async getTrendingDestinations(): Promise<ApiResponse<Destination[]>> {
        return this.request<Destination[]>('/destinations/trending');
    }

    // Health check
    async healthCheck(): Promise<ApiResponse<any>> {
        return this.request('/health');
    }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
