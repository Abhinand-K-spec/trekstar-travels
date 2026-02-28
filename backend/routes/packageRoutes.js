import express from 'express';
import Package from '../models/Package.js';

const router = express.Router();

// GET /api/packages — public list of active packages
router.get('/', async (req, res) => {
    try {
        const { mood, companion, search } = req.query;
        const query = { isActive: true };
        if (mood) query.travelMood = mood;
        if (companion && companion !== 'all') query.travelCompanion = { $in: [companion, 'all'] };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { 'destination.city': { $regex: search, $options: 'i' } }
            ];
        }

        const packages = await Package.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: packages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching packages' });
    }
});

// GET /api/packages/:id — public package detail
router.get('/:id', async (req, res) => {
    try {
        const pkg = await Package.findOne({ _id: req.params.id, isActive: true });
        if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
        res.status(200).json({ success: true, data: pkg });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching package' });
    }
});

export default router;
