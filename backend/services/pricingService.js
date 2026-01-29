import { calculateFlightPrice } from '../utils/mockData.js';

class PricingService {
    /**
     * Calculate total pricing for an itinerary
     * @param {Object} itineraryData - Itinerary object with dailyPlans
     * @param {String} departureCity - City of departure for flights
     * @returns {Object} Pricing breakdown
     */
    calculateTotalPrice(itineraryData, departureCity = 'New York') {
        const pricing = {
            flights: 0,
            hotels: 0,
            activities: 0,
            total: 0
        };

        // Calculate flight price (round trip)
        if (itineraryData.destination) {
            pricing.flights = this.calculateFlights(
                departureCity,
                itineraryData.destination.city,
                itineraryData.travelCompanion
            );
        }

        // Calculate hotel prices
        if (itineraryData.dailyPlans && itineraryData.dailyPlans.length > 0) {
            pricing.hotels = this.calculateHotels(itineraryData.dailyPlans);
            pricing.activities = this.calculateActivities(itineraryData.dailyPlans);
        }

        pricing.total = pricing.flights + pricing.hotels + pricing.activities;

        return pricing;
    }

    /**
     * Calculate flight costs
     */
    calculateFlights(departureCity, destinationCity, travelCompanion) {
        const basePricePerPerson = calculateFlightPrice(departureCity, destinationCity);

        // Multiply by number of travelers
        const travelers = this.getTravelerCount(travelCompanion);

        // Round trip
        return basePricePerPerson * 2 * travelers;
    }

    /**
     * Calculate total hotel costs
     */
    calculateHotels(dailyPlans) {
        let total = 0;

        dailyPlans.forEach(day => {
            if (day.hotel && day.hotel.pricePerNight) {
                total += day.hotel.pricePerNight;
            }
        });

        return total;
    }

    /**
     * Calculate total activity costs
     */
    calculateActivities(dailyPlans) {
        let total = 0;

        dailyPlans.forEach(day => {
            if (day.activities && day.activities.length > 0) {
                day.activities.forEach(activityItem => {
                    if (activityItem.activity && activityItem.activity.price) {
                        total += activityItem.activity.price;
                    }
                });
            }
        });

        return total;
    }

    /**
     * Get number of travelers based on companion type
     */
    getTravelerCount(travelCompanion) {
        const travelerMap = {
            'solo': 1,
            'couple': 2,
            'family': 4,
            'friends': 3
        };

        return travelerMap[travelCompanion] || 1;
    }

    /**
     * Calculate price difference when swapping items
     */
    calculatePriceDifference(oldItem, newItem, itemType) {
        if (itemType === 'hotel') {
            return (newItem.pricePerNight || 0) - (oldItem.pricePerNight || 0);
        } else if (itemType === 'activity') {
            return (newItem.price || 0) - (oldItem.price || 0);
        }
        return 0;
    }
}

export default new PricingService();
