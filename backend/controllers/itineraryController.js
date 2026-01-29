import Itinerary from '../models/Itinerary.js';
import Hotel from '../models/Hotel.js';
import Activity from '../models/Activity.js';
import pricingService from '../services/pricingService.js';
import { generateMockHotels, generateMockActivities } from '../utils/mockData.js';

// Create a new itinerary
export const createItinerary = async (req, res) => {
    try {
        const {
            destination,
            travelMonth,
            duration,
            travelCompanion,
            travelMood,
            budget,
            departureCity
        } = req.body;

        // Validate required fields
        if (!destination || !destination.city || !travelMonth || !duration || !travelCompanion || !travelMood) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Generate daily plans based on duration
        const dailyPlans = [];
        const mockHotels = generateMockHotels(destination.city);
        const mockActivities = generateMockActivities(destination.city, travelMood);

        for (let day = 1; day <= duration; day++) {
            // Select hotel (alternate between available options)
            const hotelData = mockHotels[day % mockHotels.length];

            // Select 2-3 activities per day based on travel mood
            const dayActivities = [];
            const numActivities = day === 1 || day === duration ? 2 : 3; // Lighter schedule on first and last day

            for (let i = 0; i < numActivities && i < mockActivities.length; i++) {
                const activityIndex = (day * 3 + i) % mockActivities.length;
                dayActivities.push({
                    activity: mockActivities[activityIndex],
                    order: i + 1,
                    timeSlot: i === 0 ? 'Morning' : i === 1 ? 'Afternoon' : 'Evening'
                });
            }

            dailyPlans.push({
                day,
                title: day === 1 ? 'Arrival & Leisure' : day === duration ? 'Departure Day' : `Explore ${destination.city}`,
                hotel: hotelData,
                activities: dayActivities,
                notes: ''
            });
        }

        // Create itinerary object
        const itineraryData = {
            destination,
            travelMonth,
            duration,
            travelCompanion,
            travelMood,
            budget: budget || { min: 1000, max: 5000, currency: 'USD' },
            departureCity: departureCity || 'New York',
            dailyPlans,
            status: 'draft'
        };

        // Calculate pricing
        const pricing = pricingService.calculateTotalPrice(itineraryData, departureCity);
        itineraryData.pricing = pricing;

        // Create and save itinerary
        const itinerary = new Itinerary(itineraryData);
        await itinerary.save();

        res.status(201).json({
            success: true,
            data: itinerary
        });
    } catch (error) {
        console.error('Error creating itinerary:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating itinerary',
            error: error.message
        });
    }
};

// Get itinerary by ID
export const getItinerary = async (req, res) => {
    try {
        const { id } = req.params;

        const itinerary = await Itinerary.findById(id);

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: 'Itinerary not found'
            });
        }

        res.status(200).json({
            success: true,
            data: itinerary
        });
    } catch (error) {
        console.error('Error fetching itinerary:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching itinerary',
            error: error.message
        });
    }
};

// Update itinerary
export const updateItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const itinerary = await Itinerary.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: 'Itinerary not found'
            });
        }

        // Recalculate pricing if daily plans changed
        if (updates.dailyPlans) {
            const pricing = pricingService.calculateTotalPrice(itinerary, itinerary.departureCity);
            itinerary.pricing = pricing;
            await itinerary.save();
        }

        res.status(200).json({
            success: true,
            data: itinerary
        });
    } catch (error) {
        console.error('Error updating itinerary:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating itinerary',
            error: error.message
        });
    }
};

// Swap hotel for a specific day
export const swapHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const { day, newHotelData } = req.body;

        if (!day || !newHotelData) {
            return res.status(400).json({
                success: false,
                message: 'Day and new hotel data are required'
            });
        }

        const itinerary = await Itinerary.findById(id);

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: 'Itinerary not found'
            });
        }

        // Find the day to update
        const dayPlan = itinerary.dailyPlans.find(plan => plan.day === day);

        if (!dayPlan) {
            return res.status(404).json({
                success: false,
                message: 'Day not found in itinerary'
            });
        }

        // Update the hotel
        const oldHotel = dayPlan.hotel;
        dayPlan.hotel = newHotelData;

        // Recalculate pricing
        const pricing = pricingService.calculateTotalPrice(itinerary, itinerary.departureCity);
        itinerary.pricing = pricing;

        await itinerary.save();

        res.status(200).json({
            success: true,
            data: itinerary,
            priceDifference: pricingService.calculatePriceDifference(oldHotel, newHotelData, 'hotel')
        });
    } catch (error) {
        console.error('Error swapping hotel:', error);
        res.status(500).json({
            success: false,
            message: 'Error swapping hotel',
            error: error.message
        });
    }
};

