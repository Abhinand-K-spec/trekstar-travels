import User from '../models/User.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Package from '../models/Package.js';
import Itinerary from '../models/Itinerary.js';

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export const getDashboardStats = async (req, res) => {
    try {
        const [userCount, packageCount, orderCount, payments] = await Promise.all([
            User.countDocuments({ role: { $ne: 'admin' } }),
            Package.countDocuments(),
            Order.countDocuments(),
            Payment.find({ status: 'paid' }).select('amount')
        ]);

        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .populate('package', 'title');

        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                userCount,
                packageCount,
                orderCount,
                totalRevenue,
                recentOrders,
                ordersByStatus
            }
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching dashboard stats' });
    }
};

// ─── Users ───────────────────────────────────────────────────────────────────

export const getAllUsers = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const query = search
            ? { role: { $ne: 'admin' }, $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
            : { role: { $ne: 'admin' } };

        const [users, total] = await Promise.all([
            User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            User.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: users,
            pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const orders = await Order.find({ user: req.params.id })
            .populate('package', 'title destination price')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: { user, orders } });
    } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching user' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
};

// ─── Packages ────────────────────────────────────────────────────────────────

export const getAllPackages = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const query = search
            ? { $or: [{ title: { $regex: search, $options: 'i' } }, { 'destination.city': { $regex: search, $options: 'i' } }] }
            : {};

        const [packages, total] = await Promise.all([
            Package.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            Package.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: packages,
            pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        console.error('Get Packages Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching packages' });
    }
};

export const getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
        res.status(200).json({ success: true, data: pkg });
    } catch (error) {
        console.error('Get Package Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching package' });
    }
};

export const createPackage = async (req, res) => {
    try {
        const pkg = await Package.create(req.body);
        res.status(201).json({ success: true, data: pkg });
    } catch (error) {
        console.error('Create Package Error:', error);
        res.status(500).json({ success: false, message: 'Error creating package', error: error.message });
    }
};

export const updatePackage = async (req, res) => {
    try {
        const pkg = await Package.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
        res.status(200).json({ success: true, data: pkg });
    } catch (error) {
        console.error('Update Package Error:', error);
        res.status(500).json({ success: false, message: 'Error updating package' });
    }
};

export const deletePackage = async (req, res) => {
    try {
        const pkg = await Package.findByIdAndDelete(req.params.id);
        if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
        res.status(200).json({ success: true, message: 'Package deleted successfully' });
    } catch (error) {
        console.error('Delete Package Error:', error);
        res.status(500).json({ success: false, message: 'Error deleting package' });
    }
};

// ─── Orders ──────────────────────────────────────────────────────────────────

export const getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const query = status ? { status } : {};

        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate('user', 'name email phone')
                .populate('package', 'title destination price')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Order.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: orders,
            pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        console.error('Get Orders Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching orders' });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('package')
            .populate('itinerary')
            .populate({
                path: 'paymentId',
                model: 'Payment'
            });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching order' });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        ).populate('user', 'name email');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Update Order Error:', error);
        res.status(500).json({ success: false, message: 'Error updating order' });
    }
};

// ─── Payments ────────────────────────────────────────────────────────────────

export const getAllPayments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const query = status ? { status } : {};

        const [payments, total] = await Promise.all([
            Payment.find(query)
                .populate('user', 'name email')
                .populate({ path: 'order', populate: { path: 'package', select: 'title' } })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Payment.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: payments,
            pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) }
        });
    } catch (error) {
        console.error('Get Payments Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching payments' });
    }
};

export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate({ path: 'order', populate: { path: 'package', select: 'title destination' } });
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        console.error('Get Payment Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching payment' });
    }
};
