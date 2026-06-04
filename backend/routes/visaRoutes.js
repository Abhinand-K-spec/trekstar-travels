import express from 'express';
import {
    applyForVisa,
    getMyVisaApplications,
    getVisaApplicationById,
    evaluateVisaEligibility,
    adminGetAllVisaApplications,
    adminUpdateVisaApplication
} from '../controllers/visaController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public point evaluation route (like Y-Axis quick eligibility checker)
router.post('/evaluate', evaluateVisaEligibility);

// Protected user routes
router.post('/apply', protect, applyForVisa);
router.get('/my-applications', protect, getMyVisaApplications);
router.get('/application/:id', protect, getVisaApplicationById);

// Admin-only management routes
router.get('/admin/applications', protect, isAdmin, adminGetAllVisaApplications);
router.put('/admin/applications/:id', protect, isAdmin, adminUpdateVisaApplication);

export default router;
