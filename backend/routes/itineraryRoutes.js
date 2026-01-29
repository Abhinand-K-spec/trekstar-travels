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
    getAvailableActivities
} from '../controllers/itineraryController.js';

const router = express.Router();

// Itinerary routes
router.post('/', createItinerary);
router.get('/:id', getItinerary);
router.put('/:id', updateItinerary);

// Hotel management
router.post('/:id/swap-hotel', swapHotel);
router.get('/hotels/available', getAvailableHotels);

// Activity management
router.post('/:id/add-activity', addActivity);
router.post('/:id/remove-activity', removeActivity);
router.get('/activities/available', getAvailableActivities);

// Pricing
router.get('/:id/pricing', getPricing);

export default router;
