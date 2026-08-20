import express from 'express';
import {
    createItinerary,
    getItinerary,
    updateItinerary,
    swapHotel,
    addActivity,
    removeActivity,
    getPricing,
    getAvailableHotels,
    getAvailableActivities,
    getMyItineraries
} from '../controllers/itineraryController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Itinerary routes
router.post('/', optionalProtect, createItinerary);
router.get('/my-packages', protect, getMyItineraries);
router.get('/:id', getItinerary);
router.put('/:id', optionalProtect, updateItinerary);

// Hotel management
router.post('/:id/swap-hotel', optionalProtect, swapHotel);
router.get('/hotels/available', getAvailableHotels);

// Activity management
router.post('/:id/add-activity', optionalProtect, addActivity);
router.post('/:id/remove-activity', optionalProtect, removeActivity);
router.get('/activities/available', getAvailableActivities);

// Pricing
router.get('/:id/pricing', optionalProtect, getPricing);

export default router;
