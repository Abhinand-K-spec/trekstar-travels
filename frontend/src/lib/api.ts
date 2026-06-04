// API client for making requests to the backend

import { Itinerary, ApiResponse, Destination, Hotel, Activity } from '@/types/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

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
            // Use separate token keys so admin and user sessions don't interfere
            const isAdminEndpoint = endpoint.startsWith('/admin');
            const tokenKey = isAdminEndpoint ? 'admin_token' : 'token';
            const token = typeof window !== 'undefined' ? localStorage.getItem(tokenKey) : null;
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'bypass-tunnel-reminder': 'true',
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

    // ─── Itinerary endpoints ───────────────────────────────────────────────────

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

    async swapHotel(itineraryId: string, day: number, newHotelData: Hotel): Promise<ApiResponse<Itinerary>> {
        return this.request<Itinerary>(`/itineraries/${itineraryId}/swap-hotel`, {
            method: 'POST',
            body: JSON.stringify({ day, newHotelData }),
        });
    }

    async addActivity(itineraryId: string, day: number, activityData: Activity, timeSlot?: string): Promise<ApiResponse<Itinerary>> {
        return this.request<Itinerary>(`/itineraries/${itineraryId}/add-activity`, {
            method: 'POST',
            body: JSON.stringify({ day, activityData, timeSlot }),
        });
    }

    async removeActivity(itineraryId: string, day: number, activityIndex: number): Promise<ApiResponse<Itinerary>> {
        return this.request<Itinerary>(`/itineraries/${itineraryId}/remove-activity`, {
            method: 'POST',
            body: JSON.stringify({ day, activityIndex }),
        });
    }

    async getPricing(itineraryId: string): Promise<ApiResponse<any>> {
        return this.request(`/itineraries/${itineraryId}/pricing`);
    }

    async getAvailableHotels(city: string): Promise<ApiResponse<Hotel[]>> {
        return this.request<Hotel[]>(`/itineraries/hotels/available?city=${encodeURIComponent(city)}`);
    }

    async getAvailableActivities(city: string, mood?: string): Promise<ApiResponse<Activity[]>> {
        const moodParam = mood ? `&mood=${encodeURIComponent(mood)}` : '';
        return this.request<Activity[]>(`/itineraries/activities/available?city=${encodeURIComponent(city)}${moodParam}`);
    }

    async getMyItineraries(): Promise<ApiResponse<Itinerary[]>> {
        return this.request<Itinerary[]>('/itineraries/my-packages');
    }

    // ─── Destinations ──────────────────────────────────────────────────────────

    async getTrendingDestinations(): Promise<ApiResponse<Destination[]>> {
        return this.request<Destination[]>('/destinations/trending');
    }

    // ─── Visa Services ─────────────────────────────────────────────────────────

    async applyForVisa(visaData: any): Promise<ApiResponse<any>> {
        return this.request<any>('/visa/apply', {
            method: 'POST',
            body: JSON.stringify(visaData),
        });
    }

    async getMyVisaApplications(): Promise<ApiResponse<any[]>> {
        return this.request<any[]>('/visa/my-applications');
    }

    async getVisaApplication(id: string): Promise<ApiResponse<any>> {
        return this.request<any>(`/visa/application/${id}`);
    }

    async evaluateVisa(evaluationData: any): Promise<ApiResponse<any>> {
        return this.request<any>('/visa/evaluate', {
            method: 'POST',
            body: JSON.stringify(evaluationData),
        });
    }

    async adminGetVisaApplications(params?: { status?: string; search?: string }): Promise<ApiResponse<any[]>> {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.search) queryParams.append('search', params.search);
        const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return this.request<any[]>(`/visa/admin/applications${queryStr}`);
    }

    async adminUpdateVisaApplication(id: string, statusData: { status: string; timelineNote?: string }): Promise<ApiResponse<any>> {
        return this.request<any>(`/visa/admin/applications/${id}`, {
            method: 'PUT',
            body: JSON.stringify(statusData),
        });
    }

    // ─── Health check ──────────────────────────────────────────────────────────

    async healthCheck(): Promise<ApiResponse<any>> {
        return this.request('/health');
    }

    // ─── Admin - Dashboard ─────────────────────────────────────────────────────

    async adminGetStats(): Promise<ApiResponse<any>> {
        return this.request('/admin/stats');
    }

    // ─── Admin - Users ─────────────────────────────────────────────────────────

    async adminGetUsers(params?: { search?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> {
        const query = params ? new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))).toString() : '';
        return this.request(`/admin/users${query ? `?${query}` : ''}`);
    }

    async adminGetUser(id: string): Promise<ApiResponse<any>> {
        return this.request(`/admin/users/${id}`);
    }

    async adminUpdateUser(id: string, data: any): Promise<ApiResponse<any>> {
        return this.request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    }

    async adminDeleteUser(id: string): Promise<ApiResponse<any>> {
        return this.request(`/admin/users/${id}`, { method: 'DELETE' });
    }

    // ─── Admin - Packages ──────────────────────────────────────────────────────

    async adminGetPackages(params?: { search?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> {
        const query = params ? new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))).toString() : '';
        return this.request(`/admin/packages${query ? `?${query}` : ''}`);
    }

    async adminGetPackage(id: string): Promise<ApiResponse<any>> {
        return this.request(`/admin/packages/${id}`);
    }

    async adminCreatePackage(data: any): Promise<ApiResponse<any>> {
        return this.request('/admin/packages', { method: 'POST', body: JSON.stringify(data) });
    }

    async adminUpdatePackage(id: string, data: any): Promise<ApiResponse<any>> {
        return this.request(`/admin/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    }

    async adminDeletePackage(id: string): Promise<ApiResponse<any>> {
        return this.request(`/admin/packages/${id}`, { method: 'DELETE' });
    }

    // ─── Admin - Orders ────────────────────────────────────────────────────────

    async adminGetOrders(params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> {
        const query = params ? new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))).toString() : '';
        return this.request(`/admin/orders${query ? `?${query}` : ''}`);
    }

    async adminGetOrder(id: string): Promise<ApiResponse<any>> {
        return this.request(`/admin/orders/${id}`);
    }

    async adminUpdateOrderStatus(id: string, status: string): Promise<ApiResponse<any>> {
        return this.request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    }

    // ─── Admin - Payments ──────────────────────────────────────────────────────

    async adminGetPayments(params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> {
        const query = params ? new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))).toString() : '';
        return this.request(`/admin/payments${query ? `?${query}` : ''}`);
    }

    async adminGetPayment(id: string): Promise<ApiResponse<any>> {
        return this.request(`/admin/payments/${id}`);
    }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
