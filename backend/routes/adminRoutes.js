import express from 'express';
import {
    getDashboardStats,
    getAllUsers, getUserById, updateUser, deleteUser,
    getAllPackages, getPackageById, createPackage, updatePackage, deletePackage,
    getAllOrders, getOrderById, updateOrderStatus,
    getAllPayments, getPaymentById
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, isAdmin);

// Dashboard
router.get('/stats', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Packages
router.get('/packages', getAllPackages);
router.post('/packages', createPackage);
router.get('/packages/:id', getPackageById);
router.put('/packages/:id', updatePackage);
router.delete('/packages/:id', deletePackage);

// Orders
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatus);

// Payments
router.get('/payments', getAllPayments);
router.get('/payments/:id', getPaymentById);

export default router;