// Add activity to a day
export const addActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { day, activityData, timeSlot } = req.body;

        if (!day || !activityData) {
            return res.status(400).json({
                success: false,
                message: 'Day and activity data are required'
            });
        }

        const itinerary = await Itinerary.findById(id);

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: 'Itinerary not found'
            });
        }

        // Find the day to update
        const dayPlan = itinerary.dailyPlans.find(plan => plan.day === day);

        if (!dayPlan) {
            return res.status(404).json({
                success: false,
                message: 'Day not found in itinerary'
            });
        }

        // Add the activity
        const newActivity = {
            activity: activityData,
            order: dayPlan.activities.length + 1,
            timeSlot: timeSlot || 'Flexible'
        };

        dayPlan.activities.push(newActivity);

        // Recalculate pricing
        const pricing = pricingService.calculateTotalPrice(itinerary, itinerary.departureCity);
        itinerary.pricing = pricing;

        await itinerary.save();

        res.status(200).json({
            success: true,
            data: itinerary,
            priceIncrease: activityData.price
        });
    } catch (error) {
        console.error('Error adding activity:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding activity',
            error: error.message
        });
    }
};

// Remove activity from a day
export const removeActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { day, activityIndex } = req.body;

        if (!day || activityIndex === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Day and activity index are required'
            });
        }

        const itinerary = await Itinerary.findById(id);

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: 'Itinerary not found'
            });
        }

        // Find the day to update
        const dayPlan = itinerary.dailyPlans.find(plan => plan.day === day);

        if (!dayPlan) {
            return res.status(404).json({
                success: false,
                message: 'Day not found in itinerary'
            });
        }

        if (activityIndex >= dayPlan.activities.length) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        // Get the activity price before removing
        const removedActivity = dayPlan.activities[activityIndex];
        const priceDecrease = removedActivity.activity.price || 0;

        // Remove the activity
        dayPlan.activities.splice(activityIndex, 1);

        // Reorder remaining activities
        dayPlan.activities.forEach((act, index) => {
            act.order = index + 1;
        });

        // Recalculate pricing
        const pricing = pricingService.calculateTotalPrice(itinerary, itinerary.departureCity);
        itinerary.pricing = pricing;

        await itinerary.save();

        res.status(200).json({
            success: true,
            data: itinerary,
            priceDecrease
        });
    } catch (error) {
        console.error('Error removing activity:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing activity',
            error: error.message
        });
    }
};

// Get pricing for an itinerary
export const getPricing = async (req, res) => {
    try {
        const { id } = req.params;

        const itinerary = await Itinerary.findById(id);

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: 'Itinerary not found'
            });
        }

        // Recalculate pricing to ensure it's up to date
        const pricing = pricingService.calculateTotalPrice(itinerary, itinerary.departureCity);

        res.status(200).json({
            success: true,
            data: pricing
        });
    } catch (error) {
        console.error('Error fetching pricing:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pricing',
            error: error.message
        });
    }
};

// Get available hotels for swapping
export const getAvailableHotels = async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({
                success: false,
                message: 'City parameter is required'
            });
        }

        const hotels = generateMockHotels(city);

        res.status(200).json({
            success: true,
            data: hotels
        });
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hotels',
            error: error.message
        });
    }
};

// Get available activities
export const getAvailableActivities = async (req, res) => {
    try {
        const { city, mood } = req.query;

        if (!city) {
            return res.status(400).json({
                success: false,
                message: 'City parameter is required'
            });
        }

        const activities = generateMockActivities(city, mood);

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching activities',
            error: error.message
        });
    }
};
